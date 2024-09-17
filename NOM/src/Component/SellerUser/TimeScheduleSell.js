import React, { useState } from 'react';
import {
    View,
    Text,
    Switch,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const TimeScheduleSell = () => {
    const [timeData, setTimeData] = useState([
        { day: 'Thứ 2', startTime: '12:30', endTime: '15:30', is24h: false, isActive: true },
        { day: 'Thứ 3', startTime: '12:30', endTime: '15:30', is24h: false, isActive: true },
        { day: 'Thứ 4', startTime: '12:30', endTime: '15:30', is24h: false, isActive: true },
        { day: 'Thứ 5', startTime: '12:30', endTime: '15:30', is24h: false, isActive: true },
    ]);

    const toggleSwitch = (index) => {
        const newData = [...timeData];
        newData[index].isActive = !newData[index].isActive;
        setTimeData(newData);
    };

    const handleAddTime = (index) => {
        console.log('Add time slot for:', timeData[index].day);
    };

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <AntDesign name="arrowleft" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Thời gian bán</Text>
            </View>

            <ScrollView style={styles.container}>
                {/* Time Schedule Form */}
                <Text style={styles.sectionTitle}>Ngày áp dụng</Text>
                {timeData.map((item, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.dayText}>{item.day}</Text>
                            <Switch
                                value={item.isActive}
                                onValueChange={() => toggleSwitch(index)}
                                thumbColor={item.isActive ? '#E53935' : '#f4f3f4'}
                                trackColor={{ false: '#767577', true: '#E53935' }}
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={styles.checkboxRow}>
                                <TextInput
                                    style={styles.checkbox}
                                    value={item.is24h ? '24h' : ''}
                                    editable={false}
                                />
                                <Text style={styles.checkboxLabel}>24h</Text>
                            </View>
                            <View style={styles.timeRow}>
                                <TextInput
                                    style={styles.timeInput}
                                    value={item.startTime}
                                    onChangeText={(value) => {
                                        const newData = [...timeData];
                                        newData[index].startTime = value;
                                        setTimeData(newData);
                                    }}
                                />
                                <Text style={styles.timeLabel}>Giờ bán</Text>
                            </View>
                            <View style={styles.timeRow}>
                                <TextInput
                                    style={styles.timeInput}
                                    value={item.endTime}
                                    onChangeText={(value) => {
                                        const newData = [...timeData];
                                        newData[index].endTime = value;
                                        setTimeData(newData);
                                    }}
                                />
                                <Text style={styles.timeLabel}>Giờ nghỉ</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.addTimeButton} onPress={() => handleAddTime(index)}>
                            <AntDesign name="plus" size={20} color="#E53935" />
                            <Text style={styles.addTimeText}>Thêm giờ</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Lưu</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: width * 0.05,
        marginTop: 40
    },
    header: {
        backgroundColor: '#E53935',
        height: height * 0.13,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%', // Đảm bảo header full width màn hình
        position: 'absolute', // Đặt header cố định trên cùng
        top: 0, // Đảm bảo nó ở trên cùng của màn hình
        zIndex: 1000, // Đảm bảo header luôn trên cùng các phần tử khác
    },
    backButton: {
        marginRight: 10,
    },
    headerText: {
        color: '#fff',
        fontSize: 18, // Tăng kích thước chữ cho header giống mẫu
        fontWeight: 'bold',
    },
    sectionTitle: {
        marginTop: 80, // Đặt khoảng cách với header
        fontSize: 18,
        color: '#E53935',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        minHeight: height * 0.15,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 25,
        height: 25,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginRight: 5,
    },
    checkboxLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    timeInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        width: width * 0.3,
        textAlign: 'center',
    },
    timeLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    addTimeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    addTimeText: {
        color: '#E53935',
        marginLeft: 5,
    },
    saveButton: {
        backgroundColor: '#E53935',
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
        height: height * 0.08,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default TimeScheduleSell;
