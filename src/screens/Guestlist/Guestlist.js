import {pastelShades, strongShades} from "../../Components/UI/appStyles/appStyles";
import React, { Component } from "react";
import moment from 'moment-timezone';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SectionList,
    Animated,
    Dimensions,
    Image,
    FlatList,
    Platform
} from 'react-native';
import { withApollo, graphql, compose } from 'react-apollo'
import Swipeable from "react-native-swipeable";
import DropdownAlert from 'react-native-dropdownalert';
import Guest from "../../Components/Guest/Guest";
import {
    getShowLoadingOptions,
    getShowLoadingQuery,
    updateShowLoadingQuery,
    getFetchingDataOptions,
    getFetchingDataQuery,
    updateFetchingDataQuery,
    updateAccompanyingPopUpQuery,
    updateShowGuestDetailPopUpQuery,
    updateShowSettingsMenuQuery,
    getSelectedEventQuery,
    getSelectedEventOptions,
} from "../../apollo/queries";
import {
    CHECKIN_GUEST,
    EVENT_GUESTS_FILTER_STATUS,
    UNDO_CHECKIN_GUEST,
    SEARCH_GUESTS,
} from "../../apollo/queries/guests";
import GuestDetailPopUp from "../../Components/GuestDetailPopUp/GuestDetailPopUp";
import GuestAccompanyingPopUp from "../../Components/GuestAccompanyingPopUp/GuestAccompanyingPopUp";
import LoadingModal from "../../Components/LoadingModal/LoadingModal";
import IconStatus from "../../Components/UI/IconStatus/IconStatus";
import {SearchContainer, SearchInput} from "../../Components/UI/Search/Search";
import EventProgressBar from "../../Components/EventProgressBar/EventProgressBar";
import SettingsMenuModal from "../../Components/SettingsMenuModal/SettingsMenuModal";
import IconSettings from "../../Components/UI/IconSettings/IconSettings";
import Icon from "react-native-vector-icons/FontAwesome5";
import { fontFamily, fontWeight } from '../../Theme';


class GuestlistScreen extends Component {

    static navigationOptions = ({ navigation, navigationOptions }) => {
        let iconSize = (Dimensions.get('window').width < 768 ? 20 : 29);
        const { params } = navigation.state;

        return {

            title: params ? params.eventName : '',
            headerRight: (
                <IconSettings
                    navigate={navigation.navigate}
                    onPressHandler={navigation.getParam('toggleSettingsMenu')}
                />
            ),
            tabBarLabel: 'Guestlist',
            tabBarIcon: ({tintColor}) => (
                <Icon name={'users'} size={iconSize} color={'white'} />
            )
        };
    };

    constructor(props) {
        super(props);
        const { navigation } = this.props;

        this.lastBackFromScreen = '';
        this.refreshBackfromScreen = false;

        this.state = {
            data: [],
            dataSections: [],
            eventId: navigation.getParam('eventId', 0),
            eventName: navigation.getParam('eventName', ''),
            eventData: navigation.getParam('eventData', null),
            checkedin: 0,
            removingItem: false,
            refreshing: false,
            searchText: '',
            searchMode: false,
            hasSearched: true,
            hasFetchedOnce: false,
        };
    };

    componentDidMount() {
        this.props.navigation.setParams({
            toggleSettingsMenu: this._toggleSettingsMenu
        });

        this._getData({
            event_id:  this.state.eventId,
            checkedin: this.state.checkedin,
            start: 0,
            limit: 100
        }).then((data) => {
            this._updateData(data);
        });
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.props.navigation.getParam('dropdownAlertMessage', false)
            && this.props.navigation.getParam('dropdownAlertMessage', '') !== prevProps.navigation.getParam('dropdownAlertMessage', '')) {

            const dropdownMessage = this.props.navigation.getParam('dropdownAlertMessage', '');
            this.dropdown.alertWithType('success', '', dropdownMessage);
            this.props.navigation.setParams({'dropdownAlertMessage': false});
        }

        // To refresh data when coming back from add, edit, replace guest screens.
        if (this.props.navigation.getParam('fromScreen', false)
            && this.props.navigation.getParam('fromScreen', '') !== prevProps.navigation.getParam('fromScreen', '')) {

            this.lastBackFromScreen = this.props.navigation.getParam('fromScreen');
            this.props.navigation.setParams({'fromScreen': false});
            this.refreshBackfromScreen = true;

            if (this.lastBackFromScreen === 'AddGuestCheckedIn') {
                this.setState({checkedin: 1});
            }
        }

        if ((this.state.checkedin !== prevState.checkedin)
            || (!this.state.refreshing && !this.state.searchMode && prevState.searchMode)
            || this.refreshBackfromScreen
        ) {

            this.refreshBackfromScreen = false;
            this._getData({
                event_id:  this.state.eventId,
                checkedin: this.state.checkedin,
                start: 0,
                limit: 100
            }).then((data) => {
                this._updateData(data);
            });

        } else if (!this.state.refreshing && this.state.searchMode && !this.state.hasSearched) {

            this._getSearchData({
                event_id:  this.state.eventId,
                start: 0,
                limit: 100
            }).then((data) => {
                this._updateSearchData(data);
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
                    event_id: this.state.eventId,
                    start: 0,
                    limit: 100
                }).then((data) => {
                    this._updateSearchData(data);
                });
            });

        } else {

            this.setState({ refreshing: true }, () => {
                this._getData({
                    event_id: this.state.eventId,
                    checkedin: this.state.checkedin,
                    start: 0,
                    limit: 100
                }).then((data) => {
                    this._updateData(data);
                });
            });

        }

    };

    _toggleCheckInStatus = (checkedin = 0) => {
        // Enable Loading
        if (checkedin !== this.state.checkedin && !this.props.showLoading) {;
            this.setState({
                checkedin: checkedin,
                searchMode: false,
                hasSearched: true
            });
        }
    };

    _updateData = ({guests}) => {

        const guestsData = guests.filter((item) => {
            return item.guest_checkin === this.state.checkedin
        }).map((item) => {
            const rndStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            return {
                id: item.guest_id.toString() + ':' + rndStr,
                guest_id: item.guest_id,
                guest_data: item,
            }
        });

        let sortedData = [];
        if (this.state.checkedin === 1) {
            sortedData = [...guestsData.sort((guestA, guestB) => guestB.guest_data.guest_checkin_time - guestA.guest_data.guest_checkin_time)];
        } else {
            sortedData = [...guestsData.sort((guestA, guestB) => {
                if(guestA.guest_data.guest_lastname < guestB.guest_data.guest_lastname) { return -1; }
                if(guestA.guest_data.guest_lastname > guestB.guest_data.guest_lastname) { return 1; }
                return 0;
            })];
        }

        const dataSections = this.formatDataSections(sortedData);

        this.setState({
            data: sortedData,
            dataSections: dataSections,
            refreshing: false,
            hasFetchedOnce: true
        });

    };

    _updateSearchData = ({guests}) => {

        // Get all Guests that are companion of someone....
        let companionsList = [];
        guests.forEach(guest => {
            if (guest.companions.length > 0) {
                companionsList = [...companionsList, ...guest.companions];
            }
        });

        let guestsData = [];
        guests.forEach(guest => {

            // Skip the Guest if his someone companion
            if (companionsList.filter(companionsGuest => { return companionsGuest.guest_id === guest.guest_id }).length) {
                return;
            }

            let rndStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            guestsData.push({
                id: guest.guest_id.toString() + ':' + rndStr,
                guest_id: guest.guest_id,
                guest_data: guest,
                is_search_result: true,
                is_companion: false,
            });

            // If the Guest has companions add his companions next/below.
            if (guest.companions.length > 0) {
                guest.companions.map(companionsGuest => {
                    rndStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    companionsGuest.companions = [];
                    guestsData.push({
                        id: companionsGuest.guest_id.toString() + ':' + rndStr,
                        guest_id: companionsGuest.guest_id,
                        guest_data: companionsGuest,
                        is_search_result: true,
                        is_companion: true,
                    });
                    return null;
                });
            }

        });


        let sortedData = [];
        if (this.state.checkedin === 1) {
            sortedData = [...guestsData.sort((guestA, guestB) => guestB.guest_data.guest_checkin_time - guestA.guest_data.guest_checkin_time)];
        } else {
            sortedData = [...guestsData.sort((guestA, guestB) => {
                if(guestA.guest_data.guest_lastname < guestB.guest_data.guest_lastname) { return -1; }
                if(guestA.guest_data.guest_lastname > guestB.guest_data.guest_lastname) { return 1; }
                return 0;
            })];
        }

        const dataSections = this.formatDataSections(sortedData);

        this.setState({
            data: sortedData,
            dataSections: dataSections,
            hasSearched: true,
            refreshing: false,
        });

    };

    // order -> accepted, invited, declined, created, no-show
    // checked-in -> show
    formatDataSections = (data) => {
        const statusHelper = {
            accepted: false,
            invited: false,
            declined: false,
            created: false,
            show: false,
            noShow: false,
            na: false,
        };

        const headers = new Set(['accepted', 'invited', 'declined', 'created', 'show', 'no-show', 'N/A']);

        let dataSections = [];

        data.forEach(item => {
            const currStatus = item.guest_data.guest_status === 'no-show' ? 'noShow' : item.guest_data.guest_status;
            statusHelper[currStatus] = true;
        });

        for (let key in statusHelper) {
            if(!statusHelper[key]) {
                let currKey = key;

                if (key === 'noShow') {
                    currKey = 'no-show';
                } else if (key === 'na') {
                    currKey = 'N/A';
                }

                headers.delete(currKey);
            }
        }

        headers.forEach( value => {
            dataSections.push({
                status: value,
                data: data.filter(item => {
                    return item.guest_data.guest_status === value;
                })
            });
        });

        return dataSections;
    };

    _getData = async ({event_id, checkedin = 0, start = 0, limit = 10}) => {

        if (!this.state.refreshing) {
            this.props.updateShowLoading({ variables: { show: true } });
        }

        const gqlQueryOption = {
            query: EVENT_GUESTS_FILTER_STATUS,
            fetchPolicy: 'network-only',
            variables: {
                event_id: event_id,
                guest_checkin: checkedin,
                start: start,
                limit: limit
            }
        };

        const { data } = await this.props.client.query(gqlQueryOption);

        this.props.updateShowLoading({ variables: { show: false } });
        return data;
    };

    _getSearchData = async ({event_id, start = 0, limit = 10}) => {

        if (!this.state.refreshing) {
            this.props.updateShowLoading({ variables: { show: true } });
        }

        const gqlQueryOption = {
            query: SEARCH_GUESTS,
            fetchPolicy: 'network-only',
            variables: {
                event_id: event_id,
                searchString: '%' + this.state.searchText + "%",
                start: start,
                limit: limit
            }
        };

        const { data } = await this.props.client.query(gqlQueryOption);

        let searchData = {};
        searchData.guests = this._getUnique([...data.firstname_search_result, ...data.lastname_search_result], 'guest_id');

        this.props.updateShowLoading({ variables: { show: false } });
        return searchData;
    };

    _removeItem = (idx, canShowPopup=true) => {

        if (!this.state.refreshing) {
            this.props.updateShowLoading({ variables: { show: true } });
        }

        const guest = this.state.data.find(item => item.id === idx.toString());
        const guest_checkin = (guest.guest_data.guest_checkin === 0);

        const currentDateTime = moment();

        let checkInDateTime = null;
        if (this.state.eventData.event_timezone.length) {
            checkInDateTime = currentDateTime.tz(this.state.eventData.event_timezone).format('YYYYMMDDHHmmss');
        } else {
            checkInDateTime = currentDateTime.format('YYYYMMDDHHmmss');
        }

        const guestId = guest.guest_id;
        const guestStatus = guest_checkin ? 'show' : 'accepted';

        let mutation = CHECKIN_GUEST;
        let variables = {
            guest_id: guestId,
            guest_checkin_time: checkInDateTime,
            guest_status: guestStatus
        };
        if (!guest_checkin) {
            mutation = UNDO_CHECKIN_GUEST;
            variables = {
                guest_id: guestId,
                guest_status: guestStatus
            }
        }

        this.props.client.mutate({
            mutation: mutation,
            variables: variables,
        }).then(() => {

            const guestName = guest.guest_data.guest_lastname + ' ' + guest.guest_data.guest_firstname;
            const dropdownMessage = guest_checkin ? `${guestName} checked in.` : `${guestName} undo checked in.`;

            this.dropdown.alertWithType('success', '', dropdownMessage);

            // Check if Guest has accompanying persons
            const tempData = [...this.state.data];
            const parent_guest = tempData.filter(item => item.guest_data.guest_id === guest.guest_data.guest_parent_id)[0];

            let showPopUp = parent_guest ? parent_guest.guest_data.guest_checkin === 0 : false;
            if (!showPopUp && guest.guest_data.companions.length > 0) {
                if(guest_checkin) {
                    for (let i = 0; i < guest.guest_data.companions.length; i++) {
                        if (guest.guest_data.companions[i].guest_checkin !== 1)
                            showPopUp = true;
                    }
                }
            }

            if (showPopUp && canShowPopup) {
                this.props.updateAccompanyingPopUp({ variables: { guestId: parseInt(parent_guest ? parent_guest.guest_id : guest.guest_id), show: true, checkIn: guest_checkin } });
            }

            const updatedData = this.state.data.filter(item => {
                return item.id !== guest.id;
            });

            let sortedData = [];
            if (this.state.checkedin === 1) {
                sortedData = [...updatedData.sort((guestA, guestB) => guestB.guest_data.guest_checkin_time - guestA.guest_data.guest_checkin_time)];
            } else {
                sortedData = [...updatedData.sort((guestA, guestB) => {
                    if(guestA.guest_data.guest_lastname < guestB.guest_data.guest_lastname) { return -1; }
                    if(guestA.guest_data.guest_lastname > guestB.guest_data.guest_lastname) { return 1; }
                    return 0;
                })];
            }

            const dataSections = this.formatDataSections(sortedData);

            this.setState({
                data: sortedData,
                dataSections: dataSections,
                refreshing: false,
            });

            this.props.updateShowLoading({ variables: { show: false } });

        },(error) => {
            console.log("GUEST UPDATE ERROR: ", error);
        }).finally( () => {
            this.props.updateShowLoading({ variables: { show: false } });
        });

    };

    _onPressItem = (idx) => {
        this.props.updateShowGuestDetailPopUp({ variables: { guestId: idx } });
    };

    _onEndReached = (distanceFromEnd) => {

        if (distanceFromEnd <= 10) {
            return null;
        }

        if (this.state.searchMode) {
            return null;
        }

        if (!this.state.refreshing) {
            this.props.updateShowLoading({ variables: { show: true } });
        }

        this._getData({
            event_id: this.state.eventId,
            checkedin: this.state.checkedin,
            start: this.state.data.length,
            limit: 30
        }).then((fetchMoreResult) => {

            if (fetchMoreResult.guests === undefined || fetchMoreResult.guests.length <= 0) {
                return null;
            }

            const guestsData = fetchMoreResult.guests.map((item) => {
                const rndStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                return {
                    id: item.guest_id.toString() + ':' + rndStr,
                    guest_id: item.guest_id,
                    guest_data: item
                }
            });

            // Just to be  sure there's no duplicates
            const updatedData = this._getUnique([...this.state.data, ...guestsData], 'guest_id');

            let sortedData = [];
            if (this.state.checkedin === 1) {
                sortedData = [...updatedData.sort((guestA, guestB) => guestB.guest_data.guest_checkin_time - guestA.guest_data.guest_checkin_time)];
            } else {
                sortedData = [...updatedData.sort((guestA, guestB) => {
                    if(guestA.guest_data.guest_lastname < guestB.guest_data.guest_lastname) { return -1; }
                    if(guestA.guest_data.guest_lastname > guestB.guest_data.guest_lastname) { return 1; }
                    return 0;
                })];
            }

            const dataSections = this.formatDataSections(sortedData);

            this.setState({
                data: sortedData,
                dataSections: dataSections,
                refreshing: false
            });

        }).finally( () => {
            this.props.updateShowLoading({ variables: { show: false } });
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

    addGuestScreen = () => {
        this.props.navigation.navigate('AddGuest', {
            eventId: this.state.eventId,
            eventName: this.state.eventName,
            eventData: this.state.eventData,
        });
    };

    checkInCompanions = (companions) => {
        companions.forEach(guest_id => {
            const guest = this.state.data.find(item => item.guest_id === guest_id);
            if (guest) {
                this._removeItem(guest.id, false)
            }
        });
        this.props.updateShowLoading({ variables: { show: false } });
    };

    editGuestScreen = (guestId, guestData) => {
        this.props.navigation.navigate('EditGuest', {
            eventId: this.state.eventId,
            eventName: this.state.eventName,
            eventData: this.state.eventData,
            guestId: guestId,
            guestData: guestData,
        });
    };

    replaceGuestScreen = (guestId, guestData) => {
        this.props.navigation.navigate('ReplaceGuest', {
            eventId: this.state.eventId,
            eventName: this.state.eventName,
            eventData:this.state.eventData,
            guestId: guestId,
            guestData: guestData
        });
    };

    searchHandler = (searchText) => {
        this.setState(prevState => {
            return ({
                data: searchText.trim().length > 0 && prevState.searchText !== searchText.trim() ? [] : prevState.data,
                dataSections: prevState.searchText === searchText.trim() ? prevState.dataSections : [],
                searchText: searchText.trim(),
                searchMode: (searchText.trim().length > 0),
                hasSearched: (searchText.trim().length > 0 && prevState.searchText === searchText.trim())
            });
        });
    };


    render() {

        let content = null;
        if (!this.state.hasFetchedOnce || this.state.data.length > 0) {

            content = (
                <MultiSelectList
                    //data={this.state.data}
                    data={this.state.searchMode ? this.state.data : this.state.dataSections}
                    useSections={!this.state.searchMode}
                    onPressItemHandler={(idx) => this._onPressItem(idx)}
                    deleteItemHandler={(idx) => this._removeItem(idx)}
                    onRefresh={this._onRefresh}
                    refreshing={this.state.refreshing}
                    onEndReached={(distanceFromEnd) => this._onEndReached(distanceFromEnd)}
                />
            );

        } else if (this.state.searchMode && this.state.hasSearched) {

            content = (
                <View style={styles.emptyListContainer}>
                    <Image style={styles.emptyImage}
                           source={require('../../../images/guestlist_empty_state.png')}/>
                    <Text style={styles.emptyListH1}>Oops! It looks like you don't have any guests, that matches
                        this search criteria.</Text>
                </View>
            );

        } else if (!this.state.searchMode && this.state.hasSearched && this.state.data.length <= 0) {

            content = (
                <View style={styles.emptyListContainer}>
                    <Image style={styles.emptyImage} source={require('../../../images/guestlist_empty_state.png')} />
                    <Text style={styles.emptyListH1}>It looks like you don't have any guests on your guestlist yet.</Text>
                    <Text style={styles.emptyListH2}>Add guests to this event to be able to begin the check-in.</Text>
                </View>
            );

        }

        return (
            <>
                <LoadingModal />

                <SettingsMenuModal
                    navigate={this.props.navigation.navigate}
                />

                <GuestDetailPopUp
                    editGuestHandler={this.editGuestScreen}
                    replaceGuestHandler={this.replaceGuestScreen}
                />

                <GuestAccompanyingPopUp
                    checkInCompanionsHandler={this.checkInCompanions}
                />

                {/*CONTENT */}
                <View style={styles.content}>

                    <SearchContainer style={styles.searchContainer}>
                        <SearchInput
                            placeholder="Search guests"
                            buttonHandler={this.addGuestScreen}
                            inputHandler={this.searchHandler}

                        />
                    </SearchContainer>

                    {/*GUEST LIST CONTENT*/}
                    <View style={styles.guestListContent}>

                        {/*CONTROLS*/}

                        { !this.state.searchMode ? (
                            <View style={styles.controls}>
                                <View style={styles.switchContainer}>
                                    <TouchableOpacity
                                        key='Guests'
                                        style={[
                                            styles.switch,
                                            styles.switchGuests,
                                            this.state.checkedin === 0 ? styles.switchButtonActive : styles.switchButton
                                        ]}
                                        onPress={ _ => this._toggleCheckInStatus(0) }
                                    >
                                        <Text style={{color: this.state.checkedin === 0 ? pastelShades[0] : pastelShades[15]}}>Guests</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        key='CheckedIn'
                                        style={[
                                            styles.switch,
                                            styles.switchCheckIn,
                                            this.state.checkedin === 1 ? styles.switchButtonActive : styles.switchButton
                                        ]}
                                        onPress={ _ => this._toggleCheckInStatus(1) }
                                    >
                                        <Text style={{color: this.state.checkedin === 1 ? pastelShades[0] : pastelShades[15]}}>Checked-in</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : null }

                        {/* GUEST LIST */}
                        <View style={styles.activeListContainer}>
                            {content}
                        </View>

                    </View>

                    {/*FOOTER*/}
                    <View>
                        <EventProgressBar eventId={this.state.eventId} />
                    </View>

                </View>

                <DropdownAlert
                    ref={ref => this.dropdown = ref}
                    closeInterval={850}
                    successColor={pastelShades[14]}
                    defaultContainer={{borderRadius: 4, padding: 15, paddingBottom: (Platform.OS === 'ios' ? 15 : 20), paddingLeft: 20, paddingRight: 20, marginLeft: (Dimensions.get('window').width < 768 ? '10%' : '25%'), marginRight: (Dimensions.get('window').width < 768 ? '10%' : '25%')}}
                    defaultTextContainer={{padding: 0}}
                    containerStyle={{padding: 0}}
                    messageStyle={{padding: 0, color: strongShades.mint}}
                    successImageSrc={null}
                    translucent={true}
                    updateStatusBar={false}
                />

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
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    guestListContent: {
        flex: 1,
        backgroundColor: pastelShades[5],
    },
    searchContainer: {
        width: '100%',
        height: 85,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: strongShades.darkBlue,
        paddingLeft: (Dimensions.get('window').width < 768 ? 5 : 40),
        paddingTop: 0,
        paddingRight: (Dimensions.get('window').width < 768 ? 5 : 40),
        paddingBottom: 0,
    },
    contentContainer: {
        width: '100%',
        justifyContent: 'space-between',
        paddingTop: (Dimensions.get('window').width < 768 ? 5 : 25),
    },
    backTextWhite: {
        color: '#FFF'
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
        backgroundColor: '#DDD',
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
        width: 100
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 100
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75
    },
    backRightBtnRight: {
        backgroundColor: 'gray',
        right: 0
    },
    backLeftBtnLeft: {
        backgroundColor: 'green',
        left: 0
    },
    controls: {
        alignItems: 'center',
        paddingTop: (Dimensions.get('window').width < 768 ? 8 : 28),
        paddingBottom: (Dimensions.get('window').width < 768 ? 8 : 28),
        paddingLeft: (Dimensions.get('window').width < 768 ? 10 : 40),
        paddingRight: (Dimensions.get('window').width < 768 ? 10 : 40),
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 0,
    },
    switch: {
        width: '50%',
        height: (Dimensions.get('window').width < 768 ? 35 : 45),
        fontSize: 16,
        fontWeight: '600',
        alignItems: 'center',
        justifyContent: 'center',
        color: strongShades.darkBlue,
    },
    switchGuests: {
        borderTopLeftRadius: 22,
        borderBottomLeftRadius: 22,
    },
    switchCheckIn: {
        borderTopRightRadius: 22,
        borderBottomRightRadius: 22,
    },
    switchButton: {
        backgroundColor: pastelShades[3],
        color: strongShades.darkBlue,
    },
    switchButtonActive: {
        backgroundColor: 'white',
        color: pastelShades[0],
    },
    activeListContainer: {
        display: 'flex',
        flex: 1,
    },
    emptyListContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: (Dimensions.get('window').width < 768 ? 0 : 50),
        justifyContent: (Dimensions.get('window').width < 768 ? 'center' : 'flex-start'),
        backgroundColor: pastelShades[5],
    },
    emptyListH1: {
        width: (Dimensions.get('window').width < 768 ? '90%' : 400),
        textAlign: 'center',
        fontSize: (Dimensions.get('window').width < 768 ? 18 : 22),
        color: pastelShades[1],
        marginBottom: 20,
    },
    emptyListH2: {
        width: (Dimensions.get('window').width < 768 ? '90%' : 400),
        textAlign: 'center',
        fontSize: (Dimensions.get('window').width < 768 ? 12 : 16),
        color: pastelShades[1],
    },
    emptyImage: {
        marginBottom: (Dimensions.get('window').width < 768 ? 50 : 70),
        width: (Dimensions.get('window').width < 768 ? 180 : 280),
        height: (Dimensions.get('window').width < 768 ? 198 : 309),
    },
});

class GuestListItem extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            actionActivated: false,
            animationListItemHeight: new Animated.Value(64),
            animationListInnerItemHeight: new Animated.Value(64),
            animationListInnerItemBorderBottomWidth: new Animated.Value(1),
            animationListInnerItemOpacity: new Animated.Value(1),
        };
    }

    _onPress = () => {
        this.props.onPressItem(this.props.guest_id);
    };

    _onDeleteItem = () => {
        this.props.onDeleteItem(this.props.id);
    };

    _stylesItem = StyleSheet.create({
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
        },
        leftSwipeItemButton: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: 128
        },
        rightSwipeItem: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
        },
        rightSwipeItemButton: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: 170
        },
        textCheckIn: {
            fontFamily: fontFamily.OpenSans,
            color: strongShades.mint,
            fontSize: 16,
            fontWeight: fontWeight.Bold,
        },
        textUndoCheckIn: {
            fontFamily: fontFamily.OpenSans,
            color: strongShades.darkBlue,
            fontSize: 16,
            fontWeight: fontWeight.Bold,
        },
        bgGreen: {
            backgroundColor: pastelShades[8],
        },
        bgGray: {
            backgroundColor: pastelShades[3],
        },
    });

    render() {

        if (this.state.actionActivated) {
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(this.state.animationListItemHeight, {
                        toValue: 0,
                        duration: 200
                    }),
                    Animated.timing(this.state.animationListInnerItemOpacity, {
                        toValue: 0,
                        duration: 200
                    }),
                    Animated.timing(this.state.animationListInnerItemHeight, {
                        toValue: 0,
                        duration: 200
                    }),
                    Animated.timing(this.state.animationListInnerItemBorderBottomWidth, {
                        toValue: 0,
                        duration: 1
                    }),
                ])
            ]).start(() => {
                this._onDeleteItem();
            });
        }

        const animatedListItemStyles = {
            height: this.state.animationListItemHeight,
            opacity: this.state.animationListInnerItemOpacity,
            borderBottomColor: pastelShades[3],
            borderBottomWidth: this.state.animationListInnerItemBorderBottomWidth
        };

        const animatedListInnerItemStyles = {
            height: this.state.animationListInnerItemHeight,
            opacity: this.state.animationListInnerItemOpacity,
            borderBottomColor: pastelShades[3],
        };

        const actionActivationDistance = Math.round(Dimensions.get('window').width/2);
        const windowWidth = Dimensions.get('window').width;
        const leftButtonWidth = 128;
        const rightButtonWidth = 170;

        const checkInSwipeable = (
            <Swipeable
                leftButtonWidth={leftButtonWidth}
                leftButtons={[
                    <Animated.View style={[this._stylesItem.leftSwipeItem, this._stylesItem.bgGreen, animatedListInnerItemStyles]}>
                        <TouchableOpacity 
                            style={this._stylesItem.leftSwipeItemButton}
                            onPress={() => {
                                this.setState({ actionActivated: true });
                            }}
                        >
                            <Text style={this._stylesItem.textCheckIn}><IconStatus status='check-in' style={styles.textCheckIn} /> Check-In</Text>
                        </TouchableOpacity>
                    </Animated.View>
                ]}
                swipeStartMinLeftEdgeClearance={10}
                swipeStartMinRightEdgeClearance={0}
                leftActionActivationDistance={actionActivationDistance}
                onLeftActionRelease={(temp) => {
                    //this.setState({ actionActivated: true })
                }}
                leftActionReleaseAnimationFn={animatedXY => {
                    this.setState({ actionActivated: true });
                    return Animated.sequence([
                        Animated.timing(animatedXY.x, {
                            toValue: windowWidth,
                            duration: 200,
                            useNativeDriver: false
                        }),
                    ]);
                }}
            >
                <Animated.View style={[
                    this._stylesItem.listItem,
                    (this.props.is_search_result && !this.props.is_companion ? {marginTop: 4} : {marginTop: 0}),
                    animatedListItemStyles,
                ]}>
                    <Guest
                        id={this.props.guest_id}
                        firstName={this.props.guest_firstname}
                        lastName={this.props.guest_lastname}
                        behalfFirstname={this.props.guest_behalf_firstname}
                        behalfLastname={this.props.guest_behalf_lastname}
                        status={this.props.guest_status}
                        checkinTime={null}
                        style={animatedListInnerItemStyles}
                        guestClicked={this._onPress}
                    />
                </Animated.View>
            </Swipeable>
        );


        const undoCheckInSwipeable = (
            <Swipeable
                rightButtonWidth={rightButtonWidth}
                rightButtons={[
                    <Animated.View style={[this._stylesItem.rightSwipeItem, this._stylesItem.bgGray, animatedListItemStyles]}>
                        <TouchableOpacity
                            style={this._stylesItem.rightSwipeItemButton}
                            onPress={() => {
                                this.setState({ actionActivated: true });
                            }}
                        >
                            <Text style={this._stylesItem.textUndoCheckIn}>
                                Undo Check-in <IconStatus status='undocheck-in' style={this._stylesItem.textUndoCheckIn} />
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                ]}
                swipeStartMinRightEdgeClearance={10}
                swipeStartMinLeftEdgeClearance={0}
                rightActionActivationDistance={actionActivationDistance}
                onRightActionRelease={() => {
                    //this.setState({ actionActivated: true })
                }}
                rightActionReleaseAnimationFn={animatedXY => {
                    this.setState({ actionActivated: true });
                    return Animated.sequence([
                        Animated.timing(animatedXY.x, {
                            toValue: -windowWidth,
                            duration: 200,
                            useNativeDriver: false
                        })
                    ]);
                }}
            >
                <Animated.View style={[
                    this._stylesItem.listItem,
                    (this.props.is_search_result && !this.props.is_companion ? {marginTop: 4} : {marginTop: 0}),
                    animatedListItemStyles,
                ]}>
                    <Guest
                        id={this.props.guest_id}
                        firstName={this.props.guest_firstname}
                        lastName={this.props.guest_lastname}
                        status={"show"}
                        checkinTime={this.props.guest_checkin_time}
                        style={animatedListInnerItemStyles}
                        guestClicked={this._onPress}
                    />
                </Animated.View>
            </Swipeable>
        );

        if (this.props.guest_checkin === 0) {
            return checkInSwipeable;
        }
        return undoCheckInSwipeable;
    }

}

class MultiSelectList extends React.PureComponent {
    state = {selected: (new Map(): Map<string, boolean>)};

    _keyExtractor = (item, index) => item.id;

    _onPressItem = (id: string) => {
        this.props.onPressItemHandler(id);
        // updater functions are preferred for transactional updates
        // this.setState((state) => {
        //     // copy the map rather than modifying state.
        //     const selected = new Map(state.selected);
        //     selected.set(id, !selected.get(id)); // toggle
        //     return {selected};
        // });
    };

    _onDeleteItem = (id: string) => {
        this.props.deleteItemHandler(id);
    };

    _renderItem = ({item, index, section}) => {
        return (
            <GuestListItem
                id={item.id}
                guest_id={item.guest_id}
                guest_firstname={item.guest_data.guest_firstname}
                guest_lastname={item.guest_data.guest_lastname}
                guest_behalf_firstname={item.guest_data.guest_behalf_firstname}
                guest_behalf_lastname={item.guest_data.guest_behalf_lastname}
                guest_checkin={item.guest_data.guest_checkin}
                guest_status={item.guest_data.guest_status}
                guest_checkin_time={item.guest_data.guest_checkin_time}
                companions={item.guest_data.companions}
                is_search_result={item.is_search_result}
                is_companion={item.is_companion}
                selected={!!this.state.selected.get(item.id)}
                onPressItem={this._onPressItem}
                onDeleteItem={this._onDeleteItem}
            />
    )};

    render() {

        const styles = StyleSheet.create({
            sectionHeaderContainer: {
                display: 'flex',
                flexDirection: 'row',
                height: 30,
                paddingLeft: (Dimensions.get('window').width < 768 ? 10 : 40),
                paddingRight: (Dimensions.get('window').width < 768 ? 10 : 40),
                backgroundColor: pastelShades[3],
                alignItems: 'center',
                justifyContent: 'space-between'
            },
            sectionHeaderContentLeft: {
                flex: 1,
                fontWeight: 'bold',
                textTransform: 'capitalize'
            },
            sectionHeaderContentLeftText: {
                fontFamily: 'Open Sans',
                fontWeight: 'bold',
                color: 'black',
            },
            sectionHeaderContentRight: {
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end'
            },
        });

        let content = null;
        if (this.props.useSections) {
            content = (
                <View style={{flex: 1}}>
                    <SectionList
                        sections={this.props.data}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        onRefresh={this.props.onRefresh}
                        refreshing={this.props.refreshing}
                        onEndReached={({distanceFromEnd}) => this.props.onEndReached(distanceFromEnd)}
                        onEndReachedThreshold={0.3}
                        renderSectionHeader={({section: {status}}) => (
                            <View style={styles.sectionHeaderContainer}>
                                <Text style={styles.sectionHeaderContentLeftText}>{'Guest Status:'} {status.charAt(0).toUpperCase() + status.slice(1)}</Text>
                                <View style={styles.sectionHeaderContentRight}>
                                    <IconStatus status={status} />
                                </View>
                            </View>
                        )}
                    />
                </View>
            );
        } else {

            content = (
                <View style={{flex: 1}}>
                    <FlatList
                        data={this.props.data}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        renderItem={this._renderItem}
                        onEndReached={({distanceFromEnd}) => this.props.onEndReached(distanceFromEnd)}
                        onEndReachedThreshold={0.3}
                    />
                </View>
            );
        }

        return content;
    }
}

export default withApollo(
    compose(
        graphql(updateShowGuestDetailPopUpQuery, { name: 'updateShowGuestDetailPopUp' }),
        graphql(updateAccompanyingPopUpQuery, { name: 'updateAccompanyingPopUp' }),
        graphql(updateShowLoadingQuery, { name: 'updateShowLoading' }),
        graphql(updateShowSettingsMenuQuery, { name: 'updateShowSettingsMenu' }),
        graphql(getShowLoadingQuery, getShowLoadingOptions),
        graphql(updateFetchingDataQuery, { name: 'updateFetchingData' }),
        graphql(getFetchingDataQuery, getFetchingDataOptions),
        graphql(getSelectedEventQuery, getSelectedEventOptions),
    )(GuestlistScreen)
);
