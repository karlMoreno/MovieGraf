import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import { Button } from '@mui/material';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3002';

// Define labels for each node type based on the ontology
const labels = {
  Task: [
    "Write Script", "Previsualize", "Create Set", "Shoot", 
    "Create Editorial Dailies", "Create VFX"
  ],
  Participant: [
    "Director", "Actor", "Art Department", "Person", 
    "Organization", "Service"
  ],
  Asset: [
    "Image", "Video", "Audio", "Data", "Physical Thing", 
    "Concept Art", "Storyboard", "Shot", "VFX Image Sequence"
  ],
  Context: [
    "Scene", "Location", "Character", "Prop", "Depiction", 
    "Slate", "Shot"
  ]
};

const relationshipLabels = [
  "Produced By", "Performed By", "Portrayed By", "Depicted By"
];

const modalStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'black',
  padding: '20px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  zIndex: 1000
};

const modalHeadingStyle = {
  marginTop: 0
};

const modalLabelStyle = {
  display: 'block',
  margin: '10px 0'
};

const modalSelectStyle = {
  width: '100%',
  padding: '8px',
  margin: '5px 0 10px 0'
};

const modalButtonStyle = {
  marginRight: '10px',
  padding: '10px 20px'
};

const Graph = () => {
  const [cy, setCy] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newNode, setNewNode] = useState({ id: '', label: '', type: 'Task' });
  const [newEdge, setNewEdge] = useState({ source: '', target: '', label: '' });
  const [edgeModalOpen, setEdgeModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const cyInstance = cytoscape({
      container: document.getElementById('cy'),
      elements: [], // No initial elements
      style: [
        {
          selector: 'node',
          style: {
            'shape': 'ellipse', // Circle shape
            'background-color': 'data(color)',
            'width': '50px',
            'height': '50px',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#000', // Keep the font color black
            'font-size': '10px', // Adjust font size to fit inside the circle
            'text-wrap': 'wrap',
            'text-max-width': '45px'
          }
        },
        {
          selector: 'edge',
          style: {
            'line-color': '#808080',
            'target-arrow-color': '#808080',
            'width': 2,
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'color': '#fff', // Set the font color to white
            'font-size': '6px', 
            'min-zoomed-font-size': 10, 
            'text-background-opacity': 1,
            'text-background-color': '#000', // Set the background color to black
            'text-background-shape': 'rectangle',
            'text-border-opacity': 0,
            'text-border-width': 1,
            'text-border-color': '#000',
            'text-margin-y': -10
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 4,
            'border-color': '#00FFFF', 
            'background-color': 'data(color)', 
          }
        },
        {
          selector: '.faded',
          style: {
            'opacity': 0.1,
            'transition-property': 'opacity',
            'transition-duration': '0.5s'
          }
        },
        {
          selector: '.highlighted',
          style: {
            'opacity': 1,
            'transition-property': 'opacity',
            'transition-duration': '0.5s'
          }
        }
      ],
      layout: {
        name: 'cose', // Change layout to cose for a more web-like structure
        fit: true,
        padding: 30,
        nodeRepulsion: 2048,
        idealEdgeLength: 100,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.99,
        minTemp: 1.0
      },
      wheelSensitivity: 0.8 // zoom sensitivity
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
          id: node.identity.low.toString(),
          label: node.properties.name,
          type: node.labels[0],
          color: getColorForType(node.labels[0]) // Assign a color based on type
        }
      }));
      const formattedEdges = data.edges.map(edge => ({
        group: 'edges',
        data: {
          id: edge.identity.low.toString() + '-' + edge.start.low.toString() + '-' + edge.end.low.toString(),
          source: edge.start.low.toString(),
          target: edge.end.low.toString(),
          label: edge.type
        }
      }));

      console.log("Formatted Nodes:", formattedNodes);
      console.log("Formatted Edges:", formattedEdges);

      cyInstance.add(formattedNodes);
      cyInstance.add(formattedEdges);
      cyInstance.layout({ name: 'cose' }).run();
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  };

  const getColorForType = (type) => {
    switch (type) {
      case 'Task':
        return '#2E8B57'; // Green
      case 'Participant':
        return '#4682B4'; // Blue
      case 'Asset':
        return '#FFD700'; // Yellow
      case 'Context':
        return '#FF6347'; // Red
      default:
        return '#666'; // Default color
    }
  };

  const handleAddNode = (type) => {
    const newNodeId = new Date().getTime().toString();
    setNewNode({ id: newNodeId, label: labels[type][0], type });
    setModalOpen(true);
  };

  const handleSaveNode = () => {
    try {
      const nodeToAdd = {
        group: 'nodes',
        data: {
          id: newNode.id,
          label: newNode.label,
          type: newNode.type,
          color: getColorForType(newNode.type) // Assign color based on type
        },
        position: {
          x: Math.random() * 800,
          y: Math.random() * 600
        }
      };

      cy.add(nodeToAdd);
      cy.layout({ name: 'cose' }).run();
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding node:', error);
    }
  };

  const handleDeleteNode = () => {
    const selectedNodes = cy.$(':selected');
    if (selectedNodes.length > 0) {
      selectedNodes.remove();
    } else {
      console.error('No node is selected for deletion');
    }
  };

  const handleAddEdge = () => {
    if (selectedNodes.length === 2) {
      setNewEdge({ source: selectedNodes[0], target: selectedNodes[1], label: '' });
      setEdgeModalOpen(true);
    } else {
      alert('Please select exactly two nodes.');
    }
  };

  const handleSaveEdge = () => {
    const { source, target, label } = newEdge;

    if (cy.getElementById(source).length === 0 || cy.getElementById(target).length === 0) {
      console.error("One or both node IDs do not exist in the graph.");
      return;
    }

    try {
      const edgeToAdd = {
        group: 'edges',
        data: {
          id: `${source}-${target}`,
          source: source,
          target: target,
          label: label
        }
      };

      cy.add(edgeToAdd);
      cy.layout({ name: 'cose' }).run();
      setEdgeModalOpen(false);
      setSelectedNodes([]); // Reset selection after manually adding an edge
    } catch (error) {
      console.error('Error adding edge:', error);
    }
  };

  const handleSearch = () => {
    if (!searchQuery) {
      cy.elements().removeClass('faded').addClass('highlighted');
      return;
    }
    
    const matchingNodes = cy.nodes().filter(node => node.data('label').toLowerCase().includes(searchQuery.toLowerCase()));
    const connectedEdges = matchingNodes.connectedEdges();
    cy.elements().addClass('faded');
    matchingNodes.removeClass('faded').addClass('highlighted');
    connectedEdges.removeClass('faded').addClass('highlighted');
  };

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a node label..."
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <Button variant="contained"onClick={handleSearch} style={{ padding: '8px' }}>Search</Button>
      </div>
      <div id="cy" style={{ width: '100%', height: '600px' }} />
      <Button variant="outlined" onClick={() => handleAddNode('Task')}>Create Task</Button>
      <Button variant="outlined" onClick={() => handleAddNode('Participant')}>Create Participant</Button>
      <Button variant="outlined" onClick={() => handleAddNode('Asset')}>Create Asset</Button>
      <Button variant="outlined" onClick={() => handleAddNode('Context')}>Create Context</Button>
      <Button variant="outlined" onClick={handleDeleteNode}>Delete</Button>
      <Button variant="outlined" onClick={handleAddEdge}>Add Edge</Button>

      {modalOpen && (
        <div className="modal" style={modalStyle}>
          <h2 style={modalHeadingStyle}>Create {newNode.type} Node</h2>
          <label style={modalLabelStyle}>
            Label:
            <select
              value={newNode.label}
              onChange={(e) => setNewNode({ ...newNode, label: e.target.value })}
              style={modalSelectStyle}
            >
              {labels[newNode.type].map(label => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>
          </label>
          <button onClick={handleSaveNode} style={modalButtonStyle}>Save</button>
          <button onClick={() => setModalOpen(false)} style={modalButtonStyle}>Cancel</button>
        </div>
      )}

      {edgeModalOpen && (
        <div className="modal" style={modalStyle}>
          <h2 style={modalHeadingStyle}>Create Relationship</h2>
          <label style={modalLabelStyle}>
            Label:
            <select
              value={newEdge.label}
              onChange={(e) => setNewEdge({ ...newEdge, label: e.target.value })}
              style={modalSelectStyle}
            >
              {relationshipLabels.map(label => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>
          </label>
          <button onClick={handleSaveEdge} style={modalButtonStyle}>Save</button>
          <button onClick={() => setEdgeModalOpen(false)} style={modalButtonStyle}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Graph;
