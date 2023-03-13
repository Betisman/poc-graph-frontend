const nodes = [
  {
    id: '1',
    seniority: 'Senior',
    name: 'Alice',
    legacyId: '235',
  },
  {
    id: '2',
    seniority: 'Medior',
    name: 'David',
    legacyId: '156',
  },
  {
    id: '3',
    seniority: 'Junior',
    name: 'Grace',
    legacyId: '972',
  },
  {
    id: '4',
    seniority: 'Senior',
    name: 'Isaac',
    legacyId: '876',
  },
  {
    id: '5',
    seniority: 'Medior',
    name: 'Emma',
    legacyId: '659',
  },
  {
    id: '6',
    seniority: 'Senior',
    name: 'Frank',
    legacyId: '187',
  },
  {
    id: '7',
    seniority: 'Junior',
    name: 'Jack',
    legacyId: '355',
  },
  {
    id: '8',
    seniority: 'Medior',
    name: 'Hannah',
    legacyId: '520',
  },
  {
    id: '9',
    seniority: 'Junior',
    name: 'Charlie',
    legacyId: '770',
  },
  {
    id: '10',
    seniority: 'Senior',
    name: 'Bob',
    legacyId: '447',
  }
];

const generateNodes = () => nodes.map(({name, ...rest}) => ({label: name, ...rest}))

const generateEdges = () => {
  const edges = []
  nodes.forEach((node, i) => {
    const targetIndex = Math.floor(Math.random() * nodes.length)
    const skills = ['operational', 'soft', 'hard']
    const randomIndex = Math.floor(Math.random() * skills.length)
    const relationType = skills[randomIndex]

    if (i !== targetIndex) {
      edges.push({
        from: node.id,
        to: nodes[targetIndex].id,
        relationType
      })
    }
  });
  return edges;
};


const generateGraph = () => ({
  nodes: generateNodes(),
  edges: generateEdges()
})

export default generateGraph
