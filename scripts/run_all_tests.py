#!/usr/bin/env python3
"""
====================================================================
PRIJIVA TEST RUNNER (scripts/run_all_tests.py)
Executes all automated verification suites in order and provides
an aggregate status report and exit code.
====================================================================
"""

import os
import sys
import subprocess
import time

TEST_SCRIPTS = [
    ("Admin & RBAC Security Verification", "verify_admin_security.py"),
    ("Cloudflare Worker & Upload Security", "verify_worker_security.py"),
    ("Static Assets & Endpoints (HTTP 200)", "verify_assets.py"),
    ("About Page Redesign & Brand Semantics", "verify_about_redesign.py"),
    ("Our Work Showcase & Gallery Lightbox", "verify_our_work.py"),
]

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print("=" * 70)
    print("  PRIJIVA AUTOMATED TEST SUITE RUNNER")
    print(f"  Root Directory: {root_dir}")
    print(f"  Timestamp: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)

    results = []
    total_start = time.time()

    for name, script_name in TEST_SCRIPTS:
        script_path = os.path.join(root_dir, script_name)
        print(f"\n>> Running: {name} ({script_name})...")
        print("-" * 70)

        if not os.path.exists(script_path):
            print(f"[FAIL] Script not found: {script_path}")
            results.append((name, script_name, False, "File Not Found", 0))
            continue

        start_time = time.time()
        try:
            proc = subprocess.run(
                [sys.executable, script_path],
                cwd=root_dir,
                capture_output=True,
                text=True,
                timeout=30
            )
            elapsed = time.time() - start_time
            passed = (proc.returncode == 0)

            # Print stdout & stderr
            if proc.stdout.strip():
                print(proc.stdout.strip())
            if proc.stderr.strip():
                print(proc.stderr.strip(), file=sys.stderr)

            status_str = "PASSED" if passed else f"FAILED (Exit {proc.returncode})"
            print(f">> {name}: {status_str} in {elapsed:.2f}s")
            results.append((name, script_name, passed, status_str, elapsed))

        except subprocess.TimeoutExpired:
            elapsed = time.time() - start_time
            print(f"[FAIL] {name} timed out after 30 seconds.")
            results.append((name, script_name, False, "Timed Out", elapsed))
        except Exception as e:
            elapsed = time.time() - start_time
            print(f"[FAIL] Execution error: {e}")
            results.append((name, script_name, False, str(e), elapsed))

    total_elapsed = time.time() - total_start
    print("\n" + "=" * 70)
    print("  FINAL TEST EXECUTION SUMMARY")
    print("=" * 70)

    all_passed = True
    for name, script_name, passed, status_str, elapsed in results:
        badge = "[ PASS ]" if passed else "[ FAIL ]"
        print(f"  {badge} {name:<42} ({elapsed:.2f}s)")
        if not passed:
            all_passed = False

    print("-" * 70)
    total_passed = sum(1 for _, _, p, _, _ in results if p)
    print(f"  Total Suites Run: {len(results)} | Passed: {total_passed} | Failed: {len(results) - total_passed}")
    print(f"  Total Duration:   {total_elapsed:.2f} seconds")
    print("=" * 70)

    if all_passed:
        print("\n>> All test suites PASSED successfully!\n")
        return 0
    else:
        print("\n>> One or more test suites FAILED. Check output above for details.\n")
        return 1

if __name__ == "__main__":
    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8', errors='replace')
            sys.stderr.reconfigure(encoding='utf-8', errors='replace')
        except Exception:
            pass
    sys.exit(main())
