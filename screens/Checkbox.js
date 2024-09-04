import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

const checkboxImage = require('../assets/other_icons/checkbox.png');
const uncheckedImage = require('../assets/other_icons/unchecked.png');

const circlecheckboxImage = require('../assets/other_icons/circle_checkbox.png');
const circleuncheckedImage = require('../assets/other_icons/circle_unchecked.png');

const SquareCheckbox = ({ value, onValueChange }) => {
    return (
        <TouchableOpacity onPress={() => onValueChange(!value)}>
            <Image source={value ? checkboxImage : uncheckedImage} style={{ width: 26, height: 26, marginRight: 8 }} />
        </TouchableOpacity>
    );
};

const CircleCheckbox = ({ value, onValueChange }) => {
    return (
        <TouchableOpacity onPress={() => onValueChange(!value)}>
            <Image source={value ? circlecheckboxImage : circleuncheckedImage} style={{ width: 22, height: 22, marginRight: 8 }} />
        </TouchableOpacity>
    );
};

export { SquareCheckbox, CircleCheckbox };





