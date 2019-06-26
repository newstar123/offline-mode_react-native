import { pastelShades } from "../../Components/UI/appStyles/appStyles";
import React, { Component } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { withApollo, Query, Mutation, graphql, compose } from 'react-apollo'

import { Formik, withFormik } from 'formik';
import { Button, Input, ThemeProvider } from 'react-native-elements';
import * as yup from 'yup';
import LoadingModal from '../../Components/LoadingModal/LoadingModal';
import { CREATE_GUEST } from '../../apollo/queries/guests';


const ActivityIndicator = () => {
    return (
        <Text>LOADING</Text>
    );
};

class AddGuestTest extends Component {

    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
        return {
            title: 'SignInForm...',
            headerRight: (
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={{ marginRight: (Dimensions.get('window').width < 768 ? 5 : 40), }} onPress={() => navigation.navigate('Tests')}>
                        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>TESTS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginRight: (Dimensions.get('window').width < 768 ? 5 : 40), }} onPress={() => navigation.navigate('Events')}>
                        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>EVENTS</Text>
                    </TouchableOpacity>
                </View>
            ),
        };
    };

    constructor(props) {
        super(props);
    }


    render() {

        const validationSchema = yup.object().shape({
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
            email: yup
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
                paddingTop: 15,
                paddingRight: 12,
                paddingBottom: 15,
                color: pastelShades[1],
            },
            Label: {
                flexDirection: 'row',
                width: '100%',
                height: 40,
                paddingBottom: 7,
                display: 'flex',
                color: pastelShades[1],
            },
            Button: {
                raised: true,
                titleStyle: {
                    color: 'black',
                    fontWeight: 'bold',
                },
            },
        };

        const StyledInput = ({ label, formikProps, formikKey, ...rest }) => {

            const inputStyles = {
                flex: 1,
                height: 45,
                borderWidth: 0,
                borderColor: 'white',
                backgroundColor: 'white',
                paddingLeft: 12,
                paddingTop: 15,
                paddingRight: 12,
                paddingBottom: 15,
            };

            if (formikProps.touched[formikKey] && formikProps.errors[formikKey]) {
                inputStyles.borderColor = 'red';
                inputStyles.backgroundColor = '#f9c0c0';
            }

            return (
                <View style={{ marginHorizontal: 20, marginVertical: 5 }}>
                    <Input
                        label={label}
                        inputStyle={inputStyles}
                        onChangeText={formikProps.handleChange(formikKey)}
                        onBlur={formikProps.handleBlur(formikKey)}
                        {...rest}
                    />
                    <Text style={{ color: 'red' }}>
                        {formikProps.touched[formikKey] && formikProps.errors[formikKey]}
                    </Text>
                </View>
            );
        };

        const addGuest = ({ event_id, guest_title, guest_firstname, guest_lastname, guest_email, guest_company, guest_language, guest_comment }) => {

            return this.props.client.mutate({
                mutation: CREATE_GUEST,
                variables: {
                    event_id: event_id,
                    guest_title: guest_title,
                    guest_firstname: guest_firstname,
                    guest_lastname: guest_lastname,
                    guest_email: guest_email,
                    guest_company: guest_company,
                    guest_language: guest_language,
                    guest_comment: guest_comment
                },
            })

            // return new Promise((resolve, reject) => {
            //     setTimeout(() => {
            //         if (guest_email === 'a@a.com') {
            //             reject(new Error("You playing' with that fake email address."));
            //         }
            //         resolve(true);
            //     }, 1000);
            // });
        };

        const initialValues = {
            guest_firstname: '',
            guest_lastname: '',
            guest_email: '',
            guest_company: '',
            guest_language: 'en',
            guest_comment: '',
        };

        return (
            <View style={styles.container}>
                <View style={{marginTop: 100,}}>

                    <LoadingModal/>

                    <Formik
                        initialValues={initialValues}
                        onSubmit={(values, actions) => {
                            addGuest({
                                event_id: 2,
                                guest_title: "mr",
                                guest_firstname: values.guest_firstname,
                                guest_lastname: values.guest_lastname,
                                guest_email: values.guest_email,
                                guest_company: values.guest_company,
                                guest_language: values.guest_language,
                                guest_comment: values.guest_comment,
                            })
                                .then(() => {
                                    alert(JSON.stringify(values));
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
                            return (
                                <View>
                                    <ThemeProvider theme={theme}>

                                        <StyledInput
                                            label="Fist Name"
                                            key="guest_firstname"
                                            placeholder={initialValues["guest_firstname"]}
                                            formikProps={props}
                                            formikKey="guest_firstname"
                                            autoFocus
                                        />

                                        <StyledInput
                                            label="LastName"
                                            key="guest_lastname"
                                            placeholder={initialValues["guest_lastname"]}
                                            formikProps={props}
                                            formikKey="guest_lastname"
                                            autoFocus
                                        />

                                        <StyledInput
                                            label="Email"
                                            key="guest_email"
                                            placeholder={initialValues["guest_email"]}
                                            formikProps={props}
                                            formikKey="guest_email"
                                            autoFocus
                                        />

                                        <StyledInput
                                            label="Company"
                                            key="guest_company"
                                            placeholder={initialValues["guest_company"]}
                                            formikProps={props}
                                            formikKey="guest_company"
                                        />

                                        <StyledInput
                                            label="Language"
                                            key="guest_language"
                                            placeholder={initialValues["guest_language"]}
                                            formikProps={props}
                                            formikKey="guest_language"
                                        />

                                        <StyledInput
                                            label="Notes"
                                            key="guest_comment"
                                            placeholder={initialValues["guest_comment"]}
                                            formikProps={props}
                                            formikKey="guest_comment"
                                            multiline = {true}
                                            numberOfLines = {4}
                                        />

                                        {props.isSubmitting ? (
                                            <ActivityIndicator />
                                        ) : (
                                            <View>
                                                <Button title="Submit" onPress={props.handleSubmit} />
                                                <Text style={{ color: 'red' }}>{props.errors.general}</Text>
                                            </View>
                                        )}

                                    </ThemeProvider>
                                </View>
                            );
                        }}
                    </Formik>
                </View>
            </View>
        );

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: pastelShades[5],
    },
});

export default withApollo(AddGuestTest);
