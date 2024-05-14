import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
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
  backgroundColor: 'white',
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
            'line-color': '#808080',
            'target-arrow-color': '#808080',
            'width': 4,
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'color': '#000',
            'text-background-opacity': 1,
            'text-background-color': '#fff',
            'text-background-shape': 'rectangle',
            'text-border-opacity': 0,
            'text-border-width': 1,
            'text-border-color': '#000',
            'text-margin-y': -10
          }
        },
        {
          selector: 'edge[label="PERFORMED_BY"]',
          style: {
            'line-color': '#00FFFF',
            'target-arrow-color': '#00FFFF'
          }
        },
        {
          selector: 'edge[label="PRODUCED_BY"]',
          style: {
            'line-color': '#FF00FF',
            'target-arrow-color': '#FF00FF'
          }
        },
        {
          selector: 'node:selected',
          style: {
            'background-color': 'red',
            'border-width': 2,
            'border-color': '#FFF'
          }
        }
      ],
      layout: {
        name: 'grid'
      },
      wheelSensitivity: 0.1 // zoom sensitivity
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
          type: node.labels[0]
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
      cyInstance.layout({ name: 'grid' }).run();
    } catch (error) {
      console.error('Error fetching graph data:', error);
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
          type: newNode.type
        },
        position: {
          x: Math.random() * 800,
          y: Math.random() * 600
        }
      };

      cy.add(nodeToAdd);
      cy.layout({ name: 'grid' }).run();
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
      cy.layout({ name: 'grid' }).run();
      setEdgeModalOpen(false);
      setSelectedNodes([]); // Reset selection after manually adding an edge
    } catch (error) {
      console.error('Error adding edge:', error);
    }
  };

  return (
    <div>
      <div id="cy" style={{ width: '100%', height: '600px' }} />
      <button onClick={() => handleAddNode('Task')}>Create Task</button>
      <button onClick={() => handleAddNode('Participant')}>Create Participant</button>
      <button onClick={() => handleAddNode('Asset')}>Create Asset</button>
      <button onClick={() => handleAddNode('Context')}>Create Context</button>
      <button onClick={handleDeleteNode}>Delete</button>
      <button onClick={handleAddEdge}>Add Edge</button>

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
