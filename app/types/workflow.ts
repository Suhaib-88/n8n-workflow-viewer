export interface Workflow {
  id: string
  name: string
  description: string
  nodes: any[] | null
  connections: any
  active: boolean
  complexity: "Simple" | "Medium" | "Complex"
  category: string
  trigger_type: string
  node_count: number
  integrations: string[] | null
  created_at: string
  updated_at: string
  is_favorite?: boolean
  filename: string // Added for blob URL
}

export interface Category {
  category: string
  filename: string // Added for blob URL
}
export interface Integrations {
  category: string
  integation: string // Added for blob URL
}
export interface WorkflowFilters {
  search: string
  trigger: string
  complexity: string
  category: string
  activeOnly: boolean
}
