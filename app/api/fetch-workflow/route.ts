import { type NextRequest, NextResponse } from "next/server"

const BLOB_BASE_URL = "https://n8nworkflows.blob.core.windows.net/n8nworkflow"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")

    if (!filename) {
      return NextResponse.json({ error: "Filename parameter is required" }, { status: 400 })
    }

    console.log("Server: Fetching workflow file:", filename)

    const blobUrl = `${BLOB_BASE_URL}/${filename}`
    console.log("Server: Blob URL:", blobUrl)

    // Fetch from blob storage server-side
    const response = await fetch(blobUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "n8n-workflow-viewer/1.0",
      },
      // Add timeout
      signal: AbortSignal.timeout(30000),
    })

    console.log("Server: Blob response status:", response.status)
    console.log("Server: Blob response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      console.error("Server: Blob fetch failed:", response.status, response.statusText)

      if (response.status === 404) {
        return NextResponse.json(
          {
            error: "Workflow template not found",
            filename,
            blobUrl,
            details: "The requested workflow file does not exist in blob storage",
          },
          { status: 404 },
        )
      }

      return NextResponse.json(
        {
          error: "Failed to fetch workflow from blob storage",
          status: response.status,
          statusText: response.statusText,
          filename,
          blobUrl,
        },
        { status: response.status },
      )
    }

    const content = await response.text()
    console.log("Server: Content length:", content.length)

    if (!content.trim()) {
      return NextResponse.json({ error: "Empty response from blob storage" }, { status: 500 })
    }

    // Validate JSON
    try {
      const jsonData = JSON.parse(content)
      console.log("Server: Successfully parsed JSON with", jsonData.nodes?.length || 0, "nodes")

      // Return the JSON content with proper headers
      return new NextResponse(content, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        },
      })
    } catch (parseError) {
      console.error("Server: JSON parse error:", parseError)
      return NextResponse.json(
        {
          error: "Invalid JSON in workflow file",
          filename,
          parseError: parseError instanceof Error ? parseError.message : "Unknown parse error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Server: Unexpected error:", error)

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json({ error: "Request timeout" }, { status: 408 })
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
