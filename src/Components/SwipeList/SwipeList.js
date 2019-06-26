import React, { Component } from "react";
import { Animated, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, SwipeList } from "react-native";
import Guest from "../Guest/Guest";
import { pastelShades, strongShades } from "../UI/appStyles/appStyles";
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import IconStatus from "../UI/IconStatus/IconStatus";


export class GuestListSwipe extends Component {

    state = {
        listData: [],
    };

    constructor(props) {
        super(props);

        this.rowSwipeAnimatedValues = {};
        Array(20).fill('').forEach((_, i) => {
            this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
        });
    };

    closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    // deleteRow(rowMap, rowKey) {
    //     this.closeRow(rowMap, rowKey);
    //     const newData = [...this.state.listViewData];
    //     const prevIndex = this.state.listViewData.findIndex(item => item.key === rowKey);
    //     newData.splice(prevIndex, 1);
    //     this.setState({listViewData: newData});
    // }

    onRowDidOpen = (rowKey, rowMap) => {
        console.log('This row opened', rowKey);
    };


    render() {

        return (
            <View style={styles.container}>
            <SwipeListView
                useSectionList
                sections={this.props.listData}
                renderItem={ (data, rowMap) => (
                    <TouchableHighlight
                        onPress={ _ => this.props.guestDetailHandler(data.item.id) }
                        style={styles.rowFront}
                        underlayColor={'white'}
                    >
                        <Guest
                            id={data.item.id}
                            firstname={data.item.firstname}
                            lastname={data.item.lastname}
                            checkin={data.item.guest_checkin}
                            status={data.item.status}
                        />
                    </TouchableHighlight>
                )}
                renderHiddenItem={ (data, rowMap) => (
                    <View style={[styles.rowBack, styles.bgGreen]}>
                        <TouchableOpacity style={[styles.backLeftBtn, styles.backLeftBtnLeft]} onPress={ _ => this.closeRow(rowMap, data.item.key) }>
                            <Text style={styles.backTextCheckIn}>Check-in <IconStatus status='check-in' style={styles.backTextCheckIn} /></Text>
                        </TouchableOpacity>
                    </View>
                )}
                renderSectionHeader={({section}) => (
                    <SectionHeader title={section.title} status={section.status}/>
                )}
                leftOpenValue={180}
                stopLeftSwipe={300}
                disableLeftSwipe={true}
                onRowDidOpen={this.onRowDidOpen}
            />
            </View>
        );
    };
}


export class CheckedinListSwipe extends Component {

    state = {
        listData: [],
    };

    constructor(props) {
        super(props);
    };

    closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    onRowDidOpen = (rowKey, rowMap) => {
        console.log('This row opened', rowKey);
    };


    render() {
        return (
            <View style={styles.container}>
                <SwipeListView
                    useSectionList
                    sections={this.props.listData}
                    renderItem={ (data, rowMap) => (
                        <TouchableHighlight
                            onPress={ _ => (console.log("Guest press...")) }
                            style={styles.rowFront}
                            underlayColor={'white'}
                        >
                            <Guest
                                id={data.item.id}
                                firstname={data.item.firstname}
                                lastname={data.item.lastname}
                                status={data.item.status}
                                checkin_time={data.item.checkin_time}
                            />
                        </TouchableHighlight>
                    )}
                    renderHiddenItem={ (data, rowMap) => (
                        <View style={[styles.rowBack, styles.bgGray]}>
                            <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ _ => this.closeRow(rowMap, data.item.key) }>
                                <Text style={styles.backTextUndoCheckIn}>Undo Check-in </Text><IconStatus status='undocheck-in' style={styles.backTextUndoCheckIn} />
                            </TouchableOpacity>
                        </View>
                    )}
                    renderSectionHeader={({section}) => (
                        <SectionHeader title={section.title} status={section.status}/>
                    )}
                    rightOpenValue={-202}
                    stopRightSwipe={-300}
                    disableRightSwipe={true}
                    onRowDidOpen={this.onRowDidOpen}
                />
            </View>
        );
    };
}


const SectionHeader = (props) => {
    return (
        <View style={sectionHeaderStyles.container}>
            <View>
                <Text style={sectionHeaderStyles.content}>{props.title}</Text>
            </View>
            <View>
                <IconStatus status={props.status} section={true} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomColor: pastelShades[3],
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 64,
    },
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backLeftBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 180
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 202
    },
    backRightBtnRight: {
        backgroundColor: pastelShades[3],
        color: strongShades.darkBlue,
        right: 0
    },
    backLeftBtnLeft: {
        backgroundColor: pastelShades[8],
        color: strongShades.mint,
        left: 0
    },
    backTextCheckIn: {
        color: strongShades.mint,
        fontSize: 16,
        fontWeight: '600',
    },
    backTextUndoCheckIn: {
        color: strongShades.darkBlue,
        fontSize: 16,
        fontWeight: '600',
    },
    bgGreen: {
        backgroundColor: pastelShades[8],
    },
    bgGray: {
        backgroundColor: pastelShades[3],
    }
});

const sectionHeaderStyles = StyleSheet.create({
    container: {
        height: 31,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 40,
        paddingRight: 40,
        backgroundColor: pastelShades[3],
    },
    content: {
        color: strongShades.darkBlue,
    }
});

export default GuestListSwipe;