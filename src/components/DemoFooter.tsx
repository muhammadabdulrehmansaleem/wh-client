/**
 * DemoFooter — Branded footer shown on public / demo pages.
 * Contains Contact Us (LinkedIn, Email, WhatsApp) and About Us / Team sections.
 * Deliberately lean — no authenticated route links.
 */
import { Link } from "react-router-dom";
import { Linkedin, Mail, MessageCircle, ExternalLink } from "lucide-react";

// ─── Team data ────────────────────────────────────────────────────────────────
const TEAM = [
  {
    name:  "Oliver Bennett",
    role:  "Chief Executive Officer",
    city:  "London, UK",
    // Professional headshot placeholder — replace with a real photo
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&auto=format",
    linkedin: null,
  },
  {
    name:  "Abdulrehman Saleem",
    role:  "Chief Technology Officer",
    city:  "Remote — Pakistan",
    // Ghibli-style illustrated avatar — swap for a real AI-generated portrait when ready
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&auto=format",
    linkedin: "https://www.linkedin.com/in/abdulrehman--saleem",
  },
  {
    name:  "Sarah Mitchell",
    role:  "Head of Product",
    city:  "Manchester, UK",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&auto=format",
    linkedin: null,
  },
  {
    name:  "Marcus Thompson",
    role:  "Operations Manager",
    city:  "Birmingham, UK",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&auto=format",
    linkedin: null,
  },
];

// ─── Contact channels ─────────────────────────────────────────────────────────
const CONTACT = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "abdulrehman--saleem",
    href:  "https://www.linkedin.com/in/abdulrehman--saleem",
    external: true,
  },
  {
    icon: Mail,
    label: "Email",
    value: "abdulrehmansaleem1051@gmail.com",
    href:  "mailto:abdulrehmansaleem1051@gmail.com",
    external: false,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+92 311 741 2349",
    href:  "https://wa.me/923117412349",
    external: true,
  },
];

export function DemoFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-14">

        {/* ── Top grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-amber shadow">
                <span className="text-sm font-bold text-accent-foreground">WH</span>
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>WorkHive</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              UK's trusted on-demand trades marketplace. Connecting skilled workers with clients through secure, transparent, and fast job management.
            </p>
            {/* Explore demo links */}
            <div className="mt-5 flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">Try the Demo</p>
              <Link to="/demo/client" className="text-sm text-foreground hover:text-amber-500 transition-colors flex items-center gap-1.5">
                → Client Dashboard Preview
              </Link>
              <Link to="/demo/worker" className="text-sm text-foreground hover:text-amber-500 transition-colors flex items-center gap-1.5">
                → Worker Dashboard Preview
              </Link>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-5">Contact Us</h4>
            <ul className="space-y-4">
              {CONTACT.map(c => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noopener noreferrer" : undefined}
                    className="group flex items-start gap-3 text-sm hover:text-amber-500 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-amber text-accent-foreground shadow-sm group-hover:shadow-md group-hover:shadow-amber-500/20 transition-shadow">
                      <c.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{c.label}</p>
                      <p className="text-foreground group-hover:text-amber-500 transition-colors flex items-center gap-1">
                        {c.value}
                        {c.external && <ExternalLink className="h-3 w-3 opacity-50" />}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us — Team */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-5">Our Team</h4>
            <ul className="space-y-4">
              {TEAM.map(member => (
                <li key={member.name}>
                  {member.linkedin ? (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                      className="group flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-10 w-10 rounded-full object-cover border-2 border-border group-hover:border-amber-500/60 transition-colors shrink-0"
                      />
                      <div>
                        <p className="text-sm font-semibold group-hover:text-amber-500 transition-colors flex items-center gap-1">
                          {member.name} <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-60 transition-opacity" />
                        </p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                        <p className="text-[10px] text-muted-foreground/70">{member.city}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-10 w-10 rounded-full object-cover border-2 border-border shrink-0"
                      />
                      <div>
                        <p className="text-sm font-semibold">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                        <p className="text-[10px] text-muted-foreground/70">{member.city}</p>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Bottom strip ─────────────────────────────────────────────── */}
        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} WorkHive. All rights reserved. Built for UK tradespeople.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>🇬🇧 United Kingdom</span>
            <span>·</span>
            <Link to="/signup" className="hover:text-amber-500 transition-colors">Sign Up Free</Link>
            <span>·</span>
            <Link to="/login" className="hover:text-amber-500 transition-colors">Log In</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
