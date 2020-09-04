import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';
import { SaveItem } from './Memory';

interface Props {
    item: SaveItem,
    handlePress: (n: string) => void,
    handleEdit: (item: SaveItem) => void,
    isEditing?: boolean
}

export default function MemoryButton(props: Props) {
    const { textStyle } = StyleSheet.create({
        textStyle: {
            fontSize: props.isEditing ? 24 : 15,
            color: props.isEditing ? 'white' : 'black',
        }
    });

    return (
        <TouchableOpacity 
            style={[styles.button, {
                backgroundColor: props.isEditing ? 'dodgerblue' : 'orange'
            }]} 
            onPress={() => props.handlePress(props.item.value)}
            onLongPress={() => props.handleEdit(props.item)}>

            <Text style={textStyle}>
                {props.item.value}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
    }
});