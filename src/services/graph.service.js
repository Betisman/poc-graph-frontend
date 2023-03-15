const GraphService = () => {

  const mapEdge = ({elementId, properties: {type}, endNodeElementId, startNodeElementId}) => ({
    from: startNodeElementId,
    to: endNodeElementId,
    label: type,
    properties: {
      elementId,
    }
  })

  const mapNode = ({elementId, properties: {name, seniority, legacyId}}) => ({
    id: elementId,
    seniority,
    name,
    label: name,
    properties: {
      legacyId,
    }
  })

  const getGraph = async () => {
    const apiUrl = process.env.REACT_APP_HOST_URL
    const nodes = await fetch(`${apiUrl}/node/Person`).then(response => response.json())
    const edges = await fetch(`${apiUrl}/edge`).then(response => response.json())
    return {nodes: nodes.map(mapNode), edges: edges.map(mapEdge)}
  }

  return {
    getGraph
  }
}

export default GraphService
