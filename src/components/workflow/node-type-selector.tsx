import React, { useState } from "react"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import {
  Search,
  Workflow,
  Zap,
  MessageSquare,
  Database,
  Mail,
  Calendar,
  FileText,
  Code,
  GitBranch,
  Timer,
  Shield,
  Globe,
  Smartphone,
  PlusCircle,
  Sparkles
} from "lucide-react"
import { cn } from "../../lib/utils"

interface NodeType {
  id: string
  name: string
  description: string
  category: "trigger" | "action" | "condition" | "integration" | "ai"
  icon: React.ComponentType<{ className?: string }>
  color: string
  isPopular?: boolean
  isNew?: boolean
}

interface NodeTypeSelectorProps {
  onNodeSelect: (nodeType: NodeType) => void
  onClose?: () => void
  className?: string
}

const nodeTypes: NodeType[] = [
  // Triggers
  {
    id: "webhook-trigger",
    name: "Webhook",
    description: "Trigger workflow from external HTTP requests",
    category: "trigger",
    icon: Globe,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    isPopular: true
  },
  {
    id: "schedule-trigger",
    name: "Schedule",
    description: "Run workflow on a timer or cron schedule",
    category: "trigger",
    icon: Timer,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    isPopular: true
  },
  {
    id: "manual-trigger",
    name: "Manual",
    description: "Start workflow manually with a button click",
    category: "trigger",
    icon: PlusCircle,
    color: "bg-gray-100 text-gray-700 border-gray-200"
  },

  // Actions
  {
    id: "email-action",
    name: "Send Email",
    description: "Send emails via SMTP or email service providers",
    category: "action",
    icon: Mail,
    color: "bg-green-100 text-green-700 border-green-200",
    isPopular: true
  },
  {
    id: "http-request",
    name: "HTTP Request",
    description: "Make HTTP requests to external APIs",
    category: "action",
    icon: Zap,
    color: "bg-orange-100 text-orange-700 border-orange-200",
    isPopular: true
  },
  {
    id: "database-query",
    name: "Database Query",
    description: "Execute SQL queries on connected databases",
    category: "action",
    icon: Database,
    color: "bg-indigo-100 text-indigo-700 border-indigo-200"
  },
  {
    id: "file-operation",
    name: "File Operation",
    description: "Read, write, or manipulate files and documents",
    category: "action",
    icon: FileText,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200"
  },
  {
    id: "slack-message",
    name: "Slack Message",
    description: "Send messages to Slack channels or users",
    category: "integration",
    icon: MessageSquare,
    color: "bg-green-100 text-green-700 border-green-200",
    isPopular: true
  },

  // Conditions
  {
    id: "if-condition",
    name: "If Condition",
    description: "Branch workflow based on conditions",
    category: "condition",
    icon: GitBranch,
    color: "bg-teal-100 text-teal-700 border-teal-200",
    isPopular: true
  },
  {
    id: "approval-gate",
    name: "Approval Gate",
    description: "Pause workflow until human approval",
    category: "condition",
    icon: Shield,
    color: "bg-red-100 text-red-700 border-red-200"
  },

  // AI Actions
  {
    id: "ai-text-generation",
    name: "AI Text Generation",
    description: "Generate text content using AI models",
    category: "ai",
    icon: Sparkles,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    isNew: true
  },
  {
    id: "ai-data-extraction",
    name: "AI Data Extraction",
    description: "Extract structured data from unstructured text",
    category: "ai",
    icon: Code,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    isNew: true
  },

  // Integrations
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Create, update, or query calendar events",
    category: "integration",
    icon: Calendar,
    color: "bg-blue-100 text-blue-700 border-blue-200"
  },
  {
    id: "mobile-notification",
    name: "Mobile Notification",
    description: "Send push notifications to mobile devices",
    category: "integration",
    icon: Smartphone,
    color: "bg-pink-100 text-pink-700 border-pink-200"
  }
]

const categoryLabels = {
  trigger: "Triggers",
  action: "Actions", 
  condition: "Conditions",
  integration: "Integrations",
  ai: "AI Actions"
}

export function NodeTypeSelector({ onNodeSelect, onClose, className }: NodeTypeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredNodes = nodeTypes.filter(node => {
    const matchesSearch = 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !selectedCategory || node.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const groupedNodes = filteredNodes.reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = []
    }
    acc[node.category].push(node)
    return acc
  }, {} as Record<string, NodeType[]>)

  const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>

  return (
    <Card className={cn("w-96", className)}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-3">Add Node</h3>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search node types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {categoryLabels[category]}
              </Button>
            ))}
          </div>
        </div>

        {/* Node list */}
        <ScrollArea className="h-96">
          <div className="p-4 space-y-6">
            {Object.entries(groupedNodes).map(([category, nodes]) => (
              <div key={category}>
                <h4 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h4>
                <div className="space-y-2">
                  {nodes.map((node) => {
                    const Icon = node.icon
                    return (
                      <button
                        key={node.id}
                        onClick={() => onNodeSelect(node)}
                        className="w-full p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-left group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-lg border",
                            node.color
                          )}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm group-hover:text-primary">
                                {node.name}
                              </span>
                              {node.isPopular && (
                                <Badge variant="secondary" className="text-xs">
                                  Popular
                                </Badge>
                              )}
                              {node.isNew && (
                                <Badge variant="info" className="text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {node.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        {onClose && (
          <div className="p-4 border-t">
            <Button variant="outline" className="w-full" onClick={onClose}>
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}