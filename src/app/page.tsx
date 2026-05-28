import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, BookOpen, Zap, ArrowRight, GraduationCap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-whop-border bg-whop-card px-4 py-1.5 text-sm text-gray-400">
            <Zap className="mr-2 h-4 w-4 text-whop-accent" />
            Built for Nigerian University Students
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Monetize Your Campus{" "}
            <span className="text-whop-accent">Knowledge</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
            Sell notes, tutorials, templates, and build paid communities. 
            The creator marketplace built specifically for Nigerian students.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/explore">
              <Button size="lg" className="bg-whop-accent hover:bg-whop-accent/90 text-white">
                Explore Marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-whop-border text-white hover:bg-whop-card">
                Start Creating
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: GraduationCap, label: "Universities", value: "20+" },
              { icon: Users, label: "Students", value: "10K+" },
              { icon: BookOpen, label: "Products", value: "500+" },
              { icon: TrendingUp, label: "Creators", value: "200+" },
            ].map((stat) => (
              <Card key={stat.label} className="border-whop-border bg-whop-card">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <stat.icon className="mb-2 h-8 w-8 text-whop-accent" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">How CampusWhop Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create",
                desc: "Set up your creator profile and upload your digital products or create a community.",
              },
              {
                step: "02",
                title: "Share",
                desc: "Share your unique link with classmates and across campus social channels.",
              },
              {
                step: "03",
                title: "Earn",
                desc: "Get paid directly to your bank account. Keep 90% of every sale.",
              },
            ].map((item) => (
              <div key={item.step} className="relative rounded-2xl border border-whop-border bg-whop-card p-6">
                <div className="mb-4 text-4xl font-bold text-whop-accent/20">{item.step}</div>
                <h3 className="mb-2 text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-whop-border bg-whop-card p-8 text-center sm:p-12">
          <h2 className="mb-4 text-3xl font-bold text-white">Ready to Start Earning?</h2>
          <p className="mb-8 text-gray-400">
            Join thousands of Nigerian students already monetizing their knowledge.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-whop-accent hover:bg-whop-accent/90 text-white">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
