import { gql } from 'apollo-boost'

export const updateAccompanyingPopUpQuery = gql`
    mutation updateAccompanyingPopUp($guestId: Int!, $show: Boolean!, $checkIn: Boolean!, $isMainGuest: Boolean!) {
        updateAccompanyingPopUp(guestId: $guestId, show: $show, checkIn: $checkIn, isMainGuest: $isMainGuest) @client {
            guestId,
            showAccompanyingPopUp,
            checkIn,
            isMainGuest
        }
    }
`;