import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import resolvers from './resolvers';
import defaults from './defaults';
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { getUserToken } from "../../src/auth";


let httpLink = new HttpLink({
    uri: 'https://checkinapp.myeyevip.ch/api/index.php'
});
const authHeader = setContext(
    request =>
        new Promise((success, fail) => {
            getUserToken().then(token => success({ headers: { authorization: `Bearer ${token}` }}))
        })
);

const cache = new InMemoryCache();

export const client = new ApolloClient({
    cache,
    link: authHeader.concat(httpLink),
    resolvers: resolvers,
});
cache.writeData({
    data: defaults,
});