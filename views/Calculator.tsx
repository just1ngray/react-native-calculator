import React, { useState } from 'react'
import { Dimensions, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import CalcButton from '../components/CalcButton';
import DeleteButton from '../components/DeleteButton';
import HorizontalScroll from '../components/HorizontalScroll';
import calculate from '../util/calculate';

const safeX = 4;
const window = Dimensions.get('window');
const btnWidth = (window.width / 4) - (2 * safeX);

export default function Calculator() {
    const [main, setMain] = useState('');
    const [sub, setSub] = useState('');

    const dimensions = {
        rowHeight: btnWidth,
        colWidth: btnWidth
    }

    function handlePress(label: string): void {
        if (label !== '=') {
            setMain(main + label);
            setSub(calculate(main + label));
        } else {
            setSub(main);
            setMain(calculate(main));
        }
    }

    function backspace(howMany: 'one' | 'all'): void {
        let newMain;
        switch (howMany) {
            case 'one':
                newMain = main.substring(0, main.length - 1);
                break;
            case 'all': 
                newMain = ''; 
                break;
        }
        setMain(newMain);
        setSub(calculate(newMain));
    }

    return (
        <View style={{ paddingHorizontal: safeX, flexGrow: 1 }}>
            <View style={{ flexGrow: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                <View style={{ flexDirection: 'row-reverse' }}>
                    <Text>{sub}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <HorizontalScroll text={main} maxFontSize={btnWidth * 0.8} />
                    <View style={{ justifyContent: 'space-around' }}>
                        <DeleteButton amount='one' backspace={backspace}>
                            <Feather name='delete' size={24} color='gray' />
                        </DeleteButton>
                        <DeleteButton amount='all' backspace={backspace}>
                            <MaterialCommunityIcons name='close-circle-outline' size={24} color='gray' />
                        </DeleteButton>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <CalcButton dimensions={dimensions} label='^' color='orange' handlePress={handlePress} />
                <CalcButton dimensions={dimensions} label='(' color='orange' handlePress={handlePress} />
                <CalcButton dimensions={dimensions} label=')' color='orange' handlePress={handlePress} />
                <CalcButton dimensions={dimensions} label='/' color='orange' handlePress={handlePress} />
            </View>
            <View style={{ flexDirection: 'row' }}>
                <CalcButton dimensions={dimensions} label='7' handlePress={handlePress} />
                <CalcButton dimensions={dimensions} label='8' handlePress={handlePress} />
                <CalcButton dimensions={dimensions} label='9' handlePress={handlePress} />
                <CalcButton dimensions={dimensions} label='*' color='orange' handlePress={handlePress} />
            </View>
            <View style={{ flexDirection: 'row' }}>
                <CalcButton dimensions={dimensions} label='4' handlePress={handlePress} />
                <CalcButton dimensions={dimensions} label='5' handlePress={handlePress} />
                <CalcButton dimensions={dimensions} label='6' handlePress={handlePress} />
                <CalcButton dimensions={dimensions} label='-' color='orange' handlePress={handlePress} />
            </View>
            <View style={{ flexDirection: 'row' }}>
                <CalcButton dimensions={dimensions} label='1' handlePress={handlePress} />
                <CalcButton dimensions={dimensions} label='2' handlePress={handlePress} />
                <CalcButton dimensions={dimensions} label='3' handlePress={handlePress} />
                <CalcButton dimensions={dimensions} label='+' color='orange' handlePress={handlePress} />
            </View>
            <View style={{ flexDirection: 'row' }}>
                <CalcButton dimensions={dimensions} numCols={2} label='0' handlePress={handlePress} />
                <CalcButton dimensions={dimensions} label='.' handlePress={handlePress} />
                <CalcButton dimensions={dimensions} label='=' color='orange' handlePress={handlePress} />
            </View>
        </View>
    );
}