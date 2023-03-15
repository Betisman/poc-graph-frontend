import React from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';

const AddEdgeModal = ({open, relation, setRelation, onClose, onSave}) => {

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
          Add Edge
        </Typography>
        <FormGroup>
          <FormControl variant={"standard"} sx={{margin: '10px 0px'}}>
            <InputLabel id="relation-select">Relation</InputLabel>
            <Select
              labelId="relation-select"
              onChange={(event) => setRelation(event.target.value)}
              value={relation}
            >
              <MenuItem value={"OPERATIONAL BY"}>Operational By</MenuItem>
              <MenuItem value={"MENTORIZED BY"}>Mentorized By</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{marginTop: '20px'}}>
            <Button
              sx={{width: '30%', margin: 'auto'}}
              onClick={() => onSave()}
              variant="outlined"
              disabled={!relation}
            >
              Save
            </Button>
          </FormControl>
        </FormGroup>
      </Box>
    </Modal>
  )
}

export default AddEdgeModal
