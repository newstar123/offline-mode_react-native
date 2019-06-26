import { gql } from 'apollo-boost'

export default (_, { value }, { cache }) => {
    const query = gql`
        query GetFetchingData {
            eyeVIPApp @client {
                fetchingData
            }
        }
    `;

    const previousState = cache.readQuery({ query });

    const data = {
        eyeVIPApp: {
            ...previousState.eyeVIPApp,
            fetchingData: value
        }
    };

    cache.writeQuery({
        query,
        data
    });
    return null;
}