const base = require("@mendix/pluggable-widgets-tools/configs/eslint.ts.base.json");

module.exports = {
    ...base,
    parserOptions: {
        ecmaVersion: base.parserOptions.ecmaVersion,
        sourceType: base.parserOptions.sourceType,
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname
    }
};
