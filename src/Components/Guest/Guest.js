import React, { Component } from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {pastelShades, strongShades} from "../UI/appStyles/appStyles";
import IconStatus from '../UI/IconStatus/IconStatus';
import PrettyDatetime from '../UI/PrettyDatetime/PrettyDatetime';


class Guest extends Component {

    _formatFirstName = (str) => {
        const maxCharsScrMin = 3;
        const maxCharsScrMax = 3;
        let res = '';

        if (str === undefined) {
            return '';
        }

        if (Dimensions.get('window').width < 768) {
            res = str.slice(0, maxCharsScrMin);
            if (str.length > maxCharsScrMin) {
                res += '.';
            }
        } else {
            res = str;
        }
        return res;
    };

    _formatLastName = (str) => {
        const maxCharsScrMin = 18;
        const maxCharsScrMax = 50;
        let res = '';

        if (str === undefined) {
            return '';
        }

        if (Dimensions.get('window').width < 768) {
            res = str.slice(0, maxCharsScrMin);
            if (str.length > maxCharsScrMin) {
                res += '...';
            }
        } else {
            res = str.slice(0, maxCharsScrMax);
            if (str.length > maxCharsScrMax) {
                res += '...';
            }
        }
        return res;
    };

    render() {

        let guestReplaced = null;
        if (this.props.status.toUpperCase() === 'DECLINED' && (this.props.behalfFirstname || this.props.behalfLastname)) {
            guestReplaced = (
                <Text style={styles.replaced}>
                    (replaced)
                </Text>
            );
        } else if (this.props.status.toUpperCase() !== 'DECLINED' && (this.props.behalfFirstname || this.props.behalfLastname)) {
            guestReplaced = (
                <>
                    <Text style={[styles.guestContent, styles.replaced]}>(</Text>
                    <Text style={[styles.guestContent, styles.guestBehalf]}>
                        {this._formatLastName(this.props.behalfLastname)} {this._formatFirstName(this.props.behalfFirstname)}
                    </Text>
                    <Text style={[styles.guestContent, styles.guestBehalf]}>)</Text>
                </>
            );
        }


        return (
            <TouchableOpacity activeOpacity={0.7} style={styles.guestContainer} onPress={this.props.guestClicked} >
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.guestContent}>
                        {this._formatLastName(this.props.lastName)} {this._formatFirstName(this.props.firstName)} {guestReplaced}
                    </Text>
                </View>
                <View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                        <PrettyDatetime datetime={this.props.checkinTime} />
                        <IconStatus status={this.props.status} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    guestContainer: {
        width: '100%',
        height: 31,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: (Dimensions.get('window').width < 768 ? 10 : 40),
        paddingRight: (Dimensions.get('window').width < 768 ? 10 : 40),
    },
    guestContent: {
        color: strongShades.darkBlue,
    },
    replaced: {
        color: pastelShades[1]
    },
    guestBehalf: {
        color: pastelShades[1],
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    }
});

export default Guest;
