import { Stats } from "@/components/dashboard/Stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart, LineChart, PieChart, FileText, Camera, BarChart3, Activity } from "lucide-react"

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/teacher/enhanced">
              <BarChart3 className="h-4 w-4 mr-2" />
              Enhanced Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/teacher/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/teacher/exams">
              <FileText className="h-4 w-4 mr-2" />
              Quản lý Bài kiểm tra
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/teacher/scan">
              <Camera className="h-4 w-4 mr-2" />
              Scan Answer Sheet
            </Link>
          </Button>
        </div>
      </div>

      <Stats />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Classes</CardTitle>
            <CardDescription>Your assigned classes</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <PieChart className="h-40 w-40 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>Student distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <BarChart className="h-40 w-40 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exam Results</CardTitle>
            <CardDescription>Performance trends over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <LineChart className="h-40 w-40 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
            <CardDescription>Exams scheduled in the near future</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Exam {i}</p>
                    <p className="text-sm text-muted-foreground">Scheduled for {new Date().toLocaleDateString()}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/teacher/exams/${i}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Answer Sheets</CardTitle>
            <CardDescription>Recently scanned answer sheets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">Answer Sheet {i}</p>
                    <p className="text-sm text-muted-foreground">Scanned on {new Date().toLocaleDateString()}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/teacher/answer-sheets">View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
