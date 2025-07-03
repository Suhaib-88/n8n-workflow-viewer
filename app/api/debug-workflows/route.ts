import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Fetch all workflows from database
    const { data: workflows, error } = await supabase.from("workflows").select("id, name, filename").limit(10)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 })
    }

    // Test blob access for each workflow
    const BLOB_BASE_URL = "https://n8nworkflows.blob.core.windows.net/n8nworkflow"
    const testResults = []

    for (const workflow of workflows || []) {
      if (workflow.filename) {
        try {
          const blobUrl = `${BLOB_BASE_URL}/${workflow.filename}`
          const response = await fetch(blobUrl, {
            method: "HEAD", // Just check if file exists
            signal: AbortSignal.timeout(5000),
          })

          testResults.push({
            id: workflow.id,
            name: workflow.name,
            filename: workflow.filename,
            blobUrl,
            status: response.status,
            exists: response.ok,
            headers: Object.fromEntries(response.headers.entries()),
          })
        } catch (error) {
          testResults.push({
            id: workflow.id,
            name: workflow.name,
            filename: workflow.filename,
            blobUrl: `${BLOB_BASE_URL}/${workflow.filename}`,
            status: "ERROR",
            exists: false,
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }
      } else {
        testResults.push({
          id: workflow.id,
          name: workflow.name,
          filename: null,
          status: "NO_FILENAME",
          exists: false,
        })
      }
    }

    return NextResponse.json({
      message: "Debug information for workflows",
      totalWorkflows: workflows?.length || 0,
      blobBaseUrl: BLOB_BASE_URL,
      testResults,
    })
  } catch (error) {
    console.error("Debug endpoint error:", error)
    return NextResponse.json(
      {
        error: "Debug endpoint failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
