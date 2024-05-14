import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:3002';

const Graph = () => {
  const [cy, setCy] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);

  useEffect(() => {
    const cyInstance = cytoscape({
      container: document.getElementById('cy'),
      elements: [], // No initial elements
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'width': '70px',
            'height': '35px',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#000'
          }
        },
        {
          selector: 'node[type="Task"]',
          style: {
            'shape': 'rectangle',
            'width': '70px',
            'height': '35px',
            'background-color': '#2E8B57'
          }
        },
        {
          selector: 'node[type="Participant"]',
          style: {
            'shape': 'hexagon',
            'width': '70px',
            'height': '35px',
            'background-color': '#4682B4'
          }
        },
        {
          selector: 'node[type="Asset"]',
          style: {
            'shape': 'square',
            'width': '70px',
            'height': '35px',
            'background-color': '#FFD700'
          }
        },
        {
          selector: 'node[type="Context"]',
          style: {
            'shape': 'ellipse',
            'width': '70px',
            'height': '35px',
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
        },
        {
          selector: 'node:selected',
          style: {
            'background-color': 'red',  // Change the color to indicate selection
            'border-width': 2,
            'border-color': '#FFF'
          }
        }
      
      ],
      
      layout: {
        name: 'grid'
      },
      wheelSensitivity: 0.05 // zoom sensitivity
    });

    cyInstance.on('tap', 'node', (event) => {
      const nodeId = event.target.id();
      setSelectedNodes(prev => {
        if (prev.includes(nodeId)) {
          return prev.filter(id => id !== nodeId);
        } else if (prev.length < 2) {
          return [...prev, nodeId];
        }
        return prev;
      });
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

  const handleAddNode = (type) => {
    try {
      const newNode = {
        group: 'nodes',
        data: {
          id: new Date().getTime().toString(),  // Unique ID based on timestamp
          label: type + " Node",  // Label based on the node type
          type: type
        },
        position: {
          x: Math.random() * 800,
          y: Math.random() * 600
        }
      };

      cy.add(newNode);
      cy.layout({ name: 'grid' }).run();
    } catch (error) {
      console.error('Error adding node:', error);
    }
  };

  const handleDeleteNode = () => {
    const selectedNodes = cy.$(':selected');  // Gets all selected nodes
    if (selectedNodes.length > 0) {
      selectedNodes.remove();  // Removes selected nodes from the graph
    } else {
      console.error('No node is selected for deletion');
    }
  };

  const handleAddEdge = (sourceId, targetId) => {
    console.log(`Creating edge from ${sourceId} to ${targetId}`);

    if (cy.getElementById(sourceId).length === 0 || cy.getElementById(targetId).length === 0) {
      console.error("One or both node IDs do not exist in the graph.");
      return;
    }

    const edge = {
      group: 'edges',
      data: {
        id: `${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId
      }
    };

    cy.add(edge);
    cy.layout({ name: 'grid' }).run();
  };

  return (
    <div>
      <div id="cy" style={{ width: '800px', height: '600px' }} />
      <button onClick={() => handleAddNode('Task')}>Create Task</button>
      <button onClick={() => handleAddNode('Participant')}>Create Participant</button>
      <button onClick={() => handleAddNode('Asset')}>Create Asset</button>
      <button onClick={() => handleAddNode('Context')}>Create Context</button>
      <button onClick={handleDeleteNode}>Delete</button>
      <button onClick={() => {
        if (selectedNodes.length === 2) {
          handleAddEdge(selectedNodes[0], selectedNodes[1]);
          setSelectedNodes([]); // Reset selection after manually adding an edge
        } else {
          alert('Please select exactly two nodes.');
        }
      }}>Add Edge</button>
    </div>
  );
};

export default Graph;
