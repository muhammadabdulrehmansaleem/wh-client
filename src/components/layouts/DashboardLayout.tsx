import { ReactNode, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink } from "@/components/NavLink";
import { LucideIcon, LogOut, User, ChevronDown, ExternalLink } from "lucide-react";
import authService from "@/services/auth.service";
import apiClient from "@/lib/axios";
import { API_URLS } from "@/config/api.urls";
import { toast } from "sonner";

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
  // Mark sidebar active when exact match or child route
  const isExpanded = items.some((i) => location.pathname.startsWith(i.url) && i.url !== "/profile");

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-amber flex items-center justify-center">
              <span className="text-sm font-bold text-accent-foreground">WH</span>
            </div>
            {!collapsed && (
              <span
                className="font-bold text-lg text-sidebar-foreground"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {title}
              </span>
            )}
          </Link>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
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

function ProfileDropdown() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const isSuperAdmin = user?.role === "super_admin";

  const initials = [user?.first_name?.[0], user?.last_name?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase() || "?";

  const displayName = user?.full_name ?? user?.first_name ?? user?.email ?? "Account";

  const handleLogout = useCallback(async () => {
    try {
      await apiClient.post(API_URLS.AUTH.LOGOUT);
    } catch {
      // ignore logout API errors — clear state regardless
    } finally {
      authService.clear();
      navigate("/login", { replace: true });
      toast.success("Signed out.");
    }
  }, [navigate]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors text-sm font-medium">
          {/* Avatar */}
          <div className="h-7 w-7 rounded-full gradient-amber flex items-center justify-center shrink-0 overflow-hidden">
            {user?.profile_picture_url ? (
              <img src={user.profile_picture_url} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-accent-foreground">{initials}</span>
            )}
          </div>
          <span className="hidden sm:inline max-w-[120px] truncate">{displayName}</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="font-normal">
          <div className="font-medium truncate">{displayName}</div>
          <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>

        {/* Super-admin portal switchers — open in new tab */}
        {isSuperAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal pb-1">
              Switch Portal
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => window.open("/client", "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Client Portal ↗
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => window.open("/worker", "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Worker Portal ↗
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
            <h2
              className="text-lg font-semibold flex-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {title}
            </h2>
            {/* Profile dropdown pinned to the right */}
            <ProfileDropdown />
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
