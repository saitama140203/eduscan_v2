"use client"

import { useState, useCallback, memo, useMemo, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/hooks/useAuth"
import {
  ChevronLeft,
  ChevronRight,
  MenuIcon,
  BookOpen,
  Users,
  UserSquare,
  LayoutDashboard,
  Building,
  Pencil,
  LogOut,
  Settings,
  UserCog,
  BookType,
  FileSpreadsheet,
  GraduationCap,
  Scan,
  School,
  FileCheck,
  TrendingUp,
  BarChart3,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"

// Thêm description vào interface của link
interface SidebarLink {
  label: string;
  href: string;
  icon: any;
  access: string[];
  description?: string;
}

// Memoize NavLink component để tránh render lại không cần thiết
const NavLink = memo(({ 
  href, 
  isActive, 
  icon: Icon, 
  label, 
  description,
  onClick,
  isSidebarOpen
}: { 
  href: string; 
  isActive: boolean; 
  icon: any; 
  label: string; 
  description?: string;
  onClick?: () => void;
  isSidebarOpen: boolean;
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all hover:bg-muted group",
        isActive 
          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
          : "text-foreground hover:bg-muted/80",
      )}
      title={description}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {isSidebarOpen && <span className="truncate">{label}</span>}
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 bg-primary-foreground rounded-full" />
      )}
    </Link>
  )
})

NavLink.displayName = 'NavLink'

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

export function Sidebar({
  isSidebarOpen,
  toggleSidebar,
  closeSidebar,
}: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Memoize links để tránh tính toán lại không cần thiết
  const links = useMemo(() => {
    const allLinks: SidebarLink[] = [
      {
        label: "Trang chủ",
        href: "/dashboard",
        icon: LayoutDashboard,
        access: ["admin", "manager", "teacher"],
        description: "Tổng quan hệ thống"
      },
      {
        label: "Quản lý lớp học",
        href: "/dashboard/admin/classes",
        icon: BookOpen,
        access: ["admin"],
        description: "Quản lý thông tin các lớp học"
      },
      {
        label: "Quản lý học sinh",
        href: "/dashboard/admin/students",
        icon: UserSquare,
        access: ["admin"],
        description: "Quản lý thông tin học sinh"
      },
      {
        label: "Quản lý giáo viên",
        href: "/dashboard/admin/users",
        icon: Users,
        access: ["admin"],
        description: "Quản lý thông tin giáo viên và nhân viên"
      },
      {
        label: "Quản lý tổ chức",
        href: "/dashboard/admin/organizations",
        icon: Building,
        access: ["admin"],
        description: "Quản lý thông tin trường học, tổ chức"
      },
      {
        label: "Quản lý đề thi",
        href: "/dashboard/admin/exams",
        icon: FileSpreadsheet,
        access: ["admin", "manager", "teacher"],
        description: "Quản lý thông tin đề thi"
      },
      {
        label: "Mẫu đáp án",
        href: "/dashboard/admin/answer-templates",
        icon: FileCheck,
        access: ["admin"],
        description: "Cấu hình mẫu đáp án"
      },
      {
        label: "Cài đặt hệ thống",
        href: "/dashboard/admin/system-settings",
        icon: Settings,
        access: ["admin"],
        description: "Cấu hình hệ thống"
      },
      {
        label: "Phân tích hệ thống",
        href: "/dashboard/admin/system-analytics",
        icon: BarChart3,
        access: ["admin"],
        description: "Phân tích dữ liệu"
      },
      // Manager links
      {
        label: "Lớp học",
        href: "/dashboard/manager/classes",
        icon: BookOpen,
        access: ["manager"],
        description: "Quản lý lớp học của tổ chức"
      },
      {
        label: "Giáo viên",
        href: "/dashboard/manager/teachers",
        icon: Users,
        access: ["manager"],
        description: "Quản lý giáo viên trong tổ chức"
      },
      {
        label: "Học sinh",
        href: "/dashboard/manager/students",
        icon: UserSquare,
        access: ["manager"],
        description: "Quản lý học sinh trong tổ chức"
      },
      {
        label: "Đề thi",
        href: "/dashboard/manager/exams",
        icon: FileSpreadsheet,
        access: ["manager"],
        description: "Quản lý đề thi trong tổ chức"
      },
      {
        label: "Thống kê",
        href: "/dashboard/manager/statistics",
        icon: TrendingUp,
        access: ["manager"],
        description: "Xem báo cáo thống kê"
      },
      // Teacher links
      {
        label: "Lớp học của tôi",
        href: "/dashboard/teacher/classes",
        icon: BookOpen,
        access: ["teacher"],
        description: "Quản lý lớp học được phân công"
      },
      {
        label: "Học sinh",
        href: "/dashboard/teacher/students",
        icon: UserSquare,
        access: ["teacher"],
        description: "Xem thông tin học sinh"
      },
      {
        label: "Đề thi",
        href: "/dashboard/teacher/exams",
        icon: FileSpreadsheet,
        access: ["teacher"],
        description: "Quản lý đề thi"
      },
      {
        label: "Thống kê",
        href: "/dashboard/teacher/statistics",
        icon: TrendingUp,
        access: ["teacher"],
        description: "Xem báo cáo thống kê"
      },
    ]
    
    // Lọc links dựa trên quyền của user
    return allLinks.filter(link => 
      user?.role && link.access.includes(user.role)
    )
  }, [user?.role])
  
  // Phân tách logout để tránh re-render
  const handleLogout = useCallback(async () => {
    await logout()
  }, [logout])

  return (
    <>
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden" 
          onClick={() => closeSidebar()}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Button - Hiển thị ở mobile */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-40 rounded-full md:hidden shadow-md"
        onClick={toggleSidebar}
      >
        <MenuIcon className="h-4 w-4" />
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-background transition-all duration-300 ease-in-out shadow-sm md:shadow-none",
          isSidebarOpen ? "w-64 translate-x-0" : "w-16 -translate-x-full md:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Scan className="h-5 w-5 text-primary-foreground" />
            </div>
            <span
              className={cn(
                "font-semibold tracking-tight transition-opacity",
                isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
              )}
            >
              EduScan
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto rounded-full"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </Button>
        </div>

        {/* Sidebar Content */}
        <ScrollArea
          className="flex-1 overflow-auto"
          scrollHideDelay={200}
        >
          <nav className="flex-1 px-3 py-4">
            <ul className="space-y-1.5">
              {links.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
                return (
                  <li key={link.href}>
                    <NavLink 
                      href={link.href}
                      isActive={isActive}
                      icon={link.icon}
                      label={link.label}
                      description={link.description}
                      onClick={closeSidebar}
                      isSidebarOpen={isSidebarOpen}
                    />
                  </li>
                )
              })}
            </ul>
          </nav>
        </ScrollArea>

        {/* User Profile */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium leading-none truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || ''}
                </p>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "ml-auto rounded-full hover:bg-destructive/10 hover:text-destructive",
                !isSidebarOpen && "hidden"
              )}
              onClick={handleLogout}
              title="Đăng xuất"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
