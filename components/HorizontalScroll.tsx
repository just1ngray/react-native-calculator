import React, { useEffect, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';

interface Props {
    text: string,
    maxFontSize: number,
}

export default function HorizontalScroll(props: Props) {
    useEffect(() => {
        if (scrollRef && scrollRef.current) {
            scrollRef.current.scrollToEnd();
        }
    }, [props.text]);

    const scrollRef = useRef<null | ScrollView>(null);

    return (
        <View style={{ 
            height: props.maxFontSize,
            marginLeft: 20
        }}>
            <ScrollView
                    horizontal={true} 
                    ref={scrollRef}>
                <Text style={{ fontSize: props.maxFontSize }}>
                    {props.text}
                </Text>
            </ScrollView>
        </View>
    );
}