const generateLink = ({from, to, label, ...rest}) => {
  const linkColors = {
    operationalby: '#93ffdf',
    mentorizedby: '#f893ff',
    unknown: '#000'
  }
  return {
    ...rest,
    from,
    to,
    label: label?.toUpperCase() || 'UNKNOWN',
    color: linkColors[label?.toLowerCase().replace(' ','') || 'unknown'],
    shadow: true,
    width: 2,
    // font: {face: 'Ubuntu'},
    arrows: {
      to: { enabled: true }
    }
  }
}

export default generateLink
