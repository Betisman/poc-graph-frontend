import ReactFlow, {
  Controls, Background, applyNodeChanges, applyEdgeChanges, addEdge, MiniMap, MarkerType,
} from "reactflow";
import 'reactflow/dist/style.css';
import Axios from 'axios';
import { useEffect, useState, useCallback } from "react";
import * as d3 from 'd3';


const nodesUrl = 'http://localhost:4000/api/node/Person';
const edgesUrl = 'http://localhost:4000/api/edge';

// ----------------------------------------------------
const getRandomPosition = (minX, minY, maxX, maxY) => {
  const x = Math.random() * (maxX - minX) + minX;
  const y = Math.random() * (maxY - minY) + minY;
  return { x, y };
};

const isNodePositionColliding = (newNodePosition, nodes) => {
  for (let i = 0; i < nodes.length; i++) {
    const existingNodePosition = nodes[i].position || { x: 0, y: 0};
    const distance = Math.sqrt(
      (newNodePosition.x - existingNodePosition.x) ** 2 +
      (newNodePosition.y - existingNodePosition.y) ** 2
    );
    if (distance < 100) {
      return true;
    }
  }
  return false;
};
//---------------------------------------------------------
const containerWidth = 1000;
const containerHeight = 1000;
const center = { x: containerWidth / 2, y: containerHeight / 2 };

// const sortedNodes = nodes.sort((a, b) => a.id.localeCompare(b.id));
// const angleSeparation = (2 * Math.PI) / sortedNodes.length;
// const angleSeparation = nodes => (2 * Math.PI) / nodes.length;

const radius = 700;
const getCircularPosition = (node, index, nodesLength) => {
  const angleSeparation = (2 * Math.PI) / nodesLength;
  const angle = angleSeparation * index;
  const x = radius * Math.cos(angle) + center.x;
  const y = radius * Math.sin(angle) + center.y;

  // Situar nodo en el diagrama
  return { x, y };
};
//---------------------------------------------------------
const generateCircleLayout2 = (nodes, radius) => {
  // const renodes = nodes.map(n => ({ id: n.elementId, position: { x: 0, y: 0 }, name: n.elementId }))
  // console.log('circle nodes', renodes)
  const root = d3.pack().size([radius, radius])(d3.hierarchy({ children: nodes }).sum(() => 1));
  const positions = {};
  console.log(positions)
  root.descendants().forEach((node) => {
    
    positions[node.data.elementId] = {
      x: node.x - radius / 2,
      y: node.y - radius / 2,
    };
  });
  console.log('---', positions)
  return positions;
}

function generateCircleLayout(nodes, radius) {
  const centerX = radius;
  const centerY = radius;

  const simulation = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-100))
    .force("x", d3.forceX(centerX))
    .force("y", d3.forceY(centerY))
    .force("collision", d3.forceCollide().radius(100))
    .stop();

  for (let i = 0; i < 300; i++) {
    simulation.tick();
  }

  const positions = {};
  nodes.forEach((node) => {
    console.log(node)
    positions[node.elementId] = {
      x: node.x - radius / 2,
      y: node.y - radius / 2,
    };
  });

  return positions;
}


//---------------------------------------------------------

const formatNodes = nodes => {
  const minX = 0;
  const minY = 0;
  const maxX = 1000;
  const maxY = 1000;
  const positions = generateCircleLayout(nodes, 200);
  return nodes.map((node, index) => {
    // let newNodePosition = getRandomPosition(minX, minY, maxX, maxY);
    // while (isNodePositionColliding(newNodePosition, nodes)) {
    //   newNodePosition = getRandomPosition(minX, minY, maxX, maxY);
    // }
    // let newNodePosition = getCircularPosition(node, index, nodes.length);
    let newNodePosition = positions[node.elementId];
    return {
      id: `${node.elementId}`,
      position: newNodePosition,
      data: { label: `${node.properties.name}` },
      style: { width: '200px' },
    };
  })
};

const edgeColors = {
  operational: 'red',
  hardskills: 'blue',
  softskills: 'limegreen',
}
const formatEdges = edges => edges.map(edge => ({
  id: `${edge.elementId}:${edge.startNodeElementId}-${edge.endNodeElementId}`, source: `${edge.startNodeElementId}`, target: `${edge.endNodeElementId}`, label: `${edge.type}`, type: 'default',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: {
      stroke: edgeColors[edge.type.toLowerCase().replace(' ', '')]
    }
}));

const Flow = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  useEffect(() => {
    Axios.get(nodesUrl).then(res => setNodes(formatNodes(res.data)))
      .then(() => {
        Axios.get(edgesUrl).then(res => setEdges(formatEdges(res.data)))
      })
  }, []);

  return (<div style={{ height: '100%' }}>
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    >
      <MiniMap />
      <Background></Background>
      <Controls></Controls>
    </ReactFlow>
  </div>)
};

export default Flow;
