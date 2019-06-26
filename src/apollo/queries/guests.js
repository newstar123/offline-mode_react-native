import { gql } from 'apollo-boost';

export const CHECKIN_GUEST = gql`
    mutation updateGuest($guest_id: Int!, $guest_checkin_time: String!, $guest_status: String!) {
        updateGuest(input: {
            guest_id: $guest_id,
            guest_checkin_time: $guest_checkin_time,
            guest_status: $guest_status
            guest_checkin: 1,
        }) {
            guest_id
        } 
    }
`;

export const UNDO_CHECKIN_GUEST = gql`
    mutation updateGuest($guest_id: Int!, $guest_status: String!) {
        updateGuest(input: {
            guest_id: $guest_id,
            guest_status: $guest_status
            guest_checkin: 0,
        }) {
            guest_id
        } 
    }
`;

export const CREATE_GUEST = gql`
    mutation createGuest(
            $event_id: Int!, 
            $guest_firstname: String!, 
            $guest_lastname: String!, 
            $guest_title: String, 
            $guest_behalf_firstname: String,
            $guest_behalf_lastname: String,
            $guest_email: String, 
            $guest_company: String, 
            $guest_language: String, 
            $guest_comment: String,
            $guest_checkin: Int,
            $guest_checkin_time: String,
            $guest_status: String,
            $guest_created: String
        ){
        createGuest(input: {
            event_id: $event_id,
            guest_firstname: $guest_firstname,
            guest_lastname: $guest_lastname,
            guest_title: $guest_title,
            guest_behalf_firstname: $guest_behalf_firstname,
            guest_behalf_lastname: $guest_behalf_lastname,
            guest_email: $guest_email,
            guest_company: $guest_company,
            guest_language: $guest_language,
            guest_comment: $guest_comment,
            guest_checkin: $guest_checkin,
            guest_checkin_time: $guest_checkin_time,
            guest_status: $guest_status,
            guest_created: $guest_created
        }) {
            guest_id
        } 
    }
`;

export const CREATE_GUEST_COMPANION = gql`
    mutation createGuest(
            $guest_parent_id: Int!,
            $event_id: Int!, 
            $guest_firstname: String!, 
            $guest_lastname: String!,
            $guest_company: String, 
            $guest_language: String, 
            $guest_checkin: Int,
            $guest_checkin_time: String,
            $guest_status: String,
            $guest_created: String
        ){
        createGuest(input: {
            guest_parent_id: $guest_parent_id,
            event_id: $event_id,
            guest_firstname: $guest_firstname,
            guest_lastname: $guest_lastname,
            guest_company: $guest_company,
            guest_language: $guest_language,
            guest_checkin: $guest_checkin,
            guest_checkin_time: $guest_checkin_time,
            guest_status: $guest_status,
            guest_created: $guest_created
        }) {
            guest_id
        } 
    }
`;

export const UPDATE_GUEST = gql`
    mutation updateGuest(
            $event_id: Int!, 
            $guest_id: Int!, 
            $guest_title: String, 
            $guest_firstname: String!, 
            $guest_lastname: String!, 
            $guest_email: String, 
            $guest_company: String, 
            $guest_language: String, 
            $guest_comment: String,
        ){
        updateGuest(input: {
            event_id: $event_id,
            guest_id: $guest_id,
            guest_title: $guest_title,
            guest_firstname: $guest_firstname,
            guest_lastname: $guest_lastname,
            guest_email: $guest_email,
            guest_company: $guest_company,
            guest_language: $guest_language,
            guest_comment: $guest_comment
        }) {
            guest_id
        } 
    }
`;

export const REPLACE_GUEST_DECLINE = gql`
    mutation updateGuest(
            $guest_id: Int!, 
            $guest_behalf_firstname: String!, 
            $guest_behalf_lastname: String!, 
            $guest_status: String!
        ){
        updateGuest(input: {
            guest_id: $guest_id,
            guest_behalf_firstname: $guest_behalf_firstname,
            guest_behalf_lastname: $guest_behalf_lastname,
            guest_status: $guest_status
        }) {
            guest_id
        } 
    }
`;


export const EVENT_GUESTS_FILTER_STATUS = gql`
    query(
        $event_id: Int!, 
        $guest_checkin: Int,
        $start: Int!
        $limit: Int!, 
    ) {
        guests(event_id: $event_id, filters: {guest_checkin: $guest_checkin}, start: $start, limit: $limit) {
            guest_id
            event_id
            guest_status
            guest_title
            guest_firstname
            guest_lastname
            guest_public
            guest_behalf_firstname
            guest_behalf_lastname
            guest_titleaddition
            guest_checkin
            guest_checkin_time
            guest_companions_allowed
            companions {
                guest_id
                guest_firstname
                guest_lastname
                guest_checkin
            }
            guest_parent_id
        }
    }
`;

export const EVENT_GUESTS_FILTER_STATUS_SEARCH = gql`
    query(
        $event_id: Int!, 
        $guest_checkin: Int,
        $searchString: String!
        $start: Int!
        $limit: Int!, 
    ) {
        guests(
            event_id: $event_id, 
            filters: {guest_checkin: $guest_checkin}, 
            advancedFilter: {
                field: "guest_firstname",
                operator: LIKE,
                value: $searchString
            }, 
            start: $start, 
            limit: $limit
        ) {
            guest_id
            event_id
            guest_status
            guest_title
            guest_firstname
            guest_lastname
            guest_public
            guest_behalf_firstname
            guest_behalf_lastname
            guest_titleaddition
            guest_checkin
            guest_checkin_time
            guest_companions_allowed
            companions {
                guest_id
                guest_firstname
                guest_lastname
                guest_checkin
            }
        }
    }
`;

export const SEARCH_GUESTS = gql`
    query(
        $event_id: Int!, 
        $searchString: String!
        $start: Int!
        $limit: Int!, 
    ) {
        firstname_search_result:guests(
            event_id: $event_id, 
            advancedFilter: {
                field: "guest_firstname",
                operator: LIKE,
                value: $searchString
            }, 
            start: $start, 
            limit: $limit
        ) {
            guest_id
            event_id
            guest_status
            guest_title
            guest_firstname
            guest_lastname
            guest_public
            guest_behalf_firstname
            guest_behalf_lastname
            guest_titleaddition
            guest_checkin
            guest_checkin_time
            guest_companions_allowed
            companions {
                guest_id
                event_id
                guest_status
                guest_title
                guest_firstname
                guest_lastname
                guest_public
                guest_behalf_firstname
                guest_behalf_lastname
                guest_titleaddition
                guest_checkin
                guest_checkin_time
            }
        }
        lastname_search_result:guests(
            event_id: $event_id, 
            advancedFilter: {
                field: "guest_lastname",
                operator: LIKE,
                value: $searchString
            }, 
            start: $start, 
            limit: $limit
        ) {
            guest_id
            event_id
            guest_status
            guest_title
            guest_firstname
            guest_lastname
            guest_public
            guest_behalf_firstname
            guest_behalf_lastname
            guest_titleaddition
            guest_checkin
            guest_checkin_time
            guest_companions_allowed
            companions {
                guest_id
                event_id
                guest_status
                guest_title
                guest_firstname
                guest_lastname
                guest_public
                guest_behalf_firstname
                guest_behalf_lastname
                guest_titleaddition
                guest_checkin
                guest_checkin_time
            }
        }
    }
`;

export const GET_EVENT_PROGRESS = gql`
    query(
        $event_id: Int!, 
        $guest_checkin: Int,
        $start: Int
        $limit: Int, 
    ) {
        guests(event_id: $event_id, filters: {guest_checkin: $guest_checkin}, start: $start, limit: $limit) {
            guest_id
            guest_checkin
        }
    }
`;

export const GET_EVENT_GUESTS = gql`
    query(
        $event_id: Int!, 
        $start: Int!
        $limit: Int!, 
    ) {
        guests(event_id: $event_id, start: $start, limit: $limit) {
            guest_id
            event_id
            es_id
            owner_id
            sender_signature_id
            sec_signature_id
            guest_prio
            ticket_category_id
            guest_status
            guest_public
            guest_behalf_firstname
            guest_behalf_lastname
            guest_titleaddition
            guest_title
            guest_gender
            guest_firstname
            guest_lastname
            guest_email
            guest_language
            guest_street
            guest_street_no
            guest_zip
            guest_city
            guest_country
            guest_company
            guest_jobtitle
            guest_phone
            guest_mobile
            guest_birthdate
            guest_parent_id
            guest_comment
            guest_companions_allowed
            guest_checkin
            guest_checkin_time
            guest_pageview
            guest_created
            guest_confirmed
            companions {
                guest_id
                event_id
                es_id
                owner_id
                sender_signature_id
                sec_signature_id
                guest_prio
                ticket_category_id
                guest_status
                guest_public
                guest_behalf_firstname
                guest_behalf_lastname
                guest_titleaddition
                guest_title
                guest_gender
                guest_firstname
                guest_lastname
                guest_email
                guest_language
                guest_street
                guest_street_no
                guest_zip
                guest_city
                guest_country
                guest_company
                guest_jobtitle
                guest_phone
                guest_mobile
                guest_birthdate
                guest_parent_id
                guest_comment
                guest_companions_allowed
                guest_checkin
                guest_checkin_time
                guest_pageview
                guest_created
                guest_confirmed
            }
        }
    }
`;

export const GET_EVENT_GUEST = gql`
    query($guest_id: Int!) {
        guest(guest_id: $guest_id) {
            guest_id
            event_id
            es_id
            owner_id
            sender_signature_id
            sec_signature_id
            guest_prio
            ticket_category_id
            guest_status
            guest_public
            guest_behalf_firstname
            guest_behalf_lastname
            guest_titleaddition
            guest_title
            guest_gender
            guest_firstname
            guest_lastname
            guest_email
            guest_language
            guest_street
            guest_street_no
            guest_zip
            guest_city
            guest_country
            guest_company
            guest_jobtitle
            guest_phone
            guest_mobile
            guest_birthdate
            guest_parent_id
            guest_comment
            guest_companions_allowed
            guest_checkin
            guest_checkin_time
            guest_pageview
            guest_created
            guest_confirmed
            companions {
                guest_id
                event_id
                es_id
                owner_id
                sender_signature_id
                sec_signature_id
                guest_prio
                ticket_category_id
                guest_status
                guest_public
                guest_behalf_firstname
                guest_behalf_lastname
                guest_titleaddition
                guest_title
                guest_gender
                guest_firstname
                guest_lastname
                guest_email
                guest_language
                guest_street
                guest_street_no
                guest_zip
                guest_city
                guest_country
                guest_company
                guest_jobtitle
                guest_phone
                guest_mobile
                guest_birthdate
                guest_parent_id
                guest_comment
                guest_companions_allowed
                guest_checkin
                guest_checkin_time
                guest_pageview
                guest_created
                guest_confirmed
            }
        }
    }
`;

export const GET_EVENT_GUEST_QUICK_DETAIL = gql`
    query($guest_id: Int!) {
        guest(guest_id: $guest_id) {
            guest_id
            event_id
            es_id
            owner_id
            sender_signature_id
            sec_signature_id
            guest_prio
            ticket_category_id
            guest_status
            guest_public
            guest_behalf_firstname
            guest_behalf_lastname
            guest_titleaddition
            guest_title
            guest_gender
            guest_firstname
            guest_lastname
            guest_email
            guest_language
            guest_street
            guest_street_no
            guest_zip
            guest_city
            guest_country
            guest_company
            guest_jobtitle
            guest_phone
            guest_mobile
            guest_birthdate
            guest_parent_id
            guest_comment
            guest_companions_allowed
            guest_checkin
            guest_checkin_time
            guest_pageview
            guest_created
            guest_confirmed
            companions {
                guest_id
                event_id
                es_id
                owner_id
                sender_signature_id
                sec_signature_id
                guest_prio
                ticket_category_id
                guest_status
                guest_public
                guest_behalf_firstname
                guest_behalf_lastname
                guest_titleaddition
                guest_title
                guest_gender
                guest_firstname
                guest_lastname
                guest_email
                guest_language
                guest_street
                guest_street_no
                guest_zip
                guest_city
                guest_country
                guest_company
                guest_jobtitle
                guest_phone
                guest_mobile
                guest_birthdate
                guest_parent_id
                guest_comment
                guest_companions_allowed
                guest_checkin
                guest_checkin_time
                guest_pageview
                guest_created
                guest_confirmed
            }
        }
    }
`;