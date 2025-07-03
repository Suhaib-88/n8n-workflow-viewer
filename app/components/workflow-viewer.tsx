"use client"

import { useCallback, useMemo } from "react"
import ReactFlow, {
  type Node,
  type Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionMode,
} from "reactflow"
import "reactflow/dist/style.css"
import CustomNode from "./custom-node"

interface WorkflowViewerProps {
  workflow: {
    name: string
    nodes: any[]
    connections: any
  }
}

const nodeTypes = {
  custom: CustomNode,
}

export default function WorkflowViewer({ workflow }: WorkflowViewerProps) {
  const { nodes: flowNodes, edges: flowEdges } = useMemo(() => {
    const nodes: Node[] = workflow.nodes.map((node) => ({
      id: node.name || node.id,
      type: "custom",
      position: {
        x: node.position?.[0] || Math.random() * 500,
        y: node.position?.[1] || Math.random() * 500,
      },
      data: {
        label: node.name || node.type?.split(".").pop() || "Unknown",
        nodeType: node.type,
        parameters: node.parameters || {},
        disabled: node.disabled || false,
      },
    }))

    const edges: Edge[] = []

    // Parse n8n connections format
    Object.entries(workflow.connections || {}).forEach(([sourceNodeName, connections]) => {
      const sourceConnections = connections as any
      if (sourceConnections.main) {
        sourceConnections.main.forEach((outputConnections: any[], outputIndex: number) => {
          outputConnections.forEach((connection) => {
            edges.push({
              id: `${sourceNodeName}-${connection.node}-${outputIndex}`,
              source: sourceNodeName,
              target: connection.node,
              type: "smoothstep",
              animated: true,
              style: { stroke: "#6366f1", strokeWidth: 2 },
            })
          })
        })
      }
    })

    return { nodes, edges }
  }, [workflow])

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges)

  const onConnect = useCallback((params: any) => console.log("Connection attempt:", params), [])

  return (
    <div className="w-full h-[600px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background variant="dots" gap={20} size={1} color="#e5e7eb" />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.data?.nodeType?.split(".")[1]) {
              case "start":
                return "#10b981"
              case "webhook":
                return "#f59e0b"
              case "httpRequest":
                return "#3b82f6"
              case "set":
                return "#8b5cf6"
              default:
                return "#6b7280"
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          position="bottom-right"
        />
      </ReactFlow>
    </div>
  )
}
