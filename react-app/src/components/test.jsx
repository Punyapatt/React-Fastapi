import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import MultiSelected from './Auto_complete'
import SegmentedControls from './radio__button'
import ButtonGroup from '@mui/material/ButtonGroup';
import RadioGroup from '@mui/material/RadioGroup';



function AddressForm() {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const navigate = useNavigate();
  const [agreement, setAgreement] = useState(false)
  // const [users, setUsers] = useState([])
  const location = useLocation();
  const path = location.state;
  const [inf, setInf] = useState([])
  const [action, setAction] = useState(path ? path?.action : 'accept')
  const [checkemp, setCheckemp] = useState(false)
  const [srcall, setSrcall] = useState(false)
  const [sdstall, setDstall] = useState(false)
  const [srcinf, setSrcinf] = useState(path ? path?.srcinf : [])
  const [srcaddr, setSrcaddr] = useState(path ? path?.srcaddr : [])
  const [dstinf, setDstinf] = useState(path ? path?.dstinf : [])
  const [dstaddr, setDstaddr] = useState(path ? path?.dstaddr : [])
  const [service, setService] = useState(path ? path?.service : [])
  const [name, setName] = useState(path ? path?.name : '')
  const [clone, setClone] = useState(path ? path?.clone : '')
  const [addrall, setAddrall] = React.useState([]);
  const [serviceall, setServiceall] = React.useState([]);
  
  // console.log(path?.state ? path.state.srcinf : [])
  // const navigate = useNavigate();
  // const pid = location.state.id;
  // const srcinf = location.state.srcinf;
  // const name = path ? path?.name : '';
  const pid = path ? path?.id : '';
  const neighbor = path ? path?.neighbor : false;
  // const name = location.state.name;
  // const path = location.state.path
  // console.log(location)
  // if (path) {
  //   if (path.state) {
  //     console.log(path.state)
  //   } else {
  //     console.log("path.state is null")
  //   }
  // } else {
  //   console.log("path is null")
  // }

  // console.log(path)
  // console.log(action)
  // console.log(srcinf)
  // console.log(dstinf)
  // console.log(srcaddr)
  // console.log(dstaddr)
  // console.log(service)

  const intf = [
    'LAG_Group',
    'dhcp_vpn',
    'dmz1',
    'dmz2',
    'lan',
    'mgmt',
    'ssl.root',
    'port1'
  ]

  const updateState = (val, name) => {
    // console.log(name)
    if (name == 'srcaddr') {
      setSrcaddr(val)
    } else if (name == 'dstaddr') {
      setDstaddr(val)
      // console.log(dstaddr)
    } else if (name == 'srcinf') {
      setSrcinf(val)
    } else if (name == 'dstinf') {
      setDstinf(val)
    } else if (name == 'service') {
      setService(val)
    }
    
  }

  const handleMeaasge = (event) => {
    setMessage(event.target.value)
  }

  const handleChange = (event) => {
    setAgreement(event.target.checked)
  }

  const handleAction = (e) => {
    console.log(e.target.name)
  }

  const handleIpall = (val, name) => {
    if (name == 'srcaddr') {
      setSrcall(val)
    } else if (name == 'dstaddr') {
      setDstall(val)
  }}

  const fetchData = () => {
    fetch("http://127.0.0.1:8000/interfaces")
      .then(response => {
        return response.json()
      })
      .then(data => {
        // setUsers(data)
        setInf(data)
      })
  }

  const fetchAddrAll = () => {
    fetch("http://127.0.0.1:8000/address")
    .then(response => {
      return response.json()
    })
    .then(data => {
      setAddrall(data)
    })
  }

  const fetchService = () => {
    fetch("http://127.0.0.1:8000/service")
    .then(response => {
      return response.json()
    })
    .then(data => {
      setServiceall(data)
    })
  }


  useEffect(() => {
    fetchData()
    fetchAddrAll()
    fetchService()
  }, [])
  
  console.log("edit")
  // console.log(checkemp)
  // console.log(dstaddr.length)

  return (
    <Box component="form" sx={{
      width: "70%",
      mx: "auto",
      mt: "20px",
      boxShadow: 1,
      borderRadius: 2,
      p: 2}}>

      <h2>[{!clone && pid}] {!clone && name}</h2>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            value={!clone ? name : ''}
            onChange={(event) => {
                setClone(false)
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
            error={checkemp && srcaddr.length === 0}
            setIpall={handleIpall} />
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
          error={checkemp && dstaddr.length === 0}
          setIpall={handleIpall} />
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
        
        {/* <Button {(...srcpall & ...dstall) && {disabled:true}} variant="contained" sx={{mx:1}} onClick={() => {
          navigate('/policy', {state: {path:path} })
        }}>OK</Button> */}
        <Button variant="outlined" sx={{mx:1}} color="error" onClick={() => {
          navigate('/policy', {state: {path:path} })
        }}>Cancle</Button>
        <Button variant="outlined" sx={{mx:1}} color="error" onClick={() => {
          setCheckemp(true)
        }}>Cancle</Button>
      </Grid>
    </Box>
    
  );
}

export default AddressForm;