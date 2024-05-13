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
          selector: 'edge',
          style: {
            'width': 4, // Increased width for better visibility
            'line-color': '#f00', // Change to a bright color to ensure visibility
            'target-arrow-color': '#f00', // Same bright color for arrow
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'color': '#000', // Ensuring text color is visible
            'text-background-opacity': 1, // Adding background to text for visibility
            'text-background-color': '#fff', // White background for text
            'text-background-shape': 'rectangle', // Shape of text background
            'text-border-opacity': 1,
            'text-border-width': 1,
            'text-border-color': '#000',
            'text-margin-y': -10
          }
        }
      ],
      layout: {
        name: 'grid'
      }
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
          id: node.identity.low.toString(),  // Ensuring ID is a string
          label: node.properties.name,        // Assuming 'name' for label
        }
      }));
      const formattedEdges = data.edges.map(edge => ({
        group: 'edges',
        data: {
          id: (edge.identity.low + formattedNodes.length).toString(),  // Ensuring ID is a string
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

  const handleAddNode = async (label) => {
    try {
      await axios.post('/node', { label });
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
      <button onClick={() => handleAddNode('1')}>Create Task </button>
      <button onClick={() => handleAddNode('2')}>Create Participant </button>
      <button onClick={() => handleAddNode('1')}>Create Asset </button>
      <button onClick={() => handleAddNode('2')}>Create Context </button>
      <button onClick={() => handleAddNode('1')}>Create Relationship </button>
      
    </div>
  );
};

export default Graph;