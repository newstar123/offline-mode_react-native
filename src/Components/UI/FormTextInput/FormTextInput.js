import React from 'react';
import {TextInput, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { strongShades, pastelShades } from "../appStyles/appStyles";


const formTextInput = props => {

    return (
        <View style={{flexDirection: 'row', width: '100%'}} >
            <TextInput
                underlineColorAndroid="transparent"
                {...props}
                style={[styles.input, props.style, !props.valid && props.touched ? styles.invalid : null]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        flex: 1,
        height: 45,
        borderWidth: 0,
        borderColor: 'white',
        backgroundColor: 'white',
        paddingLeft: 12,
        paddingTop: 15,
        paddingRight: 12,
        paddingBottom: 15,
    },
    invalid: {
        backgroundColor: '#f9c0c0',
        borderColor: 'red'
    }
});

export default formTextInput;

