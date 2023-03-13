import React from "react";
import {styled} from "@mui/material";
import Paper from '@mui/material/Paper';
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Divider from '@mui/material/Divider';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faDownLeftAndUpRightToCenter,
  faShareNodes,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({theme}) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

const GraphControls = ({editMode, onChangeEditMode, filterMode, onChangeFilterMode, className}) => {
  return (
    <Paper
      elevation={4}
      sx={{
        display: 'flex',
        flexDirection: 'column'
      }}
      className={className}
    >
      <StyledToggleButtonGroup
        orientation="vertical"
        value={editMode}
        exclusive
        onChange={(_, selectedValue) => onChangeEditMode(selectedValue)}
      >
        <ToggleButton value="add-node" aria-label="add-node">
          <Tooltip title={"Add Node"} placement="right-start">
            <FontAwesomeIcon icon={faShareNodes}/>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="add-edge" aria-label="add-edge">
          <Tooltip title={"Add Edge"} placement="right-start">
            <FontAwesomeIcon icon={faDownLeftAndUpRightToCenter}/>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="edit" aria-label="edit">
          <Tooltip title={"Edit selected"} placement="right-start">
            <FontAwesomeIcon icon={faUserPen}/>
          </Tooltip>
        </ToggleButton>
      </StyledToggleButtonGroup>
      <Divider flexItem orientation="horizontal" sx={{mx: 0.5, my: 1}}/>
      <StyledToggleButtonGroup
        orientation="vertical"
        value={filterMode}
        exclusive
        onChange={(_, selectedValue) => onChangeFilterMode(selectedValue)}
      >
        <ToggleButton value="filter" aria-label="filter">
          <Tooltip title={"Filter"} placement="right-start">
            <FontAwesomeIcon icon={faFilter}/>
          </Tooltip>
        </ToggleButton>
      </StyledToggleButtonGroup>
    </Paper>
  )
}

export default GraphControls
