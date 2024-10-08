import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useAuth } from "../authContext";

class Nurse {
  constructor(id, firstname, lastname) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.selected = false;
  }
}

export default function Upload() {
  const { user } = useAuth();
  const [nurseData, setNurseData] = useState([]);
  const [nurseViews, setNurseViews] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedShift, setSelectedShift] = useState('');
  const [peopleAmount, setPeopleAmount] = useState(0); // State to keep track of selected nurses

  useEffect(() => {
    fetchNurseData();
  }, []);

  const fetchNurseData = async () => {
    try {
      const response = await fetch("http://10.0.2.2:2000/se/nurse");
      const data = await response.json();
      const nurses = data.map(nurse => new Nurse(nurse.nurseID, nurse.firstname, nurse.lastname));
      setNurseData(nurses);
    } catch (error) {
      console.error("Error fetching nurse data:", error);
    }
  };

  const toggleSelectNurse = (index) => {
    const updatedNurseData = [...nurseData];
    updatedNurseData[index].selected = !updatedNurseData[index].selected;
    setNurseData(updatedNurseData);

    const selectedNurses = updatedNurseData.filter(nurse => nurse.selected);
    setPeopleAmount(selectedNurses.length);
  };

  useEffect(() => {
    const mappedViews = nurseData.map((nurse, index) => (
      <TouchableOpacity key={index} onPress={() => toggleSelectNurse(index)} style={styles.nurseItem}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>{nurse.firstname} {nurse.lastname}</Text>
          <View style={[styles.checkbox, { backgroundColor: nurse.selected ? 'black' : 'transparent' }]}>
            {nurse.selected && <Text style={{ color: 'white' }}>✓</Text>}
          </View>
        </View>
      </TouchableOpacity>
    ));
    setNurseViews(mappedViews);
  }, [nurseData]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const selectShift = (shift) => {
    setSelectedShift(shift);
  };

  const submitForm = async () => {
    try {
      if (peopleAmount === 0 || selectedShift === '') {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
      }
  
      const selectedNurses = nurseData.filter(nurse => nurse.selected);
      const requestData = {
        date: selectedDate,
        shift: selectedShift,
        people_amount: peopleAmount,
      };
  
      const scheduleResponse = await fetch("http://10.0.2.2:2000/se/schedule/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      const scheduleData = await scheduleResponse.json();
      const { scheduleID } = scheduleData;
  
      for (const nurse of selectedNurses) {
        const assignData = {
          nurseID: nurse.id,
          scheduleID: scheduleID,
        };
  
        await fetch("http://10.0.2.2:2000/se/assign/store", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(assignData),
        });
      }
  
      setSelectedDate(new Date());
      setSelectedShift('');
      setPeopleAmount(0);
      const updatedNurseData = nurseData.map(nurse => ({ ...nurse, selected: false }));
      setNurseData(updatedNurseData);
  
      alert("ข้อมูลเข้าสู่ระบบเรียบร้อย");
      console.log("Data inserted successfully.");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }
  

  return (
    <View style={{ padding: 30 }}>
      <Text style={{ fontSize: 20 }}>วันที่เข้าเวร</Text>
      {Platform.OS === 'android' && (
        <TouchableOpacity onPress={showDatePicker}>
          <Text style={styles.datePickerText}>
            {selectedDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      )}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={selectedDate}
        minimumDate={new Date()} 
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Text style={{ marginBottom: 10, fontSize: 20 }}>รายชื่อพยาบาล</Text>
      {nurseViews}
      <View style={styles.shiftButtons}>
        <TouchableOpacity onPress={() => selectShift('เช้า')} style={[styles.shiftButton, selectedShift === 'เช้า' && styles.selectedShift]}>
          <Text>เช้า</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => selectShift('บ่าย')} style={[styles.shiftButton, selectedShift === 'บ่าย' && styles.selectedShift]}>
          <Text>บ่าย</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => selectShift('ดึก')} style={[styles.shiftButton, selectedShift === 'ดึก' && styles.selectedShift]}>
          <Text>ดึก</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ marginTop: 10 }}>จำนวนคนที่เลือก: {peopleAmount}</Text>
      <TouchableOpacity onPress={submitForm} style={styles.submitButton}>
        <Text style={{ color: 'white' }}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  nurseItem: {
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  shiftButtons: {
    flexDirection: 'row',
    marginTop: 5,
  },
  shiftButton: {
    backgroundColor: '#DDDDDD',
    padding: 5,
    marginRight: 5,
  },
  selectedShift: {
    backgroundColor: 'grey',
  },
  datePickerText: {
    fontSize: 18,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: 'black',
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 5,
  },
});
