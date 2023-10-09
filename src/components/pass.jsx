import React from "react";
import { TableCell, TableRow, TextField } from "@mui/material";
import { useEffect, useState } from 'react'
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import MultiSelected from './Auto_complete'
import Table from '@mui/material/Table';



export default function MultiSelect() {
  // const [users, setUsers] = useState(["Humaira Sims", "Dawid Floyd"])
  const [users, setUsers] = useState([])
  const [open, toggleOpen] = useState(false);
  const [diag, setDiag] = useState('');
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('')
  const [button, setButton] = useState('button');
  const [seconds, setSeconds] = useState(0);
  const [src, setSrc] = useState([]);
  const [dst, setDst] = useState([]);
  

  const handleChange = (e, newValue) => {
    console.log(newValue)
    setUsers(users => [...users, newValue])
  }

  const handleClose = () => {
    toggleOpen(false);
    setDiag('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleClose();
    // console.log([...users, {'title':diag, 'year':1234}])
    setUsers([...users, {'title':diag, 'year':1234}]);
  };

  const handleSubmitform = (e) => {

    e.preventDefault();
    // console.log(e.currentTarget)
    const data = new FormData(e.currentTarget);
    // console.log(data)
    setUsername(data.get('username'))
    // console.log({
    //     username: data.get('username'),
    //     password: data.get('password'),
    //     auto: e.target.multipl.Autocomplete
    // });
    // var formBody = [];
    // var body = {
    //   username: 'johndoe',
    //   password: 'secret',
    //   scope:'me'
    // }
    // for (var key in body) {
    //   var encodedKey = encodeURIComponent(key);
    //   var encodedValue = encodeURIComponent(body[key]);
    //   formBody.push(encodedKey + '=' + encodedValue);
    // }
    // formBody = formBody.join('&');

    // fetch(`http://127.0.0.1:8000/token`, {
    //   method: 'POST',
    //   body: formBody,
    //   headers: {
    //     'accept': 'application/json',
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   }
    // })
    // .then(response => {
    //   return response.json()
    // })
    // .then(data => {
    //   console.log(data.access_token)
    //   setToken(data.access_token)
    //   localStorage.setItem('token', data.access_token)
    // })
  }
  
  const onclickButton = (e) => {
    localStorage.removeItem('token');
    // localStorage.clear();
    // console.log("Bearer " + token)
    fetch(`http://127.0.0.1:8000/users/me`, {
      method: 'GET',
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    .then(response => {
      console.log(response.status)
      return response.text()
    })
    .then(data => {
      console.log(data)
    })
  }

  const updateState = (event, val, name) => {
    console.log(name)
    if (name == 'src') {
      setSrc(val)
    } else if (name == 'dst') {
      setDst(val)
    }
    
  }


  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setSeconds(seconds => seconds + 1)
  //     // console.log(seconds);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);
  
  return (
    <>
    {/* {Date.now()} */}
    {seconds}
    <h4>Src</h4>
    {src.map((val, index) => (
      <div key={index}>
        <span>{val.title}</span>
      </div>
    ))}
    <h4>Dst</h4>
    {dst.map((val, index) => (
      <div key={index}>
        <span>{val.title}</span>
      </div>
    ))}
    <form onSubmit={handleSubmitform}>
      <DialogTitle>Add a new film</DialogTitle>
      <MultiSelected setVal={updateState} name='src' />
      <MultiSelected setVal={updateState} name='dst' />
      <Button variant="contained" type="submit">Add</Button>
    </form>
    </>
  );
}