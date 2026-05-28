import Link from "next/link";
import { Search, Menu, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-whop-border bg-whop-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-whop-accent" />
          <span className="text-xl font-bold text-white">CampusWhop</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/explore" className="text-sm text-gray-400 hover:text-white transition-colors">
            Explore
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
            Dashboard
          </Link>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search creators, products..."
              className="h-10 w-64 rounded-full border border-whop-border bg-whop-card pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-whop-accent"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden md:block">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Log in
            </Button>
          </Link>
          <Link href="/register" className="hidden md:block">
            <Button className="bg-whop-accent hover:bg-whop-accent/90 text-white">
              Get Started
            </Button>
          </Link>
          <button className="md:hidden text-white">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
