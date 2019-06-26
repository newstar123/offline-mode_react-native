import React from 'react';
import {TextInput, View, Text, StyleSheet, TouchableOpacity, Picker } from "react-native";
import { strongShades, pastelShades } from "../appStyles/appStyles";
import Icon from "react-native-vector-icons/FontAwesome5";
import RNPickerSelect from "react-native-picker-select";


const formPicker = props => {

    return (
        <View style={{flexDirection: 'row', marginBottom: 25,}} >
            <View style={{flex: 1,}} >
                <RNPickerSelect
                    placeholder={props.placeholder}
                    items={props.items}
                    onValueChange={props.formikProps.handleChange(props.formikKey)}
                    style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                            top: 17,
                            right: 17,
                        },
                    }}
                    value={props.formikProps.values[props.formikKey]}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{ underlineColor: 'yellow' }}
                    Icon={() => {
                        return <Icon name="angle-down" size={16} color={"black"} />;
                    }}
                />
            </View>
        </View>
    );
};

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        backgroundColor: 'white',
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        backgroundColor: 'white',
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'gray',
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});

export default formPicker;

