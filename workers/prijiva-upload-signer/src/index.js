/**
 * ====================================================================
 * PRIJIVA UPLOAD SIGNER - CLOUDFLARE WORKER
 * Secure Cloudinary direct-upload parameter signer.
 * 
 * Verifies Firebase ID Tokens (RS256 via jose JWKS), checks active
 * Department Head / Owner status in Firestore, and generates short-lived
 * SHA-1 upload signatures for the 'prijiva-events' folder.
 * ====================================================================
 */

import { createRemoteJWKSet, jwtVerify } from "jose";

// Google's public JWK keyset for Firebase Auth ID token verification
const GOOGLE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigins = (env.ALLOWED_ORIGINS || "http://localhost:8080,https://prijiva.in,https://www.prijiva.in")
      .split(",")
      .map(o => o.trim().toLowerCase());

    const isOriginAllowed = origin && allowedOrigins.includes(origin.toLowerCase());
    const corsHeaders = {
      "Access-Control-Allow-Origin": isOriginAllowed ? origin : allowedOrigins[0],
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Max-Age": "86400"
    };

    // Handle CORS Preflight
    if (request.method === "OPTIONS") {
      if (!isOriginAllowed && origin) {
        return new Response("CORS origin not allowed", { status: 403, headers: { "Content-Type": "text/plain" } });
      }
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Enforce CORS on actual requests
    if (origin && !isOriginAllowed) {
      return jsonResponse({ error: "Forbidden: Origin not allowed" }, 403, corsHeaders);
    }

    const url = new URL(request.url);

    // Route matching: POST /sign-upload only
    if (url.pathname !== "/sign-upload") {
      return jsonResponse({ error: "Not Found: Invalid endpoint" }, 404, corsHeaders);
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method Not Allowed: Use POST /sign-upload" }, 405, corsHeaders);
    }

    try {
      // 1. Extract Bearer Token from Authorization Header
      const authHeader = request.headers.get("Authorization") || "";
      if (!authHeader.startsWith("Bearer ")) {
        return jsonResponse({ error: "Unauthorized: Missing or invalid Authorization Bearer header" }, 401, corsHeaders);
      }

      const idToken = authHeader.slice(7).trim();
      if (!idToken) {
        return jsonResponse({ error: "Unauthorized: Empty ID token provided" }, 401, corsHeaders);
      }

      const projectId = env.FIREBASE_PROJECT_ID || "prijiva-v3";
      const expectedIssuer = `https://securetoken.google.com/${projectId}`;

      // 2. Cryptographic JWT Verification using jose (RS256, Google JWKS, iss, aud, exp)
      let verifiedPayload;
      try {
        const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
          issuer: expectedIssuer,
          audience: projectId,
          algorithms: ["RS256"]
        });
        verifiedPayload = payload;
      } catch (jwtErr) {
        console.error("JWT verification failed:", jwtErr.message);
        return jsonResponse({ error: "Unauthorized: Invalid or expired Firebase ID token" }, 401, corsHeaders);
      }

      const uid = verifiedPayload.sub;
      if (!uid) {
        return jsonResponse({ error: "Unauthorized: Token missing subject identifier" }, 401, corsHeaders);
      }

      // 3. Query Firestore REST API for /admins/{uid} using the user's ID Token
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/admins/${encodeURIComponent(uid)}`;
      const firestoreRes = await fetch(firestoreUrl, {
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Accept": "application/json"
        }
      });

      if (!firestoreRes.ok) {
        return jsonResponse({ 
          error: "Forbidden: No approved admin record found in PriJiva directory. Contact the owner." 
        }, 403, corsHeaders);
      }

      const adminDoc = await firestoreRes.json();
      const fields = adminDoc.fields || {};

      const isActive = fields.active?.booleanValue === true;
      const role = fields.role?.stringValue || "";

      // 4. Strict Role & Active Status Authorization
      const allowedRoles = ["owner", "department_head"];
      if (!isActive || !allowedRoles.includes(role)) {
        return jsonResponse({ 
          error: "Forbidden: Account is inactive or does not possess approved Department Head/Owner permissions." 
        }, 403, corsHeaders);
      }

      // 5. Generate Cloudinary Upload Signature (SHA-1 only)
      const cloudName = env.CLOUDINARY_CLOUD_NAME;
      const apiKey = env.CLOUDINARY_API_KEY;
      const apiSecret = env.CLOUDINARY_API_SECRET;
      const folder = "prijiva-events";
      const timestamp = Math.floor(Date.now() / 1000);

      if (!cloudName || !apiKey || !apiSecret) {
        console.error("Missing Cloudinary server environment variables.");
        return jsonResponse({ error: "Internal Server Error: Cloudinary configuration incomplete on signer." }, 500, corsHeaders);
      }

      // Cloudinary signing string: parameters sorted alphabetically + API secret
      const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signatureHex = await sha1Hex(stringToSign);

      // 6. Return Safe Upload Parameters (Never expose API Secret)
      return jsonResponse({
        signature: signatureHex,
        timestamp,
        apiKey,
        cloudName,
        folder
      }, 200, corsHeaders);

    } catch (err) {
      console.error("Unhandled upload signer error:", err);
      return jsonResponse({ error: "Internal Server Error: Failed to generate upload signature." }, 500, corsHeaders);
    }
  }
};

/**
 * Helper: Compute SHA-1 Hex string using Web Crypto API
 */
async function sha1Hex(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Helper: Formats standard JSON responses with CORS headers
 */
function jsonResponse(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers
    }
  });
}
