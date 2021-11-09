const colors = ["red", "yellow", "green", "brown", "scarlet", "black", "ochre", "peach"];

function myForEach(arr, func) {
    for(let i = 0; i < arr.length; i++) {
        func(arr[i], i, arr);
    }
}

function myMap(arr, func) {
    let newArr = [];

    for(let i = 0; i < arr.length; i++) {
        newArr.push(func(arr[i], i, arr));
    }

    return newArr;
}

function myFilter(arr, func) {
    let newArr = [];

    for(let i = 0; i < arr.length; i++) {
        if(func(arr[i], i, arr)) {
            newArr.push(arr[i]);
        }
    }

    return newArr;
}

function mySum(arr, func) {
    for(let i = 0; i < arr.length; i++) {
        if(func(arr[i], i, arr)) {
            return true;
        }
    }
    return false;
}

function myEvery(arr, func) {
    for(let i = 0; i < arr.length; i++) {
        if(!func(arr[i], i, arr)) {
            return false;
        }
    }
    return true;
}

function myFind(arr, func) {
    for(let i = 0; i < arr.length; i++) {
        if(func(arr[i], i, arr) === true) {
            return arr[i];
        }
    }
    // return undefined is implied
}

function myFindIndex(arr, func) {
    for(let i = 0; i < arr.length; i++) {
        if(func(arr[i], i, arr) === true) {
            return i;
        }
    }
    return -1;
}

function reverse(text) {
    return text.toUpperCase().split("").reverse().join("");
}

function putOnPage(item, id) {
    let paragraph = document.createElement("p");
    paragraph.innerText = item;
    document.querySelector(`body #${id}`).appendChild(paragraph);
}

function hasAnA(text) {
    return text.includes("a");
}

myForEach(colors, function(color, i) {
    putOnPage(color.toUpperCase() + " at index " + i, "forEach");
});

myForEach(myMap(colors, reverse), function(color, i){
    putOnPage(color.toUpperCase() + " at index " + i, "map");
});

myForEach(myFilter(colors, hasAnA), function(color, i){
    putOnPage(color.toUpperCase() + " at index " + i, "filter");
});