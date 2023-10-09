import { useState } from 'react'
import './App.css'
import MyButton from './components/button'
// import AddressForm from './components/create_policy'
import AddressForm from './components/edit_policy'
import SimpleTable from './components/table'
import MultiSelect from './components/pass'
import SignIn from './components/signIn'
import Parent from './components/test'
import { Link, Routes, Route, useNavigate, Navigate } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState("Tetsing")
  const [iftrue, setTrue] = useState(true)
  const navigate = useNavigate();

  const user = {
    firstName: "Kit",
    lastName: "Kub",
    img: "https://images.unsplash.com/photo-1682686581551-867e0b208bd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
  }

  const products = [
    { title: 'Cabbage', id: 1 },
    { title: 'Garlic', id: 2 },
    { title: 'Apple', id: 3 },
  ];

  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 }
  ]

  const listItems = products.map(product =>
    <li key={product.id}>
      {product.id}. {product.title}
    </li>);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <>
      {/* <SimpleTable /> */}
      {/* <AddressForm /> */}
      {/* <SignIn /> */}
      {/* <MultiSelect /> */}
      {/* <Parent /> */}
      <Routes>
        {/* <Route path="/" element={<Navigate replace to="login" />} />
        <Route path="login" element={<SignIn />} /> */}
        <Route path="/" element={<SimpleTable />} />
        <Route path="policy" element={<SimpleTable />} />
        <Route path="create" element={<AddressForm />} />
      </Routes>
    </>
  )
}

function ClickButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}

export default App
