// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import {
  BarChart3,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Plus,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalProducts: 0,
    totalCommunities: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    setUser(session.user);

    // Fetch creator profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
    } else {
      // No profile exists — redirect to create-profile
      router.push("/create-profile");
      return;
    }

    // Fetch stats
    const { count: productCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", session.user.id);

    const { count: communityCount } = await supabase
      .from("communities")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", session.user.id);

    setStats({
      totalSales: 0,
      totalProducts: productCount || 0,
      totalCommunities: communityCount || 0,
      totalRevenue: 0,
    });

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {profile?.full_name || "Creator"}
              </h1>
              <p className="text-gray-400 mt-1">
                {profile?.university || "CampusWhop Creator"}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/dashboard/products"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Product
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            label="Total Revenue"
            value={`₦${stats.totalRevenue.toLocaleString()}`}
            trend="+0%"
          />
          <StatCard
            icon={<Package className="w-5 h-5" />}
            label="Products"
            value={stats.totalProducts.toString()}
            href="/dashboard/products"
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Communities"
            value={stats.totalCommunities.toString()}
            href="/dashboard/communities"
          />
          <StatCard
            icon={<BarChart3 className="w-5 h-5" />}
            label="Total Sales"
            value={stats.totalSales.toString()}
            trend="+0%"
          />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <QuickActionCard
            title="Upload a Product"
            description="Sell notes, templates, or digital resources"
            icon={<Package className="w-6 h-6" />}
            href="/dashboard/products"
            color="bg-blue-500/10 text-blue-400"
          />
          <QuickActionCard
            title="Create Community"
            description="Build a paid community for your coursemates"
            icon={<Users className="w-6 h-6" />}
            href="/dashboard/communities"
            color="bg-purple-500/10 text-purple-400"
          />
        </div>

        {/* Analytics Teaser */}
        <div className="mt-8">
          <Link
            href="/dashboard/analytics"
            className="flex items-center justify-between p-6 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10 text-green-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">View Analytics</h3>
                <p className="text-gray-400 text-sm">
                  Track your sales, views, and growth
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  trend,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  href?: string;
}) {
  const content = (
    <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg bg-gray-800 text-gray-400">{icon}</div>
        {trend && (
          <span className="text-xs text-green-400 font-medium">{trend}</span>
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

function QuickActionCard({
  title,
  description,
  icon,
  href,
  color,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-4 p-6 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors group"
    >
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      <div className="flex-1">
        <h3 className="font-semibold group-hover:text-green-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors mt-1" />
    </Link>
  );
}
