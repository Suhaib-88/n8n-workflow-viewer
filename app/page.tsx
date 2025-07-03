"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Filter, Heart, Eye, Upload, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "../lib/supabase"
import type { Category, Workflow, WorkflowFilters } from "@/app/types/workflow"
import WorkflowViewer from "./components/workflow-viewer"
import Link from "next/link"
import { UserButton, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

const BLOB_BASE_URL = process.env.AZURE_BLOB_URL

export default function Home() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  // const [categories, setCategories] = useState<Category[]>([])
  const { isSignedIn, user, isLoaded } = useUser()
  const [loading, setLoading] = useState(true)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [workflowData, setWorkflowData] = useState<any>(null)
  const [loadingWorkflow, setLoadingWorkflow] = useState(false)
  const router = useRouter()

  const [workflowError, setWorkflowError] = useState<string>("")
  const [filters, setFilters] = useState<WorkflowFilters>({
    search: "",
    trigger: "All Types",
    complexity: "All",
    category: "All",
    activeOnly: false,
  })


    useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/landing")
      return
    }
  }, [isSignedIn, isLoaded, router])
  // Fetch workflows from Supabase
  useEffect(() => {
    async function fetchWorkflows() {
      if (!isLoaded || !isSignedIn) return
      try {
        const { data, error } = await supabase.from("workflows").select("*").order("created_at", { ascending: false })
        // const { category, error } = await supabase.from("categories").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setWorkflows(data || [])
        // setCategories(category || [])
      } catch (error) {
        console.error("Error fetching workflows:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkflows()
  }, [isSignedIn, isLoaded])

  // Fetch workflow JSON from blob storage with better error handling
  const fetchWorkflowData = async (workflow: Workflow) => {
    setLoadingWorkflow(true)
    setWorkflowError("")
    setSelectedWorkflow(workflow)
    setWorkflowData(null)

    try {
      // Ensure filename exists
      if (!workflow.filename) {
        throw new Error("No template filename found for this workflow")
      }

      const blobUrl = `${BLOB_BASE_URL}/${workflow.filename}`
      console.log("Fetching workflow from:", blobUrl)

      // Add fetch options to handle CORS and other issues
      const response = await fetch(blobUrl, {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // Add timeout
        signal: AbortSignal.timeout(30000), // 30 second timeout
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Workflow template not found: ${workflow.filename}`)
        } else if (response.status === 403) {
          throw new Error("Access denied to workflow template. Please check permissions.")
        } else if (response.status >= 500) {
          throw new Error("Server error while fetching workflow template. Please try again later.")
        } else {
          throw new Error(`Failed to fetch workflow: ${response.status} ${response.statusText}`)
        }
      }

      const contentType = response.headers.get("content-type")
      console.log("Content type:", contentType)

      let workflowJson
      try {
        const textContent = await response.text()
        console.log("Raw response (first 200 chars):", textContent.substring(0, 200))

        if (!textContent.trim()) {
          throw new Error("Empty response from server")
        }

        workflowJson = JSON.parse(textContent)
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        throw new Error("Invalid JSON format in workflow template")
      }

      // Validate basic workflow structure
      if (!workflowJson || typeof workflowJson !== "object") {
        throw new Error("Invalid workflow data: not an object")
      }

      if (!workflowJson.nodes || !Array.isArray(workflowJson.nodes)) {
        throw new Error("Invalid workflow structure: missing or invalid nodes array")
      }

      console.log("Successfully loaded workflow with", workflowJson.nodes.length, "nodes")
      setWorkflowData(workflowJson)
    } catch (error) {
      console.error("Error fetching workflow data:", error)

      let errorMessage = "Failed to load workflow"

      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        errorMessage =
          "Network error: Unable to connect to workflow storage. This might be due to CORS restrictions or network connectivity issues."
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      setWorkflowError(errorMessage)
    } finally {
      setLoadingWorkflow(false)
    }
  }

  // Test function to check blob accessibility
  const testBlobAccess = async () => {
    try {
      const testUrl = `${BLOB_BASE_URL}/test.json`
      console.log("Testing blob access:", testUrl)

      const response = await fetch(testUrl, {
        method: "HEAD",
        mode: "cors",
      })

      console.log("Test response status:", response.status)
      console.log("Test response headers:", Object.fromEntries(response.headers.entries()))
    } catch (error) {
      console.error("Blob access test failed:", error)
    }
  }

  // Filter workflows based on current filters
  const filteredWorkflows = useMemo(() => {
    return workflows.filter((workflow) => {
      const matchesSearch =
        workflow.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        workflow.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        (Array.isArray(workflow.integrations) &&
          workflow.integrations.some((integration:any) => integration.toLowerCase().includes(filters.search.toLowerCase())))

      const matchesTrigger = filters.trigger === "All Types" || workflow.trigger_type === filters.trigger
      const matchesComplexity = filters.complexity === "All" || workflow.complexity === filters.complexity
      const matchesCategory = filters.category === "All" || workflow.category === filters.category
      const matchesActive = !filters.activeOnly || workflow.active

      return matchesSearch && matchesTrigger && matchesComplexity && matchesCategory && matchesActive
    })
  }, [workflows, filters])

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Simple":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Complex":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusDots = (workflow: Workflow) => {
    const dots = []
    if (workflow.active) dots.push(<div key="active" className="w-2 h-2 bg-green-500 rounded-full" />)
    if (workflow.is_favorite) dots.push(<div key="favorite" className="w-2 h-2 bg-red-500 rounded-full" />)
    if (workflow.complexity === "Complex") dots.push(<div key="complex" className="w-2 h-2 bg-blue-500 rounded-full" />)
    return dots
  }

  const handleBackToGallery = () => {
    setSelectedWorkflow(null)
    setWorkflowData(null)
    setWorkflowError("")
  }
// Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render main content if not signed in (will redirect)
  if (!isSignedIn) {
    return null
  }
  if (selectedWorkflow) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleBackToGallery}>
                ← Back to Gallery
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedWorkflow.name}</h1>
                {loadingWorkflow && <Loader2 className="w-5 h-5 animate-spin text-gray-500" />}
              </div>
            </div>
            <div className="flex gap-2">
                          <div className="flex items-center gap-4">

              {workflowData && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: "application/json" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = selectedWorkflow.filename
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download JSON
                </Button>
              )}
              <UserButton />
            </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6">
          {loadingWorkflow ? (
            <div className="bg-white rounded-lg border border-gray-200 h-[600px] flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading workflow from blob storage...</p>
                <p className="text-sm text-gray-400 mt-2">
                  URL: {BLOB_BASE_URL}/{selectedWorkflow.filename}
                </p>
              </div>
            </div>
          ) : workflowError ? (
            <Alert variant="destructive">
              <AlertDescription>
                <div className="space-y-2">
                  <p>{workflowError}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={() => fetchWorkflowData(selectedWorkflow)}
                    >
                      Retry
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent" onClick={testBlobAccess}>
                      Test Connection
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ) : workflowData ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <WorkflowViewer workflow={workflowData} />
            </div>
          ) : null}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/landing">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center cursor-pointer">
                <Eye className="w-5 h-5 text-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">n8n Workflow Gallery</h1>
           <span className="text-sm text-gray-600">Welcome, {user?.firstName || "User"}!</span>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search workflows by name, description, or integration..."
              value={filters.search}
              onChange={(e) => setFilters((prev:any) => ({ ...prev, search: e.target.value }))}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Trigger:</span>
              <Select
                value={filters.trigger}
                onValueChange={(value) => setFilters((prev:any) => ({ ...prev, trigger: value }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Types">All Types</SelectItem>
                  <SelectItem value="Webhook">Webhook</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Complex">Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Complexity:</span>
              <Select
                value={filters.complexity}
                onValueChange={(value) => setFilters((prev:any) => ({ ...prev, complexity: value }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Simple">Low (1-5 nodes)</SelectItem>
                  <SelectItem value="Medium">Medium (6-15 nodes)</SelectItem>
                  <SelectItem value="Complex">High (16+ nodes)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters((prev:any) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="AI Agent Development">AI Agent Development</SelectItem>
                  <SelectItem value="Business Process Automation">Business Process Automation</SelectItem>
                  <SelectItem value="CRM & Sales">CRM & Sales</SelectItem>
                  <SelectItem value="Cloud Storage & File Management">Cloud Storage & File Management</SelectItem>
                  <SelectItem value="Communication & Messaging">Communication & Messaging</SelectItem>
                  <SelectItem value="Creative Content & Video Automation">Creative Content & Video Automation</SelectItem>
                  <SelectItem value="Creative Design Automation">Creative Design Automation</SelectItem>
                  <SelectItem value="Data Processing & Analysis">Data Processing & Analysis</SelectItem>
                  <SelectItem value="E-commerce & Retail">E-commerce & Retail</SelectItem>
                  <SelectItem value="Financial & Accounting">Financial & Accounting</SelectItem>
                  <SelectItem value="Marketing & Advertising Automation">Marketing & Advertising Automation</SelectItem>
                  <SelectItem value="Project Management">Project Management</SelectItem>
                  <SelectItem value="Social Media Management">Social Media Management</SelectItem>
                  <SelectItem value="Technical Infrastructure & DevOps">Technical Infrastructure & DevOps</SelectItem>
                  <SelectItem value="Uncategorized">Uncategorized</SelectItem>
                  <SelectItem value="Web Scraping & Data Extraction">Web Scraping & Data Extraction</SelectItem>

                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="active-only"
                checked={filters.activeOnly}
                onCheckedChange={(checked) => setFilters((prev:any) => ({ ...prev, activeOnly: checked as boolean }))}
              />
              <label htmlFor="active-only" className="text-sm font-medium text-gray-700">
                Active only
              </label>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {filteredWorkflows.length} workflow{filteredWorkflows.length !== 1 ? "s" : ""} found
          </div>
        </div>

        {/* Workflow Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkflows.map((workflow) => (
              <Card
                key={workflow.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => fetchWorkflowData(workflow)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">{getStatusDots(workflow)}</div>
                      <span className="text-sm text-gray-600">{workflow.node_count} nodes</span>
                      <Badge variant="secondary" className="text-xs">
                        {workflow.category}
                      </Badge>
                      <Badge className={`text-xs ${getComplexityColor(workflow.complexity)}`}>
                        {workflow.complexity}
                      </Badge>
                    </div>
                    {workflow.is_favorite && <Heart className="w-4 h-4 text-red-500 fill-current" />}
                  </div>
                  <CardTitle className="text-lg leading-tight">{workflow.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {workflow.description}
                  </CardDescription>

                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-700">
                      Integrations ({Array.isArray(workflow.integrations) ? workflow.integrations.length : 0})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(workflow.integrations) && workflow.integrations.length > 0 ? (
                        <>
                          {workflow.integrations.slice(0, 6).map((integration:any, index:any) => (
                            <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                              {integration}
                            </Badge>
                          ))}
                          {workflow.integrations.length > 6 && (
                            <Badge variant="outline" className="text-xs px-2 py-1">
                              +{workflow.integrations.length - 6}
                            </Badge>
                          )}
                        </>
                      ) : (
                        <Badge variant="outline" className="text-xs px-2 py-1 text-gray-400">
                          No integrations
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Show template filename for debugging */}
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="text-xs text-gray-400 truncate">Template: {workflow.filename || "No filename"}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredWorkflows.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>
    </div>
  )
}
