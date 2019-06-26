import { pastelShades } from "../../Components/UI/appStyles/appStyles";
import React, { Component } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { withApollo } from 'react-apollo'
import LoadingModal from '../../Components/LoadingModal/LoadingModal';
import { SearchBar } from 'react-native-elements';



class SearchTest extends Component {

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

    state = {
        search: '',
    };

    constructor(props) {
        super(props);
    }

    updateSearch = search => {
        this.setState({ search });
    };



    testAES = () => {
        const aesjs = require('aes-js');

        // An example 128-bit key (16 bytes * 8 bits/byte = 128 bits)
        //var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
        //var key = this.returnHash("51655468576D5A7134743777217A2543");

        var enc = new TextEncoder(); // always utf-8
        var key = enc.encode("51655468576D5A7134743777217A2543");
        console.log(enc.encode("51655468576D5A7134743777217A2543"));


// Convert text to bytes
        //var text = 'Text may be any length you wish, no padding is required.';
        var text = '{"guest_id":"37", "guest_name":"Telmo"}';
        var textBytes = aesjs.utils.utf8.toBytes(text);

// The counter is optional, and if omitted will begin at 1
        var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        var encryptedBytes = aesCtr.encrypt(textBytes);

// To print or store the binary data, you may convert it to hex
        var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
        console.log(encryptedHex);
// "a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87
//  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788"

// When ready to decrypt the hex string, convert it back to bytes
        var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);

// The counter mode of operation maintains internal state, so to
// decrypt a new instance must be instantiated.
        var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        var decryptedBytes = aesCtr.decrypt(encryptedBytes);

// Convert our bytes back into text
        var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        console.log(decryptedText);
        console.log(JSON.parse(decryptedText));
// "Text may be any length you wish, no padding is required."



//         const aesjs = require('aes-js');
//
//         // An example 128-bit key
//         var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
//
// // The initialization vector (must be 16 bytes)
//         var iv = [ 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,35, 36 ];
//
// // Convert text to bytes (text must be a multiple of 16 bytes)
//         var text = 'TextMustBe16ByteTextMustBe16Byte';
//         //var text = '{"guest_id":"37", "guest_name":"Telmo"}';
//         var textBytes = aesjs.utils.utf8.toBytes(text);
//
//         var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
//         var encryptedBytes = aesCbc.encrypt(textBytes);
//
// // To print or store the binary data, you may convert it to hex
//         var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
//         console.log(encryptedHex);
// // "104fb073f9a131f2cab49184bb864ca2"
//
// // When ready to decrypt the hex string, convert it back to bytes
//         var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
//
// // The cipher-block chaining mode of operation maintains internal
// // state, so to decrypt a new instance must be instantiated.
//         var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
//         var decryptedBytes = aesCbc.decrypt(encryptedBytes);
//
// // Convert our bytes back into text
//         var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
//         console.log(decryptedText);
// "TextMustBe16Byte"


        // var AES = require('react-native-aes');
        // var Buffer = require('buffer').Buffer;
        //
        // var stringInput = 'hey ho';
        // var bufferInput = new Buffer(stringInput);
        //
        // // sample key
        // var key = new Buffer('f0ki13SQeRpLQrqk73UxhBAI7vd35FgYrNkVybgBIxc=', 'base64');
        // var cipherName = 'AES-256-CBC';
        // AES.encryptWithCipher(
        //     cipherName,   // String
        //     bufferInput,  // Buffer (input data)
        //     key,          // AES key, e.g. 32 bytes of random data
        //     function (err, encrypted) {
        //         //  "encrypted" is of the form
        //         //  {
        //         //    ciphertext: Buffer,
        //         //    iv: Buffer
        //         //  }
        //         //
        //         //  you'll need both parts to decrypt
        //
        //         AES.decryptWithCipher(
        //             cipherName,             // String
        //             encrypted.ciphertext,   // Buffer (input data)
        //             key,
        //             encrypted.iv,           // Buffer
        //             function (err, plaintext) {
        //                 // plaintext is a Buffer
        //                 if (plaintext.toString() !== stringInput) {
        //                     throw new Error('time to report an issue!')
        //                 }
        //             }
        //         )
        //     }
        // );

        alert("TEST AES");
    }

    render() {

        const { search } = this.state;

        return (
            <View style={styles.container}>
                <View style={{marginTop: 100,}}>

                    <LoadingModal/>

                    <View>

                        <SearchBar
                            placeholder="Type Here..."
                            onChangeText={this.updateSearch}
                            value={search}
                        />
                        <TouchableOpacity onPress={this.testAES}>
                            <View>
                                <Text sytle={{fontSize: 30}}>CLICK!</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

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

export default withApollo(SearchTest);
