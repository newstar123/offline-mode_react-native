import React, { Component } from "react";
import {
    Platform,
    Modal,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';
import { compose, graphql } from 'react-apollo';
import {getShowSettingsMenuQuery, getShowSettingsMenuOptions, updateShowSettingsMenuQuery} from '../../apollo/queries';
import {pastelShades} from "../../Components/UI/appStyles/appStyles";
import {onSignOut} from "../../auth";

import { dimension, fontFamily, fontWeight } from "../../Theme";


class SettingsMenuModal extends Component {

    constructor(props) {
        super(props);
        this.navigate = props.navigate;
    }

    _settingsScreenHandler = () => {
        this.navigate('Settings');
        this._closeMenu();
    };

    _helpScreenHandler = () => {
        this.navigate('Help');
        this._closeMenu();
    };

    _logoutHandler = () => {
        onSignOut()
            .then(() => {
                this.navigate("SignedOut");
                this._closeMenu();
            })
    };

    _closeMenu = () => {
        this.props.updateShowSettingsMenu({ variables: { show: false } })
    };

    render() {

        let settingsMenu = null;

        if (this.props.showSettingsMenu !== false) {
            settingsMenu = (
                <Modal
                    animationType="none"
                    transparent={true}
                    fullScreen={true}
                    visible={true}
                >
                    <TouchableOpacity
                        style={styles.container}
                        activeOpacity={1}
                        onPressOut={this._closeMenu}
                    >
                        <TouchableWithoutFeedback>
                            <View style={styles.content}>
                                <View style={styles.topArrow} />
                                <View style={styles.inputContainer}>
                                    <TouchableOpacity onPress={this._settingsScreenHandler}>
                                        <Text style={styles.inputText}>Settings</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.inputContainer}>
                                    <TouchableOpacity onPress={this._helpScreenHandler}>
                                        <Text style={styles.inputText}>Help</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.inputContainer}>
                                    <TouchableOpacity onPress={this._logoutHandler}>
                                        <Text style={styles.inputText}>Logout</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                </Modal>
            );
        }

        return (
            <>
                {settingsMenu}
            </>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content: {
        width: (dimension.width < 768 ? 180 : 300),
        backgroundColor: 'white',
        elevation: 20,
        borderRadius: 4,
        marginTop: Platform.OS === "ios" ? (dimension.width >= 768 ? 70 
                                         : (dimension.width >= 375 && dimension.height >= 812) ? 95
                                         : 70) 
                                         : 50,
        marginRight: (dimension.width < 768 ? 5 : 20),
        alignSelf: 'flex-end',
    },
    topArrow: {
        width: 0,
        height:0,
        position: 'absolute',
        top: -23,
        right: (dimension.width < 768 ? 2 : 21),
        borderWidth: 12,
        borderStyle: 'solid',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'transparent',
        borderBottomColor: 'white',
    },
    inputText: {
        fontFamily: fontFamily.OpenSans,
        color: pastelShades[1],
        fontSize: (dimension.width < 768 ? 16 : 20),
        fontWeight: fontWeight.Normal,
        textAlign: 'justify',
        lineHeight: (Dimensions.get('window').width < 768 ? 50 : 65),
    },
    inputContainer: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: pastelShades[1],
        paddingLeft: 26,
    }
});

export default compose(
    graphql(getShowSettingsMenuQuery, getShowSettingsMenuOptions),
    graphql(updateShowSettingsMenuQuery, { name: 'updateShowSettingsMenu' }),
)(SettingsMenuModal);
