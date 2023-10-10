import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover'
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';



export default function SimpleTable() {
  const [policy, setUsers] = useState([])
  const headers = ["id", "Name", "From", "To", "Source", "Destination", "Service", "Action"]
  const listItems = headers.map((tcell, index) =>
    <TableCell key={index} align="center">{tcell}</TableCell>
  );
  const host = process.env.HOST_IP
  const port = process.env.PORT
  const location = useLocation();
  const path = location.state;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const options = ['root', 'LoadBalance'];
  const [value, setValue] = React.useState(path && path.path ? path.path : 'root');
  const [Addr, setAddr] = React.useState('');
  const [nameAddr, setnameAddr] = React.useState('');
  const [contextMenu, setContextMenu] = React.useState(null);
  const [erow, setErow] = React.useState(null);
  const [open, setOpen] = React.useState(path ? path.open : false);
  const [state, setState] = React.useState({
    vertical: 'top',
    horizontal: 'center'
  });
  const { vertical, horizontal } = state;
  const navigate = useNavigate();

  const popoverHoverFocus = (
    <Popover id="popover-basic">
    <Popover.Header as="h5">{nameAddr}</Popover.Header>
    <Popover.Body>
      {Addr.length > 0 && Addr.map((lda, index) => (
          <div key={index}>
            <span>{lda}</span>
          </div>
        ))}
    </Popover.Body>
  </Popover>
  );

  const handlePopoverOpen = (event) => {
    setnameAddr(event.target.innerText)
    fetchAddr(event.target.innerText)
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleContextMenu = (event, row) => {
    event.preventDefault();
    console.log(row.id)
    console.log(event.clientX, event.clientY)
    setErow(row)
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null,
    );
  };

  const handleClose = () => {
    setContextMenu(null);
    
  };

  const handleAlert = (newState) => () => {
    setOpen(true)
    setState({ ...newState});
  };

  const handleCloseAlert = (event, reason) => {
    console.log("Reason:", reason)
    console.log("close alert")
    setOpen(false)
    setState({ ...state});
  }
  const handleMenu = (neighbor) => {
    console.log(neighbor)
    navigate('/create', {
      state: {
        neighbor: neighbor,
        clone: true,
        id: erow.id,
        name: erow.name,
        srcinf: erow.srcintf,
        dstinf: erow.dstintf,
        srcaddr:erow.srcaddr,
        dstaddr:erow.dstaddr,
        service:erow.service,
        action:erow.action,
        path:value}})
  };

  const fetchData = () => {
    // fetch(`http://127.0.0.1:8000/policy/${value}`)
    fetch(`http://${host}:${port}/policy/${value}`)
      .then(response => {
        return response.json()
      })
      .then(data => {
        // console.log("fetch data")
        setUsers(data)
      })
  }

  const fetchAddr = (addr) => {
    // console.log(encodeURI(addr))
    if (addr.indexOf('/') > 0) {
      addr = addr.replace('/', '--')
      // console.log(addr)
    }
    fetch(`http://${host}:${port}/address/${encodeURI(addr)}`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      setAddr(data)
    })
  }


  useEffect(() => {
    fetchData()
  }, [value])

  // console.log("Value:", value)
  console.log(host)
  console.log(port)

  return (
    <>
    <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={2000}
        onClose={handleCloseAlert}
        key={vertical + horizontal}
    >
      <Alert
        sx={{width: 550, mx: "auto", mt: 2}}
      >
        This is a success alert — check it out!
      </Alert>
    </Snackbar>

    <Box
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      sx={{width:"80%", mx: "auto", mt:2}}
    >
    <Grid container spacing={2}>
      <Grid item>
        <FormControl sx={{ minWidth: 90 }} size="small">
        <InputLabel id="demo-simple-select-helper-label">Zone</InputLabel>
        <Select
          labelId="demo-select-small-label"
          id="demo-select-small"
          value={value}
          label="Zone"
          onChange={(event, newValue) => {
            // setInputValue(event.target.value)
            setValue(event.target.value);
            console.log(event.target.value)
            // setTestval(event.target.value)
          }}
        >
          <MenuItem value={'root'}>Root</MenuItem>
          <MenuItem value={'LoadBalance'}>LoadBalance</MenuItem>
        </Select>
        </FormControl>
      </Grid>

      {/* <Grid item>
        <Autocomplete
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue)
          }}
          id="controllable-states-demo"
          options={options}
          sx={{ width: 150 }}
          renderInput={(params) => <TextField {...params} size="small" label="Zone" />}
        /> 
      </Grid> */}
      
      <Grid item>
        <Button 
          variant="contained" 
          sx={{mb:1}} 
          onClick={() => {
              navigate('/create', {state:{clone:true}})
          }}
        >
          Create New
        </Button>
      </Grid>
    </Grid>

    <TableContainer component={Paper} >
      <Table sx={{ minWidth: 650}} aria-label="simple table">
        <TableHead>
          <TableRow>
            {listItems}           
          </TableRow>
        </TableHead>
        <TableBody>
          {policy.map((row, idx) => (
            <>
            <TableRow
              // onContextMenu={handleContextMenu}
              onContextMenu={(event) => handleContextMenu(event, row)}
              key={row.id}
              // sx={{ 'td, th': { border: 0 } }}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              // onClick={tableRowClickHandler(row.id)}
              onDoubleClick={() => {
                console.log(row.id);
                navigate('/create', {
                  state: {
                    neighbor: '',
                    clone: false,
                    id: row.id,
                    name: row.name,
                    srcinf: row.srcintf,
                    dstinf: row.dstintf,
                    srcaddr:row.srcaddr,
                    dstaddr:row.dstaddr,
                    service:row.service,
                    action:row.action,
                    path:value}})
              }}
            >
              <TableCell align="center">{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.srcintf}</TableCell>
              <TableCell>{row.dstintf}</TableCell>
              <TableCell>{
                row.srcaddr.map((sa, index) =>
          
                <div 
                  key={index} 
                  onMouseEnter={handlePopoverOpen}
                  // onMouseLeave={handlePopoverClose}
                >
                  <OverlayTrigger
                    key={index}
                    trigger={['hover', 'focus']}
                    placement="right"
                    overlay={popoverHoverFocus}
                  >
                  <span>{sa}</span>
                  </OverlayTrigger>
                </div>

              )}</TableCell>
              <TableCell>{
                row.dstaddr.map((da, index) => {
                return (<div 
                  key={index} 
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                >
                  <OverlayTrigger
                    key={index}
                    trigger={['hover', 'focus']}
                    placement="right"
                    overlay={popoverHoverFocus}
                  >
                  <span>{da}</span>
                  </OverlayTrigger>
                </div>
                )})
              }</TableCell>
              <TableCell>{
                row.service.map((service, index) => 
                  <div key={index}>
                    {service}
                  </div>
                )
              }</TableCell>
              <TableCell>{row.action}</TableCell>
            </TableRow>
            <Menu
              open={contextMenu !== null}
              onClose={handleClose}
              anchorReference="anchorPosition"
              anchorPosition={
                contextMenu !== null
                  ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                  : undefined
              }
            >
              <MenuItem onClick={() => handleMenu("Before")}>Clone Above</MenuItem>
              <MenuItem onClick={() => handleMenu("After")}>Clone Below</MenuItem>
            </Menu>
            </>
          ))} 
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
    </>
  );
}

