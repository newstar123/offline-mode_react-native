import React from 'react';
import {TextInput, View, Text, StyleSheet, TouchableOpacity, Dimensions} from "react-native";
import { strongShades, pastelShades } from "../appStyles/appStyles";


const formLabel = props => {

    return (
        <View style={styles.container} >
            <Text style={styles.text}>
                {props.children}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        height: 20,
        marginBottom: 4,
        display: 'flex',
    },
    text: {
        marginLeft: -4,
        fontWeight: '700',
        alignSelf: 'flex-end',
        fontSize: (Dimensions.get('window').width < 768 ? 14 : 18),
        color: pastelShades[1],
    },
});

export default formLabel;