import { WorkflowTemplate } from './types'

export const expenseReportTemplate: WorkflowTemplate = {
  id: 'expense-report-v1',
  name: 'Expense Report Workflow',
  description: 'Automated expense report processing with AI validation and approval routing',
  category: 'data-collection',
  tags: ['finance', 'expenses', 'reimbursement', 'automation'],
  estimatedDuration: '2-3 days',
  complexity: 'simple',

  nodes: [
    {
      id: 'start',
      type: 'start',
      position: { x: 100, y: 100 },
      data: {
        label: 'Expense Report Started',
        description: 'Employee begins expense report submission'
      }
    },
    {
      id: 'expense-form',
      type: 'form',
      position: { x: 100, y: 200 },
      data: {
        label: 'Expense Report Form',
        description: 'Submit expenses with receipts and details',
        formId: 'expense-report',
        config: {
          required: true,
          timeout: '30 days'
        }
      }
    },
    {
      id: 'ai-validation',
      type: 'ai-agent',
      position: { x: 100, y: 300 },
      data: {
        label: 'AI Expense Validation',
        description: 'Automated validation of expenses and receipts',
        agentId: 'expense-validator',
        config: {
          validateReceipts: true,
          checkPolicy: true,
          flagSuspicious: true
        }
      }
    },
    {
      id: 'amount-check',
      type: 'conditional',
      position: { x: 100, y: 400 },
      data: {
        label: 'Amount Threshold Check',
        description: 'Route based on total expense amount',
        conditions: [
          {
            field: 'totalAmount',
            operator: 'less_than',
            value: 500
          }
        ]
      }
    },
    {
      id: 'auto-approve',
      type: 'task',
      position: { x: 300, y: 500 },
      data: {
        label: 'Auto Approve',
        description: 'Automatically approve small amounts',
        config: {
          automated: true,
          conditions: ['totalAmount < 500', 'aiValidation = passed']
        }
      }
    },
    {
      id: 'manager-approval',
      type: 'approval',
      position: { x: 500, y: 500 },
      data: {
        label: 'Manager Approval',
        description: 'Manager reviews and approves expenses',
        approvers: ['${employee.manager}'],
        timeout: '3 days',
        priority: 'medium'
      }
    },
    {
      id: 'finance-approval',
      type: 'approval',
      position: { x: 700, y: 500 },
      data: {
        label: 'Finance Team Approval',
        description: 'Finance team reviews high-value expenses',
        approvers: ['finance-team'],
        timeout: '2 days',
        priority: 'high'
      }
    },
    {
      id: 'policy-violation',
      type: 'task',
      position: { x: 100, y: 600 },
      data: {
        label: 'Handle Policy Violation',
        description: 'Process expenses that violate policy',
        config: {
          assignee: 'finance-team',
          requiresExplanation: true
        }
      }
    },
    {
      id: 'reimbursement',
      type: 'task',
      position: { x: 400, y: 700 },
      data: {
        label: 'Process Reimbursement',
        description: 'Initiate payment to employee',
        config: {
          assignee: 'payroll-team',
          paymentMethod: 'direct-deposit',
          processingTime: '5-7 business days'
        }
      }
    },
    {
      id: 'accounting',
      type: 'task',
      position: { x: 400, y: 800 },
      data: {
        label: 'Accounting Entry',
        description: 'Record expenses in accounting system',
        config: {
          assignee: 'accounting-team',
          integration: 'erp-system',
          glCoding: true
        }
      }
    },
    {
      id: 'notification',
      type: 'task',
      position: { x: 400, y: 900 },
      data: {
        label: 'Payment Notification',
        description: 'Notify employee of reimbursement',
        config: {
          recipients: ['${expense.employee}'],
          template: 'reimbursement-processed'
        }
      }
    },
    {
      id: 'end',
      type: 'end',
      position: { x: 400, y: 1000 },
      data: {
        label: 'Expense Report Complete',
        description: 'Expense report processed and reimbursed'
      }
    }
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'expense-form' },
    { id: 'e2', source: 'expense-form', target: 'ai-validation' },
    {
      id: 'e3',
      source: 'ai-validation',
      target: 'amount-check',
      data: { label: 'Validation Passed' }
    },
    {
      id: 'e4',
      source: 'ai-validation',
      target: 'policy-violation',
      data: { label: 'Policy Violation Detected' }
    },
    {
      id: 'e5',
      source: 'amount-check',
      target: 'auto-approve',
      type: 'conditional',
      data: { label: 'Amount < $500', condition: 'totalAmount < 500' }
    },
    {
      id: 'e6',
      source: 'amount-check',
      target: 'manager-approval',
      type: 'conditional',
      data: { label: 'Amount $500-$2000', condition: 'totalAmount >= 500 && totalAmount < 2000' }
    },
    {
      id: 'e7',
      source: 'amount-check',
      target: 'finance-approval',
      type: 'conditional',
      data: { label: 'Amount ≥ $2000', condition: 'totalAmount >= 2000' }
    },
    {
      id: 'e8',
      source: 'auto-approve',
      target: 'reimbursement',
      data: { label: 'Approved' }
    },
    {
      id: 'e9',
      source: 'manager-approval',
      target: 'reimbursement',
      data: { label: 'Approved' }
    },
    {
      id: 'e10',
      source: 'finance-approval',
      target: 'reimbursement',
      data: { label: 'Approved' }
    },
    {
      id: 'e11',
      source: 'policy-violation',
      target: 'manager-approval',
      data: { label: 'Resolved' }
    },
    { id: 'e12', source: 'reimbursement', target: 'accounting' },
    { id: 'e13', source: 'accounting', target: 'notification' },
    { id: 'e14', source: 'notification', target: 'end' }
  ],

  formDefinition: {
    title: 'Expense Report',
    description: 'Submit your business expenses for reimbursement',
    pages: [
      {
        name: 'employeeInfo',
        title: 'Employee Information',
        elements: [
          {
            type: 'text',
            name: 'employeeName',
            title: 'Employee Name',
            isRequired: true,
            readOnly: true,
            defaultValue: '${user.name}'
          },
          {
            type: 'text',
            name: 'employeeId',
            title: 'Employee ID',
            isRequired: true,
            readOnly: true,
            defaultValue: '${user.employeeId}'
          },
          {
            type: 'text',
            name: 'department',
            title: 'Department',
            isRequired: true,
            readOnly: true,
            defaultValue: '${user.department}'
          },
          {
            type: 'text',
            name: 'reportPeriod',
            title: 'Reporting Period',
            isRequired: true,
            placeholder: 'e.g., January 2024'
          }
        ]
      },
      {
        name: 'expenses',
        title: 'Expense Details',
        elements: [
          {
            type: 'paneldynamic',
            name: 'expenseItems',
            title: 'Expense Items',
            isRequired: true,
            minPanelCount: 1,
            panelAddText: 'Add Expense',
            panelRemoveText: 'Remove',
            templateElements: [
              {
                type: 'text',
                name: 'date',
                title: 'Date',
                inputType: 'date',
                isRequired: true
              },
              {
                type: 'dropdown',
                name: 'category',
                title: 'Expense Category',
                isRequired: true,
                choices: [
                  { value: 'travel', text: 'Travel & Transportation' },
                  { value: 'meals', text: 'Meals & Entertainment' },
                  { value: 'accommodation', text: 'Accommodation' },
                  { value: 'supplies', text: 'Office Supplies' },
                  { value: 'communications', text: 'Communications' },
                  { value: 'training', text: 'Training & Development' },
                  { value: 'other', text: 'Other' }
                ]
              },
              {
                type: 'text',
                name: 'merchant',
                title: 'Merchant/Vendor',
                isRequired: true
              },
              {
                type: 'text',
                name: 'amount',
                title: 'Amount ($)',
                isRequired: true,
                inputType: 'number',
                min: 0.01
              },
              {
                type: 'text',
                name: 'description',
                title: 'Description',
                isRequired: true,
                placeholder: 'Brief description of the expense'
              },
              {
                type: 'text',
                name: 'businessPurpose',
                title: 'Business Purpose',
                isRequired: true,
                placeholder: 'Explain how this relates to business'
              },
              {
                type: 'file',
                name: 'receipt',
                title: 'Receipt',
                isRequired: true,
                acceptedTypes: '.jpg,.jpeg,.png,.pdf',
                maxSize: '5MB'
              }
            ]
          }
        ]
      },
      {
        name: 'summary',
        title: 'Summary & Submission',
        elements: [
          {
            type: 'expression',
            name: 'totalAmount',
            title: 'Total Amount',
            expression: '{expenseItems.amount.sum()}',
            displayStyle: 'currency'
          },
          {
            type: 'comment',
            name: 'additionalNotes',
            title: 'Additional Notes',
            placeholder: 'Any additional information about these expenses'
          },
          {
            type: 'boolean',
            name: 'accuracy',
            title: 'I certify that these expenses are accurate and comply with company policy',
            isRequired: true
          },
          {
            type: 'boolean',
            name: 'business',
            title: 'I certify that these expenses were incurred for legitimate business purposes',
            isRequired: true
          }
        ]
      }
    ]
  },

  aiAgents: [
    {
      id: 'expense-validator',
      name: 'Expense Validation Agent',
      type: 'data-processing',
      model: 'claude-3.5-sonnet',
      prompt: `You are an expense validation agent. Analyze expense reports for:

1. Receipt Analysis:
   - Verify receipt authenticity
   - Extract and validate amounts
   - Check dates and merchant information
   - Identify potential duplicates

2. Policy Compliance:
   - Verify expenses are within policy limits
   - Check for appropriate business justification
   - Validate expense categories
   - Flag personal vs. business expenses

3. Fraud Detection:
   - Identify suspicious patterns
   - Flag unusually high amounts
   - Detect altered receipts
   - Check for duplicate submissions

4. Data Accuracy:
   - Verify calculations
   - Check currency conversions
   - Validate expense dates
   - Ensure proper categorization

Provide clear validation results with specific flags for any issues found.`,
      capabilities: ['Receipt OCR', 'Policy Validation', 'Fraud Detection', 'Data Extraction'],
      rules: {
        autoApprove: true,
        escalationThreshold: 500,
        maxProcessingTime: '2 minutes'
      }
    }
  ],

  metadata: {
    createdBy: 'Finance Team',
    version: '1.0.0',
    lastUpdated: new Date('2024-01-12'),
    usageCount: 89,
    successRate: 96.7
  }
}