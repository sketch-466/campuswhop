"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { NIGERIAN_UNIVERSITIES } from "@/lib/constants";
import { GraduationCap, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Registration failed");

      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        username,
        full_name: fullName,
        university_id: universityId || null,
        email_verified: false,
      });

      if (profileError) throw profileError;

      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const universityOptions = [
    { value: "", label: "Select your university" },
    ...NIGERIAN_UNIVERSITIES.map((u) => ({ value: u.id, label: u.name })),
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-whop-border bg-whop-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-whop-accent/10">
            <GraduationCap className="h-6 w-6 text-whop-accent" />
          </div>
          <CardTitle className="text-2xl text-white">Create Account</CardTitle>
          <CardDescription className="text-gray-400">
            Join the creator marketplace for Nigerian students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="border-whop-border bg-whop-black text-white placeholder:text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">Username</Label>
              <Input
                id="username"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, "").toLowerCase())}
                required
                className="border-whop-border bg-whop-black text-white placeholder:text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-whop-border bg-whop-black text-white placeholder:text-gray-600"
              />
            </div>
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
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="border-whop-border bg-whop-black text-white placeholder:text-gray-600"
              />
            </div>
            {error && (
              <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-whop-accent hover:bg-whop-accent/90 text-white"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Create Account
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-whop-accent hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
