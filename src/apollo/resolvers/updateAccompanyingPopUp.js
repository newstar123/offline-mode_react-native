import { gql } from 'apollo-boost'

export default (_, { guestId, show, checkIn, isMainGuest }, { cache }) => {

    const query = gql`
        query GetAccompanyingPopUp {
            checkInGuests @client {
                guestId,
                showAccompanyingPopUp,
                checkIn,
                isMainGuest
            }
        }
    `;

    const previousState = cache.readQuery({ query });

    const data = {
        checkInGuests: {
            ...previousState.checkInGuests,
            guestId: guestId,
            showAccompanyingPopUp: show,
            checkIn: checkIn,
            isMainsGuest: isMainGuest,
        }
    };

    cache.writeQuery({
        query,
        data
    });
    return null;
}