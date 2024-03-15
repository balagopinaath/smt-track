import MapView, { Callout, Circle, Marker, Polyline } from "react-native-maps";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Share } from "react-native";
import * as Location from "expo-location";

const GeoTracking = () => {
  const [pin, setPin] = useState({
    latitude: 9.941278214614067,
    longitude: 78.12128350138664,
  });
  const [location, setLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  //   Location Permission
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setPin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setRouteCoordinates((prevCoordinates) => [
        ...prevCoordinates,
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      ]);
    })();
  }, []);

  //   Sharing Location
  function sharingLocaion(coordinate) {
    console.log("coordinate", coordinate.latitude, coordinate.longitude);
    try {
      // const result = Share.share({
      //   message: `https://www.google.com/maps/search/?api=1&query=${coordinate.latitude},${coordinate.longitude}`,
      // });
      const result = `https://www.google.com/maps/search/?api=1&query=${coordinate.latitude},${coordinate.longitude}`;
      console.log("resultUrl: ", result);
    } catch (err) {
      console.log(err);
    }
  }

  //   setInterval Block (15 mins)
  useEffect(() => {
    // Call postDatabase initially and then set up an interval to call it every 15 minutes
    postDatabase(pin.latitude, pin.longitude);

    const intervalId = setInterval(() => {
      postDatabase(pin.latitude, pin.longitude);
    }, 15 * 60 * 1000); // 15 minutes in milliseconds

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [pin]);

  //   Posting coordinates to the database
  const postDatabase = async (latitude, longitude) => {
    let headersList = {
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({
      Emp_Id: 1,
      Latitude: latitude.toString(),
      Logitude: longitude.toString(),
      Web_URL: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });

    let response = await fetch("http://192.168.1.10:7001/user/api/location", {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });

    let data = await response.text();
    console.log("postData", data);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: pin.latitude,
          longitude: pin.longitude,
          latitudeDelta: 0.02, // Adjust for desired zoom level
          longitudeDelta: 0.02, // Adjust for desired zoom level
        }}
        showsUserLocation={true}
        onUserLocationChange={(e) => {
          e.persist(); // Persist the synthetic event
          sharingLocaion(e.nativeEvent.coordinate);
          setRouteCoordinates((prevCoordinates) => [
            ...prevCoordinates,
            e.nativeEvent.coordinate,
          ]);
        }}
      >
        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={2}
          strokeColor="red"
        />
        <Marker
          coordinate={pin}
          title="Title"
          description="Hi"
          draggable={true}
          onDragStart={(e) => {
            // setPin({
            //   latitude: e.nativeEvent.coordinate.latitude,
            //   longitude: e.nativeEvent.coordinate.longitude,
            // });
          }}
        >
          <Callout>
            <Text>Madurai</Text>
          </Callout>
        </Marker>
        <Circle radius={250} center={pin} />
      </MapView>
    </View>
  );
};

export default GeoTracking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: 500,
  },
});
