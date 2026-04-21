export interface Job {
  id: string;
  title: string;
  category: "plumber" | "security" | "labourer" | "electrician" | "cleaner" | "carpenter" | "painter" | "gardener";
  city: string;
  description: string;
  minFee: number;
  maxFee: number;
  status: "open" | "assigned" | "in_progress" | "completed" | "disputed";
  postedBy: string;
  postedAt: string;
  assignedTo?: string;
  depositPaid: boolean;
  urgency?: "normal" | "urgent" | "emergency";
  bidsCount?: number;
  image?: string;
}

export interface Worker {
  id: string;
  name: string;
  category: string;
  city: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  hourlyRate: number;
  bio: string;
  skills: string[];
  avatar: string;
  isAvailable: boolean;
  responseTime: string;
  badge?: "top_rated" | "verified" | "new";
}

export interface Review {
  id: string;
  workerId: string;
  clientName: string;
  clientAvatar: string;
  rating: number;
  comment: string;
  date: string;
  jobTitle: string;
}

export interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
  jobId: string;
}

export interface Complaint {
  id: string;
  jobId: string;
  from: string;
  subject: string;
  message: string;
  status: "open" | "investigating" | "resolved";
  createdAt: string;
}

export interface PlatformStats {
  totalJobs: number;
  totalWorkers: number;
  totalClients: number;
  completedJobs: number;
  citiesCovered: number;
  avgRating: number;
}

// ── UK Cities ──────────────────────────────────────────────────────────────────
export const UK_CITIES = [
  "London", "Manchester", "Birmingham", "Leeds", "Liverpool",
  "Bristol", "Sheffield", "Edinburgh", "Glasgow", "Cardiff",
  "Nottingham", "Newcastle", "Leicester", "Southampton", "Brighton",
];

// ── Categories ─────────────────────────────────────────────────────────────────
export const CATEGORIES = [
  { value: "plumber",      label: "Plumber",            icon: "🔧" },
  { value: "security",     label: "Security Guard",     icon: "🛡️" },
  { value: "labourer",     label: "Labourer",           icon: "👷" },
  { value: "electrician",  label: "Electrician",        icon: "⚡" },
  { value: "cleaner",      label: "Cleaner",            icon: "🧹" },
  { value: "carpenter",    label: "Carpenter",          icon: "🪚" },
  { value: "painter",      label: "Painter & Decorator",icon: "🖌️" },
  { value: "gardener",     label: "Gardener",           icon: "🌿" },
  { value: "handyman",     label: "Handyman",           icon: "🔨" },
  { value: "locksmith",    label: "Locksmith",          icon: "🔑" },
];

// ── Platform Stats ─────────────────────────────────────────────────────────────
export const platformStats: PlatformStats = {
  totalJobs: 12847,
  totalWorkers: 3241,
  totalClients: 8906,
  completedJobs: 11209,
  citiesCovered: 15,
  avgRating: 4.8,
};

// ── Mock Workers ───────────────────────────────────────────────────────────────
export const mockWorkers: Worker[] = [
  {
    id: "w1",
    name: "James Carter",
    category: "Plumber",
    city: "London",
    rating: 4.9,
    reviewCount: 134,
    completedJobs: 156,
    hourlyRate: 45,
    bio: "Master plumber with 12 years of experience across London. Specialist in emergency call-outs, bathroom installations, and boiler repairs.",
    skills: ["Emergency Repairs", "Boiler Installation", "Bathroom Fitting", "Central Heating"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    isAvailable: true,
    responseTime: "< 30 min",
    badge: "top_rated",
  },
  {
    id: "w2",
    name: "Marcus Thompson",
    category: "Electrician",
    city: "Manchester",
    rating: 4.8,
    reviewCount: 89,
    completedJobs: 112,
    hourlyRate: 50,
    bio: "NICEIC-certified electrician specialising in commercial rewiring, EV charger installation, and smart home automation.",
    skills: ["Rewiring", "EV Chargers", "Smart Home", "Consumer Units"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    isAvailable: true,
    responseTime: "< 1 hour",
    badge: "verified",
  },
  {
    id: "w3",
    name: "Sarah Williams",
    category: "Cleaner",
    city: "Birmingham",
    rating: 5.0,
    reviewCount: 201,
    completedJobs: 243,
    hourlyRate: 22,
    bio: "Professional deep-clean specialist. End-of-tenancy expert with a 100% deposit-back record. Fully insured and DBS checked.",
    skills: ["Deep Clean", "End of Tenancy", "Office Clean", "Oven Cleaning"],
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    isAvailable: false,
    responseTime: "< 2 hours",
    badge: "top_rated",
  },
  {
    id: "w4",
    name: "David Okafor",
    category: "Security Guard",
    city: "London",
    rating: 4.7,
    reviewCount: 67,
    completedJobs: 78,
    hourlyRate: 18,
    bio: "SIA-licensed door supervisor with event security experience. Calm under pressure, professional at all times.",
    skills: ["Door Supervision", "Event Security", "CCTV", "First Aid"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    isAvailable: true,
    responseTime: "< 1 hour",
    badge: "verified",
  },
  {
    id: "w5",
    name: "Tom Brierley",
    category: "Carpenter",
    city: "Leeds",
    rating: 4.9,
    reviewCount: 55,
    completedJobs: 61,
    hourlyRate: 38,
    bio: "Bespoke furniture maker and kitchen fitter. 8 years crafting custom joinery for residential and commercial clients.",
    skills: ["Kitchen Fitting", "Bespoke Furniture", "Skirting Boards", "Loft Conversions"],
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    isAvailable: true,
    responseTime: "Same day",
    badge: "new",
  },
  {
    id: "w6",
    name: "Priya Sharma",
    category: "Painter & Decorator",
    city: "Bristol",
    rating: 4.8,
    reviewCount: 43,
    completedJobs: 51,
    hourlyRate: 28,
    bio: "Interior and exterior painter with an eye for detail. Specialising in feature walls, wallpaper hanging, and commercial spaces.",
    skills: ["Interior Painting", "Wallpaper Hanging", "Feature Walls", "Commercial"],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    isAvailable: true,
    responseTime: "< 2 hours",
  },
];

// ── Mock Reviews ───────────────────────────────────────────────────────────────
export const mockReviews: Review[] = [
  {
    id: "r1",
    workerId: "w1",
    clientName: "Emma Watson",
    clientAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    comment: "James arrived within 20 minutes of my emergency call. Fixed the burst pipe quickly, no mess left behind. Absolutely brilliant service!",
    date: "2026-04-15",
    jobTitle: "Emergency Burst Pipe Repair",
  },
  {
    id: "r2",
    workerId: "w2",
    clientName: "Tech Solutions Ltd",
    clientAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    comment: "Marcus rewired our entire office floor professionally. Minimal disruption to business and the work passed inspection first time.",
    date: "2026-04-10",
    jobTitle: "Office Full Rewire",
  },
  {
    id: "r3",
    workerId: "w3",
    clientName: "Property Mgmt Ltd",
    clientAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    comment: "Sarah and her team transformed the flat. Spotless. The tenants got their full deposit back. Will book again for every checkout.",
    date: "2026-04-08",
    jobTitle: "End of Tenancy Deep Clean",
  },
  {
    id: "r4",
    workerId: "w4",
    clientName: "EventPro UK",
    clientAvatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    comment: "David ran our event security brilliantly. Professional, calm with a difficult crowd, and impeccably presented. Highly recommend.",
    date: "2026-04-03",
    jobTitle: "Weekend Music Festival Security",
  },
];

// ── Mock Jobs ──────────────────────────────────────────────────────────────────
export const mockJobs: Job[] = [
  {
    id: "1", title: "Emergency Boiler Breakdown", category: "plumber", city: "London",
    description: "Boiler stopped working overnight. No heating or hot water. Urgent fix needed for family home.",
    minFee: 120, maxFee: 300, status: "open", postedBy: "Sarah Connor", postedAt: "2 min ago",
    depositPaid: false, urgency: "emergency", bidsCount: 3,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
  },
  {
    id: "2", title: "4-Bedroom End of Tenancy Clean", category: "cleaner", city: "Manchester",
    description: "Moving out Friday. Need professional deep clean to secure full deposit return. 4 beds, 2 baths.",
    minFee: 180, maxFee: 280, status: "open", postedBy: "Mike Johnson", postedAt: "15 min ago",
    depositPaid: false, urgency: "urgent", bidsCount: 7,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=250&fit=crop&auto=format",
  },
  {
    id: "3", title: "SIA Security Guard – Night Shift", category: "security", city: "Birmingham",
    description: "Licensed security guard needed for warehouse night shift. Mon–Fri, 10pm–6am. 3-month contract.",
    minFee: 130, maxFee: 170, status: "open", postedBy: "Warehouse Co", postedAt: "1 hour ago",
    depositPaid: false, urgency: "normal", bidsCount: 5,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=250&fit=crop",
  },
  {
    id: "4", title: "Kitchen Extension – Full Rewire", category: "electrician", city: "Leeds",
    description: "New kitchen extension needs full electrical fit-out. 8 double sockets, under-cabinet lighting, cooker circuit.",
    minFee: 400, maxFee: 700, status: "assigned", postedBy: "HomeReno Ltd", postedAt: "3 hours ago",
    depositPaid: true, urgency: "normal", bidsCount: 4,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=250&fit=crop",
  },
  {
    id: "5", title: "Bespoke Built-In Wardrobe", category: "carpenter", city: "Bristol",
    description: "Master bedroom alcove wardrobe, floor to ceiling. Sliding doors. Approx 3.5m wide. Drawings provided.",
    minFee: 600, maxFee: 1100, status: "in_progress", postedBy: "Emma Lewis", postedAt: "1 day ago",
    depositPaid: true, urgency: "normal", bidsCount: 6,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop&auto=format",
  },
  {
    id: "6", title: "Garden Landscaping & Clearance", category: "gardener", city: "Liverpool",
    description: "Overgrown rear garden needs full clearance, new turf, and two raised vegetable beds built.",
    minFee: 350, maxFee: 600, status: "open", postedBy: "Tom Richardson", postedAt: "2 hours ago",
    depositPaid: false, urgency: "normal", bidsCount: 2,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop",
  },
];

export const mockNotifications: Notification[] = [
  { id: "1", message: "New security job posted near you in London", time: "2 min ago", read: false, jobId: "1" },
  { id: "2", message: "New plumbing job in Manchester – Emergency!", time: "15 min ago", read: false, jobId: "2" },
  { id: "3", message: "Your bid for 'Event Security' was accepted", time: "1 hour ago", read: true, jobId: "5" },
  { id: "4", message: "New electrician job posted in Leeds", time: "3 hours ago", read: true, jobId: "4" },
];

export const mockComplaints: Complaint[] = [
  { id: "1", jobId: "6", from: "Emma Watson", subject: "Incomplete work", message: "The plumber left without finishing the shower installation. Water is leaking.", status: "open", createdAt: "2026-03-05" },
  { id: "2", jobId: "5", from: "SecureTeam", subject: "Payment delay", message: "The event has been completed but payment hasn't been released yet.", status: "investigating", createdAt: "2026-03-04" },
  { id: "3", jobId: "3", from: "Dave Wilson", subject: "Unsafe working conditions", message: "The construction site doesn't have proper safety equipment.", status: "resolved", createdAt: "2026-03-01" },
];

