import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Calendar } from 'react-native-calendars';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from "../authContext";

const Stack = createNativeStackNavigator();

var d = '';
var day2 = '';
var month = '';
var year = '';

const Schedule = ({ navigation }) => {

    const { user } = useAuth();
    const [selected, setSelected] = useState('');
    const goTable = (date,day) => {
        navigation.navigate('Table', { date: d , day: day2, month: month, year: year})
    }

    return (
        <View>
            <View style={styles.container}>
                <View style={{ marginTop: 4, alignItems: 'center' }}>
                    <Text style={{ fontSize: 17 }}>{user.positionName} {user.firstname} {user.lastname}</Text>
                </View>
            </View>
            <View style={{ marginTop: 14, alignItems: 'center' }}>
                <Text style={{ fontSize: 26, fontWeight: 'bold' }}>ตารางเวรพยาบาล</Text>
            </View>
            <View style={{ marginTop: 11 }}>
                <Calendar
                    onDayPress={day => {
                        setSelected(day.dateString);
                        console.log('selected day', day)
                        d = day.dateString;
                        day2 = day.day;
                        month = day.month;
                        year = day.year;
                    }}
                    markedDates={{
                        [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                    }}
                />
            </View>
            <View style={{ margin: 23, alignItems: 'center' }}>
                <TouchableOpacity
                    style={{ backgroundColor: "#11E4F1", alignItems: 'center', width: '56%', height: '24.5%' }}
                    onPress={() => {
                        goTable(d)
                    }}
                >
                    <Text style={{ fontSize: 23, color: 'white', marginTop: 2 }}>ดูตารางเวร</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Schedule

const styles = StyleSheet.create({
    container: {
        height: 33,
        backgroundColor: '#A2A2A2'
    }
});