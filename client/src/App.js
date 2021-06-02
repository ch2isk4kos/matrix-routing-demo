import React, { useState, useEffect, useRef } from "react";
import * as tt from "@tomtom-international/web-sdk-maps";
import "./App.css";

const App = () => {
  const [map, setMap] = useState({});
  const mapElement = useRef();

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
      <div ref={mapElement}></div>
    </div>
  );
};

export default App;
