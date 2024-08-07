import React, { useRef, useState, useEffect } from "react";
import * as d3 from "d3";
import { useDrop } from "react-dnd";
import DiagramSideBar from "./DiagramSidebar";
import AssetForm from "../forms/AssetForm";
import TasksForm from "../forms/TasksForm";
import RelationshipForm from "../forms/RelationshipForm";

const ChartTest = () => {
  const d3Container = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [links, setLinks] = useState([]); // State for links
  const [showAssetForm, setShowAssetForm] = useState(false); // State for AssetForm visibility
  const [showTaskForm, setShowTaskForm] = useState(false); // State for TaskForm visibility
  const [showRelationshipForm, setShowRelationshipForm] = useState(false); // State for RelationshipForm visibility
  const [newNode, setNewNode] = useState(null); // State for new node being edited
  const [assets, setAssets] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [scenes, setScenes] = useState([]);
  const [artists, setArtists] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [newLink, setNewLink] = useState(null); // State for new link being created

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
      if (item.type === "Asset") {
        setShowAssetForm(true);  // Show the AssetForm
        setNewNode(newNode);     // Set the new node to be edited
      } else if (item.type === "Task") {
        setShowTaskForm(true);  // Show the TaskForm
        setNewNode(newNode);    // Set the new node to be edited
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleRightClick = (event, node) => {
    event.preventDefault();
    console.log("Right click on node:", node);

    setSelectedNodes((prevSelectedNodes) => {
      if (prevSelectedNodes.length === 0) {
        console.log("Selecting first node");
        highlightNode(node, "#ff0000");
        return [node];
      } else if (prevSelectedNodes.length === 1 && node !== prevSelectedNodes[0]) {
        console.log("Selecting second node");
        highlightNode(node, "#ff0000");
        setNewLink({ source: prevSelectedNodes[0], target: node }); // Set the new link
        setShowRelationshipForm(true); // Show the RelationshipForm
        return [...prevSelectedNodes, node];
      } else {
        console.log("You probably selected the same node twice");
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

  // Custom drag behavior with requestAnimationFrame
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

      // Throttle rendering updates using requestAnimationFrame
      if (!dragging) {
        dragging = true;
        window.requestAnimationFrame(() => {
          updatePositions(d);
          dragging = false;
        });
      }
    })
    .on('end', (event, d) => {
      console.log("Drag end:", d);
      d3.select(event.sourceEvent.target).attr('stroke', 'none');
    });

  let dragging = false; // Flag to control rendering updates

  const updatePositions = (d) => {
    const svg = d3.select(d3Container.current);

    // Update node position
    svg.selectAll('circle')
      .filter((node) => node.id === d.id)
      .attr('cx', d.x)
      .attr('cy', d.y);

    // Update label position
    svg.selectAll('text')
      .filter((node) => node && node.id === d.id)
      .attr('x', d.x)
      .attr('y', d.y - 25);

    // Update link positions
    svg.selectAll('line')
      .filter((link) => link.source && link.target)
      .attr('x1', (link) => link.source.x)
      .attr('y1', (link) => link.source.y)
      .attr('x2', (link) => link.target.x)
      .attr('y2', (link) => link.target.y);

    // Update link labels
    svg.selectAll(".link-label")
      .filter((link) => link.source && link.target)
      .attr("x", (d) => (d.source.x + d.target.x) / 2)
      .attr("y", (d) => (d.source.y + d.target.y) / 2);
  };

  // Render the graph
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
    renderLinks();

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
      .call(drag) // Apply drag behavior
      .on("contextmenu", (event, d) => handleRightClick(event, d)); // Right-click event for highlighting nodes

    node.exit().remove(); // Handle exit selection

    // Render labels
    renderLabels();
  };

  // Render links
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

    // Render link labels
    const linkLabels = svg.selectAll(".link-label").data(links);

    linkLabels.enter()
      .append("text")
      .attr("class", "link-label")
      .attr("x", d => (d.source.x + d.target.x) / 2)
      .attr("y", d => (d.source.y + d.target.y) / 2)
      .attr("text-anchor", "middle")
      .style("fill", "#fff")
      .style("font-size", "12px")
      .text(d => d.type);

    linkLabels
      .attr("x", d => (d.source.x + d.target.x) / 2)
      .attr("y", d => (d.source.y + d.target.y) / 2)
      .text(d => d.type);

    linkLabels.exit().remove();
  };

  // Render labels
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

  useEffect(() => {
    console.log("Current assets:", assets); // Log current assets array whenever it changes
  }, [assets]);

  useEffect(() => {
    console.log("Current tasks:", tasks); // Log current tasks array whenever it changes
  }, [tasks]);

  useEffect(() => {
    console.log("Current relationships:", relationships); // Log current relationships array whenever it changes
  }, [relationships]);

  const handleSaveAsset = (assetData) => {
    console.log("Saving asset:", assetData); // Log the asset data
    setAssets((prevAssets) => [...prevAssets, assetData]); // Store the asset data in the state
    setShowAssetForm(false);
  };

  const handleSaveTask = (taskData) => {
    console.log("Saving task:", taskData); // Log the task data
    setTasks((prevTasks) => [...prevTasks, taskData]); // Store the task data in the state
    setShowTaskForm(false);
  };

  const handleSaveRelationship = (relationshipType) => {
    if (newLink) {
      const labeledLink = { ...newLink, type: relationshipType };
      console.log("Saving relationship:", labeledLink); // Log the relationship
      setLinks((prevLinks) => [...prevLinks, labeledLink]); // Store the link with label in the state
      setRelationships((prevRelationships) => [...prevRelationships, labeledLink]); // Store in relationships array
      setNewLink(null);
      setShowRelationshipForm(false);
    }
  };


    

  return (
    <div style={{ display: "flex" }}>
      <DiagramSideBar /> {/* Render the sidebar */}
      <div
        ref={drop}
        style={{ width: "100%", height: "600px", border: "1px solid black" }}
      >
        <svg ref={d3Container}></svg> {/* SVG container */}
      </div>
      {showAssetForm && (
        <AssetForm
          onClose={() => setShowAssetForm(false)}
          onSave={handleSaveAsset} // Pass the handleSaveAsset function as a prop
        />
      )}
      {showTaskForm && (
        <TasksForm
          onClose={() => setShowTaskForm(false)}
          onSave={handleSaveTask} // Pass the handleSaveTask function as a prop
        />
      )}
      {showRelationshipForm && (
        <RelationshipForm
          onClose={() => setShowRelationshipForm(false)}
          onSave={handleSaveRelationship} // Pass the handleSaveRelationship function as a prop
        />
      )}
    </div>
  );
};

export default ChartTest;
