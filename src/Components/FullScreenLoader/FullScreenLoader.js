import React from 'react';

import { SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  loaderView: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%'
  }
});

class FullScreenLoader extends React.Component {

  render() {
    return (
      <SafeAreaView style={styles.loaderView}>
        <ActivityIndicator size={'large'} />
      </SafeAreaView>
    );
  }
}

export default FullScreenLoader