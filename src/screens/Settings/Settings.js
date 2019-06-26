import React, { Component } from "react";
import {StyleSheet, View, Text, TouchableOpacity, Switch, Dimensions} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";
import {pastelShades, strongShades} from "../../Components/UI/appStyles/appStyles";
import SettingsModal from "../../Components/SettingsModal/SettingsModal";
import SettingsMenuModal from "../../Components/SettingsMenuModal/SettingsMenuModal";
import IconSettings from "../../Components/UI/IconSettings/IconSettings";
import {compose, graphql, withApollo} from "react-apollo";
import {updateShowSettingsMenuQuery} from "../../apollo/queries";

import { dimension, fontFamily, fontWeight } from "../../Theme";


class SettingsScreen extends Component {

    state = {
        settingsMenuVisible: false,
        informationModalVisible: false,
        informationOption: null,
        offlineToggleSwitch: false,
        otherToggleSwitch: true,
    };

    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
        return {
            title: 'Settings',
            headerRight: (
                <IconSettings
                    navigate={navigation.navigate}
                    onPressHandler={navigation.getParam('toggleSettingsMenu')}
                />
            ),
        };
    };

    componentDidMount() {
        this.props.navigation.setParams({
            toggleSettingsMenu: this._toggleSettingsMenu
        });
    }

    _toggleSettingsMenu = () => {
        this.props.updateShowSettingsMenu({ variables: { show: true } })
    };

    toggleInformationModal = (option) => {
        this.setState(prevState => {
            return ({
                informationModalVisible: !prevState.informationModalVisible,
                informationOption: !prevState.informationModalVisible ? option : null,
            });
        });
    };

    switchColor = (value) => {
        if (value) {
            return strongShades.mint;
        }
        return pastelShades[2];
    };


    render() {
        return (
            <>
                <SettingsMenuModal
                    navigate={this.props.navigation.navigate}
                />

                <SettingsModal
                    visible={this.state.informationModalVisible}
                    closeMenu={this.toggleInformationModal}
                    informationOption={this.state.informationOption}
                />

                <View style={styles.container}>
                    <View style={styles.optionContainer}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.optionText}>Setting option</Text>
                            <TouchableOpacity onPress={() => this.toggleInformationModal('offline-synchronization')}>
                                <Icon name='info-circle' size={18} style={{ paddingLeft: 22}} color={pastelShades[1]} />
                            </TouchableOpacity>
                        </View>
                        <Switch
                            trackColor={{false: 'white', true: 'white'}}
                            ios_backgroundColor={'white'}
                            tintColor={'white'}
                            thumbColor={this.switchColor(this.state.offlineToggleSwitch)}
                            value={this.state.offlineToggleSwitch}
                            onValueChange={() => {
                                this.setState(prevState => {
                                    return ({
                                        offlineToggleSwitch: !prevState.offlineToggleSwitch
                                    });
                                });
                            }}
                        />
                    </View>
                    <View style={styles.optionContainer}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.optionText}>Other Setting Example</Text>
                        </View>
                        <Switch
                            trackColor={{false: 'white', true: 'white'}}
                            ios_backgroundColor={'white'}
                            tintColor={'white'}
                            thumbColor={this.switchColor(this.state.otherToggleSwitch)}
                            value={this.state.otherToggleSwitch}
                            onValueChange={() => {
                                this.setState(prevState => {
                                    return ({
                                        otherToggleSwitch: !prevState.otherToggleSwitch
                                    });
                                });
                            }}
                        />
                    </View>
                </View>
            </>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: pastelShades[5],
    },
    optionContainer: {
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: pastelShades[3],
        paddingLeft: (Dimensions.get('window').width < 768 ? 10 : 40),
        paddingRight: (Dimensions.get('window').width < 768 ? 10 : 40),
        height: (Dimensions.get('window').width < 768 ? 70 : 90),
    },
    optionText: {
        fontFamily: fontFamily.OpenSans,
        fontSize: 18,
        fontWeight: fontWeight.Normal,
        color: pastelShades[1],
    }

});

export default withApollo(
    compose(
        graphql(updateShowSettingsMenuQuery, { name: 'updateShowSettingsMenu' })
    )(SettingsScreen)
);

