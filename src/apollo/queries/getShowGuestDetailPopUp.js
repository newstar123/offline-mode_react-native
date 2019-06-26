import { gql } from 'apollo-boost'

export const getShowGuestDetailPopUpQuery = gql`
    query {
        eyeVIPApp @client {
            showGuestDetailPopUp
        }
    }
`;

export const getShowGuestDetailPopUpOptions = {
    props: ({ data: { eyeVIPApp: { showGuestDetailPopUp } } }) => ({
        showGuestDetailPopUp,
    })
};