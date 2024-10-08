import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const Form = () => {

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const moment = require('moment');
    const formattedDate = moment(currentDate).format('YYYY-MM-DD');
    const navigation = useNavigation();
    let array = []
    let array1 = []

    const [items, setItems] = useState([])
    const [data1, setData] = React.useState([]);
    const [data2, setData2] = React.useState([]);

    const sendData = async (scheduleID, nurseID) => {
        try {
          const response = await axios.post('http://10.0.2.2:2000/se/extra/create' , {
            scheduleID: scheduleID,
            nurseID: nurseID
          });
          alert("ส่งสำเร็จ");
          navigation.navigate('Schedule')
          console.log(response.data); 
        } catch (error) {
          console.error('Error sending data:', error);
        }
      };

      


    useEffect(() => {
        fetch('http://10.0.2.2:2000/se/extra/' + formattedDate)
            .then(res => res.json())
            .then((result) => {
                setItems(result)
                array1 = result.map((item) => {
                    return { scheduleID: item.scheduleID, shift: item.shift }
                })
                //console.log(array)
                let newArray = result.map((item) => {
                    return { label: item.shift, value: item.scheduleID }
                })
                //Set Data Variable
                setData(newArray)
                //console.log(result)
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [day])

    useEffect(() => {
        fetch('http://10.0.2.2:2000/se/nurse/')
            .then(res => res.json())
            .then((result) => {
                setItems(result)
                array = result.map((item) => {
                    return { nurseID: item.nurseID, firstname: item.firstname, lastname: item.lastname }
                })
                //console.log(array)
                let newArray = result.map((item) => {
                    return { label: item.firstname + ' ' + item.lastname , value: item.nurseID }
                })
                //Set Data Variable
                setData2(newArray)
                //console.log(result)
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [day])

    const [value, setValue] = useState(null);
    const [value1, setValue1] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[isFocus && { color: 'blue' }]} />
            );
        }
        return null;
    };
    const _onPressBut1 = () => {
        alert('ส่งการรายงานสำเร็จ')
    }

    //console.log(value);
    //console.log(value1);
    return (
        <View style={styles.container}>
            <View style={styles.name}>
                <Text style={styles.textname}>หัวหน้าพยาบาล แพรวพราว ไก่ทอดี</Text>
            </View>
            <View style={styles.main}>
                <View style={styles.head}>
                    <Text>คำร้องขอการอนุมัติขึ้นเวรฉุกเฉิน</Text>
                </View>
                <View style={styles.from}>
                    <View style={styles.viewtext}>
                        <View style={styles.textrow}>
                            <View style={styles.textbox}>
                                <Text >วันที่ : </Text>
                            </View>
                            <View style={styles.datatext}>
                                <Text >{day}-{month}-{year} </Text>
                            </View>
                        </View>
                        {renderLabel()}
                        <Dropdown
                            style={[styles.dropdown, isFocus && { borderColor: 'black' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={data1}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocus ? 'เวรที่ต้องการคน' : '...'}
                            searchPlaceholder="Search..."
                            value={value}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                                setValue(item.value);
                                setIsFocus(false);
                            }}
                            renderLeftIcon={() => (
                                <FontAwesome
                                    style={styles.icon}
                                    color={isFocus ? 'gray' : 'black'}
                                    name="hospital-o"
                                    size={20}
                                />
                            )}
                        />

                        {renderLabel()}
                        <Dropdown
                            style={[styles.dropdown, isFocus && { borderColor: 'black' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={data2}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocus ? 'ผู้ที่ถูกเรียกมาขึ้นเวร' : '...'}
                            searchPlaceholder="Search..."
                            value={value}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                                setValue1(item.value);
                                setIsFocus(false);
                            }}
                            renderLeftIcon={() => (
                                <FontAwesome
                                    style={styles.icon}
                                    color={isFocus ? 'gray' : 'black'}
                                    name="user-md"
                                    size={20}
                                />
                            )}
                        />
                    </View>
                    <View style={styles.bot}>
                        <TouchableOpacity onPress={() => sendData(value, value1)}>
                            <Text style={styles.white}>ส่งรายงาน</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </View>
    )
}

export default Form
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    name: {
        flex: 1,
        backgroundColor: '#696969',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textname: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    main: {
        flex: 16,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    from: {
        height: '40%',
        width: '90%',
        backgroundColor: '#DCDCDC',
        borderRadius: 20,
    },
    head: {
        height: '5%',
        width: '90%',
        alignItems: 'center',
        margin: 20
    },
    bot: {
        height: '17%',
        width: '25%',
        borderRadius: 7,
        backgroundColor: '#696969',
        marginTop: '25%',
        marginLeft: '65%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewtext: {
        height: '40%',
        width: '90%',
        backgroundColor: '#DCDCDC',
        borderRadius: 10
    },
    textrow: {
        height: '15%',
        width: '100%',
        marginTop: 25,
        marginLeft: 20,
        backgroundColor: '#DCDCDC',
        flexDirection: 'row',

    },
    datatext: {
        backgroundColor: '#DCDCDC',
        height: '100%',
        width: '60%',
        marginLeft: 4
    },
    textbox: {
        height: '100%',
        width: '10%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    white: {
        color: 'white',
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginLeft: 20
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});
