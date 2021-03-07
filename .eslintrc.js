module.exports = {
    env: {
        browser: true,
        node: true,
    },
    parser: "babel-eslint", // Specifies the ESLint parser
    extends: [
    //   'plugin:@typescript-eslint/recommended', // Uses the recommended rules from @typescript-eslint/eslint-plugin
        "plugin:react/recommended",
        "eslint:recommended",
    ],
    parserOptions: {
        ecmaVersion: "2021", // Allows for the parsing of modern ECMAScript features
        sourceType: "module", // Allows for the use of imports
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
        "react/display-name": 0,
        indent: ["error", 4],
    },
    settings: {
        react: {
            version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            parser: "@typescript-eslint/parser",
            plugins: ["@typescript-eslint"],
            extends: [
                "plugin:@typescript-eslint/recommended", // Uses the recommended rules from @typescript-eslint/eslint-plugin
            ],
            // If need to support jsx
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },

            /**
       * Typescript Rules
       * https://github.com/bradzacher/eslint-plugin-typescript
       * Enable your own typescript rules.
       */
            rules: {
                "@typescript-eslint/ban-types": 0,
                "@typescript-eslint/no-empty-interface": 0,
            },
        },
    ],
};
