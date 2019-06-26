import React, { Component } from "react";
import {
    Dimensions,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import GuestListGuests from '../../Components/GuestListGuests/GuestListGuests';
import GuestListCheckedIn from '../../Components/GuestListCheckedIn/GuestListCheckedIn';


class GuestListTestScreen extends Component {

    state = {
        selectedList: 'guests',
    };

    constructor(props) {
        super(props);
        this.refetch = null;
    }

    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
        return {
            title: 'Testing...',
            headerRight: (
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={{ marginRight: (Dimensions.get('window').width < 768 ? 5 : 40), }} onPress={() => navigation.navigate('Notes')}>
                        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>NOTES</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginRight: (Dimensions.get('window').width < 768 ? 5 : 40), }} onPress={() => navigation.navigate('Tests')}>
                        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>TESTS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginRight: (Dimensions.get('window').width < 768 ? 5 : 40), }} onPress={() => navigation.navigate('GuestListTest')}>
                        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>GUESTS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginRight: (Dimensions.get('window').width < 768 ? 5 : 40), }} onPress={() => navigation.navigate('Events')}>
                        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>EVENTS</Text>
                    </TouchableOpacity>
                </View>
            ),
        };
    };

    render() {

        let guestList = <GuestListGuests />;
        if (this.state.selectedList === "checkedin") {
            guestList = <GuestListCheckedIn />;
        }

        return (
            <>
                <View>
                    <TouchableOpacity onPress={() => {this.setState({selectedList: 'guests'})}}>
                        <Text style={{ fontWeight: 'bold', color: (this.state.selectedList === "checkedin") ? 'black' : 'red', }}>Guests....</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.setState({selectedList: 'checkedin'})}}>
                        <Text style={{ fontWeight: 'bold', color: (this.state.selectedList === "checkedin") ? 'red' : 'black' }}>CheckedIn</Text>
                    </TouchableOpacity>
                </View>

                {guestList}
            </>
        );
    }

}


export default GuestListTestScreen;

