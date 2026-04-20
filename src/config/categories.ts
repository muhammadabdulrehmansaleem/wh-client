export const WORKER_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Gardening",
  "Carpentry",
  "Painting & Decorating",
  "Handyman",
  "Moving & Removals",
  "Childcare",
  "Elder Care",
  "Tutoring",
  "Beauty & Wellness",
  "IT Support",
  "Catering & Cooking",
  "Photography",
  "Pet Care",
  "Security",
  "Other",
] as const;

export type WorkerCategory = (typeof WORKER_CATEGORIES)[number];
