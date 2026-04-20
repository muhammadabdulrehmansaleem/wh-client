import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Briefcase, Bell } from "lucide-react";
import { mockNotifications } from "@/data/mockData";

const navItems = [
  { title: "Browse Jobs", url: "/worker", icon: Briefcase },
  { title: "Notifications", url: "/worker/notifications", icon: Bell },
];

export default function WorkerNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <DashboardLayout items={navItems} title="Worker Panel" groupLabel="Dashboard">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Notifications</h1>
        <p className="text-muted-foreground mb-6">Stay updated on new jobs near you</p>

        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} onClick={() => markRead(n.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-colors ${n.read ? 'bg-card' : 'bg-accent/10 border-accent/30'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {!n.read && <div className="w-2 h-2 rounded-full mt-2 gradient-amber flex-shrink-0" />}
                  <div>
                    <p className={`text-sm ${n.read ? 'text-muted-foreground' : 'font-medium'}`}>{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
