import { LayoutDashboard, Ticket, CreditCard, AlertTriangle } from "lucide-react";

export const adminNavItems = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "All Tickets", url: "/admin/tickets", icon: Ticket },
  { title: "Payments", url: "/admin/payments", icon: CreditCard },
  { title: "Complaints", url: "/admin/complaints", icon: AlertTriangle },
];

export const statusColors: Record<string, string> = {
  open: "gradient-amber text-accent-foreground border-0",
  assigned: "bg-blue-100 text-blue-800 border-0",
  in_progress: "bg-indigo-100 text-indigo-800 border-0",
  completed: "bg-success text-success-foreground border-0",
  disputed: "bg-destructive text-destructive-foreground border-0",
};
