import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Modal,
    StyleSheet, Dimensions, ScrollView
} from 'react-native';
import { pastelShades, strongShades } from "../UI/appStyles/appStyles";
import {compose, graphql, Query, withApollo} from "react-apollo";
import { GET_EVENT_GUEST_QUICK_DETAIL } from "../../apollo/queries/guests";
import {ModalControlButton, ModalControls, ModalH1, ModalLabel, ModalText} from "../UI/ModalUI/ModalUI";

import {
    getShowGuestDetailPopUpQuery,
    getShowGuestDetailPopUpOptions,
    updateShowGuestDetailPopUpQuery,
    updateShowLoadingQuery,
} from "../../apollo/queries";


const guestDetailPopUp = (props) => {

    const _hideModalHandler = () => {
        props.updateShowGuestDetailPopUp({ variables: { guestId: 0 } });
    };

    const getGuestDetails = (guest_id, editGuestHandler, replaceGuestHandler) => {
        return (
            <Query
                query={GET_EVENT_GUEST_QUICK_DETAIL}
                fetchPolicy={'network-only'}
                variables={{ guest_id: parseInt(guest_id) }}
            >
                {({ loading, error, data }) => {

                    if (loading) {
                        props.updateShowLoading({ variables: { show: true } });
                    }
                    if (error) {
                        props.updateShowLoading({ variables: { show: false } });
                    }

                    if (data.guest) {

                        props.updateShowLoading({ variables: { show: false } });


                        let companions = null;
                        if (data.guest.companions.length) {
                            companions = data.guest.companions.map(companion => {
                                return (
                                    <View key={companion.guest_id}>
                                        <ModalText>{companion.guest_firstname} {companion.guest_lastname}</ModalText>
                                    </View>
                                );
                            });
                        }

                        let guest_behalf = null;
                        if (data.guest.guest_status.toUpperCase() !== 'DECLINED' && (data.guest.guest_behalf_firstname || data.guest.guest_behalf_lastname)) {
                            guest_behalf = data.guest.guest_behalf_firstname + ' ' + data.guest.guest_behalf_lastname;
                        }

                        let guest_replaced_by = null;
                        if (data.guest.guest_status.toUpperCase() === 'DECLINED' && (data.guest.guest_behalf_firstname || data.guest.guest_behalf_lastname)) {
                            guest_replaced_by = data.guest.guest_behalf_firstname + ' ' + data.guest.guest_behalf_lastname;
                        }


                        let guest_company = null;
                        if (data.guest.guest_company) {
                            guest_company = data.guest.guest_company;
                        }

                        let guest_category = null;
                        if (data.guest.ticket_category_id) {
                            guest_category = data.guest.ticket_category_id;
                        }

                        return (
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={props.visible}
                                onRequestClose={ _=> {} }
                            >
                                <TouchableOpacity
                                    style={styles.modalContainer}
                                    activeOpacity={1}
                                    onPressOut={_hideModalHandler}
                                >
                                    <TouchableWithoutFeedback>
                                        <View style={styles.modalDetailContainer}>
                                            <View style={styles.modalDetailContent}>
                                                <ModalH1>{data.guest.guest_firstname} {data.guest.guest_lastname}</ModalH1>

                                                {companions ?
                                                    <>
                                                        <ModalLabel>{'Accompanies'.toUpperCase()}</ModalLabel>
                                                        {companions}
                                                    </>
                                                    : null
                                                }

                                                {guest_behalf ?
                                                    <>
                                                        <ModalLabel>{'Replacement for'.toUpperCase()}</ModalLabel>
                                                        <ModalText>{guest_behalf}</ModalText>
                                                    </>
                                                    : null
                                                }

                                                {guest_replaced_by ?
                                                    <>
                                                        <ModalLabel>{'Replaced by'.toUpperCase()}</ModalLabel>
                                                        <ModalText>{guest_replaced_by}</ModalText>
                                                    </>
                                                    : null
                                                }

                                                {guest_company ?
                                                    <>
                                                        <ModalLabel>{'Company'.toUpperCase()}</ModalLabel>
                                                        <ModalText>{guest_company}</ModalText>
                                                    </>
                                                    : null
                                                }

                                                {guest_category ?
                                                    <>
                                                        <ModalLabel>{'Category'.toUpperCase()}</ModalLabel>
                                                        <ModalText>{guest_category}</ModalText>
                                                    </>
                                                    : null
                                                }
                                            </View>

                                            <ModalControls >
                                                <ModalControlButton
                                                    onPressHandler={() => {
                                                        _hideModalHandler();
                                                        // Check if Guest is a replacement
                                                        if (data.guest.guest_behalf_firstname.length > 0) {
                                                            editGuestHandler(data.guest.guest_id, data.guest)
                                                        } else {
                                                            replaceGuestHandler(data.guest.guest_id, data.guest)
                                                        }
                                                    }}
                                                    positionLeft={true}
                                                    bgColor={strongShades.slamon}
                                                    textColor={'white'}
                                                >
                                                    Replace
                                                </ModalControlButton>
                                                <ModalControlButton
                                                    onPressHandler={() => {
                                                        _hideModalHandler();
                                                        editGuestHandler(data.guest.guest_id, data.guest)
                                                    }}
                                                    positionRight={true}
                                                    bgColor={strongShades.skyBlue}
                                                    textColor={'white'}
                                                >
                                                    Edit
                                                </ModalControlButton>
                                            </ModalControls>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </TouchableOpacity>
                            </Modal>
                        );
                    }

                    return null;
                }}
            </Query>
        );
    };


    let guestDetail = null;

    if (props.showGuestDetailPopUp > 0) {
        guestDetail = getGuestDetails (
            props.showGuestDetailPopUp,
            props.editGuestHandler,
            props.replaceGuestHandler,
        )
    }

    return (
        <>{guestDetail}</>
    );

};

const styles = StyleSheet.create({
    modalContainer: {
        width: '100%',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalDetailContainer: {
        width: (Dimensions.get('window').width < 768 ? '90%' : 400),
    },
    modalDetailContent: {
        width: '100%',
        backgroundColor: 'white',
        elevation: 20,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        paddingLeft: 28,
        paddingTop: 28,
        paddingRight: 28,
        paddingBottom: 28,
    },
});

export default compose(
    graphql(
        updateShowLoadingQuery, { name: 'updateShowLoading' },
    ),
    graphql(
        updateShowGuestDetailPopUpQuery, { name: 'updateShowGuestDetailPopUp' }
    ),
    graphql(
        getShowGuestDetailPopUpQuery, getShowGuestDetailPopUpOptions,
    )
)(guestDetailPopUp);