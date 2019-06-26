import { gql } from 'apollo-boost'

export const updateShowLoadingQuery = gql`
    mutation updateShowLoading($show: Boolean!) {
        updateShowLoading(show: $show) @client {
            showLoading
        }
    }
`;