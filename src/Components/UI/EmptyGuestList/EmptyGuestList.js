import React from "react";
import { Dimensions, StyleSheet, Text, View, Image } from "react-native";
import { pastelShades } from "../appStyles/appStyles";

const emptyGuestList = (props) => {

    let descriptionText = null;

    if (props.listType === "checkedin") {
        descriptionText = (
            <>
                <Text style={styles.h1}>It looks like you don't have any checked-in guests yet.</Text>
            </>
        );
    } else {
        descriptionText = (
            <>
                <Text style={styles.h1}>It looks like you don't have any guest on your guestlist yet.</Text>
                <Text style={styles.h2}>Add guests to this event to be able to begin the check-in.</Text>
            </>
        );
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../../images/guestlist_empty_state.png')}
            />
            {descriptionText}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        marginTop: 45,
        backgroundColor: pastelShades[5],
        alignItems: 'center',
    },
    h1: {
        width: (Dimensions.get('window').width < 768 ? 375 : 420),
        textAlign: 'center',
        fontSize: 22,
        color: pastelShades[1],
        marginTop: 40,
    },
    h2: {
        width: (Dimensions.get('window').width < 768 ? 375 : 420),
        textAlign: 'center',
        fontSize: 16,
        color: pastelShades[1],
        marginTop: 20,
    },
});

export default emptyGuestList;