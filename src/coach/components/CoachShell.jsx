import React from "react";
import { NavLink } from "react-router-dom";
import {
  Activity,
  Bell,
  Bot,
  CalendarDays,
  Dumbbell,
  HeartPulse,
  LayoutDashboard,
  MessageSquare,
  PackageCheck,
  Salad,
  Save,
  Sparkles,
  Target,
  Trophy,
  UserRound,
} from "lucide-react";

const navItems = [
  { to: "/coach-ai", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/coach-ai/workout-generator", label: "Workout", icon: Dumbbell },
  { to: "/coach-ai/nutrition-planner", label: "Nutrition", icon: Salad },
  { to: "/coach-ai/chat", label: "Coach Chat", icon: MessageSquare },
  { to: "/coach-ai/transformation-planner", label: "Transformation", icon: Target },
  { to: "/coach-ai/progress-tracker", label: "Progress", icon: Activity },
  { to: "/coach-ai/challenges", label: "Challenges", icon: Trophy },
  { to: "/coach-ai/body-explorer", label: "Body Explorer", icon: HeartPulse },
  { to: "/coach-ai/supplement-advisor", label: "Supplements", icon: Sparkles },
  { to: "/coach-ai/equipment-advisor", label: "Equipment", icon: PackageCheck },
  { to: "/coach-ai/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/coach-ai/reports", label: "Reports", icon: Bot },
  { to: "/coach-ai/notifications", label: "Notifications", icon: Bell },
  { to: "/coach-ai/saved-plans", label: "Saved Plans", icon: Save },
  { to: "/coach-ai/profile", label: "Profile", icon: UserRound },
];

export default function CoachShell({ children }) {
  return (
    <div className="coach-shell">
      <aside className="coach-sidebar" aria-label="RedIron Coach AI">
        <div className="coach-brand">
          <span className="coach-brand-mark">RI</span>
          <span>
            <strong>Coach AI</strong>
            <small>RedIron intelligence</small>
          </span>
        </div>
        <nav className="coach-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `coach-nav-item${isActive ? " active" : ""}`}>
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="coach-main">{children}</main>
    </div>
  );
}

