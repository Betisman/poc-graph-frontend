import React, {useState, useEffect, useRef} from "react";
import {Network} from "vis-network"
import {DataSet, DataView} from "vis-data";
import './App.css';

import AddNodeModal from "./components/AddModals/AddNodeModal";
import GraphControls from "./components/GraphControls/GraphControls";
import AddEdgeModal from "./components/AddModals/AddEdgeModal";
import Snackbar from '@mui/material/Snackbar';

import useGraphHook from "./hooks/useGraph.hook";

import generateNode from "./lib/transformNode";
import generateEdge from "./lib/transformEdge";

const App = () => {
  const [network, setNetwork] = useState(null)
  const [graph, setGraph] = useState({nodes: [], edges: []})
  const [neighbourMode, setNeighbourMode] = useState(false)
  const [editModeControl, setEditModeControl] = useState(null)
  const [filterModeControl, setFilterModeControl] = useState(null)
  const [temporaryEdge, setTemporaryEdge] = useState(null)
  const [temporaryNode, setTemporaryNode] = useState(null)
  const [searchNode, setSearchNode] = useState(null)
  const [dataset, setDataset] = useState({})

  const {getGraph} = useGraphHook()

  const visJsRef = useRef(null);

  useEffect(() => {
    getGraph().then(({nodes, edges}) => {
      setGraph(() => ({nodes, edges}))
      const nodesDataset = new DataSet(nodes.map(generateNode))
      const edgesDataset = new DataSet(edges.map(generateEdge))
      setDataset(() => ({
        nodes: nodesDataset,
        edges: edgesDataset,
      }))
      const network = new Network(
        visJsRef.current,
        {nodes: nodesDataset, edges: edgesDataset},
        {
          physics: {
            solver: 'forceAtlas2Based',
            hierarchicalRepulsion: {
              avoidOverlap: 1,
            },
            forceAtlas2Based: {
              avoidOverlap: 0.4,
              gravitationalConstant: -26,
              centralGravity: 0.005,
              springLength: 230,
              springConstant: 0.18,
            },
            maxVelocity: 150,
            minVelocity: 2,
            timestep: 1
          },
          manipulation: {
            addNode: (data, callback) => {
              setTemporaryNode({...data, label: "", seniority: ""})
            }
          }
        },
      );
      setNetwork(network)
      network.on("doubleClick", (({nodes, edges}) => {
        if (!nodes.length) {
          nodesDataset.update(nodesDataset.map(item => ({
            ...item,
            hidden: false,
          })))
        } else {
          const nodesToShow = new Set(nodes)
          edgesDataset.get(edges).forEach(({from, to}) => {
            if (from) nodesToShow.add(from)
            if (to) nodesToShow.add(to)
          })
          nodesDataset.update(nodesDataset.map(item => ({
            ...item,
            ...(!nodesToShow.has(item.id) ? {hidden: true} : {hidden: false})
          })))
        }
      }))

      network.on("select", ({ nodes }) => {
        console.log(nodes)
      })
      document.addEventListener('keyup', (event) => {
        if (!network) return
        if (event.code === 'Backspace') {
          const selectedNodes = network.getSelectedNodes();
          const selectedEdges = network.getSelectedEdges();
          nodesDataset.remove(selectedNodes)
          edgesDataset.remove(selectedEdges)
        }
      })
    })
  }, []);

  useEffect(() => {
    if (searchNode) {
      const scale = 0.8;
      network.focus(searchNode.id, {scale})
      network.selectNodes([searchNode.id]);
    }
  }, [searchNode]);

  const getNode = id => graph.nodes.find(({id: nodeId}) => id === nodeId)

  const getNodeIndex = id => graph.nodes.findIndex(({id: nodeIndex}) => id === nodeIndex)

  const setNodesVisibility = (nodes, state) => nodes.map(node => ({...node, hidden: state}))

  const deleteEntities = (currentEntities, idsToDelete) => currentEntities.filter(({id}) => !idsToDelete.includes(id))

  const events = {
    select: ({nodes}) => {
      const selectedNode = getNode(nodes[0])
      if (!selectedNode) {
        setNeighbourMode(false)
        setGraph(prevState => ({
          ...prevState,
          nodes: setNodesVisibility(prevState.nodes, false)
        }))
      } else {
        setTemporaryNode(selectedNode)
      }
    },
    dragEnd: () => !neighbourMode && network.selectNodes([]),
  }

  const handleSaveNode = () => {
    dataset.nodes.add(generateNode(temporaryNode))
    setTemporaryNode(null)
    setEditModeControl(null)
  }

  const handleAddEdge = (relationType) => {
    const from = temporaryEdge.from
    const to = temporaryEdge.to
    setGraph(prevState => ({
      ...prevState,
      edges: [...prevState.edges, generateEdge({from, to, relationType})]
    }))
    setTemporaryEdge(null)
    setEditModeControl(null)
  }

  const handleCloseAddNode = () => {
    setTemporaryNode(null)
    setEditModeControl(null)
  }

  const handleCloseEdge = () => {
    setTemporaryEdge(null)
    setEditModeControl(null)
  }

  useEffect(() => {
    const editModeActions = {
      'add-node': () => network?.addNodeMode(),
      'add-edge': () => network?.addEdgeMode(),
      null: () => network?.disableEditMode()
    }
    const selectedAction = editModeActions[editModeControl] || editModeActions.null
    selectedAction()
  }, [editModeControl])

  return (
    <>
      <GraphControls
        className={"button-group"}
        editMode={editModeControl}
        onChangeEditMode={setEditModeControl}
        filterMode={filterModeControl}
        onChangeFilterMode={setFilterModeControl}
        nodes={graph.nodes}
        onChangeSearch={setSearchNode}
      />
      <AddNodeModal
        open={!!temporaryNode}
        onClose={handleCloseAddNode}
        onSave={handleSaveNode}
        name={temporaryNode?.label}
        setName={(value) => setTemporaryNode(prevState => ({...prevState, label: value}))}
        seniority={temporaryNode?.seniority}
        setSeniority={(value) => setTemporaryNode(prevState => ({...prevState, seniority: value}))}
      />
      <AddEdgeModal
        open={!!temporaryEdge}
        onClose={handleCloseEdge}
        onAdd={handleAddEdge}
      />
      <Snackbar
        open={editModeControl === 'add-node'}
        message={'Click to add a new Node'}
      />
      <Snackbar
        open={editModeControl === 'add-edge'}
        message={'Click on a Node and drag to other Node'}
      />
      <div
        ref={visJsRef}
        style={{
          height: '100%',
          width: '100%'
        }}
      />
    </>
  )
}

export default App;
