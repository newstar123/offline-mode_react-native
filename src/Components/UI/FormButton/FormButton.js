import React from 'react';
import {TextInput, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { strongShades, pastelShades } from "../appStyles/appStyles";

const formLabel = props => {

    return (
            <View style={[styles.button, props.style]} >
                <TouchableOpacity>
                    {props.children}
                </TouchableOpacity>
            </View>
    );
};

const styles = StyleSheet.create({
    button: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        backgroundColor: pastelShades[1],
    },
});

export default formLabel;

