"use client";

import { usePathname } from "next/navigation"
import { 
  Users, 
  BookOpen, 
  FileText, 
  School, 
  GraduationCap,
  Scan,
  FileCheck,
  TrendingUp,
  FileSpreadsheet,
  UserCheck
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatItem {
  label: string;
  value: string;
  icon: any;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  description?: string;
}

export function Stats() {
  const pathname = usePathname()

  // Determine which stats to show based on the current path
  let stats: StatItem[] = []

  if (pathname.includes("/admin")) {
    // 🔴 ADMIN - System-wide statistics
    stats = [
      { 
        label: "Total Organizations", 
        value: "24", 
        icon: School, 
        change: "+12%",
        changeType: "positive",
        description: "Active organizations in system"
      },
      { 
        label: "Active Users", 
        value: "2,845", 
        icon: Users, 
        change: "+16%",
        changeType: "positive",
        description: "Managers and Teachers"
      },
      { 
        label: "Total Classes", 
        value: "456", 
        icon: BookOpen, 
        change: "+8%",
        changeType: "positive",
        description: "All classes across organizations"
      },
      { 
        label: "System Exams", 
        value: "1,234", 
        icon: FileText, 
        change: "+24%",
        changeType: "positive",
        description: "Total exams created"
      },
    ]
  } else if (pathname.includes("/manager")) {
    // 🟡 MANAGER - Organization-level statistics
    stats = [
      { 
        label: "Organization Classes", 
        value: "36", 
        icon: BookOpen, 
        change: "+4%",
        changeType: "positive",
        description: "Classes in your organization"
      },
      { 
        label: "Teachers", 
        value: "68", 
        icon: UserCheck, 
        change: "+6%",
        changeType: "positive",
        description: "Active teachers"
      },
      { 
        label: "Students", 
        value: "1,245", 
        icon: GraduationCap, 
        change: "+12%",
        changeType: "positive",
        description: "Enrolled students"
      },
      { 
        label: "Active Exams", 
        value: "156", 
        icon: FileText, 
        change: "+24%",
        changeType: "positive",
        description: "Exams this month"
      },
      { 
        label: "Answer Sheets", 
        value: "2,845", 
        icon: FileCheck, 
        change: "+18%",
        changeType: "positive",
        description: "Scanned this month"
      },
      { 
        label: "Templates", 
        value: "12", 
        icon: FileSpreadsheet, 
        change: "+2%",
        changeType: "positive",
        description: "Answer sheet templates"
      },
    ]
  } else if (pathname.includes("/teacher")) {
    // 🔵 TEACHER - Class-level statistics
    stats = [
      { 
        label: "My Classes", 
        value: "5", 
        icon: BookOpen, 
        change: "+1%",
        changeType: "positive",
        description: "Classes assigned to you"
      },
      { 
        label: "My Students", 
        value: "142", 
        icon: GraduationCap, 
        change: "+8%",
        changeType: "positive",
        description: "Students in your classes"
      },
      { 
        label: "Created Exams", 
        value: "24", 
        icon: FileText, 
        change: "+16%",
        changeType: "positive",
        description: "Exams you created"
      },
      { 
        label: "Scanned Sheets", 
        value: "568", 
        icon: Scan, 
        change: "+32%",
        changeType: "positive",
        description: "Answer sheets scanned"
      },
      { 
        label: "Average Score", 
        value: "78.5%", 
        icon: TrendingUp, 
        change: "+2.3%",
        changeType: "positive",
        description: "Class average performance"
      },
      { 
        label: "My Templates", 
        value: "8", 
        icon: FileSpreadsheet, 
        change: "+1%",
        changeType: "positive",
        description: "Templates you created"
      },
    ]
  }

  const getChangeColor = (changeType: "positive" | "negative" | "neutral") => {
    switch (changeType) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className="h-8 w-8 bg-primary/10 rounded-md flex items-center justify-center">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between mt-1">
                <p className={`text-xs ${getChangeColor(stat.changeType)}`}>
                  {stat.change} từ tháng trước
                </p>
              </div>
              {stat.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
