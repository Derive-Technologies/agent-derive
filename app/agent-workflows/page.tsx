'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

const EXAMPLE_WORKFLOWS = {
  dataAnalysis: {
    name: 'Data Analysis',
    event: 'example/data.analysis',
    description: 'Analyze data and generate insights using AI agents',
    inputs: {
      data: [
        { product: 'Widget A', sales: 1200, month: 'Jan' },
        { product: 'Widget B', sales: 800, month: 'Jan' },
        { product: 'Widget A', sales: 1500, month: 'Feb' },
        { product: 'Widget B', sales: 1100, month: 'Feb' },
      ],
    },
  },
  documentGeneration: {
    name: 'Document Generation',
    event: 'example/document.generate',
    description: 'Generate documents and reports from data',
    inputs: {
      templateType: 'quarterly_report',
      format: 'markdown',
      data: {
        quarter: 'Q1 2024',
        revenue: 2500000,
        growth: 15,
        highlights: ['New product launch', 'Market expansion', 'Customer satisfaction improved'],
      },
    },
  },
  approvalWorkflow: {
    name: 'Approval Workflow',
    event: 'example/approval.request',
    description: 'Multi-step approval process with AI coordination',
    inputs: {
      request: {
        title: 'Budget Approval Request',
        amount: 50000,
        department: 'Engineering',
        justification: 'Infrastructure upgrade for Q2',
      },
      approvers: ['manager@example.com', 'director@example.com'],
    },
  },
  customerSupport: {
    name: 'Customer Support',
    event: 'example/support.ticket',
    description: 'AI-powered customer support automation',
    inputs: {
      ticket: {
        id: 'TICKET-001',
        subject: 'Cannot access my account',
        description: 'I am unable to login to my account since yesterday.',
        priority: 'high',
      },
      customer: {
        id: 'CUST-123',
        name: 'John Doe',
        tier: 'premium',
      },
      history: [
        { date: '2024-01-15', issue: 'Password reset', resolved: true },
      ],
    },
  },
  complexWorkflow: {
    name: 'Complex Business Process',
    event: 'workflow/complex.execute',
    description: 'Master orchestration of multiple AI agent networks',
    inputs: {
      executionId: 'exec-' + Date.now(),
      workflowType: 'master',
      inputs: {
        operation: 'end_to_end_processing',
        priority: 'high',
        data: { items: 100, complexity: 'high' },
      },
      config: {
        maxIterations: 10,
        parallel: true,
        monitoring: true,
      },
    },
  },
};

export default function AgentWorkflowsPage() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<keyof typeof EXAMPLE_WORKFLOWS>('dataAnalysis');
  const [customInput, setCustomInput] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerWorkflow = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const workflow = EXAMPLE_WORKFLOWS[selectedWorkflow];
      const inputs = customInput ? JSON.parse(customInput) : workflow.inputs;

      const res = await fetch('/api/inngest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: workflow.event,
          data: inputs,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to trigger workflow: ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const workflow = EXAMPLE_WORKFLOWS[selectedWorkflow];

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Agent Workflows</h1>
        <p className="text-muted-foreground mt-2">
          Test and trigger AI agent workflows powered by Inngest Agent Kit
        </p>
      </div>

      <Tabs defaultValue="trigger" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trigger">Trigger Workflows</TabsTrigger>
          <TabsTrigger value="monitor">Monitor</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="trigger" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Select Workflow</CardTitle>
              <CardDescription>Choose a pre-configured workflow or customize inputs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Workflow Type</Label>
                <Select
                  value={selectedWorkflow}
                  onValueChange={(value) => setSelectedWorkflow(value as keyof typeof EXAMPLE_WORKFLOWS)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EXAMPLE_WORKFLOWS).map(([key, wf]) => (
                      <SelectItem key={key} value={key}>
                        {wf.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground">{workflow.description}</p>
              </div>

              <div className="space-y-2">
                <Label>Event Name</Label>
                <Badge variant="secondary">{workflow.event}</Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Default Input</Label>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-auto max-h-64">
                  {JSON.stringify(workflow.inputs, null, 2)}
                </pre>
              </div>

              <div className="space-y-2">
                <Label>Custom Input (Optional)</Label>
                <Textarea
                  placeholder="Enter custom JSON input (leave empty to use default)"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="font-mono text-sm"
                  rows={6}
                />
              </div>

              <Button
                onClick={triggerWorkflow}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Triggering...' : 'Trigger Workflow'}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {response && (
            <Card>
              <CardHeader>
                <CardTitle>Response</CardTitle>
                <CardDescription>Workflow execution result</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-3 rounded-md text-sm overflow-auto max-h-96">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monitor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Monitor</CardTitle>
              <CardDescription>View running workflows and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTitle>Inngest Dev Server</AlertTitle>
                  <AlertDescription>
                    To monitor workflows in real-time, run the Inngest dev server:
                    <pre className="mt-2 bg-muted p-2 rounded text-sm">npx inngest dev</pre>
                    Then visit: <a href="http://localhost:8288" target="_blank" rel="noopener noreferrer" className="text-primary underline">http://localhost:8288</a>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Kit Features</CardTitle>
              <CardDescription>Key capabilities of the Inngest Agent Kit integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Available Agents</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Data Analyst',
                    'Task Executor',
                    'Decision Maker',
                    'Content Generator',
                    'QA Agent',
                    'Integration Agent',
                    'Monitoring Agent',
                    'Approval Coordinator',
                    'Error Handler',
                    'Orchestrator',
                  ].map((agent) => (
                    <Badge key={agent} variant="outline">{agent}</Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Networks</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Data Processing Network - Complex data analysis and transformation</li>
                  <li>• Approval Workflow Network - Multi-level approval chains</li>
                  <li>• Integration Network - External system integrations</li>
                  <li>• Content Generation Network - Document and report creation</li>
                  <li>• Error Recovery Network - Intelligent error handling</li>
                  <li>• Master Orchestration Network - Coordinates multiple networks</li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Tools</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Database Query Tool - Query workflow data</li>
                  <li>• Workflow State Update Tool - Manage execution state</li>
                  <li>• API Call Tool - External API integrations</li>
                  <li>• Data Transform Tool - Process and transform data</li>
                  <li>• Decision Tool - Make intelligent decisions</li>
                  <li>• Notification Tool - Send alerts and notifications</li>
                  <li>• Approval Tool - Manage approval requests</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}