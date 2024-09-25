import astro from "eslint-plugin-astro";
import svelte from "eslint-plugin-svelte";
import unicorn from "eslint-plugin-unicorn";

export default [
  unicorn.configs["flat/recommended"],
  ...svelte.configs["flat/recommended"],
  ...astro.configs["flat/recommended"],
  ...astro.configs["flat/jsx-a11y-strict"],
  {
    rules: {
      "unicorn/prefer-module": "off",
      "unicorn/prevent-abbreviations": "off",
    },
  },
];
