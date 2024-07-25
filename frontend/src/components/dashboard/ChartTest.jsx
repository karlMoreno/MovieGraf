import React, { useRef, useState } from "react";
import * as d3 from "d3";
import { useDrop } from "react-dnd";
import DiagramSideBar from "./DiagramSidebar";

const ChartTest = () => {
  const d3Container = useRef(null);
  const [nodes, setNodes] = useState([]);

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
      console.log("Adding node:", newNode); // Debugging log
      setNodes((prevNodes) => [...prevNodes, newNode]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Render the graph with nodes
  const renderGraph = () => {
    const svg = d3
      .select(d3Container.current)
      .attr("width", "100%")
      .attr("height", "600");

    // Bind data to circle elements and handle enter, update, and exit selections
    const node = svg.selectAll("circle").data(nodes, (d) => d.id);

    // Enter selection
    node
      .enter()
      .append("circle")
      .attr("r", 20)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("fill", (d) => {
        console.log("Node type:", d.type); // Debugging log
        return colorMap[d.type] || "#FFFFFF";
      });

    // Update selection
    node
      .attr("r", 20)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("fill", (d) => {
        console.log("Node type:", d.type); // Debugging log
        return colorMap[d.type] || "#FFFFFF";
      });

    // Exit selection
    node.exit().remove();

    // Handle text labels
    const labels = svg.selectAll("text").data(nodes, (d) => d.id);

    // Enter selection for labels
    labels
      .enter()
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y - 25)
      .attr("text-anchor", "middle")
      .style("fill", "#fff")
      .style("font-size", "14px")
      .text((d) => d.type);

    // Update selection for labels
    labels
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y - 25)
      .attr("text-anchor", "middle")
      .style("fill", "#fff")
      .style("font-size", "14px")
      .text((d) => d.type);

    // Exit selection for labels
    labels.exit().remove();
  };

  // Call renderGraph to update the SVG whenever nodes change
  React.useEffect(() => {
    renderGraph();
  }, [nodes]);

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
