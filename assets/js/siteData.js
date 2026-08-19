/**
 * ====================================================================
 * PRIJIVA - CENTRALIZED DATA STORE (SITE_DATA)
 * Single source of truth for all editable content:
 * Organization Info, Impact Metrics, Ground Events, Action Pillars,
 * Governing Body, Organizing Body Departments, and Civic Pledges.
 * ====================================================================
 */

const SITE_DATA = {
  // Organization Metadata & Headquarters Contact
  organization: {
    name: "PriJiva",
    tagline: "Making the World Civically Abled",
    shortDescription: "A dynamic, youth-led civic movement empowering Gen Z and students to build cleaner, safer, and more respectful public spaces.",
    foundedYear: "2024",
    hqLocation: "Bengaluru, Karnataka, India",
    contactEmail: "hello@prijiva.org",
    contactPhone: "+91 98765 43210",
    brandMeaning: {
      headline: "What PriJiva Means",
      pri: "Prithvi (Earth)",
      jiva: "Life",
      explanation: "PriJiva brings together Prithvi—Earth—and Jiva—Life. It reflects our belief that caring for the places we live in is inseparable from caring for life itself. Through youth-led civic action, PriJiva works toward communities that are more responsible, aware, and Civically Abled."
    },
    socials: {
      instagram: "https://instagram.com/prijiva_org",
      linkedin: "https://linkedin.com/company/prijiva",
      twitter: "https://twitter.com/prijiva_org",
      youtube: "https://youtube.com/@prijiva",
      whatsappCommunity: "https://chat.whatsapp.com/invite"
    }
  },

  // Key Impact Statistics (Home & Impact Pages)
  impactStats: [
    {
      id: "citizens-reached",
      targetNumber: 25000,
      suffix: "+",
      label: "Citizens Reached",
      description: "Directly engaged via street drives and workshops"
    },
    {
      id: "events-conducted",
      targetNumber: 65,
      suffix: "+",
      label: "Civic Drives Conducted",
      description: "Conducted across universities & transit hubs"
    },
    {
      id: "active-volunteers",
      targetNumber: 1200,
      suffix: "+",
      label: "Youth Volunteers",
      description: "Active student leads leading local actions"
    },
    {
      id: "campus-chapters",
      targetNumber: 18,
      suffix: "",
      label: "Campus Chapters",
      description: "Active university and high school civic pods"
    }
  ],

  // Action Pillars (Home Page)
  pillars: [
    {
      id: "pedestrian-first",
      title: "Pedestrian Rights & Crosswalk Safety",
      description: "Zebra crossing awareness, reclaiming footpaths, and creating safe walking corridors for children and seniors.",
      badge: "Street Action",
      icon: "🚶",
      learnMoreUrl: "impact-events.html?filter=Street Action"
    },
    {
      id: "noise-pollution",
      title: "No-Honking & Silence Zones",
      description: "Tackling noise pollution near hospitals, schools, and quiet neighborhoods through volunteer street engagement.",
      badge: "Acoustic Health",
      icon: "🔇",
      learnMoreUrl: "impact-events.html?filter=Civic Audit"
    },
    {
      id: "waste-cleanliness",
      title: "Waste Segregation & Clean Footprints",
      description: "Promoting 'Carry Your Trash Home' culture, anti-littering drives, and clean public transport hubs.",
      badge: "Environment",
      icon: "♻️",
      learnMoreUrl: "impact-events.html?filter=Environment & Waste"
    }
  ],

  // Featured Civic Drive (Home Page Hero Spotlight)
  featuredDrive: null,

  // Events & Drives Directory (Impact & Events Page)
  // Firestore is the live source of truth for all published civic drives.
  events: [],

  // Founder Information (About Us Page)
  founder: {
    name: "Poddutur Pavan Sai",
    role: "Founder & Executive Lead, PriJiva",
    photo: "assets/images/placeholders/founder-placeholder.svg",
    shortQuote: "“Civic sense is not an abstract theory in a textbook; it is the daily muscle memory of respecting the shared spaces we inherit together.”",
    bio: "Founded PriJiva while navigating everyday civic hurdles as a student. Believing that youth are not just future citizens but today's most energetic catalysts, they mobilized peers to move beyond passive online complaining into proactive, joyful, on-ground civic leadership.",
    messageHeadline: "Why We Created PriJiva",
    messageBody: [
      "We often look at broken footpaths, reckless driving, unsegregated garbage, or general apathy and ask: 'Why isn't someone fixing this?' At PriJiva, our answer is simple: We are that someone.",
      "PriJiva was born out of a realization that civic sense is an ability that can be learned, practiced, and celebrated. Just as we learn digital literacy or sports, civic literacy ('being Civically Abled') must become our second nature.",
      "Our team is 100% youth-powered. We bring vibrant energy, creative art, tech tools, and street-level optimism to make civic engagement cool, collaborative, and impossible to ignore."
    ]
  },

  // ====================================================================
  // 1. GOVERNING BODY (Leadership, Direction & Strategic Governance)
  // ====================================================================
  governingBody: {
    sectionIntro: "The Governing Body provides leadership, direction, accountability, and strategic coordination across PriJiva.",
    
    // Primary Leadership: Board / Secretary
    boardSecretary: {
      name: "Poddutur Pavan Sai",
      designation: "Board Secretary & Founder",
      photo: "assets/images/placeholders/founder-placeholder.svg",
      roleDescription: "Guides overall institutional vision, strategic priorities, and organizational governance.",
      bioSummary: "Student changemaker and founder of PriJiva, dedicated to turning everyday civic awareness into practical youth leadership.",
      email: "founder@prijiva.org",
      phone: "+91 98765 43210",
      linkedin: "https://linkedin.com/company/prijiva",
      leadershipMessage: "“Civic sense is not an abstract theory in a textbook; it is the daily muscle memory of respecting the shared spaces we inherit together.”"
    },

    // Five Secretariat Roles
    secretaries: [
      {
        id: "sec-exec",
        title: "Executive Secretary",
        name: "Secretariat Desk",
        photo: "assets/images/avatars/avatar-1.svg",
        roleDescription: "Supports executive decision-making, coordinates leadership priorities, and helps ensure the organization’s vision translates into action.",
        bioSummary: "Coordinates cross-functional milestones, supports strategic execution, and aligns executive deliverables.",
        email: "hello@prijiva.org",
        linkedin: "https://linkedin.com/company/prijiva"
      },
      {
        id: "sec-general",
        title: "General Secretary",
        name: "Secretariat Desk",
        photo: "assets/images/avatars/avatar-2.svg",
        roleDescription: "Oversees overall coordination, records, internal communication, and the smooth functioning of PriJiva’s governance processes.",
        bioSummary: "Manages organizational compliance, meeting records, formal documentation, and team communications.",
        email: "hello@prijiva.org",
        linkedin: "https://linkedin.com/company/prijiva"
      },
      {
        id: "sec-ops",
        title: "Operations Secretary",
        name: "Secretariat Desk",
        photo: "assets/images/avatars/avatar-3.svg",
        roleDescription: "Leads operational planning, resource coordination, timelines, and on-ground execution support.",
        bioSummary: "Oversees field safety protocols, equipment logistics, and execution timelines across regional drives.",
        email: "hello@prijiva.org",
        linkedin: "https://linkedin.com/company/prijiva"
      },
      {
        id: "sec-outreach",
        title: "Outreach & Partnerships Secretary",
        name: "Secretariat Desk",
        photo: "assets/images/avatars/avatar-1.svg",
        roleDescription: "Builds relationships with communities, educational institutions, partner organizations, and supporters.",
        bioSummary: "Leads strategic institutional partnerships, campus outreach networks, and civic alliance building.",
        email: "hello@prijiva.org",
        linkedin: "https://linkedin.com/company/prijiva"
      },
      {
        id: "sec-strategy",
        title: "Strategy & Communications Secretary",
        name: "Secretariat Desk",
        photo: "assets/images/avatars/avatar-2.svg",
        roleDescription: "Shapes PriJiva’s strategic direction, public communication, campaigns, and brand voice.",
        bioSummary: "Drives media advocacy roadmaps, public communications, and creative campaign messaging.",
        email: "hello@prijiva.org",
        linkedin: "https://linkedin.com/company/prijiva"
      }
    ]
  },

  // ====================================================================
  // 2. ORGANIZING BODY (Departmental Action & Specialised Teams)
  // ====================================================================
  organizingBody: {
    sectionIntro: "The Organizing Body turns PriJiva’s civic mission into meaningful action through specialised teams.",
    
    departments: [
      {
        id: "dept-events",
        departmentName: "Events Planning & Support",
        description: "Plans, coordinates, and supports PriJiva events, workshops, civic drives, volunteer schedules, and on-ground logistics.",
        tagColor: "teal",
        head: {
          name: "Department Coordination Desk",
          role: "Department Head",
          photo: "assets/images/avatars/avatar-1.svg",
          bio: "Oversees the event calendar, scheduling, safety protocols, and venue permissions.",
          email: "hello@prijiva.org",
          phone: "Contact via Desk",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        subHead: {
          name: "Operations Support Desk",
          role: "Department Sub-Head",
          photo: "assets/images/avatars/avatar-2.svg",
          bio: "Assists with drive-day coordination, volunteer rosters, and equipment setup.",
          email: "hello@prijiva.org",
          phone: "Contact via Desk",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        responsibilities: [
          "Annual and monthly civic drive calendars",
          "Volunteer scheduling, safety briefings, and permissions",
          "On-ground logistics, equipment, and crowd coordination"
        ]
      },
      {
        id: "dept-research",
        departmentName: "Documentation & Research",
        description: "Documents activities, maintains records, gathers civic research, tracks outcomes, and supports evidence-led initiatives.",
        tagColor: "indigo",
        head: {
          name: "Department Coordination Desk",
          role: "Department Head",
          photo: "assets/images/avatars/avatar-3.svg",
          bio: "Leads civic scorecards, survey methodologies, and data-backed reports.",
          email: "hello@prijiva.org",
          phone: "Contact via Desk",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        subHead: {
          name: "Operations Support Desk",
          role: "Department Sub-Head",
          photo: "assets/images/avatars/avatar-1.svg",
          bio: "Manages drive documentation archives and post-event analytics.",
          email: "hello@prijiva.org",
          phone: "Contact via Desk",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        responsibilities: [
          "Hyperlocal citizen audits & sound/traffic surveys",
          "Pre and post-drive outcome measurement reports",
          "Maintaining open-access public civic archives"
        ]
      },
      {
        id: "dept-tech",
        departmentName: "Technology",
        description: "Manages PriJiva’s website, digital tools, data systems, internal technology needs, and digital innovation.",
        tagColor: "pink",
        head: {
          name: "Department Coordination Desk",
          role: "Department Head",
          photo: "assets/images/avatars/avatar-2.svg",
          bio: "Directs web infrastructure, digital tools, and data platform development.",
          email: "hello@prijiva.org",
          phone: "Contact via Desk",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        subHead: {
          name: "Operations Support Desk",
          role: "Department Sub-Head",
          photo: "assets/images/avatars/avatar-3.svg",
          bio: "Maintains form integrations, site updates, and tech automations.",
          email: "hello@prijiva.org",
          phone: "Contact via Desk",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        responsibilities: [
          "Website architecture, accessibility, and updates",
          "Volunteer portal & registration database management",
          "Digital innovation and open civic technology tools"
        ]
      },
      {
        id: "dept-media",
        departmentName: "Content & Media",
        description: "Creates stories, graphics, videos, social-media content, campaign material, and media documentation.",
        tagColor: "lemon",
        head: {
          name: "Department Coordination Desk",
          role: "Department Head",
          photo: "assets/images/avatars/avatar-1.svg",
          bio: "Shapes PriJiva's creative visual voice, campaigns, and viral civic storytelling.",
          email: "hello@prijiva.org",
          phone: "Contact via Desk",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        subHead: {
          name: "Operations Support Desk",
          role: "Department Sub-Head",
          photo: "assets/images/avatars/avatar-2.svg",
          bio: "Coordinates ground photography, reels, and digital campaign collateral.",
          email: "hello@prijiva.org",
          phone: "Contact via Desk",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        responsibilities: [
          "Social media campaigns, reels, and civic infographics",
          "Street banners, posters, and campaign print collateral",
          "Live photo and video documentation of all drives"
        ]
      },
      {
        id: "dept-people",
        departmentName: "People Management",
        description: "Supports volunteer onboarding, member wellbeing, internal coordination, recognition, and team culture.",
        tagColor: "teal",
        head: {
          name: "Department Coordination Desk",
          role: "Department Head",
          photo: "assets/images/avatars/avatar-3.svg",
          bio: "Focuses on volunteer onboarding, community health, and student recognition.",
          email: "hello@prijiva.org",
          phone: "Contact via Desk",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        subHead: {
          name: "Operations Support Desk",
          role: "Department Sub-Head",
          photo: "assets/images/avatars/avatar-1.svg",
          bio: "Coordinates volunteer feedback, recognition awards, and chapter check-ins.",
          email: "hello@prijiva.org",
          phone: "Contact via Desk",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        responsibilities: [
          "Volunteer welcoming, training, and chapter orientation",
          "Volunteer certificates, badges, and recognition",
          "Nurturing an inclusive, positive youth culture"
        ]
      },
      {
        id: "dept-outreach",
        departmentName: "Outreach & Ground",
        description: "Builds community relationships, coordinates field engagement, conducts local outreach, and supports ground-level civic action.",
        tagColor: "indigo",
        head: {
          name: "Department Coordination Desk",
          role: "Department Head",
          photo: "assets/images/avatars/avatar-2.svg",
          bio: "Leads campus chapter expansion, resident alliances, and local outreach.",
          email: "hello@prijiva.org",
          phone: "Contact via Desk",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        subHead: {
          name: "Operations Support Desk",
          role: "Department Sub-Head",
          photo: "assets/images/avatars/avatar-3.svg",
          bio: "Liaises with student leaders and neighborhood welfare associations.",
          email: "hello@prijiva.org",
          phone: "Contact via Desk",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        responsibilities: [
          "Launching & supporting school/college campus chapters",
          "Resident Welfare Association (RWA) and ward engagement",
          "Neighborhood volunteer mobilization & local drives"
        ]
      }
    ]
  },

  // Directory mapping for Contact page
  get teams() {
    return this.organizingBody.departments.map(d => ({
      id: d.id,
      teamName: d.departmentName,
      leadName: d.head.name,
      role: d.head.role,
      email: d.head.email,
      phone: d.head.phone,
      badgeColor: d.tagColor,
      description: d.description,
      responsibilities: d.responsibilities
    }));
  },

  // Core Values (About Us Page)
  values: [
    {
      id: "val-1",
      number: "01",
      title: "Everyday Empathy",
      description: "We treat public spaces not as empty terrain, but as the shared living rooms of our communities."
    },
    {
      id: "val-2",
      number: "02",
      title: "Youth Dynamism",
      description: "We replace cynicism and complaints with vibrant energy, bright art, and tangible on-ground solutions."
    },
    {
      id: "val-3",
      number: "03",
      title: "Radical Inclusivity",
      description: "Streets belong to all—pedestrians, children, differently-abled citizens, and transit users alike."
    },
    {
      id: "val-4",
      number: "04",
      title: "Civic Literacy as a Muscle",
      description: "Civic habits are not rules to enforce through fear, but life skills practiced daily with joy."
    },
    {
      id: "val-5",
      number: "05",
      title: "Collaborative Accountability",
      description: "We partner constructively with civic authorities, local police, and resident welfare associations."
    }
  ],

  // Community Testimonials (Impact Page)
  testimonials: [],

  // Interactive Civic Pledges (Home Page Widget)
  civicPledges: [
    {
      id: "p1",
      category: "🚶 Pedestrian Care",
      title: "I will stop before zebra crossings & yield to pedestrians",
      icon: "🚶"
    },
    {
      id: "p2",
      category: "🔇 Acoustic Health",
      title: "I will not honk in traffic jams, near hospitals, or schools",
      icon: "🔇"
    },
    {
      id: "p3",
      category: "♻️ Clean Environment",
      title: "I will carry my trash home until I find a segregated bin",
      icon: "♻️"
    },
    {
      id: "p4",
      category: "🚌 Transit Courtesy",
      title: "I will let passengers exit first before boarding public transit",
      icon: "🚌"
    },
    {
      id: "p5",
      category: "🅿️ Public Order",
      title: "I will never park on pedestrian footpaths or blind corners",
      icon: "🅿️"
    },
    {
      id: "p6",
      category: "🌱 Civic Action",
      title: "I will volunteer at least 2 hours monthly with PriJiva drives",
      icon: "🌱"
    }
  ]
};

// Freeze data to prevent accidental modification at runtime
if (typeof Object.freeze === 'function') {
  Object.freeze(SITE_DATA);
}

// Window export for browser execution
window.SITE_DATA = SITE_DATA;
