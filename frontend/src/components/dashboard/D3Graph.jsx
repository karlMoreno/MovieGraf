import React, { useEffect, useRef, useState } from 'react'; // Import React hooks
import * as d3 from 'd3'; // Import D3 library
import axios from 'axios'; // Import Axios for HTTP requests
import { useDrop } from 'react-dnd'; // Import useDrop from react-dnd for drag-and-drop functionality
import Sidebar from './DiagramSidebar'; // Import Sidebar component
import NodeForm from './NodeForm'; // Import NodeForm component
import RelationshipForm from './RelationshipsForm'; // Import RelationshipForm component

const D3Graph = () => {
  const d3Container = useRef(null); // Create a ref for the D3 container
  const [nodes, setNodes] = useState([]); // State to store nodes
  const [links, setLinks] = useState([]); // State to store links
  const [showForm, setShowForm] = useState(false); // State to control the display of the NodeForm
  const [showRelForm, setShowRelForm] = useState(false); // State to control the display of the RelationshipForm
  const [newNodeType, setNewNodeType] = useState(''); // State to store the type of new node
  const [newNodePosition, setNewNodePosition] = useState({ x: 0, y: 0 }); // State to store the position of new node
  const [selectedNodes, setSelectedNodes] = useState([]); // State to store selected nodes
  const [tempLinks, setTempLinks] = useState([]); // State to track temporary links

  // Fetch graph data when the component mounts
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const { data } = await axios.get('http://localhost:3002/api/graph/graph-get'); // Fetch graph data from the server
        const fetchedNodes = data.nodes.map(node => ({
          id: node.identity.low, // Map node ID
          label: node.properties.name, // Map node label
          type: node.labels[0], // Map node type
          x: Math.random() * 800, // Assign random x position (for initial placement)
          y: Math.random() * 600, // Assign random y position (for initial placement)
        }));
        const fetchedLinks = data.edges.map(edge => ({
          source: edge.start.low, // Map link source
          target: edge.end.low, // Map link target
          type: edge.type // Map link type
        }));
        setNodes(fetchedNodes); // Set fetched nodes to state
        setLinks(fetchedLinks); // Set fetched links to state
        renderGraph(fetchedNodes, fetchedLinks, tempLinks); // Render the graph
      } catch (error) {
        console.error('Error fetching graph data:', error); // Log error if fetching fails
      }
    };

    fetchGraphData(); // Call the function to fetch graph data
  }, []); // Dependency array to run this effect only once

  // Set up drag-and-drop functionality
  const [{ isOver }, drop] = useDrop({
    accept: 'node', // Accept nodes
    drop: (item, monitor) => {
      const offset = monitor.getSourceClientOffset(); // Get the offset of the dropped item
      setNewNodeType(item.type); // Set the type of the new node
      setNewNodePosition({ x: offset.x, y: offset.y }); // Set the position of the new node
      setShowForm(true); // Show the NodeForm
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(), // Track whether the item is over the drop target
    }),
  });

  // Function to render the graph
  const renderGraph = (nodes, links, tempLinks) => {
    const width = window.innerWidth; // Get the width of the window
    const height = window.innerHeight; // Get the height of the window

    const svg = d3.select(d3Container.current) // Select the D3 container
      .attr('width', '100%') // Set the width of the SVG
      .attr('height', '600') // Set the height of the SVG
      .call(d3.zoom().on("zoom", (event) => { // Add zoom functionality
        svg.attr("transform", event.transform); // Apply zoom and pan
      }))
      .append("g"); // Append a group element

    const defs = svg.append('defs'); // Append defs element for markers

    // Define arrowhead markers for graph links
    defs.append('marker') // Append marker element
      .attr('id', 'arrowhead') // Set marker ID
      .attr('viewBox', '-0 -5 10 10') // Set viewBox
      .attr('refX', 32) // Adjust refX to provide space between node and arrow
      .attr('refY', 0) // Set refY
      .attr('orient', 'auto') // Set orientation
      .attr('markerWidth', 6) // Set marker width
      .attr('markerHeight', 6) // Set marker height
      .attr('xoverflow', 'visible') // Set x overflow
      .append('svg:path') // Append path element
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5') // Set path data
      .attr('fill', '#999') // Set fill color
      .style('stroke', 'none'); // Remove stroke

    const colorScale = d3.scaleOrdinal() // Create color scale
      .domain(['Task', 'Participant', 'Asset', 'Context', 'Project']) // Set domain
      .range(['#2E8B57', '#4682B4', '#FFD700', '#FF6347', '#8A2BE2']); // Set range

    const simulation = d3.forceSimulation(nodes) // Create force simulation
      .force('link', d3.forceLink(links.concat(tempLinks)).id(d => d.id).distance(150)) // Include tempLinks
      .force('charge', d3.forceManyBody().strength(-100)) // Add charge force
      .force('center', d3.forceCenter(width / 2, height / 2)) // Add center force
      .force('collision', d3.forceCollide().radius(60)); // Add collision force

    const link = svg.append('g') // Append group element for links
      .attr('stroke', '#999') // Set stroke color
      .attr('stroke-opacity', 0.6) // Set stroke opacity
      .selectAll('line') // Select all line elements
      .data(links.concat(tempLinks)) // Include tempLinks
      .enter().append('line') // Append line elements
      .attr('stroke-width', 2) // Set stroke width
      .attr('marker-end', 'url(#arrowhead)'); // Add arrowhead to the end of the line

    // Add edge labels
    const linkLabels = svg.append('g') // Append group element for labels
      .selectAll('text') // Select all text elements
      .data(links.concat(tempLinks)) // Include tempLinks
      .enter().append('text') // Append text elements
      .attr('dy', 5) // Set dy attribute
      .attr('text-anchor', 'middle') // Set text anchor
      .text(d => d.type) // Set text content
      .style('fill', '#fff') // Set fill color
      .style('font-size', '10px'); // Set font size

    const node = svg.append('g') // Append group element for nodes
      .attr('stroke', '#fff') // Set stroke color
      .attr('stroke-width', 1.5) // Set stroke width
      .selectAll('circle') // Select all circle elements
      .data(nodes) // Bind data
      .enter().append('circle') // Append circle elements
      .attr('r', 20) // Set radius
      .attr('fill', d => colorScale(d.type)) // Set fill color
      .call(drag(simulation)) // Apply drag behavior
      .on('contextmenu', (event, d) => { // Add context menu event
        event.preventDefault(); // Prevent default context menu
        handleRightClick(event, d); // Handle right-click
      });

    const labels = svg.append('g') // Append group element for labels
      .selectAll('text') // Select all text elements
      .data(nodes) // Bind data
      .enter().append('text') // Append text elements
      .attr('dy', -25) // Set dy attribute
      .attr('text-anchor', 'middle') // Set text anchor
      .text(d => d.label) // Set text content
      .style('fill', '#fff') // Set fill color
      .style('font-size', '14px'); // Set font size

    simulation.on('tick', () => { // Add tick event to simulation
      link // Update link positions
        .attr('x1', d => d.source.x) // Set x1 attribute
        .attr('y1', d => d.source.y) // Set y1 attribute
        .attr('x2', d => d.target.x) // Set x2 attribute
        .attr('y2', d => d.target.y); // Set y2 attribute

      linkLabels // Update label positions
        .attr('x', d => (d.source.x + d.target.x) / 2) // Set x attribute
        .attr('y', d => (d.source.y + d.target.y) / 2); // Set y attribute

      node // Update node positions
        .attr('cx', d => d.x) // Set cx attribute
        .attr('cy', d => d.y) // Set cy attribute
        .each(applyBounds); // Apply bounds

      labels // Update label positions
        .attr('x', d => d.x) // Set x attribute
        .attr('y', d => d.y); // Set y attribute
    });

    function applyBounds(d) {
      d.x = Math.max(30, Math.min(width - 30, d.x)); // Apply bounds to x
      d.y = Math.max(30, Math.min(height - 30, d.y)); // Apply bounds to y
    }
  };

  // Function to save a new node
  const saveNode = async (type, name) => {
    try {
      const response = await axios.post(`http://localhost:3002/api/${type.toLowerCase()}`, { name }); // Post request to save node
      return response.data; // Return response data
    } catch (error) {
      console.error('Error saving node:', error); // Log error
      throw error; // Throw error
    }
  };

  // Function to handle saving a node
  const handleSaveNode = async (nodeData) => {
    try {
      const newNode = await saveNode(newNodeType, nodeData.name); // Save the new node
      const newNodes = [...nodes, { ...newNode, x: newNodePosition.x, y: newNodePosition.y }]; // Add new node to nodes
      setNodes(newNodes); // Update state with new nodes
      renderGraph(newNodes, links, tempLinks); // Re-render the graph
    } catch (error) {
      console.error('Error saving node:', error); // Log error
    }
  };

  // Function to handle drag behavior
  const drag = simulation => {
    const dragstarted = event => {
      if (!event.active) simulation.alphaTarget(0.3).restart(); // Restart simulation
      event.subject.fx = event.subject.x; // Fix x position
      event.subject.fy = event.subject.y; // Fix y position
    };

    const dragged = event => {
      event.subject.fx = event.x; // Update x position
      event.subject.fy = event.y; // Update y position
    };

    const dragended = event => {
      if (!event.active) simulation.alphaTarget(0); // Stop simulation
      event.subject.fx = null; // Unfix x position
      event.subject.fy = null; // Unfix y position
    };

    return d3.drag()
      .on('start', dragstarted) // Start drag
      .on('drag', dragged) // Drag
      .on('end', dragended); // End drag
  };

  // Handle right-click event on nodes
  const handleRightClick = (event, node) => {
    event.preventDefault(); // Prevent default context menu

    if (selectedNodes.length === 0) { // If no nodes selected
      setSelectedNodes([node]); // Select the node
      highlightNode(node, '#ff0000'); // Highlight the node
      console.log(`Node selected: ${node.id}`); // Log node ID
    } else if (selectedNodes.length === 1) { // If one node selected
      setSelectedNodes([...selectedNodes, node]); // Add the node to selected nodes
      highlightNode(node, '#ff0000'); // Highlight the node
      drawTemporaryLink(selectedNodes[0], node); // Draw a temporary link
      setShowRelForm(true); // Show the relationship form
      console.log(`Node selected: ${node.id}`); // Log node ID
    } else {
      clearSelections(); // Clear selections
      setSelectedNodes([node]); // Select the node
      highlightNode(node, '#ff0000'); // Highlight the node
      console.log(`Node selected: ${node.id}`); // Log node ID
    }
  };

  // Highlight a node
  const highlightNode = (node, color) => {
    d3.select(d3.select(d3Container.current).selectAll('circle').nodes().find(n => d3.select(n).data()[0].id === node.id))
      .attr('stroke', color) // Set stroke color
      .attr('stroke-width', 3); // Set stroke width
  };

  // Draw a temporary link between nodes
  const drawTemporaryLink = (source, target) => {
    setTempLinks([...tempLinks, { source, target, type: 'TEMP' }]); // Add temporary link to state
  };

  // Clear selected nodes and temporary links
  const clearSelections = () => {
    setSelectedNodes([]); // Clear selected nodes
    setTempLinks([]); // Clear temporary links
    d3.select(d3Container.current).selectAll('line.temp-link').remove(); // Remove temporary links from the DOM
    d3.select(d3Container.current)
      .selectAll('circle')
      .attr('stroke', '#fff') // Reset stroke color
      .attr('stroke-width', 1.5); // Reset stroke width
  };

  // Return the main component
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar /> {/* Sidebar component */}
      <div ref={drop} style={{ width: '100%', height: '600px', border: '1px solid black' }}>
        <svg ref={d3Container}></svg> {/* D3 container */}
      </div>
      <NodeForm show={showForm} handleClose={() => setShowForm(false)} handleSave={handleSaveNode} /> {/* NodeForm component */}
      {showRelForm && <RelationshipForm onSubmit={() => setShowRelForm(false)} />} {/* RelationshipForm component */}
    </div>
  );
};

export default D3Graph;
