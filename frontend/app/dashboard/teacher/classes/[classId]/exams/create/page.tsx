"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, ArrowLeft, Calendar, Clock, FileText, Save } from "lucide-react"

// Create a DatePicker component if it doesn't exist
function DatePicker({ value, onChange }: { value: Date | undefined; onChange: (date: Date | undefined) => void }) {
  return (
    <Input
      type="date"
      value={value ? value.toISOString().split("T")[0] : ""}
      onChange={(e) => {
        const date = e.target.value ? new Date(e.target.value) : undefined
        onChange(date)
      }}
    />
  )
}

export default function CreateExamPage({ params }: { params: { classId: string } }) {
  const classId = params.classId
  const router = useRouter()
  const { toast } = useToast()

  const [classData, setClassData] = useState<any>(null)
  const [templates, setTemplates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    date: undefined as Date | undefined,
    duration: 60,
    totalQuestions: 50,
    passingScore: 60,
    templateId: "",
    answerKey: [] as string[],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch class details
        const classDetails = await api.classes.getById(classId)
        setClassData(classDetails)

        // Fetch templates
        const templatesData = await api.templates.getAll()
        setTemplates(templatesData)

        setError(null)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load data. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [classId, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) || 0 }))
  }

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, date }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAnswerKeyChange = (questionIndex: number, answer: string) => {
    const newAnswerKey = [...formData.answerKey]
    newAnswerKey[questionIndex] = answer
    setFormData((prev) => ({ ...prev, answerKey: newAnswerKey }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title) {
      toast({
        title: "Validation Error",
        description: "Please enter an exam title.",
        variant: "destructive",
      })
      return
    }

    if (!formData.totalQuestions || formData.totalQuestions <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid number of questions.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare data for API
      const examData = {
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
        date: formData.date ? formData.date.toISOString() : null,
        duration: formData.duration,
        total_questions: formData.totalQuestions,
        passing_score: formData.passingScore,
        template_id: formData.templateId || null,
        answer_key: formData.answerKey.length > 0 ? formData.answerKey : null,
        class_id: Number.parseInt(classId),
      }

      // Create exam
      const result = await api.exams.create(examData)

      toast({
        title: "Success",
        description: "Exam created successfully!",
      })

      // Redirect to exam page
      router.push(`/dashboard/teacher/classes/${classId}/exams/${result.id}`)
    } catch (err) {
      console.error("Error creating exam:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create exam. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-64"></div>
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                  <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className="h-10 bg-gray-200 rounded animate-pulse w-32"></div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (error || !classData) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" className="mr-4" asChild>
            <Link href={`/dashboard/teacher/classes/${classId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Class
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Create Exam</h1>
        </div>

        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="rounded-full bg-red-100 p-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium">Error Loading Data</h3>
            <p className="text-muted-foreground mt-1 mb-4">{error || "Class not found"}</p>
            <Button asChild>
              <Link href={`/dashboard/teacher/classes/${classId}`}>Back to Class</Link>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" className="mr-4" asChild>
          <Link href={`/dashboard/teacher/classes/${classId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Class
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create Exam</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="details">Exam Details</TabsTrigger>
            <TabsTrigger value="settings">Exam Settings</TabsTrigger>
            <TabsTrigger value="answers">Answer Key</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Exam Details</CardTitle>
                <CardDescription>Basic information about the exam</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Exam Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Midterm Exam"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="e.g., Mathematics"
                    value={formData.subject}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide a brief description of the exam"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" /> Exam Date
                    </Label>
                    <DatePicker value={formData.date} onChange={handleDateChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration" className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" /> Duration (minutes)
                    </Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/teacher/classes/${classId}`}>Cancel</Link>
                </Button>
                <Button type="button" onClick={() => document.querySelector('[data-value="settings"]')?.click()}>
                  Next: Exam Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Exam Settings</CardTitle>
                <CardDescription>Configure exam parameters and template</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalQuestions" className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" /> Total Questions <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="totalQuestions"
                      name="totalQuestions"
                      type="number"
                      min="1"
                      value={formData.totalQuestions}
                      onChange={handleNumberChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passingScore">Passing Score (%)</Label>
                    <Input
                      id="passingScore"
                      name="passingScore"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.passingScore}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="templateId">Answer Sheet Template</Label>
                  <Select
                    value={formData.templateId}
                    onValueChange={(value) => handleSelectChange("templateId", value)}
                  >
                    <SelectTrigger id="templateId">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No template (default)</SelectItem>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id.toString()}>
                          {template.name} ({template.question_count} questions)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Templates define the layout of answer sheets. If none is selected, a default template will be used.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => document.querySelector('[data-value="details"]')?.click()}
                >
                  Back: Exam Details
                </Button>
                <Button type="button" onClick={() => document.querySelector('[data-value="answers"]')?.click()}>
                  Next: Answer Key
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="answers">
            <Card>
              <CardHeader>
                <CardTitle>Answer Key</CardTitle>
                <CardDescription>Define the correct answers for each question</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Enter the correct answer for each question. For multiple-choice questions, use A, B, C, D, etc.
                    Leave blank if you want to enter the answer key later.
                  </p>

                  <div className="border rounded-md p-4">
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: Math.min(formData.totalQuestions, 50) }).map((_, index) => (
                        <div key={index} className="space-y-1">
                          <Label htmlFor={`answer-${index + 1}`} className="text-xs">
                            Q{index + 1}
                          </Label>
                          <Input
                            id={`answer-${index + 1}`}
                            value={formData.answerKey[index] || ""}
                            onChange={(e) => handleAnswerKeyChange(index, e.target.value)}
                            className="h-8 text-center"
                            maxLength={1}
                          />
                        </div>
                      ))}
                    </div>

                    {formData.totalQuestions > 50 && (
                      <div className="mt-4 text-center text-sm text-muted-foreground">
                        Showing first 50 questions. You can edit the complete answer key after creating the exam.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => document.querySelector('[data-value="settings"]')?.click()}
                >
                  Back: Exam Settings
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Creating Exam...</>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Create Exam
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
