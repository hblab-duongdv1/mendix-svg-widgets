const base = require("@mendix/pluggable-widgets-tools/configs/eslint.ts.base.json");

const { overrides: baseOverrides = [], ...baseRest } = base;

module.exports = {
    ...baseRest,
    parserOptions: {
        ecmaVersion: base.parserOptions.ecmaVersion,
        sourceType: base.parserOptions.sourceType,
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname
    },
    overrides: [
        ...baseOverrides,
        {
            files: ["scripts/**/*.mjs"],
            env: { node: true },
            parserOptions: {
                project: null
            },
            rules: {
                "@typescript-eslint/explicit-function-return-type": "off"
            }
        }
    ]
};
