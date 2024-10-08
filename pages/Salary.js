import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Image } from 'react-native';
import React ,{useState,useEffect} from 'react';
import { useAuth } from "../authContext";

const id = 1;//id for testing

export default function App() {
  const { user } = useAuth();
  const [shift, setShift] = useState('');
  const [shiftSum, setShiftSum] = useState(0);
  /*const mMoney ='xxxxx'*/
  const otMoney ='xxxxx'
  const shiftRateMoney = 360*shiftSum
  const total= user.salary+shiftRateMoney
  useEffect(() => {
    fetch('http://10.0.2.2:2000/se/schedule/shift/night/'+user.nurseID)
        .then(res => res.json())
        .then((result) => {
            console.log(result)
            setShift(result[0].shift);
            setShiftSum(result[0].shiftSum);
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
          <Text style = {styles.text}>{user.positionName} {user.firstname} {user.lastname}</Text>
        </View>
      </View>
      <View style={styles.main}>
        <View style={{marginTop: 14, alignItems: 'center' }}>
          <Text style={{ fontSize: 26, fontWeight: 'bold' }}>การเงินภายในเดือนนี้</Text>
        </View>
        <View style={styles.from}>
          <View style={styles.logocen}> 
            <Image
            style={styles.logo}
  source={require('./../pages/icons.png')}/>
          </View>
          <View style={styles.fromIn}>
          <View style={styles.textbox}/>
            <Text style={styles.textIn}>เงินเดือน                                    {user.salary}      บาท</Text>
          <View style={styles.textbox}/>
            <Text style={styles.textIn}>เงินค่าขึ้นเวรบ่าย-ดึก               {shiftRateMoney}      บาท</Text>
          <View style={styles.textbox}/>
            <Text style={styles.textIn}>เงินทั้งหมด                                 {total}      บาท</Text>
          <View style={styles.textbox}/>
        </View>
      </View>
      </View>
    </View>
  );
}

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
    backgroundColor: '#EAE9E9',
    borderRadius: 10,
  },
  fromIn: {
    top: 35,
    height:600,
    width:400,
    backgroundColor: '#BCB5B5',
    borderRadius: -10,
  },
  texth:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  text:{
    fontSize: 17,

  },
  text1:{
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: -165,
    color: '#000000',
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
  }


})