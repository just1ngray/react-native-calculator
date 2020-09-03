import { useLayoutEffect, useState, MutableRefObject } from 'react';

interface Dimensions {
    height: number | null,
    width: number | null,
    x: number | null,
    y: number | null
}

/**
 * Get the dimensions of a ref's bounding box if HTML, or if react-native
 * @param ref   the ref to measure
 * @returns dimensions object with number properties: height, width, x, y
 */
export default function(ref: MutableRefObject<any> | null): Dimensions {
    const [dimensions, setDimensions] = useState<Dimensions>({
        height: null,
        width: null,
        x: null,
        y: null
    });

    useLayoutEffect(() => {
        // HTML Element
        if (ref?.current?.offsetWidth !== undefined) {
            setDimensionsIfChanged({
                height: ref?.current?.offsetHeight,
                width: ref?.current?.offsetWidth,
                x: ref?.current?.offsetLeft,
                y: ref?.current?.offsetTop
            });
        }

        // React-Native Element
        else ref?.current?.measure((x: number, y: number, width: number, height: number) => {
            setDimensionsIfChanged({
                height: height,
                width: width,
                x: x,
                y: y
            });
        });
    });

    function setDimensionsIfChanged(newDimensions: Dimensions) {
        // setting from null to something
        if (dimensions.height === null && newDimensions.height !== null) {
            setDimensions(newDimensions);
        }

        // difference in one or more properties greater than threshold
        else if (
            Math.abs(dimensions.height! - newDimensions.height!) > 1! ||
            Math.abs(dimensions.width! - newDimensions.width!) > 1! ||
            Math.abs(dimensions.x! - newDimensions.x!) > 1! ||
            Math.abs(dimensions.y! - newDimensions.y!) > 1!
        ) {
            setDimensions(newDimensions);
        }
    }

    return dimensions;
}