class ArrayUtils {
    static pushRangeNoOverlap(array, range, subtract=false) {
        for (let i = 0; i < array.length; i++) {
            // from various stack overflow threads
            if (array[i][0] === range[0] && array[i][1] === range[1]) {
                if (subtract)
                    array.splice(i, 1)
                // we can just assume that there are no more overlaps
                return
            } else if (array[i][0] <= range[1] && array[i][1] >= range[0]) {
                if (!subtract) {
                    // get non overlapping range
                    const min = Math.min(array[i][0], array[i][1], range[0], range[1])
                    const max = Math.max(array[i][0], array[i][1], range[0], range[1])

                    array.splice(i, 1)
                    // cant assume no more overlaps given we actualyl changed a range
                    this.pushRangeNoOverlap(array, [min, max])
                    return                    
                } else {
                    // determine the direction of overlap
                    let newRange = null
                    // if it is completely surrounded
                    if (array[i][0] <= range[0] && array[i][1] >= range[1]) {
                        newRange = [ array[i][0], range[0] ]
                        const newRange2 = [ range[1], array[i][1] ]
                        array.splice(i, 1)
                        if (newRange[0] !== newRange[1])
                            array.push(newRange)
                        if (newRange2[0] !== newRange[1])
                            array.push(newRange2)
                        array.sort((lVal, rVal) => rVal[0] - lVal[0])
                        // it cant actually overlap on anything anymore
                        return
                    } else if (range[0] <= array[i][0] && range[1] >= array[i][1]) {
                        array.splice(i, 1)
                    }
                    else {
                        if (array[i][0] < range[0])
                            newRange = [ array[i][0], range[0] ]
                        else
                            newRange = [ range[1], array[i][1] ]
                        array.splice(i, 1)
                        array.push(newRange)
                    }

                }
            }
        }
        if (!subtract)
            array.push(range)
        // guarantee order of array
        array.sort((lVal, rVal) => rVal[0] - lVal[0])
    }
}

export default ArrayUtils