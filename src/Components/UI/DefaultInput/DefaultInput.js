import React from 'react';
import {TextInput, View, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { strongShades, pastelShades } from "../appStyles/appStyles";


const defaultInput = props => {

    let icon = null;
    if (props.iconName) {
        icon = (
            <View style={styles.inputIcon}>
                <Icon size={16} style={styles.iconURL} name={props.iconName} />
            </View>
        );
    }
    return (
            <View style={{flexDirection: 'row', width: '100%'}} >
                {icon}
                <TextInput
                    underlineColorAndroid="transparent"
                    {...props}
                    style={[styles.input, props.style, !props.valid && props.touched ? styles.invalid : null]}
                />
            </View>
        )
};

const styles = StyleSheet.create({
    input: {
        width: '93%',
        height: 45,
        borderWidth: 0,
        borderColor: pastelShades[5],
        backgroundColor: pastelShades[5],
        paddingLeft: 12,
        paddingTop: 15,
        paddingRight: 12,
        paddingBottom: 15,
        marginTop: 5,
        marginBottom: 5,
    },
    inputIcon: {
        flex: 1,
        width: '8%',
        height: 45,
        backgroundColor: pastelShades[5],
        color: pastelShades[1],
        paddingLeft: 0,
        paddingTop: 15,
        paddingRight: 0,
        paddingBottom: 15,
        marginTop: 5,
        marginBottom: 5,
    },
    iconURL: {
        textAlign: 'right',
        color: pastelShades[1],
        backgroundColor: 'transparent',
    },
    invalid: {
        backgroundColor: '#f9c0c0',
        borderColor: 'red'
    }
});

export default defaultInput;