import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Dimensions,
    Linking
} from 'react-native';
import { strongShades, pastelShades } from "../../Components/UI/appStyles/appStyles";
import DefaultInput from '../../Components/UI/DefaultInput/DefaultInput';
import {fontFamily, fontWeight} from "../../Theme";
import {SUBSCRIPTION_URL} from "../../auth";

class ForgotPasswordScreen extends Component {

    static navigationOptions = () => {
        return {
            header: null
        };
    };

    state = {
        value: '',
        valid: false,
        validationRules: {
            minLength: 3
        },
        touched: false
    };

    updateInputState = (value) => {
        this.setState(prevState => {
            return {
                ...prevState,
                value: value,
                valid: true,
                touched: true
            }
        });
    };

    _addhttp = (url) => {
        if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
            url = "https://" + url;
        }
        return url;
    };

    forgotPasswordHandler = () => {
        const clientURL = this._addhttp(this.state.value.trim());

        Linking.openURL(clientURL).catch((err) => console.error('An error occurred opening the url:', clientURL, err));
    };

    render() {
        return (
            <View style={styles.container}>
                <KeyboardAvoidingView behavior="padding">
                    <View style={styles.headerContainer}>
                        <Image
                            style={styles.headerLogo}
                            source={require('../../../images/eyevip_logo_white.png')}
                        />
                        <Text style={styles.headerText}>
                            Reset my password
                        </Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <DefaultInput
                                placeholder={"eyevip URL"}
                                value={this.state.value}
                                autoCapitalize={"none"}
                                autoCorrect={false}
                                iconName={"link"}
                                onChangeText={(val) => this.updateInputState(val)}
                            />

                            <Text style={styles.helpText}>
                                e.g. company.eyevip.io
                            </Text>

                            <TouchableOpacity style={{width: '100%'}} title="ForgotPassowrd" onPress={this.forgotPasswordHandler}>
                                <View style={styles.loginButton} >
                                    <Text style={styles.loginButtonText}>Forgot password</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.7} style={styles.passwordRecovery} onPress={() => this.props.navigation.navigate('Login', {})}>
                                <Text style={styles.passwordRecoveryLink}>Back to login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.subscriptionContainer}>
                        <Text style={styles.subscriptionText}>You are not using eyevip yet?</Text>
                        <TouchableOpacity onPress={() => {
                            Linking.openURL(SUBSCRIPTION_URL).catch((err) => console.error('An error occurred opening the url:', url, err));
                        }}>
                            <Text style={styles.subscriptionLink}>Get a subscription now!</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        textAlign: 'center',
        backgroundColor: strongShades.darkBlue,
    },
    headerContainer: {
        width: '100%',
        alignItems:'center',
        justifyContent:'center',
    },
    headerLogo: {
        width: 200,
        marginBottom: 25,
        resizeMode: 'contain'
    },
    headerText: {
        fontFamily: fontFamily.OpenSans,
        fontSize: 18,
        color: pastelShades[1],
        marginBottom: 30,
    },
    inputContainer: {
        width: (Dimensions.get('window').width < 768 ? 335 : 400),
        height: 310,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    inputWrapper: {
        width: '100%',
        backgroundColor: '#fff',
        height: 200,
        justifyContent: 'center',
        borderRadius: 5,
        paddingLeft: 20,
        paddingTop: 20,
        paddingRight: 20,
        paddingBottom: 20,
    },
    helpText: {
        fontFamily: fontFamily.OpenSans,
        fontSize: 16,
        color: pastelShades[1],
        textAlign: 'left',
        width: '100%'
    },
    loginButton: {
        width: '100%',
        height: 45,
        marginTop: 20,
        backgroundColor: strongShades.mint,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginButtonText: {
        fontFamily: fontFamily.OpenSans,
        fontSize: 16,
        color: 'white',
        fontWeight: '600',
    },
    passwordRecovery: {
        width: '100%',
        marginTop: 10,
        alignItems: 'center',
    },
    passwordRecoveryLink: {
        fontFamily: fontFamily.OpenSans,
        fontSize: 16,
        color: strongShades.skyBlue,
        fontWeight: '600',
    },
    subscriptionContainer: {
        width: '100%',
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subscriptionText: {
        fontFamily: fontFamily.OpenSans,
        fontSize: 16,
        color: pastelShades[1],
        fontWeight: fontWeight.Normal
    },
    subscriptionLink: {
        fontFamily: fontFamily.OpenSans,
        fontSize: 16,
        color: strongShades.skyBlue,
        fontWeight: fontWeight.Normal
    },
});

export default ForgotPasswordScreen;