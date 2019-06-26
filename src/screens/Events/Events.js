import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    FlatList,
} from 'react-native';
import { compose, graphql, withApollo } from 'react-apollo';
import { GET_ALL_EVENTS, GET_ALL_EVENTS_SEARCH } from '../../apollo/queries/events';
import { Event, EventSeries }  from '../../Components/Event';
import { SearchInput, SearchContainer } from "../../Components/UI/Search/Search";
import { pastelShades } from "../../Components/UI/appStyles/appStyles";
import IconSettings from "../../Components/UI/IconSettings/IconSettings";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import SettingsMenuModal from "../../Components/SettingsMenuModal/SettingsMenuModal";
import {
    updateShowLoadingQuery,
    updateShowSettingsMenuQuery,
    updateSelectedEventQuery,
} from "../../apollo/queries";
import { fontFamily, fontWeight } from "../../Theme";
import moment from 'moment-timezone';

class EventsScreen extends Component {

    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
        return {
            title: 'Event Check-in App',
            headerRight: (
                <IconSettings
                    navigate={navigation.navigate}
                    onPressHandler={navigation.getParam('toggleSettingsMenu')}
                />
            ),
        };
    };

    constructor(props) {
        super(props);
        const { navigation } = this.props;

        this.state = {
            data: [],
            hasFetchedOnce: false,
            settingsMenuVisible: false,
            refreshing: false,
            searchText: '',
            searchMode: false,
            hasSearched: false,
        };
    }

    componentDidMount() {
        this.props.navigation.setParams({
            toggleSettingsMenu: this._toggleSettingsMenu
        });

        this._getData({
            start: 0,
            limit: 100
        }).then((data) => {
            this._updateData(data);
        }).catch(err => {
            console.log("SERVER ERROR!", err);
            this.props.updateShowLoading({ variables: { show: false } });
            //alert("SERVER ERROR!", err.toString());
        });
    }

    componentDidUpdate(prevProps, prevState) {


        if (!this.state.refreshing && this.state.searchMode && !this.state.hasSearched) {


            this.setState({ refreshing: true }, () => {
                this._getSearchData({
                    start: 0,
                    limit: 100
                }).then((data) => {
                    this._updateData(data);
                }).catch(err => {
                    console.log("SERVER ERROR!", err);
                    this.props.updateShowLoading({ variables: { show: false } });
                    //alert("SERVER ERROR!", err.toString());
                });
            });

        } else if (!this.state.searchMode && prevState.searchMode) {


            this.setState({ refreshing: true }, () => {
                this._getData({
                    start: 0,
                    limit: 100
                }).then((data) => {
                    this._updateData(data);
                }).catch(err => {
                    console.log("SERVER ERROR!", err);
                    this.props.updateShowLoading({ variables: { show: false } });
                    //alert("SERVER ERROR!", err.toString());
                });
            });
        }
    }

    _toggleSettingsMenu = () => {
        this.props.updateShowSettingsMenu({ variables: { show: true } })
    };

    _onRefresh = () => {

        if (this.state.searchMode) {

            this.setState({refreshing: true}, () => {
                this._getSearchData({
                    start: 0,
                    limit: 100
                }).then((data) => {
                    this._updateData(data);
                }).catch(err => {
                    console.log("SERVER ERROR!", err);
                    this.props.updateShowLoading({ variables: { show: false } });
                    //alert("SERVER ERROR!", err.toString());
                });
            });

        } else {
            this.setState({ refreshing: true }, () => {
                this._getData({
                    start: 0,
                    limit: 100
                }).then((data) => {
                    this._updateData(data);
                }).catch(err => {
                    console.log("SERVER ERROR!", err);
                    this.props.updateShowLoading({ variables: { show: false } });
                    //alert("SERVER ERROR!", err.toString());
                });
            });
        }
    };

    _getData = async ({start = 0, limit = 10}) => {

        if (!this.state.refreshing) {
            this.props.updateShowLoading({ variables: { show: true } });
        }

        const gqlQueryOption = {
            query: GET_ALL_EVENTS,
            fetchPolicy: 'network-only',
            variables: {
                start: start,
                limit: limit
            }
        };

        const { data } = await this.props.client.query(gqlQueryOption).then(
            res => { return res; }
        ).catch(err => {
            console.log("SERVER ERROR!", err);
        });

        this.props.updateShowLoading({ variables: { show: false } });
        return data;
    };

    _updateData = ({events}) => {

        if (!this.state.refreshing) {
            this.props.updateShowLoading({ variables: { show: true } });
        }


        let eventsData = [];
        events.forEach( event => {

            // Skip archive events...
            if (event.event_status !== 'archive') {

                if (event.event_type === 'event-series') {

                    event.event_series.forEach(es_event => {
                        const rndStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

                        const tempEvent = {...event};
                        tempEvent.event_startdate = es_event.es_startdate;
                        tempEvent.event_starttime = es_event.es_starttime;


                        eventsData.push({
                            id: tempEvent.event_id.toString() + ':' + rndStr,
                            es_event_id: es_event.es_id,
                            event_id: tempEvent.event_id,
                            event_data: tempEvent
                        });
                    });

                } else {

                    const rndStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    eventsData.push({
                        id: event.event_id.toString() + ':' + rndStr,
                        event_id: event.event_id,
                        event_data: event
                    });

                }
            }
        });

        const sortedData = [...eventsData.sort((eventA, eventB) => {
            const eventADateTime = moment(eventA.event_data.event_startdate + 'T' + eventA.event_data.event_starttime);
            const eventBDateTime = moment(eventB.event_data.event_startdate + 'T' + eventB.event_data.event_starttime);

            return eventADateTime > eventBDateTime ? 1 : -1;
        })];

        this.setState({
            data: sortedData,
            refreshing: false,
            hasSearched: true,
            hasFetchedOnce: true
        });

        this.props.updateShowLoading({ variables: { show: false } });
    };

    _getSearchData = async ({start = 0, limit = 100}) => {

        if (!this.state.refreshing) {
            this.props.updateShowLoading({ variables: { show: true } });
        }

        const gqlQueryOption = {
            query: GET_ALL_EVENTS_SEARCH,
            fetchPolicy: 'network-only',
            variables: {
                searchString: '%' + this.state.searchText + "%",
                start: start,
                limit: limit
            }
        };

        const { data } = await this.props.client.query(gqlQueryOption);

        this.props.updateShowLoading({ variables: { show: false } });
        return data;
    };

    _onPressItem = (idx) => {
        /* 1. Navigate to the Details route with params */
        const event = this.state.data.find(item => item.event_id === idx);

        if (event) {

            this.props.updateSelectedEvent({
                variables: {
                    currentEventId: event.event_data.event_id,
                    currentEventName: event.event_data.event_name,
                    currentEventPassphrase: event.event_data.event_passphrase
                }
            });

            this.props.navigation.navigate('Guestlist', {
                eventId: event.event_data.event_id,
                eventName: event.event_data.event_name,
                eventData: event.event_data,
            });
        }
    };

    _onEndReached = (distanceFromEnd) => {

        if (this.state.searchMode) {
            return null;
        }

        if (!this.state.refreshing) {
            this.props.updateShowLoading({ variables: { show: true } });
        }

        this._getData({
            start: this.state.data.length,
            limit: 30
        }).then((fetchMoreResult) => {

            if (fetchMoreResult.events === undefined || fetchMoreResult.events.length <= 0) {
                return null;
            }

            const eventsData = fetchMoreResult.guests.map((item) => {
                const rndStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                return {
                    id: item.event_id.toString() + ':' + rndStr,
                    event_id: item.guest_id,
                    event_data: item
                }
            });

            const updatedData = this._getUnique([...this.state.data, ...eventsData], 'event_id');

            const sortedData = [...updatedData.sort((eventA, eventB) => {
                const eventADateTime = moment(eventA.event_data.event_startdate + 'T' + eventA.event_data.event_starttime);
                const eventBDateTime = moment(eventB.event_data.event_startdate + 'T' + eventB.event_data.event_starttime);

                return eventADateTime > eventBDateTime ? 1 : -1;
            })];

            this.setState({
                data: sortedData,
                refreshing: false
            });

        }).finally( () => {
            this.props.updateShowLoading({ variables: { show: false } });
        });

    };

    searchHandler = (searchText) => {
        this.setState(prevState => {
            return ({
                data: (searchText.trim().length > 0 && prevState.searchText !== searchText.trim() ? [] : prevState.data),
                searchText: searchText.trim(),
                searchMode: (searchText.trim().length > 0),
                hasSearched: (searchText.trim().length > 0 && prevState.searchText === searchText.trim())
            });
        });
    };

    _getUnique = (arr, comp) => {
        return arr
            .map(e => e[comp])

            // store the keys of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)

            // eliminate the dead keys & store unique objects
            .filter(e => arr[e]).map(e => arr[e]);
    };

    render() {

        let content = null;
        if (!this.state.hasFetchedOnce || this.state.data.length > 0) {

            content = (
                <MultiSelectList
                    data={this.state.data}
                    onPressItemHandler={(idx) => this._onPressItem(idx)}
                    onRefresh={this._onRefresh}
                    refreshing={this.state.refreshing}
                    onEndReached={(distanceFromEnd) => this._onEndReached(distanceFromEnd)}
                />
            );

        } else if (this.state.searchMode && this.state.hasSearched) {

            content = (
                <View style={styles.emptyEventsListContainer}>
                    <Image style={styles.emptyEventsImage} source={require('../../../images/event_search_no_results.png')} />
                    <Text style={styles.emptyEventsListH1}>Oops! It looks like you don't have any event, that matches this search criteria.</Text>
                </View>
            );

        } else if (!this.state.searchMode && this.state.hasSearched && this.state.data.length <= 0) {

            content = (
                <View style={[styles.emptyEventsListContainer]} >
                    <Image style={styles.emptyEventsImage} source={require('../../../images/event_empty_state.png')} />
                    <Text style={styles.emptyEventsListH1}>It looks like you don't have any upcoming events yet.</Text>
                    <Text style={styles.emptyEventsListH2}>Create an upcoming event in your eyevip desktop app and it will be available for check-in here.</Text>
                </View>
            );

        }


        return (
            <>
                <LoadingModal />

                <SettingsMenuModal
                    navigate={this.props.navigation.navigate}
                />

                <View style={styles.container}>
                    <SearchContainer style={styles.searchContainer}>
                        <SearchInput
                            placeholder="Search events"
                            inputHandler={this.searchHandler}
                        />
                    </SearchContainer>

                    {/* EVENTS LIST */}
                    <View style={styles.contentContainer}>
                        {content}
                    </View>

                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: pastelShades[5],
    },
    contentContainer: {
        display: 'flex',
        flex: 1,
    },
    emptyEventsListContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: (Dimensions.get('window').width < 768 ? 0 : 50),
        justifyContent: (Dimensions.get('window').width < 768 ? 'center' : 'flex-start'),
        backgroundColor: pastelShades[5],
    },
    emptyEventsListH1: {
        width: (Dimensions.get('window').width < 768 ? '90%' : 400),
        textAlign: 'center',
        fontFamily: fontFamily.OpenSans,
        fontSize: (Dimensions.get('window').width < 768 ? 18 : 22),
        color: pastelShades[1],
        marginBottom: 20,
    },
    emptyEventsListH2: {
        width: (Dimensions.get('window').width < 768 ? '90%' : 400),
        textAlign: 'center',
        fontFamily: fontFamily.OpenSans,
        fontSize: (Dimensions.get('window').width < 768 ? 12 : 16),
        color: pastelShades[1],
    },
    emptyEventsImage: {
        marginBottom: (Dimensions.get('window').width < 768 ? 50 : 70),
        width: (Dimensions.get('window').width < 768 ? 208 : 308),
        height: (Dimensions.get('window').width < 768 ? 210 : 310),
    },
});


class MultiSelectList extends React.PureComponent {
    state = {selected: (new Map(): Map<string, boolean>)};

    _keyExtractor = (item, index) => item.id;

    _onPressItem = (id: string) => {
        this.props.onPressItemHandler(id);
    };

    _renderItem = ({item, index, section}) => {

        // Check if it's an EventSeries
        let event = null;
        if (item.es_event_id !== undefined) {
            event = (
                <EventSeries
                    key={item.event_id}
                    eventData={item.event_data}
                    keyPressHandler={this._onPressItem}
                    event_series_id={item.es_event_id}
                />
            );
        } else {
            event = (
                <Event
                    key={item.event_id}
                    eventData={item.event_data}
                    keyPressHandler={this._onPressItem}
                />
            );
        }

        return event;
    };

    render() {
        return (
            <View style={{flex: 1}}>
                <FlatList
                    data={this.props.data}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    onRefresh={this.props.onRefresh}
                    refreshing={this.props.refreshing}
                    onEndReached={({distanceFromEnd}) => this.props.onEndReached(distanceFromEnd)}
                    onEndReachedThreshold={0.3}
                    contentContainerStyle={{paddingTop: (Dimensions.get('window').width < 768 ? 5 : 25)}}
                />
            </View>
        );
    }
}


export default withApollo(
    compose(
        graphql(updateShowLoadingQuery, { name: 'updateShowLoading' }),
        graphql(updateShowSettingsMenuQuery, { name: 'updateShowSettingsMenu' }),
        graphql(updateSelectedEventQuery, { name: 'updateSelectedEvent' }),
    )(EventsScreen)
);

