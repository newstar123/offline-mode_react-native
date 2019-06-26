import { gql } from 'apollo-boost'

export const getAccompanyingPopUpQuery = gql`
    query {
        checkInGuests @client {
            guestId,
            showAccompanyingPopUp,
            checkIn,
            isMainGuest
        }
    }
`;

export const getAccompanyingPopUpOptions = {
    props: ({ data: { checkInGuests: { guestId, showAccompanyingPopUp, checkIn, isMainGuest } } }) => ({
        guestId,
        showAccompanyingPopUp,
        checkIn,
        isMainGuest,
    })
};