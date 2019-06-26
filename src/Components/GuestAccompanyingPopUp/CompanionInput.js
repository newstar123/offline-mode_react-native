import React, { Component } from "react";
import {Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";
import { pastelShades, strongShades } from "../UI/appStyles/appStyles";
import Icon from "react-native-vector-icons/FontAwesome5";


class CompanionInput extends Component {

    state = {
        checked: true
    };

    _toggleValue = (shouldIgnore) => {
        if(shouldIgnore)
            return;

        this.setState(prevState => {
            return { checked: !prevState.checked }
        });
        this.props.onChange(this.props.data.guest_id, !this.state.checked);
    };

    render() {
        let stateChecked = this.props.isCheckIn ? 1 : 0;
        let checkInMatchesGuestStatus = this.props.data.guest_checkin === stateChecked;

        const maxChars = (Dimensions.get('window').width < 768) ? 30 : 100;
        let fullName = this.props.data.guest_firstname + ' ' + this.props.data.guest_lastname;

        if (fullName.length > maxChars) {
            fullName = fullName.substring(0, maxChars) + '...';
        }

        return (
            <View style={[styles.container, checkInMatchesGuestStatus ? styles.disabled : '']}>
                <TouchableWithoutFeedback onPress={() => this._toggleValue(checkInMatchesGuestStatus)}>
                    <View style={styles.checkBox}>
                        {(
                            (this.state.checked && !checkInMatchesGuestStatus) ? <Icon name='check' size={16} color={strongShades.darkBlue} /> : null
                        )}
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => this._toggleValue(checkInMatchesGuestStatus)}>
                    <Text style={styles.label}>{fullName}</Text>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginBottom: 10,
    },
    checkBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 45,
        height: 45,
        backgroundColor: pastelShades[4],
    },
    label: {
        flex: 1,
        paddingLeft: 10,
    },
    disabled: {
        opacity: 0.5,
    },
});

export default CompanionInput;