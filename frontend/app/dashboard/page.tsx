"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && user) {
      // Chuyển hướng người dùng dựa vào vai trò
      if (user.role === "admin") {
        router.push("/dashboard/admin");
      } else if (user.role === "manager") {
        router.push("/dashboard/manager");
      } else if (user.role === "teacher") {
        router.push("/dashboard/teacher");
      } else {
        // Nếu không có vai trò xác định, hiển thị trang unauthorized
        router.push("/dashboard/unauthorized");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-16 h-16 border-4 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bảng điều khiển</h1>
      <p className="text-muted-foreground">Đang chuyển hướng tới trang quản lý phù hợp...</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quản trị viên</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Quản lý toàn bộ hệ thống và người dùng</p>
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => router.push("/dashboard/admin")}
            >
              Truy cập <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quản lý</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Quản lý trường học, lớp học và giáo viên</p>
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => router.push("/dashboard/manager")}
            >
              Truy cập <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Giáo viên</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Quản lý lớp học và học sinh</p>
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => router.push("/dashboard/teacher")}
            >
              Truy cập <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 