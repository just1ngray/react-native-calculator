import React, { useRef } from 'react';
import { Text, View, ScrollView } from 'react-native';
import InvertibleScrollView from 'react-native-invertible-scroll-view';

interface Props {
    text: string,
    maxFontSize: number,
    color?: string
}

export default function HorizontalScroll(props: Props) {
    const scrollRef = useRef<null | ScrollView>(null);

    return (
        <View style={{ 
            height: props.maxFontSize,
            flexGrow: 1
        }}>
            <InvertibleScrollView inverted={true}
                ref={scrollRef}
                onContentSizeChange={() => {
                    if (scrollRef.current)
                        scrollRef.current.scrollTo({ y: 0, animated: true });
                }}
                horizontal={true}
            >
                <Text style={{ 
                    fontSize: props.maxFontSize,
                    color: props.color || 'black',
                    paddingLeft: 30
                }}>
                    {props.text}
                </Text>
            </InvertibleScrollView>
        </View>
    );
}