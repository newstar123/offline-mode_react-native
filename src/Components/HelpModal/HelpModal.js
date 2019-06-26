import React from 'react';
import {
    View,
    Text,
    StyleSheet, Dimensions, Image, SafeAreaView, Platform, Animated
} from 'react-native';
import {pastelShades} from "../UI/appStyles/appStyles";
import Swiper from 'react-native-swiper';
import Modal from "react-native-modal";
import { dimension, fontFamily, fontWeight } from '../../Theme';

const helpModal = (props) => {

    const SwiperDot = () => (
        <View style={styles.swiperDot}/>
    );

    const SwiperActiveDot = () => (
        <View style={styles.swiperActiveDot}/>
    );

    const CustomSwiper = (props) => {
        return (
            <Swiper
                // style={{ borderWidth: 3, borderColor: 'red' }}
                containerStyle={styles.wrapper}
                dot={<SwiperDot/>}
                activeDot={<SwiperActiveDot/>}
                removeClippedSubviews={false}
            >
                {props.children}
            </Swiper>
        );
    };

    const Slide = (props) => (
        <Animated.View style={[styles.slide, {height: (Platform.OS === 'ios' ? Dimensions.get('window').height : undefined)}]}>
            {props.children}
        </Animated.View>
    );

    const getHelp = () => {

        console.log("-----------------_> props.helpOption ", props.helpOption);

        switch (props.helpOption) {
            case 'help_event':
                return (
                    <View style={styles.modalContentContainer}>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.title}>How can I access an event in order to do the check-in?</Text>
                        </View>

                        <CustomSwiper>
                            <Slide>
                                <Text style={styles.text}>As soon as you log in, you will see an event overview. Just tap on the event you want to do the check-in for.</Text>
                            </Slide>
                            <Slide>
                                <Text style={styles.text}>You can get back to the event overview anytime by tapping the arrow in the upper left corner.</Text>
                            </Slide>
                        </CustomSwiper>
                    </View>
                );
            case 'help_guest1':
                return (
                    <View style={styles.modalContentContainer}>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.title}>How can I manually check-in a guest?</Text>
                        </View>

                        <CustomSwiper>
                            <Slide>
                                <Text style={styles.text}>Go to the guestlist and type the name of your guest into the search field.</Text>
                                <Image
                                    style={{flex:1, height: 'auto', width: '150%'}}
                                    source={require('../../../images/help_illustrations_Guestlist---Checkin-01.png')}
                                    resizeMode="contain"
                                />
                            </Slide>
                            <Slide>
                                <Text style={styles.text}>Swipe the line of your guests to the right.</Text>
                                <Image
                                    style={{flex:1, height: 'auto', width: '150%'}}
                                    source={require('../../../images/help_illustrations_Guestlist---Checkin-02.png')}
                                    resizeMode="contain"
                                />
                            </Slide>
                            <Slide>
                                <Text style={styles.text}>If your guest has accompanying persons, a popup will appear where you can decide if they also should be checked in.</Text>
                                <Image
                                    style={{flex:1, height: 'auto', width: '150%'}}
                                    source={require('../../../images/help_illustrations_Guestlist---Checkin-03.png')}
                                    resizeMode="contain"
                                />
                            </Slide>
                        </CustomSwiper>

                    </View>
                );
            case 'help_guest2':
                return (
                    <View style={styles.modalContentContainer}>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.title}>How can I undo a guest check-in?</Text>
                        </View>

                        <CustomSwiper>
                            <Slide>
                                <Text style={styles.text}>If you have accidently checked in a guest, go to the “Checked-in” section of the guest list.</Text>
                                <Image
                                    style={{flex:1, height: 'auto', width: '150%'}}
                                    source={require('../../../images/help_illustrations_Guestlist---Undo-Checkin-01.png')}
                                    resizeMode="contain"
                                />
                            </Slide>
                            <Slide>
                                <Text style={styles.text}>The person who was checked-in in most recently is always at the top. Swipe the guest line to the left in order to undo the check-in.</Text>
                                <Image
                                    style={{flex:1, height: 'auto', width: '150%'}}
                                    source={require('../../../images/help_illustrations_Guestlist---Undo-Checkin-02.png')}
                                    resizeMode="contain"
                                />
                            </Slide>
                            <Slide>
                                <Text style={styles.text}>You can also look for the guest who has accidently been checked in via the search field.</Text>
                                <Image
                                    style={{flex:1, height: 'auto', width: '150%'}}
                                    source={require('../../../images/help_illustrations_Guestlist---Undo-Checkin-03.png')}
                                    resizeMode="contain"
                                />
                            </Slide>
                        </CustomSwiper>
                    </View>
                );
            case 'help_guest3':
                return (
                    <View style={styles.modalContentContainer}>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.title}>How can I add a last-minute guest?</Text>
                        </View>

                        <CustomSwiper>
                            <Slide>
                                <Text style={styles.text}>Tap on the «Add guest» button in the upper right corner.</Text>
                            </Slide>
                            <Slide>
                                <Text style={styles.text}>Fill out the required fields. </Text>
                            </Slide>
                            <Slide>
                                <Text style={styles.text}>You can then either just save the guest to your guestlist or save & directly check the guest in.</Text>
                            </Slide>
                        </CustomSwiper>
                    </View>
                );
            case 'help_guest4':
                return (
                    <View style={styles.modalContentContainer}>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.title}>How can I edit a guest’s details?</Text>
                        </View>

                        <CustomSwiper>
                            <Slide>
                                <Text style={styles.text}>Go to the guestlist and type the name of your guest into the search field.</Text>
                            </Slide>
                            <Slide>
                                <Text style={styles.text}>Tap on the line of your guest. A popup will appear where you can tap the «Edit» button.</Text>
                            </Slide>
                            <Slide>
                                <Text style={styles.text}>Make the required changes in the form and tap the «Save» button.</Text>
                            </Slide>
                        </CustomSwiper>
                    </View>
                );
            case 'help_guest5':
                return (
                    <View style={styles.modalContentContainer}>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.title}>How can I replace a guest by another guest?</Text>
                        </View>

                        <CustomSwiper>
                            <Slide>
                                <Text style={styles.text}>Go to the guestlist and type the name of your guest into the search field.</Text>
                                <Image
                                    style={{flex:1, height: 'auto', width: '150%'}}
                                    source={require('../../../images/help_illustrations_Guestlist---Replacement-01.png')}
                                    resizeMode="contain"
                                />
                            </Slide>
                            <Slide>
                                <Text style={styles.text}>Tap on the line of your guest. A popup will appear where you can tap the «Replace» button.</Text>
                                <Image
                                    style={{flex:1, height: 'auto', width: '150%'}}
                                    source={require('../../../images/help_illustrations_Guestlist---Replacement-02.png')}
                                    resizeMode="contain"
                                />
                            </Slide>
                            <Slide>
                                <Text style={styles.text}>Fill out the required fields and tap the «Save» button.</Text>
                                <Image
                                    style={{flex:1, height: 'auto', width: '150%'}}
                                    source={require('../../../images/help_illustrations_Guestlist---Replacement-03.png')}
                                    resizeMode="contain"
                                />
                            </Slide>
                            <Slide>
                                <Text style={styles.text}>The replacement of a guest is marked as shown here:</Text>
                                <Image
                                    style={{flex:1, height: 'auto', width: '150%'}}
                                    source={require('../../../images/help_illustrations_Guestlist---Replacement-04.png')}
                                    resizeMode="contain"
                                />
                            </Slide>
                        </CustomSwiper>
                    </View>
                );
            case 'help_scan1':
                return (
                    <View style={styles.modalContentContainer}>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.title}>How can I check-in a guest with a QR code?</Text>
                        </View>

                        <CustomSwiper>
                            <Slide>
                                <Text style={styles.text}>Go to the «Scan» section.</Text>
                            </Slide>
                            <Slide>
                                <Text style={styles.text}>Once you have granted the app access to your phone camera, place the QR-code on your guest’s ticket in front of your camera.</Text>
                            </Slide>
                            <Slide>
                                <Text style={styles.text}>If the ticket is valid, your guest gets checked in.</Text>
                            </Slide>
                        </CustomSwiper>
                    </View>
                );
            case 'help_scan2':
                return (
                    <View style={styles.modalContentContainer}>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.title}>What tickets are compatible with the scan?</Text>
                        </View>

                        <CustomSwiper>
                            <Slide>
                                <Text style={styles.text}>When a registration confirmation is sent with eyevip to a guest, a ticket with a QR-code will be attached to this e-mail. These tickets are compatible with the scan.</Text>
                            </Slide>
                        </CustomSwiper>
                    </View>
                );
            default:
                return null;
        }
    };

    const content  = getHelp();

    return (
        <SafeAreaView style={styles.modalContainer}>
            <Modal
                isVisible={props.visible}
                onBackdropPress={props.closeMenu}
                // propagateSwipe={true}
                // onSwipeComplete={props.closeMenu}
                // swipeDirection="down"
                useNativeDriver={true}
                style={{justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}
            >
                {content}
            </Modal>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    modalContainer: {
        width: '100%',
        flex: 1,
        display: 'flex',
        borderWidth: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContentContainer: {
        width: (dimension.width >= 768 ? '80%' 
             : (dimension.width >= 375 && dimension.height >= 812) ? '90%'
             : '90%'),
        height: (dimension.width >= 768 ? 640 
              : (dimension.width >= 375 && dimension.height >= 812) ? 450
              : 450),
        borderWidth: 0,
    },
    wrapper: {
        overflow: 'hidden'
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: pastelShades[5],
        borderBottomStartRadius: 4,
        borderBottomEndRadius: 4,
        padding: (Dimensions.get('window').width < 768 ? 20 : 35),
    },
    text: {
        width: '100%',
        textAlign: 'left',
        fontFamily: fontFamily.OpenSans,
        fontSize: (Dimensions.get('window').width < 768 ? 14 : 18),
    },
    titleWrapper: {
        width: '100%',
        padding: (Dimensions.get('window').width < 768 ? 20 : 35),
        backgroundColor: '#fff',
        borderTopStartRadius: 4,
        borderTopEndRadius: 4,
    },
    title: {
        fontFamily: fontFamily.OpenSans,
        fontSize: (Dimensions.get('window').width < 768 ? 16 : 20),
    },
    swiperDot: {
        backgroundColor: 'rgba(0,0,0,.2)',
        width: 5,
        height: 5,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 10,
        marginBottom: 3
    },
    swiperActiveDot: {
        backgroundColor: '#000',
        width: 5,
        height: 5,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 10,
        marginBottom: 3
    }
});

export default helpModal;