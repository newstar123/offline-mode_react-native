import React from "react";
import { Modal, ActivityIndicator, StyleSheet, View } from 'react-native';
import { compose, graphql } from 'react-apollo';
import { getShowLoadingQuery, getShowLoadingOptions } from '../../apollo/queries';
import { strongShades } from "../../Components/UI/appStyles/appStyles";

const LoadingModal = props => {

    let loading = null;
    if (props.showLoading !== false) {
        loading = (
            <Modal
                animationType="none"
                transparent={true}
                fullScreen={true}
                visible={true}
            >
                <View style={styles.container}>
                    <View style={styles.content}>
                        <ActivityIndicator size="large" color={strongShades.darkBlue} />
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <>
            {loading}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.0)',
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default compose(
    graphql(getShowLoadingQuery, getShowLoadingOptions),
)(LoadingModal);
