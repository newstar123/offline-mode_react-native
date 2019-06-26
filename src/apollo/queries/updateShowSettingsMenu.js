import { gql } from 'apollo-boost'

export const updateShowSettingsMenuQuery = gql`
    mutation updateSettingsMenu($show: Boolean!) {
        updateShowSettingsMenu(show: $show) @client {
            showSettingsMenu
        }
    }
`;