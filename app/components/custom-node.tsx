"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Play, Webhook, Globe, Settings, Database, Mail, Calendar, FileText, Zap, AirVent, GitBranch, Grid3X3, Merge, ArrowRightLeft, Clock, Code, Code2, FileCode, FileSpreadsheet, FolderOpen, List, MessageCircle, MessageSquare, Rss, Scissors, Server, Sheet, Shield, Terminal, Braces, AlertTriangle, Archive, ArrowUpDown, BookOpen, Bot, Brain, Calculator, Camera, CheckSquare, Circle, Cloud, CloudCog, CloudSnow, Copy, CreditCard, DollarSign, FileEdit, FileQuestion, Filter, GitCompare, Globe2, HeadphonesIcon, KanbanSquare, MousePointer, Music, Package, Palette, PenTool, Phone, PieChart, RotateCcw, Search, Share2, ShoppingCart, Store, Target, Users, Users2, Video, VideoIcon } from "lucide-react"

const getNodeIcon = (nodeType: string) => {
  const type = nodeType?.split(".").pop()?.toLowerCase() || ""
  
  switch (type) {
    case "start":
    case "trigger":
      return <Play className="w-4 h-4" />
    case "webhook":
    case "respondtowebhook":
      return <Webhook className="w-4 h-4" />
    case "httprequest":
    case "http":
      return <Globe className="w-4 h-4" />
    case "set":
    case "edit":
      return <Settings className="w-4 h-4" />
    case "mysql":
    case "postgres":
    case "postgresql":
    case "mongodb":
    case "sqlite":
      return <Database className="w-4 h-4" />
    case "gmail":
    case "email":
    case "send":
      return <Mail className="w-4 h-4" />
    case "googlecalendar":
    case "calendar":
      return <Calendar className="w-4 h-4" />
    case "readfile":
    case "writefile":
    case "readbinaryfile":
    case "writebinaryfile":
      return <FileText className="w-4 h-4" />
    case "airtable":
      return <Grid3X3 className="w-4 h-4"/>
    case "if":
    case "switch":
      return <GitBranch className="w-4 h-4" />
    case "merge":
    case "aggregate":
      return <Merge className="w-4 h-4" />
    case "wait":
      return <Clock className="w-4 h-4" />
    case "code":
    case "function":
      return <Code className="w-4 h-4" />
    case "googlesheets":
      return <Sheet className="w-4 h-4" />
    case "slack":
      return <MessageSquare className="w-4 h-4" />
    case "telegram":
      return <MessageCircle className="w-4 h-4" />
    case "twitter":
    case "x":
      return <MessageSquare className="w-4 h-4" />
    case "notion":
      return <FileText className="w-4 h-4" />
    case "microsoftexcel":
    case "excel":
      return <FileSpreadsheet className="w-4 h-4" />
    case "googledrive":
    case "dropbox":
      return <FolderOpen className="w-4 h-4" />
    case "discord":
      return <MessageSquare className="w-4 h-4" />
    case "whatsapp":
    case "whatsappbusiness":
      return <MessageCircle className="w-4 h-4" />
    case "facebook":
    case "facebookgraph":
      return <Share2 className="w-4 h-4" />
    case "instagram":
      return <Camera className="w-4 h-4" />
    case "linkedin":
      return <Users className="w-4 h-4" />
    case "youtube":
      return <Video className="w-4 h-4" />
    case "spotify":
      return <Music className="w-4 h-4" />
    case "stripe":
      return <CreditCard className="w-4 h-4" />
    case "paypal":
      return <DollarSign className="w-4 h-4" />
    case "shopify":
      return <ShoppingCart className="w-4 h-4" />
    case "woocommerce":
      return <Store className="w-4 h-4" />
    case "mailchimp":
    case "sendgrid":
    case "mandrill":
      return <Mail className="w-4 h-4" />
    case "hubspot":
    case "salesforce":
    case "pipedrive":
      return <Users2 className="w-4 h-4" />
    case "zendesk":
    case "freshdesk":
    case "intercom":
      return <HeadphonesIcon className="w-4 h-4" />
    case "trello":
    case "asana":
    case "monday":
      return <KanbanSquare className="w-4 h-4" />
    case "jira":
    case "github":
    case "gitlab":
      return <GitBranch className="w-4 h-4" />
    case "aws":
    case "awss3":
    case "awslambda":
      return <Cloud className="w-4 h-4" />
    case "googlecloud":
    case "gcp":
      return <CloudCog className="w-4 h-4" />
    case "azure":
    case "microsoftazure":
      return <CloudSnow className="w-4 h-4" />
    case "openai":
    case "chatgpt":
      return <Bot className="w-4 h-4" />
    case "anthropic":
    case "claude":
      return <Brain className="w-4 h-4" />
    case "redis":
      return <Database className="w-4 h-4" />
    case "elasticsearch":
      return <Search className="w-4 h-4" />
    case "twilio":
      return <Phone className="w-4 h-4" />
    case "calendly":
      return <Calendar className="w-4 h-4" />
    case "zoom":
    case "googlemeet":
      return <VideoIcon className="w-4 h-4" />
    case "typeform":
    case "googleforms":
      return <FileQuestion className="w-4 h-4" />
    case "quickbooks":
      return <Calculator className="w-4 h-4" />
    case "xero":
      return <PieChart className="w-4 h-4" />
    case "todoist":
      return <CheckSquare className="w-4 h-4" />
    case "clickup":
      return <Target className="w-4 h-4" />
    case "miro":
    case "figma":
      return <Palette className="w-4 h-4" />
    case "webflow":
      return <Globe2 className="w-4 h-4" />
    case "wordpress":
      return <FileEdit className="w-4 h-4" />
    case "ghost":
      return <PenTool className="w-4 h-4" />
    case "confluence":
      return <BookOpen className="w-4 h-4" />
    case "box":
    case "onedrive":
      return <FolderOpen className="w-4 h-4" />
    case "ftp":
    case "sftp":
      return <Server className="w-4 h-4" />
    case "cron":
    case "schedule":
      return <Clock className="w-4 h-4" />
    case "item":
    case "itemlists":
      return <List className="w-4 h-4" />
    case "executecommand":
      return <Terminal className="w-4 h-4" />
    case "crypto":
      return <Shield className="w-4 h-4" />
    case "movebinarydata":
      return <ArrowRightLeft className="w-4 h-4" />
    case "split":
    case "splitout":
      return <Scissors className="w-4 h-4" />
    case "splitinbatches":
      return <Package className="w-4 h-4" />
    case "sort":
      return <ArrowUpDown className="w-4 h-4" />
    case "limit":
      return <Filter className="w-4 h-4" />
    case "removedups":
    case "removeduplicates":
      return <Copy className="w-4 h-4" />
    case "dateTime":
      return <Calendar className="w-4 h-4" />
    case "html":
    case "htmlextract":
      return <Code2 className="w-4 h-4" />
    case "xml":
      return <FileCode className="w-4 h-4" />
    case "csv":
      return <FileSpreadsheet className="w-4 h-4" />
    case "json":
      return <Braces className="w-4 h-4" />
    case "rss":
      return <Rss className="w-4 h-4" />
    case "compression":
    case "zip":
      return <Archive className="w-4 h-4" />
    case "compare":
      return <GitCompare className="w-4 h-4" />
    case "loop":
    case "do":
      return <RotateCcw className="w-4 h-4" />
    case "error":
    case "stopanderror":
      return <AlertTriangle className="w-4 h-4" />
    case "noOp":
    case "noop":
      return <Circle className="w-4 h-4" />
    case "summarize":
      return <FileText className="w-4 h-4" />
    case "filter":
      return <Filter className="w-4 h-4" />
    case "fieldselector":
      return <MousePointer className="w-4 h-4" />
    default:
      return <Zap className="w-4 h-4" />
  }
}

const getNodeColor = (nodeType: string) => {
  const type = nodeType?.split(".").pop()?.toLowerCase() || ""
  
  switch (type) {
    case "start":
    case "trigger":
      return "bg-green-600"
    case "webhook":
    case "respondtowebhook":
      return "bg-orange-600"
    case "httprequest":
    case "http":
      return "bg-blue-600"
    case "set":
    case "edit":
      return "bg-purple-600"
    case "mysql":
    case "postgres":
    case "postgresql":
    case "mongodb":
    case "sqlite":
      return "bg-slate-600"
    case "gmail":
    case "email":
    case "send":
      return "bg-red-600"
    case "googlecalendar":
    case "calendar":
      return "bg-blue-500"
    case "readfile":
    case "writefile":
    case "readbinaryfile":
    case "writebinaryfile":
      return "bg-gray-600"
    case "airtable":
      return "bg-yellow-600"
    case "if":
    case "switch":
      return "bg-orange-500"
    case "merge":
    case "aggregate":
      return "bg-purple-500"
    case "wait":
      return "bg-cyan-600"
    case "code":
    case "function":
      return "bg-green-700"
    case "googlesheets":
      return "bg-green-500"
    case "slack":
      return "bg-purple-700"
    case "telegram":
      return "bg-blue-500"
    case "twitter":
    case "x":
      return "bg-sky-500"
    case "notion":
      return "bg-gray-800"
    case "microsoftexcel":
    case "excel":
      return "bg-green-600"
    case "googledrive":
      return "bg-yellow-500"
    case "dropbox":
      return "bg-blue-700"
    case "discord":
      return "bg-indigo-700"
    case "whatsapp":
    case "whatsappbusiness":
      return "bg-green-600"
    case "facebook":
    case "facebookgraph":
      return "bg-blue-600"
    case "instagram":
      return "bg-pink-600"
    case "linkedin":
      return "bg-blue-800"
    case "youtube":
      return "bg-red-600"
    case "spotify":
      return "bg-green-700"
    case "stripe":
      return "bg-purple-600"
    case "paypal":
      return "bg-blue-600"
    case "shopify":
      return "bg-green-700"
    case "woocommerce":
      return "bg-purple-700"
    case "mailchimp":
      return "bg-yellow-600"
    case "sendgrid":
      return "bg-blue-700"
    case "mandrill":
      return "bg-red-700"
    case "hubspot":
      return "bg-orange-600"
    case "salesforce":
      return "bg-blue-700"
    case "pipedrive":
      return "bg-green-600"
    case "zendesk":
      return "bg-green-700"
    case "freshdesk":
      return "bg-blue-600"
    case "intercom":
      return "bg-purple-600"
    case "trello":
      return "bg-blue-600"
    case "asana":
      return "bg-red-600"
    case "monday":
      return "bg-orange-600"
    case "jira":
      return "bg-blue-700"
    case "github":
      return "bg-gray-800"
    case "gitlab":
      return "bg-orange-700"
    case "aws":
    case "awss3":
    case "awslambda":
      return "bg-orange-600"
    case "googlecloud":
    case "gcp":
      return "bg-blue-600"
    case "azure":
    case "microsoftazure":
      return "bg-blue-700"
    case "openai":
    case "chatgpt":
      return "bg-green-700"
    case "anthropic":
    case "claude":
      return "bg-orange-700"
    case "redis":
      return "bg-red-700"
    case "elasticsearch":
      return "bg-yellow-700"
    case "twilio":
      return "bg-red-600"
    case "calendly":
      return "bg-blue-600"
    case "zoom":
      return "bg-blue-600"
    case "googlemeet":
      return "bg-green-600"
    case "typeform":
      return "bg-gray-800"
    case "googleforms":
      return "bg-purple-600"
    case "quickbooks":
      return "bg-blue-600"
    case "xero":
      return "bg-blue-700"
    case "todoist":
      return "bg-red-600"
    case "clickup":
      return "bg-purple-700"
    case "miro":
      return "bg-yellow-600"
    case "figma":
      return "bg-purple-600"
    case "webflow":
      return "bg-blue-600"
    case "wordpress":
      return "bg-blue-800"
    case "ghost":
      return "bg-gray-800"
    case "confluence":
      return "bg-blue-700"
    case "box":
      return "bg-blue-600"
    case "onedrive":
      return "bg-blue-700"
    case "ftp":
    case "sftp":
      return "bg-indigo-600"
    case "cron":
    case "schedule":
      return "bg-amber-600"
    case "item":
    case "itemlists":
      return "bg-gray-500"
    case "executecommand":
      return "bg-gray-800"
    case "crypto":
      return "bg-amber-700"
    case "movebinarydata":
      return "bg-teal-600"
    case "split":
    case "splitout":
      return "bg-rose-600"
    case "splitinbatches":
      return "bg-pink-600"
    case "sort":
      return "bg-violet-600"
    case "limit":
      return "bg-emerald-600"
    case "removedups":
    case "removeduplicates":
      return "bg-cyan-700"
    case "dateTime":
      return "bg-indigo-500"
    case "html":
    case "htmlextract":
      return "bg-orange-700"
    case "xml":
      return "bg-red-700"
    case "csv":
      return "bg-green-700"
    case "json":
      return "bg-yellow-700"
    case "rss":
      return "bg-orange-500"
    case "compression":
    case "zip":
      return "bg-gray-700"
    case "compare":
      return "bg-teal-700"
    case "loop":
    case "do":
      return "bg-purple-800"
    case "error":
    case "stopanderror":
      return "bg-red-800"
    case "noOp":
    case "noop":
      return "bg-gray-400"
    case "summarize":
      return "bg-blue-700"
    case "filter":
      return "bg-emerald-700"
    case "fieldselector":
      return "bg-slate-700"
    default:
      return "bg-gray-500"
  }
}

function CustomNode({ data, selected }: NodeProps) {
  const nodeColor = getNodeColor(data.nodeType)
  const icon = getNodeIcon(data.nodeType)

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 min-w-[150px] ${
        selected ? "border-purple-500" : "border-gray-200"
      } ${data.disabled ? "opacity-50" : ""}`}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-gray-400" />

      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${nodeColor} text-white flex-shrink-0`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 text-sm truncate">{data.label}</div>
          <div className="text-xs text-gray-500 truncate">{data.nodeType?.split(".").pop() || "Unknown"}</div>
        </div>
      </div>

      {Object.keys(data.parameters || {}).length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-400">{Object.keys(data.parameters).length} parameter(s)</div>
        </div>
      )}

      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-gray-400" />
    </div>
  )
}

export default memo(CustomNode)
