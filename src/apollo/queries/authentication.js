import { gql } from 'apollo-boost';

export const AUTHENTICATE = gql`
    query authenticate($body: body!) {
        authenticate(body: $body) 
        @rest(
            type: "AccessToken", 
            path: "/authenticate", 
            method: "POST", 
            bodyKey: "body"
        ) {
            access_token,
            expires_in,
            token_type,
            scope,
            refresh_token
        }
    }
`;