import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import { ArrowLeft, Download, Star, ShoppingCart, BookOpen } from "lucide-react";
import { PaymentButton } from "@/components/payment/payment-button";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, creator:creators(*, profile:profiles(*))")
    .eq("id", params.id)
    .eq("is_published", true)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/explore" className="mb-6 inline-flex items-center text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Explore
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video rounded-xl bg-whop-card border border-whop-border flex items-center justify-center overflow-hidden">
            {product.image_urls?.[0] ? (
              <img src={product.image_urls[0]} alt={product.title} className="h-full w-full object-cover" />
            ) : (
              <BookOpen className="h-16 w-16 text-gray-600" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-full bg-whop-accent/10 px-3 py-1 text-xs text-whop-accent">
                {product.category}
              </span>
              {product.file_type && (
                <span className="rounded-full bg-whop-border px-3 py-1 text-xs text-gray-400">
                  {product.file_type}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{product.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{product.sales_count} sales</span>
              <span>•</span>
              <span>{formatDate(product.created_at)}</span>
            </div>
          </div>

          <Card className="border-whop-border bg-whop-card">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">About this product</h2>
              <p className="text-gray-400 whitespace-pre-wrap">{product.description || "No description available."}</p>
            </CardContent>
          </Card>

          <Card className="border-whop-border bg-whop-card">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Reviews</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-bold text-white">{product.rating || "0.0"}</div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`h-5 w-5 ${star <= Math.round(product.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500">No reviews yet. Be the first to review!</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-whop-border bg-whop-card sticky top-24">
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{formatPrice(product.price)}</div>
                {product.file_size && (
                  <p className="text-sm text-gray-500 mt-1">{product.file_size}</p>
                )}
              </div>

              <PaymentButton 
                productId={product.id}
                amount={product.price}
                title={product.title}
              />

              <div className="space-y-3 pt-4 border-t border-whop-border">
                <div className="flex items-center gap-3">
                  <Download className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-400">Instant download</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-400">Secure checkout</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-whop-border bg-whop-card">
            <CardContent className="p-6">
              <Link href={`/creator/${product.creator?.handle}`} className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-whop-accent/10 flex items-center justify-center text-lg font-bold text-whop-accent">
                  {product.creator?.display_name?.[0] || "?"}
                </div>
                <div>
                  <h3 className="font-medium text-white">{product.creator?.display_name}</h3>
                  <p className="text-sm text-gray-500">@{product.creator?.handle}</p>
                </div>
              </Link>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                <span>{product.creator?.total_sales || 0} sales</span>
                <span>{product.creator?.rating || "0.0"} ★</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
