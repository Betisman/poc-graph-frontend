import generateGraph from "./mocks";

const GraphService = () => {
  const getGraph = () => {
    const graph = generateGraph()
    return graph
  }

  return {
    getGraph
  }
}

export default GraphService
