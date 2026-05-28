"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { NIGERIAN_UNIVERSITIES } from "@/lib/constants";
import { Loader2, Sparkles } from "lucide-react";

export default function OnboardingPage() {
  const [department, setDepartment] = useState("");
  const [level, setLevel] = useState("");
  const [bio, setBio] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("profiles").update({
        university_id: universityId || null,
        department: department || null,
        level: level || null,
        bio: bio || null,
      }).eq("id", user.id);

      if (error) throw error;
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const levelOptions = [
    { value: "", label: "Select level" },
    { value: "100", label: "100 Level" },
    { value: "200", label: "200 Level" },
    { value: "300", label: "300 Level" },
    { value: "400", label: "400 Level" },
    { value: "500", label: "500 Level" },
    { value: "masters", label: "Masters" },
    { value: "phd", label: "PhD" },
  ];

  const universityOptions = [
    { value: "", label: "Select your university" },
    ...NIGERIAN_UNIVERSITIES.map((u) => ({ value: u.id, label: u.name })),
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-whop-border bg-whop-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-whop-accent/10">
            <Sparkles className="h-6 w-6 text-whop-accent" />
          </div>
          <CardTitle className="text-2xl text-white">Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleComplete} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="university" className="text-gray-300">University</Label>
              <Select
                id="university"
                options={universityOptions}
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                className="border-whop-border bg-whop-black text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="text-gray-300">Department</Label>
              <Input
                id="department"
                placeholder="e.g. Computer Science"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="border-whop-border bg-whop-black text-white placeholder:text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="level" className="text-gray-300">Level</Label>
              <Select
                id="level"
                options={levelOptions}
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="border-whop-border bg-whop-black text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-300">Bio</Label>
              <textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-whop-border bg-whop-black px-3 py-2 text-sm text-white placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whop-accent"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-whop-accent hover:bg-whop-accent/90 text-white"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Complete Setup
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
