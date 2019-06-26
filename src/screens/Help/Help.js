import React, { Component } from "react";
import {StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import {pastelShades, strongShades} from "../../Components/UI/appStyles/appStyles";
import HelpModal from "../../Components/HelpModal/HelpModal";
import {compose, graphql, withApollo} from "react-apollo";
import {updateShowSettingsMenuQuery} from "../../apollo/queries";
import IconSettings from "../../Components/UI/IconSettings/IconSettings";
import SettingsMenuModal from "../../Components/SettingsMenuModal/SettingsMenuModal";
import { fontFamily, fontWeight } from "../../Theme";

class HelpScreen extends Component {

    state = {
        helpModalVisible: false,
        helpOption: null,
        helpModalSmaller: false,
    };

    static navigationOptions = ({ navigation, navigationOptions }) => {
        let iconSize = (Dimensions.get('window').width < 768 ? 20 : 29);
        const { params } = navigation.state;
        return {
            title: 'Help',
            headerRight: (
                <IconSettings
                    navigate={navigation.navigate}
                    onPressHandler={navigation.getParam('toggleSettingsMenu')}
                />
            ),
        };
    };

    constructor(props) {
        super(props);
        const {navigation} = this.props;
    }

    componentDidMount() {
        this.props.navigation.setParams({
            toggleSettingsMenu: this._toggleSettingsMenu
        });
    }

    _toggleSettingsMenu = () => {
        this.props.updateShowSettingsMenu({ variables: { show: true } })
    };

    toggleHelpModal = (option, smaller) => {
        this.setState(prevState => {
            return ({
                helpModalVisible: !prevState.helpModalVisible,
                helpOption: !prevState.helpModalVisible ? option : null,
                helpModalSmaller: smaller,
            });
        });
    };

    render() {
        return (
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <SettingsMenuModal
                    navigate={this.props.navigation.navigate}
                />

                <HelpModal
                    visible={this.state.helpModalVisible}
                    closeMenu={this.toggleHelpModal}
                    helpOption={this.state.helpOption}
                    smaller={this.state.helpModalSmaller}
                />

                <View style={styles.container}>
                    <View style={styles.optionContainer}>
                        <View style={styles.sectionLabel}>
                            <Text style={styles.sectionText}>Event overview</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.7} style={styles.optionTextContainer} onPress={() => this.toggleHelpModal('help_event', true)}>
                            <View >
                                <Text style={styles.optionText}>How can I access an event in order to do the check-in?</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.sectionLabel}>
                            <Text style={styles.sectionText}>Guestlist</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.7} style={styles.optionTextContainer} onPress={() => this.toggleHelpModal('help_guest1', false)}>
                            <View >
                                <Text style={styles.optionText}>How can I manually check-in a guest?</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} style={styles.optionTextContainer} onPress={() => this.toggleHelpModal('help_guest2', false)}>
                            <View >
                                <Text style={styles.optionText}>How can I undo a guest check-in?</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} style={styles.optionTextContainer} onPress={() => this.toggleHelpModal('help_guest3', true)}>
                            <View >
                                <Text style={styles.optionText}>How can I add a last-minute guest?</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} style={styles.optionTextContainer} onPress={() => this.toggleHelpModal('help_guest4', true)}>
                            <View >
                                <Text style={styles.optionText}>How can I edit a guest’s details?</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} style={styles.optionTextContainer} onPress={() => this.toggleHelpModal('help_guest5', false)}>
                            <View >
                                <Text style={styles.optionText}>How can I replace a guest by another guest?</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.sectionLabel}>
                            <Text style={styles.sectionText}>Scan</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.7} style={styles.optionTextContainer} onPress={() => this.toggleHelpModal('help_scan1', true)}>
                            <View >
                                <Text style={styles.optionText}>How can I check-in a guest with a QR code?</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} style={styles.optionTextContainer} onPress={() => this.toggleHelpModal('help_scan2', true)}>
                            <View >
                                <Text style={styles.optionText}>What tickets are compatible with the scan?</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: pastelShades[5],
    },
    optionContainer: {
        flex: 1,
        width: '100%',
        paddingLeft: (Dimensions.get('window').width < 768 ? 15 : 39),
        paddingTop: 10,
        paddingRight: (Dimensions.get('window').width < 768 ? 15 : 39),
    },
    optionTextContainer: {
        width: '100%',
        backgroundColor: 'white',
        padding: (Dimensions.get('window').width < 768 ? 20 : 35),
        marginTop: 16,
        borderStyle: 'solid',
        borderRadius: 4,
        borderBottomWidth: 1,
        borderBottomColor: pastelShades[1],
    },
    optionText: {
        fontFamily: fontFamily.OpenSans,
        fontSize: (Dimensions.get('window').width < 768 ? 16 : 20),
        color: strongShades.darkBlue,
    },
    sectionLabel: {
        marginTop: 15,
    },
    sectionText: {
        fontFamily: fontFamily.OpenSans,
        fontSize: 14,
        fontWeight: '600',
        color: pastelShades[1],
    }
});

export default withApollo(
    compose(
        graphql(updateShowSettingsMenuQuery, { name: 'updateShowSettingsMenu' })
    )(HelpScreen)
);