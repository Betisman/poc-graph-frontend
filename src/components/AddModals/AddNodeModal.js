import React from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';

const AddNodeModal = ({open, onClose, onSave, name, setName, seniority, setSeniority}) => {
  return (
    <Modal sx={{zIndex: 2}} open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant={'h6'}>
          Add Node
        </Typography>
        <FormGroup>
          <FormControl variant={"standard"} sx={{margin: '10px 0px'}}>
            <TextField
              id="name"
              label="Name"
              variant="standard"
              value={name}
              onChange={(event) => setName(event.target.value)}/>
          </FormControl>
          <FormControl variant={"standard"} sx={{margin: '10px 0px'}}>
            <InputLabel id="seniority-select">Seniority</InputLabel>
            <Select
              labelId="seniority-select"
              onChange={(event) => setSeniority(event.target.value)}
              value={seniority}
            >
              <MenuItem value={"dir"}>Director</MenuItem>
              <MenuItem value={"archdm"}>Architect/Delivery Manager</MenuItem>
              <MenuItem value={"senior"}>Senior</MenuItem>
              <MenuItem value={"medior"}>Medior</MenuItem>
              <MenuItem value={"junior"}>Junior</MenuItem>
              <MenuItem value={"intern"}>Intern</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{marginTop: '20px'}}>
            <Button
              sx={{width: '30%', margin: 'auto'}}
              onClick={onSave}
              variant="outlined"
              disabled={!name || !seniority}
            >
              Save
            </Button>
          </FormControl>
        </FormGroup>
      </Box>
    </Modal>
  )
}

export default AddNodeModal
