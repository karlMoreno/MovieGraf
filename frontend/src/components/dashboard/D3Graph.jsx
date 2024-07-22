import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import { useDrop } from 'react-dnd';
import Sidebar from './DiagramSidebar';
import NodeForm from './NodeForm';
import RelationshipForm from './RelationshipsForm'; // Import the relationship form component

const D3Graph = () => {
  const d3Container = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showRelForm, setShowRelForm] = useState(false);
  const [newNodeType, setNewNodeType] = useState('');
  const [newNodePosition, setNewNodePosition] = useState({ x: 0, y: 0 });
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [tempLinks, setTempLinks] = useState([]); // State to track temporary links

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const { data } = await axios.get('http://localhost:3002/api/graph/graph-get');
        const fetchedNodes = data.nodes.map(node => ({
          id: node.identity.low,
          label: node.properties.name,
          type: node.labels[0]
        }));
        const fetchedLinks = data.edges.map(edge => ({
          source: edge.start.low,
          target: edge.end.low,
          type: edge.type
        }));
        setNodes(fetchedNodes);
        setLinks(fetchedLinks);
        renderGraph(fetchedNodes, fetchedLinks, tempLinks);
      } catch (error) {
        console.error('Error fetching graph data:', error);
      }
    };

    fetchGraphData();
  }, [tempLinks]); // Update the graph whenever tempLinks changes

  const [{ isOver }, drop] = useDrop({
    accept: 'node',
    drop: (item, monitor) => {
      const offset = monitor.getSourceClientOffset();
      setNewNodeType(item.type);
      setNewNodePosition({ x: offset.x, y: offset.y });
      setShowForm(true);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const renderGraph = (nodes, links, tempLinks) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(d3Container.current)
      .attr('width', '100%')
      .attr('height', '600')
      .call(d3.zoom().on("zoom", (event) => {
        svg.attr("transform", event.transform);
      }))
      .append("g");

    const defs = svg.append('defs');

    // Define arrowhead markers for graph links
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 32) // Adjust refX to provide space between node and arrow
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999')
      .style('stroke', 'none');

    const colorScale = d3.scaleOrdinal()
      .domain(['Task', 'Participant', 'Asset', 'Context', 'Project'])
      .range(['#2E8B57', '#4682B4', '#FFD700', '#FF6347', '#8A2BE2']);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links.concat(tempLinks)).id(d => d.id).distance(150)) // Include tempLinks
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60));

    const link = svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links.concat(tempLinks)) // Include tempLinks
      .enter().append('line')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)'); // Add arrowhead to the end of the line

    // Add edge labels
    const linkLabels = svg.append('g')
      .selectAll('text')
      .data(links.concat(tempLinks)) // Include tempLinks
      .enter().append('text')
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .text(d => d.type)
      .style('fill', '#fff')
      .style('font-size', '10px');

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 20) // Increase node radius
      .attr('fill', d => colorScale(d.type))
      .call(drag(simulation))
      .on('contextmenu', (event, d) => {
        event.preventDefault();
        handleRightClick(event, d);
      });

    const labels = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .attr('dy', -25) // Adjust position of labels for larger nodes
      .attr('text-anchor', 'middle')
      .text(d => d.label)
      .style('fill', '#fff')
      .style('font-size', '14px');

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      linkLabels
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .each(applyBounds);

      labels
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    function applyBounds(d) {
      d.x = Math.max(30, Math.min(width - 30, d.x));
      d.y = Math.max(30, Math.min(height - 30, d.y));
    }
  };

  const saveNode = async (type, name) => {
    try {
      const response = await axios.post(`http://localhost:3002/api/${type.toLowerCase()}`, { name });
      return response.data;
    } catch (error) {
      console.error('Error saving node:', error);
      throw error;
    }
  };

  const handleSaveNode = async (nodeData) => {
    try {
      const newNode = await saveNode(newNodeType, nodeData.name);
      const newNodes = [...nodes, { ...newNode, x: newNodePosition.x, y: newNodePosition.y }];
      setNodes(newNodes);
      renderGraph(newNodes, links, tempLinks); // Update renderGraph call
    } catch (error) {
      console.error('Error saving node:', error);
    }
  };

  const drag = simulation => {
    const dragstarted = event => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    };

    const dragged = event => {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    };

    const dragended = event => {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    };

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  };

  const handleRightClick = (event, node) => {
    event.preventDefault();

    if (selectedNodes.length === 0) {
      setSelectedNodes([node]);
      highlightNode(node, '#ff0000');
    } else if (selectedNodes.length === 1) {
      setSelectedNodes([...selectedNodes, node]);
      highlightNode(node, '#0000ff');
      drawTemporaryLink(selectedNodes[0], node);
      setShowRelForm(true);
    } else {
      clearSelections();
      setSelectedNodes([node]);
      highlightNode(node, '#ff0000');
    }
  };

  const highlightNode = (node, color) => {
    d3.selectAll('circle')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);

    d3.select(d3.select(d3Container.current).selectAll('circle').nodes().find(n => d3.select(n).data()[0].id === node.id))
      .attr('stroke', color)
      .attr('stroke-width', 3);
  };

  const drawTemporaryLink = (source, target) => {
    setTempLinks([...tempLinks, { source, target, type: 'TEMP' }]);
  };

  const clearSelections = () => {
    setSelectedNodes([]);
    setTempLinks([]);
    d3.select(d3Container.current).selectAll('line.temp-link').remove();
    d3.select(d3Container.current)
      .selectAll('circle')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div ref={drop} style={{ width: '100%', height: '600px', border: '1px solid black' }}>
        <svg ref={d3Container}></svg>
      </div>
      <NodeForm show={showForm} handleClose={() => setShowForm(false)} handleSave={handleSaveNode} />
      {showRelForm && <RelationshipForm onSubmit={() => setShowRelForm(false)} />} {/* Close the form on submit */}
    </div>
  );
};

export default D3Graph;
