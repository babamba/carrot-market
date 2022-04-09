module.exports = {
    content: [
        './pages/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {},
        sans: ['Noto Sans KR', 'Montserrat'],
    },
    darkMode: 'media',
    plugins: [require('@tailwindcss/forms')],
};
