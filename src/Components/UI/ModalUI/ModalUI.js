import React  from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {pastelShades, strongShades} from "../appStyles/appStyles";

import glyphMap from 'react-native-vector-icons/glyphmaps/FontAwesome5Free.json';
import createIconSet from "react-native-vector-icons/lib/create-icon-set";
const IconRegular = createIconSet(glyphMap, 'FontAwesome', 'FontAwesome.ttf');


export const ModalH1 = props => (
    <Text {...props} style={[styles.modalH1, props.style]} >
        {props.children}
    </Text>
);

export const ModalH2 = props => (
    <Text {...props} style={[styles.modalH2, props.style]} >
        {props.children}
    </Text>
);

export const ModalH3 = props => (
    <Text {...props} style={[styles.modalH3, props.style]} >
        {props.children}
    </Text>
);

export const ModalLabel = props => (
    <Text {...props} style={[styles.modalLabel, props.style]} >
        {props.children}
    </Text>
);

export const ModalText = props => (
    <Text {...props} style={[styles.modalText, props.style]} >
        {props.children}
    </Text>
);

export const ModalControls = props => (
    <View {...props} style={[styles.modalControls, props.style]}>
        {props.children}
    </View>
);

export const ModalHeader = props => {
    let iconName = null;
    let headerStyle = null;
    let headerTextStyle = null;

    switch (props.type) {
        case 'success':
            iconName = 'smile';
            headerStyle = {
                backgroundColor: pastelShades[8],
            };
            headerTextStyle = {
                color: strongShades.mint,
            };
            break;
        case 'warning':
            iconName = 'exclamation-circle';
            headerStyle = {
                backgroundColor: pastelShades[11],
            };
            headerTextStyle = {
                color: strongShades.chickYellow,
            };
            break;
        case 'error':
            iconName = 'exclamation-circle';
            headerStyle = {
                backgroundColor: pastelShades[9],
            };
            headerTextStyle = {
                color: strongShades.slamon,
            };
            break;
    }
    return (
        <View style={[styles.modalHeader, headerStyle]}>
            <IconRegular name={iconName} size={50} color={headerTextStyle.color} />
            <Text style={[styles.modalHeaderText, headerTextStyle]}>
                {props.children}
            </Text>
        </View>
    )
};

export const ModalControlButton = props => {

    let borderStyle = null;
    if (props.positionLeft) {
        borderStyle = styles.modelBorderLeft;
    } else if(props.positionRight) {
        borderStyle = styles.modelBorderRight;
    }

    return (
        <TouchableOpacity activeOpacity={0.7} onPress={props.onPressHandler} style={[styles.modelControl, borderStyle, {backgroundColor: props.bgColor}, props.style]}>
            <Text style={[styles.modelControlText, {color: props.textColor}]}>
                {props.children}
            </Text>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    modalH1: {
        fontSize: 22,
        color: pastelShades[0],
        marginBottom: 15,
    },
    modalH2: {
        fontSize: 16,
        color: pastelShades[0],
        marginBottom: 10,
    },
    modalH3: {
        fontSize: 14,
        color: pastelShades[0],
        marginBottom: 15,
    },
    modalLabel: {
        fontSize: 14,
        fontWeight: '600',
        //textTransform: 'uppercase',
        color: pastelShades[1],
        marginTop: 10,
        marginBottom: 4,
    },
    modalText: {
        fontSize: 16,
        color: pastelShades[0],
        marginTop: 8,
        marginBottom: 0,
    },
    modalControls: {
        width: '100%',
        height: 46,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        backgroundColor: 'white'
    },
    modelControl: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modelControlText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    modelBorderLeft: {
        borderBottomLeftRadius: 4,
    },
    modelBorderRight: {
        borderBottomRightRadius: 4,
    },
    modalHeader: {
        width: '100%',
        height: (Dimensions.get('window').height >= 2048 ? 105 : 80),
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 30,
        paddingRight: 30,
    },
    modalHeaderText: {
        fontSize: 22,
        paddingLeft: 20,
    },
});