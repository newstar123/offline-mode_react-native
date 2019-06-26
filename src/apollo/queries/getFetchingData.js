import { gql } from 'apollo-boost'

export const getFetchingDataQuery = gql`
    query {
        eyeVIPApp @client {
            fetchingData
        }
    }
`;

export const getFetchingDataOptions = {
    props: ({ data: { eyeVIPApp: { fetchingData } } }) => ({
        fetchingData,
    })
};