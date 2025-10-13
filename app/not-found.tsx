import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileX } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <FileX className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            The page you're looking for doesn't exist
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>404 - Not Found</CardTitle>
            <CardDescription>
              The requested page could not be found
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              The page you're looking for might have been moved, deleted, or doesn't exist.
            </p>
            <div className="flex space-x-2">
              <Button asChild className="flex-1">
                <Link href="/">
                  Go Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/login">
                  Login
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
