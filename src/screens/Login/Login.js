import React, { Component } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, KeyboardAvoidingView, Dimensions, Platform, Linking } from 'react-native';
import gql from "graphql-tag";
import {compose, graphql, Mutation, withApollo} from "react-apollo";
import DropdownAlert from 'react-native-dropdownalert';

import { strongShades, pastelShades } from "../../Components/UI/appStyles/appStyles";
import DefaultInput from '../../Components/UI/DefaultInput/DefaultInput';

import { onSignIn, PASSWORD_RECOVERY_URL, SUBSCRIPTION_URL } from "../../auth";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import {updateShowLoadingQuery, updateShowSettingsMenuQuery} from "../../apollo/queries";
import { fontFamily, fontWeight } from '../../Theme';

const TRY_AUTH = gql`
  mutation tryAuth($url: String!, $username: String!, $password: String!) {
    tryAuth(url: $url, username: $username, password: $password) @client {
      token
    }
  }
`;

class LoginScreen extends Component {

    state = {
        controls: {
            url: {
                //value: '',
                value: 'checkinapp.myeyevip.ch',
                valid: false,
                validationRules: {
                    minLength: 3
                },
                touched: false
            },
            username: {
                //value: '',
                value: 'fbarreto',
                valid: false,
                validationRules: {
                    minLength: 3
                },
                touched: false
            },
            password: {
                //value: '',
                value: 'zk_p84r8|$x6uHj',
                valid: false,
                validationRules: {
                    minLength: 3
                },
                touched: false
            },
        }
    };

    updateInputState = (key, value) => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    [key]: {
                        ...prevState.controls[key],
                        value: value,
                        valid: true,
                        touched: true
                    },

                }
            }
        });
    };

    parseErrorMessage = (message) => {
        let dropDownMessage = message;
        if (message && message.includes('401')) {
            dropDownMessage = 'Unknown username or password';
        }
        this.dropdown.alertWithType('error', '', dropDownMessage);
    };

    loginHandler = () => {
        this.props.updateShowLoading({ variables: { show: true } });
        this.props.screenProps.signInHandler(
            this.state.controls.url.value,
            this.state.controls.username.value,
            this.state.controls.password.value
        )
            .then( res => {
                this.props.updateShowLoading({ variables: { show: false } });
            })
            .catch(err => {
                this.parseErrorMessage(err.message);
                this.props.updateShowLoading({ variables: { show: false } });
            });
    };

    addForgotPasswordScreen = () => {
        this.props.navigation.navigate('ForgotPassword');
    };

    render() {
        const { navigation } = this.props;

        return (
            <View style={styles.container}>
                <LoadingModal />
                <KeyboardAvoidingView>
                    <View style={styles.headerContainer}>
                        <Image
                            style={styles.headerLogo}
                            source={require('../../../images/eyevip_logo_white.png')}
                        />
                        <Text style={styles.headerText}>
                            Events made simple: secure and personal
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <Mutation mutation={TRY_AUTH}>
                            {(tryAuth, { loading, error }) => {
                                if (loading) {
                                    return (
                                        <View style={styles.loadingContent}>
                                            <Text style={styles.loadingText}>Loading...</Text>
                                        </View>
                                    );
                                } else {
                                    return (
                                        <View style={styles.inputContent}>
                                            <DefaultInput
                                                placeholder={"eyevip URL"}
                                                value={this.state.controls.url.value}
                                                autoCapitalize={"none"}
                                                autoCorrect={false}
                                                iconName={"link"}
                                                onChangeText={(val) => this.updateInputState('url', val)}
                                            />

                                            <Text style={styles.helpText}>
                                                e.g. company.eyevip.io
                                            </Text>

                                            <DefaultInput
                                                placeholder={"Username"}
                                                value={this.state.controls.username.value}
                                                autoCapitalize={"none"}
                                                autoCorrect={false}
                                                iconName={"user"}
                                                onChangeText={(val) => this.updateInputState('username', val)}
                                            />

                                            <DefaultInput
                                                placeholder="Password"
                                                value={this.state.controls.password.value}
                                                valid={this.state.controls.password.valid}
                                                touched={this.state.controls.password.touched}
                                                secureTextEntry
                                                iconName="lock"
                                                onChangeText={(val) => this.updateInputState('password', val)}
                                            />

                                            <TouchableOpacity style={styles.loginButton} title="Login" onPress={this.loginHandler}
                                                // onSignIn(this.state.controls.username.value, this.state.controls.password.value)
                                                //     .then(() => {
                                                //         //this.props.screenProps.authHandler();
                                                //         navigation.navigate("SignedIn")
                                                //     })
                                                //     .catch(error => {
                                                //         this.parseErrorMessage(error.message);
                                                //     })}
                                            >
                                                <Text style={styles.loginButtonText}>Login</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={styles.passwordRecovery} onPress={this.addForgotPasswordScreen}>
                                                <Text style={styles.passwordRecoveryLink}>Forgot your password?</Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                }
                            }}
                        </Mutation>
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

                <DropdownAlert
                    ref={ref => this.dropdown = ref}
                    closeInterval={3000}
                    errorColor={pastelShades[10]}
                    messageStyle={{padding: 0, color: strongShades.red, fontFamily: fontFamily.OpenSans, fontWeight: fontWeight.Normal}}
                    titleStyle={{color: strongShades.red}}
                    errorImageSrc={null}
                    defaultContainer={{borderRadius: 4, padding: 15, paddingBottom: (Platform.OS === 'ios' ? 15 : 20), paddingLeft: 20, paddingRight: 20, marginTop: 75, marginLeft: (Dimensions.get('window').width < 768 ? '10%' : '25%'), marginRight: (Dimensions.get('window').width < 768 ? '10%' : '25%')}}
                    defaultTextContainer={{padding: 0}}
                    containerStyle={{padding: 0}}
                    translucent={true}
                    updateStatusBar={false}
                />

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
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    inputContent: {
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20,
        paddingTop: 20,
        paddingRight: 20,
        paddingBottom: 20,
        borderRadius: 5,
    },
    loadingContent: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: strongShades.darkBlue,
    },
    loadingText: {
        fontSize: 16,
        color: pastelShades[1],
    },
    helpText: {
        fontFamily: fontFamily.OpenSans,
        fontSize: 16,
        fontWeight: fontWeight.Normal,
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
        fontWeight: fontWeight.SemiBold,
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
        fontWeight: fontWeight.SemiBold,
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

export default withApollo(
    compose(
        graphql(updateShowLoadingQuery, { name: 'updateShowLoading' }),
    )(LoginScreen)
);