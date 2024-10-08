import React from "react";
import { View, Text, StyleSheet } from "react-native";

const UserHeader = ({ user }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>
        {user.positionName} {user.firstname} {user.lastname}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#696969",
    padding: 10,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default UserHeader;
