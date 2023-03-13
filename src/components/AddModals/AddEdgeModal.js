import React, {useState} from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';

const AddEdgeModal = ({open, onClose, onAdd}) => {
  const [relation, setRelation] = useState('')

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
              defaultValue={""}
            >
              <MenuItem value={"soft"}>Soft Skills</MenuItem>
              <MenuItem value={"hard"}>Hard Skills</MenuItem>
              <MenuItem value={"operational"}>Operational</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{marginTop: '20px'}}>
            <Button
              sx={{width: '30%', margin: 'auto'}}
              onClick={() => onAdd(relation)}
              variant="outlined"
              disabled={!relation}
            >
              Add
            </Button>
          </FormControl>
        </FormGroup>
      </Box>
    </Modal>
  )
}

export default AddEdgeModal
