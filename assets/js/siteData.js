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
    
    // Primary Leadership: Board / Founder
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

    // Six Governing Body Portfolios
    secretaries: [
      {
        id: "sec-general",
        title: "General Secretary",
        primaryLead: "Gayathri",
        associate: "Monika",
        name: "Gayathri & Monika",
        photo: "assets/images/avatars/avatar-1.svg",
        roleDescription: "Oversees organizational coordination, compliance, institutional records, and governance processes.",
        bioSummary: "Leads governance operations, organizational archives, compliance, and team alignment.",
        email: "general.secretary@prijiva.org",
        linkedin: "https://linkedin.com/company/prijiva"
      },
      {
        id: "sec-development",
        title: "Development Secretary",
        primaryLead: "Reethika",
        associate: "Raveena",
        name: "Reethika & Raveena",
        photo: "assets/images/avatars/avatar-2.svg",
        roleDescription: "Guides organizational growth, capacity building, and long-term developmental initiatives.",
        bioSummary: "Drives developmental projects, institutional capacity building, and chapter expansion.",
        email: "dev.secretary@prijiva.org",
        linkedin: "https://linkedin.com/company/prijiva"
      },
      {
        id: "sec-admin",
        title: "Administrative Secretary",
        primaryLead: "Bhargavi",
        associate: "Sreeman",
        name: "Bhargavi & Sreeman",
        photo: "assets/images/avatars/avatar-3.svg",
        roleDescription: "Manages administrative workflows, logistics coordination, and operational compliance.",
        bioSummary: "Ensures streamlined day-to-day administration, schedule adherence, and operational support.",
        email: "admin.secretary@prijiva.org",
        linkedin: "https://linkedin.com/company/prijiva"
      },
      {
        id: "sec-comm",
        title: "Communication Outreach",
        primaryLead: "Vaishnavi",
        associate: "Pranith",
        name: "Vaishnavi & Pranith",
        photo: "assets/images/avatars/avatar-1.svg",
        roleDescription: "Builds community relations, public engagement, and multi-channel civic outreach.",
        bioSummary: "Spearheads civic awareness communication, public relations, and youth network outreach.",
        email: "communication@prijiva.org",
        linkedin: "https://linkedin.com/company/prijiva"
      },
      {
        id: "sec-exec",
        title: "Executive Secretary",
        primaryLead: "Vamshika",
        associate: "Jeevana",
        name: "Vamshika & Jeevana",
        photo: "assets/images/avatars/avatar-2.svg",
        roleDescription: "Coordinates executive decision-making, strategic milestones, and leadership deliverables.",
        bioSummary: "Supports cross-functional strategic priorities and high-level organizational execution.",
        email: "exec.secretary@prijiva.org",
        linkedin: "https://linkedin.com/company/prijiva"
      },
      {
        id: "sec-finance",
        title: "Finance Secretary",
        primaryLead: "Chandana",
        associate: "Manisha",
        name: "Chandana & Manisha",
        photo: "assets/images/avatars/avatar-3.svg",
        roleDescription: "Manages financial planning, budget oversight, resource allocation, and fiscal reporting.",
        bioSummary: "Oversees transparent financial management, drive budgeting, and fiscal accountability.",
        email: "finance.secretary@prijiva.org",
        linkedin: "https://linkedin.com/company/prijiva"
      }
    ],

    // Twelve Individual Governing Body Member Name Cards
    members: [
      {
        id: "gb-gen-sec",
        role: "General Secretary",
        name: "Gayathri",
        category: "Primary Lead",
        photo: "assets/images/avatars/avatar-1.svg",
        roleDescription: "Oversees overall governance coordination, internal records, and team alignment.",
        email: "general.secretary@prijiva.org"
      },
      {
        id: "gb-assoc-gen-sec",
        role: "Associate General Secretary",
        name: "Monika",
        category: "Associate",
        photo: "assets/images/avatars/avatar-2.svg",
        roleDescription: "Supports governance operations, compliance, and official documentation.",
        email: "general.secretary@prijiva.org"
      },
      {
        id: "gb-dev-sec",
        role: "Development Secretary",
        name: "Reethika",
        category: "Primary Lead",
        photo: "assets/images/avatars/avatar-2.svg",
        roleDescription: "Guides organizational growth, capacity building, and long-term developmental initiatives.",
        email: "dev.secretary@prijiva.org"
      },
      {
        id: "gb-assoc-dev-sec",
        role: "Associate Development Secretary",
        name: "Raveena",
        category: "Associate",
        photo: "assets/images/avatars/avatar-3.svg",
        roleDescription: "Coordinates institutional scaling, chapter expansion, and developmental programs.",
        email: "dev.secretary@prijiva.org"
      },
      {
        id: "gb-admin-sec",
        role: "Administrative Secretary",
        name: "Bhargavi",
        category: "Primary Lead",
        photo: "assets/images/avatars/avatar-3.svg",
        roleDescription: "Manages administrative workflows, logistics coordination, and operational compliance.",
        email: "admin.secretary@prijiva.org"
      },
      {
        id: "gb-assoc-admin-sec",
        role: "Associate Administrative Secretary",
        name: "Sreeman",
        category: "Associate",
        photo: "assets/images/avatars/avatar-1.svg",
        roleDescription: "Supports day-to-day administrative schedules, internal workflows, and logistics.",
        email: "admin.secretary@prijiva.org"
      },
      {
        id: "gb-comm-outreach",
        role: "Communication Outreach Lead",
        name: "Vaishnavi",
        category: "Primary Lead",
        photo: "assets/images/avatars/avatar-1.svg",
        roleDescription: "Spearheads community relations, public engagement, and multi-channel civic campaigns.",
        email: "communication@prijiva.org"
      },
      {
        id: "gb-assoc-comm-outreach",
        role: "Associate Communication Outreach",
        name: "Pranith",
        category: "Associate",
        photo: "assets/images/avatars/avatar-2.svg",
        roleDescription: "Coordinates campus networks, media relations, and civic ambassador engagement.",
        email: "communication@prijiva.org"
      },
      {
        id: "gb-exec-sec",
        role: "Executive Secretary",
        name: "Vamshika",
        category: "Primary Lead",
        photo: "assets/images/avatars/avatar-2.svg",
        roleDescription: "Coordinates executive decision-making, strategic milestones, and leadership deliverables.",
        email: "exec.secretary@prijiva.org"
      },
      {
        id: "gb-assoc-exec-sec",
        role: "Associate Executive Secretary",
        name: "Jeevana",
        category: "Associate",
        photo: "assets/images/avatars/avatar-3.svg",
        roleDescription: "Assists with cross-functional milestones, leadership priorities, and executive execution.",
        email: "exec.secretary@prijiva.org"
      },
      {
        id: "gb-fin-sec",
        role: "Finance Secretary",
        name: "Chandana",
        category: "Primary Lead",
        photo: "assets/images/avatars/avatar-3.svg",
        roleDescription: "Manages financial planning, budget oversight, resource allocation, and fiscal reporting.",
        email: "finance.secretary@prijiva.org"
      },
      {
        id: "gb-assoc-fin-sec",
        role: "Associate Finance Secretary",
        name: "Manisha",
        category: "Associate",
        photo: "assets/images/avatars/avatar-1.svg",
        roleDescription: "Supports transparent financial auditing, drive budgeting, and fiscal accountability.",
        email: "finance.secretary@prijiva.org"
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
        id: "dept-media",
        departmentName: "Content Media",
        description: "Creates stories, graphics, videos, social-media content, campaign material, and media documentation.",
        tagColor: "lemon",
        members: ["Madhav", "Harish"],
        lead: {
          name: "Madhav",
          role: "Team Leader",
          photo: "assets/images/avatars/avatar-1.svg",
          bio: "Shapes PriJiva's creative visual voice, campaigns, and viral civic storytelling.",
          email: "media@prijiva.org",
          phone: "+91 98765 43210",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        associate: {
          name: "Harish",
          role: "Team Leader",
          photo: "assets/images/avatars/avatar-2.svg",
          bio: "Coordinates ground photography, reels, and digital campaign collateral.",
          email: "media@prijiva.org",
          phone: "+91 98765 43210",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        responsibilities: [
          "Social media campaigns, reels, and civic infographics",
          "Street banners, posters, and campaign print collateral",
          "Live photo and video documentation of all drives"
        ]
      },
      {
        id: "dept-documentation",
        departmentName: "Documentation",
        description: "Documents activities, maintains records, gathers civic research, tracks outcomes, and supports evidence-led initiatives.",
        tagColor: "indigo",
        members: ["Harini", "Alexander"],
        lead: {
          name: "Harini",
          role: "Team Leader",
          photo: "assets/images/avatars/avatar-3.svg",
          bio: "Leads civic scorecards, survey methodologies, and data-backed reports.",
          email: "documentation@prijiva.org",
          phone: "+91 98765 43210",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        associate: {
          name: "Alexander",
          role: "Team Leader",
          photo: "assets/images/avatars/avatar-1.svg",
          bio: "Manages drive documentation archives and post-event analytics.",
          email: "documentation@prijiva.org",
          phone: "+91 98765 43210",
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
        departmentName: "Tech",
        description: "Manages PriJiva’s website, digital tools, data systems, internal technology needs, and digital innovation.",
        tagColor: "pink",
        members: ["Prabhakar", "Navya"],
        lead: {
          name: "Prabhakar",
          role: "Team Leader",
          photo: "assets/images/avatars/avatar-2.svg",
          bio: "Directs web infrastructure, digital tools, and data platform development.",
          email: "tech@prijiva.org",
          phone: "+91 98765 43210",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        associate: {
          name: "Navya",
          role: "Team Leader",
          photo: "assets/images/avatars/avatar-3.svg",
          bio: "Maintains form integrations, site updates, and tech automations.",
          email: "tech@prijiva.org",
          phone: "+91 98765 43210",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        responsibilities: [
          "Website architecture, accessibility, and updates",
          "Volunteer portal & registration database management",
          "Digital innovation and open civic technology tools"
        ]
      },
      {
        id: "dept-events",
        departmentName: "Events Planning",
        description: "Plans, coordinates, and supports PriJiva events, workshops, civic drives, volunteer schedules, and on-ground logistics.",
        tagColor: "teal",
        members: ["Radha", "Akshay"],
        lead: {
          name: "Radha",
          role: "Team Leader",
          photo: "assets/images/avatars/avatar-1.svg",
          bio: "Oversees the event calendar, scheduling, safety protocols, and venue permissions.",
          email: "events@prijiva.org",
          phone: "+91 98765 43210",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        associate: {
          name: "Akshay",
          role: "Team Leader",
          photo: "assets/images/avatars/avatar-2.svg",
          bio: "Assists with drive-day coordination, volunteer rosters, and equipment setup.",
          email: "events@prijiva.org",
          phone: "+91 98765 43210",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        responsibilities: [
          "Annual and monthly civic drive calendars",
          "Volunteer scheduling, safety briefings, and permissions",
          "On-ground logistics, equipment, and crowd coordination"
        ]
      },
      {
        id: "dept-outreach",
        departmentName: "Outreach",
        description: "Builds community relationships, coordinates field engagement, conducts local outreach, and supports ground-level civic action.",
        tagColor: "indigo",
        members: ["Saraf", "Vinay"],
        lead: {
          name: "Saraf",
          role: "Team Leader",
          photo: "assets/images/avatars/avatar-2.svg",
          bio: "Leads campus chapter expansion, resident alliances, and local outreach.",
          email: "outreach@prijiva.org",
          phone: "+91 98765 43210",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        associate: {
          name: "Vinay",
          role: "Team Leader",
          photo: "assets/images/avatars/avatar-3.svg",
          bio: "Liaises with student leaders and neighborhood welfare associations.",
          email: "outreach@prijiva.org",
          phone: "+91 98765 43210",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        responsibilities: [
          "Launching & supporting school/college campus chapters",
          "Resident Welfare Association (RWA) and ward engagement",
          "Neighborhood volunteer mobilization & local drives"
        ]
      },
      {
        id: "dept-people",
        departmentName: "People Management",
        description: "Supports volunteer onboarding, member wellbeing, internal coordination, recognition, and team culture.",
        tagColor: "teal",
        members: ["Puneeth", "Vikranth"],
        lead: {
          name: "Puneeth",
          role: "Team Leader",
          photo: "assets/images/avatars/avatar-3.svg",
          bio: "Focuses on volunteer onboarding, community health, and student recognition.",
          email: "people@prijiva.org",
          phone: "+91 98765 43210",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        associate: {
          name: "Vikranth",
          role: "Team Leader",
          photo: "assets/images/avatars/avatar-1.svg",
          bio: "Coordinates volunteer feedback, recognition awards, and chapter check-ins.",
          email: "people@prijiva.org",
          phone: "+91 98765 43210",
          linkedin: "https://linkedin.com/company/prijiva"
        },
        responsibilities: [
          "Volunteer welcoming, training, and chapter orientation",
          "Volunteer certificates, badges, and recognition",
          "Nurturing an inclusive, positive youth culture"
        ]
      }
    ]
  },

  // Directory mapping for Contact page
  get teams() {
    return this.organizingBody.departments.map(d => ({
      id: d.id,
      teamName: d.departmentName,
      leadName: d.members.join(' & '),
      role: `Team Leaders: ${d.members.join(', ')}`,
      email: d.lead.email,
      phone: d.lead.phone,
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
