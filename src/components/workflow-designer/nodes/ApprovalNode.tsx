import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Clock, CheckCircle, XCircle } from 'lucide-react';

export type ApprovalNodeData = {
  label: string;
  config?: {
    approvers?: string[]; // user IDs or role names
    approvalType?: 'any' | 'all' | 'majority';
    dueDate?: string;
    escalation?: {
      enabled: boolean;
      escalateAfter?: number; // hours
      escalateTo?: string[];
    };
    autoApprove?: {
      enabled: boolean;
      conditions?: string[]; // conditions for auto-approval
    };
  };
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  status?: 'pending' | 'waiting_approval' | 'approved' | 'rejected' | 'expired';
  approvalData?: {
    approvedBy?: string;
    rejectedBy?: string;
    approvedAt?: string;
    rejectedAt?: string;
    comment?: string;
  };
};

export const ApprovalNode: React.FC<NodeProps<ApprovalNodeData>> = ({
  data,
  isConnectable,
  selected,
}) => {
  const getStatusIcon = () => {
    switch (data.status) {
      case 'waiting_approval':
        return <Clock className="w-4 h-4 animate-pulse text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <UserCheck className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'waiting_approval':
        return 'bg-yellow-100 text-yellow-600';
      case 'approved':
        return 'bg-green-100 text-green-600';
      case 'rejected':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <Card className={`min-w-[220px] p-3 ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getStatusColor()}`}>
          {getStatusIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{data.label}</h3>
          <Badge variant="outline" className="text-xs">
            Approval
          </Badge>
        </div>
      </div>

      {data.config?.approvalType && (
        <div className="text-xs text-gray-600 mb-1">
          Type: {data.config.approvalType}
        </div>
      )}

      {data.config?.approvers && data.config.approvers.length > 0 && (
        <div className="text-xs text-gray-600 mb-1">
          Approvers: {data.config.approvers.length}
        </div>
      )}

      {data.config?.dueDate && (
        <div className="text-xs text-gray-600 mb-1">
          Due: {new Date(data.config.dueDate).toLocaleDateString()}
        </div>
      )}

      {data.config?.escalation?.enabled && (
        <div className="text-xs text-gray-500 mb-1">
          ⚡ Escalation enabled
        </div>
      )}

      {data.config?.autoApprove?.enabled && (
        <div className="text-xs text-gray-500 mb-1">
          🤖 Auto-approval enabled
        </div>
      )}

      {data.status && (
        <div className="text-xs mt-2">
          <Badge variant={data.status === 'approved' ? 'default' : 'secondary'}>
            {data.status.replace('_', ' ')}
          </Badge>
        </div>
      )}

      {data.approvalData?.approvedBy && (
        <div className="text-xs text-green-600 mt-1">
          ✓ Approved by {data.approvalData.approvedBy}
        </div>
      )}

      {data.approvalData?.rejectedBy && (
        <div className="text-xs text-red-600 mt-1">
          ✗ Rejected by {data.approvalData.rejectedBy}
        </div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3"
      />
    </Card>
  );
};