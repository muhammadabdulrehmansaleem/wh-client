import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg gradient-amber flex items-center justify-center">
                <span className="text-sm font-bold text-accent-foreground">WH</span>
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>WorkHive</span>
            </div>
            <p className="text-sm text-muted-foreground">
              UK's trusted platform connecting tradespeople with clients. Secure payments, local jobs, real opportunities.
            </p>
          </div>

          {/* For Workers */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">For Workers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/worker" className="text-foreground hover:text-accent transition-colors">Browse Jobs</Link></li>
              <li><Link to="/worker/notifications" className="text-foreground hover:text-accent transition-colors">Notifications</Link></li>
              <li><span className="text-muted-foreground">My Applications</span></li>
              <li><span className="text-muted-foreground">Earnings</span></li>
            </ul>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">For Clients</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/client" className="text-foreground hover:text-accent transition-colors">Post a Job</Link></li>
              <li><Link to="/client/jobs" className="text-foreground hover:text-accent transition-colors">My Jobs</Link></li>
              <li><span className="text-muted-foreground">Payment History</span></li>
              <li><span className="text-muted-foreground">Support</span></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-muted-foreground">About Us</span></li>
              <li><span className="text-muted-foreground">Terms of Service</span></li>
              <li><span className="text-muted-foreground">Privacy Policy</span></li>
              <li><Link to="/admin" className="text-foreground hover:text-accent transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 WorkHive. All rights reserved. Built for UK tradespeople.</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>🇬🇧 United Kingdom</span>
            <span>·</span>
            <span>support@workhive.co.uk</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
