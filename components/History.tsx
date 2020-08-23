import React, { 
    useRef,
    useEffect,
    useState,
} from 'react';
import { 
    View, 
    ScrollView, 
    Text 
} from 'react-native';

interface Props {
    history: string[],
    currentVal: string,
    handlePressHistory: (viewing: string) => void,
}

export default function History(props: Props) {
    const scrollRef = useRef<null | ScrollView>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(props.history.length - 1);

    useEffect(() => {
        if (scrollRef && scrollRef.current)
            scrollRef.current.scrollToEnd();

        if (selectedIndex === -1) setSelectedIndex(props.history.length - 1);
    }, [props.history.length]);

    const history: any[] = [...props.history, props.currentVal]
        .map((h: string, i: number) => (
            <Text style={{
                    textAlign: 'right',
                    fontSize: 24,
                    color: selectedIndex === i ? 'red' : 'gray',
                }}
                numberOfLines={1}
                ellipsizeMode='head'
                key={i} 
                onPress={() => {
                    if (selectedIndex === i) {
                        props.handlePressHistory([...props.history, props.currentVal][selectedIndex]);
                    } else setSelectedIndex(i);
                }}>
                {h}
            </Text>
        )
    );

    return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <ScrollView style={{
                    flexGrow: 1,
                    overflow: 'hidden',
                }}
                ref={scrollRef}
                decelerationRate='fast'
            >
                {history}
            </ScrollView>
        </View>
    );
}