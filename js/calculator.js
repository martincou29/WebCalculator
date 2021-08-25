/**
 * Simple Calculator Application
 * 
 * Has:
 * - Two Event Listeners
 *  - Keys Listener
 *  - Input Display Listener (For the keyboard events) 
 * 
 * 
 * TODO: Fix floated point EX: 0.1 + 0.2 = 0.3000004
 * @name Martin_Coutinho
 */

//The whole calculator container
const calculator = document.querySelector('.calculadora');
//The box that contains the keys
const keys = calculator.querySelector('.keys');
//The display where you write the mathematical expression
const inputDisplay = document.querySelector('.display input');

// KEYS Event Listener
keys.addEventListener('click', e => {
  if (e.target.matches('button')) {
    const key = e.target;
    const action = key.dataset.action;
    //Remove pressed highlight
    Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'));
    if (
      action === 'add' ||
      action === 'subtract' ||
      action === 'multiply' ||
      action === 'divide'
    ) {
      operacion = true;
      //Hold the button pressed
      key.classList.add('is-depressed');
      
      //Writes in the display
      switch (action) {
        case 'add':
          if (calculator.dataset.previousKeyType !== action)
            inputDisplay.value += "+";
          break;
        case 'subtract':
          if (calculator.dataset.previousKeyType !== action)
            inputDisplay.value += "-";
          break;
        case 'multiply':
          if (calculator.dataset.previousKeyType !== action)
            inputDisplay.value += "*"
          break;
        case 'divide':
          if (calculator.dataset.previousKeyType !== action)
            inputDisplay.value += "/"
          break;
      }

      //Save the last operation type
      calculator.dataset.previousKeyType = action;
    }
    //Float Point
    if (action === 'decimal') {
      calculator.dataset.previousKey = 'decimal';
      calculator.dataset.previousKeyType = 'decimal';
      if (!inputDisplay.textContent.includes('.')) {
        inputDisplay.value += '.';
      }
    }
    //Clear
    if (action === 'clear') {
      calculator.dataset.previousKey = 'clear';
      calculator.dataset.previousKeyType = 'clear';
      inputDisplay.value = 0;

    }
    //Calculate
    if (action === 'calculate') {
      calculator.dataset.previousKey = 'calculate';
      //hay un operador
      const expression = inputDisplay.value;
      //calcular y mostrar en display
      inputDisplay.value = calculate(expression);
      calculator.dataset.previousKeyType = 'calculate';
    }
    //Es numero
    if (!action) {
      calculator.dataset.previousKey = 'number';
      //Verifica para remplazar el 0. Si hay una operacion en curso lo remplaza
      if (inputDisplay.value === '0') {
        inputDisplay.value = e.target.textContent;
        operacion = false;
      } else {
        inputDisplay.value += e.target.textContent;
      }
      calculator.dataset.previousKeyType = 'number';
    }
  }//matches button
});//end

//inputDisplay Listener for Keyboard events
inputDisplay.addEventListener('keydown', e => {
  switch (e.key) {
    case 'Enter':
      const expression = inputDisplay.value;
      inputDisplay.value = calculate(expression)
      break;
    case 'Backspace':
      //Remove the Sintax Error
      if(inputDisplay.value === "Error de Sintaxis"){
        inputDisplay.value = "0";
      }
      break;
    }
  
  //If the key pressed is number remove these string values
  if(isFinite(e.key)){
    if(inputDisplay.value === "0"){
      inputDisplay.value = "";
    }
    if(inputDisplay.value === "Error de Sintaxis"){
      inputDisplay.value = "";
    }
  }
});

/*Calculate a mathematical expression using the function Evil
  -Use a regular expression to clean the string
*/
function calculate(expression) {
  let result = '0';

  result = result.replace(/[^0-9%^*\/()\-+.]/g, '');
  try{
    result = evil(expression);
  }catch(err){
    return "Error de Sintaxis";
  }
  //Check if result is undefined
  if (result == undefined) {
    return '0';
  }
  return result
}

//Calculate mathematical expression without using Eval()
function evil(fn){
  return new Function('return ' + fn)();
}

