import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
    Input,
    FormValidationMessage,
    FormLabel,
} from 'react-native-elements';

class FormInput extends PureComponent {

    _handleChange = value => {
        this.props.onChange(this.props.name, value);
    };

    _handleTouch = () => {
        this.props.onTouch(this.props.name);
    };

    render() {
        const { label, error, ...rest } = this.props;
        return (
            <View>
                <FormLabel>{label}</FormLabel>
                <Input
                    onChangeText={this._handleChange}
                    onBlur={this._handleTouch}
                    placeholder={label}
                    {...rest}
                />
                {error && <FormValidationMessage>{error}</FormValidationMessage>}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        color: 'red',
    }
});



export default FormInput;