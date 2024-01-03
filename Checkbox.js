import React from 'react';
import { Image, TouchableOpacity } from 'react-native';

const checkboxImage = require('./assets/checkbox.png');
const uncheckedImage = require('./assets/unchecked.png');

const circlecheckboxImage = require('./assets/circle_checkbox.png');
const circleuncheckedImage = require('./assets/circle_unchecked.png');

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





