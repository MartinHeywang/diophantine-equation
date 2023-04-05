import { MathfieldElement } from "mathlive";

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

        const a = equation.getPromptValue("a");
        const b = equation.getPromptValue("b");
        const c = equation.getPromptValue("c");

        // debugger;
        const relativeNumbersRegex = /^-?[0-9]+$/g;
        const isIncorrect = (str: string) => incorrect || (str.match(relativeNumbersRegex) || []).length === 0;

        incorrect = isIncorrect(a);
        incorrect = isIncorrect(b);
        incorrect = isIncorrect(c);

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

        console.log({ a, b, c });
    });
}
