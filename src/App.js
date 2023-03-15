import React, {useState, useEffect, useRef} from "react";
import {Network} from "vis-network"
import {DataSet} from "vis-data";
import './App.css';

import AddNodeModal from "./components/AddModals/AddNodeModal";
import GraphControls from "./components/GraphControls/GraphControls";
import AddEdgeModal from "./components/AddModals/AddEdgeModal";
import Backdrop from "./components/Backdrop/Backdrop";
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';

import useGraphHook from "./hooks/useGraph.hook";

import generateNode from "./lib/transformNode";
import generateEdge from "./lib/transformEdge";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";

const App = () => {
  const [loading, setLoading] = useState(false)
  const [network, setNetwork] = useState(null)
  const [graph, setGraph] = useState({nodes: [], edges: []})
  const [editModeControl, setEditModeControl] = useState(null)
  const [filterModeControl, setFilterModeControl] = useState(null)
  const [temporaryEdge, setTemporaryEdge] = useState(null)
  const [temporaryNode, setTemporaryNode] = useState(null)
  const [searchNode, setSearchNode] = useState(null)
  const [dataset, setDataset] = useState({})

  const [zlatanModalOpen, setZlatanModalOpen] = useState(false)
  const [zlatanMode, setZlatanMode] = useState({scorer: false, assistant: false})

  const {getGraph} = useGraphHook()

  const visJsRef = useRef(null);

  useEffect(() => {
    setLoading(true)
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
            },
            addEdge: (data, callback) => {
              setTemporaryEdge({...data, label: "", relation: ""})
            },
            editNode: (data, callback) => {
              setTemporaryNode({...data})
            },
            editEdge: (data, callback) => {
              setTemporaryEdge({...data})
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

      network.on("afterDrawing", () => setLoading(false))

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

  const handleSaveNode = () => {
    const currentNode = dataset.nodes.get([temporaryNode.id])?.[0] || {}
    dataset.nodes.update(generateNode({...currentNode, ...temporaryNode}))
    setTemporaryNode(null)
    setEditModeControl(null)
  }

  const handleSaveEdge = () => {
    const currentEdge = dataset.edges.get([temporaryEdge.id])?.[0] || {}
    const generatedEdge = generateEdge({...currentEdge, ...temporaryEdge})
    dataset.edges.update(generatedEdge)
    setTemporaryEdge(null)
    setEditModeControl(null)
  }

  const handleCloseAddNode = () => {
    setTemporaryNode(null)
    setEditModeControl(null)
  }

  const handleCloseEdgeModal = () => {
    setTemporaryEdge(null)
    setEditModeControl(null)
  }

  useEffect(() => {
    const editModeActions = {
      'add-node': () => network?.addNodeMode(),
      'add-edge': () => network?.addEdgeMode(),
      edit: () => {
        network?.editNode()
        network?.editEdgeMode()
      },
      null: () => network?.disableEditMode()
    }
    const selectedAction = editModeActions[editModeControl] || editModeActions.null
    selectedAction()
  }, [editModeControl])

  return (
    <>
      <Backdrop open={loading}/>
      {!loading &&
        <GraphControls
        className={"button-group"}
        editMode={editModeControl}
        onChangeEditMode={setEditModeControl}
        filterMode={filterModeControl}
        onChangeFilterMode={setFilterModeControl}
        nodes={graph.nodes}
        onChangeSearch={setSearchNode}
      />}
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
        onClose={handleCloseEdgeModal}
        onSave={handleSaveEdge}
        relation={temporaryEdge?.label}
        setRelation={(value) => setTemporaryEdge(prevState => ({...prevState, label: value}))}
      />
      <Snackbar
        open={editModeControl === 'add-node'}
        message={'Click to add a new Node'}
      />
      <Snackbar
        open={editModeControl === 'add-edge'}
        message={'Click on a Node and drag to other Node'}
      />
      <div className={"login-button"}>
        <Button variant="outlined" onClick={() => setZlatanModalOpen(true)}>Login</Button>
      </div>
      <Modal sx={{zIndex: 2}} open={zlatanModalOpen} onClose={() => setZlatanModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <FormGroup>
            <FormControl variant={"standard"} sx={{margin: '10px 0px'}}>
              <TextField
                id="scorer"
                label="Scorer"
                variant="standard"
                onChange={(event) => setZlatanMode(prevState => ({...prevState, scorer: event.target.value === process.env.REACT_APP_SCORER}))}/>
            </FormControl>
            <FormControl variant={"standard"} sx={{margin: '10px 0px'}}>
              <TextField
                id="assistant"
                label="Assistant"
                variant="standard"
                onChange={(event) => setZlatanMode(prevState => ({...prevState, assistant: event.target.value === process.env.REACT_APP_ASSISTANT}))}/>
            </FormControl>
            <FormControl sx={{marginTop: '20px'}}>
              <Button
                sx={{width: '30%', margin: 'auto'}}
                onClick={() => setZlatanModalOpen(false)}
                variant="outlined"
              >
                Try
              </Button>
            </FormControl>
          </FormGroup>
        </Box>
      </Modal>
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
