import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
    label: string,
    fontSize?: number,
    handlePress: (label: string) => void,
}

export default function CalcButton(props: Props) {
    return (
        <TouchableOpacity style={[styles.button, {
            borderRadius: 40,
            backgroundColor: props.label.match(/^([0-9]|\.)$/) ? 'lightgray' : 'orange'
        }]}
            onPress={() => props.handlePress(props.label)}>
            
            <Text style={
                props.fontSize ? [styles.label, { fontSize: props.fontSize }] : styles.label
            }>{props.label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexGrow: 1,
        margin: 3,
        flexBasis: 0,
        justifyContent: 'center',
    },
    label: {
        textAlign: 'center',
        margin: 0,
        padding: 0,
    },
});