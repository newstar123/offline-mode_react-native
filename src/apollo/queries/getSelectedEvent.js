import { gql } from 'apollo-boost'

export const getSelectedEventQuery = gql`
    query {
        eyeVIPApp @client {
            currentEventId,
            currentEventName,
            currentEventPassphrase
        }
    }
`;

export const getSelectedEventOptions = {
    props: ({ data: { eyeVIPApp: { currentEventId, currentEventName, currentEventPassphrase } } }) => ({
        currentEventId,
        currentEventName,
        currentEventPassphrase
    })
};