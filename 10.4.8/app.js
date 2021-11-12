const filterOutOdds = (...args) => args.filter(num => num % 2 === 0);

const findMin = (...args) => Math.min(...args);

const mergeObjects = (o1, o2) => ({...o1, ...o2});

const doubleAndReturnArgs = (arr, ...args) => [...arr, ...args.map(a => a*2)];

const removeRandom = items => {
    let i = Math.floor(Math.random() * items.length);
    return [...items.slice(0, i), ...items.slice(i + 1)];
}

const extend = (array1, array2) => [...array1, ...array2];

const addKeyVal = (obj, key, val) => {
    let newObject = {...obj};
    newObject[key] = val;
    return newObject;
}

const removeKey = (obj, key) => {
    let newObject = {...obj};
    delete newObject[key];
    return newObject;
}

const  combine = (obj1, obj2) => ({...obj1, ...obj2});

const update = (obj, key, val) => {
    let newObject = {...obj};
    newObject[key] = val;
    return newObject;
}
