import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Button from '@mui/material/Button';
import MultiSelected from './Auto_complete'
import SegmentedControls from './radio__button'
import LoadingButton from '@mui/lab/LoadingButton';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react'

function AddressForm() {

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.state;
  const [inf, setInf] = useState([])
  const [clone, setClone] = useState(path && path.clone ? path.clone : false)
  const [action, setAction] = useState(path && path.action ? path.action : 'accept')
  const [checkemp, setCheckemp] = useState(false)
  const [srcinf, setSrcinf] = useState(path && path.srcinf ? path.srcinf : [])
  const [srcaddr, setSrcaddr] = useState(path && path.srcaddr ? path.srcaddr : [])
  const [dstinf, setDstinf] = useState(path && path.dstinf ? path.dstinf : [])
  const [dstaddr, setDstaddr] = useState(path && path.dstaddr ? path.dstaddr : [])
  const [service, setService] = useState(path && path.service ? path.service : [])
  const [name, setName] = useState(!clone ? (path ? path.name : '') : '');
  const [addrall, setAddrall] = React.useState([]);
  const [serviceall, setServiceall] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const pid = path && path.id ? path.id : 0;
  const neighbor = path && path.neighbor ? path.neighbor : '';
  const host = process.env.HOST_IP
  const port = process.env.PORT

  
  const updateState = (val, name, new_ip=null) => {
    if (name == 'srcaddr') {
      setSrcaddr(val)
      if (new_ip) {
        setAddrall([...addrall, new_ip])
      } 
    } else if (name == 'dstaddr') {
      setDstaddr(val)
      if (new_ip) {
        setAddrall([...addrall, new_ip])
      }
    } else if (name == 'srcinf') {
      setSrcinf(val)
    } else if (name == 'dstinf') {
      setDstinf(val)
    } else if (name == 'service') {
      setService(val)
    }
    
  }



  const fetchData = () => {
    // fetch(`http://${host}:${port}/interfaces`)
    fetch(`api/interfaces`)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setInf(data)
      })
  }

  const fetchAddrAll = () => {
    // fetch(`http://${host}:${port}/address`)
    fetch(`api/address`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      setAddrall(data)
    })
  }

  const fetchService = () => {
    // fetch(`http://${host}:${port}/service`)
    fetch(`api/service`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      setServiceall(data)
    })
  }

  const pushservice = () => {
    console.log(clone ? "create" : "update")
    console.log(pid)
    setOpen(true)
    // fetch(`http://${host}:${port}/${clone ? "create" : "update"}/${parseInt(pid)}`, {
      fetch(`api/${clone ? "create" : "update"}/${parseInt(pid)}`, {
        method: 'POST',
        body: JSON.stringify({
          "name": name,
          "status": 'enable',
          "action": action,
          "srcintf": srcinf.map(val => {
            return {name:val}
          }),
          "dstintf": dstinf.map(val => {
            return {name:val}
          }),
          "srcaddr": srcaddr.map(val => {
            return {name:val}
          }),
          "dstaddr": dstaddr.map(val => {
            return {name:val}
          }),
          "service": service.map(val => {
            return {name:val}
          }),
          "schedule":"always",
          "logtraffic":"all",
          "neighbor": neighbor
        }),
        headers: {
            "Content-Type": "application/json"
        }
        })
        .then(response => {   
            console.log(response.ok)
            console.log(response)
            if (!response.ok) {
                alert("Error")
                setOpen(false)
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            setOpen(false)
            navigate('/policy', {state:{open:true, path: path && path.path}})
        })
        .catch(error => console.log('error', error));
  }

  useEffect(() => {
    fetchData()
    fetchAddrAll()
    fetchService()
  }, [])
  
  console.log(path)
  console.log("ID", pid)
  console.log("Name:", name)
  console.log("Action:", action)
  console.log("srcinf:", srcinf)
  console.log("srcaddr:", srcaddr)
  console.log("dstinf:", dstinf)
  console.log("dstaddr:", dstaddr)
  console.log("service:", service)
  console.log("Neighbor", neighbor)
  console.log("Clone:", clone)
  console.log(clone ? "create" : "update")
  
  

  return (
    <>
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
    </Backdrop>
    <Box component="form" sx={{
      width: "70%",
      mx: "auto",
      mt: "20px",
      boxShadow: 1,
      borderRadius: 2,
      p: 2}}>

      {(pid !== 0 && !clone) && <h2>[{!clone && pid}] {!clone && name}</h2>}
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            {...(name == "" & checkemp) && {error:true}}
            autoFocus
            margin="dense"
            id="name"
            value={name}
            onChange={(event) => {
                // setClone(false)
                setName(event.target.value)
              }
            }
            label="Name"
            type="text"
            variant="standard" 
          />
        </Grid>
      </Grid>

      <SegmentedControls setAct={setAction} acts={action}/>

      <Typography variant="h6" gutterBottom>
        Source
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <MultiSelected 
            name='srcinf' 
            inf={inf} 
            val={srcinf} 
            setval={updateState}
            error={checkemp && srcinf.length === 0} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <MultiSelected 
            name="srcaddr"
            inf={addrall}
            val={srcaddr}
            setval={updateState}
            error={checkemp && srcaddr.length === 0} />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Destnation
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <MultiSelected
          name='dstinf'
          inf={inf}
          val={dstinf}
          setval={updateState}
          error={checkemp && dstinf.length === 0} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <MultiSelected
          name='dstaddr'
          inf={addrall}
          val={dstaddr}
          setval={updateState}
          error={checkemp && dstaddr.length === 0} />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Service
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <MultiSelected
            name="service"
            inf={serviceall}
            val={service}
            setval={updateState}
            error={checkemp && service.length === 0} />
        </Grid>
      </Grid>

      <Grid container
            direction="row"
            justifyContent="center"
            alignItems="flex-end"
            sx={{mt: 4}} >
        
        <Button 
          {...((name === '' || srcaddr.length === 0 || dstaddr.length === 0 || srcinf.length === 0 || dstinf.length === 0 || service.length === 0) & checkemp) && {disabled:true}}

          variant="contained" 
          sx={{mx:1}} 
          onClick={() => {
            setCheckemp(true)
            if (!(name === '' || srcaddr.length === 0 || dstaddr.length === 0 || srcinf.length === 0 || dstinf.length === 0 || service.length === 0)) {
              console.log('PushService')
              pushservice()
            } else {
              console.log('else PushService')
            }
          }}
        >
          OK
        </Button>
        <Button variant="outlined" sx={{mx:1}} color="error" onClick={() => {
          navigate('/policy')
        }}>Cancle</Button>
      </Grid>
    </Box>
    </>
    
  );
}

export default AddressForm;