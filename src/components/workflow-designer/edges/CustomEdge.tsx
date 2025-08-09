import React from 'react';
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from 'reactflow';
import { Badge } from '@/components/ui/badge';

export type CustomEdgeData = {
  label?: string;
  condition?: string;
  color?: string;
  animated?: boolean;
  style?: 'default' | 'dashed' | 'dotted';
  weight?: number;
};

export const CustomEdge: React.FC<EdgeProps<CustomEdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const getEdgeStyle = () => {
    const baseStyle = {
      strokeWidth: data?.weight || 2,
      stroke: data?.color || '#94a3b8',
      ...style,
    };

    if (data?.style === 'dashed') {
      baseStyle.strokeDasharray = '8 4';
    } else if (data?.style === 'dotted') {
      baseStyle.strokeDasharray = '2 2';
    }

    if (selected) {
      baseStyle.stroke = '#3b82f6';
      baseStyle.strokeWidth = (data?.weight || 2) + 1;
    }

    return baseStyle;
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={getEdgeStyle()}
        className={data?.animated ? 'animated' : ''}
      />
      
      {(data?.label || data?.condition) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 11,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <Badge 
              variant="outline" 
              className="bg-white shadow-sm text-xs px-2 py-1"
              style={{
                borderColor: data?.color || '#94a3b8',
                color: data?.color || '#64748b',
              }}
            >
              {data?.label || data?.condition}
            </Badge>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};