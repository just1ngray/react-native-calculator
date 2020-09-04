import React, { useState, useEffect } from 'react';
import { 
    StyleSheet, 
    View, 
    AsyncStorage, 
    Alert 
} from 'react-native';

import MemoryButton from './MemoryButton';

export interface SaveItem {
    order: number,
    value: string
}

interface Props {
    handleAddToMain: (num: string) => void,
    toggleEditMemoryMode: (item: SaveItem) => void,
    overrideItem?: SaveItem
}

export default function Memory(props: Props) {
    const [memory, setMemory] = useState<SaveItem[]>([]);

    /**
     * Get a copy of the current memory state
     * @param searchOrder optionally search for a given order item
     * @returns [copy of memory state, index of search]
     */
    function getMemoryCopy(searchOrder?: number): [SaveItem[], number] {
        const copy: SaveItem[] = [];
        let index = -1;
        memory.forEach((savedItem, i) => {
            copy.push({...savedItem});
            if (savedItem.order === searchOrder) index = i;
        });
        return [copy, index];
    }

    useEffect(() => {
        function getStoragePair(key: string): Promise<string[]> {
            key = "m" + key;
            return new Promise((resolve, reject) => {
                AsyncStorage.getItem(key)
                    .then(val => resolve([key, val ?? '']))
                    .catch(err => reject(err));
            });
        }

        async function restore() {
            const keys: string[] = JSON.parse(await AsyncStorage.getItem('memSlots') ?? '[]');

            const retrievals = keys.map(k => getStoragePair(k));
            Promise.all(retrievals).then(savedItems => {
                const memory: SaveItem[] = [];
                savedItems.forEach(item => {
                    memory.push({
                        order: parseInt(item[0].substring(1, item[0].length)),
                        value: item[1]
                    });
                });
                
                memory.sort((a: SaveItem, b: SaveItem): number => a.order - b.order);
                setMemory(memory);
            });
        }

        restore();
    }, []);

    /**
     * Save a single item to storage
     * @param item the item to save to storage
     * @param remove    if the item should be removed instead
     */
    async function saveOne(item: SaveItem, action: 'save' | 'remove' = 'save') {
        const remove: boolean = action === 'remove';

        if (remove) AsyncStorage.removeItem(`m${item.order}`);
        else AsyncStorage.setItem(`m${item.order}`, item.value)
            // .then(() => console.log(item))
            .catch(err => console.error(err));

        try {
            const slots: number[] = JSON.parse(await AsyncStorage.getItem('memSlots') ?? '[]');

            if (remove) {
                AsyncStorage.setItem('memSlots', JSON.stringify(
                    slots.filter(n => n !== item.order)
                ));
            } else if (!slots.includes(item.order))
                AsyncStorage.setItem('memSlots', JSON.stringify([...slots, item.order]))
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Prompt to start editing a memory item
     * @param item the item you are editing
     */
    function handleEditStart(item: SaveItem) {
        Alert.alert(
            `${item.value}`,
            'todo instructions',
            [
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        saveOne(item, 'remove');
                        const [copy, index] = getMemoryCopy(item.order);
                        copy.splice(index, 1);
                        setMemory(copy);
                    }
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Edit',
                    onPress: () => {
                        props.toggleEditMemoryMode(item);
                    }
                }
            ]
        );
    }

    /**
     * Finish editing a memory item
     * @param item the item that was just edited (new)
     */
    function handleEditStop(item: SaveItem) {
        props.toggleEditMemoryMode(item);
        saveOne(item);
        
        const [copy, index] = getMemoryCopy(item.order);
        copy[index] = item;
        setMemory(copy);
    }

    const jsx: JSX.Element[] = memory
        .map(item => {
            if (props.overrideItem?.order === item.order) {
                return <MemoryButton 
                    item={{ order: item.order, value: props.overrideItem.value }} 
                    handlePress={() => handleEditStop(props.overrideItem!)} 
                    handleEdit={() => handleEditStop(props.overrideItem!)}
                    isEditing
                    key={item.order} />
            } else {
                return <MemoryButton 
                    item={item} 
                    handlePress={() => props.handleAddToMain(item.value)} 
                    handleEdit={() => handleEditStart(item)}
                    key={item.order} />
            }
        });

    return (
        <View style={styles.container}>
            {jsx}
            <MemoryButton 
                item={{
                    order: memory.length + 1,
                    value: 'Add +'
                }} 
                handlePress={() => {}} 
                handleEdit={() => {
                    const newItem = { order: memory.length + 1, value: '0.00' };
                    saveOne(newItem);
                    const [copy] = getMemoryCopy();
                    copy.push(newItem);
                    setMemory(copy);
                }}
                key='add' />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        flexGrow: 1,
        flexWrap: 'wrap'
    },
});

// const testData: SaveItem[] = [
//     { order: 1, value: '3.14' },
//     { order: 2, value: '9.81' },
//     { order: 3, value: '2.72' }
// ];