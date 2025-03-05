'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Package, 
  AlertTriangle, 
  GitBranch, 
  CheckCircle2, 
  XCircle, 
  Mail,
  Trash2,
  Settings
} from 'lucide-react'

// Custom node components for different block types
const TriggerNode = ({ data }) => {
  const IconComponent = data.icon || Package;
  
  return (
    <div className={`p-4 rounded-lg border shadow-sm bg-white w-64 ${data.color || 'border-stone-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className={`p-2 rounded-md ${data.iconBg || 'bg-stone-100'} mr-3`}>
            {typeof IconComponent === 'function' ? <IconComponent className="h-5 w-5" /> : <Package className="h-5 w-5" />}
          </div>
          <div>
            <h4 className="font-medium">{data.title}</h4>
            {data.description && (
              <p className="text-xs text-stone-500 mt-1">{data.description}</p>
            )}
          </div>
        </div>
        <button 
          className="p-1 rounded-full hover:bg-stone-100 text-stone-500" 
          title="Remove"
          onClick={() => data.onDelete(data.id)}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      {/* Output handle - only bottom for trigger */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500"
        id="output"
      />
    </div>
  );
};

const ConditionNode = ({ data }) => {
  const IconComponent = data.icon || GitBranch;
  
  return (
    <div className={`p-4 rounded-lg border shadow-sm bg-white w-64 ${data.color || 'border-stone-200'}`}>
      {/* Input handle - top */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500"
        id="input"
      />
      
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className={`p-2 rounded-md ${data.iconBg || 'bg-stone-100'} mr-3`}>
            {typeof IconComponent === 'function' ? <IconComponent className="h-5 w-5" /> : <GitBranch className="h-5 w-5" />}
          </div>
          <div>
            <h4 className="font-medium">{data.title}</h4>
            {data.description && (
              <p className="text-xs text-stone-500 mt-1">{data.description}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-1">
          {data.configurable && (
            <button className="p-1 rounded-full hover:bg-stone-100 text-stone-500" title="Configure">
              <Settings className="h-4 w-4" />
            </button>
          )}
          <button 
            className="p-1 rounded-full hover:bg-stone-100 text-stone-500" 
            title="Remove"
            onClick={() => data.onDelete(data.id)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Configuration UI for days */}
      {data.configurable && data.id.includes('condition_days') && (
        <div className="mt-3 pt-3 border-t border-stone-200 border-opacity-50">
          <div className="flex items-center">
            <span className="text-xs text-stone-600 mr-2">Within</span>
            <input 
              type="number" 
              className="w-16 px-2 py-1 text-xs rounded border border-stone-300"
              defaultValue={data.config?.days || 30}
              onChange={(e) => {
                data.updateConfig({ days: parseInt(e.target.value) || 30 });
              }}
            />
            <span className="text-xs text-stone-600 ml-2">days</span>
          </div>
        </div>
      )}
      
      {/* Configuration UI for yes/no */}
      {data.configurable && data.id.includes('condition_unused') && (
        <div className="mt-3 pt-3 border-t border-stone-200 border-opacity-50">
          <div className="flex items-center">
            <span className="text-xs text-stone-600 mr-2">Default:</span>
            <select 
              className="text-xs rounded border border-stone-300 px-2 py-1"
              defaultValue={data.config?.option || "Yes"}
              onChange={(e) => {
                data.updateConfig({ option: e.target.value });
              }}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
      )}
      
      {/* Output handles - for Yes/No branches */}
      <div className="flex justify-between mt-4">
        <div className="text-center">
          <div className="text-xs font-medium text-green-600 mb-1">Yes</div>
          <Handle
            type="source"
            position={Position.Bottom}
            id="yes"
            className="w-3 h-3 bg-green-500 !left-1/4"
          />
        </div>
        <div className="text-center">
          <div className="text-xs font-medium text-red-600 mb-1">No</div>
          <Handle
            type="source"
            position={Position.Bottom}
            id="no"
            className="w-3 h-3 bg-red-500 !left-3/4"
          />
        </div>
      </div>
    </div>
  );
};

const ActionNode = ({ data }) => {
  const IconComponent = data.icon || CheckCircle2;
  
  return (
    <div className={`p-4 rounded-lg border shadow-sm bg-white w-64 ${data.color || 'border-stone-200'}`}>
      {/* Input handle - top */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500"
        id="input"
      />
      
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className={`p-2 rounded-md ${data.iconBg || 'bg-stone-100'} mr-3`}>
            {typeof IconComponent === 'function' ? <IconComponent className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
          </div>
          <div>
            <h4 className="font-medium">{data.title}</h4>
            {data.description && (
              <p className="text-xs text-stone-500 mt-1">{data.description}</p>
            )}
          </div>
        </div>
        <button 
          className="p-1 rounded-full hover:bg-stone-100 text-stone-500" 
          title="Remove"
          onClick={() => data.onDelete(data.id)}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Define node types object for ReactFlow
const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode
};

// Custom edge styles for Yes/No paths
const getEdgeStyle = (data) => {
  if (data?.label === 'Yes') {
    return { stroke: '#10b981', strokeWidth: 2 }; // Green for Yes
  } else if (data?.label === 'No') {
    return { stroke: '#ef4444', strokeWidth: 2 }; // Red for No
  }
  return { stroke: '#64748b', strokeWidth: 2 }; // Default blue-gray
};

export default function RuleCanvas({ nodes, edges, setNodes, setEdges }) {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
  // Handle node changes (delete, position, etc.)
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  
  // Handle edge changes (delete, etc.)
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  
  // Update node configuration
  const updateNodeConfig = useCallback(
    (nodeId, newConfig) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  config: { ...node.data.config, ...newConfig },
                },
              }
            : node
        )
      );
    },
    [setNodes]
  );
  
  // Handle connecting nodes with edge labels based on handle IDs
  const onConnect = useCallback(
    (connection) => {
      // Add label based on the source handle (for condition nodes)
      let edgeLabel = '';
      if (connection.sourceHandle === 'yes') {
        edgeLabel = 'Yes';
      } else if (connection.sourceHandle === 'no') {
        edgeLabel = 'No';
      }
      
      const edge = {
        ...connection,
        id: `e${connection.source}-${connection.target}-${Date.now()}`,
        animated: true,
        style: getEdgeStyle({ label: edgeLabel }),
        label: edgeLabel,
        labelStyle: { fill: edgeLabel === 'Yes' ? '#10b981' : edgeLabel === 'No' ? '#ef4444' : '#64748b', fontWeight: 'bold' },
        labelBgStyle: { fill: '#ffffff', fillOpacity: 0.8 }
      };
      
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );
  
  // Function to remove a node
  const removeNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);
  
  // Handle drag over event
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  // Handle drop event
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      
      // Get the data from the drag event
      const templateJSON = event.dataTransfer.getData('application/reactflow');
      if (!templateJSON) return;
      
      const template = JSON.parse(templateJSON);
      
      // Get the position where the element is dropped
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      // Map icon names to component imports
      let iconComponent;
      switch (template.iconName) {
        case 'Package':
          iconComponent = Package;
          break;
        case 'AlertTriangle':
          iconComponent = AlertTriangle;
          break;
        case 'GitBranch':
          iconComponent = GitBranch;
          break;
        case 'CheckCircle2':
          iconComponent = CheckCircle2;
          break;
        case 'XCircle':
          iconComponent = XCircle;
          break;
        case 'Mail':
          iconComponent = Mail;
          break;
        default:
          // Fallback based on node type
          if (template.type === 'trigger') iconComponent = Package;
          else if (template.type === 'condition') iconComponent = GitBranch;
          else iconComponent = CheckCircle2;
      }
      
      // Create a new node
      const newNode = {
        id: `${template.id}_${Date.now()}`,
        type: template.type,
        position,
        data: { 
          ...template,
          icon: iconComponent,
          onDelete: removeNode,
          updateConfig: (config) => updateNodeConfig(newNode.id, config)
        },
        // Style options depending on node type
        style: { 
          border: '1px solid #e2e8f0',
          borderRadius: '0.375rem',
        },
      };
      
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, removeNode, updateNodeConfig]
  );
  
  return (
    <div className="flex-1 h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        deleteKeyCode="Delete"
        connectionMode="strict"
        connectionLineStyle={{ stroke: '#64748b', strokeWidth: 2 }}
        connectionLineType="smoothstep"
      >
        <Background color="#f0f0f0" gap={16} />
        <Controls />
        <MiniMap 
          nodeStrokeColor={(n) => {
            if (n.type === 'trigger') return '#3b82f6';
            if (n.type === 'condition') return '#f59e0b';
            return '#10b981';
          }}
          nodeColor={(n) => {
            if (n.type === 'trigger') return '#dbeafe';
            if (n.type === 'condition') return '#fef3c7';
            return '#d1fae5';
          }}
        />
      </ReactFlow>
    </div>
  );
}