import React from 'react';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { graphql, compose } from 'react-apollo';
import { UPDATE_SELECTED_EVENT } from '../../apollo/queries/events';
import {strongShades} from "../UI/appStyles/appStyles";
import EventRender from "./EventRender";




const eventSeries = (props) => {

    const processEventData = (event) => {

        // Format date
        const eventDate = new Date(event.es_startdate);
        const year = eventDate.getFullYear();
        const month = (1 + eventDate.getMonth()).toString().padStart(2, '0');
        const day = eventDate.getDate().toString().padStart(2, '0');
        event.event_startdate_formated = day + '.' + month + '.' + year;

        // Format Time
        const eventTime = event.es_starttime.split(':');
        event.event_starttime_formated = eventTime[0] + ':' + eventTime[1];


        return event;
    };


    let event = props.eventData;

    const event_series = props.eventData.event_series.filter(event => {
        return (event.es_id === props.event_series_id);
    });


    event.event_serie = processEventData(event_series[0]);


    let eventLocation = null;
    let location = null;
    if (event.event_serie.es_location.length > 0 || event.event_serie.es_location_city.length > 0) {

        location = (event.event_serie.es_location.length > 0)
            ? ((event.event_serie.es_location_city.length > 0)
                ? event.event_serie.es_location + ', ' + event.event_serie.es_location_city : event.event_serie.es_location)
            : event.event_serie.es_location_city;

        eventLocation = (
            <>
                <Icon name="map-marker" size={16} color={strongShades.darkBlue} style={{marginRight: 5}} solid />
                <Text style={{ color: strongShades.darkBlue }}>
                    {location}
                </Text>
            </>
        );

    }

    let eventName = event.event_serie.es_name;
    let eventSeries = `Event series: ${event.event_name}`;

    return (
        <EventRender
            keyPressHandler={props.keyPressHandler}
            event_id={event.event_id}
            event_name={event.event_serie.es_name}
            eventName={eventName}
            eventSeries={eventSeries}
            event_startdate={event.event_startdate}
            event_starttime={event.event_starttime}
            event_startdate_formated={event.event_serie.event_startdate_formated}
            event_starttime_formated={event.event_serie.event_starttime_formated}
            eventLocation={eventLocation}
            progressBarEventId={event.event_id}
        />
    );
};


export default compose(
    graphql(UPDATE_SELECTED_EVENT, { name: 'updateSelectedEvent'} )
)(eventSeries)

