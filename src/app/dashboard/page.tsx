"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { 
  TrendingUp, ShoppingBag, Users, BookOpen, Plus, ArrowRight,
  DollarSign, Package, MessageSquare 
} from "lucide-react";

interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  productsCount: number;
  communitiesCount: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalRevenue: 0,
    productsCount: 0,
    communitiesCount: 0,
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: creator } = await supabase
        .from("creators")
        .select("*")
        .eq("profile_id", user.id)
        .single();

      if (creator) {
        setStats({
          totalSales: creator.total_sales || 0,
          totalRevenue: creator.total_revenue || 0,
          productsCount: 0,
          communitiesCount: 0,
        });

        const { data: products } = await supabase
          .from("products")
          .select("*")
          .eq("creator_id", creator.id)
          .order("created_at", { ascending: false })
          .limit(5);

        setRecentProducts(products || []);
      }
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin h-8 w-8 border-2 border-whop-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Manage your creator business</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="border-whop-border bg-whop-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-whop-accent/10 p-2">
                <DollarSign className="h-5 w-5 text-whop-accent" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Revenue</p>
                <p className="text-xl font-bold text-white">{formatPrice(stats.totalRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-whop-border bg-whop-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <ShoppingBag className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Sales</p>
                <p className="text-xl font-bold text-white">{stats.totalSales}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-whop-border bg-whop-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Package className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Products</p>
                <p className="text-xl font-bold text-white">{stats.productsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-whop-border bg-whop-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Communities</p>
                <p className="text-xl font-bold text-white">{stats.communitiesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/products">
          <Card className="border-whop-border bg-whop-card hover:border-whop-accent/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-whop-accent/10 p-3">
                  <Plus className="h-6 w-6 text-whop-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-white">New Product</h3>
                  <p className="text-sm text-gray-400">Sell digital products</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-500" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/communities">
          <Card className="border-whop-border bg-whop-card hover:border-whop-accent/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-3">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium text-white">New Community</h3>
                  <p className="text-sm text-gray-400">Build a paid community</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-500" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/analytics">
          <Card className="border-whop-border bg-whop-card hover:border-whop-accent/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-500/10 p-3">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Analytics</h3>
                  <p className="text-sm text-gray-400">View detailed stats</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-500" />
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="border-whop-border bg-whop-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Recent Products</CardTitle>
          <Link href="/dashboard/products">
            <Button variant="ghost" className="text-whop-accent hover:text-whop-accent/90">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-600 mb-4" />
              <p className="text-gray-400">No products yet</p>
              <Link href="/dashboard/products">
                <Button className="mt-4 bg-whop-accent hover:bg-whop-accent/90 text-white">
                  Create Your First Product
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between rounded-lg border border-whop-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-whop-accent/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-whop-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{product.title}</h4>
                      <p className="text-sm text-gray-500">{product.category} • {product.sales_count} sales</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-whop-accent font-medium">{formatPrice(product.price)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${product.is_published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {product.is_published ? "Live" : "Draft"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
