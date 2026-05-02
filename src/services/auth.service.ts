export type UserRole = "worker" | "client" | "admin";

// Mirrors the SafeUser type from the backend (no sensitive fields)
export interface AuthUser {
  id: string;
  email: string;

  // Filled after complete-profile
  role: UserRole | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  full_name: string | null;

  // Profile
  city: string | null;
  phone: string | null;

  // Address
  address_line1: string | null;
  address_line2: string | null;
  postcode: string | null;
  latitude: number | null;
  longitude: number | null;

  // Worker-specific
  category: string | null;
  bio: string | null;
  skills: string[] | null;
  rating: number | null;
  completed_jobs_count: number;

  is_verified: boolean;
  is_active: boolean;
  profile_complete: boolean;

  profile_picture_url: string | null;

  // Google OAuth fields
  auth_provider: "local" | "google";
  google_id: string | null;
  google_picture_url: string | null;

  created_at: string;
  updated_at: string;
}

// ─── Auth Service (singleton) ────────────────────────────────────────────────
// Angular equivalent: @Injectable({ providedIn: 'root' }) AuthService
// React pattern: module-level singleton — same instance everywhere via import

class AuthService {
  private static instance: AuthService;

  private accessToken: string | null = null;
  private currentUser: AuthUser | null = null;

  private static readonly USER_KEY = "wh_user";

  private constructor() {
    // Restore user from sessionStorage on page load
    try {
      const stored = sessionStorage.getItem(AuthService.USER_KEY);
      if (stored) this.currentUser = JSON.parse(stored) as AuthUser;
    } catch {
      sessionStorage.removeItem(AuthService.USER_KEY);
    }
  }

  // Singleton accessor
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // ── Access Token ─────────────────────────────────────────────────────────

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearAccessToken(): void {
    this.accessToken = null;
  }

  // ── User ─────────────────────────────────────────────────────────────────

  setUser(user: AuthUser): void {
    this.currentUser = user;
    sessionStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
  }

  getUser(): AuthUser | null {
    return this.currentUser;
  }

  clearUser(): void {
    this.currentUser = null;
  }

  // ── Auth State ────────────────────────────────────────────────────────────

  // isAuthenticated: true if we have an in-memory token OR a persisted user
  // (the access token is re-obtained via the refresh endpoint on first API call)
  isAuthenticated(): boolean {
    return this.accessToken !== null || this.currentUser !== null;
  }

  isProfileComplete(): boolean {
    return this.currentUser?.profile_complete === true;
  }

  // ── Logout (clears all in-memory state) ──────────────────────────────────

  clear(): void {
    this.accessToken = null;
    this.currentUser = null;
    sessionStorage.removeItem(AuthService.USER_KEY);
  }
}

export default AuthService.getInstance();
