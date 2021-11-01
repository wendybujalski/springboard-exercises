function countdown(num) {
    let t = setInterval(() => {
        if(num <= 0) {
            console.log("DONE!");
            clearInterval(t);
        } else {
            console.log(num);
            num--;
        }
    }, 1000);
}

function randomGame() {
    let c = 0;
    let t = setInterval(() => {
        let n = Math.random()
        c++;
        //console.log(`TRY ${c} = ${n}`);
        if(n > .75) {
            if(c === 1) {
                console.log(`It took just one try to get a number above .75`);
            } else {
                console.log(`It took ${c} tries to get a number above .75`);
            }
            clearTimeout(t);
        }
    }, 1000);
}