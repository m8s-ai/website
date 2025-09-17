#!/usr/bin/env node

/**
 * Simple Test MCP Server for Claude Flow Development
 * This creates a basic WebSocket server that responds to Claude Flow MCP protocol
 * 
 * Usage: node test-mcp-server.js
 * Server will run on ws://localhost:8765
 */

import { WebSocketServer, WebSocket } from 'ws';

const PORT = 8765;
const wss = new WebSocketServer({ port: PORT });

console.log(`🚀 Test MCP Server starting on ws://localhost:${PORT}`);

// Mock agents database
const agents = new Map();
let agentCounter = 0;

// Mock agent templates
const agentTemplates = {
  'conversation': {
    type: 'conversation',
    capabilities: ['natural-language', 'context-memory'],
    defaultConfig: { maxConcurrentTasks: 10, timeoutMs: 30000 }
  },
  'analysis': {
    type: 'analysis', 
    capabilities: ['data-processing', 'statistical-analysis'],
    defaultConfig: { maxConcurrentTasks: 3, timeoutMs: 300000 }
  },
  'researcher': {
    type: 'researcher',
    capabilities: ['web-search', 'data-analysis'],
    defaultConfig: { maxConcurrentTasks: 5, timeoutMs: 60000 }
  }
};

function createMockAgent(template, config) {
  const agentId = `agent-${++agentCounter}-${Date.now()}`;
  const agent = {
    id: agentId,
    name: `${template.type.charAt(0).toUpperCase() + template.type.slice(1)} Agent #${agentCounter}`,
    type: template.type,
    status: 'active',
    description: `A ${template.type} agent created via MCP`,
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    capabilities: template.capabilities.map(cap => ({
      name: cap,
      description: `${cap} capability`,
      version: '1.0',
      enabled: true
    })),
    metrics: {
      tasksCompleted: Math.floor(Math.random() * 50),
      tasksInProgress: Math.floor(Math.random() * 3),
      successRate: 0.8 + Math.random() * 0.2,
      averageExecutionTime: 1000 + Math.random() * 5000,
      errorCount: Math.floor(Math.random() * 5),
      uptime: Date.now() - Math.random() * 86400000,
      memoryUsage: Math.random() * 500,
      cpuUsage: Math.random() * 100,
      lastActivity: new Date().toISOString()
    },
    configuration: { ...template.defaultConfig, ...config },
    taskHistory: []
  };
  
  agents.set(agentId, agent);
  return agent;
}

wss.on('connection', (ws) => {
  console.log('🔌 New client connected');
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connected',
    data: { message: 'Claude Flow MCP Test Server', version: '1.0.0' }
  }));

  ws.on('message', (message) => {
    try {
      const request = JSON.parse(message);
      console.log('📨 Received:', request.type, request.data);
      
      switch (request.type) {
        case 'auth':
          ws.send(JSON.stringify({
            type: 'auth_response',
            data: { success: true, message: 'Authentication successful' }
          }));
          break;
          
        case 'spawn_agent':
          const { template, config } = request.data;
          const agentTemplate = agentTemplates[template.type] || agentTemplates.conversation;
          const newAgent = createMockAgent(agentTemplate, config);
          
          ws.send(JSON.stringify({
            type: 'agent_spawned',
            data: { success: true, agentId: newAgent.id, agent: newAgent }
          }));
          
          // Send real-time status update
          setTimeout(() => {
            ws.send(JSON.stringify({
              type: 'agent_status_update',
              data: { agentId: newAgent.id, status: 'active', metrics: newAgent.metrics }
            }));
          }, 1000);
          break;
          
        case 'get_performance_metrics':
          const metricsData = {};
          agents.forEach((agent, id) => {
            // Simulate real-time metrics updates
            agent.metrics.cpuUsage = Math.random() * 100;
            agent.metrics.memoryUsage = Math.random() * 1000;
            agent.metrics.lastActivity = new Date().toISOString();
            metricsData[id] = agent.metrics;
          });
          
          ws.send(JSON.stringify({
            type: 'performance_metrics_response',
            data: request.data.agentId ? metricsData[request.data.agentId] : metricsData
          }));
          break;
          
        case 'chat_message':
          const { agentId, message: chatMessage } = request.data;
          const agent = agents.get(agentId);
          
          // Simulate agent response
          setTimeout(() => {
            const responses = [
              `I understand you want me to work on: "${chatMessage}". I'll start processing this request immediately.`,
              `Great question! As a ${agent?.type || 'general'} agent, I can help with that. Let me analyze this task.`,
              `Thanks for the message! I'm currently processing your request and will have results shortly.`,
              `Received your task: "${chatMessage}". My ${agent?.type || 'general'} capabilities are well-suited for this.`
            ];
            
            ws.send(JSON.stringify({
              type: 'chat_response',
              data: { 
                agentId, 
                response: responses[Math.floor(Math.random() * responses.length)]
              }
            }));
          }, 1000 + Math.random() * 2000);
          break;
          
        case 'assign_task':
          const { agentId: taskAgentId, task } = request.data;
          const targetAgent = agents.get(taskAgentId);
          
          if (targetAgent) {
            targetAgent.status = 'busy';
            targetAgent.currentTask = task;
            
            ws.send(JSON.stringify({
              type: 'task_assigned',
              data: { success: true, agentId: taskAgentId, task }
            }));
            
            // Simulate task completion
            setTimeout(() => {
              targetAgent.status = 'active';
              targetAgent.currentTask = null;
              targetAgent.metrics.tasksCompleted++;
              
              ws.send(JSON.stringify({
                type: 'agent_status_update',
                data: { agentId: taskAgentId, status: 'active', metrics: targetAgent.metrics }
              }));
            }, 5000 + Math.random() * 10000);
          }
          break;
          
        case 'terminate_agent':
          const { agentId: termAgentId } = request.data;
          const terminatedAgent = agents.get(termAgentId);
          
          if (terminatedAgent) {
            terminatedAgent.status = 'terminated';
            terminatedAgent.terminatedAt = new Date().toISOString();
            agents.set(termAgentId, terminatedAgent);
            
            ws.send(JSON.stringify({
              type: 'agent_terminated',
              data: { success: true, agentId: termAgentId }
            }));
            
            // Send status update
            ws.send(JSON.stringify({
              type: 'agent_status_update',
              data: { agentId: termAgentId, status: 'terminated' }
            }));
          } else {
            ws.send(JSON.stringify({
              type: 'agent_terminated',
              data: { success: false, error: 'Agent not found' }
            }));
          }
          break;
          
        case 'restart_agent':
          const { agentId: restartAgentId } = request.data;
          const restartedAgent = agents.get(restartAgentId);
          
          if (restartedAgent) {
            restartedAgent.status = 'active';
            restartedAgent.restartedAt = new Date().toISOString();
            agents.set(restartAgentId, restartedAgent);
            
            ws.send(JSON.stringify({
              type: 'agent_restarted',
              data: { success: true, agentId: restartAgentId }
            }));
            
            // Send status update
            ws.send(JSON.stringify({
              type: 'agent_status_update',
              data: { agentId: restartAgentId, status: 'active', metrics: restartedAgent.metrics }
            }));
          } else {
            ws.send(JSON.stringify({
              type: 'agent_restarted',
              data: { success: false, error: 'Agent not found' }
            }));
          }
          break;

        case 'delete_agent':
          const { agentId: deleteAgentId } = request.data;
          const agentToDelete = agents.get(deleteAgentId);
          
          if (agentToDelete) {
            // Remove agent from the map
            agents.delete(deleteAgentId);
            
            ws.send(JSON.stringify({
              type: 'agent_deleted',
              data: { success: true, agentId: deleteAgentId }
            }));
            
            // Notify all clients about agent removal
            wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'agent_removed',
                  data: { agentId: deleteAgentId }
                }));
              }
            });
            
            console.log(`🗑️ Agent ${deleteAgentId} deleted successfully`);
          } else {
            ws.send(JSON.stringify({
              type: 'agent_deleted',
              data: { success: false, error: 'Agent not found' }
            }));
          }
          break;

        case 'heartbeat':
          ws.send(JSON.stringify({
            type: 'heartbeat_response',
            data: { timestamp: Date.now(), server: 'test-mcp' }
          }));
          break;
          
        case 'health_check':
          ws.send(JSON.stringify({
            type: 'health_check_response',
            data: { status: 'healthy', agents: agents.size, uptime: process.uptime() }
          }));
          break;
          
        default:
          console.log('❓ Unknown message type:', request.type);
      }
    } catch (error) {
      console.error('❌ Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        data: { message: 'Invalid message format' }
      }));
    }
  });

  ws.on('close', () => {
    console.log('👋 Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

// Simulate periodic agent activity
setInterval(() => {
  if (wss.clients.size > 0) {
    agents.forEach((agent, agentId) => {
      // Random chance to update metrics
      if (Math.random() < 0.3) {
        agent.metrics.cpuUsage = Math.random() * 100;
        agent.metrics.memoryUsage = Math.random() * 1000;
        agent.metrics.lastActivity = new Date().toISOString();
        
        wss.clients.forEach(ws => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'metrics_updated',
              data: { agentId, metrics: agent.metrics }
            }));
          }
        });
      }
    });
  }
}, 10000); // Every 10 seconds

console.log(`✅ Claude Flow MCP Test Server ready!`);
console.log(`🌐 WebSocket URL: ws://localhost:${PORT}`);
console.log(`🎯 Connect your Claude Flow UI to start testing`);
console.log(`📊 Available agent types: ${Object.keys(agentTemplates).join(', ')}`);