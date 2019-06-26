import {pastelShades, strongShades} from "../UI/appStyles/appStyles";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import React from "react";
import {Query, withApollo} from "react-apollo";
import {EVENT_COUNTS} from "../../apollo/queries/events";
import { fontFamily} from "../../Theme";


const eventProgressBar = (props) => {


    const getGuestsData = (event_id) => {
        return (
            <Query
                query={EVENT_COUNTS}
                fetchPolicy={'network-only'}
                pollInterval={5000}
                variables={{ event_id: event_id }}
            >
                {({ loading, error, data }) => {

                    if (loading) return <Text>Loading...</Text>;
                    if (error) return <Text>Error... :(</Text>;

                    if (data.checkedIn && data.notCheckedIn) {

                        const totalCheckedIn = data.checkedIn.count;
                        const totalNotCheckedIn = data.notCheckedIn.count;
                        const totalGuests = totalCheckedIn + totalNotCheckedIn;

                        const totalProcessed = Math.round((totalCheckedIn*100)/totalGuests);
                        const progressBarPercent = (totalCheckedIn > 0 && totalProcessed < 2) ? '2%' : totalProcessed + '%';

                        return (
                            <>
                                <View style={styles.eventProgressContent}>
                                    <Text style={styles.eventProgress}>Check-in progress: {totalCheckedIn} / {totalGuests}</Text>
                                </View>
                                <View style={[styles.eventProgressBar, {width: progressBarPercent}]}/>
                            </>
                        );
                    }

                    return null;
                }}
            </Query>
        );
    };

    const checkinProgress = getGuestsData(parseInt(props.eventId));

    return (
        <View style={styles.eventProgressContainer}>
            {checkinProgress}
        </View>
    );
};

const styles = StyleSheet.create({
    eventProgressContainer: {
        width: '100%',
        height: 30,
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: pastelShades[4],
        fontFamily: fontFamily.OpenSans,
        fontSize: 14,
        color: strongShades.darkBlue,
    },
    eventProgressContent: {
        width: '100%',
        height: 28,
        zIndex: 1000,
        justifyContent: 'center',
    },
    eventProgress: {
        fontFamily: fontFamily.OpenSans,
        fontSize: 14,
        color: strongShades.darkBlue,
        paddingLeft: (Dimensions.get('window').width < 768 ? 10 : 40),
    },
    eventProgressBar: {
        height: 28,
        backgroundColor: pastelShades[7],
        zIndex: 10,
        position: 'absolute'
    }
});

export default withApollo(eventProgressBar);