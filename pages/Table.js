import { Button, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useAuth } from "../authContext";
import { SelectList } from 'react-native-dropdown-select-list'
import Report from './Report'

const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]

const Table = ({ navigation, route }) => {

    const { user } = useAuth();
    const [items, setItems] = useState([])
    const [items2, setItems2] = useState([])
    const [items3, setItems3] = useState([])
    const [selected, setSelected] = React.useState("");
    const [data, setData] = React.useState([]);
    let array = []
    var selectedMonthName = monthNames[[route.params.month] - 1]

    const goReport = (item) => {
        let fname = item.firstname
        let lname = item.lastname
        let id = item.nurseID
        let shift = item.shift
        let assignID = item.assignID
        console.log("Exchange shift for:", item);
        navigation.navigate('Report',{fname: fname , lname: lname , id: id , shift: shift , day: route.params.day , month: route.params.month , year: route.params.year  , assignID: assignID, })
    }

    useEffect(() => {
        fetch('http://10.0.2.2:2000/se/schedule/' + route.params.date + '/' + 'เช้า')
            .then(res => res.json())
            .then((result) => {
                setItems(result)
                array = result.map((item) => {
                    return { nurseID: item.nurseID, shift: item.shift }
                })
                console.log(array)
                /*let newArray = result.map((item) => {
                    return { key: item.nurseID, value: item.shift }
                })
                //Set Data Variable
                setData(newArray)*/
                //console.log(result)
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [route.params.date])

    useEffect(() => {
        fetch('http://10.0.2.2:2000/se/schedule/' + route.params.date + '/' + 'บ่าย')
            .then(res => res.json())
            .then((result) => {
                setItems2(result)
                //console.log(result)
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [route.params.date])

    useEffect(() => {
        fetch('http://10.0.2.2:2000/se/schedule/' + route.params.date + '/' + 'ดึก')
            .then(res => res.json())
            .then((result) => {
                setItems3(result)
                //console.log(result)
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [route.params.date])


    const renderItem = ({ item }) => (
        <View>
            <View style={styles.row}>
                <Text style={styles.cell}>{item.firstname}</Text>
                <Text style={styles.cell}>{item.lastname}</Text>
                <Button title="แลกเวร" onPress={() => goReport(item)} />
            </View>
        </View>
    )

    return (
        <ScrollView style={{ alignContent: 'center' }}>
            <View style={styles.name2}>
                <Text style={{ fontSize: 17 }}>{user.positionName} {user.firstname} {user.lastname}</Text>
            </View>

            <View>
                <Text style={styles.texthead}>แลกเปลี่ยนเวร</Text>
                
            </View>
            <Text style={styles.textdate}>{route.params.day} {selectedMonthName} พ.ศ. {route.params.year + 543}</Text>

            <View style={styles.main}>
                <View style={styles.headven1}>
                    <Text>เวรเช้า</Text>
                </View>
            </View>
            <View style={styles.setrow}>
                <Text style={styles.heading}>ชื่อ</Text>
                <Text style={styles.heading}>นามสกุล</Text>
            </View>
            <FlatList
                data={items}
                keyExtractor={(item) => { item.id }}
                renderItem={renderItem}
            />
            <View style={styles.space}></View>

            <View style={styles.main}>
                <View style={styles.headven1}>
                    <Text>เวรบ่าย</Text>
                </View>
            </View>
            <View style={styles.setrow}>
                <Text style={styles.heading}>ชื่อ</Text>
                <Text style={styles.heading}>นามสกุล</Text>
            </View>
            <FlatList
                data={items2}
                keyExtractor={(item) => { item.id }}
                renderItem={renderItem}
            />
            <View style={styles.space}></View>

            <View style={styles.main}>
                <View style={styles.headven1}>
                    <Text>เวรดึก</Text>
                </View>
            </View>
            <View style={styles.setrow}>
                <Text style={styles.heading}>ชื่อ</Text>
                <Text style={styles.heading}>นามสกุล</Text>
            </View>
            <FlatList
                data={items3}
                keyExtractor={(item) => { item.id }}
                renderItem={renderItem}
            />
        </ScrollView >
    );
}

export default Table

const styles = StyleSheet.create({
    space: {
        marginBottom: 40
    },
    headven1: {
        backgroundColor: '#dcdcdc',
        paddingVertical: 12,
        paddingHorizontal: 10,
        width: 380,
        borderRadius: 5,
        marginBottom: 5,
        marginTop: 6,
        alignItems: 'center'
    },
    setrow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
        marginHorizontal: 2,
        elevation: 1,
        borderRadius: 3,
        padding: 10
    },
    cell: {
        textAlign: 'left',
        fontSize : 16,
        marginTop: 8,
    },
    textdate: {
        marginTop: 14,
        marginBottom: 10,
        marginLeft: 12,

        fontSize: 20,

    },
    textven: {
        fontSize: 15,
        fontWeight: 'bold',
        margin: 8,
    },
    container: {
        flex: 1,
        paddingVertical: 30,

    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    name: {
        flex: 1,
        backgroundColor: '#696969',
        alignItems: 'center',
        justifyContent: 'center',

    },
    name2: {
        height: 33,
        backgroundColor: '#A2A2A2',
        alignItems: 'center',
        justifyContent: 'center',

    },
    main: {
        alignItems: 'center'
    },
    from: {
        height: 400,
        width: 350,
        backgroundColor: '#DCDCDC',
        borderRadius: 10,
        margin: 5,
        alignItems: 'center'
    },
    from2: {
        height: 300,
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 5,
        alignItems: 'center'
    },
    head: {
        height: 30,
        width: 400,
        alignItems: 'center',
        marginTop: 10,
    },
    texthead: {
        marginTop: 12,
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    heading: {
        fontSize: 15,
        flex: 1
    }
})