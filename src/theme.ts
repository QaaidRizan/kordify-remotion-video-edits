import { loadFont as inter } from "@remotion/google-fonts/Inter";
import { loadFont as mono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as serif } from "@remotion/google-fonts/Kalam";

export const fonts = {
  sans: inter("normal", { weights: ["800", "900"], subsets: ["latin"] })
    .fontFamily,
  mono: mono("normal", { weights: ["500"], subsets: ["latin"] }).fontFamily,
  serif: serif("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily,
};

export { theme } from "./brand";
