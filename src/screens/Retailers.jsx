import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from "react-native";
import React from "react";
import MapView, { Callout, Circle, Marker } from "react-native-maps";
import * as Location from "expo-location";

const Retailers = () => {
  const [data, setData] = React.useState([]);
  const [location, setLocation] = React.useState({
    latitude: 9.941278214614067,
    longitude: 78.12128350138664,
  });
  const [selectedRetailer, setSelectedRetailer] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredData, setFilteredData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.salesjump.in/api/MasterData/getRetailerDetails?senderID=shri"
        );
        const jsonData = await response.json();

        // console.log("jsonData: ", jsonData);

        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const RenderRetailerItem = React.memo(({ item }) => (
    <TouchableOpacity onPress={() => handleRetailerPress(item)}>
      <View style={styles.retailerItem}>
        <Text>{item.retailer_Name}</Text>
        <Text>{item.address}</Text>
      </View>
    </TouchableOpacity>
  ));

  const handleRetailerPress = (retailer) => {
    if (retailer.latitude !== null && retailer.longitude !== null) {
      setSelectedRetailer(retailer);
    } else {
      // Handle case where latitude or longitude is null
      console.warn(
        "Latitude or longitude is null for selected retailer:",
        retailer
      );
      // You can choose to display an alert or handle it in any other way
    }
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text === "") {
      setFilteredData(data); // Reset filtered data to original data when text is empty
    } else {
      const filteredData = data.filter((item) =>
        item.retailer_Name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filteredData);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {filteredData.map((item, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(item.latitude),
              longitude: parseFloat(item.longitude),
            }}
            title={item.retailer_Name}
            description={item.address}
          />
        ))}
        {selectedRetailer && (
          <Marker
            coordinate={{
              latitude: parseFloat(selectedRetailer.latitude),
              longitude: parseFloat(selectedRetailer.longitude),
            }}
            title={selectedRetailer.retailer_Name}
            description={selectedRetailer.address}
          />
        )}
        {/* {data.map((item, index) => {
            // Check if latitude and longitude are valid before creating the marker
            const isValidCoordinate =
              item.latitude !== null &&
              item.longitude !== null &&
              item.latitude !== "" &&
              item.longitude !== "";
  
            if (isValidCoordinate) {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: parseFloat(item.latitude),
                    longitude: parseFloat(item.longitude),
                  }}
                  title={item.retailer_Name}
                  description={item.address}
                />
              );
            } else {
              // Handle the case where the coordinates are not valid (optional)
              return null; // or provide a default location
            }
          })} */}
        {/* {data.map(
            (item, index) =>(
                <Marker
                  key={index}
                  coordinate={{
                    latitude: item.latitude,
                    longitude: item.longitude,
                  }}
                  title={item.retailer_Name}
                  description={item.address}
                />
              )
          )} */}
      </MapView>
      <FlatList
        data={filteredData.length > 0 ? filteredData : data}
        renderItem={({ item }) => <RenderRetailerItem item={item} />}
        keyExtractor={(item, index) => index.toString()}
        style={styles.flatlist}
        ListHeaderComponent={() => (
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search Retailers..."
              onChangeText={handleSearch}
              value={searchTerm}
              style={styles.searchInput}
              clearButtonMode="while-editing"
              keyboardType="default"
            />
          </View>
        )}
      />
    </View>
  );
};

export default Retailers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: 400,
  },
  flatlist: {
    MaxHeight: 300, // Adjust height as needed
    marginHorizontal: 10,
    // marginVertical: 10,
  },
  retailerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  searchContainer: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    marginHorizontal: 10,
    marginVertical: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 30,
  },
});
