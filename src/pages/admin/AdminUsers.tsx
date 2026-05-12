import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { adminNavItems } from "./adminNav";
import { useState } from "react";

// Placeholder — will be wired to real API (GET /api/users) once users module is built
const MOCK_USERS = [
  { id: "1", name: "Sarah Mitchell",  email: "sarah@example.com", role: "client", city: "London",     active: true },
  { id: "2", name: "James Carter",    email: "james@example.com", role: "worker", city: "Manchester",  active: true },
  { id: "3", name: "Emma Thompson",   email: "emma@example.com",  role: "client", city: "Birmingham",  active: true },
  { id: "4", name: "Liam Hassan",     email: "liam@example.com",  role: "worker", city: "Leeds",       active: false },
  { id: "5", name: "Olivia Chen",     email: "olivia@example.com",role: "client", city: "Bristol",     active: true },
  { id: "6", name: "Noah Williams",   email: "noah@example.com",  role: "worker", city: "Edinburgh",   active: true },
];

const roleColors: Record<string, string> = {
  client: "bg-blue-100 text-blue-800 border-0",
  worker: "bg-amber-100 text-amber-800 border-0",
  admin:  "bg-purple-100 text-purple-800 border-0",
};

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = MOCK_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <DashboardLayout items={adminNavItems} title="Admin Panel" groupLabel="Administration">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>User Management</h1>
          <p className="text-muted-foreground mt-1">View and manage all registered users</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex rounded-lg border overflow-hidden">
            {["all", "client", "worker", "admin"].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  roleFilter === r
                    ? "gradient-amber text-accent-foreground"
                    : "bg-card hover:bg-muted text-muted-foreground"
                }`}
              >
                {r === "all" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-muted-foreground">{filtered.length} user{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Table */}
        <div className="rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">City</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(u => (
                <tr key={u.id} className="bg-card hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge className={roleColors[u.role] ?? ""}>{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.city}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${u.active ? "text-green-600" : "text-muted-foreground"}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${u.active ? "bg-green-500" : "bg-muted-foreground"}`} />
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
