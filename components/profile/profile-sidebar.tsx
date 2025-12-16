"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, MapPin, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { href: "/profile", label: "Account", icon: User },
  { href: "/profile/orders", label: "Orders", icon: Package },
  { href: "/profile/addresses", label: "Addresses", icon: MapPin },
  { href: "/profile/wishlist", label: "Wishlist", icon: Heart },
];

export function ProfileSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || 
          (item.href !== "/profile" && pathname.startsWith(item.href));
        
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn("w-full justify-start gap-2")}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 text-destructive hover:text-destructive"
        onClick={logout}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </nav>
  );
}

