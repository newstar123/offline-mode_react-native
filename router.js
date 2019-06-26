import {createStackNavigator} from "react-navigation";
import LoginScreen from "./src/screens/Login/Login";

export const Login = createStackNavigator({
        Login: LoginScreen,
    },
    {
        initialRouteName: 'Login',
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        },
    }
);