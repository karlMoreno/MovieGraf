import React, { useRef, useState, useEffect } from "react";
import * as d3 from "d3";
import { useDrop } from "react-dnd";
import DiagramSideBar from "./DiagramSidebar";

const ChartTest = () => {
  const d3Container = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [links, setLinks] = useState([]); // State for links

  const colorMap = {
    Task: "#cc3300", // red
    Asset: "#00cc00", // green
    Scene: "#0066cc", // blue
  };

  const [{ isOver }, drop] = useDrop({
    accept: "node",
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const svg = d3Container.current;
      const svgPoint = svg.createSVGPoint();
      svgPoint.x = offset.x;
      svgPoint.y = offset.y;
      const point = svgPoint.matrixTransform(svg.getScreenCTM().inverse());
      const newNode = {
        id: nodes.length,
        type: item.type,
        x: point.x,
        y: point.y,
      };
      console.log("Adding node:", newNode); // Log the new node
      setNodes((prevNodes) => [...prevNodes, newNode]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Handle Selected Nodes Right click for highlighting
  const handleRightClick = (event, node) => {
    event.preventDefault();
    console.log("Right click on node:", node);

    setSelectedNodes((prevSelectedNodes) => {
      if (prevSelectedNodes.length === 0) {
        console.log("Selecting first node");
        highlightNode(node, "#ff0000");
        return [node];
      } else if (prevSelectedNodes.length === 1) {
        console.log("Selecting second node");
        highlightNode(node, "#ff0000");
        const newLink = { source: prevSelectedNodes[0], target: node };
        setLinks((prevLinks) => [...prevLinks, newLink]); // Add new link
        clearSelections();
        return [...prevSelectedNodes, node];
      } else {
        console.log("Selecting third node, clearing previous selections");
        clearSelections();
        return [node];
      }
    });
  };

  const highlightNode = (node, color) => {
    d3.select(d3Container.current)
      .selectAll("circle")
      .filter((d) => d.id === node.id)
      .attr("stroke", color)
      .attr("stroke-width", 3);
  };

  const clearSelections = () => {
    console.log("Clearing selections");
    d3.select(d3Container.current)
      .selectAll("circle")
      .attr("stroke", "none") // Reset stroke to 'none'
      .attr("stroke-width", 0); // Reset stroke width to 0
    setSelectedNodes([]); // Clear selected nodes
  };

  // Custom drag behavior - Added this part
  const drag = d3.drag()
  .on('start', (event, d) => {
    console.log("Drag start:", d);
    d3.select(event.sourceEvent.target).raise().attr('stroke', 'black');
  })
  .on('drag', (event, d) => {
    console.log("Dragging:", d);
    d.x = event.x;
    d.y = event.y;
    d3.select(event.sourceEvent.target)
      .attr('cx', d.x)
      .attr('cy', d.y);
    renderLinks();
    renderLabels();
  })
  .on('end', (event, d) => {
    console.log("Drag end:", d);
    d3.select(event.sourceEvent.target).attr('stroke', 'none');
  });

  // Render the graph - Modified this part
  const renderGraph = () => {
    const svg = d3.select(d3Container.current)
      .attr("width", "100%")
      .attr("height", "600");

    // Clear previous SVG content
    svg.selectAll("*").remove();

    // Define arrowhead marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 32)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999')
      .style('stroke', 'none');

    // Render links
    renderLinks(); // Added this call

    // Render nodes
    const node = svg.selectAll("circle").data(nodes, (d) => d.id);

    node.enter()
      .append("circle")
      .attr("r", 20) // Node radius
      .attr("cx", (d) => d.x) // Node x position
      .attr("cy", (d) => d.y) // Node y position
      .attr("fill", (d) => colorMap[d.type] || "#FFFFFF") // Node color
      .attr("stroke", "none") // Initial stroke set to 'none'
      .attr("stroke-width", 0) // Initial stroke width set to 0
      .call(drag) // Apply drag behavior - Added this call
      .on("contextmenu", (event, d) => handleRightClick(event, d)); // Right-click event for highlighting nodes

    node.exit().remove(); // Handle exit selection

    // Render labels
    renderLabels(); // Added this call
  };

  // Render links - Added this function
  const renderLinks = () => {
    const svg = d3.select(d3Container.current);
    const link = svg.selectAll('line').data(links);

    link.enter()
      .append('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)');

    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    link.exit().remove();
  };

  // Render labels - Added this function
  const renderLabels = () => {
    const svg = d3.select(d3Container.current);
    const labels = svg.selectAll("text").data(nodes);

    labels.enter()
      .append("text")
      .attr("x", (d) => d.x) // Label x position
      .attr("y", (d) => d.y - 25) // Label y position
      .attr("text-anchor", "middle")
      .style("fill", "#fff")
      .style("font-size", "14px")
      .text((d) => d.type); // Node label

    labels
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y - 25)
      .text((d) => d.type);

    labels.exit().remove();
  };

  useEffect(() => {
    renderGraph();
  }, [nodes, links]);

  useEffect(() => {
    console.log("Updated selectedNodes state:", selectedNodes);
  }, [selectedNodes]);

  return (
    <div style={{ display: "flex" }}>
      <DiagramSideBar /> {/* Render the sidebar */}
      <div
        ref={drop}
        style={{ width: "100%", height: "600px", border: "1px solid black" }}
      >
        <svg ref={d3Container}></svg> {/* SVG container */}
      </div>
    </div>
  );
};

export default ChartTest;
