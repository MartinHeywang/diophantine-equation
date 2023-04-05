import { MathfieldElement, renderMathInDocument } from "mathlive";

import { setupInputSection } from "./input";

MathfieldElement.fontsDirectory = "/fonts";
MathfieldElement.soundsDirectory = "/sounds";

renderMathInDocument();

setupInputSection();
