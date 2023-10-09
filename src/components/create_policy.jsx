// import * as React from 'react';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';

// function FormPropsTextFields() {
//   return (
//     <Box
//       component="form"
//       sx={{
//         '& .MuiTextField-root': { m: 1, width: '25ch' },
//       }}
//       noValidate
//       autoComplete="off"
//     >
//       <div>
//         <TextField
//           required
//           id="outlined-required"
//           label="Required"
//           defaultValue="Hello World"
//         />
//         <TextField
//           disabled
//           id="outlined-disabled"
//           label="Disabled"
//           defaultValue="Hello World"
//         />
//         <TextField
//           id="outlined-password-input"
//           label="Password"
//           type="password"
//           autoComplete="current-password"
//         />
//         <TextField
//           id="outlined-read-only-input"
//           label="Read Only"
//           defaultValue="Hello World"
//           InputProps={{
//             readOnly: true,
//           }}
//         />
//         <TextField
//           id="outlined-number"
//           label="Number"
//           type="number"
//           InputLabelProps={{
//             shrink: true,
//           }}
//         />
//         <TextField id="outlined-search" label="Search field" type="search" />
//         <TextField
//           id="outlined-helperText"
//           label="Helper text"
//           defaultValue="Default Value"
//           helperText="Some important text"
//         />
//       </div>

//       <div>
//         <TextField
//           required
//           id="filled-required"
//           label="Required"
//           defaultValue="Hello World"
//           variant="filled"
//         />
//         <TextField
//           disabled
//           id="filled-disabled"
//           label="Disabled"
//           defaultValue="Hello World"
//           variant="filled"
//         />
//         <TextField
//           id="filled-password-input"
//           label="Password"
//           type="password"
//           autoComplete="current-password"
//           variant="filled"
//         />
//         <TextField
//           id="filled-read-only-input"
//           label="Read Only"
//           defaultValue="Hello World"
//           InputProps={{
//             readOnly: true,
//           }}
//           variant="filled"
//         />
//         <TextField
//           id="filled-number"
//           label="Number"
//           type="number"
//           InputLabelProps={{
//             shrink: true,
//           }}
//           variant="filled"
//         />
//         <TextField
//           id="filled-search"
//           label="Search field"
//           type="search"
//           variant="filled"
//         />
//         <TextField
//           id="filled-helperText"
//           label="Helper text"
//           defaultValue="Default Value"
//           helperText="Some important text"
//           variant="filled"
//         />
//       </div>
//       <div>
//         <TextField
//           required
//           id="standard-required"
//           label="Required"
//           defaultValue="Hello World"
//           variant="standard"
//         />
//         <TextField
//           disabled
//           id="standard-disabled"
//           label="Disabled"
//           defaultValue="Hello World"
//           variant="standard"
//         />
//         <TextField
//           id="standard-password-input"
//           label="Password"
//           type="password"
//           autoComplete="current-password"
//           variant="standard"
//         />
//         <TextField
//           id="standard-read-only-input"
//           label="Read Only"
//           defaultValue="Hello World"
//           InputProps={{
//             readOnly: true,
//           }}
//           variant="standard"
//         />
//         <TextField
//           id="standard-number"
//           label="Number"
//           type="number"
//           InputLabelProps={{
//             shrink: true,
//           }}
//           variant="standard"
//         />
//         <TextField
//           id="standard-search"
//           label="Search field"
//           type="search"
//           variant="standard"
//         />
//         <TextField
//           id="standard-helperText"
//           label="Helper text"
//           defaultValue="Default Value"
//           helperText="Some important text"
//           variant="standard"
//         />
//       </div>
//     </Box>
//   );
// }

// export default FormPropsTextFields

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



function AddressForm() {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;


  const [agreement, setAgreement] = useState(false)
  // const [users, setUsers] = useState([])
  const [inf, setInf] = useState([])
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const pid = location.state.id;
  const srcinf = location.state.srcinf;
  const dstinf = location.state.dstinf;
  const srcaddr = location.state.srcaddr;
  const name = location.state.name;
  const path = location.state.path

  const intf = [
    {id: 0, label: 'LAG_Group'},
    {id: 1, label: 'dhcp_vpn'},
    {id: 2, label: 'dmz1'},
    {id: 3, label: 'dmz2'},
    {id: 4, label: 'lan'},
    {id: 5, label: 'mgmt'},
  ]

  let list = srcaddr
  list = list.map(x => {
    return({label: x, isChecked: true});
  });


  const handleMeaasge = (event) => {
    setMessage(event.target.value)
  }

  const handleChange = (event) => {
    setAgreement(event.target.checked)
  }

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


  useEffect(() => {
    fetchData()
  }, [])


  // console.log(path)
  // console.log(inf)
  // console.log(typeof(srcinf))
  // console.log(typeof(list))

  return (
    <Box component="div" sx={{width: "70%", mx: "auto", mt: "20px"}}>
      <h2>{message}</h2>
      <h2>{pid} {name} </h2>
      <Button variant="contained" onClick={() => {
        navigate('/policy', {state: {path:path} })
      }}>Contained</Button>
      <Typography variant="h6" gutterBottom>
        Source
      </Typography>
      {/* <div>
        {users.length > 0 && (
          <ul>
            {users.map(user => (
              <li key={user.id}>{user.label}</li>
            ))}
          </ul>
        )}
      </div> */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            multiple
            limitTags={2}
            // value={}
            // defaultValue={[{label:'dmz1'}, {label:'dmz2'}]}
            id="checkboxes-tags-demo"
            options={inf}
            disableCloseOnSelect
            getOptionLabel={(option) => option.label}
            // renderOption={(props, option, { selected }) => (
            //   <li {...props}>
            //     <Checkbox
            //       icon={icon}
            //       checkedIcon={checkedIcon}
            //       style={{ marginRight: 8 }}
            //       checked={selected}
            //     />
            //     {option.label}
            //   </li>
            // )}
            renderOption={(props, option, { selected }) => {
              // console.log(option); 
              // console.log(srcinf.includes(option.label))
              return (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.label}
                </li>
              );
            }}
            // style={{ width: 100% }}
            renderInput={(params) => (
              <TextField {...params} label="Interfaces" placeholder="Favorites" />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            multiple
            limitTags={2}
            id="checkboxes-tags-demo"
            options={intf}
            // defaultValue={list}
            disableCloseOnSelect
            getOptionLabel={(option) => option.label}
            
            renderOption={(props, option, { selected }) => {
              // console.log("Selected:", selected); // Log the selected status
              // console.log(option)
              return (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.label}
                </li>
              );
            }}
            // style={{ width: 100% }}
            renderInput={(params) => (
              <TextField {...params} label="Address" placeholder="Favorites" />
            )}
          />
        </Grid>

        {/* <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveAddress" onChange={handleChange}/>}
            label="Use this address for payment details"
          />
        </Grid>
        {agreement && <h1>Hello World</h1>} */}
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Destnation
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            multiple
            limitTags={2}
            // defaultValue={[{label:'dmz1'}, {label:'wan1'}]}
            id="checkboxes-tags-demo"
            options={intf}
            isOptionEqualToValue={(option, value) => {
              console.log("isOptionEqualToValue")
              console.log(option)
              console.log(value)
              console.log(option.title === value.title)
              option.title === value.title
            }}
            disableCloseOnSelect
            getOptionLabel={(option) => option.label}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.label}
              </li>
            )}
            // style={{ width: 100% }}
            renderInput={(params) => (
              <TextField {...params} label="Interfaces" placeholder="Favorites" />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            multiple
            limitTags={2}
            id="checkboxes-tags-demo"
            options={intf}
            // defaultValue={list}
            disableCloseOnSelect
            getOptionLabel={(option) => option.label}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.label}
              </li>
            )}
            // style={{ width: 100% }}
            renderInput={(params) => (
              <TextField {...params} label="Address" placeholder="Favorites" />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default AddressForm;