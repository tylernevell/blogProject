'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}


/*
 * Complete the 'isCurrency' function below.
 *
 * The function is expected to return a BOOLEAN.
 * The function accepts STRING strAmount as parameter.
 */

function isCurrency(strAmount) {
    // Write your code here

    // My approach is to separate each check of the str into different functions
    // to make the code easier to follow and build, returning the boolean up the
    // hierarchy of functions. Instead of having a mess of logic gates where
    // every potential currency string is going through the same gates, I can
    // separate their paths depending on what chars it consists of

    // Switch statements in multiple functions may be best approach for this

    // what makes this so difficult is that there seems to be so many
    // possible rules that need to be checked for. There is probably a simpler
    // way of checking for all of these, but I can refactor as I go.

    let firstChar = strAmount.slice(0,1);
    if (firstChar === '-') {
        let secondChar = strAmount.slice(1,2);
        if (secondChar === '(') {
            // where first two chars are '-' and '('
            return currencyValidSymbol(strAmount.slice(2));
        } else {
            // where first char is '-' and must be followed by a valid currency
            // symbol
            return currencyValidSymbol(strAmount.slice(1));
        }
        // where first char is '(' and must be followed by a valid currency symbol
    } else if (firstChar === '(') {
        return currencyValidSymbol(strAmount.slice(1));
    }

}

// function to check if there a valid currency symbol
function currencyValidSymbol(strAmount) {
    switch (strAmount.slice(0,1)) {
        case '€':
            return euroValidation(strAmount.slice(1));
        case '$':
            return dollarValidation(strAmount.slice(1));
        case '¥':
            return yenValidation(strAmount.slice(1));
        default:
            return false;
    }
}

// check if leading zero is valid
function leadingZeroValid(strAmount) {
    let firstChar = strAmount.slice(0,1);
    let secondChar = strAmount.slice(1,2);
    if (firstChar === '0' && secondChar === '.') {
        return true;
    }
    return false;
}

function dollarValidation(strAmount) {
    // ok, so dollar amounts must be base 10
    // both euro and dollar can start with one '0' but must be followed by decimal
    let firstChar = strAmount.slice(0,1);
    if (firstChar === '0') {
        if (!leadingZeroValid(strAmount)) {
            return false;
        }
    }

    // iterate to find if thousands separators are present...
    for (let i = 0; i < strAmount.length; i++) {
        if (strAmount[i] === ',') {
            return thousandsValidation(strAmount.slice(i));
        } else if (strAmount[i] === '.') {
            if (i + 3 >= strAmount.length) {
                return false;
            }
            return centValidation(strAmount);
        }
    }
}

function euroValidation(strAmount) {
    let firstChar = strAmount.slice(0,1);
    if (firstChar === '0') {
        if (!leadingZeroValid(strAmount)) {
            return false;
        }
    }

    for (let i = 0; i < strAmount.length; i++) {
        if (strAmount[i] === ',') {
            return thousandsValidation(strAmount.slice(i));
        } else if (strAmount[i] === '.') {
            if (i + 3 >= strAmount.length) {
                return false;
            }
            return centValidation(strAmount);
        }
    }
}

function yenValidation(strAmount) {

}

function thousandsValidation(strAmount) {
    // at every index divisible by 4, it must be a comma or period
    // ,000,000,000,000,000. etc
    for (let i = 0; i < strAmount.length; i++) {
        if (i % 4 === 0) {
            if (!(strAmount[i] === ',' || strAmount[i] === '.')) {
                return false;
            } else if (strAmount[i] === '.') {
                return centValidation(strAmount.slice(i+1));
            }
        } else if (!(isNumeric(strAmount[i]))) {
            return false;
        }
    }
}

function centValidation (strAmount) {
    if (strAmount.length !== 2) {
        return false;
    }
    return isNumeric(strAmount);
}