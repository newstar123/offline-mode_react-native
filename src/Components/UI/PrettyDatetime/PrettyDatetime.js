import React from 'react';
import {Text, View, StyleSheet, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { strongShades, pastelShades } from "../appStyles/appStyles";


const prettyDatetime = props => {

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const nth = (day) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1:  return "st";
            case 2:  return "nd";
            case 3:  return "rd";
            default: return "th";
        }
    };

    let datetime = null;
    if (props.datetime) {
        const dt = new Date(props.datetime.slice(0, 4), props.datetime.slice(4, 6) - 1, props.datetime.slice(6, 8),
            props.datetime.slice(8, 10), props.datetime.slice(10, 12), props.datetime.slice(12, 14));
        datetime = monthNames[dt.getMonth()] + " " + dt.getDate() + nth(dt.getDate()) + " \u2022 " + ("0" + dt.getHours()).slice(-2) + ":" + ("0" + dt.getMinutes()).slice(-2);
    }

    let prettyDatetime = null;
    if (datetime) {
        prettyDatetime = (
            <View style={[styles.container, props.styles]}>
                <Text style={[styles.text, props.textStyles]}>{datetime}</Text>
            </View>
        );
    }

    return (
        <>
            {prettyDatetime}
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        marginRight: 30,
    },
    text: {
        color:pastelShades[1],
    }
});

export default prettyDatetime;