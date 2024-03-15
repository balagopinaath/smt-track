import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Dashboard = () => {
  const navigation = useNavigation();

  const goToGeoTracking = () => {
    navigation.navigate("GeoTracking");
  };

  const goToRetailers = () => {
    navigation.navigate("Retailers");
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18 }}>Continue as</Text>

      <View style={styles.boxGroup}>
        <Pressable style={styles.button} onPress={goToGeoTracking}>
          <Text style={styles.text}>Tracking</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={goToRetailers}>
          <Text style={styles.text}>Retailers</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  boxGroup: {
    flexDirection: "row",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
    marginVertical: 20,
    marginHorizontal: 50,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
});
