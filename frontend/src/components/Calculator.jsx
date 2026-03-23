import React, { useState } from 'react';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState([]);

  const appendToDisplay = (value) => {
    if (display === 'Error') {
      setDisplay(value);
      setExpression(value);
      return;
    }
    setDisplay((prev) => (prev === '0' ? value : prev + value));
    setExpression((prev) => prev + value);
  };

  const clearDisplay = () => {
    setDisplay('0');
    setExpression('');
  };

  const calculate = () => {
    try {
      // Basic validation for division by zero
      if (expression.includes('/0')) {
        throw new Error('DivByZero');
      }

      // Using Function constructor as a safer alternative to eval for this simple case
      // In a real production app, a math library like mathjs would be preferred
      const result = new Function(`return ${expression}`)();

      if (!isFinite(result)) {
        throw new Error('Invalid');
      }

      const resultString = result.toString();
      setHistory((prev) => [{ expression, result: resultString }, ...prev].slice(0, 5));
      setDisplay(resultString);
      setExpression(resultString);
    } catch {
      setDisplay('Error');
      setExpression('');
    }
  };

  const calculateFactorial = () => {
    try {
      const num = parseInt(display);
      if (isNaN(num) || num < 0 || num > 170) { // Limit to 170 to avoid Infinity
        throw new Error('Invalid');
      }

      let result = 1;
      // Using a loop as requested
      for (let i = 2; i <= num; i++) {
        result *= i;
      }

      const resultString = result.toString();
      setHistory((prev) => [{ expression: `${num}!`, result: resultString }, ...prev].slice(0, 5));
      setDisplay(resultString);
      setExpression(resultString);
    } catch {
      setDisplay('Error');
      setExpression('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md bg-[#001f3f] border-2 border-[#c9aa71] rounded-lg p-6 shadow-[0_0_20px_rgba(201,170,113,0.3)]">
        <h2 className="text-[#c9aa71] text-2xl font-bold mb-6 text-center tracking-widest uppercase">Hextech Calculator</h2>

        {/* Display */}
        <div className="bg-[#002b5c] border border-[#c9aa71] rounded p-4 mb-6 h-16 flex items-center justify-end overflow-hidden">
          <span className="text-[#00f3ff] text-2xl font-mono">{display}</span>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3">
          {/* Row 1 */}
          <button onClick={clearDisplay} className="col-span-2 bg-[#003d73] hover:bg-[#004a8d] text-[#c9aa71] border border-[#c9aa71] p-3 rounded font-bold transition-all uppercase">Clear</button>
          <button onClick={() => appendToDisplay('/')} className="bg-[#003d73] hover:bg-[#004a8d] text-[#c9aa71] border border-[#c9aa71] p-3 rounded font-bold transition-all">/</button>
          <button onClick={() => appendToDisplay('*')} className="bg-[#003d73] hover:bg-[#004a8d] text-[#c9aa71] border border-[#c9aa71] p-3 rounded font-bold transition-all">*</button>

          {/* Row 2 */}
          {[7, 8, 9].map((num) => (
            <button key={num} onClick={() => appendToDisplay(num.toString())} className="bg-[#002b5c] hover:bg-[#003d73] text-[#00f3ff] border border-[#c9aa71] p-3 rounded font-bold transition-all">{num}</button>
          ))}
          <button onClick={() => appendToDisplay('-')} className="bg-[#003d73] hover:bg-[#004a8d] text-[#c9aa71] border border-[#c9aa71] p-3 rounded font-bold transition-all">-</button>

          {/* Row 3 */}
          {[4, 5, 6].map((num) => (
            <button key={num} onClick={() => appendToDisplay(num.toString())} className="bg-[#002b5c] hover:bg-[#003d73] text-[#00f3ff] border border-[#c9aa71] p-3 rounded font-bold transition-all">{num}</button>
          ))}
          <button onClick={() => appendToDisplay('+')} className="bg-[#003d73] hover:bg-[#004a8d] text-[#c9aa71] border border-[#c9aa71] p-3 rounded font-bold transition-all">+</button>

          {/* Row 4 */}
          {[1, 2, 3].map((num) => (
            <button key={num} onClick={() => appendToDisplay(num.toString())} className="bg-[#002b5c] hover:bg-[#003d73] text-[#00f3ff] border border-[#c9aa71] p-3 rounded font-bold transition-all">{num}</button>
          ))}
          <button onClick={calculate} className="bg-[#c9aa71] hover:bg-[#d4bc8d] text-[#001f3f] p-3 rounded font-bold transition-all row-span-2">=</button>

          {/* Row 5 */}
          <button onClick={() => appendToDisplay('0')} className="bg-[#002b5c] hover:bg-[#003d73] text-[#00f3ff] border border-[#c9aa71] p-3 rounded font-bold transition-all">0</button>
          <button onClick={() => appendToDisplay('.')} className="bg-[#002b5c] hover:bg-[#003d73] text-[#00f3ff] border border-[#c9aa71] p-3 rounded font-bold transition-all">.</button>
          <button onClick={calculateFactorial} className="bg-[#003d73] hover:bg-[#004a8d] text-[#c9aa71] border border-[#c9aa71] p-3 rounded font-bold transition-all">x!</button>
        </div>

        {/* History */}
        <div className="mt-8 border-t border-[#c9aa71]/30 pt-4">
          <h3 className="text-[#c9aa71] text-sm font-bold mb-3 uppercase tracking-wider">History</h3>
          <div className="space-y-2">
            {history.length === 0 ? (
              <p className="text-[#00f3ff]/40 text-xs font-mono italic text-center">No recent records</p>
            ) : (
              history.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-xs font-mono bg-[#002b5c]/50 p-2 rounded border border-[#c9aa71]/10">
                  <span className="text-[#c9aa71]/70">{item.expression}</span>
                  <button onClick={() => { setDisplay(item.result); setExpression(item.result); }} className="text-[#00f3ff] hover:text-white cursor-pointer">= {item.result}</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
