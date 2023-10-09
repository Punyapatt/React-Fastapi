import React from 'react'

function MyButton() {
    function handleClick() {
        alert('You click me!')
    }
    return (
      <button onClick={handleClick}>I'm a button</button>
    );
  }

export default MyButton