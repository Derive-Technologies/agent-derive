import { FormTemplate } from './types'

export const formTemplates: FormTemplate[] = [
  {
    id: 'purchase-request',
    name: 'Purchase Request Form',
    description: 'Standard purchase request form for procurement workflows',
    category: 'approval',
    tags: ['procurement', 'finance', 'approval'],
    createdAt: new Date(),
    updatedAt: new Date(),
    definition: {
      title: 'Purchase Request',
      description: 'Please fill out this form to request a purchase',
      pages: [
        {
          name: 'requestDetails',
          title: 'Request Details',
          elements: [
            {
              type: 'text',
              name: 'requestTitle',
              title: 'Request Title',
              isRequired: true,
              placeholder: 'Brief description of the purchase'
            },
            {
              type: 'dropdown',
              name: 'category',
              title: 'Category',
              isRequired: true,
              choices: [
                { value: 'office-supplies', text: 'Office Supplies' },
                { value: 'software', text: 'Software/Licenses' },
                { value: 'equipment', text: 'Equipment/Hardware' },
                { value: 'services', text: 'Professional Services' },
                { value: 'travel', text: 'Travel/Accommodation' },
                { value: 'other', text: 'Other' }
              ]
            },
            {
              type: 'text',
              name: 'vendor',
              title: 'Preferred Vendor',
              isRequired: true,
              placeholder: 'Company name'
            },
            {
              type: 'text',
              name: 'amount',
              title: 'Estimated Amount',
              isRequired: true,
              inputType: 'number',
              prefix: '$'
            },
            {
              type: 'dropdown',
              name: 'urgency',
              title: 'Urgency Level',
              isRequired: true,
              choices: [
                { value: 'low', text: 'Low - Standard processing' },
                { value: 'medium', text: 'Medium - Priority processing' },
                { value: 'high', text: 'High - Urgent' },
                { value: 'critical', text: 'Critical - Emergency' }
              ]
            },
            {
              type: 'comment',
              name: 'justification',
              title: 'Business Justification',
              isRequired: true,
              placeholder: 'Please explain why this purchase is necessary and how it benefits the business'
            }
          ]
        },
        {
          name: 'budgetDetails',
          title: 'Budget Information',
          elements: [
            {
              type: 'dropdown',
              name: 'budgetCategory',
              title: 'Budget Category',
              isRequired: true,
              choices: [
                { value: 'opex', text: 'Operating Expenses (OPEX)' },
                { value: 'capex', text: 'Capital Expenses (CAPEX)' },
                { value: 'project', text: 'Project Budget' },
                { value: 'department', text: 'Department Budget' }
              ]
            },
            {
              type: 'text',
              name: 'budgetCode',
              title: 'Budget Code/GL Account',
              placeholder: 'e.g., 12345-6789'
            },
            {
              type: 'text',
              name: 'costCenter',
              title: 'Cost Center',
              placeholder: 'Department cost center'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'vendor-evaluation',
    name: 'Vendor Evaluation Form',
    description: 'Comprehensive vendor assessment and scoring form',
    category: 'evaluation',
    tags: ['procurement', 'vendor', 'evaluation'],
    createdAt: new Date(),
    updatedAt: new Date(),
    definition: {
      title: 'Vendor Evaluation',
      description: 'Please evaluate the vendor based on the following criteria',
      pages: [
        {
          name: 'vendorInfo',
          title: 'Vendor Information',
          elements: [
            {
              type: 'text',
              name: 'vendorName',
              title: 'Vendor Name',
              isRequired: true
            },
            {
              type: 'text',
              name: 'contactPerson',
              title: 'Primary Contact',
              isRequired: true
            },
            {
              type: 'text',
              name: 'email',
              title: 'Contact Email',
              isRequired: true,
              inputType: 'email'
            },
            {
              type: 'text',
              name: 'phone',
              title: 'Phone Number',
              inputType: 'tel'
            }
          ]
        },
        {
          name: 'evaluation',
          title: 'Evaluation Criteria',
          elements: [
            {
              type: 'rating',
              name: 'qualityScore',
              title: 'Product/Service Quality',
              isRequired: true,
              rateMax: 5,
              minRateDescription: 'Poor',
              maxRateDescription: 'Excellent'
            },
            {
              type: 'rating',
              name: 'pricingScore',
              title: 'Pricing Competitiveness',
              isRequired: true,
              rateMax: 5,
              minRateDescription: 'Poor',
              maxRateDescription: 'Excellent'
            },
            {
              type: 'rating',
              name: 'deliveryScore',
              title: 'Delivery/Timeline Performance',
              isRequired: true,
              rateMax: 5,
              minRateDescription: 'Poor',
              maxRateDescription: 'Excellent'
            },
            {
              type: 'rating',
              name: 'supportScore',
              title: 'Customer Support',
              isRequired: true,
              rateMax: 5,
              minRateDescription: 'Poor',
              maxRateDescription: 'Excellent'
            },
            {
              type: 'rating',
              name: 'reliabilityScore',
              title: 'Reliability/Stability',
              isRequired: true,
              rateMax: 5,
              minRateDescription: 'Poor',
              maxRateDescription: 'Excellent'
            },
            {
              type: 'comment',
              name: 'strengths',
              title: 'Key Strengths',
              placeholder: 'What are the main advantages of working with this vendor?'
            },
            {
              type: 'comment',
              name: 'concerns',
              title: 'Concerns/Weaknesses',
              placeholder: 'Any concerns or areas for improvement?'
            },
            {
              type: 'dropdown',
              name: 'recommendation',
              title: 'Overall Recommendation',
              isRequired: true,
              choices: [
                { value: 'approved', text: 'Approved - Recommend for use' },
                { value: 'conditional', text: 'Conditional - Needs improvements' },
                { value: 'rejected', text: 'Rejected - Do not recommend' }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    id: 'contract-review',
    name: 'Contract Review Form',
    description: 'Legal and business review checklist for contracts',
    category: 'approval',
    tags: ['legal', 'contract', 'review'],
    createdAt: new Date(),
    updatedAt: new Date(),
    definition: {
      title: 'Contract Review',
      description: 'Please review the contract and complete this assessment',
      pages: [
        {
          name: 'contractDetails',
          title: 'Contract Information',
          elements: [
            {
              type: 'text',
              name: 'contractTitle',
              title: 'Contract Title',
              isRequired: true
            },
            {
              type: 'text',
              name: 'counterparty',
              title: 'Counterparty/Vendor',
              isRequired: true
            },
            {
              type: 'text',
              name: 'contractValue',
              title: 'Contract Value',
              inputType: 'number',
              prefix: '$'
            },
            {
              type: 'text',
              name: 'duration',
              title: 'Contract Duration',
              placeholder: 'e.g., 12 months, 3 years'
            },
            {
              type: 'dropdown',
              name: 'contractType',
              title: 'Contract Type',
              choices: [
                { value: 'service', text: 'Service Agreement' },
                { value: 'supply', text: 'Supply Agreement' },
                { value: 'license', text: 'License Agreement' },
                { value: 'nda', text: 'Non-Disclosure Agreement' },
                { value: 'partnership', text: 'Partnership Agreement' },
                { value: 'other', text: 'Other' }
              ]
            }
          ]
        },
        {
          name: 'legalReview',
          title: 'Legal Assessment',
          elements: [
            {
              type: 'boolean',
              name: 'termsAcceptable',
              title: 'Are the terms and conditions acceptable?',
              isRequired: true
            },
            {
              type: 'boolean',
              name: 'liabilityReviewed',
              title: 'Have liability clauses been reviewed?',
              isRequired: true
            },
            {
              type: 'boolean',
              name: 'ipClauses',
              title: 'Are intellectual property clauses appropriate?',
              isRequired: true
            },
            {
              type: 'boolean',
              name: 'terminationClauses',
              title: 'Are termination clauses acceptable?',
              isRequired: true
            },
            {
              type: 'comment',
              name: 'legalConcerns',
              title: 'Legal Concerns or Required Changes',
              placeholder: 'List any legal issues that need to be addressed'
            }
          ]
        },
        {
          name: 'businessReview',
          title: 'Business Assessment',
          elements: [
            {
              type: 'boolean',
              name: 'businessNeedsmet',
              title: 'Does the contract meet business needs?',
              isRequired: true
            },
            {
              type: 'boolean',
              name: 'budgetApproved',
              title: 'Is budget approval in place?',
              isRequired: true
            },
            {
              type: 'dropdown',
              name: 'riskLevel',
              title: 'Overall Risk Assessment',
              choices: [
                { value: 'low', text: 'Low Risk' },
                { value: 'medium', text: 'Medium Risk' },
                { value: 'high', text: 'High Risk' }
              ]
            },
            {
              type: 'dropdown',
              name: 'finalRecommendation',
              title: 'Final Recommendation',
              isRequired: true,
              choices: [
                { value: 'approve', text: 'Approve for signature' },
                { value: 'approve-changes', text: 'Approve with changes' },
                { value: 'reject', text: 'Reject' },
                { value: 'needs-review', text: 'Needs further review' }
              ]
            },
            {
              type: 'comment',
              name: 'finalComments',
              title: 'Final Comments',
              placeholder: 'Any additional notes or recommendations'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'expense-report',
    name: 'Expense Report Form',
    description: 'Employee expense reporting and reimbursement form',
    category: 'data-collection',
    tags: ['finance', 'expenses', 'reimbursement'],
    createdAt: new Date(),
    updatedAt: new Date(),
    definition: {
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
              isRequired: true
            },
            {
              type: 'text',
              name: 'employeeId',
              title: 'Employee ID',
              isRequired: true
            },
            {
              type: 'text',
              name: 'department',
              title: 'Department',
              isRequired: true
            },
            {
              type: 'text',
              name: 'manager',
              title: 'Direct Manager',
              isRequired: true
            }
          ]
        },
        {
          name: 'expenseDetails',
          title: 'Expense Details',
          elements: [
            {
              type: 'text',
              name: 'reportPeriod',
              title: 'Reporting Period',
              isRequired: true,
              placeholder: 'e.g., January 2024'
            },
            {
              type: 'paneldynamic',
              name: 'expenses',
              title: 'Expense Items',
              isRequired: true,
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
                  name: 'description',
                  title: 'Description',
                  isRequired: true,
                  placeholder: 'Brief description of the expense'
                },
                {
                  type: 'text',
                  name: 'amount',
                  title: 'Amount',
                  isRequired: true,
                  inputType: 'number',
                  prefix: '$'
                },
                {
                  type: 'text',
                  name: 'businessPurpose',
                  title: 'Business Purpose',
                  isRequired: true,
                  placeholder: 'Explain the business purpose'
                }
              ],
              panelCount: 1,
              panelAddText: 'Add Expense Item',
              panelRemoveText: 'Remove'
            },
            {
              type: 'comment',
              name: 'additionalNotes',
              title: 'Additional Notes',
              placeholder: 'Any additional information about these expenses'
            }
          ]
        }
      ]
    }
  }
]