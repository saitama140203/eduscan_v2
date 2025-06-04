import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function ResetPasswordPage() {
  return (
    <div>
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset your password</h2>
      <p className="mt-2 text-sm text-gray-600">Create a new password for your account</p>

      <form className="mt-8 space-y-6" action="#" method="POST">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New password
          </label>
          <div className="mt-1">
            <Input id="password" name="password" type="password" required className="block w-full" />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm password
          </label>
          <div className="mt-1">
            <Input id="confirmPassword" name="confirmPassword" type="password" required className="block w-full" />
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full">
            Reset password
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link href="/auth/login" className="text-sm font-medium text-primary hover:text-primary/90">
          Back to login
        </Link>
      </div>
    </div>
  )
}
