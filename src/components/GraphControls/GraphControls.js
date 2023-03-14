import React from "react";
import {Autocomplete, Popover, TextField, styled} from "@mui/material";
import Paper from '@mui/material/Paper';
import Tooltip from "@mui/material/Tooltip";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Divider from '@mui/material/Divider';
import { lighten, darken } from '@mui/system';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faDownLeftAndUpRightToCenter,
  faShareNodes,
  faUserPen,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
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

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
  padding: 0,
});

const GraphControls = ({ editMode, onChangeEditMode, filterMode, onChangeFilterMode, className, nodes, onChangeSearch }) => {
  const [openSearch, setOpenSearch] = React.useState(false);
  const [anchorSearchEl, setAnchorSearchEl] = React.useState('search');
  const handleSearchToggle = event => {
    setOpenSearch(!openSearch);
    setAnchorSearchEl(event.currentTarget);
  }
  const handleCloseSearch = () => { setOpenSearch(false); };
  const searchOptions = nodes.map(node => {
    const normalized = node.label.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const normalizedFirstLetter = node.label[0].toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return {
      id: node.id,
      label: node.label,
      firstLetter: node.label[0].toUpperCase(),
      normalized,
      normalizedFirstLetter,
    }
  });
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
      <Divider flexItem orientation="horizontal" sx={{ mx: 0.5, my: 1 }} />
      <StyledToggleButtonGroup
        orientation="vertical"
      >
        <ToggleButton value="search" aria-label="search" selected={openSearch} onClick={handleSearchToggle}>
          <Tooltip title={"Search"} placement="right-start">
            <FontAwesomeIcon icon={faSearch} />
          </Tooltip>
        </ToggleButton>
      </StyledToggleButtonGroup>
      <Popover
        id={'search-popover'}
        open={openSearch}
        anchorEl={anchorSearchEl}
        onClose={handleCloseSearch}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Autocomplete
          id="search"
          onChange={(_, selectedValue) => onChangeSearch(selectedValue)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          options={searchOptions.sort((a, b) => a.label.replace().localeCompare(b.label))}
          groupBy={option => option.normalizedFirstLetter}
          getOptionLabel={option => option.label}
          sx={{ width: 300 }}
          renderInput={params => <TextField {...params} label='Search user' />}
          renderGroup={params => (
            <li key={params.key}>
              <GroupHeader>{params.group}</GroupHeader>
              <GroupItems>{params.children}</GroupItems>
            </li>
          )}
        />
      </Popover>
    </Paper>
  )
}

export default GraphControls
