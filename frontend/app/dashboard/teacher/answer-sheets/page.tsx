"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileCheck, FileX, Filter, Search, Download, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function AnswerSheetsPage() {
  const [selectedExam, setSelectedExam] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data
  const classes = [
    { id: "class-1", name: "Grade 10A" },
    { id: "class-2", name: "Grade 10B" },
    { id: "class-3", name: "Grade 11A" },
  ]

  const exams = [
    { id: "exam-1", name: "Math Midterm" },
    { id: "exam-2", name: "Science Final" },
    { id: "exam-3", name: "English Quiz" },
  ]

  const answerSheets = [
    {
      id: "sheet-1",
      studentName: "John Smith",
      studentId: "S10001",
      examId: "exam-1",
      examName: "Math Midterm",
      classId: "class-1",
      className: "Grade 10A",
      score: 85,
      totalQuestions: 50,
      correctAnswers: 42,
      status: "graded",
      uploadedAt: "2023-05-10T14:30:00Z",
    },
    {
      id: "sheet-2",
      studentName: "Emily Johnson",
      studentId: "S10002",
      examId: "exam-1",
      examName: "Math Midterm",
      classId: "class-1",
      className: "Grade 10A",
      score: 92,
      totalQuestions: 50,
      correctAnswers: 46,
      status: "graded",
      uploadedAt: "2023-05-10T14:35:00Z",
    },
    {
      id: "sheet-3",
      studentName: "Michael Brown",
      studentId: "S10003",
      examId: "exam-1",
      examName: "Math Midterm",
      classId: "class-1",
      className: "Grade 10A",
      score: null,
      totalQuestions: 50,
      correctAnswers: null,
      status: "processing",
      uploadedAt: "2023-05-10T14:40:00Z",
    },
    {
      id: "sheet-4",
      studentName: "Sarah Davis",
      studentId: "S10004",
      examId: "exam-2",
      examName: "Science Final",
      classId: "class-2",
      className: "Grade 10B",
      score: null,
      totalQuestions: 75,
      correctAnswers: null,
      status: "error",
      errorMessage: "Unable to detect answer markings clearly",
      uploadedAt: "2023-05-12T10:15:00Z",
    },
    {
      id: "sheet-5",
      studentName: "David Wilson",
      studentId: "S10005",
      examId: "exam-2",
      examName: "Science Final",
      classId: "class-2",
      className: "Grade 10B",
      score: 78,
      totalQuestions: 75,
      correctAnswers: 58,
      status: "graded",
      uploadedAt: "2023-05-12T10:20:00Z",
    },
  ]

  // Filter answer sheets based on selected filters
  const filteredSheets = answerSheets.filter((sheet) => {
    // Filter by exam
    if (selectedExam && sheet.examId !== selectedExam) return false

    // Filter by class
    if (selectedClass && sheet.classId !== selectedClass) return false

    // Filter by status
    if (statusFilter !== "all" && sheet.status !== statusFilter) return false

    // Filter by search query (student name or ID)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return sheet.studentName.toLowerCase().includes(query) || sheet.studentId.toLowerCase().includes(query)
    }

    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "graded":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" /> Graded
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-blue-500">
            <AlertCircle className="mr-1 h-3 w-3" /> Processing
          </Badge>
        )
      case "error":
        return (
          <Badge className="bg-red-500">
            <XCircle className="mr-1 h-3 w-3" /> Error
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Answer Sheets</h1>
        <Button asChild>
          <Link href="/dashboard/teacher/scan">Upload New Sheets</Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Answer Sheets</CardTitle>
          <CardDescription>Narrow down results by exam, class, or status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exam-filter">Exam</Label>
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger id="exam-filter">
                  <SelectValue placeholder="All Exams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exams</SelectItem>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id}>
                      {exam.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class-filter">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class-filter">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="graded">Graded</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search Student</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Name or ID"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">Student</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Exam</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Class</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Score</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Uploaded</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredSheets.map((sheet) => (
                    <tr
                      key={sheet.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">
                        <div>
                          <div className="font-medium">{sheet.studentName}</div>
                          <div className="text-xs text-muted-foreground">{sheet.studentId}</div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">{sheet.examName}</td>
                      <td className="p-4 align-middle">{sheet.className}</td>
                      <td className="p-4 align-middle">
                        {sheet.score !== null ? (
                          <div>
                            <div className="font-medium">{sheet.score}%</div>
                            <div className="text-xs text-muted-foreground">
                              {sheet.correctAnswers}/{sheet.totalQuestions} correct
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4 align-middle">{getStatusBadge(sheet.status)}</td>
                      <td className="p-4 align-middle">{new Date(sheet.uploadedAt).toLocaleDateString()}</td>
                      <td className="p-4 align-middle">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/teacher/answer-sheets/${sheet.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredSheets.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-muted-foreground">
                        No answer sheets found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSheets.map((sheet) => (
              <Card key={sheet.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{sheet.studentName}</CardTitle>
                      <CardDescription>{sheet.studentId}</CardDescription>
                    </div>
                    {getStatusBadge(sheet.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Exam</span>
                      <span className="font-medium">{sheet.examName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Class</span>
                      <span className="font-medium">{sheet.className}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Score</span>
                      <span className="font-medium">{sheet.score !== null ? `${sheet.score}%` : "-"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Correct</span>
                      <span className="font-medium">
                        {sheet.correctAnswers !== null ? `${sheet.correctAnswers}/${sheet.totalQuestions}` : "-"}
                      </span>
                    </div>
                    <div className="flex flex-col col-span-2">
                      <span className="text-muted-foreground">Uploaded</span>
                      <span className="font-medium">{new Date(sheet.uploadedAt).toLocaleString()}</span>
                    </div>

                    {sheet.status === "error" && sheet.errorMessage && (
                      <div className="flex flex-col col-span-2 mt-2">
                        <span className="text-red-500 text-xs flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" /> {sheet.errorMessage}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/teacher/answer-sheets/${sheet.id}`}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {filteredSheets.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  {statusFilter === "error" ? (
                    <FileX className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <FileCheck className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <h3 className="text-lg font-medium">No answer sheets found</h3>
                <p className="text-muted-foreground mt-1 mb-4">No answer sheets match your current filter criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedExam("")
                    setSelectedClass("")
                    setStatusFilter("all")
                    setSearchQuery("")
                  }}
                >
                  <Filter className="mr-2 h-4 w-4" /> Clear Filters
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
