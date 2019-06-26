import {StyleSheet, Text, View} from "react-native";
import React from "react";
import {pastelShades, strongShades} from "../appStyles/appStyles";
import IconStatus from "../IconStatus/IconStatus";


const listSectionHeader = (props) => (
    <View style={styles.container}>
        <View>
            <Text style={styles.content}>Guest Status: {props.title}</Text>
        </View>
        <View>
            <IconStatus status={props.status} section={true} />
        </View>
    </View>
);


const styles = StyleSheet.create({
    container: {
        height: 31,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 40,
        paddingRight: 40,
        backgroundColor: pastelShades[3],
    },
    content: {
        textTransform: 'capitalize',
        color: strongShades.darkBlue,
    }
});

export default listSectionHeader;