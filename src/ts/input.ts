import { MathfieldElement } from "mathlive";
import { solve } from "./result";

const submit = document.querySelector<HTMLButtonElement>(".input__solve-button")!;
const incorrectMessage = document.querySelector<HTMLButtonElement>(".input__incorrect")!;
const equation = document.querySelector<MathfieldElement>(
    "#input-equation-math-field"
)!;

export function setupInputSection() {

    let stylesTimeout: number;

    submit.addEventListener("click", () => {

        incorrectMessage.classList.remove("input__incorrect--visible");
        clearTimeout(stylesTimeout);

        let incorrect = false;

        const aStr = equation.getPromptValue("a");
        const bStr = equation.getPromptValue("b");
        const cStr = equation.getPromptValue("c");

        // debugger;
        const relativeNumbersRegex = /^-?[0-9]+$/g;
        const isIncorrect = (str: string) => incorrect || (str.match(relativeNumbersRegex) || []).length === 0;

        incorrect = isIncorrect(aStr);
        incorrect = isIncorrect(bStr);
        incorrect = isIncorrect(cStr);

        if(incorrect) {
            incorrectMessage.classList.add("input__incorrect--visible");
            submit.classList.add("input__solve-button--shake"); 

            // fast timeout to remove the shake class when the shake animation terminates
            setTimeout(() => submit.classList.remove("input__solve-button--shake"), 150);

            // slower timeout to hide the text a bit later (when the user has read it)
            stylesTimeout = setTimeout(() => {
                incorrectMessage.classList.remove("input__incorrect--visible");
            }, 3000);

            return;
        }

        const a = parseInt(aStr);
        const b = parseInt(bStr);
        const c = parseInt(cStr);

        console.log("Solving equation:");
        console.log(`(a; b; c) = (${a}; ${b}; ${c})`);
        console.log(`=> ${a}x + ${b}y + ${c} = 0`);

        solve(a, b, c);
    });
}
