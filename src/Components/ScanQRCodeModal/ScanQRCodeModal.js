import React, { Component } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Modal,
    StyleSheet,
    Dimensions,
    TouchableHighlight
} from 'react-native';
import { ModalH1, ModalLabel, ModalText, ModalHeader } from "../UI/ModalUI/ModalUI";
import PrettyDatetime from '../UI/PrettyDatetime/PrettyDatetime';
import { strongShades } from '../UI/appStyles/appStyles';


class ScanQRCodeModal extends Component {


    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        console.log("ScanQRCodeModal ---------------> componentDidUpdate guestData: ", this.props.guestData);

    }


    render() {

        const renderCompanions = (companions) => {
            if (companions === undefined) return null;
            return companions.map(companion => {
                return (
                    <View key={companion.guest_id}>
                        <ModalText>{companion.guest_firstname} {companion.guest_lastname}</ModalText>
                        {/*<ModalText>+1</ModalText>*/}
                    </View>
                );
            });
        };

        const getContent = (guest) => {

            let checkInStatus = -1;
            if (guest) {
                checkInStatus = parseInt(guest.guest_checkin);
            }

            switch (checkInStatus) {
                // Not Checked-in
                case (0):
                    return (
                        <View style={styles.modalContentContainer}>
                            <ModalHeader type={"success"}>Check-in</ModalHeader>
                            <ScrollView>
                                <TouchableHighlight>
                                    <TouchableWithoutFeedback>
                                        <View style={styles.modalContent}>
                                            <ModalH1>{guest.guest_firstname} {guest.guest_lastname}</ModalH1>

                                            <ModalLabel>{'Accompanies'.toUpperCase()}</ModalLabel>
                                            {renderCompanions(guest.companions)}

                                            <ModalLabel>{'Invited by'.toUpperCase()}</ModalLabel>
                                            <ModalText>{ guest.guest_behalf_firstname.length ? guest.guest_behalf_firstname + ' ' + guest.guest_behalf_lastname : 'N/A' }</ModalText>

                                            <ModalLabel>{'Company'.toUpperCase()}</ModalLabel>
                                            <ModalText>{ guest.guest_company.length ? guest.guest_company : 'N/A' }</ModalText>

                                            <ModalLabel>{'Notes'.toUpperCase()}</ModalLabel>
                                            <ModalText>{ guest.guest_comment.length ? guest.guest_comment : 'N/A' }</ModalText>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </TouchableHighlight>
                            </ScrollView>
                        </View>
                    );
                // Already Checked-in
                case 1:
                    return (
                        <View style={[styles.modalContentContainer, {height: (Dimensions.get('window').width < 768 ? 370 : 370)}]}>
                            <ModalHeader type={"warning"}>Already Check-in</ModalHeader>
                            <ScrollView>
                                <TouchableHighlight>
                                    <TouchableWithoutFeedback>
                                        <View style={styles.modalContent}>
                                            <ModalH1>{guest.guest_firstname} {guest.guest_lastname}</ModalH1>

                                            <ModalLabel>{'Accompanies'.toUpperCase()}</ModalLabel>
                                            {renderCompanions(guest.companions)}

                                            <ModalLabel>{'Check-in time'.toUpperCase()}</ModalLabel>
                                            { guest.guest_checkin_time.length ?
                                                <PrettyDatetime textStyles={{color: strongShades.darkBlue, fontSize: 16}} datetime={guest.guest_checkin_time} />
                                                : <ModalText>'N/A'</ModalText>
                                            }

                                        </View>
                                    </TouchableWithoutFeedback>
                                </TouchableHighlight>
                            </ScrollView>
                        </View>
                    );
                default:
                    return (
                        <View style={[styles.modalContentContainer, {height: (Dimensions.get('window').width < 768 ? 370 : 370)}]}>
                            <ModalHeader type={"error"}>Ticket not valid</ModalHeader>
                            <ScrollView>
                                <TouchableHighlight>
                                    <TouchableWithoutFeedback>
                                        <View style={styles.modalContent}>

                                            <ModalText>This ticket doesn't match with any guest in your guestlist.</ModalText>
                                            <ModalText>This can happen, if the guest has been deleted from you list after being invited.</ModalText>

                                            <ModalText style={{fontWeight: 'bold'}}>How can I fix this?</ModalText>
                                            <ModalText>Search the guest by name in the guestlist or add him/her as a new guest.</ModalText>

                                        </View>
                                    </TouchableWithoutFeedback>
                                </TouchableHighlight>
                            </ScrollView>
                        </View>
                    );
            }
        };

        const content = getContent(this.props.guestData);

        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={true}
                onRequestClose={ _=> {} }
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPressOut={this.props.modalCloseHandler}
                >
                    <TouchableWithoutFeedback>
                        {content}
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        )
    };
}

const styles = StyleSheet.create({
    modalContainer: {
        zIndex: 10000,
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //paddingTop: (Dimensions.get('window').width < 768 ? 70 : 220),
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContentContainer: {
        width:  (Dimensions.get('window').width < 768 ? 300 : 400),
        height: (Dimensions.get('window').width < 768 ? 370 : 470),
        borderRadius: 3,
        backgroundColor: 'white',
    },
    modalContent: {
        flex: 1,
        paddingLeft: 28,
        paddingTop: 28,
        paddingRight: 28,
        paddingBottom: 28,
    },
});

export default ScanQRCodeModal;