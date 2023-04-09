import { renderMathInElement } from "mathlive";

const solutions = document.querySelector<HTMLDivElement>(".result__solution")!;
const solutionTemplate =
    document.querySelector<HTMLTemplateElement>("#solution-template")!;

// there can be
// - no solutions,
// - one solution (one unknown variable)
// - an infinity of solutions (string tuple)
type Solutions = null | [string, string];

export function solve(a: number, b: number, c: number) {
    const cloned = solutionTemplate.content.cloneNode(true) as DocumentFragment;
    const solution = cloned.querySelector<HTMLDivElement>(".solution")!;
    const equation = solution.querySelector<HTMLParagraphElement>(".solution__recap")!;
    equation.textContent = `Les solutions de ${equationLatex(
        a,
        b,
        c
    )} sont [${findSolutions(a, b, c)?.join("; ")}]`;

    renderMathInElement(solution);

    solutions.innerHTML = "";
    solutions.appendChild(solution);

    solution.scrollIntoView({ behavior: "smooth" });
}

function findSolutions(a: number, b: number, c: number): Solutions {
    console.log(`called find solution with (a, b, c) = (${a}, ${b}, ${c})`);
    if (a === 0 && b === 0) {
        return c === 0 ? ["k", "k'"] : null;
    }
    if (a === 0) {
        return ["k", (-c / a).toString()];
    }
    if (b === 0) {
        return [(-c / b).toString(), "k"];
    }

    // at this point we're sure a and b are non-zero

    // greatest common divisor
    const d = gcd(a, b);

    // no solution if the gcd(a, b) does not divide c as well
    if (c % d !== 0) return null;

    // d divides a, b, c so
    // ax + by + c = 0 <=> (a/d)x + (b/d)y + (c/d) = 0
    if (d !== 1) return findSolutions(a / d, b / d, c / d);

    // at this point, we're sure a and b are prime to each other

    // focus on au + bv = 1 first
    // here u, v are integers that satisfy this equation
    let [u, v] = bezout(a, b);

    console.log(`Bézout : ${a}*${u} + ${b}*${v} = 1`);

    // our original equation can be written as ax + by = -c
    // let (x0, y0) be a solution
    // au + bv = 1 <=> (multiply by -c)  a*u*(-c) - b*v*(-c) = -c
    // so our (x0, y0) = (u*-c, v*-c)
    let [x0, y0] = [u * -c, v * -c];

    console.log(`Solutions initiales : (${x0}, ${y0})`);

    // now the following relation is satisfied:
    // a*x0 + b*y0 = ax + by
    // <=> ax - ax0 + by - by0 = 0
    // <=> a(x - x0) + b(y - y0) = 0
    // <=> a(x - x0) = -b(y - y0)

    // a and -b are prime to each other (as a and b are)
    // AND a divides b(y - y0)
    // so according to Gauss' theorem
    // a divides y-y0
    // so y-y0 = ak (with k an integer)
    // so y = ak + y0

    let y = `${a}k + ${y0}`;

    // now we have
    // a(x-x0) = -b(ak + y0 - y0)
    // x-x0 = -bk
    // so x = -bk + x0 (k is the same as before)

    let x = `${-b}k + ${x0}`;

    return [x, y];
}

function gcd(a: number, b: number) {
    // this is Euclid's algorithm

    let currentA = Math.max(Math.abs(a), Math.abs(b));
    let currentB = Math.min(Math.abs(a), Math.abs(b));
    let remainder: number;

    while (true) {
        remainder = currentA % currentB;

        if (remainder === 0) break;

        currentA = currentB;
        currentB = remainder;
    }

    return currentB;
}

// Bézout's identity
// a and b prime to each other
// <=>
// there are u and v relative integers that exists such that au + bv = 1
// this function finds the u and v here
function bezout(a: number, b: number) {
    const quotient = (a: number, b: number) => (a - (a % b)) / b;

    const absA = Math.abs(a),
        absB = Math.abs(b);
    let currentA = Math.max(absA, absB);
    let currentB = Math.min(absA, absB);

    // for memoizing the bézout coefficients
    const coeffs = new Map<number, [number, number]>([
        [currentA, [1, 0]], // a = 1*a + 0*b
        [currentB, [0, 1]], // b = 0*a + 1*b
    ]);

    while (true) {
        const q = quotient(currentA, currentB);

        // r also equals currentA % currentB
        const r = currentA - q * currentB;
        if (r === 0) break;

        const coeffA = coeffs.get(currentA)!;
        const coeffB = coeffs.get(currentB)!;

        const u = coeffA[0] - q * coeffB[0];
        const v = coeffA[1] - q * coeffB[1];
        const coeffR: [number, number] = [u, v];
        coeffs.set(r, coeffR);

        console.log({ a: currentA, b: currentB, q, r, u, v });

        currentA = currentB; // the divisor becomes the dividend
        currentB = r; // the remainder becomes the divisor
    }

    const sign = Math.sign;

    const computed = coeffs.get(currentB)!;
    const result =
        a > b
            ? [computed[0] * sign(a), computed[1] * sign(b)]
            : [computed[1] * sign(a), computed[0] * sign(b)];
    console.log(`Result: [${result.join(", ")}]`);
    return result;
}

// fixme: remove this, only for debugging purposes
// @ts-ignore
window.bezout = bezout;

function equationLatex(a: number, b: number, c: number) {
    let result = "\\(";

    if (a !== 0) {
        result += `${a}x`;
        if (b !== 0 || c !== 0) result += " ";
    }
    if (b !== 0) {
        if (b < 0) result += "-";
        else if (a !== 0 && b > 0) result += "+";
        result += `${Math.abs(b)}y`;

        if (c !== 0) result += " ";
    }
    if (c !== 0) {
        if (c < 0) result += "-";
        else if (c > 0) result += "+";
        result += `${Math.abs(c)}`;
    }

    if (a === 0 && b === 0 && c === 0) {
        result += "0";
    }

    result += " = 0\\)";

    return result;
}
