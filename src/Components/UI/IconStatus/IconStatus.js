import React  from 'react';
import { pastelShades, strongShades } from "../appStyles/appStyles";
import Icon from "react-native-vector-icons/FontAwesome5";
import createIconSet from 'react-native-vector-icons/lib/create-icon-set';
import glyphMap from 'react-native-vector-icons/glyphmaps/FontAwesome5Free.json';
const IconRegular = createIconSet(glyphMap, 'FontAwesome', 'FontAwesome.ttf');

const iconStatus = (props) => {

    let icon = null;
    let iconColor = strongShades.darkBlue;

    switch (props.status) {
        case 'created':
            iconColor = props.section ? iconColor : strongShades.darkBlue;
            icon = <Icon name='circle' size={16} color={iconColor} />;
            break;
        case 'invited':
            iconColor = props.section ? iconColor : strongShades.darkBlue;
            icon = <Icon name='paper-plane' size={16} color={iconColor} />;
            break;
        case 'accepted':
            iconColor = props.section ? iconColor : strongShades.mint;
            icon = <Icon name='check' size={16} color={iconColor} />;
            break;
        case 'declined':
            iconColor = props.section ? iconColor : strongShades.red;
            icon = <Icon name='times' size={16} color={iconColor} />;
            break;
        case 'show':
        case 'check-in':
            iconColor = props.section ? iconColor : strongShades.mint;
            icon = <IconRegular name='smile' size={16} color={iconColor} />;
            break;
        case 'undocheck-in':
            iconColor = props.section ? iconColor : strongShades.darkBlue;
            icon = <IconRegular name='undo' size={16} color={iconColor} />;
            break;
        case 'no-show':
            iconColor = props.section ? iconColor : strongShades.red;
            icon = <IconRegular name='frown' size={16} color={iconColor} />;
            break;
        default:
            iconColor = props.section ? iconColor : strongShades.mint;
            icon = <Icon name='check' size={16} color={iconColor} />;
            break;
    }

    return icon;
};

export default iconStatus;