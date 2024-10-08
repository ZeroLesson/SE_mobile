import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Image,FlatList} from 'react-native';
import React ,{useState,useEffect} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from "../authContext";

const Stack = createNativeStackNavigator();
const id = 1;//id for testing

const Profile = ({}) => {

  const { user } = useAuth();

  //const [item, setItem] = useState([])
  //const Id= 'xxx-xxx-xxxx'
  //const name='แพรวพราว'
  //const surname='ไก่ทองดี'
  //const nameEng='Preawprow'
  //const surnameEng='Kaithongdee'
  //const phone='081-xxx-xxxx'
  useEffect(() => {
    fetch('http://10.0.2.2:2000/se/nurse/'+id)
        .then(res => res.json())
        .then((result) => {
            //console.log(result)
            /*let newArray = result.map((item) => {
                return { key: item.nurseID, value: item.shift }
            })
            //Set Data Variable
            setData(newArray)*/
            //console.log(result)
        })
        .catch(error => console.error('Error fetching data:', error));
}, [])
  
  return (
    
    <View style={styles.container}>
      
      <View style={styles.name}>
        <View style={{ marginTop: 4, alignItems: 'center' }}>
          <Text style={{ fontSize: 17 }}>{user.positionName} {user.firstname} {user.lastname}</Text>
        </View>
      </View>
      <View style={styles.main}>
        <View style={ {marginTop: 14, alignItems: 'center' }}>
          <Text style={{ fontSize: 26, fontWeight: 'bold' }}>ประวัติพยาบาล</Text>
          <Text>ข้อมูลพยาบาล</Text>
        </View>
        <View style={styles.from}>
          <View style={styles.logocen}> 
          <Image
            style={styles.logo}
            source={require('../pages/icons.png')}/>
          </View>
          
          
          <View style={styles.textbox}/>
            <Text style={styles.textIn}>ชื่อ :                                        {user.firstname}</Text>
          <View style={styles.textbox}/>
            <Text style={styles.textIn}>นามสกุล :                              {user.lastname}</Text>
          <View style={styles.textbox}/>
            <Text style={styles.textIn}>ตำแหน่ง :                               {user.positionName}</Text>
        </View>
      </View>
    </View>
  );
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logo: {
    width: 166,
    height: 158,
  },
  logocen:{
    top: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  name: {
   height: 33,backgroundColor: '#A2A2A2',
  },
  header: {
    flex: 1,
    backgroundColor: '#393939',
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 16,
    alignItems: 'center'
  },
  from: {
    height:600,
    width:400,
    backgroundColor: '#DCDCDC',
    borderRadius: 10,
  },
  texth:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  textIn:{
    top: 25,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    left: 10,
  },
  head: {
    height: 50,
    width: 400,
    alignItems: 'center',
    margin: 20,
  },
  textbox:{
   
    margin: 13,
  },


})
