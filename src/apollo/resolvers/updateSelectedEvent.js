import { gql } from 'apollo-boost'

export default (_, { currentEventId, currentEventName, currentEventPassphrase }, { cache }) => {

    const query = gql`
        query GetSelectedEvent {
            eyeVIPApp @client {
                currentEventId,
                currentEventName,
                currentEventPassphrase
            }
        }
    `;

    const previousState = cache.readQuery({ query });

    const data = {
        eyeVIPApp: {
            ...previousState.eyeVIPApp,
            currentEventId: currentEventId,
            currentEventName: currentEventName,
            currentEventPassphrase: currentEventPassphrase
        }
    };

    cache.writeQuery({
        query,
        data
    });
    return null;
}