// ChartTest.jsx

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
  const [relationships, setRelationships] = useState([]);
  const [newLink, setNewLink] = useState(null); // State for new link being created

  // State variables for context menu
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuNode, setContextMenuNode] = useState(null);
  const [showNodeInfo, setShowNodeInfo] = useState(false);
  const [nodeInfo, setNodeInfo] = useState(null);

  const fetchGraphData = async () => {
    try {
      console.log("fetchGraphData called");
      const response = await fetch("http://localhost:3002/api/graph/get-graph");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched graph data:", data);

        // Update nodes and links
        // Combine assets and tasks into nodes array
        const fetchedNodes = [
          ...data.assets.map((asset) => ({
            ...asset, // Spread asset properties first
            id: asset.id,
            x: asset.x,
            y: asset.y,
            nodeType: "Asset", // Set nodeType after spreading properties
          })),
          ...data.tasks.map((task) => ({
            ...task, // Spread task properties first
            id: task.id,
            x: task.x,
            y: task.y,
            nodeType: "Task", // Set nodeType after spreading properties
          })),
        ];

        // Map relationships to links
        const fetchedLinks = data.relationships
          .map((rel) => {
            const sourceNode = fetchedNodes.find((node) => node.id === rel.sourceId);
            const targetNode = fetchedNodes.find((node) => node.id === rel.targetId);

            if (!sourceNode || !targetNode) {
              console.error('Invalid link data:', rel);
              return null;
            }

            return {
              source: sourceNode,
              target: targetNode,
              type: rel.type,
            };
          })
          .filter((link) => link !== null);

        // Update state
        setNodes(fetchedNodes);
        setLinks(fetchedLinks);
        setAssets(data.assets);
        setTasks(data.tasks);
        setRelationships(data.relationships);
      } else {
        console.error("Failed to fetch graph data");
      }
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };

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
        nodeType: item.type, // Use nodeType to distinguish between Asset and Task
        x: point.x,
        y: point.y,
      };
      console.log("Adding node:", newNode); // Log the new node
      setNodes((prevNodes) => [...prevNodes, newNode]);
      if (item.type === "Asset") {
        setShowAssetForm(true); // Show the AssetForm
        setNewNode(newNode); // Set the new node to be edited
      } else if (item.type === "Task") {
        setShowTaskForm(true); // Show the TaskForm
        setNewNode(newNode); // Set the new node to be edited
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleRightClick = (event, node) => {
    event.preventDefault();
    console.log("Right click on node:", node);

    // Set the position of the context menu to the mouse coordinates
    setContextMenuPosition({ x: event.pageX, y: event.pageY });
    setContextMenuNode(node); // Set the current node
    setContextMenuVisible(true); // Show the context menu
  };

  const initiateRelationshipCreation = (node) => {
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
        return [];
      } else {
        console.log("You probably selected the same node twice");
        clearSelections();
        return [];
      }
    });
  };

  const viewNodeInfo = (node) => {
    setNodeInfo(node);
    setShowNodeInfo(true);
  };

  const deleteNode = (node) => {
    // Remove the node from the nodes array
    setNodes((prevNodes) => prevNodes.filter((n) => n.id !== node.id));

    // Remove any links associated with this node
    setLinks((prevLinks) =>
      prevLinks.filter((link) => link.source.id !== node.id && link.target.id !== node.id)
    );

    // Remove from assets or tasks
    if (node.nodeType === "Asset") {
      setAssets((prevAssets) => prevAssets.filter((asset) => asset.id !== node.id));
    } else if (node.nodeType === "Task") {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== node.id));
    }

    // Optionally, call the DELETE API endpoint
    /*
    fetch(`http://localhost:3002/api/graph/delete-node/${node.nodeType}/${node.id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          console.log('Node deleted from database:', node);
        } else {
          console.error('Failed to delete node from database');
        }
      })
      .catch((error) => {
        console.error('Error deleting node from database:', error);
      });
    */

    console.log("Deleted node:", node);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuVisible) {
        setContextMenuVisible(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenuVisible]);

  // Modify the drag behavior
  const drag = d3
    .drag()
    .on("start", (event, d) => {
      console.log("Drag start:", d);
      d3.select(event.sourceEvent.target).raise().attr("stroke", "black");
    })
    .on("drag", (event, d) => {
      console.log("Dragging:", d);
      d.x = event.x;
      d.y = event.y;

      updatePositions();
    })
    .on("end", (event, d) => {
      console.log("Drag end:", d);
      d3.select(event.sourceEvent.target).attr("stroke", "none");

      // Update positions in assets or tasks
      if (d.nodeType === "Asset") {
        setAssets((prevAssets) =>
          prevAssets.map((asset) => (asset.id === d.id ? { ...asset, x: d.x, y: d.y } : asset))
        );
      } else if (d.nodeType === "Task") {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === d.id ? { ...task, x: d.x, y: d.y } : task))
        );
      }
    });

  // Corrected updatePositions function
  const updatePositions = () => {
    const svg = d3.select(d3Container.current);

    // Update node positions
    svg
      .selectAll("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y);

    // Update label positions
    svg
      .selectAll(".node-label")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y - 25);

    // Update link positions
    svg
      .selectAll("line")
      .attr("x1", (d) => (d.source ? d.source.x : 0))
      .attr("y1", (d) => (d.source ? d.source.y : 0))
      .attr("x2", (d) => (d.target ? d.target.x : 0))
      .attr("y2", (d) => (d.target ? d.target.y : 0));

    // Update link labels
    svg
      .selectAll(".link-label")
      .attr("x", (d) => (d.source && d.target ? (d.source.x + d.target.x) / 2 : 0))
      .attr("y", (d) => (d.source && d.target ? (d.source.y + d.target.y) / 2 : 0));
  };

  // Render the graph
  const renderGraph = () => {
    const svg = d3.select(d3Container.current).attr("width", "100%").attr("height", "600");

    // Clear previous SVG content
    svg.selectAll("*").remove();

    // Define arrowhead marker
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 32)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#999")
      .style("stroke", "none");

    // Render links
    renderLinks();

    // Render nodes
    const node = svg.selectAll("circle").data(nodes, (d) => d.id);

    node
      .enter()
      .append("circle")
      .attr("r", 20) // Node radius
      .attr("cx", (d) => d.x) // Node x position
      .attr("cy", (d) => d.y) // Node y position
      .attr("fill", (d) => {
        console.log("Node ID:", d.id, "NodeType:", d.nodeType);
        const color = colorMap[d.nodeType] || "#FFFFFF";
        console.log("Assigned color:", color);
        return color;
      }) // Node color
      .attr("stroke", "none") // Initial stroke set to 'none'
      .attr("stroke-width", 0) // Initial stroke width set to 0
      .call(drag) // Apply drag behavior
      .on("contextmenu", (event, d) => handleRightClick(event, d)); // Right-click event

    node.exit().remove(); // Handle exit selection

    // Render labels
    renderLabels();
  };

  // Render links
  const renderLinks = () => {
    const svg = d3.select(d3Container.current);

    if (!links || links.length === 0) {
      console.warn('No links to render');
      return;
    }

    const link = svg.selectAll("line").data(links);

    link
      .enter()
      .append("line")
      .attr("x1", (d) => (d.source ? d.source.x : 0))
      .attr("y1", (d) => (d.source ? d.source.y : 0))
      .attr("x2", (d) => (d.target ? d.target.x : 0))
      .attr("y2", (d) => (d.target ? d.target.y : 0))
      .attr("stroke", "#999")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");

    link
      .attr("x1", (d) => (d.source ? d.source.x : 0))
      .attr("y1", (d) => (d.source ? d.source.y : 0))
      .attr("x2", (d) => (d.target ? d.target.x : 0))
      .attr("y2", (d) => (d.target ? d.target.y : 0));

    link.exit().remove();

    // Render link labels
    const linkLabels = svg.selectAll(".link-label").data(links);

    linkLabels
      .enter()
      .append("text")
      .attr("class", "link-label")
      .attr("x", (d) => (d.source && d.target ? (d.source.x + d.target.x) / 2 : 0))
      .attr("y", (d) => (d.source && d.target ? (d.source.y + d.target.y) / 2 : 0))
      .attr("text-anchor", "middle")
      .style("fill", "#fff")
      .style("font-size", "12px")
      .text((d) => d.type);

    linkLabels
      .attr("x", (d) => (d.source && d.target ? (d.source.x + d.target.x) / 2 : 0))
      .attr("y", (d) => (d.source && d.target ? (d.source.y + d.target.y) / 2 : 0))
      .text((d) => d.type);

    linkLabels.exit().remove();
  };

  // Render labels
  const renderLabels = () => {
    const svg = d3.select(d3Container.current);
    const labels = svg.selectAll(".node-label").data(nodes);

    labels
      .enter()
      .append("text")
      .attr("class", "node-label")
      .attr("x", (d) => d.x) // Label x position
      .attr("y", (d) => d.y - 25) // Label y position
      .attr("text-anchor", "middle")
      .style("fill", "#fff")
      .style("font-size", "14px")
      .text((d) => {
        if (d.nodeType === "Asset") return d.name; // Display 'name' for assets
        if (d.nodeType === "Task") return d.title; // Display 'title' for tasks
        return ""; // Default to empty string if none match
      });

    labels
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y - 25)
      .text((d) => {
        if (d.nodeType === "Asset") return d.name;
        if (d.nodeType === "Task") return d.title;
        return "";
      });

    labels.exit().remove();
  };

  useEffect(() => {
    renderGraph();
  }, [nodes, links]);

  useEffect(() => {
    fetchGraphData();
  }, []);

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

  const handleSaveGraph = async () => {
    const graphData = {
      assets,
      tasks,
      relationships,
    };
    console.log("Graph data being saved:", graphData); // Log the graph data

    try {
      const response = await fetch("http://localhost:3002/api/graph/save-graph", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(graphData),
      });

      if (response.ok) {
        console.log("Graph saved successfully");
        alert("Graph saved successfully!");
      } else {
        console.error("Failed to save graph");
        alert("Failed to save graph");
      }
    } catch (error) {
      console.error("Error saving graph:", error);
      alert("Error saving graph");
    }
  };

  const handleSaveAsset = (assetData) => {
    const updatedAsset = {
      ...assetData,
      id: newNode.id, // Ensure the asset has the same id as the node
      x: newNode.x,
      y: newNode.y,
    };
    console.log("Saving asset:", updatedAsset); // Log the asset data
    setAssets((prevAssets) => [...prevAssets, updatedAsset]); // Store the asset data in the state
    setShowAssetForm(false);
  };

  const handleSaveTask = (taskData) => {
    const updatedTask = {
      ...taskData,
      id: newNode.id, // Ensure the task has the same id as the node
      x: newNode.x, // This will always have the latest position
      y: newNode.y,
    };

    console.log("Saving task:", updatedTask); // Log the updated task data
    setTasks((prevTasks) => [...prevTasks, updatedTask]); // Store the updated task data in the state
    setShowTaskForm(false); // Close the task form
  };

  const handleSaveRelationship = (relationshipType) => {
    if (newLink) {
      const relationshipData = {
        sourceId: newLink.source.id,
        targetId: newLink.target.id,
        type: relationshipType,
      };
      console.log("Saving relationship:", relationshipData); // Log the relationship

      // Update links state for rendering
      const labeledLink = { ...newLink, type: relationshipType };
      setLinks((prevLinks) => [...prevLinks, labeledLink]);

      // Store the relationship data in the relationships array
      setRelationships((prevRelationships) => [...prevRelationships, relationshipData]);

      setNewLink(null);
      setShowRelationshipForm(false);
    }
  };

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", marginBottom: "10px" }}>
        <DiagramSideBar /> {/* Render the sidebar */}
        <div
          ref={drop}
          style={{ width: "100%", height: "600px", border: "1px solid black" }}
        >
          <svg ref={d3Container}></svg> {/* SVG container */}
        </div>
      </div>
      <button onClick={handleSaveGraph} style={{ alignSelf: "center" }}>
        Save Graph
      </button>
      {/* Context Menu */}
      {contextMenuVisible && (
        <div
          style={{
            position: "absolute",
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
            backgroundColor: "#333", // Dark background color
            border: "1px solid #555", // Dark border color
            borderRadius: "4px",
            zIndex: 1000,
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: "5px" }}>
            <li
              style={{ padding: "5px", cursor: "pointer", color: "#fff" }} // White font color
              onClick={() => {
                setContextMenuVisible(false);
                initiateRelationshipCreation(contextMenuNode);
              }}
            >
              Create Relationship
            </li>
            <li
              style={{ padding: "5px", cursor: "pointer", color: "#fff" }} // White font color
              onClick={() => {
                setContextMenuVisible(false);
                viewNodeInfo(contextMenuNode);
              }}
            >
              View Info
            </li>
            <li
              style={{ padding: "5px", cursor: "pointer", color: "#ff4d4d" }} // Bright red color for delete
              onClick={() => {
                setContextMenuVisible(false);
                deleteNode(contextMenuNode);
              }}
            >
              Delete Node
            </li>
          </ul>
        </div>
      )}
      {/* Node Info Modal */}
      {showNodeInfo && (
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "20%",
            width: "60%",
            backgroundColor: "#333", // Dark background color
            color: "#fff", // White font color
            border: "1px solid #555", // Dark border color
            borderRadius: "4px",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <h3>Node Information</h3>
          {/* Customize the display as needed */}
          {nodeInfo && (
            <div>
              <p>
                <strong>ID:</strong> {nodeInfo.id}
              </p>
              {nodeInfo.nodeType === "Asset" && (
                <div>
                  <p>
                    <strong>Name:</strong> {nodeInfo.name}
                  </p>
                  <p>
                    <strong>Type:</strong> {nodeInfo.type}
                  </p>
                  <p>
                    <strong>Status:</strong> {nodeInfo.status}
                  </p>
                  {/* Include other asset properties */}
                </div>
              )}
              {nodeInfo.nodeType === "Task" && (
                <div>
                  <p>
                    <strong>Title:</strong> {nodeInfo.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {nodeInfo.description}
                  </p>
                  <p>
                    <strong>Assigned To:</strong> {nodeInfo.assignedTo}
                  </p>
                  {/* Include other task properties */}
                </div>
              )}
            </div>
          )}
          <button onClick={() => setShowNodeInfo(false)}>Close</button>
        </div>
      )}
      {/* Existing forms */}
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
