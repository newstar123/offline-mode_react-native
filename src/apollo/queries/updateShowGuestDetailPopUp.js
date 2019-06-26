import { gql } from 'apollo-boost'

export const updateShowGuestDetailPopUpQuery = gql`
    mutation updateShowGuestDetailPopUp($guestId: Int!) {
        updateShowGuestDetailPopUp(guestId: $guestId) @client {
            showGuestDetailPopUp
        }
    }
`;