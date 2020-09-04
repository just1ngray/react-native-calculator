import React, { useRef } from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

interface Props {
    text: string,
    fontSize: number,
    color?: string
}

export default function HorizontalScroll(props: Props) {
    const scrollRef = useRef<null | ScrollView>(null);

    return (
        <View style={styles.container}>
            <InvertibleScrollView onContentSizeChange={() => {
                    if (scrollRef.current) 
                        scrollRef.current.scrollTo({ y: 0, animated: true });
                }}
                inverted horizontal
                ref={scrollRef}>

                <View style={styles.insideScroller}>
                    <Text style={{ 
                        fontSize: props.fontSize,
                        color: props.color ?? 'black',
                    }}>
                        {props.text}
                    </Text>
                </View>
            </InvertibleScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%', 
        flexGrow: 1,
        marginLeft: 40  // accounting for delete icon
    },
    insideScroller: {
        height: '100%',
        justifyContent: 'center'
    }
})