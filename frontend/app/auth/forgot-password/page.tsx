import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div>
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Forgot your password?</h2>
      <p className="mt-2 text-sm text-gray-600">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form className="mt-8 space-y-6" action="#" method="POST">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full">
            Send reset link
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
