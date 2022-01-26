import React from 'react';
function App() {
  const handleClick = () => {
    console.log('test 箭头函数');
  };
  return <div onClick={handleClick}>hello react app</div>;
}

export default App;
