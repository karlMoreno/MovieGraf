import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const D3Graph = () => {
  const d3Container = useRef(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const { data } = await axios.get('http://localhost:3002/graph');
        const nodes = data.nodes.map(node => ({
          id: node.identity.low,
          label: node.properties.name,
          type: node.labels[0]
        }));
        const links = data.edges.map(edge => ({
          source: edge.start.low,
          target: edge.end.low,
          type: edge.type
        }));
        renderGraph(nodes, links);
      } catch (error) {
        console.error('Error fetching graph data:', error);
      }
    };

    fetchGraphData();
  }, []);

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
      .domain(['Task', 'Participant', 'Asset', 'Context', 'Project']) // Add more types as needed
      .range(['#2E8B57', '#4682B4', '#FFD700', '#FF6347', '#8A2BE2']); // Corresponding colors for each type

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-30))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(20));

    const link = svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke-width', d => Math.sqrt(d.value));

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 10)
      .attr('fill', d => colorScale(d.type)) // Use colorScale to set node color based on type
      .call(drag(simulation));

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

  return (
    <svg ref={d3Container}></svg>
  );
};

export default D3Graph;
