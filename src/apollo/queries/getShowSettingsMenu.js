import { gql } from 'apollo-boost'

export const getShowSettingsMenuQuery = gql`
    query {
        eyeVIPApp @client {
            showSettingsMenu
        }
    }
`;

export const getShowSettingsMenuOptions = {
    props: ({ data: { eyeVIPApp: { showSettingsMenu } } }) => ({
        showSettingsMenu,
    })
};