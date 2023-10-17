import React from "react";
import { TextField } from "@mui/material";
import { useState } from 'react'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import LoadingButton from '@mui/lab/LoadingButton';


const filter = createFilterOptions();


export default function MultiSelected({setval, name, inf, val, error }) {
  const [open, toggleOpen] = useState(false)
  const [ip, setIp] = useState('')
  const [subnet, setSubnet] = useState('32')
  const [regex, setRegex] = useState(true)
  const [all, setAll] = useState(false)
  const [load, setLoad] = useState(false)
  const host = process.env.HOST_IP
  const port = process.env.PORT
  


  const validIP = new RegExp('^(?!0\.0\.0\.0$)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$')

  const handleClose = () => {
    setIp('')
    toggleOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setRegex(validIP.test(ip))
    if (validIP.test(ip)) {
      console.log(ip, subnet)
      console.log([...val, ip+'/'+subnet])
      createAddr()
    }
  };

  const fetchAddr = (newValue) => {
    let addr = newValue[newValue.length - 1]
    if (addr.indexOf('/') > 0) {
      addr = addr.replace('/', '--')
      // console.log(addr)
    }
    fetch(`http://${host}:${port}/address/${encodeURI(addr)}`)
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data[0] === "0.0.0.0/0") {
        setAll(true)
        console.log(data)
      } else {
        console.log("else 0.0.0.0/0")
        setAll(false)
        setval(newValue, name)
      }
    })
  }

  const createAddr = () => {
    setLoad(true)
    fetch(`http://${host}:${port}/address`, {
      method: 'POST',
      body: JSON.stringify({
        "name":`${ip}/${subnet}`,
        "typ": "ipmask",
        "subnet": `${ip}/${subnet}`
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => {   
        console.log(response)
        if (!response.ok) {
            alert("Error")
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setLoad(false)
        setval([...val, ip+'/'+subnet], name, ip+'/'+subnet)
        setIp('')
        setSubnet('32')
        toggleOpen(false);
    })
  } 

   
  return (
    <>
    <Autocomplete
      // sx={{ m: 1, width: 500 }}
      multiple
      limitTags={2}
      value={val}
      onChange={(event, newValue) => {  
        if (typeof newValue === 'string') {           
            console.log("newValue from if: " + newValue)
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                title: newValue,
                year: '',
              });
            });
          } else if (newValue.length >= 1 && !inf.includes(newValue[newValue.length-1])) {
            console.log(newValue[newValue.length >= 1 && newValue.length-1])
            toggleOpen(true);
          } else {
            if (newValue.length > 0 & ['srcaddr', 'dstaddr'].includes(name)) {
              console.log("name else")
              fetchAddr(newValue)
            } else {     
              setval(newValue, name)
            }

          }
      }}

      {...['srcaddr', 'dstaddr'].includes(name) && {
        filterOptions : (options, params) => {    
          const filtered = filter(options, params);
          if (params.inputValue !== '') { 
            filtered.push("Add \"" + params.inputValue + "\"")
          }
          return filtered;
        }
      }}
      
      
      options={inf}
      disablePortal
      getOptionLabel={(option) => option}
      // getOptionLabel={(option) => {
      //   if (typeof option === 'string') {
      //     console.log("option if")
      //     return option;
      //   }
      //   if (option.inputValue) {
      //     return option.inputValue;
      //   }
      //   return option.title;
      // }}
      disableCloseOnSelect

      {...['srcaddr', 'dstaddr'].includes(name) && { freeSolo: true }}
      renderInput={(params) => (
        <TextField
          {...params}
          {...(error || all) && { error: true }}
          variant="outlined"
          label={name === "srcinf"
                ? "Source Interface"
                : name === "srcaddr"
                ? "Source Address"
                : name === "dstinf"
                ? "Outgoing Interface"
                : name === "dstaddr"
                ? "Destination" 
                : "Service"}
          placeholder="Multiple Autocomplete"
        />
      )}
    />
    {all && <FormHelperText error>Don't use all IP address</FormHelperText>}
    
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit} variant="standard">
        <DialogTitle>Add a new IP address</DialogTitle>
        <DialogContent>
          <FormControl sx={{ minWidth: 100}}>
          <TextField
            {...!regex && {error:true}}
            autoFocus
            margin="dense"
            id="name"
            value={ip}
            onChange={(event) => {
                setIp(event.target.value)
              }
            }
            label="Address"
            type="text"
            variant="standard" 
          />
          {!regex && <FormHelperText error>Please enter a valid IP address</FormHelperText>}
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 100}}>
            <InputLabel id="demo-simple-select-helper-label">Subnet</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={subnet}
              variant="standard"
              onChange={(e) => (
                setSubnet(e.target.value)
              )}
            >
              {Array.from({ length: 32 }, (_, index) => (
                <MenuItem key={index} value={index + 1}>
                  {index + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl> 
          
        </DialogContent>
        <DialogActions>
          <LoadingButton
          size="small"
          type="submit"
          loading={load}
        >
          <span>Add</span>
        </LoadingButton>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </form>
    </Dialog>
    </>
  );
}