import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [map, setMap] = useState({});

  useEffect(() => {
    let map = tt.map({
      key: process.env.REACT_APP_TT_KEY,
      container: mapElement.current,
    });
    setMap(map);
  }, []);

  return (
    <div className="App">
      <h1>Welcome Home</h1>
    </div>
  );
};

export default App;
