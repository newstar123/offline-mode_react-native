import React, { Component } from "react";
import {StyleSheet, View, Text, ScrollView, Dimensions, Platform, KeyboardAvoidingView} from 'react-native';
import FormLabel from '../../Components/UI/FormLabel/FormLabel';
import FormSwitch from '../../Components/UI/FormSwitch/FormSwitch';

import { Formik, FieldArray } from 'formik';
import { Button, Input, ThemeProvider } from 'react-native-elements';
import * as yup from 'yup';

import {pastelShades, strongShades} from "../../Components/UI/appStyles/appStyles";
import {compose, graphql, withApollo} from "react-apollo";
import {CREATE_GUEST, CREATE_GUEST_COMPANION, REPLACE_GUEST_DECLINE,} from "../../apollo/queries/guests";
import SettingsMenuModal from "../../Components/SettingsMenuModal/SettingsMenuModal";

import {updateShowLoadingQuery, updateShowSettingsMenuQuery} from "../../apollo/queries";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import FormPicker from "../../Components/UI/FormPicker/FormPicker";
import moment from "moment-timezone";
import IconSettings from "../../Components/UI/IconSettings/IconSettings";
import Icon from "react-native-vector-icons/FontAwesome5";


class ReplaceGuestScreen extends Component {

    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
        return {
            title: 'Replace Guest',
            headerRight: (
                <IconSettings
                    navigate={navigation.navigate}
                    onPressHandler={navigation.getParam('toggleSettingsMenu')}
                />
            ),
        };
    };

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            guestId: navigation.getParam('guestId', 0),
            guestData: navigation.getParam('guestData', null),
            eventData: navigation.getParam('eventData', null),
            eventName: navigation.getParam('eventName', ''),
        };
        this.languageItems = [
            {
                label: 'English',
                value: 'en',
            },
            {
                label: 'German',
                value: 'de',
            },
        ];
    }

    componentDidMount() {
        this.props.navigation.setParams({ toggleSettingsMenu: this._toggleSettingsMenu });
    }

    _toggleSettingsMenu = () => {
        this.props.updateShowSettingsMenu({ variables: { show: true } })
    };

    updateGuest = (data) => {

        const {
            current_guest,
            guest_title,
            guest_firstname,
            guest_lastname,
            guest_email,
            guest_company,
            guest_language,
            guest_comment,
            companions,
            props
        } = data;

        const currentDateTime = moment();
        let guestCreatedDateTime = currentDateTime.format('YYYYMMDDHHmmss');
        if (this.state.eventData.event_timezone.length) {
            guestCreatedDateTime = currentDateTime.tz(this.state.eventData.event_timezone).format('YYYYMMDDHHmmss');
        }

        return new Promise(function(resolve, reject) {

            // Update old Guest to status=declined
            props.client.mutate({
                mutation: REPLACE_GUEST_DECLINE,
                variables: {
                    guest_id: current_guest.guest_id,
                    guest_behalf_firstname: guest_firstname,
                    guest_behalf_lastname: guest_lastname,
                    guest_status: "declined"
                },
            }).then(response => {
                // Create new Guest
                props.client.mutate({
                    mutation: CREATE_GUEST,
                    variables: {
                        event_id: current_guest.event_id,
                        guest_id: current_guest.guest_id,
                        guest_behalf_firstname: current_guest.guest_firstname,
                        guest_behalf_lastname: current_guest.guest_lastname,
                        guest_title: guest_title,
                        guest_firstname: guest_firstname,
                        guest_lastname: guest_lastname,
                        guest_email: guest_email,
                        guest_company: guest_company,
                        guest_language: guest_language,
                        guest_comment: guest_comment,
                        guest_checkin: current_guest.guest_checkin,
                        guest_checkin_time: current_guest.guest_checkin ? guestCreatedDateTime : '',
                        guest_status: current_guest.guest_checkin ? 'show' : 'accepted',
                        guest_created: current_guest.guest_checkin ? guestCreatedDateTime : '',
                    }
                }).then(response => {

                    const { createGuest } = response.data;

                    companions.forEach(companion => {
                        props.client.mutate({
                            mutation: CREATE_GUEST_COMPANION,
                            variables: {
                                guest_parent_id: createGuest.guest_id,
                                event_id: current_guest.event_id,
                                guest_firstname: companion.firstname,
                                guest_lastname: companion.lastname,
                                guest_company: guest_company,
                                guest_language: guest_language,
                                guest_checkin: current_guest.guest_checkin,
                                guest_checkin_time: current_guest.guest_checkin ? guestCreatedDateTime : '',
                                guest_status: current_guest.guest_checkin ? 'show' : 'accepted',
                                guest_created: guestCreatedDateTime
                            }
                        }).then(response => {
                            console.log("Added guest companion: ", response);
                        }).catch(err => {
                            console.log("Error adding guest companion: ", err);
                        })
                    });

                    resolve(response);

                }).catch(err => {
                    console.log("Error creating replacement guest!", err);
                    reject(err);
                });
            }).catch(err => {
                console.log("Error updating guest!", err);
                reject(err);
            });

        });
    };


    render () {

        const initialValues = {
            guest_id: this.state.guestId,
            guest_title: '',
            guest_firstname: '',
            guest_lastname: '',
            guest_email: '',
            guest_company: '',
            guest_language: 'en',
            guest_comment: '',
            companions: []
        };

        const validationSchema = yup.object().shape({
            companions: yup.array().of(
                yup.object().shape({
                    firstname: yup
                        .string().required()
                        .min(3, 'Seems a bit short...')
                        .max(64, 'Seems a bit long...'),
                    lastname: yup
                        .string().required()
                        .min(3, 'Seems a bit short...')
                        .max(64, 'Seems a bit long...'),
                })
            ),
            guest_title: yup
                .string(),
            guest_firstname: yup
                .string()
                .label('First Name')
                .required()
                .min(3, 'Seems a bit short...')
                .max(64, 'Seems a bit long...'),
            guest_lastname: yup
                .string()
                .label('Last Name')
                .required()
                .min(1, 'Seems a bit short...')
                .max(64, 'Seems a bit long...'),
            guest_email: yup
                .string()
                .label('Email')
                .email(),
            guest_company: yup
                .string()
                .label('Company')
                .max(64, 'Seems a bit long...'),
            guest_language: yup
                .string()
                .label('Language')
                .min(2, 'Seems a bit short...')
                .max(2, 'Seems a bit long...'),
            guest_notes: yup
                .string()
                .label('Notes')
                .max(128, 'Seems a bit long...'),
        });

        const theme = {
            Input: {
                flex: 1,
                height: 45,
                borderWidth: 0,
                borderColor: 'white',
                backgroundColor: 'white',
                paddingLeft: 12,
                color: pastelShades[1],
            },
            Label: {
                fontWeight: '700',
                paddingBottom: 4,
                color: pastelShades[1],
            },
        };

        const StyledInput = ({ label, formikProps, formikKey, paddingLeft=false, defaultValue, touched, errors, ...rest }) => {

            let inputStyle = [theme.Input];
            if (rest.multiline) {
                inputStyle.push(theme.InputComments);
            }

            return (
                <View>
                    <Input
                        defaultValue={formikProps.initialValues[formikKey]}
                        label={label}
                        labelStyle={theme.Label}
                        inputContainerStyle={{borderWidth: 0, borderBottomWidth: 0}}
                        containerStyle={{marginBottom: 10, borderWidth: 0, paddingLeft: (paddingLeft ? 10 : 0), paddingRight: 0}}
                        inputStyle={inputStyle}
                        onChangeText={formikProps.handleChange(formikKey)}
                        onBlur={formikProps.handleBlur(formikKey)}
                        {...rest}
                    />
                    <Text style={{ color: strongShades.red }}>
                        {touched && errors}
                    </Text>
                </View>
            );
        };



        return (
            <>
                <SettingsMenuModal
                    navigate={this.props.navigation.navigate}
                />

                <LoadingModal />

                <View style={styles.container}>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values, actions) => {

                            this.updateGuest({
                                current_guest: this.state.guestData,
                                guest_title: values.guest_title,
                                guest_firstname: values.guest_firstname,
                                guest_lastname: values.guest_lastname,
                                guest_email: values.guest_email,
                                guest_company: values.guest_company,
                                guest_language: values.guest_language,
                                guest_comment: values.guest_comment,
                                companions: values.companions,
                                props: this.props
                            }).then(() => {
                                this.props.navigation.navigate('Guestlist', {
                                    eventId: this.state.eventId,
                                    eventName: this.state.eventName,
                                    fromScreen: "ReplaceGuest",
                                    dropdownAlertMessage: "Guest replaced."
                                });
                            })
                                .catch(error => {
                                    actions.setFieldError('general', error.message);
                                })
                                .finally(() => {
                                    actions.setSubmitting(false);
                                });
                        }}
                        validationSchema={validationSchema}
                    >
                        {props => {

                            // Enable/Disable Loading
                            this.props.updateShowLoading({ variables: { show: props.isSubmitting } });

                            return (
                                <KeyboardAvoidingView style={{flex: 1}} keyboardVerticalOffset={(Platform.OS === 'ios' ? 70 : 0)}>
                                    <View style={{ flex: 1}}>
                                        <ScrollView style={styles.scrollViewContainer}>
                                            <ThemeProvider theme={theme}>

                                                <View style={{width: '100%', display: 'flex', alignItems: 'flex-start'}}>
                                                    <Text>Replacement for: </Text>
                                                    {<Text style={{fontWeight: '600'}}>{this.state.guestData.guest_firstname} {this.state.guestData.guest_lastname}</Text>}
                                                </View>

                                                <FormSwitch
                                                    item1="Mr"
                                                    item2="Mrs"
                                                    defaultValue={initialValues.guest_title}
                                                    onChangeHandler={props.handleChange("guest_title")}
                                                />

                                                <StyledInput
                                                    label="First Name *"
                                                    key="guest_firstname"
                                                    placeholder={initialValues["guest_firstname"]}
                                                    formikProps={props}
                                                    formikKey="guest_firstname"
                                                    touched={props.touched["guest_firstname"]}
                                                    errors={props.errors["guest_firstname"]}
                                                />
                                                <StyledInput
                                                    label="Last Name *"
                                                    key="guest_lastname"
                                                    placeholder={initialValues["guest_lastname"]}
                                                    formikProps={props}
                                                    formikKey="guest_lastname"
                                                    touched={props.touched["guest_lastname"]}
                                                    errors={props.errors["guest_lastname"]}
                                                />
                                                <StyledInput
                                                    label="Email"
                                                    key="guest_email"
                                                    placeholder={initialValues["guest_email"]}
                                                    formikProps={props}
                                                    formikKey="guest_email"
                                                    autoCapitalize={"none"}
                                                    keyboardType={"email-address"}
                                                    touched={props.touched["guest_email"]}
                                                    errors={props.errors["guest_email"]}
                                                />
                                                <StyledInput
                                                    label="Company"
                                                    key="guest_company"
                                                    placeholder={initialValues["guest_company"]}
                                                    formikProps={props}
                                                    formikKey="guest_company"
                                                    touched={props.touched["guest_company"]}
                                                    errors={props.errors["guest_company"]}
                                                />

                                                <FormLabel>Language</FormLabel>
                                                <FormPicker
                                                    formikProps={props}
                                                    formikKey="guest_language"
                                                    value={initialValues["guest_language"]}
                                                    items={this.languageItems}
                                                />

                                                <StyledInput
                                                    label="Notes"
                                                    key="guest_comment"
                                                    placeholder={initialValues["guest_comment"]}
                                                    formikProps={props}
                                                    formikKey="guest_comment"
                                                    multiline = {true}
                                                    numberOfLines = {4}
                                                    touched={props.touched["guest_comment"]}
                                                    errors={props.errors["guest_comment"]}
                                                />

                                                <View style={{display: 'flex', marginBottom: 10}}>
                                                    <FieldArray
                                                        name={"companions"}
                                                        render={arrayHelpers => (
                                                            <>
                                                                <View style={styles.companionsButtonContainer}>
                                                                    <View style={styles.companionsLabelWrapper}>
                                                                        <FormLabel> Accompanying Person(s) </FormLabel>
                                                                    </View>
                                                                    <Button
                                                                        icon={
                                                                            <Icon
                                                                                name="plus"
                                                                                size={15}
                                                                                color={pastelShades[2]}
                                                                                style={{marginRight: 10}}
                                                                            />
                                                                        }
                                                                        buttonStyle={styles.companionsAddBt}
                                                                        title={"Add"}
                                                                        titleStyle={{color: pastelShades[2], fontWeight: '600', fontSize: (Dimensions.get('window').width < 768 ? 14 : 18),}}
                                                                        onPress={() => {
                                                                            arrayHelpers.push({firstname: '', lastname: ''});
                                                                        }}
                                                                    />
                                                                </View>

                                                                { props.values.companions && props.values.companions.length > 0 ? (
                                                                    props.values.companions.map((companion, index) => (
                                                                        <View key={index} style={{display: 'flex', flex: 1, flexDirection: (Dimensions.get('window').width < 768 ? 'column' : 'row'), marginBottom: 20}}>
                                                                            <View style={{flex: 1}}>
                                                                                <StyledInput
                                                                                    label="First Name"
                                                                                    key={`companions[${index}].firstname`}
                                                                                    placeholder={''}
                                                                                    formikProps={props}
                                                                                    formikKey={`companions[${index}].firstname`}
                                                                                    defaultValue={props.initialValues['companions'][index] !== undefined ? props.initialValues['companions'][index].firstname : ''}
                                                                                    touched={props.touched.companions && props.touched.companions[index] ? props.touched.companions[index].firstname : false}
                                                                                    errors={props.errors.companions && props.errors.companions[index] ? props.errors.companions[index].firstname : false}
                                                                                />
                                                                            </View>
                                                                            <View style={{flex: 1}}>
                                                                                <StyledInput
                                                                                    label="Last Name"
                                                                                    key={`companions[${index}].lastname`}
                                                                                    placeholder={''}
                                                                                    formikProps={props}
                                                                                    formikKey={`companions[${index}].lastname`}
                                                                                    defaultValue={props.initialValues['companions'][index] !== undefined ? props.initialValues['companions'][index].lastname : ''}
                                                                                    touched={props.touched.companions && props.touched.companions[index] ? props.touched.companions[index].lastname : false}
                                                                                    errors={props.errors.companions && props.errors.companions[index] ? props.errors.companions[index].lastname : false}
                                                                                    paddingLeft={!(Dimensions.get('window').width < 768)}
                                                                                />
                                                                            </View>
                                                                            <View style={styles.companionsMinusBtWrapper}>
                                                                                <Button
                                                                                    icon={
                                                                                        <Icon
                                                                                            name="minus"
                                                                                            size={15}
                                                                                            color={pastelShades[2]}
                                                                                        />
                                                                                    }
                                                                                    buttonStyle={styles.companionsMinusBt}
                                                                                    titleStyle={{color: pastelShades[2], fontWeight: '600'}}
                                                                                    onPress={() => { arrayHelpers.remove(index); }}
                                                                                />
                                                                            </View>
                                                                        </View>
                                                                    ))) : <></>
                                                                }
                                                            </>
                                                        )} />
                                                </View>

                                            </ThemeProvider>
                                        </ScrollView>

                                        <ThemeProvider theme={theme}>
                                            { !props.isSubmitting ? (
                                                <>
                                                    {props.errors.general ? (
                                                        <View>
                                                            <Text style={{ color: strongShades.red }}>{props.errors.general}</Text>
                                                        </View>
                                                    ) : null}
                                                    <View style={styles.controlsContainer}>
                                                        <Button
                                                            title="Save"
                                                            onPress={() => {
                                                                props.handleSubmit();
                                                            }}
                                                            buttonStyle={{ backgroundColor: strongShades.mint}}
                                                            titleStyle={{color: 'white', fontSize: 16,}}
                                                            containerStyle={{flex: 1, paddingLeft: 20, paddingRight: 20}}
                                                        />
                                                    </View>
                                                </>
                                            ) : <View/> }
                                        </ThemeProvider>
                                    </View>
                                </KeyboardAvoidingView>
                            );
                        }}
                    </Formik>
                </View>
            </>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: pastelShades[5],
    },
    formContainer: {
        flex: 1,
        paddingTop: 24,
        paddingLeft: (Dimensions.get('window').width < 768 ? 10 : 40),
        paddingRight: (Dimensions.get('window').width < 768 ? 10 : 40),
        paddingBottom: 0,
    },
    controlsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderStyle: 'solid',
        borderTopWidth: 1,
        borderColor: pastelShades[3],
        height: 75,
        paddingTop: 15,
        paddingLeft: (Dimensions.get('window').width < 768 ? 10 : 40),
        paddingRight: (Dimensions.get('window').width < 768 ? 10 : 40),
        paddingBottom: 15,
    },
    companionsButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 20,
    },
    companionsLabelWrapper: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    companionsAddBt: {
        borderWidth: 2,
        borderRadius: 50,
        borderColor: pastelShades[2],
        //color: pastelShades[2],
        backgroundColor: 'transparent',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 5,
        paddingBottom: 5,
    },
    companionsMinusBtWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 20,
    },
    companionsMinusBt: {
        borderWidth: 2,
        borderRadius: 50,
        borderColor: pastelShades[2],
        //color: pastelShades[2],
        backgroundColor: 'transparent',
        marginTop: 10,
        marginBottom: 10,
    },
    scrollViewContainer: {
        paddingTop: (Dimensions.get('window').width < 768 ? 12 : 24),
        paddingRight: (Dimensions.get('window').width < 768 ? 10 : 40),
        paddingLeft: (Dimensions.get('window').width < 768 ? 10 : 40),
        paddingHorizontal: 20,
    }
});


export default withApollo(
    compose(
        graphql(updateShowLoadingQuery, { name: 'updateShowLoading' }),
        graphql(updateShowSettingsMenuQuery, { name: 'updateShowSettingsMenu' }),
    )(ReplaceGuestScreen)
);