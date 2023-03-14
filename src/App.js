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
  const [networkOptions, setNetworkOptions] = useState({
    manipulation: {
      addNode: (data, _) => {
        setTemporaryNode(data)
      },
      addEdge: (data, _) => {
        if (data.from !== data.to) {
          setTemporaryEdge(data)
        }
      },
      enabled: false,
    },
    edges: {
      smooth: {
        roundness: 0.5
      }
    },
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
      minVelocity: 5,
      timestep: 1
    },
  })
  const [neighbourMode, setNeighbourMode] = useState(false)
  const [editModeControl, setEditModeControl] = useState(null)
  const [filterModeControl, setFilterModeControl] = useState(null)
  const [temporaryEdge, setTemporaryEdge] = useState(null)
  const [temporaryNode, setTemporaryNode] = useState(null)
  const [searchNode, setSearchNode] = useState(null)
  const [stabilized, setStabilized] = useState(null)
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
      // document.addEventListener('keyup', (event) => {
      //   if (!network) return
      //   if (event.code === 'Backspace') {
      //     const selectedNodes = network.getSelectedNodes();
      //     const selectedEdges = network.getSelectedEdges();
      //     nodesDataset.remove(selectedNodes)
      //     edgesDataset.remove(selectedEdges)
      //   }
      // })
    })
  }, []);

  useEffect(() => {
    if (searchNode) {
      const scale = 0.8;
      network.focus(searchNode.id, {scale})
      network.selectNodes([searchNode.id]);
    }
  }, [searchNode]);

  const displayNeighbours = ({nodes: selectedNodes, edges: selectedEdges}) => {
    setGraph(prevState => {
      if (!selectedNodes.length) return prevState
      const nodesToShow = new Set(selectedNodes);
      selectedEdges
        .map(edge => prevState.edges.find(({id}) => id === edge))
        .forEach(edge => {
          if (edge.from) nodesToShow.add(edge.from)
          if (edge.to) nodesToShow.add(edge.to)
        })

      const modifiedNodes = prevState.nodes.map((node) => {
        if (!nodesToShow.has(node.id)) return {...node, hidden: true}
        return {...node, hidden: false};
      })
      setNeighbourMode(true)
      return {
        ...prevState,
        nodes: modifiedNodes,
      }
    })
  }

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
    doubleClick: displayNeighbours,
    stabilized: e => {
      !stabilized && network?.fit({animation: true});
      if (e.iterations > 1) {
        setStabilized(true);
      }
    },
    startStabilizing: e => {
      !stabilized && network?.moveTo({scale: 0.4})
    }
  }

  useEffect(() => {
    document.addEventListener('keyup', (event) => {
      if (!network) return
      if (event.code === 'Backspace') {
        setGraph(prevState => ({
          ...prevState,
          nodes: deleteEntities(prevState.nodes, network.getSelectedNodes()),
          edges: deleteEntities(prevState.edges, network.getSelectedEdges()),
        }))
      }
    });
  }, [network])

  const handleSaveNode = () => {
    const node = {...temporaryNode}
    const currentNodeIndex = getNodeIndex(node.id)
    if (currentNodeIndex === -1) {
      setGraph(prevState => ({
        ...prevState,
        nodes: [
          ...prevState.nodes,
          generateNode({id: node.id, name: node.label, seniority: node.seniority, x: node.x, y: node.y})
        ]
      }))
    } else {
      setGraph(prevState => {
        prevState.nodes[currentNodeIndex] = generateNode(node)
        return {
          ...prevState,
          nodes: [...prevState.nodes]
        }
      })
    }
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
        open={!!temporaryNode && (editModeControl === "add-node" || editModeControl === "edit")}
        onClose={handleCloseAddNode}
        onSave={handleSaveNode}
        name={temporaryNode?.label || ""}
        setName={(value) => setTemporaryNode(prevState => ({...prevState, label: value}))}
        seniority={temporaryNode?.seniority || ""}
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
