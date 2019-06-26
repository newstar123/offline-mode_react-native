import React, { PureComponent } from 'react';
import { Animated, Dimensions } from 'react-native';
import Swipeable from 'react-native-swipeable-row';

class SwipeableFlatListItem extends PureComponent {
    constructor(props) {
        super(props);

        this._animated = new Animated.Value(0);
        this.state = {
            pan: new Animated.ValueXY(),
            rightActionActivated: false
        };
    }

    render() {
        const {
            children,
            onButtonsOpenRelease,
            onButtonsCloseRelease,
            ...rest
        } = this.props;

        const windowWidth = Dimensions.get('window').width;

        const deleteAnimation = {
            height: this._animated.interpolate({
                inputRange: [0, 1],
                outputRange: [60, 0],
                extrapolate: 'clamp'
            })
        };

        const collapseAnimation = {};
        if (this.state.rightActionActivated) {
            collapseAnimation.transform = [
                {
                    translateX: this.state.pan.x.interpolate({
                        inputRange: [-375, 0],
                        outputRange: [0, 0],
                        extrapolate: 'clamp'
                    })
                }
            ];
        }

        return (
            <Swipeable
                onLeftButtonsOpenRelease={onButtonsOpenRelease}
                onRightButtonsOpenRelease={onButtonsOpenRelease}
                onLeftButtonsCloseRelease={onButtonsCloseRelease}
                onRightButtonsCloseRelease={onButtonsCloseRelease}
                onPanAnimatedValueRef={pan => this.setState({ pan })}
                rightButtonContainerStyle={collapseAnimation}
                onRightActionActivate={() =>
                    this.setState({ rightActionActivated: true })
                }
                onRightActionDeactivate={(event, { x0 }, { state: { width } }) => {
                    if (width > x0 && x0 !== 0) {
                        this.setState({ rightActionActivated: false });
                    }
                }}
                rightActionReleaseAnimationFn={animatedXY => {
                    return Animated.sequence([
                        Animated.timing(animatedXY.x, {
                            toValue: -windowWidth,
                            duration: 250,
                            useNativeDriver: true
                        }),
                        Animated.timing(this._animated, {
                            toValue: 1,
                            duration: 200
                        })
                    ]);
                }}
                {...rest}
            >
                <Animated.View style={deleteAnimation}>{children}</Animated.View>
            </Swipeable>
        );
    }
}

export default SwipeableFlatListItem;