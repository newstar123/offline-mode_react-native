import { gql } from 'apollo-boost'

export default (_, { guestId }, { cache }) => {
    const query = gql`
        query GetShowGuestDetailPopUp {
            eyeVIPApp @client {
                showGuestDetailPopUp
            }
        }
    `;

    const previousState = cache.readQuery({ query });

    const data = {
        eyeVIPApp: {
            ...previousState.eyeVIPApp,
            showGuestDetailPopUp: guestId
        }
    };

    cache.writeQuery({
        query,
        data
    });
    return null;
}