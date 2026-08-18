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
    hqLocation: "Bengaluru, Karnataka, India [Placeholder]",
    contactEmail: "hello@prijiva.org [Placeholder]",
    contactPhone: "+91 98765 43210 [Placeholder]",
    brandMeaning: {
      headline: "What PriJiva Means",
      pri: "Prithvi (Earth)",
      jiva: "Life",
      explanation: "PriJiva brings together Prithvi—Earth—and Jiva—Life. It reflects our belief that caring for the places we live in is inseparable from caring for life itself. Through youth-led civic action, PriJiva works toward communities that are more responsible, aware, and Civically Abled."
    },
    socials: {
      instagram: "https://instagram.com/prijiva_org [Placeholder]",
      linkedin: "https://linkedin.com/company/prijiva [Placeholder]",
      twitter: "https://twitter.com/prijiva_org [Placeholder]",
      youtube: "https://youtube.com/@prijiva [Placeholder]",
      whatsappCommunity: "https://chat.whatsapp.com/invite-placeholder"
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
  featuredDrive: {
    id: "feat-zebra-crossing-2026",
    title: "Project WalkRight: Reclaiming Pedestrian Crossings",
    date: "Saturday, Oct 24, 2026",
    time: "8:30 AM - 12:00 PM IST",
    location: "Sony World Signal, Koramangala [Placeholder]",
    city: "Bengaluru",
    category: "Street Action",
    targetVolunteers: "50 Youth Volunteers Needed",
    description: "Join us for a morning of creative street engagement, painting high-visibility zebra crossing indicators, and advocating for pedestrian right-of-way with traffic police coordination.",
    artImage: "assets/images/illustrations/event-pedestrian.svg"
  },

  // Events & Drives Directory (Impact & Events Page)
  events: [
    {
      id: "evt-001",
      title: "Project WalkRight: Zebra Crossing Respect Drive",
      category: "Street Action",
      type: "upcoming",
      date: "Oct 24, 2026",
      time: "8:30 AM - 12:00 PM",
      location: "Sony World Signal, Koramangala [Placeholder]",
      city: "Bengaluru",
      badge: "Upcoming Drive",
      image: "assets/images/illustrations/event-pedestrian.svg",
      description: "Mobilizing youth to advocate for pedestrian right-of-way, educating motorists about stop-lines, and assisting seniors across busy intersections.",
      attendees: "50 Volunteers Needed",
      outcome: "Target: 5,000 commuters engaged; 4 high-risk crossings monitored.",
      showInOurWork: false,
      gallery: []
    },
    {
      id: "evt-002",
      title: "Civic Hackathon: Youth Tech for Civic Audits",
      category: "Campus Workshop",
      type: "upcoming",
      date: "Nov 12, 2026",
      time: "10:00 AM - 5:00 PM",
      location: "PES University Auditorium [Placeholder]",
      city: "Bengaluru",
      badge: "Upcoming Drive",
      image: "assets/images/illustrations/event-workshop.svg",
      description: "A full-day interactive student hackathon building open-source web widgets and AI camera tools to report broken footpaths and signal dysfunctions.",
      attendees: "120 Attendees Needed",
      outcome: "Target: 15 functional civic audit prototypes submitted to municipal bodies.",
      showInOurWork: false,
      gallery: []
    },
    {
      id: "evt-003",
      title: "Hospital Silence Zone: Anti-Honking Flash Action",
      category: "Civic Audit",
      type: "past",
      date: "Aug 02, 2026",
      time: "9:00 AM - 11:30 AM",
      location: "Victoria Hospital Zone [Placeholder]",
      city: "Bengaluru",
      badge: "Completed Impact",
      image: "assets/images/illustrations/event-noise.svg",
      description: "Deployed 60 volunteers with creative silence placards and decibel sound level meters outside hospital emergency entrances.",
      attendees: "60 Volunteers Participated",
      outcome: "Recorded 42% average reduction in peak decibels outside emergency trauma ward during rush hours.",
      highlight: "Featured in local city news bulletin",
      showInOurWork: true,
      gallery: [
        "assets/images/illustrations/event-noise.svg",
        "assets/images/illustrations/hero-art.svg"
      ]
    },
    {
      id: "evt-004",
      title: "Youth CleanUp & Smart Bin Placement Drive",
      category: "Environment & Waste",
      type: "past",
      date: "Jul 19, 2026",
      time: "7:00 AM - 10:30 AM",
      location: "Agara Lake Perimeter [Placeholder]",
      city: "Bengaluru",
      badge: "Completed Impact",
      image: "assets/images/illustrations/event-cleanup.svg",
      description: "Mobilized 180 youth volunteers to collect 620kg of single-use plastic and map 12 new smart bin spots with municipal authorities.",
      attendees: "185 Volunteers Participated",
      outcome: "620 kg waste diverted; 12 smart bin stations sanctioned by ward council.",
      highlight: "98% volunteer satisfaction rating",
      showInOurWork: true,
      gallery: [
        "assets/images/illustrations/event-cleanup.svg",
        "assets/images/illustrations/hero-art.svg"
      ]
    },
    {
      id: "evt-005",
      title: "Queue Etiquette & Metro Transit Courtesy Drive",
      category: "Street Action",
      type: "past",
      date: "Jun 14, 2026",
      time: "8:00 AM - 1:00 PM",
      location: "Majestic Interchange Station [Placeholder]",
      city: "Bengaluru",
      badge: "Completed Impact",
      image: "assets/images/illustrations/event-transit.svg",
      description: "Creative flash mob and floor decal installations promoting 'Let Passengers Exit First' and escalator lane discipline.",
      attendees: "110 Volunteers",
      outcome: "Observed 65% faster platform clearance times during 3-hour trial window.",
      highlight: "Adopted as permanent station floor guidance",
      showInOurWork: true,
      gallery: [
        "assets/images/illustrations/event-transit.svg",
        "assets/images/illustrations/hero-art.svg"
      ]
    },
    {
      id: "evt-006",
      title: "Civic Rights 101: High School Civic Literacy Bootcamp",
      category: "Campus Workshop",
      type: "past",
      date: "May 08, 2026",
      time: "11:00 AM - 3:00 PM",
      location: "National Public School Campus [Placeholder]",
      city: "Bengaluru",
      badge: "Completed Impact",
      image: "assets/images/illustrations/event-workshop.svg",
      description: "Interactive session teaching grades 9-12 students how local municipal bodies work, how to file grievances, and everyday civic duties.",
      attendees: "340 Students",
      outcome: "Established 3 student-led school civic clubs with ongoing monthly audits.",
      highlight: "100% student charter adoption",
      showInOurWork: true,
      gallery: [
        "assets/images/illustrations/event-workshop.svg",
        "assets/images/illustrations/hero-art.svg"
      ]
    }
  ],

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
      email: "founder@prijiva.org [Placeholder]",
      phone: "+91 98765 43210 [Placeholder]",
      linkedin: "https://linkedin.com/company/prijiva [Placeholder]",
      leadershipMessage: "“Civic sense is not an abstract theory in a textbook; it is the daily muscle memory of respecting the shared spaces we inherit together.”"
    },

    // Five Secretariat Roles
    secretaries: [
      {
        id: "sec-exec",
        title: "Executive Secretary",
        name: "[Executive Secretary Name Placeholder]",
        photo: "assets/images/avatars/avatar-1.svg",
        roleDescription: "Supports executive decision-making, coordinates leadership priorities, and helps ensure the organization’s vision translates into action.",
        bioSummary: "Coordinates cross-functional milestones, supports strategic execution, and aligns executive deliverables.",
        email: "exec.secretary@prijiva.org [Placeholder]",
        linkedin: "https://linkedin.com/in/exec-secretary [Placeholder]"
      },
      {
        id: "sec-general",
        title: "General Secretary",
        name: "[General Secretary Name Placeholder]",
        photo: "assets/images/avatars/avatar-2.svg",
        roleDescription: "Oversees overall coordination, records, internal communication, and the smooth functioning of PriJiva’s governance processes.",
        bioSummary: "Manages organizational compliance, meeting records, formal documentation, and team communications.",
        email: "general.secretary@prijiva.org [Placeholder]",
        linkedin: "https://linkedin.com/in/general-secretary [Placeholder]"
      },
      {
        id: "sec-ops",
        title: "Operations Secretary",
        name: "[Operations Secretary Name Placeholder]",
        photo: "assets/images/avatars/avatar-3.svg",
        roleDescription: "Leads operational planning, resource coordination, timelines, and on-ground execution support.",
        bioSummary: "Oversees field safety protocols, equipment logistics, and execution timelines across regional drives.",
        email: "operations.secretary@prijiva.org [Placeholder]",
        linkedin: "https://linkedin.com/in/ops-secretary [Placeholder]"
      },
      {
        id: "sec-outreach",
        title: "Outreach & Partnerships Secretary",
        name: "[Outreach & Partnerships Secretary Name Placeholder]",
        photo: "assets/images/avatars/avatar-1.svg",
        roleDescription: "Builds relationships with communities, educational institutions, partner organizations, and supporters.",
        bioSummary: "Leads strategic institutional partnerships, campus outreach networks, and civic alliance building.",
        email: "outreach.secretary@prijiva.org [Placeholder]",
        linkedin: "https://linkedin.com/in/outreach-secretary [Placeholder]"
      },
      {
        id: "sec-strategy",
        title: "Strategy & Communications Secretary",
        name: "[Strategy & Communications Secretary Name Placeholder]",
        photo: "assets/images/avatars/avatar-2.svg",
        roleDescription: "Shapes PriJiva’s strategic direction, public communication, campaigns, and brand voice.",
        bioSummary: "Drives media advocacy roadmaps, public communications, and creative campaign messaging.",
        email: "strategy.secretary@prijiva.org [Placeholder]",
        linkedin: "https://linkedin.com/in/strategy-secretary [Placeholder]"
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
          name: "[Head Name Placeholder]",
          role: "Department Head",
          photo: "assets/images/avatars/avatar-1.svg",
          bio: "Oversees the event calendar, scheduling, safety protocols, and venue permissions.",
          email: "events.head@prijiva.org [Placeholder]",
          phone: "+91 98765 00001 [Placeholder]",
          linkedin: "https://linkedin.com/in/events-head [Placeholder]"
        },
        subHead: {
          name: "[Sub-Head Name Placeholder]",
          role: "Department Sub-Head",
          photo: "assets/images/avatars/avatar-2.svg",
          bio: "Assists with drive-day coordination, volunteer rosters, and equipment setup.",
          email: "events.subhead@prijiva.org [Placeholder]",
          phone: "+91 98765 00002 [Placeholder]",
          linkedin: "https://linkedin.com/in/events-subhead [Placeholder]"
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
          name: "[Head Name Placeholder]",
          role: "Department Head",
          photo: "assets/images/avatars/avatar-3.svg",
          bio: "Leads civic scorecards, survey methodologies, and data-backed reports.",
          email: "research.head@prijiva.org [Placeholder]",
          phone: "+91 98765 00003 [Placeholder]",
          linkedin: "https://linkedin.com/in/research-head [Placeholder]"
        },
        subHead: {
          name: "[Sub-Head Name Placeholder]",
          role: "Department Sub-Head",
          photo: "assets/images/avatars/avatar-1.svg",
          bio: "Manages drive documentation archives and post-event analytics.",
          email: "research.subhead@prijiva.org [Placeholder]",
          phone: "+91 98765 00004 [Placeholder]",
          linkedin: "https://linkedin.com/in/research-subhead [Placeholder]"
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
          name: "[Head Name Placeholder]",
          role: "Department Head",
          photo: "assets/images/avatars/avatar-2.svg",
          bio: "Directs web infrastructure, digital tools, and data platform development.",
          email: "tech.head@prijiva.org [Placeholder]",
          phone: "+91 98765 00005 [Placeholder]",
          linkedin: "https://linkedin.com/in/tech-head [Placeholder]"
        },
        subHead: {
          name: "[Sub-Head Name Placeholder]",
          role: "Department Sub-Head",
          photo: "assets/images/avatars/avatar-3.svg",
          bio: "Maintains form integrations, site updates, and tech automations.",
          email: "tech.subhead@prijiva.org [Placeholder]",
          phone: "+91 98765 00006 [Placeholder]",
          linkedin: "https://linkedin.com/in/tech-subhead [Placeholder]"
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
          name: "[Head Name Placeholder]",
          role: "Department Head",
          photo: "assets/images/avatars/avatar-1.svg",
          bio: "Shapes PriJiva's creative visual voice, campaigns, and viral civic storytelling.",
          email: "media.head@prijiva.org [Placeholder]",
          phone: "+91 98765 00007 [Placeholder]",
          linkedin: "https://linkedin.com/in/media-head [Placeholder]"
        },
        subHead: {
          name: "[Sub-Head Name Placeholder]",
          role: "Department Sub-Head",
          photo: "assets/images/avatars/avatar-2.svg",
          bio: "Coordinates ground photography, reels, and digital campaign collateral.",
          email: "media.subhead@prijiva.org [Placeholder]",
          phone: "+91 98765 00008 [Placeholder]",
          linkedin: "https://linkedin.com/in/media-subhead [Placeholder]"
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
          name: "[Head Name Placeholder]",
          role: "Department Head",
          photo: "assets/images/avatars/avatar-3.svg",
          bio: "Focuses on volunteer onboarding, community health, and student recognition.",
          email: "people.head@prijiva.org [Placeholder]",
          phone: "+91 98765 00009 [Placeholder]",
          linkedin: "https://linkedin.com/in/people-head [Placeholder]"
        },
        subHead: {
          name: "[Sub-Head Name Placeholder]",
          role: "Department Sub-Head",
          photo: "assets/images/avatars/avatar-1.svg",
          bio: "Coordinates volunteer feedback, recognition awards, and chapter check-ins.",
          email: "people.subhead@prijiva.org [Placeholder]",
          phone: "+91 98765 00010 [Placeholder]",
          linkedin: "https://linkedin.com/in/people-subhead [Placeholder]"
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
          name: "[Head Name Placeholder]",
          role: "Department Head",
          photo: "assets/images/avatars/avatar-2.svg",
          bio: "Leads campus chapter expansion, resident alliances, and local outreach.",
          email: "outreach.head@prijiva.org [Placeholder]",
          phone: "+91 98765 00011 [Placeholder]",
          linkedin: "https://linkedin.com/in/outreach-head [Placeholder]"
        },
        subHead: {
          name: "[Sub-Head Name Placeholder]",
          role: "Department Sub-Head",
          photo: "assets/images/avatars/avatar-3.svg",
          bio: "Liaises with student leaders and neighborhood welfare associations.",
          email: "outreach.subhead@prijiva.org [Placeholder]",
          phone: "+91 98765 00012 [Placeholder]",
          linkedin: "https://linkedin.com/in/outreach-subhead [Placeholder]"
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
  testimonials: [
    {
      id: "test-1",
      quote: "PriJiva brought infectious energy to our neighborhood zebra crossing drive. Commuters were genuinely smiling while learning to stop behind the white line!",
      author: "[Partner / Volunteer Name Placeholder]",
      role: "Student Volunteer Lead",
      affiliation: "Koramangala Youth Pod [Placeholder]"
    },
    {
      id: "test-2",
      quote: "The interactive Civic Literacy bootcamp gave our school council the exact toolkit to audit pedestrian safety around our campus gates.",
      author: "[Educator / Principal Name Placeholder]",
      role: "High School Teacher & Chapter Advisor",
      affiliation: "Bengaluru Central Academy [Placeholder]"
    },
    {
      id: "test-3",
      quote: "Watching young students engage peacefully with drivers outside hospital silence zones showed how much positive civic leadership can achieve.",
      author: "[Resident Representative Placeholder]",
      role: "RWA Secretary",
      affiliation: "Indiranagar Ward 112 [Placeholder]"
    }
  ],

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
