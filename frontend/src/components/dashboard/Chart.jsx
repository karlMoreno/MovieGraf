import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import SwipeableTemporaryDrawer from '../SwipeableTemporaryDrawer';
import AssetForm from '../forms/AssetForm';
import TasksForm from '../forms/TasksForm';
import LoadingScreen from '../LoadingScreen';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3002';

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

const Graph = () => {
  const [cy, setCy] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newNode, setNewNode] = useState({ id: '', label: '', type: 'Task' });
  const [newEdge, setNewEdge] = useState({ source: '', target: '', label: '' });
  const [edgeModalOpen, setEdgeModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [assetDrawerOpen, setAssetDrawerOpen] = useState(false);
  const [taskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cyInstance = cytoscape({
      container: document.getElementById('cy'),
      elements: [],
      style: [
        {
          selector: 'node',
          style: {
            'shape': 'ellipse',
            'background-color': 'data(color)',
            'width': '50px',
            'height': '50px',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'color': '#000',
            'font-size': '10px',
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
            'color': '#fff',
            'font-size': '6px', 
            'min-zoomed-font-size': 10, 
            'text-background-opacity': 1,
            'text-background-color': '#000',
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
        name: 'cose',
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
      wheelSensitivity: 0.8
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
          color: getColorForType(node.labels[0])
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
        return '#2E8B57';
      case 'Participant':
        return '#4682B4';
      case 'Asset':
        return '#FFD700';
      case 'Context':
        return '#FF6347';
      default:
        return '#666';
    }
  };

  const handleOpenDrawer = (type) => {
    if (type === 'Task') {
      setTaskDrawerOpen(true);
    } else if (type === 'Asset') {
      setAssetDrawerOpen(true);
    }
  };

  const handleCloseDrawer = () => {
    setAssetDrawerOpen(false);
    setTaskDrawerOpen(false);
    setLoading(true);
    window.location.reload(); // Reload the page to see the changes
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
      setSelectedNodes([]);
    } catch (error) {
      console.error('Error adding edge:', error);
    }
  };

  const handleSearch = () => {
    cy.elements().removeClass('highlighted faded');

    const nodesToHighlight = cy.nodes().filter(node => {
      const matchesQuery = searchQuery ? node.data('label').toLowerCase().includes(searchQuery.toLowerCase()) : true;
      const matchesCategory = selectedCategory ? node.data('type') === selectedCategory : true;
      return matchesQuery && matchesCategory;
    });

    const connectedEdges = nodesToHighlight.connectedEdges();
    cy.elements().addClass('faded');
    nodesToHighlight.removeClass('faded').addClass('highlighted');
    connectedEdges.removeClass('faded').addClass('highlighted');
  };

  return (
    <div>
      {loading && <LoadingScreen />}
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
        <TextField 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a node label..."
          variant="outlined"
          size="small"
          style={{ marginRight: '10px' }}
        />
        <FormControl variant="outlined" size="small" style={{ marginRight: '10px', minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="Task">Task</MenuItem>
            <MenuItem value="Participant">Participant</MenuItem>
            <MenuItem value="Asset">Asset</MenuItem>
            <MenuItem value="Context">Context</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleSearch}>Search</Button>
      </div>
      <div id="cy" style={{ width: '100%', height: '600px' }} />
      <Button variant="outlined" onClick={() => handleOpenDrawer('Asset')}>Create Asset</Button>
      <Button variant="outlined" onClick={() => handleOpenDrawer('Task')}>Create Task</Button>
      <Button variant="outlined" onClick={handleDeleteNode}>Delete</Button>
      <Button variant="outlined" onClick={handleAddEdge}>Add Edge</Button>

      <SwipeableTemporaryDrawer contentComponent={<AssetForm onClose={handleCloseDrawer} />} open={assetDrawerOpen} onClose={handleCloseDrawer} />
      <SwipeableTemporaryDrawer contentComponent={<TasksForm onClose={handleCloseDrawer} />} open={taskDrawerOpen} onClose={handleCloseDrawer} />
    </div>
  );
};

export default Graph;
