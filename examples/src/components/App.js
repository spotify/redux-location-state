import React from 'react';

const App = (props) => {
  return <div>
    <div id="content">
      {props.children}
    </div>
  </div>
};

export default App;
