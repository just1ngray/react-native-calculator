/**
 * Evaluates a mathematical expression to 2 digits.
 * @param expression    the expression to evaluate
 * @return              the value of the expression if valid, 'NaN' if imaginary, and
 *                      'Math error' if invalid
 */
export default function calculate(expression: string): string {
    try {
        // replace any instance of -(...) with -1*(...)
        expression = expression.replace(/-\(/g, '-1*(');

        // replace any instance of )( with )*(
        // while (expression.includes(')(')) expression.replace(')(', ')*(');
        expression = expression.replace(/\)\(/g, ')*(');

        // replace any instance of #-- with #+
        expression = expression.replace(/[0-9]--/g, match => match.charAt(0) + '+');

        // replace any instance of #- with #+-
        expression = expression.replace(/[0-9]-/g, match => match.charAt(0) + '+-');

        // split into an array of components (single +ve or -ve numbers, or operations)
        const nomials = expression.split(/([^0-9|.|-])/).filter(t => t.length > 0);

        // recursively go deeper into brackets
        while (nomials.indexOf('(') > -1) {
            const openBracketIndex = nomials.indexOf('(');
            let depth = 1;
            for (let i = openBracketIndex + 1; i < nomials.length; i ++) {
                if (nomials[i] === '(') depth ++;
                else if (nomials[i] === ')') depth --;

                if (depth === 0) {
                    const wrapped = nomials.splice(openBracketIndex, (i + 1) - openBracketIndex);   // get the (...)
                    const inner = wrapped.slice(1, wrapped.length - 1);                             // get the  ...
                    nomials.splice(openBracketIndex, 0, calculate(inner.join('')));                 // insert the new calculated 
                                                                                                    // value in spot of old (...)
                    break;
                }
            }
        }

        // calculate the number
        const opOrder = ['^', '*', '/', '+'];
        for (let opIndex = 0; opIndex < opOrder.length; opIndex ++) {
            const operation = opOrder[opIndex];
            while (nomials.includes(operation)) {
                mutateArray(nomials, nomials.indexOf(operation));
            }
        }

        return nomials.join('');
    } catch (err) {
        return 'Math error';
    }
}

function mutateArray(array: string[], operationIndex: number) {
    const binomial = array.splice(operationIndex - 1, 3);
    const operation = binomial[1] as '+' | '/' | '*' | '^';

    const val = calc(Number(binomial[0]), operation, Number(binomial[2]));
    array.splice(operationIndex - 1, 0, val);
}

function calc(a: number, op: '+' | '/' | '*' | '^', b: number): string {
    function getRounded(number: number): string {
        return String(Math.round(number * 10_000) / 10_000);
    }
    switch (op) {
        case '*': return getRounded(a * b);
        case '+': return getRounded(a + b);
        case '/': return getRounded(a / b);
        case '^': return getRounded(a ** b);
    }
}

// const cases: string[] = [
//     '2*-3+1',
//     '-2/-1',
//     '2*(3--4)',
//     '-(1-4)*2',
//     '(1+1)(8-7)',
//     '(9*(7-6))+1',
//     '-3^(2*5/3)',
// ];
// cases.forEach(c => {
//     console.log(`${c}  =  ${calculate(c)}`)
// });