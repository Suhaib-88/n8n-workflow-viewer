"use client"

import { UserButton, useUser } from "@clerk/nextjs"
import { Eye, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AuthHeaderProps {
  onUploadClick?: () => void
}

export default function AuthHeader({ onUploadClick }: AuthHeaderProps) {
  const { user, isLoaded } = useUser()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">n8n Workflow Gallery</h1>
        </div>

        <div className="flex items-center gap-4">
          {isLoaded && user && (
            <>
              <span className="text-sm text-gray-600">
                Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}
              </span>
              <Button onClick={onUploadClick}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Workflow
              </Button>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
