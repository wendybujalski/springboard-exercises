// What does the following code return?
new Set([1,1,2,2,3,4])
// {1, 2, 3, 4}


// What does the following code return?
const a = [...new Set("referee")].join("");
// "ref"


// What does the Map m look like after running the following code?
let m = new Map();
m.set([1,2,3], true);
m.set([1,2,3], false);
// Map(2) { 0: {Array(3) => true}, 1: {Array(3) => false} }

// Write a function called hasDuplicate which accepts an array and returns true or false if that array contains a duplicate

const hasDuplicate = arr => new Set(arr).size !== arr.length;

// Write a function called vowelCount which accepts a string and returns a map where the keys are numbers and the values are the count of the vowels in the string.

const vowelCount = str => {
    const isCharVowel = (char) => "aeiou".includes(char);

    const mapCount = new Map();

    for(let char of str) {
        let lc = char.toLowerCase();
        if(isCharVowel(lc)) {
            if(mapCount.has(lc)) {
                mapCount.set(lc, mapCount.get(lc) + 1);
            } else {
                mapCount.set(lc, 1);
            }
        }
    }

    return mapCount;
}