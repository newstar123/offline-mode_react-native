import {Dimensions, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, { Component } from "react";
import {pastelShades, strongShades} from "../appStyles/appStyles";

class FormSwitch extends Component {

    constructor(props) {
        super(props);

        let defaultValue = this.props.item1;
        if (this.props.defaultValue && (this.props.defaultValue === this.props.item1 || this.props.defaultValue === this.props.item2)) {
            defaultValue = this.props.defaultValue;
        }

        this.state = {
            selectedValue: defaultValue,
        };
    }

    render() {

        const _changeHandler = (value) => {
            this.props.onChangeHandler(value);
            this.setState({
                selectedValue: value,
            });
        };

        return (
            <View style={styles.controlsContainer}>
                <TouchableOpacity
                    onPress={() => _changeHandler(this.props.item1)}
                    style={[styles.button, styles.buttonLeft, this.state.selectedValue === this.props.item1 ? styles.switchButtonActive : styles.switchButton]}
                >
                    <Text style={{color: this.state.selectedValue === this.props.item1 ? pastelShades[0] : pastelShades[15], fontSize: 16,}}>
                        {this.props.item1}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => _changeHandler(this.props.item2)}
                    style={[styles.button, styles.buttonRight, this.state.selectedValue === this.props.item2 ? styles.switchButtonActive : styles.switchButton]}
                >
                    <Text style={{color: this.state.selectedValue === this.props.item2 ? pastelShades[0] : pastelShades[15], fontSize: 16,}}>
                        {this.props.item2}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    controlsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 75,
        paddingTop: 15,
        paddingBottom: 30,
    },
    button: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: (Dimensions.get('window').width < 768 ? 35 : 45),
        backgroundColor: pastelShades[3],
        color: strongShades.darkBlue,
    },
    buttonLeft: {
        borderTopLeftRadius: 22,
        borderBottomLeftRadius: 22,
    },
    buttonRight: {
        borderTopRightRadius: 22,
        borderBottomRightRadius: 22,
    },
    switchButtonActive: {
        backgroundColor: 'white',
        color: pastelShades[0],
    },
});


export default FormSwitch;
