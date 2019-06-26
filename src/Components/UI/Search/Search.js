import React, {Component} from 'react';
import {TextInput, View, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import {strongShades, pastelShades} from "../appStyles/appStyles";

import {SearchBar} from 'react-native-elements';
import {fontFamily} from "../../../Theme";

export const SearchContainer = props => {
    return (
        <View style={styles.container}>
            {props.children}
        </View>
    )
};

export class SearchInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            originalPlaceholder: props.placeholder,
            placeholder: props.placeholder,
            searchText: '',
        };
    }

    searchTextChanged = (searchText) => {
        this.setState({searchText: searchText})
    };

    render() {

        let rightButton = null;
        if (this.props.buttonHandler) {
            rightButton = (
                <TouchableOpacity activeOpacity={0.7} onPress={this.props.buttonHandler} style={styles.rightButtonContent}>
                    <Icon size={(Dimensions.get('window').width < 768 ? 20 : 24)} style={styles.icon} name='user-plus'/>
                </TouchableOpacity>
            );
        }

        const {searchText} = this.state;

        return (
            <View style={styles.searchContainer}>
                <View style={styles.inputContainer}>
                    <SearchBar
                        placeholder={this.state.placeholder}
                        onFocus={() => this.setState({placeholder: ""})}
                        onBlur={() => this.setState({placeholder: this.state.originalPlaceholder})}
                        onChangeText={this.searchTextChanged}
                        value={searchText}
                        placeholderTextColor={pastelShades[1]}
                        returnKeyType={"search"}
                        returnKeyLabel={"Search"}
                        onEndEditing={() => {
                            this.props.inputHandler(searchText)
                        }}
                        onClear={() => {
                            this.props.inputHandler('')
                        }}
                        containerStyle={styles.container}
                        inputContainerStyle={styles.searchContent}
                        inputStyle={{
                            fontFamily: fontFamily.OpenSans,
                            fontSize: (Dimensions.get('window').width < 768 ? 14 : 18),
                            color: 'white',
                            borderWidth: 0,
                        }}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                    />
                </View>
                {rightButton}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: strongShades.darkBlue,
        padding: 0,
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        paddingBottom: (Dimensions.get('window').width < 768 ? 5 : 10),
    },
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 0,
    },
    searchContent: {
        backgroundColor: pastelShades[12],
        borderStyle: 'solid',
        borderRadius: 50,
        paddingTop: (Dimensions.get('window').width < 768 ? 0 : 2),
        paddingBottom: (Dimensions.get('window').width < 768 ? 0 : 2),
        paddingLeft: (Dimensions.get('window').width < 768 ? 0 : 5),
        paddingRight: (Dimensions.get('window').width < 768 ? 0 : 5),
        height: (Dimensions.get('window').width < 768 ? 30 : 45),
    },
    iconSearch: {
        width: 16,
        marginLeft: 10,
    },
    inputContainer: {
        flex: 2,
        textAlign: 'left',
        borderWidth: 0,
        paddingLeft: (Dimensions.get('window').width < 768 ? 10 : 40),
        paddingRight: (Dimensions.get('window').width < 768 ? 10 : 40),
    },
    input: {
        fontFamily: fontFamily.OpenSans,
        height: (Dimensions.get('window').width < 768 ? 20 : 45),
        borderWidth: 0,
        color: 'white',
    },
    rightButtonContent: {
        display: 'flex',
        justifyContent: 'center',
        height: (Dimensions.get('window').width < 768 ? 30 : 55),
        marginRight: (Dimensions.get('window').width < 768 ? 10 : 40),
    },
    icon: {
        color: pastelShades[1],
        backgroundColor: 'transparent',
    },
    invalid: {
        backgroundColor: '#f9c0c0',
        borderColor: 'red'
    }
});