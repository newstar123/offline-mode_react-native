import React from "react";
import Swiper from "react-native-swiper";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import {pastelShades} from "../../Components/UI/appStyles/appStyles";

const SwiperTest = () => {
    const SwiperDot = () => (
        <View style={styles.swiperDot}/>
    );

    const SwiperActiveDot = () => (
        <View style={styles.swiperActiveDot}/>
    );

    const CustomSwiper = (props) => (
        <Swiper
            dot={<SwiperDot/>}
            activeDot={<SwiperActiveDot/>}
        >
            {props.children}
        </Swiper>
    );

    return (
        <View style={styles.wrapper}>
            <CustomSwiper>
                <View style={[styles.slide, {justifyContent: 'center'}]}>
                    <Text style={styles.text}>As soon as you log in, you will see an event overview. Just tap on the event you want to do the check-in for.</Text>
                </View>
                <View style={[styles.slide, {justifyContent: 'center'}]}>
                    <Text style={styles.text}>You can get back to the event overview anytime by tapping the arrow in the upper left corner.</Text>
                </View>
            </CustomSwiper>
        </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        height: 400,
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: pastelShades[0],
        borderBottomStartRadius: 4,
        borderBottomEndRadius: 4,
        padding: (Dimensions.get('window').width < 768 ? 20 : 35),
    },
    text: {
        width: '100%',
        textAlign: 'left',
        fontSize: (Dimensions.get('window').width < 768 ? 14 : 18),
    },
    titleWrapper: {
        padding: (Dimensions.get('window').width < 768 ? 20 : 35),
        backgroundColor: '#fff',
        borderTopStartRadius: 4,
        borderTopEndRadius: 4,
    },
    title: {
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

export default SwiperTest;