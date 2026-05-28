"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: creator } = await supabase
        .from("creators")
        .select("id")
        .eq("profile_id", user.id)
        .single();

      let creatorId = creator?.id;

      if (!creatorId) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, full_name, university_id")
          .eq("id", user.id)
          .single();

        const { data: newCreator, error: creatorError } = await supabase
          .from("creators")
          .insert({
            profile_id: user.id,
            display_name: profile?.full_name || profile?.username || "Creator",
            handle: profile?.username || `creator_${Date.now()}`,
            university_id: profile?.university_id,
          })
          .select()
          .single();

        if (creatorError) throw creatorError;
        creatorId = newCreator.id;

        await supabase.from("profiles").update({ is_creator: true }).eq("id", user.id);
      }

      const { error: productError } = await supabase.from("products").insert({
        creator_id: creatorId,
        title,
        slug: title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        description,
        category,
        price: parseInt(price) * 100,
        is_published: false,
      });

      if (productError) throw productError;
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { value: "", label: "Select category" },
    ...PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c })),
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link href="/dashboard" className="mb-6 inline-flex items-center text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <Card className="border-whop-border bg-whop-card">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Create Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateProduct} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300">Product Title</Label>
              <Input
                id="title"
                placeholder="e.g. Complete MTH101 Notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-whop-border bg-whop-black text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-300">Category</Label>
              <Select
                id="category"
                options={categoryOptions}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="border-whop-border bg-whop-black text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-300">Price (₦)</Label>
              <Input
                id="price"
                type="number"
                placeholder="500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                className="border-whop-border bg-whop-black text-white"
              />
              <p className="text-xs text-gray-500">Set 0 for free products</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <textarea
                id="description"
                placeholder="Describe what students will learn..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="flex w-full rounded-md border border-whop-border bg-whop-black px-3 py-2 text-sm text-white placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whop-accent"
              />
            </div>

            <div className="rounded-lg border-2 border-dashed border-whop-border p-8 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-600 mb-2" />
              <p className="text-sm text-gray-400">Drag files or click to upload</p>
              <p className="text-xs text-gray-600 mt-1">PDF, ZIP, MP4 up to 50MB</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-whop-accent hover:bg-whop-accent/90 text-white"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
