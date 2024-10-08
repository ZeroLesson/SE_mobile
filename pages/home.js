import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useState } from "react";
import { useAuth } from "../authContext";
import UserHeader from "./userHeader";

const HomeScreen = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  return (
    <View style={styles.container}>
      <UserHeader user={user}/>
      <View style={styles.head}>
        <Text style={styles.welcomeText}>
            ยินดีต้อนรับ, {user.positionName} {user.firstname} {user.lastname} {'\n'}
            {currentDate.toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.home}>
          <Image source={require('./../pages/poster.png')} style={styles.image} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    padding: 15,
    backgroundColor: "#000000",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  home: {
    height: 500,
    width: 350,
    backgroundColor: '#DCDCDC',
    borderRadius: 10,
    marginBottom: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'cover',
    borderRadius: 10,
  },
  head: {
    marginLeft: 30,
    marginTop: 10,
  }
});


export default HomeScreen;
