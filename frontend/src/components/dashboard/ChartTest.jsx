import React, { useRef, useState, useEffect } from "react";
import * as d3 from "d3";
import { useDrop } from "react-dnd";
import DiagramSideBar from "./DiagramSidebar";

const ChartTest = () => {
  const d3Container = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);

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
        highlightNode(node, "#FFFFFF");
        return [node];
      } else if (prevSelectedNodes.length === 1) {
        console.log("Selecting second node");
        highlightNode(node, "#FFFFFF");
        return [...prevSelectedNodes, node];
      } else {
        console.log("Selecting third node, clearing previous selections");
        clearSelections();
        // highlightNode(node, "#ff0000");
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
      .attr("stroke", "none")
      .attr("stroke-width", 0);
    setSelectedNodes([]); // Clear selected nodes
  };

  const renderGraph = () => {
    const svg = d3.select(d3Container.current)
      .attr("width", "100%")
      .attr("height", "600");

    const node = svg.selectAll("circle").data(nodes, (d) => d.id);

    node.enter()
      .append("circle")
      .attr("r", 20) // Node radius
      .attr("cx", (d) => d.x) // Node x position
      .attr("cy", (d) => d.y) // Node y position
      .attr("fill", (d) => colorMap[d.type] || "#FFFFFF") // Node color
      .on("contextmenu", (event, d) => handleRightClick(event, d)); // Right-click event for highlighting nodes

    node.exit().remove(); // Handle exit selection

    const labels = svg.selectAll("text").data(nodes);

    labels.enter()
      .append("text")
      .attr("x", (d) => d.x) // Label x position
      .attr("y", (d) => d.y - 25) // Label y position
      .attr("text-anchor", "middle")
      .style("fill", "#fff")
      .style("font-size", "14px")
      .text((d) => d.type); // Node label

    labels.exit().remove();
  };

  useEffect(() => {
    renderGraph();
  }, [nodes]);

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
