/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from "react";
import { AppState, View, StatusBar, Dimensions, Platform } from "react-native";
import { createStackNavigator, createAppContainer, createSwitchNavigator, createBottomTabNavigator, getActiveChildNavigationOptions } from "react-navigation";

import { ApolloProvider } from 'react-apollo';
import { onSignIn, isSignedIn, onTokenRefresh } from "./src/auth";

import LoginScreen from './src/screens/Login/Login';
import EventsScreen from './src/screens/Events/Events';
import GuestlistScreen from './src/screens/Guestlist/Guestlist';
import ScanQRCodeScreen from './src/screens/ScanQRCode/ScanQRCode';
import StatisticsScreen from './src/screens/Statistics/Statistics';
import AddGuest from './src/screens/AddGuest/AddGuest';
import EditGuest from './src/screens/EditGuest/EditGuest';
import ReplaceGuest from './src/screens/ReplaceGuest/ReplaceGuest';
import SettingsScreen from './src/screens/Settings/Settings';
import HelpScreen from './src/screens/Help/Help';

//import SwiperTest from "./src/screens/Tests/SwiperTest";
//import SearchTestScreen from './src/screens/Tests/SearchTest';
//import OfflineTestScreen from './src/screens/Tests/OfflineTest';

import { pastelShades, strongShades } from "./src/Components/UI/appStyles/appStyles";
import Icon from "react-native-vector-icons/FontAwesome5";

import { client } from './src/apollo'
import DeviceInfo from 'react-native-device-info';

import SplashScreen from 'react-native-splash-screen';
import LoadingModal from "./src/Components/LoadingModal/LoadingModal";
import ForgotPasswordScreen from "./src/screens/ForgotPassword/ForgotPassword";


const createRootNavigator = (signedIn = false) => {
    return createSwitchNavigator(
        {
            SignedIn: {
                screen: RootStack
            },
            SignedOut: {
                screen: LoginStack
            },
            ForgotPassword: {
                screen: ForgotPasswordStack
            }
        },
        {
            initialRouteName: signedIn ? "SignedIn" : "SignedOut"
        }
    );
};

const BottomNavigator = createBottomTabNavigator(
    {
        Guestlist: GuestlistScreen,
        ScanQRCode: ScanQRCodeScreen,
        Statistics: StatisticsScreen,
    },
    {
        initialRoutName: 'Guestlist',
        tabBarOptions: {
            showIcon: true,
            activeTintColor: '#fff',
            inactiveTintColor: 'rgba(255,255,255,0.38)',
            activeBackgroundColor: pastelShades[0],
            inactiveBackgroundColor: strongShades.darkBlue,
            adaptive: false,
            safeAreaInset: {
                bottom: 'never'
            },
            style: {height: (DeviceInfo.hasNotch() ? 70 : (Dimensions.get('window').width < 768 ? 60 : 70))},
            tabStyle: (DeviceInfo.hasNotch() ? {height: 70, paddingTop: 10, paddingBottom: 15} : {height: (Dimensions.get('window').width < 768 ? 60 : 70), paddingTop: 15, paddingBottom: 5}),
            labelStyle: {paddingTop: (Dimensions.get('window').width < 768 ? 1 : 5)},
        }
    }
);

BottomNavigator.navigationOptions = ({navigation, screenProps}) => {
    const childOptions = getActiveChildNavigationOptions(navigation, screenProps);

    return {
        title: childOptions.title,
        headerLeft : childOptions.headerLeft,
        headerRight: childOptions.headerRight,
    }
};

const RootStack = createStackNavigator(
    {
        EventTabNavigator: BottomNavigator,
        Events: EventsScreen,
        AddGuest: AddGuest,
        EditGuest: EditGuest,
        ReplaceGuest: ReplaceGuest,
        Settings: SettingsScreen,
        Help: HelpScreen,
        //SearchTest: SearchTestScreen,
        //SwiperTest: SwiperTest,
        //OfflineTest: OfflineTestScreen,
    },
    {
        initialRouteName: 'Events',
        headerLayoutPreset: 'center',
        /* The header config from HomeScreen is here */
        defaultNavigationOptions: {
            gesturesEnabled: false,
            headerStyle: {
                backgroundColor: strongShades.darkBlue,
                borderBottomWidth: 0,
                marginTop: (Platform.OS === 'ios' ? (Dimensions.get('window').width < 768 ? 5 : 10) : 0),
                marginBottom: 0,
                paddingTop: (Dimensions.get('window').width < 768 ? 5 : 10),
                paddingBottom: (Dimensions.get('window').width < 768 ? 5 : 5),
            },
            headerTintColor: pastelShades[1],
            headerTitleStyle: {
                fontSize: (Dimensions.get('window').width < 768 ? 18 : 28),
                fontWeight: 'normal',
                textAlign: 'center',
                flexGrow: 1,
                alignSelf: 'center',
            },
            headerBackTitle: null,
            headerBackImage: (
                <View style={{ marginLeft: (Dimensions.get('window').width < 768 ? 10 : 40), }}>
                    <Icon name='arrow-left' size={(Dimensions.get('window').width < 768 ? 20 : 28)} color={pastelShades[1]} />
                </View>
            ),
        },
    }
);

const LoginStack = createStackNavigator(
    {
        Login: LoginScreen,
    },
    {
        initialRouteName: 'Login',
        defaultNavigationOptions: {
            header: null,
        },
    }
);

const ForgotPasswordStack = createStackNavigator(
    {
        ForgotPassword: ForgotPasswordScreen,
    },
    {
        initialRouteName: 'ForgotPassword',
        defaultNavigationOptions: {
            header: null,
        },
    }
);

console.disableYellowBox = true;

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            appState: AppState.currentState,
            signedIn: false,
            checkedSignIn: false
        };
    }

    componentDidMount() {
        SplashScreen.hide();

        AppState.addEventListener('change', this._handleAppStateChange);
        this._checkAuthentication();
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!');
            this._checkAuthentication();
        }
        this.setState({appState: nextAppState});
    };

    _userSignIn = (clientId, username, password) => {
        return new Promise((resolve, reject) => {
            onSignIn(clientId, username, password)
                .then(() => {
                    this.setState({ signedIn: true, checkedSignIn: true });
                    resolve(true);
                })
                .catch(error => {
                    reject(error);
                })
        });
    };

    _checkAuthentication = () => {
        isSignedIn()
            .then( (data) => {
                console.log("---------> componentDidMount isSignedIn: ", data);

                const {result, refreshToken, clientId, url} = data;
                //console.log("---------> componentDidMount isSignedIn: ", result, refreshToken, clientId, url);

                if (result) {
                    this.setState({signedIn: true, checkedSignIn: true});
                } else if (!result && refreshToken && clientId) {
                    console.log("onTokenRefresh.....");
                    onTokenRefresh(refreshToken, clientId, url)
                        .then(() => {
                            console.log("onTokenRefresh then.....");
                            this.setState({ signedIn: true, checkedSignIn: true });
                        })
                        .catch(error => {
                            //this.parseErrorMessage(error.message);
                            this.setState({ signedIn: false, checkedSignIn: true });
                        })
                } else {
                    this.setState({signedIn: false, checkedSignIn: true});
                }
            })
            .catch(err => alert("An error occurred"));
    };

    render() {
        const { checkedSignIn, signedIn } = this.state;

        // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
        if (!checkedSignIn) {
            return null;
        }

        const container = createRootNavigator(signedIn);
        const AppContainer = createAppContainer(container);

        return (
            <ApolloProvider client={client}>
                <LoadingModal />
                <StatusBar barStyle="light-content" />
                <AppContainer screenProps={{signInHandler: this._userSignIn}} />
            </ApolloProvider>
        );
    }
}