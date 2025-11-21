"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Home, Send, Landmark, User } from "lucide-react"; // Import Lucide icons
import { cn } from "@/lib/utils"; // Import utility for conditional classes

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/send", label: "Send", icon: Send },
  { href: "/request", label: "Request", icon: Landmark }, // Using Landmark as a placeholder for Request
  { href: "/profile", label: "Profile", icon: User },
];

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full text-muted-foreground hover:text-primary transition-colors",
                isActive && "text-primary",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
