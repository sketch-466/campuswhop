import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Users, MessageSquare, Lock, ArrowLeft, Crown } from "lucide-react";
import { JoinCommunityButton } from "@/components/community/join-button";

export default async function CommunityPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: community } = await supabase
    .from("communities")
    .select("*, creator:creators(*, profile:profiles(*))")
    .eq("id", params.id)
    .eq("is_active", true)
    .single();

  if (!community) {
    notFound();
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("*, author:profiles(*)")
    .eq("community_id", params.id)
    .eq("is_premium", false)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link href="/explore" className="mb-6 inline-flex items-center text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Explore
      </Link>

      <div className="mb-8 rounded-2xl border border-whop-border bg-whop-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="h-20 w-20 rounded-2xl bg-whop-accent/10 flex items-center justify-center">
            <Users className="h-10 w-10 text-whop-accent" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{community.name}</h1>
              {community.is_paid && (
                <span className="rounded-full bg-whop-accent/10 px-3 py-1 text-xs text-whop-accent flex items-center gap-1">
                  <Crown className="h-3 w-3" />
                  Premium
                </span>
              )}
            </div>
            <p className="text-gray-400 mb-3">{community.description || "No description yet."}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {community.member_count} members
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {posts?.length || 0} posts
              </span>
              <span>Created by {community.creator?.display_name}</span>
            </div>
          </div>
          <JoinCommunityButton 
            communityId={community.id}
            isPaid={community.is_paid}
            price={community.price}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Posts</h2>
          <Button variant="outline" size="sm" className="border-whop-border text-gray-400">
            <MessageSquare className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>

        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} className="border-whop-border bg-whop-card">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-whop-accent/10 flex items-center justify-center text-sm font-bold text-whop-accent">
                    {post.author?.full_name?.[0] || post.author?.username?.[0] || "?"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white text-sm">
                        {post.author?.full_name || post.author?.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {post.title && (
                      <h3 className="font-medium text-white mb-2">{post.title}</h3>
                    )}
                    <p className="text-gray-400 text-sm whitespace-pre-wrap">{post.content}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {post.comments_count} comments
                      </span>
                      <span>{post.likes_count} likes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-whop-border bg-whop-card">
            <CardContent className="p-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No posts yet</h3>
              <p className="text-gray-400">Be the first to start a conversation!</p>
            </CardContent>
          </Card>
        )}

        {community.is_paid && (
          <Card className="border-whop-border bg-whop-card/50">
            <CardContent className="p-8 text-center">
              <Lock className="mx-auto h-12 w-12 text-whop-accent mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Premium Content</h3>
              <p className="text-gray-400 mb-4">
                Join this community to unlock exclusive posts and resources
              </p>
              <p className="text-whop-accent font-semibold">
                {formatPrice(community.price)}/month
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
