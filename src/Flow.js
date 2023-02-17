import ReactFlow, {
  Controls, Background, applyNodeChanges, applyEdgeChanges, addEdge, MiniMap,
} from "reactflow";
import 'reactflow/dist/style.css';
import Axios from 'axios';
import { useEffect, useState, useCallback } from "react";

const nodesUrl = 'http://localhost:4000/api/node/Person';
const edgesUrl = 'http://localhost:4000/api/edge';

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

const formatNodes = nodes => {
  const minX = 0;
  const minY = 0;
  const maxX = 1000;
  const maxY = 1000;
  return nodes.map((node, index) => {
    let newNodePosition = getRandomPosition(minX, minY, maxX, maxY);
    while (isNodePositionColliding(newNodePosition, nodes)) {
      newNodePosition = getRandomPosition(minX, minY, maxX, maxY);
    }
    console.log(newNodePosition);
    return {
      id: `${node.elementId}`,
      position: newNodePosition,
      data: { label: `${node.properties.name}` },
    };
  })
};

const formatEdges = edges => edges.map(edge => ({
  id: `${edge.elementId}:${edge.startNodeElementId}-${edge.endNodeElementId}`, source: `${edge.startNodeElementId}`, target: `${edge.endNodeElementId}`, label: `${edge.type}`, type: 'default',
    arrowHead: 'default',
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
