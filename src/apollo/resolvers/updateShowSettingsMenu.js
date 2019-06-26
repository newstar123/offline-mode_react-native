import { gql } from 'apollo-boost'

export default (_, { show }, { cache }) => {
    const query = gql`
        query GetShowSettingsMenu {
            eyeVIPApp @client {
                showSettingsMenu
            }
        }
    `;

    const previousState = cache.readQuery({ query });

    const data = {
        eyeVIPApp: {
            ...previousState.eyeVIPApp,
            showSettingsMenu: show
        }
    };

    cache.writeQuery({
        query,
        data
    });
    return null;
}