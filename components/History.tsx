import React, { useState, useEffect } from 'react';
import { View, Picker, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
    history: string[],
    currentVal: string,
    handlePressHistory: (viewing: string) => void,
    width?: number
}

export default function History(props: Props) {
    const [viewVal, setViewVal] = useState('current');

    useEffect(() => {
        setViewVal('current');
    }, [props.currentVal]);

    const items: JSX.Element[] = [];
    props.history.forEach((item, index) => {
        items.push(
            <Picker.Item label={item} value={item} key={String(index)} />
        );
    });

    return (
        <View style={{ flexDirection: 'row' }}>
            <Picker 
                style={{
                    flex: 1,
                    width: props.width || 'auto',
                    height: 130,
                    overflow: 'hidden',
                }}
                itemStyle={{
                    textAlign: 'right'
                }}
                selectedValue={viewVal}
                onValueChange={itemValue => setViewVal(itemValue)}
            >
                {items}
                <Picker.Item 
                    label={props.currentVal.length > 0 ? "= " + props.currentVal : ''} 
                    value='current'
                />
            </Picker>

            <TouchableOpacity 
                style={{ 
                    alignSelf: 'flex-end',
                    transform: [{ translateY: -8 }],
                    marginLeft: 3
                }}
                onPress={() => props.handlePressHistory(viewVal)}
                onLongPress={() => props.handlePressHistory('clear')}
            >
                <Feather name='clock' size={24} color='gray' />
            </TouchableOpacity>
        </View>
    );
}