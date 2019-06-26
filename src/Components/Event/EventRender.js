import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {pastelShades, strongShades} from "../UI/appStyles/appStyles";
import EventProgressBar from '../../Components/EventProgressBar/EventProgressBar';

import { fontFamily, fontWeight } from '../../Theme';
import moment from "moment-timezone";




const eventRender = (props) => {
    const isPastEvent = moment(props.event_startdate + 'T' + props.event_starttime) < Date.now();

    return (
        <TouchableOpacity activeOpacity={0.7} style={styles.container} onPress={() => { props.keyPressHandler(props.event_id, props.event_name); }} >
            <View style={styles.eventDataContainer}>

                <View style={styles.eventName}>
                    <Text style={styles.eventH1}>{props.eventName}</Text>
                    <Text style={styles.eventIsOver}>{isPastEvent ? 'Event is over' : null}</Text>
                </View>

                <View style={styles.eventNotes}>
                    <Text style={styles.eventNotesText}>{props.eventSeries}</Text>
                </View>

                <View style={styles.eventDataContent}>
                    <View style={styles.eventDate}>
                        <Icon type="FontAwesome5" name="calendar" size={16} color={strongShades.darkBlue} style={{marginRight: 5}} solid />
                        <Text style={{ color: strongShades.darkBlue }}>
                            {props.event_startdate_formated }
                        </Text>
                    </View>

                    <View style={styles.eventTime}>
                        <Icon name="clock" size={16} color={strongShades.darkBlue} style={{marginRight: 5}} solid />
                        <Text style={{ color: strongShades.darkBlue }}>
                            {props.event_starttime_formated}
                        </Text>
                    </View>

                    <View style={styles.eventLocation}>
                        {props.eventLocation}
                    </View>
                </View>

            </View>
            <EventProgressBar eventId={props.progressBarEventId} />
        </TouchableOpacity>
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: (Dimensions.get('window').width < 768 ? 10 : 20),
        borderBottomWidth: 1,
        borderBottomColor: '#c0c0c8',
        borderRadius: 2,
        backgroundColor: '#FFF',
        marginBottom: 11,
        marginRight: (Dimensions.get('window').width < 768 ? 10 : 40),
        marginLeft: (Dimensions.get('window').width < 768 ? 10 : 40),
    },
    eventDataContainer: {
        width: '100%',
        paddingLeft: (Dimensions.get('window').width < 768 ? 10 : 20),
        paddingRight: (Dimensions.get('window').width < 768 ? 10 : 20),

    },
    eventH1: {
        fontFamily: fontFamily.OpenSans,
        fontSize: (Dimensions.get('window').width < 768 ? 18 : 22),
        color: strongShades.darkBlue,
        fontWeight: fontWeight.Normal,
        alignItems: 'center'
    },
    eventName: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    eventNotes: {
        width: '100%',
        height: (Dimensions.get('window').width < 768 ? 36 : 40),
        paddingTop: (Dimensions.get('window').width < 768 ? 2 : 2),
        alignItems: 'flex-start',
    },
    eventNotesText: {
        fontFamily: fontFamily.OpenSans,
        color: pastelShades[1],
        fontSize: (Dimensions.get('window').width < 768 ? 14 : 18),
        fontStyle: 'italic',
        fontWeight: fontWeight.Normal
    },
    eventDataContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingBottom: (Dimensions.get('window').width < 768 ? 15 : 20),
    },
    eventDate: {
        flex: (Dimensions.get('window').width < 768 ? 0 : 0.25),
        fontFamily: fontFamily.OpenSans,
        flexDirection: 'row',
        fontSize: (Dimensions.get('window').width < 768 ? 12 : 24),
        color: strongShades.darkBlue,
        fontWeight: fontWeight.SemiBold,
        marginRight: 20,
        alignItems: 'center'
    },
    eventTime: {
        flex: (Dimensions.get('window').width < 768 ? 0 : 0.25),
        fontFamily: fontFamily.OpenSans,
        flexDirection: 'row',
        fontSize: (Dimensions.get('window').width < 768 ? 12 : 16),
        color: strongShades.darkBlue,
        fontWeight: fontWeight.SemiBold,
        marginRight: 20,
        alignItems: 'center'
    },
    eventLocation: {
        flex: 1,
        flexDirection: 'row',
        fontFamily: fontFamily.OpenSans,
        fontSize: (Dimensions.get('window').width < 768 ? 12 : 16),
        color: strongShades.darkBlue,
        fontWeight: fontWeight.SemiBold,
        alignItems: 'center'
    },
    eventStatus: {
        fontFamily: fontFamily.OpenSans,
        fontSize: (Dimensions.get('window').width < 768 ? 12 : 16),
        color: strongShades.darkBlue,
        fontWeight: fontWeight.SemiBold
    },
    eventIsOver: {
        color: pastelShades[1],
        fontFamily: fontFamily.OpenSans,
        fontStyle: 'italic',
        fontSize: (Dimensions.get('window').width < 768 ? 12 : 16),
        marginLeft: 10,
    }
});



export default eventRender;