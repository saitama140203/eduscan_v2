import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet, Plus, Edit, Trash, Copy } from "lucide-react"

export default function TemplatesPage() {
  // Mock data
  const templates = [
    {
      id: "template-1",
      name: "Standard 50 Questions",
      description: "A4 format, 50 multiple choice questions with 4 options each",
      questions: 50,
      options: 4,
      createdAt: "2023-01-15",
    },
    {
      id: "template-2",
      name: "Standard 100 Questions",
      description: "A4 format, 100 multiple choice questions with 4 options each",
      questions: 100,
      options: 4,
      createdAt: "2023-02-20",
    },
    {
      id: "template-3",
      name: "True/False 60 Questions",
      description: "A4 format, 60 true/false questions",
      questions: 60,
      options: 2,
      createdAt: "2023-03-10",
    },
    {
      id: "template-4",
      name: "Compact 75 Questions",
      description: "A4 format, 75 multiple choice questions with 5 options each",
      questions: 75,
      options: 5,
      createdAt: "2023-04-05",
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Answer Sheet Templates</h1>
        <Button asChild>
          <Link href="/dashboard/manager/templates/create">
            <Plus className="mr-2 h-4 w-4" /> Create Template
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
                {template.name}
              </CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Questions</span>
                  <span className="font-medium">{template.questions}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Options</span>
                  <span className="font-medium">{template.options} per question</span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{new Date(template.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/manager/templates/${template.id}`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" /> Duplicate
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
