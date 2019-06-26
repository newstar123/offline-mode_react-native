import { gql } from 'apollo-boost';


export const GET_SELECTED_EVENT = gql`
    query {
        selectedEvent @client {
            event
        }
    }
`;

export const UPDATE_SELECTED_EVENT = gql`
    mutation updateSelectedEvent($event: Int!) {
        updateSelectedEvent(event: $event) @client
    }
`;


export const EVENT_COUNTS = gql`
    query( $event_id: Int!) {
        notCheckedIn: guestInfo(event_id: $event_id, filters: {guest_checkin: 0}) {
            count
        }
        checkedIn: guestInfo(event_id: $event_id, filters: {guest_checkin: 1}) {
            count
        }
    }
`;


export const GET_ALL_EVENTS = gql`
    query(
        $start: Int!
        $limit: Int!, 
    ) {
        events(start: $start, limit: $limit) {
            event_id
            event_name
            event_appendix
            event_passphrase
            event_type
            event_status
            event_languages
            event_startdate
            event_enddate
            event_starttime
            event_endtime
            event_timezone
            event_registration_start
            event_registration_end
            event_comment
            event_location
            event_location_street
            event_location_zip
            event_location_city
            event_public
            event_series {
                es_id
                event_id
                es_name
                es_key
                es_startdate
                es_enddate
                es_starttime
                es_endtime
                es_ticket_contingent
                es_location
                es_location_street
                es_location_zip
                es_location_city
                es_position
            }
        }
    }
`;

export const GET_ALL_EVENTS_SEARCH = gql`
    query($searchString: String!) {
        events(
            advancedFilter: [
                {
                    field: "event_name",
                    operator: LIKE,
                    value: $searchString
                },
            ]
        ) {
            event_id
            event_name
            event_appendix
            event_passphrase
            event_type
            event_status
            event_languages
            event_startdate
            event_enddate
            event_starttime
            event_endtime
            event_appendix
            event_timezone
            event_registration_start
            event_registration_end
            event_comment
            event_location
            event_location_street
            event_location_zip
            event_location_city
            event_public
            event_series {
                es_id
                event_id
                es_name
                es_key
                es_startdate
                es_enddate
                es_starttime
                es_endtime
                es_ticket_contingent
                es_location
                es_location_street
                es_location_zip
                es_location_city
                es_position
            }
        }
    }
`;

export const GET_ALL_EVENTS_DETAIL = gql`
    query {
        events {
            event_id
            event_name
            event_appendix
            event_folder
            event_type
            event_ticket_contingent
            event_status
            event_languages
            event_manager
            event_startdate
            event_enddate
            event_starttime
            event_endtime
            event_timezone
            event_registration_start
            event_registration_end
            event_comment
            event_location
            event_location_street
            event_location_zip
            event_location_city
            event_companion_number
            event_user_id
            event_public
            event_public_companion_number
            event_public_sender
            event_series {
                es_id
                event_id
                es_name
                es_key
                es_startdate
                es_enddate
                es_starttime
                es_endtime
                es_ticket_contingent
                es_location
                es_location_street
                es_location_zip
                es_location_city
                es_position
            }
            formfields {
                label
                name
                required
                companion
                companionRequired
                type
                    position
                description
                labels {
                    de
                    en
                }
                values {
                    de {
                        language
                        position
                        label
                        value
                    }
                    en {
                        language
                        position
                        label
                        value
                    }
                }
            }
        }
    }
`;

export const GET_EVENT = gql `
    query($event_id: Int!) {
        event(event_id: $event_id) {
            event_id
            event_name
            event_appendix
            event_folder
            event_type
            event_ticket_contingent
            event_status
            event_languages
            event_manager
            event_startdate
            event_enddate
            event_starttime
            event_endtime
            event_timezone
            event_registration_start
            event_registration_end
            event_comment
            event_location
            event_location_street
            event_location_zip
            event_location_city
            event_companion_number
            event_user_id
            event_public
            event_public_companion_number
            event_public_sender
            event_series {
                es_id
                event_id
                es_name
                es_key
                es_startdate
                es_enddate
                es_starttime
                es_endtime
                es_ticket_contingent
                es_location
                es_location_street
                es_location_zip
                es_location_city
                es_position
            }
            formfields {
                label
                name
                required
                companion
                companionRequired
                type
                position
                description
                labels {
                    de
                    en
                }
                values {
                    de {
                        language
                        position
                        label
                        value
                    }
                    en {
                        language
                        position
                        label
                        value
                    }
                }
            }
        }
    }
`;