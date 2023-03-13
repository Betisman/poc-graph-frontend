const generateLink = ({from, to, relationType}) => {
  const linkColors = {
    operational: '#93ffdf',
    soft: '#f893ff',
    hard: '#ffa964'
  }
  return {
    from,
    to,
    label: relationType.toUpperCase(),
    color: linkColors[relationType.toLowerCase()],
    shadow: true,
    width: 2,
    // font: {face: 'Ubuntu'},
  }
}

export default generateLink
