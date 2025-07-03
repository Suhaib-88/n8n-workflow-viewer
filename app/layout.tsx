import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "n8n Workflow Viewer",
  description: "Visualize your n8n workflows with an interactive viewer",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if Clerk keys are available
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!clerkPublishableKey) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md mx-auto text-center p-6 bg-white rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
              <p className="text-gray-600 mb-4">
                Clerk authentication is not configured. Please add your Clerk publishable key to your environment
                variables.
              </p>
              <div className="bg-gray-100 p-4 rounded-lg text-left">
                <p className="text-sm font-mono">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...</p>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Get your keys at{" "}
                <a
                  href="https://dashboard.clerk.com/last-active?path=api-keys"
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Clerk Dashboard
                </a>
              </p>
            </div>
          </div>
        </body>
      </html>
    )
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}