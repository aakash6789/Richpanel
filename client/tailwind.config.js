/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  screens:{
    // 'xl':{'max':'1220px'},
    // 'lg':{'max':'991px'}, xs:480px
    // 'md':{'max':'767px'},
    // 'sm':{'max':'550px'},
    'xsm':{'max':'375px'},
    xs:"480px",
    sm:"768px",
    md:"1060px "
  },
  plugins: [],
}

