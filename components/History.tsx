import React, { 
    useRef,
    useEffect,
} from 'react';
import { 
    View, 
    ScrollView, 
    Text, 
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import { Ionicons } from '@expo/vector-icons'; 

interface Props {
    history: string[],
    currentVal: string,
    handlePressHistory: (viewing: string) => void,
    totalWidth: number,
    totalHeight: number
}

export default function History(props: Props) {
    const scrollRef = useRef<null | ScrollView>(null);

    /**
     * Scroll to the end whenever one (or both)
     * 1. A new history item was added
     * 2. The current value was changed
     */
    useEffect(() => {
        if (scrollRef && scrollRef.current)
            scrollRef.current.scrollTo({ y: 0, animated: true });

    }, [props.history.length, props.currentVal]);

    const history: any[] = [props.currentVal, ...props.history]
        .filter(str => str.trim().length > 0)
        .map((h: string, i: number) => (
            <TouchableOpacity 
                onPress={() => props.handlePressHistory(h.substring(h.indexOf('=') + 2, h.length))}
                style={styles.historyEntry} 
                key={i}>

                <Text style={styles.text}
                    numberOfLines={1}
                    ellipsizeMode='head'>

                    {h}
                </Text>
                <View style={{ 
                    height: '100%', 
                    justifyContent: 'center',
                    marginLeft: 5
                }}>
                    <Ionicons name='ios-add-circle-outline' size={24} color='gray' />
                </View>
            </TouchableOpacity>
        )
    );

    return (
        <View style={[styles.container, { 
            width: props.totalWidth,
            height: props.totalHeight
        }]}>
            <InvertibleScrollView 
                style={styles.scroller}
                ref={scrollRef}
                decelerationRate='fast'
                inverted>

                {history}
            </InvertibleScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'flex-end',
        bottom: 0,
        right: 0,
    },
    scroller: {
        width: '100%'
    },
    historyEntry: {
        borderBottomWidth: 1,
        borderBottomColor: '#dede',
        justifyContent: 'flex-end',
        marginRight: 10,
        flexDirection: 'row',
    },
    text: {
        textAlign: 'right',
        fontSize: 24,
        color: 'gray',
        paddingLeft: 10
    }
});