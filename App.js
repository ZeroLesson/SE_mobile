import * as React from 'react';
import { useState, useCallback, useMemo, useRef } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator , DrawerContentScrollView , DrawerItem} from '@react-navigation/drawer';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AntDesign } from '@expo/vector-icons';
import { StyleSheet, Text, View, Pressable, Modal, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { AuthProvider, useAuth } from "./authContext";
import NotificationModal from './pages/Modal';
import Schedule from './pages/Schedule';
import Table from './pages/Table';
import Report from './pages/Report';
import LoginScreen from './pages/login';
import Profile from './pages/Profile';
import Salary from './pages/Salary';
import Form from './pages/Form';
import upload from './pages/upload';
import HomeScreen from './pages/home';

const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();

function MyDrawer({ user }) {

  const navigation = useNavigation();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };
  const [modalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  }

  const goBack = () => {
    navigation.navigate('Schedule')
  }

  const goBack2 = () => {
    navigation.navigate('Report')
  }

  return (
    <View style={{ flex: 1 }}>
      <Drawer.Navigator initialRouteName="HomeScreen" screenOptions={{ headerTitleAlign: 'center', headerTitle: 'ระบบแลกเวรพยาบาล' }} drawerContent={(props) => (
        <CustomDrawerContent {...props} handleLogout={handleLogout} />
      )}>
        <Drawer.Screen name="Schedule" component={Schedule} options={{
          headerRight: () => (
            <Pressable onPress={() => setModalVisible(true)}>
              <FontAwesome
                name="bell-o"
                size={25}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          )
        }} />
        <Drawer.Screen name="Profile" component={Profile} options={{
          headerRight: () => (
            <Pressable onPress={() => setModalVisible(true)}>
              <FontAwesome
                name="bell-o"
                size={25}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          )
        }} />
        <Drawer.Screen name="Salary" component={Salary} options={{
          headerRight: () => (
            <Pressable onPress={() => setModalVisible(true)}>
              <FontAwesome
                name="bell-o"
                size={25}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          )
        }} />
        <Drawer.Screen name='Table' component={Table} options={{
          drawerItemStyle: { height: 0 }, headerLeft: () => (
            <Pressable onPress={() => goBack()}>
              <FontAwesome
                name="chevron-left"
                size={24}
                color="black"
                style={{ marginLeft: 15 }}
              />
            </Pressable>
          )
        }} />
        <Drawer.Screen name='Report' component={Report} options={{
          drawerItemStyle: { height: 0 }, headerLeft: () => (
            <Pressable onPress={() => goBack()}>
              <FontAwesome
                name="chevron-left"
                size={24}
                color="black"
                style={{ marginLeft: 15 }}
              />
            </Pressable>
          )
        }} />
            <Drawer.Screen name="Form" component={Form} options={{
          headerRight: () => (
            <Pressable onPress={() => setModalVisible(true)}>
              <FontAwesome
                name="bell-o"
                size={25}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          )
        }} />
        <Drawer.Screen name="Upload" component={upload} options={{
          headerRight: () => (
            <Pressable onPress={() => setModalVisible(true)}>
              <FontAwesome
                name="bell-o"
                size={25}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          )
        }} />
        <Drawer.Screen name="HomeScreen" component={HomeScreen} options={{
          headerRight: () => (
            <Pressable onPress={() => setModalVisible(true)}>
              <FontAwesome
                name="bell-o"
                size={25}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          )
        }} />
      </Drawer.Navigator>
      <NotificationModal modalVisible={modalVisible} closeModal={closeModal}/>
    </View >
  );
}

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="HomeScreen"
        onPress={() => props.navigation.navigate("HomeScreen")}
      />
      <DrawerItem
        label="Schedule"
        onPress={() => props.navigation.navigate("Schedule")}
      />
      <DrawerItem
        label="Profile"
        onPress={() => props.navigation.navigate("Profile")}
      />
      <DrawerItem
        label="Salary"
        onPress={() => props.navigation.navigate("Salary")}
      />
      <DrawerItem
        label="RequestExtra"
        onPress={() => props.navigation.navigate("Form")}
      />
      <DrawerItem
        label="Upload"
        onPress={() => props.navigation.navigate("Upload")}
      />
      <DrawerItem label="Logout" onPress={props.handleLogout} />
    </DrawerContentScrollView>
  );
};

function AppContent() {
  const { user, isLogin } = useAuth();

  return (
    <NavigationContainer>
      {isLogin ? <AuthenticatedContent user={user} /> : <LoginScreen />}
    </NavigationContainer>
  );
}

function AuthenticatedContent({ user }) {
  return (
    <MyDrawer user={user} />
  );
}

export default function App(navigation) {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    bottom: 0,
    position: 'absolute',
    backgroundColor: "white",
    borderRadius: 20,
    width: '100%',
    alignItems: "center",
    height: Dimensions.get('window').height * 0.8,
    maxHeight: Dimensions.get('window').height * 0.8,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowColor: "#000",
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginTop: 20,
    textAlign: "center",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    margin: 20,
    textAlign: 'center',
  },
  line: {
    height: 2,
    width: '100%',
    backgroundColor: '#eee'
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 10,
  },
});