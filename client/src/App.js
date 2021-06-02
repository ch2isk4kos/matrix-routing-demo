import React, { useState, useEffect, useRef } from "react";
import * as tt from "@tomtom-international/web-sdk-maps";
import * as ttapi from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "./App.css";

const App = () => {
  const [map, setMap] = useState({});
  const [destinations, setDestinations] = useState([]);
  const [longitude, setLongitude] = useState(-73.993324);
  const [latitude, setLatitude] = useState(40.750298);
  const mapElement = useRef();

  const coordinates = (lngLat) => {
    return {
      point: {
        longitude: lngLat.lng,
        latitude: lngLat.lat,
      },
    };
  };

  const addDeliveryMarker = (lngLat, map) => {
    const element = document.createElement("div");
    element.className = "marker-delivery";
    new tt.Marker({ element: element }).setLngLat(lngLat).addTo(map);
  };

  useEffect(() => {
    // coordinates
    const origin = {
      lng: longitude,
      lat: latitude,
    };
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
    // popup
    const popupOffset = { bottom: [0, -60] };
    const popup = new tt.Popup({ offset: popupOffset }).setHTML("You Are Here");
    // marker
    const addMarker = () => {
      const element = document.createElement("div");
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
      marker.setPopup(popup).togglePopup();
    };
    addMarker();
    // destinations
    const sortDestinations = (locations) => {
      const location = locations.map((destination) => {
        return coordinates(destination);
      });
      const callParameters = {
        key: process.env.REACT_APP_TT_KEY,
        destinations: location,
        origin: [coordinates(origin)],
      };
      return new Promise((resolve, reject) => {
        ttapi.services.matrixRouting(callParameters).then((results) => {
          const matrix = results.matrix[0];
          const routes = matrix.map((data, index) => {
            return {
              location: locations[index],
              drivingtime: data.response.routeSummary.travelTimeInSeconds,
            };
          });
          routes.sort((a, b) => {
            return a.drivingtime - b.drivingtime;
          });
          const sortedRoutes = routes.map((route) => {
            return route.location;
          });
          resolve(sortedRoutes);
        });
      });
    };

    map.on("click", (e) => {
      // setDestinations(...destinations, e.lngLat);
      destinations.push(e.lngLat);
      addDeliveryMarker(e.lngLat, map);
      console.log("destinations:", destinations);
    });

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
