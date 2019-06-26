import AsyncStorage from '@react-native-community/async-storage';
import ApolloClient from "apollo-client";
import {RestLink} from "apollo-link-rest";
import {AUTHENTICATE} from "./apollo/queries/authentication";
import {InMemoryCache} from "apollo-cache-inmemory";
import {parser} from "react-apollo/parser";

export const TOKEN = "eyevip:auth:access_token";
export const TOKEN_REFRESH = "eyevip:auth:refresh_token";
export const TOKEN_EXPIRES = "eyevip:auth:expires_in";
export const TOKEN_CLIENT_ID = "eyevip:auth:client_id";
export const TOKEN_URL = "eyevip:auth:url";

export const PASSWORD_RECOVERY_URL = "https://checkinapp.myeyevip.ch/admin/index.php";
export const SUBSCRIPTION_URL = "https://eyevip.ch/en/";


export const onSignIn = (url, username, password) => {

    const authBody = {
        username: username,
        password: password,
        grant_type: "password",
        client_id: username,
        client_secret: _md5Encrypt(username)
    };

    const authClient = new ApolloClient({
        link: new RestLink({ uri: _addhttp(_removeSlash(url)) + "/authenticate/token.php" }),
        cache: new InMemoryCache(),
    });


    return authClient.query({ query: AUTHENTICATE, variables: {body: authBody}, errorPolicy: "all" })
        .then(result => {
            console.log("SERVER TOKEN DATA:", result.data);

            const now = new Date();
            //const expiryTime = now.getTime() + result.data.authenticate.expires_in * 1000;
            const expiryTime = now.getTime() + 100 * 1000;

            AsyncStorage.setItem(TOKEN_EXPIRES, expiryTime.toString());
            AsyncStorage.setItem(TOKEN, result.data.authenticate.access_token);
            AsyncStorage.setItem(TOKEN_REFRESH, result.data.authenticate.refresh_token);
            AsyncStorage.setItem(TOKEN_CLIENT_ID, username);
            AsyncStorage.setItem(TOKEN_URL, _addhttp(_removeSlash(url)));
        });
};

export const onTokenRefresh = (refreshToken, username, url) => {

    const authBody = {
        refresh_token: refreshToken,
        grant_type: "refresh_token",
        client_id: username,
        client_secret: _md5Encrypt(username)
    };

    const authClient = new ApolloClient({
        link: new RestLink({ uri: _addhttp(_removeSlash(url)) + "/authenticate/token.php" }),
        cache: new InMemoryCache(),
    });

    return authClient.query({ query: AUTHENTICATE, variables: {body: authBody}, errorPolicy: "all" })
        .then(result => {
            console.log("SERVER REFRESH TOKEN DATA:", result.data);

            const now = new Date();
            //const expiryTime = now.getTime() + result.data.authenticate.expires_in * 1000;
            const expiryTime = now.getTime() + 60 * 1000;

            AsyncStorage.setItem(TOKEN_EXPIRES, expiryTime.toString());
            AsyncStorage.setItem(TOKEN, result.data.authenticate.access_token);
            AsyncStorage.setItem(TOKEN_REFRESH, result.data.authenticate.refresh_token);
            AsyncStorage.setItem(TOKEN_URL, _addhttp(_removeSlash(url)));
        });
};

export const onSignOut = () => {
    return AsyncStorage.multiRemove([TOKEN, TOKEN_REFRESH, TOKEN_EXPIRES, TOKEN_CLIENT_ID, TOKEN_URL]);
};

export const getUserToken = () => {
    return AsyncStorage.getItem(TOKEN);
};

export const isSignedIn = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.multiGet([TOKEN_EXPIRES, TOKEN_REFRESH, TOKEN_CLIENT_ID, TOKEN_URL])
            .then(res => {
                // Check if Token expired
                const now = new Date();
                if (parseInt(res[0][1]) > parseInt(now.getTime())) {
                    const expiry_time = (parseInt(res[0][1]) - parseInt(now.getTime()));
                    resolve({result: true, expiry_time: expiry_time, refreshToken: res[1][1], clientId: res[2][1], url: res[3][1] });
                } else {
                    resolve({result: false, refreshToken: res[1][1], clientId: res[2][1], url: res[3][1] });
                }
            })
            .catch(err => reject(err));
    });
};


const _md5Encrypt= (value) => {
    const MD5 = (d) => {result = M(V(Y(X(d),8*d.length)));return result.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e)}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return(d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}
    return MD5(value);
};


const _addhttp = (url) => {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "https://" + url;
    }
    return url;
};


const _removeSlash = (url) => {
    return url.replace(/\/$/, "");
};