import {
  Building2,
  FileBarChart,
  Home,
  WalletCards,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export function TenantMobileBottomNav() {
  const navItems = [
    {
      label: "Dashboard",
      to: "/tenant/dashboard",
      icon: Home,
    },
    {
      label: "Properties",
      to: "/tenant/properties",
      icon: Building2,
    },
    {
      label: "Transactions",
      to: "/tenant/transactions",
      icon: WalletCards,
    },
    {
      label: "Reports",
      to: "/tenant/reports",
      icon: FileBarChart,
    },
  ];

  return (
    <nav className="glass-panel ambient-shadow fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 rounded-2xl border border-slate-200 md:hidden">
      <div className="flex h-16 w-full items-center px-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex h-full flex-1 items-center justify-center"
            >
              {({ isActive }) => (
                <div
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-medium transition-all active:scale-95 ${
                    isActive
                      ? "bg-midnight-indigo/10 text-midnight-indigo"
                      : "text-slate-400"
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.label}</span>
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}