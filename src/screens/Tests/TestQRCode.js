import { pastelShades } from "../../Components/UI/appStyles/appStyles";
import React, { Component } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Linking
} from 'react-native';
import LoadingModal from '../../Components/LoadingModal/LoadingModal';

import { RNCamera, FaceDetector } from 'react-native-camera';

import QRCodeScanner from 'react-native-qrcode-scanner';


class TestQRCode extends Component {

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

    testEverywhere = () => {
        alert("TEST!");
    };

    onSuccess = (e) => {
        Linking
            .openURL(e.data)
            .catch(err => console.error('An error occured', err));
    };



    render() {

        return (
            <QRCodeScanner
                onRead={this.onSuccess}
                topContent={
                    <Text style={styles.centerText}>
                        Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.
                    </Text>
                }
                bottomContent={
                    <TouchableOpacity style={styles.buttonTouchable}>
                        <Text style={styles.buttonText}>OK. Got it!</Text>
                    </TouchableOpacity>
                }
            />
        );
        // return (
        //     <View style={styles.container}>
        //         <View style={{marginTop: 100,}}>
        //
        //             <LoadingModal/>
        //
        //             <View>
        //
        //                 <TouchableOpacity onPress={this.testEverywhere}>
        //                     <View>
        //                         <Text sytle={{fontSize: 30}}>Test</Text>
        //                     </View>
        //                 </TouchableOpacity>
        //
        //
        //
        //
        //             </View>
        //
        //         </View>
        //     </View>
        // );

    }
}


const styles = StyleSheet.create({
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
});


export default TestQRCode;
