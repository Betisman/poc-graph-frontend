import MUIBackdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack"

const Backdrop = ({ open }) => {
  return (
    <MUIBackdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={() => {}}
    >
      <Stack justifyContent="center" alignItems="center" spacing={4}>
        <CircularProgress color="inherit" style={{ textAlign: "center" }}/>
        <Typography variant={"h6"}>Setting network</Typography>
      </Stack>
    </MUIBackdrop>
  )
}

export default Backdrop
