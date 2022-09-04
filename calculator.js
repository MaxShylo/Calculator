'use strict'

const calculator = document.querySelector('.calculator');
const calculatorHistory = calculator.querySelector('.calculator__history');
const display = calculator.querySelector('.calculator__currentNum');
const memoryIndicator = calculator.querySelector('.calculator__memory-indicator');
const calculatorButtons = calculator.querySelectorAll('.button');

const digit = '.0123456789';
const baseOperation = '+-*/';
const maxHistoryLength = 33;
const maxDecimalNums = 8;
let history = '';
let currentValue = '0';
let result = null;
let operator = '';
let memoryValue = 0;
let isNumEntered = false;
let isNegative = false;

calculator.addEventListener('mousedown', (event) => {
  event.preventDefault();
});

calculatorButtons.forEach(button => {
  button.addEventListener('mouseup', (event) => {
    const button = event.target;

    button.style.transform = 'scale(1)';
  })
})

calculatorButtons.forEach(button => {
  button.addEventListener('mouseout', (event) => {
    const button = event.target;

    button.style.transform = 'scale(1)';
  })
})

calculatorButtons.forEach(button => {
  button.addEventListener('mousedown', (event) => {
    const button = event.target;

    button.style.transform = 'scale(0.8)';
  })
})

calculatorButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const { key, value } = event.target.dataset;

    if (key) {
      switch (key) {
        case 'Num':
          inputNumber(value);
          break;

        case 'Point':
          if (currentValue.indexOf('.') === -1) {
            currentValue += '.';
            isNumEntered = true;
          }

          break;

        case 'Base':
          baseCount(value);
          break;

        case 'Equal':
          equal();
          break;

        case 'Clear':
          clear();
          break;

        case 'BACK':
          backspace();
          break;

        case 'Negate':
          isNumEntered = true;
          isNegative = true;

          break;

        case 'MC':
          memoryValue = 0;

          activateMemory();
          break;

        case 'MR':
          currentValue = `${memoryValue}`;

          activateMemory();
          break;

        case 'MS':
          memoryValue = +currentValue;

          activateMemory();
          break;

        case 'M+':
          memoryValue += +currentValue;

          activateMemory();
          break;

        case 'M-':
          memoryValue -= +currentValue;

          activateMemory();
          break;
      }

      showDisplay();
    }
  })
})

function inputNumber(num) {
  if (isNumEntered) {
    currentValue += num;

    if (currentValue.length > 14) {
      currentValue = currentValue.slice(0, 14);
    }
  } else {
    isNumEntered = true;
    currentValue = num;
  }
}

function count() {
  if (result !== null) {
    result = parseFloat(result);
    currentValue = parseFloat(currentValue);
  }

  if (isNaN(result) || isNaN(currentValue)) {
    return;
  }

  if (result === null && memoryValue !== 0) {
    result = memoryValue;
  }

  switch (operator) {
    case '+':
      result = result + (+currentValue);
      break;

    case '-':
      result = result - currentValue;
      break;

    case '*':
      result = result * currentValue;
      break;

    case '/':
      if (currentValue === 0) {
        alert('Can\'t divide by zero!!!');

        return 'error';
      }

      result = result / currentValue;
      break;

    default:
      result = +currentValue;
  }

  if (result.toString().length > 14) {
    result = +(result.toString().slice(0, 14));
  }
}

function baseCount(operation) {
  if (isNumEntered) {
    const countResult = count();
    const additionalPartHistory = ` ${currentValue} ${operation}`;
    const additionalPartLength = additionalPartHistory.length;
    const isEnoughSpace = (history.length + additionalPartLength) <= maxHistoryLength;

    if (countResult !== 'error') {
      if (!isEnoughSpace) {
        let findFirstGapIndex;
        const isCurrentDigit = digit.includes(history[additionalPartLength - 1]);
        const isNextDigit = digit.includes(history[additionalPartLength]);
        const isCurrentOperator = baseOperation.includes(history[additionalPartLength - 1]);
        const isNextOperator = baseOperation.includes(history[additionalPartLength]);

        if (!isCurrentDigit && isNextDigit) {
          findFirstGapIndex = additionalPartLength - 4;
        }

        if (isCurrentOperator && !isNextDigit) {
          findFirstGapIndex = additionalPartLength - 3;
        }

        if (!isCurrentDigit && isNextOperator) {
          findFirstGapIndex = additionalPartLength - 2;
        }

        if (isCurrentDigit) {
          findFirstGapIndex = additionalPartLength - 1;
        }

        const startSlicedIndex = history.indexOf(' ', findFirstGapIndex);
        const slicedHistory = history.slice(startSlicedIndex + 3);
        
        history = slicedHistory + additionalPartHistory;
      } else {
        history += additionalPartHistory;
      }
    }

    isNumEntered = false;
    currentValue = `${result}`;
  } else {
    if (history === '') {
      history = `${currentValue} ${operation}`;
    } else {
      history = history.slice(0, history.length - 1) + `${operation}`;
    }
  }

  history = history.trim();
  operator = operation;
}

function equal() {
  if (!operator) {
    return;
  }

  const countResult = count();

  if (countResult !== 'error') {
    currentValue = `${result}`;

    history = '';
    operator = '';
    isNumEntered = false;
  }
}

function clear() {
  history = '';
  currentValue = '0';
  result = null;
  operator = '';
  isNumEntered = false;
}

function backspace() {
  if (isNumEntered) {
    currentValue = currentValue.slice(0, -1);

    if (!currentValue || currentValue === '-') {
      currentValue = '0';
      isNumEntered = false;
    }
  }
}

function activateMemory() {
  isNumEntered = false;

  memoryIndicator.style.display = memoryValue === 0 ? 'none' : 'block';
}

function showDisplay() {
  const integerNums = parseFloat(currentValue.split('.')[0]).toString();
  const decimalNums = currentValue.split('.')[1];

  if (isNaN(integerNums)) {
    currentValue = '';
  } else {
    currentValue = `${integerNums}`;
  }

  if (decimalNums != null) {
    if (decimalNums.length > maxDecimalNums) {
      const correctDecimalNums = `${Math.ceil(parseFloat(decimalNums))}`;
      const slicedDecimalNums = correctDecimalNums.slice(0, 8);

      currentValue += `.${slicedDecimalNums}`;
    } else {
      currentValue += `.${decimalNums}`
    }
  }

  if (isNegative) {
    currentValue = `${-currentValue}`;
    isNegative = !isNegative;
  }

  calculatorHistory.textContent = history;
  display.textContent = currentValue;
}
