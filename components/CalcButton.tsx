import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const margin = 3;

interface Props {
    label: string,
    dimensions: {
        rowHeight: number,
        colWidth: number
    },
    handlePress: (label: string) => void,
    numRows?: number,
    numCols?: number,
    color?: string
}

export default function CalcButton(props: Props) {
    const dims = props.dimensions;

    const numCols = props.numCols ? props.numCols : 1;
    const numRows = props.numRows ? props.numRows : 1;
    const backgroundColor = props.color ? props.color : '#d9d9d9';

    const colMargins = numCols > 1 ? (numCols - 1) * margin * 2 : 0;
    const rowMargins = numRows > 1 ? (numRows - 1) * margin * 2 : 0;

    const styles = StyleSheet.create({
        container: {
            width: (dims.colWidth * numCols) + colMargins,
            height: (dims.rowHeight * numRows) + rowMargins,
            backgroundColor: backgroundColor,
            borderRadius: Math.max(dims.colWidth / 10, 20),
            margin: margin
        },
        label: {
            fontSize: dims.rowHeight * .6,
            alignSelf: 'center',
            lineHeight: dims.rowHeight,
        }
    });

    return (
        <TouchableOpacity 
                style={styles.container} 
                onPress={() => props.handlePress(props.label)}>
            <Text style={styles.label}>{props.label}</Text>
        </TouchableOpacity>
    );
}