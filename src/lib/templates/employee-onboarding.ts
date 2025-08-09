import { WorkflowTemplate } from './types'

export const employeeOnboardingTemplate: WorkflowTemplate = {
  id: 'employee-onboarding-v1',
  name: 'Employee Onboarding Workflow',
  description: 'Comprehensive new hire onboarding process with AI guidance and automated task management',
  category: 'onboarding',
  tags: ['hr', 'onboarding', 'automation', 'new-hire'],
  estimatedDuration: '1-2 weeks',
  complexity: 'complex',

  nodes: [
    {
      id: 'start',
      type: 'start',
      position: { x: 100, y: 100 },
      data: {
        label: 'New Hire Started',
        description: 'New employee onboarding process begins'
      }
    },
    {
      id: 'welcome-form',
      type: 'form',
      position: { x: 100, y: 200 },
      data: {
        label: 'Welcome & Basic Info',
        description: 'Collect new hire personal and contact information',
        formId: 'welcome-form',
        config: {
          required: true,
          timeout: '3 days'
        }
      }
    },
    {
      id: 'ai-guide',
      type: 'ai-agent',
      position: { x: 100, y: 300 },
      data: {
        label: 'AI Onboarding Guide',
        description: 'AI assistant provides personalized onboarding guidance',
        agentId: 'onboarding-guide',
        config: {
          interactive: true,
          duration: '2 weeks'
        }
      }
    },
    {
      id: 'parallel-tasks',
      type: 'parallel',
      position: { x: 100, y: 400 },
      data: {
        label: 'Parallel Setup Tasks',
        description: 'Multiple onboarding tasks executed simultaneously'
      }
    },
    {
      id: 'hr-documentation',
      type: 'task',
      position: { x: 300, y: 500 },
      data: {
        label: 'HR Documentation',
        description: 'Complete employment paperwork and benefits enrollment',
        config: {
          assignee: 'hr-team',
          checklist: [
            'I-9 verification',
            'Tax forms (W-4)',
            'Benefits enrollment',
            'Emergency contacts',
            'Employee handbook acknowledgment'
          ]
        }
      }
    },
    {
      id: 'it-setup',
      type: 'task',
      position: { x: 500, y: 500 },
      data: {
        label: 'IT Account Setup',
        description: 'Create IT accounts and provide equipment',
        config: {
          assignee: 'it-team',
          checklist: [
            'Create user accounts',
            'Assign equipment (laptop, phone)',
            'Setup email and calendar',
            'Install required software',
            'Security training enrollment'
          ]
        }
      }
    },
    {
      id: 'workspace-setup',
      type: 'task',
      position: { x: 700, y: 500 },
      data: {
        label: 'Workspace Preparation',
        description: 'Prepare physical workspace and access cards',
        config: {
          assignee: 'facilities-team',
          checklist: [
            'Assign desk/office',
            'Create access cards',
            'Office supply kit',
            'Parking assignment',
            'Building orientation'
          ]
        }
      }
    },
    {
      id: 'manager-meeting',
      type: 'task',
      position: { x: 100, y: 600 },
      data: {
        label: 'Manager Welcome Meeting',
        description: 'Initial meeting with direct manager',
        config: {
          assignee: '${employee.manager}',
          duration: '1 hour',
          agenda: [
            'Role expectations',
            'Team introductions',
            'First week goals',
            'Q&A session'
          ]
        }
      }
    },
    {
      id: 'training-enrollment',
      type: 'task',
      position: { x: 300, y: 700 },
      data: {
        label: 'Training Enrollment',
        description: 'Enroll in required training programs',
        config: {
          assignee: 'learning-team',
          courses: [
            'Company culture and values',
            'Security awareness',
            'Role-specific training',
            'Compliance training'
          ]
        }
      }
    },
    {
      id: 'buddy-assignment',
      type: 'task',
      position: { x: 500, y: 700 },
      data: {
        label: 'Buddy System',
        description: 'Assign onboarding buddy for support',
        config: {
          assignee: 'hr-team',
          duration: '30 days',
          responsibilities: [
            'Daily check-ins',
            'Answer questions',
            'Social integration',
            'Feedback collection'
          ]
        }
      }
    },
    {
      id: '30-day-checkin',
      type: 'task',
      position: { x: 400, y: 800 },
      data: {
        label: '30-Day Check-in',
        description: 'Formal review after first month',
        config: {
          assignee: '${employee.manager}',
          delay: '30 days',
          agenda: [
            'Performance review',
            'Goal setting',
            'Feedback collection',
            'Support needs assessment'
          ]
        }
      }
    },
    {
      id: 'completion-survey',
      type: 'form',
      position: { x: 400, y: 900 },
      data: {
        label: 'Onboarding Feedback',
        description: 'Collect feedback on onboarding experience',
        formId: 'onboarding-feedback',
        config: {
          delay: '60 days'
        }
      }
    },
    {
      id: 'end',
      type: 'end',
      position: { x: 400, y: 1000 },
      data: {
        label: 'Onboarding Complete',
        description: 'Employee successfully onboarded'
      }
    }
  ],

  edges: [
    { id: 'e1', source: 'start', target: 'welcome-form' },
    { id: 'e2', source: 'welcome-form', target: 'ai-guide' },
    { id: 'e3', source: 'ai-guide', target: 'parallel-tasks' },
    { id: 'e4', source: 'parallel-tasks', target: 'hr-documentation' },
    { id: 'e5', source: 'parallel-tasks', target: 'it-setup' },
    { id: 'e6', source: 'parallel-tasks', target: 'workspace-setup' },
    { id: 'e7', source: 'hr-documentation', target: 'manager-meeting' },
    { id: 'e8', source: 'it-setup', target: 'manager-meeting' },
    { id: 'e9', source: 'workspace-setup', target: 'manager-meeting' },
    { id: 'e10', source: 'manager-meeting', target: 'training-enrollment' },
    { id: 'e11', source: 'manager-meeting', target: 'buddy-assignment' },
    { id: 'e12', source: 'training-enrollment', target: '30-day-checkin' },
    { id: 'e13', source: 'buddy-assignment', target: '30-day-checkin' },
    { id: 'e14', source: '30-day-checkin', target: 'completion-survey' },
    { id: 'e15', source: 'completion-survey', target: 'end' }
  ],

  formDefinition: {
    title: 'Welcome to the Team!',
    description: 'Help us get you set up for success',
    pages: [
      {
        name: 'personalInfo',
        title: 'Personal Information',
        elements: [
          {
            type: 'text',
            name: 'firstName',
            title: 'First Name',
            isRequired: true
          },
          {
            type: 'text',
            name: 'lastName',
            title: 'Last Name',
            isRequired: true
          },
          {
            type: 'text',
            name: 'email',
            title: 'Personal Email',
            inputType: 'email',
            isRequired: true
          },
          {
            type: 'text',
            name: 'phone',
            title: 'Phone Number',
            inputType: 'tel',
            isRequired: true
          },
          {
            type: 'text',
            name: 'address',
            title: 'Home Address',
            isRequired: true
          },
          {
            type: 'text',
            name: 'emergencyContact',
            title: 'Emergency Contact Name',
            isRequired: true
          },
          {
            type: 'text',
            name: 'emergencyPhone',
            title: 'Emergency Contact Phone',
            inputType: 'tel',
            isRequired: true
          }
        ]
      },
      {
        name: 'preferences',
        title: 'Work Preferences',
        elements: [
          {
            type: 'dropdown',
            name: 'workLocation',
            title: 'Preferred Work Location',
            choices: ['Office', 'Remote', 'Hybrid'],
            isRequired: true
          },
          {
            type: 'dropdown',
            name: 'startTime',
            title: 'Preferred Start Time',
            choices: ['8:00 AM', '9:00 AM', '10:00 AM', 'Flexible']
          },
          {
            type: 'comment',
            name: 'dietaryRestrictions',
            title: 'Dietary Restrictions or Allergies'
          },
          {
            type: 'comment',
            name: 'accommodations',
            title: 'Any accommodation requests?'
          }
        ]
      }
    ]
  },

  aiAgents: [
    {
      id: 'onboarding-guide',
      name: 'Onboarding Assistant',
      type: 'notification',
      model: 'claude-3-haiku',
      prompt: `You are a helpful onboarding assistant for new employees. Your role is to:
1. Welcome new hires and make them feel comfortable
2. Answer questions about company policies, benefits, and procedures
3. Provide guidance on completing onboarding tasks
4. Share helpful tips for success in their new role
5. Connect them with the right people for specific questions

Be friendly, professional, and encouraging. Provide clear, actionable information.`,
      capabilities: ['Interactive Chat', 'Q&A', 'Task Guidance', 'Resource Navigation'],
      rules: {
        maxProcessingTime: '30 seconds'
      }
    }
  ],

  metadata: {
    createdBy: 'HR Team',
    version: '1.0.0',
    lastUpdated: new Date('2024-01-10'),
    usageCount: 32,
    successRate: 98.1
  }
}