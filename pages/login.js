import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { useAuth } from "../authContext";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://10.0.2.2:2000/se/login", {
        username: username,
        password: password,
      });
      if (response.data.success) {
        const { nurse } = response.data;
        console.log(response.data)
        login(nurse);
      } else {
        Alert.alert("Invalid username or password");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while trying to log in");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredView}>
        <Text style={{ paddingBottom: 10, fontSize: 50, fontWeight: "bold" }}>
          เข้าสู่ระบบ
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(text) => setUsername(text)}
          value={username}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    width: "80%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#000000",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default LoginScreen;
