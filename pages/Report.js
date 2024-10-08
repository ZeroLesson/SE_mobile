import { StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import React, { useState, useEffect } from "react";
import { SelectList } from 'react-native-dropdown-select-list'
import { useAuth } from "../authContext";
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';


const MyButton = () => { }
const handlePress = () => {
    // Action to be performed when the button is pressed
};
export default function Report({ navigation, route }) {

    const [selected, setSelected] = React.useState("");
    const [data, setData] = React.useState([]);
    const [items, setItems] = useState([])
    const [items2, setItems2] = useState([])
    const [date2, setDate] = useState([])
    const moment = require('moment');
    const formattedDate = moment(date2).format('YYYY-MM-DD');
    const { user } = useAuth();
    const [resultData, setResultData] = useState([]);
    let array = []
    let array2 = []
    const myJSON = JSON.stringify(items2);
    let value = '';
    const assignID2 = route.params.assignID //assignID 2 pass parmams

    console.log(route.params)
    console.log(items2)
    useEffect(() => {
        fetch('http://10.0.2.2:2000/se/schedule/select/' + user.nurseID + '/' + formattedDate)
            .then(res => res.json())
            .then((result) => {
                setItems(result)
                array = result.map((item) => {
                    return { nurseID: item.nurseID, shift: item.shift, assignID: item.assignID }
                })
                //console.log(array)
                let newArray = result.map((item) => {
                    return { key: item.assignID, value: item.shift }
                })
                setData(newArray)
                //console.log(result)
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [date2])

    useEffect(() => {
        fetch('http://10.0.2.2:2000/se/assign/shift/' + selected)
            .then(res => res.json())
            .then((result) => {
                
                let newArray = result.map((item) => {
                    return { value: item.shift }
                })

                setItems2(newArray)
                value = newArray.value
                console.log(value)
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [selected])

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        //console.warn("A date has been picked: ", date);
        setDate(date);
        hideDatePicker();
    };

    const handlePress = async () => {

        try {
            const response = await axios.post("http://10.0.2.2:2000/se/switch/add/", {
                assign1: selected,
                assign2: assignID2,
                nurseID1: user.nurseID,
                nurseID2: route.params.id,
                shift1: value,
                shift2: route.params.shift,
                date1: date2,
                date2: route.params.year + '-' + '0' + route.params.month + '-' + '0' + route.params.day
            });
            alert("à¸ªà¹ˆà¸‡à¸ªà¸³à¹€à¸£à¹‡à¸ˆ");
            navigation.navigate('Schedule')
            console.log(response.data);
        } catch (error) {
            console.error('Error sending data:', error);
        }
    };

    return (

        <View style={styles.container}>

            <View style={styles.name2}>
                <Text style={{ fontSize: 17 }}>{user.positionName} {user.firstname} {user.lastname}</Text>
            </View>

            <View style={styles.head}>
                <Text style={styles.headtext}>คำร้องขอแลกเวร</Text>
            </View>

            <View style={styles.square}>
                <View style={styles.insquare}>
                    <Text style={styles.squaretext}>ชื่อผู้แลก : นางพจมาน ชาญสมร</Text>
                    <Text style={styles.squaretext}>ชื่อผู้ที่ต้องการแลก : {route.params.fname} {route.params.lname}</Text>
                    <Text style={styles.squaretext}>วันที่ต้องการแลก : {route.params.day} {route.params.month} {route.params.year}</Text>
                    <Text style={styles.squaretext}>เวรที่ต้องการ : {route.params.shift}</Text>

                    <View style={styles.row}>
                        <Text style={{ fontSize: 16 }}>วันที่จะแลก:</Text>
                        <View style={styles.butrow}>
                            <TouchableOpacity onPress={showDatePicker}>
                                <Text>เลือกวันที่ต้องการแลก <AntDesign name="down" size={14} color="black" /></Text>

                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                /></TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.squaretext}>
                        <Text style={{ fontSize: 16 }}>เวรที่จะแลก:</Text>
                        <SelectList
                            setSelected={(val) => setSelected(val)}
                            data={data}
                            save="key"
                        />
                    </View>

                    <View style={styles.squarebutset}>
                        <TouchableOpacity onPress={handlePress}>
                            <Text style={{ fontSize: 15 }}>ส่ง</Text>
                        </TouchableOpacity>
                    </View>


                </View>
            </View>


        </View>


    );
}

const styles = StyleSheet.create({
    name: {
        paddingVertical: 10,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    name2: {
        height: 33,
        backgroundColor: '#A2A2A2',
        alignItems: 'center',
        justifyContent: 'center',
    },

    container: {
        flex: 1,
    },

    head: {
        paddingTop: 10,
        alignItems: 'center',
        paddingBottom: 11,
    },
    headtext: {
        fontSize: 26,
        fontWeight: 'bold',
        marginTop: 9,
    },

    square: {
        height: 500,
        width: 360,
        backgroundColor: 'lightgray',
        borderRadius: 15,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    insquare: {
        height: 460,
        width: 320,
        backgroundColor: 'white',
        borderRadius: 15,

    },
    squaretext: {
        margin: 10,
        fontSize: 16,
    },
    squarebutset: {
        backgroundColor: 'lightgrey',
        height: 40,
        width: 70,
        justifyContent: 'flex-end',
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end'
    },
    row: {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center'

    },
    butrow: {
        marginLeft: 15,
        backgroundColor: '#85C1E9',
        width: 200,
        height: 30,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#626567'
    }

});