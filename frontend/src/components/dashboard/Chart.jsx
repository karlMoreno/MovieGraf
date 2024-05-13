import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3002';

const Graph = () => {
  const [cy, setCy] = useState(null);

  useEffect(() => {
    const cyInstance = cytoscape({
      container: document.getElementById('cy'),
      elements: [], // No initial elements
      style: [
        {
            selector: 'node',
            style: {
                'background-color': '#666',
                'label': 'data(label)',
                'text-valign': 'center',
                'text-halign': 'center',
                'color': '#fff'
            }
        },
        {
            selector: 'node[type="Task"]',
            style: {
              'shape': 'rectangle',
              'width': '60px', // Set width to 60px
              'height': '30px', // Set height to 30px
              'background-color': '#2E8B57'
            }
        },
        {
            selector: 'node[type="Participant"]',
            style: {
                'shape': 'hexagon',
                'background-color': '#4682B4'
            }
        },
        {
            selector: 'node[type="Asset"]',
            style: {
                'shape': 'square',
                'background-color': '#FFD700'
            }
        },
        {
            selector: 'node[type="Context"]',
            style: {
                'shape': 'ellipse',
                'background-color': '#FF6347'
            }
        },
      
      {
          selector: 'edge',
          style: {
              'line-color': '#808080', // Default gray color for all other edges
              'target-arrow-color': '#808080',
              'width': 4,
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'label': 'data(label)',
              'color': '#000',
              'text-background-opacity': 1,
              'text-background-color': '#fff',
              'text-background-shape': 'rectangle',
              'text-border-opacity': 1,
              'text-border-width': 1,
              'text-border-color': '#000',
              'text-margin-y': -10
          }
      },  // Add styles for edges
      {
        selector: 'edge[label="PERFORMED_BY"]',
        style: {
            'line-color': '#00FFFF', // Cyan color for PERFORMED_BY edges
            'target-arrow-color': '#00FFFF'
        }
    },
    {
        selector: 'edge[label="PRODUCED_BY"]',
        style: {
            'line-color': '#FF00FF', // Magenta color for PRODUCED_BY edges
            'target-arrow-color': '#FF00FF'
        }
    }
    ],
      layout: {
        name: 'grid'
      },
      wheelSensitivity: 0.1 // zoom sensitivity
    });
    setCy(cyInstance);
    fetchGraph(cyInstance);
  }, []);

  const fetchGraph = async (cyInstance) => {
    try {
      const { data } = await axios.get('/graph');
      const formattedNodes = data.nodes.map(node => ({
        group: 'nodes',
        data: {
            id: node.identity.low.toString(), // Ensuring ID is a string
            label: node.properties.name, // Assuming 'name' for label
            type: node.labels[0] // Assuming the type of the node is determined by its label
        }
    }));
      const formattedEdges = data.edges.map(edge => ({
        group: 'edges',
        data: {
          id: edge.identity.low.toString() + '-' + edge.start.low.toString() + '-' + edge.end.low.toString(),  // Ensuring ID is a string
          source: edge.start.low.toString(), // Ensuring source is a string
          target: edge.end.low.toString(),   // Ensuring target is a string
          label: edge.type                   // Using 'type' as the label
        }
      }));
  
      console.log("Formatted Nodes:", formattedNodes);
      console.log("Formatted Edges:", formattedEdges);
  
      cyInstance.add(formattedNodes);
      cyInstance.add(formattedEdges);
      cyInstance.layout({ name: 'grid' }).run();
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  };

  const handleAddNode = async (type) => {
    try {
        await axios.post('/node', { type });
        fetchGraph(cy);
    } catch (error) {
        console.error('Error adding node:', error);
    }
};

  const handleAddEdge = async (fromId, toId, label) => {
    try {
      await axios.post('/edge', { fromId, toId, label });
      fetchGraph(cy);
    } catch (error) {
      console.error('Error adding edge:', error);
    }
  };

  return (
    <div>
      <div id="cy" style={{ width: '800px', height: '600px' }} />
      <button onClick={() => handleAddNode('Task')}>Create Task</button>
      <button onClick={() => handleAddNode('Participant')}>Create Participant</button>
      <button onClick={() => handleAddNode('Asset')}>Create Asset</button>
      <button onClick={() => handleAddNode('Context')}>Create Context</button>
      
    </div>
  );
};

export default Graph;