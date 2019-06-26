import {pastelShades, strongShades} from "../../Components/UI/appStyles/appStyles";
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
    FlatList,
} from 'react-native';

import Swipeable from 'react-native-swipeable';
import Guest from "../../Components/Guest/Guest";
import IconStatus from "../../Components/UI/IconStatus/IconStatus";


class TestListAnimation extends Component {

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
        const { navigation } = this.props;

        this.demoData = [
            {id:"1", title: "...1.."},
            {id:"2", title: "...2.."},
            {id:"3", title: "...3.."},
            {id:"4", title: "...4.."},
            {id:"5", title: "...5.."},
            {id:"6", title: "...6.."},
            {id:"7", title: "...7.."},
            {id:"8", title: "...8.."},
            {id:"9", title: "...9.."},
            {id:"10", title: "...10.."},
            {id:"11", title: "...11.."},
            {id:"12", title: "...12.."},
        ];

        this.state = {
            event_id: navigation.getParam('eventId', 0),
            event_name: navigation.getParam('eventName', ''),
            data: [...this.demoData],
        };
    }

    _updateData = () => {
        this.setState({
            data: [...this.demoData],
        });
    };

    _removeItem = (idx) => {
        const dt = this.state.data.filter(item => {
            return item.id !== idx
        });

        this.setState({
            data: [...dt],
        });
    };



    render() {
        return (
            <View style={[styles.container]}>
                <View style={{flex: 1, width: '100%', backgroundColor: pastelShades[5]}}>
                    <Text>LIST TEST</Text>
                    <TouchableHighlight onPress={() => this._updateData()}>
                        <Text style={{color: 'red', fontWeight: 'bold'}}>RESET</Text>
                    </TouchableHighlight>
                    <MultiSelectList
                        data={this.state.data}
                        deleteItemHandler={(idx) => this._removeItem(idx)}
                    />
                </View>
            </View>
        );

    }
}

class GuestListItem extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            actionActivated: false,
            animationListItemHeight: new Animated.Value(64),
            animationListInnerItemHeight: new Animated.Value(64),
            animationListInnerItemOpacity: new Animated.Value(1),
        };
    }

    _onDeleteItem = () => {
        this.props.onDeleteItem(this.props.id);
    };

    render() {

        const stylesItem = StyleSheet.create({
            listItem: {
                alignItems: 'center',
                backgroundColor: 'white',
                borderBottomColor: pastelShades[3],
                borderBottomWidth: 1,
                justifyContent: 'center',
                height: 64,
            },
            leftSwipeItem: {
                flex: 1,
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingRight: 20
            },
            rightSwipeItem: {
                flex: 1,
                justifyContent: 'center',
                paddingLeft: 20
            },
            textCheckIn: {
                color: strongShades.mint,
                fontSize: 16,
                fontWeight: '600',
            },
            textUndoCheckIn: {
                color: strongShades.darkBlue,
                fontSize: 16,
                fontWeight: '600',
            },
            bgGreen: {
                backgroundColor: pastelShades[8],
            },
            bgGray: {
                backgroundColor: pastelShades[3],
            },
        });


        if (this.state.actionActivated) {
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(this.state.animationListItemHeight, {
                        toValue: 0,
                        duration: 600
                    }),
                    Animated.timing(this.state.animationListInnerItemOpacity, {
                        toValue: 0,
                        duration: 300
                    }),
                    Animated.timing(this.state.animationListInnerItemHeight, {
                        toValue: 0,
                        duration: 600
                    }),
                ])
            ]).start(() => {
                this._onDeleteItem();
            });
        }

        const animatedListItemStyles = {
            height: this.state.animationListItemHeight
        };

        const animatedListInnerItemStyles = {
            height: this.state.animationListInnerItemHeight,
            opacity: this.state.animationListInnerItemOpacity
        };

        const actionActivationDistance = Math.round(Dimensions.get('window').width/2);

        return (
            <Swipeable
                leftContent={(
                    <Animated.View style={[stylesItem.leftSwipeItem, stylesItem.bgGreen, animatedListInnerItemStyles]}>
                        <Text style={styles.textCheckIn}>
                            <IconStatus status='check-in' style={styles.textCheckIn} /> Check-In
                        </Text>
                    </Animated.View>
                )}
                swipeStartMinLeftEdgeClearance={10}
                swipeStartMinRightEdgeClearance={0}
                leftActionActivationDistance={actionActivationDistance}
                onLeftActionRelease={() => {
                    this.setState({ actionActivated: true })
                }}
            >
                <TouchableWithoutFeedback onPress={() => {
                    console.log("ITEM PRESS!")
                }}>
                    <Animated.View style={[stylesItem.listItem, animatedListItemStyles]}>
                        <Guest
                            id={this.props.id}
                            firstName={this.props.guest_firstname}
                            style={animatedListInnerItemStyles}
                        />
                    </Animated.View>
                </TouchableWithoutFeedback>
            </Swipeable>

        );

    }

}

class MultiSelectList extends React.PureComponent {
    state = {selected: (new Map(): Map<string, boolean>)};

    _keyExtractor = (item, index) => item.id;

    _onPressItem = (id: string) => {

        this.props.onPressItemHandler(id);

        // updater functions are preferred for transactional updates
        this.setState((state) => {
            // copy the map rather than modifying state.
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id)); // toggle
            return {selected};
        });
    };

    _onDeleteItem = (id: string) => {
        this.props.deleteItemHandler(id);
    };



    _renderItem = ({item, index, section}) => (
        <GuestListItem
            id={item.id}
            guest_id={item.id}
            guest_firstname={item.title}
            onPressItem={this._onPressItem}
            onDeleteItem={this._onDeleteItem}
            selected={!!this.state.selected.get(item.id)}
        />
    );

    render() {

        console.log("---------------------> Item", this.props.data);

        return (
            <FlatList
                data={this.props.data}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
            />
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


export default TestListAnimation;