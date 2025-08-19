
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import './ProcessMap.css';

const ProcessMap = () => {
  useEffect(() => {
    const svg = d3.select('#process-map');
    const container = svg.append('g').attr('class', 'zoom-container');

// Define nodes in process map
const nodes = [
  { id: "Dataset", 
      layer: "Environment", 
      x: 100, y: 200,
      exit_x: 0, exit_y: 40,
      entry_x: 0, entry_y: 40},
  { id: "Algorithm", 
      layer: "Development process", 
      x: 300, y: 200,
      exit_x: 0, exit_y: 40,
      entry_x: 0, entry_y: 40},
  { id: "Model (hidden)", 
      layer: "Development process", 
      x: 500, y: 200,
      exit_x: 70, exit_y: 80},
  { id: "Model", 
      layer: "Development process", 
      x: 500, y: 200,
      exit_x: 0, exit_y: 40,
      entry_x: 0, entry_y: 40},
  { id: "Model output", 
      layer: "Development process", 
      x: 500, y: 350,
      entry_x: 70, entry_y: 0},
  { id: "AI System (hidden)", 
      layer: "Use case", 
      x: 700, y: 200,
      exit_x: 70, exit_y: 80,
      entry_x: 70, entry_y: 0},
  { id: "AI System", 
      x: 700, y: 200,
      exit_x: 70, exit_y: 80,
      entry_x: 0, entry_y: 40},
  { id: "Operational data", 
      layer: "Use case", 
      x: 700, y: 50,
      exit_x: 70, exit_y: 80,
      entry_x: 70, entry_y: 0 },
  { id: "System output", 
      layer: "Use case", 
      x: 700, y: 350,
      exit_x: 70, exit_y: 80,
      entry_x: 70, entry_y: 0 },
  { id: "Decision or policy", 
      layer: "Use case", 
      x: 700, y: 500,
      exit_x: 0, exit_y: 0,
      entry_x: 70, entry_y: 0 }
];

// Define links between nodes 
const links = [
  { source: "Dataset", target: "Algorithm", label: "Training" },
  { source: "Dataset", target: "Model", label: "Testing" },
  { source: "Algorithm", target: "Model", label: "Training" },
  { source: "Model", target: "AI System", label: "Deployment process" },
  { source: "Model (hidden)", target: "Model output", label: "Testing" },
  { source: "Operational data", target: "AI System (hidden)", label: "Use case" },
  { source: "AI System", target: "System output", label: "Use case" },
  { source: "System output", target: "Decision or policy" }
];

// Create nodemap for referencing nodes
const nodeMap = {};
nodes.forEach(node => {
  nodeMap[node.id] = node;
});

// Create a tooltop for displaying node information
const tooltip = d3.select('#tooltip');

links.forEach(link => {
  const sourceNode = nodeMap[link.source];
  const targetNode = nodeMap[link.target];
  container.append('path')
    .attr('class', 'link')
    .attr('d', `M${sourceNode.x + sourceNode.exit_x},${sourceNode.y +sourceNode.exit_y} L${targetNode.x + targetNode.entry_x},${targetNode.y + targetNode.entry_y}`);
});

    
    svg.append('defs').append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999');


    const zoom = d3.zoom()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom);

    const nodeGroup = container.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .on('mouseover', function (event, d) {
        tooltip.style('visibility', 'visible')
          .text(`Node: ${d.id}`)
          .style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', () => tooltip.style('visibility', 'hidden'))
      .on('click', (event, d) => console.log('Clicked node:', d.id));


  // // Function for databsase shape
  // function drawDatabaseShape(svg, x, y, width = 60, height = 80) {
  //   const rx = width / 2;
  //   const ry = 10; // ellipse height

  //   const pathData = `
  //     M ${x - rx},${y}
  //     A ${rx},${ry} 0 0,1 ${x + rx},${y}
  //     V ${y + height - ry}
  //     A ${rx},${ry} 0 0,1 ${x - rx},${y + height - ry}
  //     Z
  //   `;

  //   svg.append("path")
  //     .attr("d", pathData)
  //     .attr("fill", "#cce5ff")
  //     .attr("stroke", "#333")
  //     .attr("stroke-width", 1);
  // }

  
// const datasetNode = nodes.find(n => n.id === "Dataset");
// drawDatabaseShape(svg, datasetNode.x, datasetNode.y);

// Assign shapes for each node
nodeGroup.each(function(d) {
  const group = d3.select(this);

    // Database
    if (d.id === "Dataset" || d.id === "Operational data" || d.id === "Model output" || d.id === "System output") {
      group.append('rect') // Change to cylinder shape
        .attr('width', 140)
        .attr('height', 80)
        .attr('rx', 10)
        .attr('ry', 10);
      }
    });

// Add text labels to nodes
nodeGroup.append('text')
  .attr('x', 70)
  .attr('y', 45)
  .attr('text-anchor', 'middle')
  .text(d => d.id);


  }, 
  
  []);

  return (
    <div className="scroll-container">
      <div id="tooltip" className="tooltip"></div>
      <svg id="process-map" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet"></svg>
    </div>
  );
};

export default ProcessMap;
