import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, Filter, TrendingUp, Users, BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default async function ExplorePage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, creator:creators(*, profile:profiles(*))")
    .eq("is_published", true)
    .order("sales_count", { ascending: false })
    .limit(12);

  const { data: creators } = await supabase
    .from("creators")
    .select("*, profile:profiles(*), university:universities(*)")
    .order("total_sales", { ascending: false })
    .limit(6);

  const { data: communities } = await supabase
    .from("communities")
    .select("*, creator:creators(*, profile:profiles(*))")
    .eq("is_active", true)
    .order("member_count", { ascending: false })
    .limit(8);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Explore Marketplace</h1>
        <p className="text-gray-400">Discover digital products and communities from Nigerian students</p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search products, creators, communities..."
            className="h-12 w-full rounded-xl border border-whop-border bg-whop-card pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-whop-accent"
          />
        </div>
        <Button variant="outline" className="border-whop-border text-gray-400 hover:text-white">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <section className="mb-12">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-whop-accent" />
          <h2 className="text-xl font-semibold text-white">Trending Creators</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {creators?.map((creator) => (
            <Link key={creator.id} href={`/creator/${creator.handle}`}>
              <Card className="border-whop-border bg-whop-card hover:border-whop-accent/50 transition-colors">
                <CardContent className="flex flex-col items-center p-4 text-center">
                  <div className="mb-3 h-16 w-16 rounded-full bg-whop-accent/10 flex items-center justify-center text-xl font-bold text-whop-accent">
                    {creator.display_name?.[0] || "?"}
                  </div>
                  <h3 className="font-medium text-white text-sm truncate w-full">{creator.display_name}</h3>
                  <p className="text-xs text-gray-500">@{creator.handle}</p>
                  <p className="text-xs text-whop-accent mt-1">{creator.total_sales} sales</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-whop-accent" />
          <h2 className="text-xl font-semibold text-white">Popular Products</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="border-whop-border bg-whop-card hover:border-whop-accent/50 transition-colors overflow-hidden">
                <div className="aspect-video bg-whop-black flex items-center justify-center">
                  {product.image_urls?.[0] ? (
                    <img src={product.image_urls[0]} alt={product.title} className="h-full w-full object-cover" />
                  ) : (
                    <BookOpen className="h-8 w-8 text-gray-600" />
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-white text-sm line-clamp-2">{product.title}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{product.creator?.display_name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-whop-accent font-semibold">{formatPrice(product.price)}</span>
                    <span className="text-xs text-gray-500">{product.sales_count} sold</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-whop-accent" />
          <h2 className="text-xl font-semibold text-white">Active Communities</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {communities?.map((community) => (
            <Link key={community.id} href={`/community/${community.id}`}>
              <Card className="border-whop-border bg-whop-card hover:border-whop-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-whop-accent/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-whop-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-sm">{community.name}</h3>
                      <p className="text-xs text-gray-500">{community.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{community.member_count} members</span>
                    <span className={community.is_paid ? "text-whop-accent" : "text-gray-500"}>
                      {community.is_paid ? formatPrice(community.price) + "/mo" : "Free"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
