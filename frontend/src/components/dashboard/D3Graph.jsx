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
  const [isDrawing, setIsDrawing] = useState(false);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const { data } = await axios.get('http://localhost:3002/graph');
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
        renderGraph(fetchedNodes, fetchedLinks);
      } catch (error) {
        console.error('Error fetching graph data:', error);
      }
    };

    fetchGraphData();
  }, []);

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

  const renderGraph = (nodes, links) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(d3Container.current)
      .attr('width', '100%')
      .attr('height', '600')
      .call(d3.zoom().on("zoom", (event) => {
        svg.attr("transform", event.transform);
      }))
      .append("g");

    const colorScale = d3.scaleOrdinal()
      .domain(['Task', 'Participant', 'Asset', 'Context', 'Project'])
      .range(['#2E8B57', '#4682B4', '#FFD700', '#FF6347', '#8A2BE2']);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-10))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(20));

    const link = svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke-width', 2);

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 10)
      .attr('fill', d => colorScale(d.type))
      .call(drag(simulation))
      .on('mousedown', (event, d) => handleMouseDown(d))
      .on('mouseup', (event, d) => handleMouseUp(d));

    const labels = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter().append('text')
      .attr('dy', -15)
      .attr('text-anchor', 'middle')
      .text(d => d.label)
      .style('fill', '#fff')
      .style('font-size', '10px');

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .each(applyBounds);

      labels
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    function applyBounds(d) {
      d.x = Math.max(10, Math.min(width - 10, d.x));
      d.y = Math.max(10, Math.min(height - 10, d.y));
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
      renderGraph(newNodes, links);
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

  const handleMouseDown = (node) => {
    setStartNode(node);
    setIsDrawing(true);
  };

  const handleMouseUp = (node) => {
    if (isDrawing) {
      setEndNode(node);
      setIsDrawing(false);
      setShowRelForm(true);
    }
  };

  const handleFormSubmit = async (relationshipData) => {
    if (startNode && endNode) {
      try {
        const response = await axios.post('http://localhost:3002/api/relationships/create', {
          startNodeId: startNode.id,
          endNodeId: endNode.id,
          relationshipData
        });
        setShowRelForm(false);
        window.location.reload(); // Reload to see the new relationship
      } catch (error) {
        console.error('Error creating relationship:', error);
      }
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div ref={drop} style={{ width: '100%', height: '600px', border: '1px solid black' }}>
        <svg ref={d3Container}></svg>
      </div>
      <NodeForm show={showForm} handleClose={() => setShowForm(false)} handleSave={handleSaveNode} />
      {showRelForm && <RelationshipForm onSubmit={handleFormSubmit} />}
    </div>
  );
};

export default D3Graph;
