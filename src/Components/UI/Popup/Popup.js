import React from 'react';
import { View, Modal } from 'react-native';

const popup = (props) => {

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.visible}
        >
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                {props.children}
            </View>
        </Modal>
    )

};

export default popup;