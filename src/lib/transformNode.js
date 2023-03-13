const generateNode = ({id, label, seniority, x, y}) => {
  const nodeColors = {
    'senior': '#fd6868',
    'medior': '#8dfa8d',
    'junior': '#8484ff',
    'intern': '#ffff93',
    'dir': '#fff',
    'archdm': '#fd8a00'
  };
  return {
    id,
    label,
    seniority: seniority.toLowerCase(),
    shape: 'circle',
    color: nodeColors[seniority.toLowerCase()],
    shadow: true,
    // physics: false,
    size: 40,
    font: {
      // face: 'Ubuntu',
      bold: {
        size: 16
      }
    },
    widthConstraint: {minimum: 70, maximum: 70},
    x,
    y
  }
}

export default generateNode
