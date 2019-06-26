export default {
    eyeVIPApp: {
        __typename: 'eyeVIPApp',
        showLoading: false,
        showGuestDetailPopUp: 0,
        showSettingsMenu: false,
        fetchingData: false,
        currentEventId: 0,
        currentEventName: '',
        currentEventPassphrase: ''
    },
    checkInGuests: {
        __typename: 'checkInGuests',
        guestId: 0,
        checkIn: true,
        showAccompanyingPopUp: false,
        isMainGuest: false,
    },
};