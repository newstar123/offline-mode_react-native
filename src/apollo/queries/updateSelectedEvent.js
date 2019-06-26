import { gql } from 'apollo-boost'

export const updateSelectedEventQuery = gql`
    mutation updateSelectedEvent($currentEventId: Int!, $currentEventName: String!, $currentEventPassphrase: String!) {
        updateSelectedEvent(
            currentEventId: $currentEventId, 
            currentEventName: $currentEventName,
            currentEventPassphrase: $currentEventPassphrase
        ) @client {
            currentEventId,
            currentEventName,
            currentEventPassphrase
        }
    }
`;