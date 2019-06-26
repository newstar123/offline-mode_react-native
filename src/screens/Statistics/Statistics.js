import React, { Component } from "react";
import {StyleSheet, View, Dimensions, TouchableOpacity, Text} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";

import {pastelShades, strongShades} from "../../Components/UI/appStyles/appStyles";
import {onSignOut} from "../../auth";
import SettingsMenuModal from "../../Components/SettingsMenuModal/SettingsMenuModal";

import { Path } from 'react-native-svg'
import { AreaChart, LineChart, BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'
import * as scale from 'd3-scale'
import * as shape from 'd3-shape'
import dateFns from 'date-fns'
import {compose, graphql, withApollo} from "react-apollo";
import {withNavigation} from "react-navigation";
import {
    getSelectedEventOptions,
    getSelectedEventQuery,
    updateShowLoadingQuery,
    updateShowSettingsMenuQuery
} from "../../apollo/queries";
import IconSettings from "../../Components/UI/IconSettings/IconSettings";



class StatisticsScreen extends Component {

    static navigationOptions = ({ navigation, navigationOptions }) => {
        let iconSize = (Dimensions.get('window').width < 768 ? 20 : 29);
        const { params } = navigation.state;

        return {
            title: navigation.getParam('title'),
            headerRight: (
                <IconSettings
                    navigate={navigation.navigate}
                    onPressHandler={navigation.getParam('toggleSettingsMenu')}
                />
            ),
            tabBarLabel: 'Statistics',
            tabBarIcon: ({tintColor}) => (
                <Icon name={'chart-area'} size={iconSize} color={'white'} />
            )
        };
    };

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            eventId: navigation.getParam('eventId', 'NO-ID'),
            eventName: navigation.getParam('eventName', ''),
            settingsMenuVisible: false,
        }
    };

    componentDidMount() {
        this.props.navigation.setParams({title: this.props.currentEventName, toggleSettingsMenu: this._toggleSettingsMenu });
    }

    _toggleSettingsMenu = () => {
        this.props.updateShowSettingsMenu({ variables: { show: true } })
    };

    render () {

        const dataA1 = [
            {
                value: 0,
                date: dateFns.setHours(new Date(2018, 0, 0), 10),
            },
            {
                value: 10,
                date: dateFns.setHours(new Date(2018, 0, 0), 11),
            },
            {
                value: 11,
                date: dateFns.setHours(new Date(2018, 0, 0), 12),
            },
            {
                value: 15,
                date: dateFns.setHours(new Date(2018, 0, 0), 13),
            },
            {
                value: 19,
                date: dateFns.setHours(new Date(2018, 0, 0), 14),
            },
            {
                value: 25,
                date: dateFns.setHours(new Date(2018, 0, 0), 15),
            },
            {
                value: 44,
                date: dateFns.setHours(new Date(2018, 0, 0), 16),
            },
            {
                value: 55,
                date: dateFns.setHours(new Date(2018, 0, 0), 17),
            },
            {
                value: 71,
                date: dateFns.setHours(new Date(2018, 0, 0), 18),
            },
            {
                value: 81,
                date: dateFns.setHours(new Date(2018, 0, 0), 19),
            },
        ];

        const dataAll = [35,];
        const dataVIP = [15,];
        const dataRegular = [50,];

        return (
            <>
                <SettingsMenuModal
                    navigate={this.props.navigation.navigate}
                />

                <View style={styles.container}>
                    <View style={styles.content}>

                        <View style={{paddingTop: 40, alignItems: 'center'}}>
                            <Text style={{fontSize: 22, color: pastelShades[1]}}>Check-in Progress</Text>
                        </View>

                        <View style={{paddingTop: 30, paddingBottom: 12}}>
                            <Text style={{fontSize: 14, fontWeight: '600', color: pastelShades[1]}}>Guests Check-in</Text>
                        </View>

                        <View style={{
                            height: 300,
                            marginBottom: 25,
                            flexDirection: 'row',
                            backgroundColor: pastelShades[5],
                        }}>
                            <YAxis
                                yMin={0}
                                yMax={100}
                                data={ dataA1 }
                                yAccessor={ ({ item }) => item.value }
                                scale={scale.scaleLinear}
                                contentInset={ { top: 30, bottom: 0 } }
                                svg={{
                                    fill: pastelShades[1],
                                    fontSize: 14,
                                    fontWeight: '600',
                                    alignmentBaseline: 'baseline',
                                    baselineShift: '3',
                                }}
                                numberOfTicks={5}
                                formatLabel={ value => { return (value > 0) ? `${value}` : '' } }
                                style={{
                                    padding: 10,
                                    marginRight: -20,
                                    marginBottom: 30,
                                    borderLeftWidth: 1,
                                    borderColor: pastelShades[1],
                                }}
                            />
                            <View style={{
                                flex: 1,
                                marginLeft: 0,
                            }}>
                                <AreaChart
                                    numberOfTicks={5}
                                    gridMin={0}
                                    style={{ flex: 1, borderBottomWidth: 1, borderColor: pastelShades[1], }}
                                    data={ dataA1 }
                                    yAccessor={ ({ item }) => item.value }
                                    xAccessor={ ({ item }) => item.date }
                                    xScale={ scale.scaleTime }
                                    contentInset={{ top: 30, bottom: 0 }}
                                    svg={{ fill: pastelShades[13] }}
                                    curve={ shape.curveLinear }
                                >
                                    <Grid />
                                </AreaChart>
                                <XAxis
                                    data={ dataA1 }
                                    svg={{
                                        fill: pastelShades[1],
                                        fontSize: 14,
                                        fontWeight: '600',
                                        rotation: 0,
                                        originY: 30,
                                        y: 0,
                                    }}
                                    xAccessor={ ({ item }) => item.date }
                                    scale={ scale.scaleTime }
                                    style={{ marginTop: 10, height: 20 }}
                                    contentInset={{ left: 50, right: 25 }}
                                    formatLabel={ (value) => dateFns.format(value, 'HH:mm') }
                                />
                            </View>
                        </View>


                        <View style={{marginTop: 25}}>
                            <View style={{flexDirection: 'row', paddingBottom: 10, justifyContent: 'space-between'}}>
                                <Text style={{fontSize: 16, fontWeight: '600', color: strongShades.darkBlue}}>Category: All</Text>
                                <Text style={{fontSize: 16, fontWeight: '600', color: strongShades.darkBlue}}>120/450</Text>
                            </View>
                            <View style={{height: 50, backgroundColor: pastelShades[2]}}>
                                <BarChart
                                    showGrid={false}
                                    yMin={0}
                                    yMax={100}
                                    style={{ flex: 1, }}
                                    spacingInner={0}
                                    spacingOuter={0}
                                    data={dataAll}
                                    horizontal={true}
                                    svg={{ fill: pastelShades[7], }}
                                >
                                </BarChart>
                            </View>
                        </View>

                        <View style={{marginTop: 25}}>
                            <View style={{flexDirection: 'row', paddingBottom: 10, justifyContent: 'space-between'}}>
                                <Text style={{fontSize: 16, fontWeight: '600', color: strongShades.darkBlue}}>Category: VIP</Text>
                                <Text style={{fontSize: 16, fontWeight: '600', color: strongShades.darkBlue}}>1/30</Text>
                            </View>
                            <View style={{height: 30, backgroundColor: pastelShades[2]}}>
                                <BarChart
                                    showGrid={false}
                                    yMin={0}
                                    yMax={100}
                                    style={{ flex: 1, }}
                                    data={dataVIP}
                                    horizontal={true}
                                    svg={{ fill: pastelShades[7], }}
                                    spacingInner={0}
                                    spacingOuter={0}
                                >
                                </BarChart>
                            </View>
                        </View>

                        <View style={{marginTop: 25}}>
                            <View style={{flexDirection: 'row', paddingBottom: 10, justifyContent: 'space-between'}}>
                                <Text style={{fontSize: 16, fontWeight: '600', color: strongShades.darkBlue}}>Category: Regular</Text>
                                <Text style={{fontSize: 16, fontWeight: '600', color: strongShades.darkBlue}}>119/420</Text>
                            </View>
                            <View style={{height: 30, backgroundColor: pastelShades[2]}}>
                                <BarChart
                                    showGrid={false}
                                    yMin={0}
                                    yMax={100}
                                    style={{ flex: 1, }}
                                    data={dataRegular}
                                    horizontal={true}
                                    svg={{ fill: pastelShades[7], }}
                                    spacingInner={0}
                                    spacingOuter={0}
                                >
                                </BarChart>
                            </View>
                        </View>

                    </View>
                </View>
            </>
        );
    }
}

// a = (
// <BottomNavigation
//     guestlistHandler={() => {
//         this.props.navigation.navigate('Guestlist', {
//             eventId: this.state.eventId,
//             eventName: this.state.eventName,
//         });
//     }}
//     qrCodeHandler={() => {
//         this.props.navigation.navigate('ScanQRCode', {
//             eventId: this.state.eventId,
//             eventName: this.state.eventName,
//         });
//     }}
// />
// );

const styles = StyleSheet.create({
    container: {
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: pastelShades[5],
    },
    content: {
        //paddingTop: 25,
        paddingRight: 40,
        paddingBottom: 25,
        paddingLeft: 40,
    }
});

export default withApollo(
    withNavigation(
        compose(
            graphql(updateShowLoadingQuery, { name: 'updateShowLoading' }),
            graphql(updateShowSettingsMenuQuery, { name: 'updateShowSettingsMenu' }),
            graphql(getSelectedEventQuery, getSelectedEventOptions),
        )(StatisticsScreen)
    )
);