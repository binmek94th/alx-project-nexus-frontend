import {
    Home,
    Search,
    PlusSquare,
    Bell,
    User
} from "lucide-react";
import { cn } from "../utils/utils.ts";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Search", icon: Search, path: "/search" },
    { name: "Create", icon: PlusSquare, path: "/create" },
    { name: "Notifications", icon: Bell, path: "/notifications" },
    { name: "Profile", icon: User, path: "/profile" },
    { name: "Account", icon: User, path: "/account" },
];

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <>
            <div className="hidden lg:flex fixed top-15 left-0 h-full w-64 bg-[var(--paper)] border-r border-[var(--primary)] flex-col p-4 space-y-6">
                {navItems.map((item) => {
                    const active = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                                active
                                    ? "bg-[var(--primary)] text-white"
                                    : "text-[var(--text-tertiary)] hover:bg-[var(--primary-hover)] hover:text-white"
                            )}
                        >
                            <Icon size={22} />
                            <span className="text-base font-medium">{item.name}</span>
                        </button>
                    );
                })}
            </div>

            <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--paper)] border-t border-[var(--primary)] flex justify-around items-center z-50">
                {navItems.map((item) => {
                    const active = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.name}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                "flex flex-col items-center text-xs",
                                active
                                    ? "text-[var(--primary)]"
                                    : "text-[var(--text-tertiary)] hover:text-[var(--primary-hover)]"
                            )}
                        >
                            <Icon size={20} />
                            <span>{item.name}</span>
                        </button>
                    );
                })}
            </div>
        </>
    );
};

export default SideBar;
