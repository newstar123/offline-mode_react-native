import { gql } from 'apollo-boost'

export const updateFetchingDataQuery = gql`
    mutation updateFetchingData($value: Boolean!) {
        updateFetchingData(value: $value) @client {
            fetchingData
        }
    }
`;