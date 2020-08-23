import React, { useState } from 'react'
import { Dimensions, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import CalcButton from '../components/CalcButton';
import DeleteButton from '../components/DeleteButton';
import HorizontalScroll from '../components/HorizontalScroll';
import calculate from '../util/calculate';
import History from '../components/History';

const safeX = 4;
const window = Dimensions.get('window');
const btnWidth = (window.width / 4) - (2 * safeX);

export default function Calculator() {
    const [main, setMain] = useState<string>('');
    const [didJustPressEq, setDidJustPressEq] = useState<boolean>(false);
    const [history, setHistory] = useState<string[]>([]);
    const [currentVal, setCurrentVal] = useState<string>('');

    const dimensions = {
        rowHeight: btnWidth,
        colWidth: btnWidth
    }

    /**
     * Handles main button presses
     * @param label the pressed button's label
     */
    function handlePress(label: string): void {
        if (label === '=') {
            const result = calculate(main);
            setHistory([...history, main + " = " + result]);
            setMain(result);
            setDidJustPressEq(true);

        } else {
            let newMain = label;
            if (!didJustPressEq) {
                newMain = main + label;
            } else setDidJustPressEq(false);

            setMain(newMain);
            setCurrentVal(calculate(newMain));
        }
    }

    /**
     * Handles backspacing characters
     * @param howMany how many chars to backspace
     */
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
        setCurrentVal(calculate(newMain));
    }

    function handlePressHistory(viewing: string) {
        if (viewing === 'clear') {
            setHistory([]);
            return;
        }
        if (viewing === 'current' || viewing.length < 3) return;

        const valToAdd = viewing.substring(viewing.indexOf('=') + 2, viewing.length);
        setMain(main + valToAdd);
        setCurrentVal(calculate(main + valToAdd));
    }

    return (
        <View style={{ paddingHorizontal: safeX, flexGrow: 1 }}>

            <View style={{ 
                flexGrow: 1, 
                justifyContent: 'flex-end',
            }}>
                <History currentVal={currentVal} 
                    history={history} 
                    handlePressHistory={handlePressHistory}
                />

                <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                    <HorizontalScroll text={main}
                        color={didJustPressEq ? 'darkgray' : 'black'} 
                        maxFontSize={btnWidth * 0.8} 
                    />

                    <View style={{ justifyContent: 'space-around' }}>
                        <DeleteButton amount='one' backspace={backspace}>
                            <Feather name='delete' size={32} color='gray' />
                        </DeleteButton>
                        <DeleteButton amount='all' backspace={backspace}>
                            <MaterialCommunityIcons name='close-circle-outline' size={32} color='gray' />
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