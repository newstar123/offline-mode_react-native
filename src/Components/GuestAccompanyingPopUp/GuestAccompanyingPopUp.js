import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Modal,
    StyleSheet, Dimensions, ScrollView
} from 'react-native';
import {pastelShades, strongShades} from "../UI/appStyles/appStyles";
import {compose, graphql, Query} from "react-apollo";
import { GET_EVENT_GUEST_QUICK_DETAIL } from "../../apollo/queries/guests";
import {ModalControlButton, ModalControls, ModalH1, ModalH2, ModalLabel} from "../UI/ModalUI/ModalUI";
import CompanionInput from './CompanionInput';
import {
    getAccompanyingPopUpQuery,
    getAccompanyingPopUpOptions,
    updateAccompanyingPopUpQuery,
    updateShowLoadingQuery,
} from "../../apollo/queries";


class GuestAccompanyingPopUp extends Component {

    constructor(props) {
        super(props);
        this.guest_id = null;
        this.check_in = null;
        this.companions = new Set();
        this.isMainGuest = false;
    }

    componentWillUnmount(): void {
        this.props.updateShowLoading({ variables: { show: false } });
    }

    _hideModalHandler = () => {
        this.props.updateAccompanyingPopUp({ variables: { guestId: 0, show: false,  checkIn: 0, isMainGuest: true} });
    };

    _checkInHandler = () => {
        this.props.checkInCompanionsHandler(this.companions, false);
        this.props.updateAccompanyingPopUp({ variables: { guestId: 0, show: false,  checkIn: 0, isMainGuest: true} });
    };

    _companionValueChange = (guest_id, value) => {
        if(value) {
            this.companions.add(guest_id);
        } else {
            this.companions.delete(guest_id);
        }
    };

    render() {
        const getGuestDetails = (guest_id, editGuestHandler, replaceGuestHandler) => {
            return (
                <Query
                    query={GET_EVENT_GUEST_QUICK_DETAIL}
                    fetchPolicy={'network-only'}
                    variables={{ guest_id: parseInt(guest_id) }}
                >
                    {({ loading, error, data }) => {

                        if (loading) {
                            this.props.updateShowLoading({ variables: { show: true } });
                        }
                        if (error) {
                            this.props.updateShowLoading({ variables: { show: false } });
                        }

                        if (data.guest) {
                            this.props.updateShowLoading({ variables: { show: false } });

                            const companionsList = data.guest.companions.map(companion => {
                                return companion;
                            });

                            companionsList.push(data.guest);

                            const companions = companionsList.map(item => {
                                this.companions.add(item.guest_id);

                                return (
                                    <CompanionInput
                                        key={item.guest_id}
                                        data={item}
                                        onChange={ (guest_id, value) => this._companionValueChange(guest_id, value) }
                                        isCheckIn={this.check_in}
                                    />
                                );
                            });

                            return (
                                <Modal
                                    animationType="fade"
                                    transparent={true}
                                    visible={this.props.visible}
                                    onRequestClose={ _=> {} }
                                >
                                    <TouchableOpacity
                                        style={styles.modalContainer}
                                        activeOpacity={0.7}
                                        onPressOut={this._hideModalHandler}
                                    >
                                        <TouchableWithoutFeedback onPress={() => {}}>
                                            <View style={styles.modalDetailContainer}>
                                                <View style={{...styles.modalDetailContent, height: (companions.length > 3 ? 450 : 350)}}>

                                                    <ModalH1>Accompanying Person(s)</ModalH1>

                                                    <ModalH2>Do you also want to { this.check_in ? 'check in' : 'undo check in' } the following guest(s)?</ModalH2>

                                                    <ModalLabel>{'Accompanies'.toUpperCase() + ' (' + companions.length + ')'}</ModalLabel>

                                                    <ScrollView>
                                                        <View onStartShouldSetResponder={() => true}>
                                                            {companions}
                                                        </View>
                                                    </ScrollView>

                                                </View>
                                                <ModalControls>
                                                    <ModalControlButton
                                                        onPressHandler={() => { this._hideModalHandler() }}
                                                        positionLeft={true}
                                                        bgColor={pastelShades[3]}
                                                        textColor={strongShades.darkBlue}
                                                    >
                                                        No
                                                    </ModalControlButton>
                                                    <ModalControlButton
                                                        onPressHandler={() => { this._checkInHandler() }}
                                                        positionRight={true}
                                                        bgColor={strongShades.mint}
                                                        textColor={'white'}
                                                    >
                                                        {this.check_in ? 'Check in' : 'Undo Check in'}
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

        if (this.props.showAccompanyingPopUp) {
            this.guest_id = this.props.guestId;
            this.check_in = this.props.checkIn;
            this.isMainGuest = this.props.isMainGuest;
            guestDetail = getGuestDetails (this.guest_id);
        }

        return (
            <>{guestDetail}</>
        );

    };
}
const styles = StyleSheet.create({
    modalContainer: {
        width: '100%',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: (Dimensions.get('window').height < 667 ? '5%' : '10%'),
        paddingBottom: (Dimensions.get('window').height < 667 ? '5%' : '10%'),
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalDetailContainer: {
        width: (Dimensions.get('window').width < 768 ? '90%' : '80%'),
    },
    modalDetailContent: {
        width: '100%',
        backgroundColor: 'white',
        elevation: 20,
        padding: 10,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        paddingLeft: 28,
        paddingTop: 28,
        paddingRight: 28,
        paddingBottom: 28,
        marginTop: 70
    },
});

export default compose(
    graphql(
        updateShowLoadingQuery, { name: 'updateShowLoading' },
    ),
    graphql(
        updateAccompanyingPopUpQuery, { name: 'updateAccompanyingPopUp' }
    ),
    graphql(
        getAccompanyingPopUpQuery, getAccompanyingPopUpOptions,
    )
)(GuestAccompanyingPopUp);