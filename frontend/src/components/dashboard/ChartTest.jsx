import React, { useRef, useState} from 'react';
import * as d3 from 'd3';
import {useDrop} from 'react-dnd';
import SideBar from './DiagramSidebar';

const ChartTest = () => {
    const d3Container = useRef(null);
    const [nodes,setNodes] = useState([]);

    const [{isOver}, drop] = useDrop({
        accept: 'node',
        drop: (item,monitor) => {
            const offset = monitor.getSourceClientOffset();
            const container = d3Container.current.getBoundingClientReact();
            const newNode = {
                id: nodes.length,
                label: item.type,
                x: offset.x - container.left,
                y: offset.y - container.top,

            };
            setNodes([...nodes,newNode]);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        })
    })
// Render the graph with nodes
const renderGraph = () => {
    const svg = d3.select(d3Container.current)
      .attr('width', '100%')
      .attr('height', '600');

    const node = svg.selectAll('circle')
      .data(nodes)
      .enter().append('circle')
      .attr('r', 20) // Node radius
      .attr('cx', d => d.x) // Node x position
      .attr('cy', d => d.y) // Node y position
      .attr('fill', '#4682B4'); // Node color

    const labels = svg.selectAll('text')
      .data(nodes)
      .enter().append('text')
      .attr('x', d => d.x) // Label x position
      .attr('y', d => d.y - 25) // Label y position
      .attr('text-anchor', 'middle')
      .style('fill', '#fff')
      .style('font-size', '14px')
      .text(d => d.label); // Node label
  };

  // Call renderGraph to update the SVG whenever nodes change
  React.useEffect(() => {
    renderGraph();
  }, [nodes]);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar /> {/* Render the sidebar */}
      <div ref={drop} style={{ width: '100%', height: '600px', border: '1px solid black' }}>
        <svg ref={d3Container}></svg> {/* SVG container */}
      </div>
    </div>
  );
};

export default ChartTest;
