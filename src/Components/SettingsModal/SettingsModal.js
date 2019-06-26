import React from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Modal,
    StyleSheet,
    Dimensions
} from 'react-native';
import {pastelShades, strongShades} from "../UI/appStyles/appStyles";

import { fontFamily, fontWeight } from "../../Theme";


const settingsModal = (props) => {

    const getInformation = () => {
        switch (props.informationOption) {
            case 'offline-synchronization':
                return (
                    <ScrollView>
                        <Text style={styles.contentH1}>{'Offline Synchronization'.toUpperCase()}</Text>
                        <Text style={styles.contentText}>
                            When this option is activated, your app is able to connect
                            with multiple devices in order to synchronize check-in data.
                        </Text>

                        <Text style={styles.contentLabel}>{'When should I use this?'.toUpperCase()}</Text>
                        <Text style={styles.contentText}>
                            This function can be helpful if you’re using several devices
                            for checking in your guests and the internet connexion is not reliable.
                        </Text>

                        <Text style={styles.contentLabel}>{'How does it work?'.toUpperCase()}</Text>
                        <Text style={styles.contentText}>
                            The app browses the network you’re connected with to find
                            other devices on which the eyevip app is also installed.
                        </Text>
                        <Text style={styles.contentText}>
                            When a device has been found, the app will ask you if you
                            want to connect with the other device. If you accept,
                            the app will send an invitation to it. Once the invitation
                            has been accepted, you will be connected.
                        </Text>
                    </ScrollView>
                );
            default:
                return null;
        }
    };

    const content  = getInformation();
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.visible}
            onRequestClose={ _=> {} }
        >
            <TouchableOpacity
                style={styles.modalContainer}
                activeOpacity={1}
                onPressOut={props.closeMenu}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.modalContentContainer}>
                        {content}
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    )
};

const styles = StyleSheet.create({
    modalContainer: {
        width: '100%',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContentContainer: {
        width: (Dimensions.get('window').width < 768 ? '90%' : 400),
        paddingLeft: 15,
        paddingTop: 15,
        paddingRight: 15,
        paddingBottom: 15,
        borderRadius: 4,
        backgroundColor: 'white',
    },
    modalContent: {
        width: '100%',
    },
    modalH1: {
        fontFamily: fontFamily.OpenSans,
        fontSize: 22,
        color: pastelShades[0],
        fontWeight: fontWeight.Normal,
        marginBottom: 15,
    },
    modalLabel: {
        fontFamily: fontFamily.OpenSans,
        fontSize: 14,
        fontWeight: '600',
        //textTransform: 'uppercase',
        color: pastelShades[1],
        marginTop: 16,
        marginBottom: 0,
    },
    modalText: {
        fontSize: 16,
        color: pastelShades[0],
        marginTop: 8,
        marginBottom: 0,
    },
    contentH1: {
        fontFamily: fontFamily.OpenSans,
        fontSize: 20,
        color: strongShades.darkBlue,
        paddingBottom: 30,
    },
    contentLabel: {
        paddingTop: 28,
        fontFamily: fontFamily.OpenSans,
        fontSize: 16,
        fontWeight: 'bold',
        color: strongShades.darkBlue,
    },
    contentText: {
        lineHeight: 30,
        fontFamily: fontFamily.OpenSans,
        fontSize: 16,
        color: strongShades.darkBlue,
    },
});

export default settingsModal;