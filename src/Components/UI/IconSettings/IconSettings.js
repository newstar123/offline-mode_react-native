import React from "react";
import {Dimensions, TouchableOpacity} from "react-native";
import {pastelShades} from "../appStyles/appStyles";
import Icon from "react-native-vector-icons/FontAwesome5";


const iconSettings = ({onPressHandler, props}) => {

    return (
        <TouchableOpacity
            style={{ marginRight: (Dimensions.get('window').width < 768 ? 10 : 40), }}
            onPress={onPressHandler}
        >
            <Icon name='cog' size={(Dimensions.get('window').width < 768 ? 22 : 28)} color={pastelShades[1]} />
        </TouchableOpacity>
    );
};

export default iconSettings;

