import React, { useState, useEffect, useRef } from "react";
import * as tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "./App.css";

const App = () => {
  const [map, setMap] = useState({});
  const [longitude, setLongitude] = useState(-73.993324);
  const [latitude, setLatitude] = useState(40.750298);
  const mapElement = useRef();

  useEffect(() => {
    // map
    let map = tt.map({
      key: process.env.REACT_APP_TT_KEY,
      container: mapElement.current,
      stylesVisibility: {
        trafficIncidents: true,
        trafficFlow: true,
      },
      center: [longitude, latitude],
      zoom: 15,
    });
    setMap(map);
    // marker
    const addMarker = () => {
      let element = document.createElement("div");
      element.className = "marker";
      const marker = new tt.Marker({
        draggable: true,
        element: element,
      })
        .setLngLat([longitude, latitude])
        .addTo(map);

      marker.on("dragged", () => {
        const lngLat = marker.getLngLat();
        setLongitude(lngLat.lng);
        setLatitude(lngLat.lat);
      });
    };
    addMarker();
    return () => map.remove();
  }, [longitude, latitude]);

  return (
    <>
      {map && (
        <div className="App">
          <div className="search-bar">
            <h1>Where Do You Want to Go?</h1>
            <input
              type="text"
              id="longitude"
              className="longitude"
              placeholder="longitude"
              onChange={(e) => setLongitude(e.target.value)}
            />
            <input
              type="text"
              id="latitude"
              className="latitude"
              placeholder="latitude"
              onChange={(e) => setLatitude(e.target.value)}
            />
            <button>Go</button>
          </div>
          <div className="map" ref={mapElement}></div>
        </div>
      )}
    </>
  );
};

export default App;
