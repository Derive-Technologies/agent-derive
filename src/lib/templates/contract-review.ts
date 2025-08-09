import { WorkflowTemplate } from './types'

export const contractReviewTemplate: WorkflowTemplate = {
  id: 'contract-review-v1',
  name: 'Contract Review Workflow',
  description: 'Legal and business review process for contracts with AI-assisted analysis and risk assessment',
  category: 'review',
  tags: ['legal', 'contracts', 'review', 'compliance'],
  estimatedDuration: '3-7 days',
  complexity: 'complex',

  nodes: [
    {
      id: 'start',
      type: 'start',
      position: { x: 100, y: 100 },
      data: {
        label: 'Contract Submitted',
        description: 'New contract submitted for review'
      }
    },
    {
      id: 'contract-form',
      type: 'form',
      position: { x: 100, y: 200 },
      data: {
        label: 'Contract Details Form',
        description: 'Collect contract information and upload document',
        formId: 'contract-details',
        config: {
          required: true,
          timeout: '2 days'
        }
      }
    },
    {
      id: 'ai-analysis',
      type: 'ai-agent',
      position: { x: 100, y: 300 },
      data: {
        label: 'AI Contract Analysis',
        description: 'AI reviews contract for key terms and risks',
        agentId: 'contract-analyzer',
        config: {
          analysisType: 'comprehensive',
          timeout: '10 minutes'
        }
      }
    },
    {
      id: 'risk-assessment',
      type: 'conditional',
      position: { x: 100, y: 400 },
      data: {
        label: 'Risk Level Assessment',
        description: 'Route based on AI risk assessment',
        conditions: [
          {
            field: 'aiRiskScore',
            operator: 'less_than',
            value: 3
          }
        ]
      }
    },
    {
      id: 'business-review',
      type: 'approval',
      position: { x: 300, y: 500 },
      data: {
        label: 'Business Review',
        description: 'Department head reviews business terms',
        approvers: ['${contract.department.head}', 'business-team'],
        timeout: '3 days',
        priority: 'medium'
      }
    },
    {
      id: 'legal-review',
      type: 'approval',
      position: { x: 500, y: 500 },
      data: {
        label: 'Legal Review',
        description: 'Legal team comprehensive review',
        approvers: ['legal-team'],
        timeout: '5 days',
        priority: 'high'
      }
    },
    {
      id: 'executive-review',
      type: 'approval',
      position: { x: 700, y: 500 },
      data: {
        label: 'Executive Review',
        description: 'Executive approval for high-risk contracts',
        approvers: ['ceo', 'cfo', 'general-counsel'],
        timeout: '3 days',
        priority: 'critical'
      }
    },
    {
      id: 'revision-needed',
      type: 'task',
      position: { x: 500, y: 600 },
      data: {
        label: 'Request Revisions',
        description: 'Send revision requests to counterparty',
        config: {
          assignee: '${contract.submitter}',
          template: 'contract-revision-request'
        }
      }
    },
    {
      id: 'final-approval',
      type: 'approval',
      position: { x: 400, y: 700 },
      data: {
        label: 'Final Approval',
        description: 'Final sign-off on revised contract',
        approvers: ['${previous.approver}'],
        timeout: '2 days',
        priority: 'high'
      }
    },
    {
      id: 'signature-prep',
      type: 'task',
      position: { x: 400, y: 800 },
      data: {
        label: 'Prepare for Signature',
        description: 'Prepare contract for electronic signature',
        config: {
          assignee: 'legal-admin',
          actions: [
            'Upload to signature platform',
            'Add signature blocks',
            'Set signing order',
            'Send for signature'
          ]
        }
      }
    },
    {
      id: 'filing',
      type: 'task',
      position: { x: 400, y: 900 },
      data: {
        label: 'File Contract',
        description: 'File signed contract in repository',
        config: {
          assignee: 'legal-admin',
          repository: 'contract-management-system',
          metadata: ['contract-type', 'expiration-date', 'renewal-terms']
        }
      }
    },
    {
      id: 'notification',
      type: 'task',
      position: { x: 400, y: 1000 },
      data: {
        label: 'Notify Stakeholders',
        description: 'Inform relevant parties of contract completion',
        config: {
          recipients: ['${contract.submitter}', '${contract.stakeholders}'],
          template: 'contract-completed'
        }
      }
    },
    {
      id: 'end',
      type: 'end',
      position: { x: 400, y: 1100 },
      data: {
        label: 'Contract Review Complete',
        description: 'Contract successfully reviewed and processed'
      }
    }
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'contract-form' },
    { id: 'e2', source: 'contract-form', target: 'ai-analysis' },
    { id: 'e3', source: 'ai-analysis', target: 'risk-assessment' },
    {
      id: 'e4',
      source: 'risk-assessment',
      target: 'business-review',
      type: 'conditional',
      data: { label: 'Low Risk (< 3)', condition: 'aiRiskScore < 3' }
    },
    {
      id: 'e5',
      source: 'risk-assessment',
      target: 'legal-review',
      type: 'conditional',
      data: { label: 'Medium Risk (3-6)', condition: 'aiRiskScore >= 3 && aiRiskScore < 7' }
    },
    {
      id: 'e6',
      source: 'risk-assessment',
      target: 'executive-review',
      type: 'conditional',
      data: { label: 'High Risk (≥ 7)', condition: 'aiRiskScore >= 7' }
    },
    {
      id: 'e7',
      source: 'business-review',
      target: 'final-approval',
      data: { label: 'Approved' }
    },
    {
      id: 'e8',
      source: 'legal-review',
      target: 'final-approval',
      data: { label: 'Approved' }
    },
    {
      id: 'e9',
      source: 'executive-review',
      target: 'final-approval',
      data: { label: 'Approved' }
    },
    {
      id: 'e10',
      source: 'business-review',
      target: 'revision-needed',
      data: { label: 'Needs Revision' }
    },
    {
      id: 'e11',
      source: 'legal-review',
      target: 'revision-needed',
      data: { label: 'Needs Revision' }
    },
    {
      id: 'e12',
      source: 'executive-review',
      target: 'revision-needed',
      data: { label: 'Needs Revision' }
    },
    {
      id: 'e13',
      source: 'revision-needed',
      target: 'contract-form',
      data: { label: 'Resubmit' }
    },
    {
      id: 'e14',
      source: 'final-approval',
      target: 'signature-prep',
      data: { label: 'Approved' }
    },
    { id: 'e15', source: 'signature-prep', target: 'filing' },
    { id: 'e16', source: 'filing', target: 'notification' },
    { id: 'e17', source: 'notification', target: 'end' }
  ],

  formDefinition: {
    title: 'Contract Review Request',
    description: 'Submit contract for legal and business review',
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
            title: 'Counterparty/Vendor Name',
            isRequired: true
          },
          {
            type: 'dropdown',
            name: 'contractType',
            title: 'Contract Type',
            isRequired: true,
            choices: [
              'Service Agreement',
              'Supply Agreement',
              'License Agreement',
              'Partnership Agreement',
              'Employment Agreement',
              'Non-Disclosure Agreement',
              'Other'
            ]
          },
          {
            type: 'text',
            name: 'contractValue',
            title: 'Contract Value ($)',
            inputType: 'number'
          },
          {
            type: 'text',
            name: 'duration',
            title: 'Contract Duration',
            placeholder: 'e.g., 12 months, 3 years'
          },
          {
            type: 'text',
            name: 'startDate',
            title: 'Proposed Start Date',
            inputType: 'date'
          },
          {
            type: 'file',
            name: 'contractDocument',
            title: 'Contract Document',
            isRequired: true,
            acceptedTypes: '.pdf,.doc,.docx'
          }
        ]
      },
      {
        name: 'businessContext',
        title: 'Business Context',
        elements: [
          {
            type: 'comment',
            name: 'businessPurpose',
            title: 'Business Purpose',
            description: 'Explain why this contract is needed',
            isRequired: true
          },
          {
            type: 'dropdown',
            name: 'priority',
            title: 'Priority Level',
            choices: ['Low', 'Medium', 'High', 'Critical'],
            defaultValue: 'Medium'
          },
          {
            type: 'text',
            name: 'requiredBy',
            title: 'Required By Date',
            inputType: 'date'
          },
          {
            type: 'checkbox',
            name: 'keyTerms',
            title: 'Key Terms to Review',
            choices: [
              'Payment terms',
              'Liability clauses',
              'Intellectual property',
              'Termination clauses',
              'Data privacy',
              'Confidentiality',
              'Service levels'
            ]
          },
          {
            type: 'comment',
            name: 'concerns',
            title: 'Specific Concerns or Questions',
            placeholder: 'Any particular areas you want reviewed carefully?'
          }
        ]
      }
    ]
  },

  aiAgents: [
    {
      id: 'contract-analyzer',
      name: 'Contract Analysis Agent',
      type: 'analysis',
      model: 'claude-3.5-sonnet',
      prompt: `You are an expert contract analysis agent. Review contracts for:

1. Key Terms Analysis:
   - Payment terms and conditions
   - Delivery/performance requirements
   - Liability and indemnification clauses
   - Termination conditions
   - Intellectual property rights
   - Confidentiality provisions

2. Risk Assessment (Score 1-10):
   - Financial risk
   - Legal/compliance risk
   - Operational risk
   - Reputational risk

3. Red Flags:
   - Unusual or unfavorable terms
   - Missing standard protections
   - Ambiguous language
   - Potential compliance issues

4. Recommendations:
   - Suggest revisions
   - Highlight areas for negotiation
   - Flag items for legal review

Provide a comprehensive analysis with clear risk scoring and actionable recommendations.`,
      capabilities: ['Contract Analysis', 'Risk Assessment', 'Term Extraction', 'Compliance Check'],
      rules: {
        maxProcessingTime: '10 minutes'
      }
    }
  ],

  metadata: {
    createdBy: 'Legal Team',
    version: '1.0.0',
    lastUpdated: new Date('2024-01-08'),
    usageCount: 28,
    successRate: 89.3
  }
}