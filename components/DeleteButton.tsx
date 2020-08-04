import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface Props {
    amount: 'one' | 'all',
    backspace: (amount: 'one' | 'all') => void,
    children: JSX.Element
}

export default function DeleteButton(props: Props) {
    return (
        <TouchableOpacity onPress={() => props.backspace(props.amount)}>
            {props.children}
        </TouchableOpacity>
    );
}