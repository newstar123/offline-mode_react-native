import React from "react";
import {StyleSheet, Text, TouchableOpacity, View, Dimensions} from "react-native";
import {pastelShades, strongShades} from "../UI/appStyles/appStyles";
import Icon from "react-native-vector-icons/FontAwesome5";


const bottomNavigation = (props) => {

    let activeGuestlist = styles.active;
    let activeQRCode = styles.active;
    let activeStatistics = styles.active;
    let iconSize = (Dimensions.get('window').width < 768 ? 20 : 29);

    let guestListLink = (
        <View style={styles.linkContent}>
            <Icon name={'users'} size={iconSize} color={'white'} />
            <Text style={styles.link}>Guestlist</Text>
        </View>
    );
    if (props.guestlistHandler) {
        activeGuestlist =  null;
        guestListLink = (
            <TouchableOpacity onPress={props.guestlistHandler} style={styles.linkContent}>
                <Icon name={'users'} size={iconSize} color={'white'} />
                <Text style={styles.link}>Guestlist</Text>
            </TouchableOpacity>
        );
    }

    let qrCodeLink = (
        <View style={styles.linkContent}>
            <Icon name={'qrcode'} size={iconSize} color={'white'} />
            <Text style={styles.link}>Scan</Text>
        </View>
    );
    if (props.qrCodeHandler) {
        activeQRCode = null;
        qrCodeLink = (
            <TouchableOpacity onPress={props.qrCodeHandler} style={styles.linkContent}>
                <Icon name={'qrcode'} size={iconSize} color={'white'} />
                <Text style={styles.link}>Scan</Text>
            </TouchableOpacity>
        );
    }

    let statisticsLink = (
        <View style={styles.linkContent}>
            <Icon name={'chart-area'} size={iconSize} color={'white'} />
            <Text style={styles.link}>Statistics</Text>
        </View>
    );
    if (props.statisticsHandler) {
        activeStatistics = null;
        statisticsLink = (
            <TouchableOpacity onPress={props.statisticsHandler} style={styles.linkContent}>
                <Icon name={'chart-area'} size={iconSize} color={'white'} />
                <Text style={styles.link}>Statistics</Text>
            </TouchableOpacity>
        );
    }


    return (
        <View style={styles.container}>
            <View style={[styles.linkContainer, activeGuestlist]}>
                {guestListLink}
            </View>
            <View style={[styles.linkContainer, activeQRCode]}>
                {qrCodeLink}
            </View>
            <View style={[styles.linkContainer, activeStatistics]}>
                {statisticsLink}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: (Dimensions.get('window').width < 768 ? 50 : 80),
        backgroundColor: strongShades.darkBlue,
        zIndex: 10000,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    linkContainer: {
        width: '33.3%',
        height: '100%',
        paddingTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    linkContent: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    link: {
        fontSize: (Dimensions.get('window').width < 768 ? 12 : 14),
        color: 'white',
        marginTop: 0
    },
    active: {
        backgroundColor: pastelShades[0],
    },
});

export default bottomNavigation;