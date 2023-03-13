const generateLink = ({from, to, relationType}) => {
  const linkColors = {
    operationalby: '#93ffdf',
    mentorizedby: '#f893ff',
    unknown: '#000'
  }
  return {
    from,
    to,
    label: relationType?.toUpperCase() || 'UNKNOWN',
    color: linkColors[relationType?.toLowerCase().replace(' ','') || 'unknown'],
    shadow: true,
    width: 2,
    // font: {face: 'Ubuntu'},
  }
}

export default generateLink
