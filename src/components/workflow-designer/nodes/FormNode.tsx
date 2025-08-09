'use client'

import { memo, useState } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Settings, Eye, Edit } from 'lucide-react'

interface FormNodeData {
  label: string
  description?: string
  formId?: string
  formTitle?: string
  required?: boolean
  timeout?: string
  config?: any
}

export const FormNode = memo<NodeProps<FormNodeData>>(({ data, selected }) => {
  const [showPreview, setShowPreview] = useState(false)
  
  const hasForm = data.formId || data.formTitle

  return (
    <>
      <Handle type="target" position={Position.Top} />
      
      <Card className={`min-w-48 ${selected ? 'ring-2 ring-blue-500' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
              <FileText className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{data.label}</div>
              {data.description && (
                <div className="text-xs text-gray-500 mt-1">{data.description}</div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {hasForm ? (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-700">
                Form: {data.formTitle || data.formId}
              </div>
              
              <div className="flex flex-wrap gap-1">
                {data.required && (
                  <Badge variant="outline" className="text-xs">
                    Required
                  </Badge>
                )}
                {data.timeout && (
                  <Badge variant="outline" className="text-xs">
                    {data.timeout}
                  </Badge>
                )}
              </div>

              <div className="flex gap-1 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs"
                  onClick={() => setShowPreview(true)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit Form
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-xs"
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-gray-500">No form configured</div>
              <Button
                size="sm"
                variant="outline"
                className="w-full h-6 text-xs"
              >
                <FileText className="h-3 w-3 mr-1" />
                Select Form
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Handle type="source" position={Position.Bottom} />
    </>
  )
})