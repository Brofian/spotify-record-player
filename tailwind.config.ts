import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.tsx"],
    theme: {
        colors: {
            ...colors,
        },
        extend: {},
    },
    plugins: [],
}