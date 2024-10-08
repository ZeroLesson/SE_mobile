import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler'
import { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from "../authContext";
import axios from 'axios';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Schedule from './Schedule';


const NotificationModal = ({ modalVisible, closeModal }) => {

  const currentDate = new Date();
  const { user } = useAuth();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const moment = require('moment');
  let array = []
  const navigation = useNavigation();

  const [nurses, setNurses] = useState([]);
  const [items, setItems] = useState([]);
  const [items2, setItems2] = useState([]);
  const [items3, setItems3] = useState([]);
  const [items4, setItems4] = useState([]);
  const [items5, setItems5] = useState([]);
  const [Data, setData] = useState([]);

  const upData = async (nurseID, scheduleID) => {
    try {
      const response = await axios.post('http://10.0.2.2:2000/se/update' , {
      nurseID: nurseID,  
      scheduleID: scheduleID
        
      });
      alert("ส่งสำเร็จ");
      navigation.navigate('Schedule')
      console.log(response.data); 
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  const sendData2 = async (a) => {
    try {
        const response = await axios.put('http://10.0.2.2:2000/se/update/status', {
          requestID: a,
        });
        
        //const data = await response.json();
        console.log("updating sucess",response); // ประมวลผลคำขอและข้อมูลที่ได้รับกลับจากเซิร์ฟเวอร์
    } catch (error) {
        console.error('Error updating status: ',error);
    }
};
  
const sendData3 = async (a) => {
  try {
      const response = await axios.put('http://10.0.2.2:2000/se/switch/status', {
        switchID: a,
      });
      
      //const data = await response.json();
      console.log("updating sucess",response); // ประมวลผลคำขอและข้อมูลที่ได้รับกลับจากเซิร์ฟเวอร์
  } catch (error) {
      console.error('Error updating status: ',error);
  }
};

const handleButtonClick = async (nurseID, scheduleID, requestID) => {
  try {
    await upData(nurseID, scheduleID);
    await sendData2(requestID);
    console.log('ทั้งสองการร้องขอเสร็จสิ้น');
    navigation.navigate('Schedule');
  } catch (error) {
    console.error('Error:', error);
  }
};

const sendData = async (nurseID2,nurseID1,assignID2,assignID1) => {
  try {
    const response = await axios.put("http://10.0.2.2:2000/se/schedule/change/", {
      nurseID: nurseID1,
      id: assignID2,
    });
    alert("ส่งสำเร็จ");
  } catch (error) {
    console.error('Error sending data:', error);
  }
  try {
    const response = await axios.put("http://10.0.2.2:2000/se/schedule/change/", {
      nurseID: nurseID2,
      id: assignID1,
    });
    alert("ส่งสำเร็จ");
  } catch (error) {
    console.error('Error sending data:', error);
  }
};

  useEffect(() => {
    fetch('http://10.0.2.2:2000/se/modal/' + user.nurseID)
      .then(res => res.json())
      .then((result) => {
        setNurses(result)
        //console.log(result)
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch('http://10.0.2.2:2000/se/exchange/change')
      .then(res => res.json())
      .then((result) => {
        setItems3(result)
        console.log(items3)
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch('http://10.0.2.2:2000/se/switch/' )
      .then(res => res.json())
      .then((result) => {
        setData(result)
        console.log(result)
      })
          //   let newArray = result.map((item) => {
          //       return { key: item.switcdID, value: item.switcdID, 
          //         key: item.assignID1, value: item.assignID1,
          //         key: item.assignID2, value: item.assignID2,
          //         key: item.nurseID1, value: item.nurseID1,
          //         key: item.nurseID2, value: item.nurseID2,
          //         key: item.shift1, value: item.shift1,
          //         key: item.shift2, value: item.shift2,
          //         key: item.date1, value: item.date1,
          //         key: item.date2, value: item.date2,
          //         key: item.status, value: item.status,}
          //   })
          //   // Set Data Variable
          //   console.log(newArray)
          //   setData(newArray)
          //   console.log(Data)
          // })
        
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  const renderNurseItem = ({ item }) => (
    <View style={styles.notice}>
      <View style={styles.title}>
        <Text style={styles.modalText}>รายงานการขอพยาบาลขึ้นเวรฉุกเฉิน</Text>
      </View>
      <View style={styles.textquick}>
        <Text style={styles.textmodal}>วันที่ : {moment(item.date).format('DD-MM-YYYY')}</Text>
        <Text style={styles.textmodal}>รอบเวร : {item.shift} </Text></View>
      <View style={styles.butboxchange}>
      <TouchableOpacity onPress={() => handleButtonClick( item.nurseID, item.scheduleID ,item.requestID)}>
          <View style={styles.but2}>
            <Text style={styles.textStyle}>ตกลง</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => sendData2(item.requestID)}>
          <View style={styles.but2}>
            <Text style={styles.textStyle}>ปฏิเสธ</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderNurseItem2 = ({ item  }) => (
    <View style={styles.noticechange}>
      <View style={styles.title}>
        <Text style={styles.modalText}>คำร้องขอแลกเวรพยาบาล</Text>
      </View>

      <View style={styles.textnotice}>
        <Text style={styles.textmodal}>ผู้ขอแลกเวร ID: {item.nurseID1}</Text>
        <Text style={styles.textmodal}>เวรที่ต้องการแลก :{moment(item.date1).format('DD-MM-YYYY')} เวร: {item.shift1} </Text>
        <Text style={styles.textmodal}>เวรที่นำมาแลก :{moment(item.date2).format('DD-MM-YYYY')} เวร: {item.shift2} </Text>
      </View>

      <View style={styles.butboxchange}>
        <TouchableOpacity onPress={() => sendData(item.nurseID2,item.nurseID1,item.assignID2,item.assignID1)}>
          <View style={styles.but2}>
            <Text style={styles.textStyle}>ตกลง</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => sendData3(item.switcdID)}>
          <View style={styles.but2}>
            <Text style={styles.textStyle}>ปฏิเสธ</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>

  );
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <GestureHandlerRootView style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => closeModal()}>
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>การแจ้งเตือน</Text>
          <View style={styles.line} />
          <ScrollView>

            <View >
              <FlatList
                data={nurses}
                renderItem={renderNurseItem}
                keyExtractor={(item) => item.nurseID}
              />
            </View>
            {/* { <View>
              <FlatList
                data={items3}
                renderItem={renderNurseItem2}
                keyExtractor={(item) => item.exe}
              />
            </View> } */}
            {/* <View>
              <FlatList
                data={items5}
                renderItem={renderNurseItem2}
                keyExtractor={(item) => item.firstname}
              />
            </View> */}
            <View>
              <FlatList
                data={Data}
                renderItem={renderNurseItem2}
                keyExtractor={(item) => item.firstname}
              />
            </View>



          </ScrollView>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

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
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
    textAlign: 'center',
  },
  title: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
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
  notice: {
    width: 400,
    height: 200,
    borderRadius: 20,
    margin: 20,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  noticechange: {
    width: 400,
    height: 200,
    borderRadius: 20,
    margin: 20,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  textnotice: {
    width: 300,
    height: '30%',
    justifyContent: 'center',
    margin: 15,
  },
  textquick: {
    width: 200,
    height: 60,
    justifyContent: 'center',
    margin: 10,
  },
  button: {
    width: 75,
    height: '100%',
    backgroundColor: '#696969',
    borderRadius: 15,
    justifyContent: 'center',
  },
  butbox: {
    width: '100%',
    height: '50%',
    alignItems: 'center',

  },
  butboxchange: {
    width: 170,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
  },
  but2: {
    width: 75,
    height: 45,
    backgroundColor: '#696969',
    borderRadius: 15,
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 17,
    fontWeight: 'bold'
  },
  textmodal: {
    fontSize: 17
  }


});

export default NotificationModal;
