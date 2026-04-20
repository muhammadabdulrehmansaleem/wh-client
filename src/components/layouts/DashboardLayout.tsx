import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Footer } from "@/components/Footer";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { LucideIcon } from "lucide-react";

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface DashboardLayoutProps {
  children: ReactNode;
  items: NavItem[];
  title: string;
  groupLabel: string;
}

function DashboardSidebar({ items, title, groupLabel }: Omit<DashboardLayoutProps, "children">) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isExpanded = items.some((i) => location.pathname === i.url);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-amber flex items-center justify-center">
              <span className="text-sm font-bold text-accent-foreground">WH</span>
            </div>
            {!collapsed && <span className="font-bold text-lg text-sidebar-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</span>}
          </Link>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function DashboardLayout({ children, items, title, groupLabel }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar items={items} title={title} groupLabel={groupLabel} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-card px-4 gap-4">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
