'use strict';

const defaultResult = 0;

let currentResult = defaultResult;

const logEntries = [];

const getInputNumber = function () {
    return parseInt(userInput.value);
};

const logCalculationDescription = function (operator, previousResult, inputNumber) {
    const calculationDescription = `${previousResult} ${operator} ${inputNumber}`;

    outputResult(currentResult, calculationDescription);
};

const addLogEntry = function (logEntry) {
    logEntries.push(logEntry);
};

const calculateOperation = function (operator) {
    const previousResult = currentResult;
    const inputNumber = getInputNumber();

    switch(operator){
        case '+':
            currentResult += inputNumber;
            break;
        case '-':
            currentResult -= inputNumber;
            break;
        case '*':
            currentResult *= inputNumber;
            break;
        case '/':
            currentResult /= inputNumber;
            break;
    }

    logCalculationDescription(operator, previousResult, inputNumber);

    return {
        previousResult,
        operator,
        inputNumber,
        currentResult
    };
};

const add = function () {
    const logEntry = calculateOperation('+');
    addLogEntry(logEntry);
};

const subtract = function () {
    const logEntry = calculateOperation('-');
    addLogEntry(logEntry);
};

const multiply = function () {
    const logEntry = calculateOperation('*');
    addLogEntry(logEntry);
};

const divide = function () {
    const logEntry = calculateOperation('/');
    addLogEntry(logEntry);
};

addBtn.addEventListener('click', add);

subtractBtn.addEventListener('click', subtract);

multiplyBtn.addEventListener('click', multiply);

divideBtn.addEventListener('click', divide);

if([]){
    console.log('yes');
}else{
    console.log('no');
}