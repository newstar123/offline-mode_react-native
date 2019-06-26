import { gql } from 'apollo-boost'

export const getShowLoadingQuery = gql`
    query {
        eyeVIPApp @client {
            showLoading
        }
    }
`;

export const getShowLoadingOptions = {
    props: ({ data: { eyeVIPApp: { showLoading } } }) => ({
        showLoading,
    })
};