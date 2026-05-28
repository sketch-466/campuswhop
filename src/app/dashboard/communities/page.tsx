"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { COMMUNITY_TYPES } from "@/lib/constants";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import Link from "next/link";

export default function CommunitiesPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("0");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleCreateCommunity = async (e: React.FormEvent) => {
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

      const isPaid = parseInt(price) > 0;

      const { error } = await supabase.from("communities").insert({
        creator_id: creatorId,
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        description,
        type,
        price: isPaid ? parseInt(price) * 100 : 0,
        is_paid: isPaid,
      });

      if (error) throw error;
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    { value: "", label: "Select type" },
    ...COMMUNITY_TYPES.map((t) => ({ value: t, label: t })),
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link href="/dashboard" className="mb-6 inline-flex items-center text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <Card className="border-whop-border bg-whop-card">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Create Community</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCommunity} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Community Name</Label>
              <Input
                id="name"
                placeholder="e.g. UNILAG CS Study Group"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-whop-border bg-whop-black text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-gray-300">Type</Label>
              <Select
                id="type"
                options={typeOptions}
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="border-whop-border bg-whop-black text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-300">Monthly Price (₦)</Label>
              <Input
                id="price"
                type="number"
                placeholder="0 for free"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                className="border-whop-border bg-whop-black text-white"
              />
              <p className="text-xs text-gray-500">Set 0 for free community</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <textarea
                id="description"
                placeholder="What's this community about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="flex w-full rounded-md border border-whop-border bg-whop-black px-3 py-2 text-sm text-white placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whop-accent"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-whop-accent hover:bg-whop-accent/90 text-white"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
              Create Community
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
