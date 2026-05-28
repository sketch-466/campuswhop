"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Shield, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Report {
  id: string;
  reporter_id: string;
  target_type: string;
  target_id: string;
  reason: string;
  description?: string;
  status: string;
  created_at: string;
  reporter?: { username: string; full_name?: string };
}

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (!profile?.is_admin) {
        router.push("/");
        return;
      }

      setIsAdmin(true);

      const { data: reportsData } = await supabase
        .from("reports")
        .select("*, reporter:profiles(username, full_name)")
        .order("created_at", { ascending: false });

      setReports(reportsData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId: string, status: "resolved" | "dismissed") => {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase
      .from("reports")
      .update({ status, resolved_by: user?.id })
      .eq("id", reportId);

    setReports(reports.map(r => r.id === reportId ? { ...r, status } : r));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-whop-accent" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const pendingReports = reports.filter(r => r.status === "pending");
  const resolvedReports = reports.filter(r => r.status !== "pending");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-whop-accent" />
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
        </div>
        <p className="text-gray-400">Moderation and platform management</p>
      </div>

      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-whop-border bg-whop-card">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-400">{pendingReports.length}</div>
            <div className="text-sm text-gray-400">Pending Reports</div>
          </CardContent>
        </Card>
        <Card className="border-whop-border bg-whop-card">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-400">{resolvedReports.length}</div>
            <div className="text-sm text-gray-400">Resolved</div>
          </CardContent>
        </Card>
        <Card className="border-whop-border bg-whop-card">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-white">{reports.length}</div>
            <div className="text-sm text-gray-400">Total Reports</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-whop-border bg-whop-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Reports Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No reports to review
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div 
                  key={report.id} 
                  className={`rounded-lg border p-4 ${report.status === "pending" ? "border-yellow-500/30 bg-yellow-500/5" : "border-whop-border"}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          report.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                          report.status === "resolved" ? "bg-green-500/10 text-green-500" :
                          "bg-gray-500/10 text-gray-500"
                        }`}>
                          {report.status}
                        </span>
                        <span className="text-xs text-gray-500">{report.target_type}</span>
                        <span className="text-xs text-gray-500">{formatDate(report.created_at)}</span>
                      </div>
                      <p className="text-sm text-white font-medium mb-1">{report.reason}</p>
                      {report.description && (
                        <p className="text-sm text-gray-400">{report.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Reported by: {report.reporter?.full_name || report.reporter?.username}
                      </p>
                    </div>
                    {report.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleResolve(report.id, "resolved")}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-400"
                          onClick={() => handleResolve(report.id, "dismissed")}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Dismiss
                        </Button>
                      </div>
                    )}
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
