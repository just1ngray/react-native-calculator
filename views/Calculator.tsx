import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import CalcButton from '../components/CalcButton';
import HorizontalScroll from '../components/HorizontalScroll';
import calculate from '../util/calculate';
import History from '../components/History';
import useDimensions from '../util/useDimensions';
import Memory, { SaveItem } from '../components/Memory/Memory';

interface MainDisplay {
    text: string,
    willDeleteOnNext: boolean,
}

interface HistoryData {
    history: string[],
    current: string
}

export default function Calculator() {
    const [mainDisplay, setMainDisplay] = useState<MainDisplay>({
        text: '',
        willDeleteOnNext: true,
    });
    const [historyData, setHistoryData] = useState<HistoryData>({
        current: '',
        history: []
    });
    const [memoryEditOrder, setMemoryEditOrder] = useState<number>(-1);

    const rowRef = useRef<View | null>(null);
    const rowDimensions = useDimensions(rowRef);
    const fontSize = (rowDimensions.height ?? 0) * 0.5;

    const historyRef = useRef<View | null>(null);
    const historyDimensions = useDimensions(historyRef, 5);

    /**
     * Perform current history calculations
     */
    useEffect(() => {
        // todo: improve the robustness of this regular expression test
        const regex: RegExp = new RegExp('[0-9]+[^0-9|\.][0-9]+');
        setHistoryData({
            current: regex.test(mainDisplay.text) ? `${mainDisplay.text} = ${calculate(mainDisplay.text)}` : '',
            history: historyData.history
        });
    }, [mainDisplay.text]);

    /**
     * Handle pressing a calculator function button
     * @param label the label of the button that was pressed
     */
    function handlePressCalcButton(label: string): void {
        if (memoryEditOrder > -1 && label.includes('=')) return;

        if (label === '=') {
            // no need to re-calculate when we've just calculated!
            if (mainDisplay.willDeleteOnNext) return;

            const calculated = calculate(mainDisplay.text);
            setHistoryData({
                current: '',
                history: [`${mainDisplay.text} = ${calculated}`, ...historyData.history]
            });
            setMainDisplay({
                text: '= ' + calculated,
                willDeleteOnNext: true
            });
            return;
        }

        if (mainDisplay.willDeleteOnNext) {
            setMainDisplay({
                text: label,
                willDeleteOnNext: false
            });
        } else {
            setMainDisplay({
                text: mainDisplay.text + label,
                willDeleteOnNext: false
            });
        }
    }

    /**
     * Clear the main display - no questions asked
     */
    function clearMainText() {
        setMainDisplay({
            text: '',
            willDeleteOnNext: false
        });
    }

    /**
     * Remove only the last character from the display unless display is set to clear
     */
    function backspaceMainText() {
        if (mainDisplay.willDeleteOnNext) clearMainText();
        else setMainDisplay({
            text: mainDisplay.text.substring(0, mainDisplay.text.length - 1),
            willDeleteOnNext: false
        });
    }

    return (
        <View style={styles.container}>
            {/* Memory */}
            <View style={styles.memory}>
                <Memory 
                    handleAddToMain={handlePressCalcButton} 
                    toggleEditMemoryMode={(item: SaveItem) => {
                        setMemoryEditOrder(memoryEditOrder === -1 ? item.order : -1);
                        setMainDisplay({
                            text: '',
                            willDeleteOnNext: false
                        });
                    }}
                    overrideItem={memoryEditOrder !== -1 ? {
                        order: memoryEditOrder,
                        value: mainDisplay.text
                    }: undefined} />
            </View>

            {/* History */}
            <View style={styles.history} ref={historyRef}>
                <History 
                    currentVal={historyData.current} 
                    history={historyData.history}
                    handlePressHistory={handlePressCalcButton}
                    totalWidth={historyDimensions.width ?? 0}
                    totalHeight={historyDimensions.height ?? 0}
                />
            </View>

            {/* Main text */}
            {/* self-sizing useDimensions => no need to adjust here */}
            <View style={[styles.mainDisplay, { height: rowDimensions.height ?? 50 }]}>
                <HorizontalScroll
                    text={mainDisplay.text} 
                    fontSize={fontSize * 1.33} 
                    color={mainDisplay.willDeleteOnNext ? 'gray' : 'black'} 
                />
                <TouchableOpacity style={{ 
                        height: '100%', 
                        justifyContent: 'center',
                        paddingHorizontal: 3
                    }}
                    onPress={() => backspaceMainText()}
                    onLongPress={() => clearMainText()}>

                    <Feather name='delete' size={32} color='black' />
                </TouchableOpacity>
            </View>

            {/* Calc buttons */}
            <View style={{ 
                maxHeight: (rowDimensions.width ?? 50) * 1.25, // since the grid is 4x5 => *1.25
                flexGrow: 1,
            }}>
                <View style={styles.calcRow} ref={rowRef}>
                    <CalcButton label='^' handlePress={handlePressCalcButton} fontSize={fontSize} />
                    <CalcButton label='(' handlePress={handlePressCalcButton} fontSize={fontSize} />
                    <CalcButton label=')' handlePress={handlePressCalcButton} fontSize={fontSize} />
                    <CalcButton label='/' handlePress={handlePressCalcButton} fontSize={fontSize} />
                </View>
                <View style={styles.calcRow}>
                    <CalcButton label='7' handlePress={handlePressCalcButton} fontSize={fontSize} />
                    <CalcButton label='8' handlePress={handlePressCalcButton} fontSize={fontSize} />
                    <CalcButton label='9' handlePress={handlePressCalcButton} fontSize={fontSize} />
                    <CalcButton label='*' handlePress={handlePressCalcButton} fontSize={fontSize} />
                </View>
                <View style={styles.calcRow}>
                    <CalcButton label='4' handlePress={handlePressCalcButton} fontSize={fontSize} />
                    <CalcButton label='5' handlePress={handlePressCalcButton} fontSize={fontSize} />
                    <CalcButton label='6' handlePress={handlePressCalcButton} fontSize={fontSize} />
                    <CalcButton label='-' handlePress={handlePressCalcButton} fontSize={fontSize} />
                </View>
                <View style={styles.calcRow}>
                    <CalcButton label='1' handlePress={handlePressCalcButton} fontSize={fontSize} />
                    <CalcButton label='2' handlePress={handlePressCalcButton} fontSize={fontSize} />
                    <CalcButton label='3' handlePress={handlePressCalcButton} fontSize={fontSize} />
                    <CalcButton label='+' handlePress={handlePressCalcButton} fontSize={fontSize} />
                </View>
                <View style={styles.calcRow}>
                    <View style={{ flexGrow: 2, flexBasis: 0 }}>
                        <CalcButton label='0' handlePress={handlePressCalcButton} fontSize={fontSize} />
                    </View>
                    <CalcButton label='.' handlePress={handlePressCalcButton} fontSize={fontSize} />
                    <CalcButton label='=' handlePress={handlePressCalcButton} fontSize={fontSize} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        overflow: 'hidden',
    },
    memory: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    history: {
        flexGrow: 1,
        overflow: 'hidden',
    },
    mainDisplay: {
        maxHeight: '25%',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    calcRow: {
        flexDirection: 'row',
        flexGrow: 1,
        flexShrink: 0,
        justifyContent: 'space-evenly',
    },
});