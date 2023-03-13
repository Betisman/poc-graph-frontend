import GraphService from "../services/graph.service";

const useGraphHook = () => {
  const instance = GraphService()
  return instance
}

export default useGraphHook
