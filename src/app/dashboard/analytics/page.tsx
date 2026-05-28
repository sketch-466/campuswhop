"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, ShoppingBag, Users, BarChart3 } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link href="/dashboard" className="mb-6 inline-flex items-center text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400">Track your performance and growth</p>
      </div>

      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: "Total Revenue", value: "₦0", color: "text-whop-accent" },
          { icon: ShoppingBag, label: "Total Sales", value: "0", color: "text-green-500" },
          { icon: Users, label: "New Members", value: "0", color: "text-blue-500" },
          { icon: TrendingUp, label: "Conversion", value: "0%", color: "text-purple-500" },
        ].map((stat) => (
          <Card key={stat.label} className="border-whop-border bg-whop-card">
            <CardContent className="p-6">
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-whop-border bg-whop-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-whop-accent" />
              Revenue Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 mb-2" />
                <p>Analytics will appear once you make sales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-whop-border bg-whop-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ShoppingBag className="mx-auto h-12 w-12 mb-2" />
                <p>Product performance data will appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
