import { WorkflowTemplate } from './types'

export const purchaseApprovalTemplate: WorkflowTemplate = {
  id: 'purchase-approval-v1',
  name: 'Purchase Approval Workflow',
  description: 'Multi-level purchase approval workflow with budget-based routing and AI pre-screening',
  category: 'approval',
  tags: ['finance', 'procurement', 'approval', 'budget'],
  estimatedDuration: '2-4 hours',
  complexity: 'moderate',
  
  nodes: [
    {
      id: 'start',
      type: 'start',
      position: { x: 100, y: 100 },
      data: {
        label: 'Purchase Request Started',
        description: 'Employee submits a purchase request'
      }
    },
    {
      id: 'form',
      type: 'form',
      position: { x: 100, y: 200 },
      data: {
        label: 'Purchase Request Form',
        description: 'Collect purchase details and justification',
        formId: 'purchase-request',
        config: {
          required: true,
          timeout: '7 days'
        }
      }
    },
    {
      id: 'ai-screening',
      type: 'ai-agent',
      position: { x: 100, y: 300 },
      data: {
        label: 'AI Pre-screening',
        description: 'AI agent reviews request for policy compliance',
        agentId: 'purchase-screener',
        config: {
          autoApprove: true,
          threshold: 1000,
          timeout: '5 minutes'
        }
      }
    },
    {
      id: 'budget-check',
      type: 'conditional',
      position: { x: 100, y: 400 },
      data: {
        label: 'Budget Check',
        description: 'Route based on purchase amount',
        conditions: [
          {
            field: 'amount',
            operator: 'less_than',
            value: 1000
          }
        ]
      }
    },
    {
      id: 'manager-approval',
      type: 'approval',
      position: { x: 300, y: 500 },
      data: {
        label: 'Manager Approval',
        description: 'Direct manager reviews the request',
        approvers: ['${requester.manager}'],
        timeout: '2 days',
        priority: 'medium'
      }
    },
    {
      id: 'director-approval',
      type: 'approval',
      position: { x: 500, y: 500 },
      data: {
        label: 'Director Approval',
        description: 'Department director approval for high-value purchases',
        approvers: ['${requester.department.director}'],
        timeout: '3 days',
        priority: 'high'
      }
    },
    {
      id: 'finance-approval',
      type: 'approval',
      position: { x: 700, y: 500 },
      data: {
        label: 'Finance Approval',
        description: 'Finance team final approval',
        approvers: ['finance-team'],
        timeout: '2 days',
        priority: 'high'
      }
    },
    {
      id: 'procurement-task',
      type: 'task',
      position: { x: 400, y: 600 },
      data: {
        label: 'Procurement Processing',
        description: 'Procurement team handles the purchase',
        config: {
          assignee: 'procurement-team',
          instructions: 'Process the approved purchase request according to company procurement policies'
        }
      }
    },
    {
      id: 'notification',
      type: 'task',
      position: { x: 400, y: 700 },
      data: {
        label: 'Notify Requester',
        description: 'Send completion notification',
        config: {
          type: 'notification',
          recipients: ['${requester}', '${requester.manager}'],
          template: 'purchase-complete'
        }
      }
    },
    {
      id: 'end',
      type: 'end',
      position: { x: 400, y: 800 },
      data: {
        label: 'Purchase Complete',
        description: 'Purchase request has been processed'
      }
    }
  ],

  edges: [
    {
      id: 'e1',
      source: 'start',
      target: 'form'
    },
    {
      id: 'e2',
      source: 'form',
      target: 'ai-screening'
    },
    {
      id: 'e3',
      source: 'ai-screening',
      target: 'budget-check',
      data: { label: 'Passed AI screening' }
    },
    {
      id: 'e4',
      source: 'budget-check',
      target: 'manager-approval',
      type: 'conditional',
      data: { 
        label: 'Amount < $1,000',
        condition: 'amount < 1000'
      }
    },
    {
      id: 'e5',
      source: 'budget-check',
      target: 'director-approval',
      type: 'conditional',
      data: { 
        label: 'Amount $1,000 - $10,000',
        condition: 'amount >= 1000 && amount < 10000'
      }
    },
    {
      id: 'e6',
      source: 'budget-check',
      target: 'finance-approval',
      type: 'conditional',
      data: { 
        label: 'Amount >= $10,000',
        condition: 'amount >= 10000'
      }
    },
    {
      id: 'e7',
      source: 'manager-approval',
      target: 'procurement-task',
      data: { label: 'Approved' }
    },
    {
      id: 'e8',
      source: 'director-approval',
      target: 'procurement-task',
      data: { label: 'Approved' }
    },
    {
      id: 'e9',
      source: 'finance-approval',
      target: 'procurement-task',
      data: { label: 'Approved' }
    },
    {
      id: 'e10',
      source: 'procurement-task',
      target: 'notification'
    },
    {
      id: 'e11',
      source: 'notification',
      target: 'end'
    }
  ],

  formDefinition: {
    title: 'Purchase Request',
    description: 'Please provide details for your purchase request',
    pages: [
      {
        name: 'requestDetails',
        elements: [
          {
            type: 'text',
            name: 'title',
            title: 'Request Title',
            isRequired: true
          },
          {
            type: 'text',
            name: 'vendor',
            title: 'Vendor/Supplier',
            isRequired: true
          },
          {
            type: 'text',
            name: 'amount',
            title: 'Amount ($)',
            inputType: 'number',
            isRequired: true
          },
          {
            type: 'dropdown',
            name: 'category',
            title: 'Category',
            isRequired: true,
            choices: [
              'Office Supplies',
              'Software/Licenses',
              'Equipment/Hardware',
              'Professional Services',
              'Travel',
              'Marketing',
              'Other'
            ]
          },
          {
            type: 'comment',
            name: 'justification',
            title: 'Business Justification',
            isRequired: true
          },
          {
            type: 'text',
            name: 'budgetCode',
            title: 'Budget Code/GL Account'
          }
        ]
      }
    ]
  },

  aiAgents: [
    {
      id: 'purchase-screener',
      name: 'Purchase Screening Agent',
      type: 'approval',
      model: 'claude-3.5-sonnet',
      prompt: `You are a purchase screening agent. Review purchase requests for:
1. Policy compliance (vendor approved, category allowed)
2. Budget reasonableness 
3. Business justification quality
4. Required information completeness

Auto-approve requests under $1000 that meet all criteria.
Flag requests that need human review.
Provide clear reasoning for decisions.`,
      capabilities: ['Policy Checking', 'Budget Analysis', 'Auto-Approval'],
      rules: {
        autoApprove: true,
        escalationThreshold: 1000,
        maxProcessingTime: '5 minutes'
      }
    }
  ],

  metadata: {
    createdBy: 'System',
    version: '1.0.0',
    lastUpdated: new Date('2024-01-15'),
    usageCount: 145,
    successRate: 94.2
  }
}