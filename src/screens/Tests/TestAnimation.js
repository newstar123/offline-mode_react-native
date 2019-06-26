import { pastelShades } from "../../Components/UI/appStyles/appStyles";
import React, { Component } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    View,
    Animated,
    AppRegistry,
} from 'react-native';

import Swipeable from 'react-native-swipeable';
import SwipeableFlatListItem from './SwipeableFlatListItem';



class TestAnimation extends Component {

    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
        return {
            title: 'SignInForm...',
            headerRight: (
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={{ marginRight: (Dimensions.get('window').width < 768 ? 5 : 40), }} onPress={() => navigation.navigate('Events')}>
                        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>EVENTS</Text>
                    </TouchableOpacity>
                </View>
            ),
        };
    };

    constructor(props) {
        super(props);
    }

    state = {
        played: false,
        text: 'Welcome!',

        animation: new Animated.Value(50),
        a2: new Animated.Value(50),
        at: new Animated.Value(0),

        animationTest: new Animated.Value(50),
        a2T: new Animated.Value(250),
        atT: new Animated.Value(1),
    };

    openAnimation = () => {
        Animated.sequence([
            Animated.timing(this.state.animation, {
                toValue: Dimensions.get('window').height,
                duration: 250
            }),
            Animated.parallel([
                Animated.timing(this.state.a2, {
                    toValue: Dimensions.get('window').width,
                    duration: 500
                }),
                Animated.timing(this.state.at, {
                    toValue: 1,
                    duration: 500
                })
            ])
        ]).start(() => {
            this.setState({
                played: true
            });
        });
    }
    closeAnimation = () => {
        this.setState({
            text: 'Goodbye!'
        });

        Animated.sequence([
            Animated.timing(this.state.animation, {
                toValue: 50,
                duration: 250
            }),
            Animated.parallel([
                Animated.timing(this.state.a2, {
                    toValue: 50,
                    duration: 500
                }),
                Animated.timing(this.state.at, {
                    toValue: 0,
                    duration: 500
                })
            ])
        ]).start(() => {
            this.setState({
                text: 'Welcome!',
                played: false
            });
        });
    }
    startAnimation = () => {
        if(!this.state.played) {
            this.openAnimation();
        } else {
            this.closeAnimation();
        }
    }




    animationTest = () => {

        console.log("END ANIMATION....");

        Animated.sequence([
            Animated.parallel([
                Animated.timing(this.state.animationTest, {
                    toValue: 0,
                    duration: 1000
                }),
                Animated.timing(this.state.atT, {
                    toValue: 0,
                    duration: 200
                }),
            ])
        ]).start(() => {
            console.log("START ANIMATION....");
        });
    };

    startAnimationTest = () => {
        this.animationTest();
    };

    render() {

        const animatedStyles = {
            height: this.state.animation,
            width: this.state.a2
        };

        const a2Styles = {
            opacity: this.state.at
        };

        const animatedTestStyles = {
            height: this.state.animationTest,
            width: this.state.a2T
        };

        const a2TStyles = {
            opacity: this.state.atT
        };

        return (
            <View style={styles.container}>

                <TouchableWithoutFeedback onPress={this.startAnimationTest}>
                    <Animated.View style={[styles.boxTest, animatedTestStyles]}>
                        <Animated.Text style={[ styles.intro, a2TStyles ]}>BOX</Animated.Text>
                    </Animated.View>
                </TouchableWithoutFeedback>




                {/*<TouchableWithoutFeedback onPress={this.startAnimation}>
                    <Animated.View style={[styles.box, animatedStyles]}>
                        <Animated.Text style={[ styles.intro, a2Styles ]}>{this.state.text}</Animated.Text>
                    </Animated.View>
                </TouchableWithoutFeedback>*/}
            </View>
        );

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    intro: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold'
    },
    box: {
        width: 50,
        height: 50,
        backgroundColor: "tomato",
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxTest: {
        width: 250,
        height: 50,
        backgroundColor: "green",
        alignItems: 'center',
        justifyContent: 'center',
    }
});


export default TestAnimation;