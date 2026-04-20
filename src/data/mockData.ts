export interface Job {
  id: string;
  title: string;
  category: "plumber" | "security" | "labourer" | "electrician" | "cleaner";
  city: string;
  description: string;
  minFee: number;
  maxFee: number;
  status: "open" | "assigned" | "in_progress" | "completed" | "disputed";
  postedBy: string;
  postedAt: string;
  assignedTo?: string;
  depositPaid: boolean;
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

export const UK_CITIES = [
  "London", "Manchester", "Birmingham", "Leeds", "Liverpool",
  "Bristol", "Sheffield", "Edinburgh", "Glasgow", "Cardiff",
  "Nottingham", "Newcastle", "Leicester", "Southampton", "Brighton",
];

export const CATEGORIES = [
  { value: "plumber", label: "Plumber", icon: "🔧" },
  { value: "security", label: "Security Guard", icon: "🛡️" },
  { value: "labourer", label: "Labourer", icon: "👷" },
  { value: "electrician", label: "Electrician", icon: "⚡" },
  { value: "cleaner", label: "Cleaner", icon: "🧹" },
];

export const mockJobs: Job[] = [
  { id: "1", title: "Security Guard Needed for Night Shift", category: "security", city: "London", description: "Looking for a reliable security guard for a warehouse night shift. 8pm-6am, Monday to Friday.", minFee: 120, maxFee: 180, status: "open", postedBy: "John Smith", postedAt: "2026-03-05", depositPaid: false },
  { id: "2", title: "Emergency Plumbing - Burst Pipe", category: "plumber", city: "Manchester", description: "Urgent: burst pipe in kitchen needs immediate repair.", minFee: 80, maxFee: 150, status: "open", postedBy: "Sarah Connor", postedAt: "2026-03-06", depositPaid: false },
  { id: "3", title: "Construction Labourer - 2 Week Project", category: "labourer", city: "Birmingham", description: "Need strong labourers for a residential construction project. Heavy lifting required.", minFee: 100, maxFee: 140, status: "assigned", postedBy: "Mike Johnson", postedAt: "2026-03-04", assignedTo: "Dave Wilson", depositPaid: true },
  { id: "4", title: "Electrician for Office Rewiring", category: "electrician", city: "Leeds", description: "Full office rewiring needed for a 3-storey building. Must be certified.", minFee: 200, maxFee: 350, status: "open", postedBy: "Tech Corp Ltd", postedAt: "2026-03-06", depositPaid: false },
  { id: "5", title: "Event Security Team - 5 Guards", category: "security", city: "London", description: "Need 5 security guards for a weekend music event. SIA licence required.", minFee: 150, maxFee: 200, status: "in_progress", postedBy: "EventPro UK", postedAt: "2026-03-03", assignedTo: "SecureTeam", depositPaid: true },
  { id: "6", title: "Plumber for Bathroom Installation", category: "plumber", city: "Bristol", description: "Complete bathroom suite installation including shower, toilet and basin.", minFee: 300, maxFee: 500, status: "completed", postedBy: "Emma Watson", postedAt: "2026-02-28", assignedTo: "Bob's Plumbing", depositPaid: true },
  { id: "7", title: "Deep Clean - 4 Bed House", category: "cleaner", city: "Liverpool", description: "End of tenancy deep clean for a 4 bedroom house.", minFee: 150, maxFee: 250, status: "open", postedBy: "Property Mgmt Ltd", postedAt: "2026-03-06", depositPaid: false },
  { id: "8", title: "General Labourer - Garden Clearance", category: "labourer", city: "Sheffield", description: "Garden clearance and rubbish removal. Van access helpful.", minFee: 80, maxFee: 120, status: "open", postedBy: "Helen Davis", postedAt: "2026-03-05", depositPaid: false },
];

export const mockNotifications: Notification[] = [
  { id: "1", message: "New security job posted near you in London", time: "2 min ago", read: false, jobId: "1" },
  { id: "2", message: "New plumbing job in Manchester - Emergency!", time: "15 min ago", read: false, jobId: "2" },
  { id: "3", message: "Your application for 'Event Security' was accepted", time: "1 hour ago", read: true, jobId: "5" },
  { id: "4", message: "New electrician job posted in Leeds", time: "3 hours ago", read: true, jobId: "4" },
];

export const mockComplaints: Complaint[] = [
  { id: "1", jobId: "6", from: "Emma Watson", subject: "Incomplete work", message: "The plumber left without finishing the shower installation. Water is leaking.", status: "open", createdAt: "2026-03-05" },
  { id: "2", jobId: "5", from: "SecureTeam", subject: "Payment delay", message: "The event has been completed but payment hasn't been released yet.", status: "investigating", createdAt: "2026-03-04" },
  { id: "3", jobId: "3", from: "Dave Wilson", subject: "Unsafe working conditions", message: "The construction site doesn't have proper safety equipment.", status: "resolved", createdAt: "2026-03-01" },
];
