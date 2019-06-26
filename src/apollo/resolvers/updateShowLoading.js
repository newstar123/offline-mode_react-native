import { gql } from 'apollo-boost'

export default (_, { show }, { cache }) => {
    const query = gql`
        query GetShowLoading {
            eyeVIPApp @client {
                showLoading
            }
        }
    `;

    const previousState = cache.readQuery({ query });

    const data = {
        eyeVIPApp: {
            ...previousState.eyeVIPApp,
            showLoading: show
        }
    };

    cache.writeQuery({
        query,
        data
    });
    return null;
}