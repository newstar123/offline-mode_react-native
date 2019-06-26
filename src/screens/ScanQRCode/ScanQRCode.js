import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    Image,
} from 'react-native';
import AES256 from 'aes-everywhere';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { pastelShades, strongShades } from "../../Components/UI/appStyles/appStyles";
import ScanQRCodeModal from '../../Components/ScanQRCodeModal/ScanQRCodeModal';
import EventProgressBar from "../../Components/EventProgressBar/EventProgressBar";
import IconSettings from "../../Components/UI/IconSettings/IconSettings";
import SettingsMenuModal from "../../Components/SettingsMenuModal/SettingsMenuModal";
import {compose, graphql, withApollo} from "react-apollo";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import {
    getSelectedEventOptions,
    getSelectedEventQuery,
    updateShowLoadingQuery,
    updateShowSettingsMenuQuery
} from "../../apollo/queries";
import {CHECKIN_GUEST, GET_EVENT_GUEST} from "../../apollo/queries/guests";
import Icon from "react-native-vector-icons/FontAwesome5";

import { withNavigation } from 'react-navigation';

class ScanQRCodeScreen extends Component {

    static navigationOptions = ({ navigation, navigationOptions }) => {
        let iconSize = (Dimensions.get('window').width < 768 ? 20 : 29);
        const { params } = navigation.state;
        return {
            title: navigation.getParam('title'),
            headerRight: (
                <IconSettings
                    navigate={navigation.navigate}
                    onPressHandler={navigation.getParam('toggleSettingsMenu')}
                />
            ),
            tabBarLabel: 'Scan',
            tabBarIcon: ({tintColor}) => (
                <Icon name={'qrcode'} size={iconSize} color={'white'} />
            )
        };
    };

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            guestId: null,
            eventId: 0,
            eventName: '',
            eventPassphrase: '',
            checkInModalVisible: false,
        };

    };

    componentDidMount() {
        this.props.navigation.setParams({title: this.props.currentEventName, toggleSettingsMenu: this._toggleSettingsMenu });
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.state.eventId !== this.props.currentEventId) {
            this.setState({
                eventId: this.props.currentEventId,
                eventName: this.props.currentEventName,
                eventPassphrase: this.props.currentEventPassphrase
            })

            // const key = this.props.currentEventPassphrase;
            // const qrCodeData = JSON.stringify({'guest_id': 51570});
            // let encrypt = AES256.encrypt(qrCodeData, key);
            //
            // console.log("---------------------> key: ", key);
            // console.log("---------------------> encrypt: ", encrypt);
            //
            // let decrypt = AES256.decrypt(encrypt, key);
            // const qrCodeGuestData = JSON.parse(decrypt);
            //
            // console.log("---------------------> qrCodeGuestData.guest_id: ", qrCodeGuestData.guest_id)

        }
    }

    onSuccess = (e) => {

        let guestId = 0;

        try {

            const qrCodeData = e.data;
            const key = this.state.eventPassphrase;

            let decrypt = AES256.decrypt(qrCodeData, key);

            const qrCodeGuestData = JSON.parse(decrypt);

            if (qrCodeGuestData.guest_id) {
                guestId = qrCodeGuestData.guest_id;
            }
        }
        catch(error) {
            this.setState({
                checkInModalVisible: true,
                guestData: null
            });
            return;
        }

        try {
            this._getData({
                guest_id: parseInt(guestId),
            }).then( data => {

                if (!data || data.guest === undefined || data.guest.event_id !== this.state.eventId) {

                    this.setState({
                        checkInModalVisible: true,
                        guestData: null
                    });

                } else {
                    // Check-in Guest...
                    if (parseInt(data.guest.guest_checkin) === 0) {

                        this._checkInGuest(
                            data.guest.guest_id
                        ).finally(() => {
                            this.setState({
                                checkInModalVisible: true,
                                guestData: data.guest
                            });
                        });
                    } else {
                        this.setState({
                            checkInModalVisible: true,
                            guestData: data.guest
                        });
                    }
                }

            }).catch(err => {
                console.log("Error trying to Check-in guest:", err);
                alert("Error trying to Check-in guest!");
            })

        }
        catch(error) {
            this.setState({
                checkInModalVisible: true,
                guestData: null
            });
        }

    };

    toggleResultModal = () => {
        this.scanner.reactivate();

        this.setState(prevState => {
            return ({
                checkInModalVisible: !prevState.checkInModalVisible,
            });
        });
    };

    _getData = async ({event_id, guest_id}) => {

        this.props.updateShowLoading({ variables: { show: true } });

        const gqlQueryOption = {
            query: GET_EVENT_GUEST,
            fetchPolicy: 'network-only',
            variables: {
                event_id: event_id,
                guest_id: guest_id,
            }
        };

        const { data } = await this.props.client.query(gqlQueryOption);

        this.props.updateShowLoading({ variables: { show: false } });
        return data;
    };

    _checkInGuest = async (guest_id) => {

        console.log("_checkInGuest: ", guest_id);

        this.props.updateShowLoading({ variables: { show: true } });

        await this.props.client.mutate({
            mutation: CHECKIN_GUEST,
            variables: { guest_id: guest_id },
        }).then(data => {
            this.props.updateShowLoading({ variables: { show: false } });
            return true;
        }).catch(err => {
            this.props.updateShowLoading({ variables: { show: false } });
            return false;
        });
    };

    _toggleSettingsMenu = () => {
        this.props.updateShowSettingsMenu({ variables: { show: true } })
    };


    render() {

        let helpText = null;
        if (!this.state.checkInModalVisible) {
            helpText = (
                <Text style={styles.helpText}>
                    Scan the code on your guests tickets.
                </Text>
            );
        }

        return (
            <>
                <LoadingModal />

                <SettingsMenuModal
                    navigate={this.props.navigation.navigate}
                />

                <View style={styles.container}>

                    {this.state.checkInModalVisible ?
                        <ScanQRCodeModal
                            guestData={this.state.guestData}
                            modalType={'checkIn'}
                            modalCloseHandler={this.toggleResultModal}
                        />
                    : null}

                    <QRCodeScanner
                        onRead={this.onSuccess.bind(this)}
                        showMarker={true}
                        customMarker={
                            <View>
                                <View style={styles.QRCodeMask}>
                                    <Text style={styles.helpText}>{helpText}</Text>
                                    <Image source={require('../../../images/qrcode_scan_mask.png')} />
                                </View>
                            </View>
                        }
                        cameraStyle={styles.QRCodeCamera}
                        containerStyle={styles.QRCodeContainer}
                        ref={(node) => { this.scanner = node }}
                    />

                    <EventProgressBar eventId={this.state.eventId} />
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
    helpText: {
        zIndex: 1000,
        fontSize: (Dimensions.get('window').width < 768 ? 18 : 22),
        color: pastelShades[1],
        position: 'absolute',
        top: '15%',
    },
    QRCodeMask: {
        zIndex: 10,
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    QRCodeCamera: {
        height: '100%',
    },
    QRCodeContainer: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomBarContainer: {
        width: '100%',
        height: 80,
        backgroundColor: strongShades.darkBlue,
    },
});


export default withApollo(
    withNavigation(
        compose(
            graphql(updateShowLoadingQuery, { name: 'updateShowLoading' }),
            graphql(updateShowSettingsMenuQuery, { name: 'updateShowSettingsMenu' }),
            graphql(getSelectedEventQuery, getSelectedEventOptions),
        )(ScanQRCodeScreen)
    )
);