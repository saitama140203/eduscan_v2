import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, Users, BarChart, Clock, Calendar, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function ExamDetailPage({
  params,
}: {
  params: { classId: string; examId: string }
}) {
  const { classId, examId } = params

  // Mock exam data
  const exam = {
    id: examId,
    title: "Midterm Exam",
    subject: "Mathematics",
    description: "Comprehensive exam covering chapters 1-5",
    date: "April 30, 2025",
    duration: 90,
    totalQuestions: 50,
    passingScore: 60,
    status: "completed",
    averageScore: 75,
    highestScore: 98,
    lowestScore: 45,
    submissionRate: "32/32",
    classId: classId,
    className: "Grade 10A - Mathematics",
  }

  // Mock student results
  const studentResults = Array.from({ length: 10 }, (_, i) => ({
    id: `student-${i + 1}`,
    name: `Student ${i + 1}`,
    rollNumber: `S10${i.toString().padStart(3, "0")}`,
    score: Math.floor(Math.random() * 55) + 45,
    correctAnswers: Math.floor(Math.random() * 40) + 10,
    status: Math.random() > 0.2 ? "completed" : "absent",
    submittedAt: "April 30, 2025",
  }))

  // Mock question analysis
  const questionAnalysis = Array.from({ length: 10 }, (_, i) => ({
    questionNumber: i + 1,
    correctRate: Math.floor(Math.random() * 100),
    difficulty: Math.random() > 0.7 ? "hard" : Math.random() > 0.4 ? "medium" : "easy",
  }))

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{exam.title}</h1>
          <p className="text-muted-foreground">
            {exam.className} • {exam.subject}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Results
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/teacher/scan">
              <FileText className="mr-2 h-4 w-4" /> Scan Answer Sheets
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/teacher/classes/${classId}/exams/${examId}/reports`}>
              <BarChart className="mr-2 h-4 w-4" /> View Reports
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">{exam.date}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">{exam.duration} minutes</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">{exam.totalQuestions} questions</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">{exam.submissionRate}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{exam.averageScore}%</div>
            <p className="text-sm text-muted-foreground">Passing score: {exam.passingScore}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Highest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{exam.highestScore}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Lowest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{exam.lowestScore}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="results">Student Results</TabsTrigger>
          <TabsTrigger value="questions">Question Analysis</TabsTrigger>
          <TabsTrigger value="details">Exam Details</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Student Results</CardTitle>
                  <CardDescription>Individual performance for each student</CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" /> Export Results
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Student</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Score</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Correct Answers</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Submitted</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {studentResults.map((result) => (
                        <tr
                          key={result.id}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">
                            <div>
                              <div className="font-medium">{result.name}</div>
                              <div className="text-xs text-muted-foreground">{result.rollNumber}</div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            {result.status === "completed" ? (
                              <span
                                className={`font-medium ${
                                  result.score >= exam.passingScore ? "text-green-500" : "text-red-500"
                                }`}
                              >
                                {result.score}%
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="p-4 align-middle">
                            {result.status === "completed" ? `${result.correctAnswers}/${exam.totalQuestions}` : "-"}
                          </td>
                          <td className="p-4 align-middle">
                            {result.status === "completed" ? (
                              <Badge className="bg-green-500">
                                <CheckCircle className="mr-1 h-3 w-3" /> Completed
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="mr-1 h-3 w-3" /> Absent
                              </Badge>
                            )}
                          </td>
                          <td className="p-4 align-middle">
                            {result.status === "completed" ? result.submittedAt : "-"}
                          </td>
                          <td className="p-4 align-middle">
                            {result.status === "completed" && (
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Question Analysis</CardTitle>
              <CardDescription>Performance breakdown by question</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Question</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Correct Rate</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Difficulty</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {questionAnalysis.map((question) => (
                        <tr
                          key={question.questionNumber}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle font-medium">Question {question.questionNumber}</td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    question.correctRate > 70
                                      ? "bg-green-500"
                                      : question.correctRate > 40
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  }`}
                                  style={{ width: `${question.correctRate}%` }}
                                ></div>
                              </div>
                              <span>{question.correctRate}%</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <Badge
                              className={
                                question.difficulty === "easy"
                                  ? "bg-green-500"
                                  : question.difficulty === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }
                            >
                              {question.difficulty}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Exam Details</CardTitle>
              <CardDescription>Information about this exam</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Description</h3>
                <p className="text-muted-foreground">{exam.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium">Exam Information</h3>
                  <ul className="space-y-2 mt-2">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Subject:</span>
                      <span>{exam.subject}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{exam.date}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{exam.duration} minutes</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Total Questions:</span>
                      <span>{exam.totalQuestions}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Passing Score:</span>
                      <span>{exam.passingScore}%</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Results Summary</h3>
                  <ul className="space-y-2 mt-2">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Average Score:</span>
                      <span>{exam.averageScore}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Highest Score:</span>
                      <span>{exam.highestScore}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Lowest Score:</span>
                      <span>{exam.lowestScore}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Submission Rate:</span>
                      <span>{exam.submissionRate}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Pass Rate:</span>
                      <span>
                        {Math.round(
                          (studentResults.filter((r) => r.status === "completed" && r.score >= exam.passingScore)
                            .length /
                            studentResults.filter((r) => r.status === "completed").length) *
                            100,
                        )}
                        %
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">Answer Key</h3>
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                    <span>Answer key would be displayed here in a real implementation</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
