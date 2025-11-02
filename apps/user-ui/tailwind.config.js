// const { createGlobPatternsForDependencies } = require('@nx/next/tailwind');

// The above utility import will not work if you are using Next.js' --turbo.
// Instead you will have to manually add the dependent paths to be included.
// For example
// ../libs/buttons/**/*.{ts,tsx,js,jsx,html}',                 <--- Adding a shared lib
// !../libs/buttons/**/*.{stories,spec}.{ts,tsx,js,jsx,html}', <--- Skip adding spec/stories files from shared lib

// If you are **not** using `--turbo` you can uncomment both lines 1 & 19.
// A discussion of the issue can be found: https://github.com/nrwl/nx/issues/26510

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
//     '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
// //     ...createGlobPatternsForDependencies(__dirname)
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };

import plugin from "tailwindcss/plugin";

const config = {
  content: [
    "./{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}",
    "!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      zIndex: {
        base: "0",
        content: "10",
        "sticky-elements": "15",
        dropdowns: "20",
        "sticky-header": "25",
        modals: "30",
        "side-panel": "35",
        tooltips: "40",
        notifications: "50",
      },
      boxShadow: {
        custom: "0px 4px 12px 0px rgba(119, 61, 76, 0.2)",
        BagBoxShadow: "0px 7px 28.9px -5px #403F3F1A",
        BagBoxShadowV2: "0px -2px 70px 0px #773D4C1A",
        dropdownSheetBoxShadow: "0px 2px 34px 0px rgba(0, 0, 0, 0.1)",
        dropdownSheetBoxShadowV2: "0px -2px 70px 0px rgba(119, 61, 76, 0.1)",
        SideSheetBoxShadow: "0px 7px 28.9px -5px rgba(64, 63, 63, 0.1)",
        SideSheetBoxShadowV2: "0px -2px 70px 0px rgba(119, 61, 76, 0.1)",
        AllFilterSheetBoxShadow: "0px -4px 12px 0px rgba(119, 61, 76, 0.12)",
        MobileFilterSectionBoxShadow:
          "0px -4px 12px 0px rgba(119, 61, 76, 0.12)",
        subCategoriesSidebarboxShadow:
          "0px 7px 28.9px -5px rgba(64, 63, 63, 0.1)",
        subCategoriesSidebarBottomShadow: "0px -2px 70px 0px #773D4C1A",
        reviewWriteBottomShadow: "0px -2px 70px 0px rgba(119, 61, 76, 0.1)",
        productSearchShadow: "0px 4px 4px 0px rgba(119, 61, 76, 0.12)",
        addAddressBottomShadow: "0px -2px 34px 0px rgba(0, 0, 0, 0.11)",
        MenuDropDownShadows: "0px 4px 20px 0px rgba(119, 61, 76, 0.3)",
        orderAndReturnBotomShadow: "0px -4px 12px 0px rgba(119, 61, 76, 0.12)",
        blogCardHoverShadow: "0px 0px 20px 0px rgba(119, 61, 76, 0.12)",
      },

      colors: {
        primary: {
          10: "#fefdfc",
          20: "#fcfaf6",
          30: "#faf7f1",
          40: "#f7f3eb",
          50: "#f5f0e5",
          60: "#f4eee2",
          70: "#c3beb5",
          80: "#928f88",
          90: "#625f5a",
          100: "#31302d",
        },
        secondary: {
          10: "#f1eced",
          20: "#d6c5c9",
          30: "#bb9ea6",
          40: "#a07782",
          50: "#85505e",
          60: "#773d4c",
          70: "#5f313d",
          80: "#47252e",
          90: "#30181E",
          100: "#180c0f",
        },
        tertiary: {
          10: "#fbf3f2",
          20: "#f3dad9",
          30: "#ebc1bf",
          40: "#e3a8a5",
          50: "#db8f8c",
          60: "#d7837f",
          70: "#ac6966",
          80: "#814f4c",
          90: "#563433",
          100: "#2b1a19",
        },
        neutral: {
          10: "#eaeaea",
          20: "#c1c1c0",
          30: "#989896",
          40: "#6f6e6c",
          50: "#464542",
          60: "#2c2b29",
          70: "#22221f",
          80: "#191817",
          90: "#0f0e0d",
          100: "#050504",
        },
        success: {
          10: "#d9edd7",
          20: "#cdeaca",
          30: "#8eca88",
          40: "#43a739",
          50: "#286422",
        },
        warning: {
          10: "#fef9ed",
          20: "#f9ebcb",
          30: "#f8d480",
          40: "#e5ac25",
          50: "#ac8733",
        },
        error: {
          10: "#fcebec",
          20: "#fdd2d5",
          30: "#e7747c",
          40: "#dc3944",
          50: "#842229",
        },
        background: {
          10: "#fbf9f6",
          20: "#f4eee2",
          30: "#773d4c",
          40: "#f7f3eb",
        },
        surface: {
          10: "#ffffff",
          20: "#e8d7cc",
          30: "#d8bdc4",
          40: "#e9dbdd",
        },
      },
      fontFamily: {
        helvetica: ["Helvetica Neue", "sans-serif"],
        moontime: ["MoonTime", "cursive"],
        ptserif: ["PT Serif", "serif"],
        Inter: ["Inter"],
        poppins: ["var(--font-poppins)"],
        roboto: ["var(--font-roboto)"],
      },
    },
  },

  plugins: [
    plugin(function ({ addUtilities }) {
      // Define font family constants for easy reuse
      const helvetica = "Helvetica Neue, sans-serif";
      const ptserif = "PT Serif, serif";
      const moontime = "MoonTime, cursive";

      const customTextStyles = {
        ".small-text": {
          fontSize: "12px",
          lineHeight: "18px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".small-text-2": {
          fontWeight: "400",
          fontSize: "10px",
          lineHeight: "15px",
          letterSpacing: "1.2px",
        },
        // Paragraph Styles (Sorted by font size)
        ".paragraph-01-regular": {
          fontSize: "24px",
          lineHeight: "36px",
          fontWeight: "400",
          fontFamily: helvetica,
        },
        ".paragraph-02-regular": {
          fontSize: "20px",
          lineHeight: "30px",
          fontWeight: "400",
          fontFamily: helvetica,
        },
        ".paragraph-02-medium": {
          fontSize: "20px",
          lineHeight: "26px",
          fontWeight: "500",
          fontFamily: helvetica,
        },
        ".paragraph-02-regular-mobile": {
          fontSize: "14px",
          lineHeight: "18.2px",
          fontWeight: "500",
          fontFamily: helvetica,
          letterSpacing: ".56px",
        },
        ".paragraph-02-medium-mobile": {
          fontSize: "14px",
          lineHeight: "18.2px",
          fontWeight: "500",
          fontFamily: helvetica,
          letterSpacing: ".56px",
        },
        ".paragraph-03-medium-mobile": {
          fontSize: "12px",
          lineHeight: "15.6px",
          fontWeight: "500",
          fontFamily: helvetica,
          letterSpacing: "0.48px",
        },
        ".paragraph-03-medium": {
          fontSize: "18px",
          lineHeight: "27px",
          fontWeight: "500",
          fontFamily: helvetica,
        },
        ".paragraph-03-regular": {
          fontSize: "18px",
          lineHeight: "27px",
          fontWeight: "400",
          fontFamily: helvetica,
        },
        ".paragraph-03-regular-mobile": {
          fontSize: "12px",
          lineHeight: "15.6px",
          fontWeight: "400",
          fontFamily: helvetica,
        },
        ".paragraph-04-medium": {
          fontSize: "18px",
          lineHeight: "24px",
          fontWeight: "500",
          fontFamily: helvetica,
        },
        ".paragraph-04-medium-mobile": {
          fontSize: "10px",
          lineHeight: "13px",
          fontWeight: "500",
          fontFamily: helvetica,
        },
        ".paragraph-05-medium": {
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: "500",
          fontFamily: helvetica,
          letterSpacing: "0.83px",
        },
        ".paragraph-05-regular": {
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: "400",
          fontFamily: helvetica,
        },
        ".paragraph-05-regular-mobile": {
          fontSize: "8px",
          lineHeight: "10.4px",
          fontWeight: "400",
          fontFamily: helvetica,
        },
        ".paragraph-06-regular-mobile": {
          fontSize: "12px",
          lineHeight: "15.6px",
          fontWeight: "400",
          fontFamily: helvetica,
        },
        ".paragraph-05-medium-mobile": {
          fontSize: "8px",
          // lineHeight: "10.4px",
          fontWeight: "500",
          fontFamily: helvetica,
          letterSpacing: "4%",
        },
        ".paragraph-06-regular": {
          fontSize: "14px",
          lineHeight: "21px",
          fontWeight: "400",
          fontFamily: helvetica,
        },
        ".paragraph-06-medium": {
          fontSize: "14px",
          lineHeight: "21px",
          fontWeight: "500",
          fontFamily: helvetica,
        },
        ".paragraph-06-medium-mobile": {
          fontSize: "16px",
          lineHeight: "20.8px",
          fontWeight: "500",
          fontFamily: helvetica,
        },
        ".paragraph-07-regular-mobile": {
          fontSize: "12px",
          lineHeight: "15.6px",
          fontWeight: "400",
          fontFamily: helvetica,
        },
        ".paragraph-07-regular": {
          fontSize: "12px",
          lineHeight: "18px",
          fontWeight: "400",
          letterSpacing: "0.8px",
          fontFamily: helvetica,
        },
        ".paragraph-07-medium": {
          fontSize: "12px",
          lineHeight: "18px",
          fontWeight: "500",
          fontFamily: helvetica,
          letterSpacing: "1.2px",
        },
        ".paragraph-07-medium-mobile": {
          fontSize: "12px",
          lineHeight: "15.6px",
          fontWeight: "500",
          fontFamily: helvetica,
          letterSpacing: "1.2px",
        },

        ".paragraph-08-regular": {
          fontSize: "14px",
          lineHeight: "21px",
          fontWeight: "400",
          fontFamily: helvetica,
        },

        ".paragraph-08-regular-mobile": {
          fontSize: "14px",
          lineHeight: "21px",
          fontWeight: "400",
          fontFamily: helvetica,
        },
        ".paragraph-08-medium": {
          fontSize: "14px",
          lineHeight: "21px",
          fontWeight: "500",
          fontFamily: helvetica,
        },
        ".paragraph-08-medium-mobile": {
          fontSize: "14px",
          lineHeight: "21px",
          fontWeight: "500",
          fontFamily: helvetica,
        },
        ".paragraph-09-regular-mobile": {
          fontSize: "10px",
          lineHeight: "13px",
          fontWeight: "400",
          fontFamily: helvetica,
        },
        ".paragraph-09-medium-mobile": {
          fontSize: "10px",
          lineHeight: "13px",
          fontWeight: "500",
          fontFamily: helvetica,
        },
        ".paragraph-09-medium": {
          fontSize: "10px",
          lineHeight: "15px",
          fontWeight: "500",
          fontFamily: "helvetica",
          letterSpacing: "1px",
        },
        ".paragraph-10-medium": {
          fontSize: "10px",
          lineHeight: "15px",
          fontWeight: "500",
          fontFamily: "helvetica",
          letterSpacing: "1px",
        },
        ".paragraph-10-medium-mobile": {
          fontSize: "8px",
          lineHeight: "10.4px",
          fontWeight: "400",
          fontFamily: helvetica,
          letterSpacing: "4%",
        },

        // Subheading Styles (Sorted by font size)
        ".sub-heading-01-regular": {
          fontSize: "24px",
          lineHeight: "36px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".sub-heading-01-bold": {
          fontSize: "24px",
          lineHeight: "36px",
          fontWeight: "700",
          fontFamily: ptserif,
        },
        ".sub-heading-01-bold-mobile": {
          fontSize: "14px",
          lineHeight: "21px",
          fontWeight: "700",
          fontFamily: ptserif,
        },
        ".sub-heading-01-regular-mobile": {
          fontSize: "14px",
          lineHeight: "18.2px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".sub-heading-02-regular": {
          fontSize: "18px",
          lineHeight: "27px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".sub-heading-02-bold": {
          fontSize: "18px",
          lineHeight: "27px",
          fontWeight: "700",
          fontFamily: ptserif,
        },
        ".sub-heading-02-regular-mobile": {
          fontSize: "12px",
          lineHeight: "15.6px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".sub-heading-02-bold-mobile": {
          fontSize: "12px",
          lineHeight: "15.6px",
          fontWeight: "700",
          fontFamily: ptserif,
        },
        ".sub-heading-03-regular": {
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".sub-heading-03-regular-mobile": {
          fontSize: "8px",
          lineHeight: "10px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".sub-heading-03-bold": {
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: "700",
          fontFamily: ptserif,
        },
        ".sub-heading-04-regular": {
          fontSize: "14px",
          lineHeight: "21px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".sub-heading-04-regular-mobile": {
          fontSize: "14px",
          lineHeight: "21px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".sub-heading-04-bold": {
          fontSize: "14px",
          lineHeight: "21px",
          fontWeight: "700",
          fontFamily: ptserif,
        },
        ".sub-heading-06-regular": {
          fontSize: "32px",
          lineHeight: "48px",
          fontWeight: "400",
          fontFamily: helvetica,
        },
        ".sub-heading-08-regular": {
          fontSize: "14px",
          // lineHeight: "21px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".sub-heading-09-regular": {
          fontSize: "20px",
          lineHeight: "30px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".sub-heading-10-regular": {
          fontSize: "10px",
          lineHeight: "15px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        // Heading Styles (Sorted by font size and style)
        ".heading-01-regular": {
          fontSize: "60px",
          lineHeight: "78px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".heading-01-regular-mobile": {
          fontSize: "24px",
          lineHeight: "31.2px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".heading-01-bold-mobile": {
          fontSize: "24px",
          lineHeight: "31.2px",
          fontWeight: "700",
          fontFamily: ptserif,
        },
        ".heading-01-italic": {
          fontSize: "60px",
          lineHeight: "78px",
          fontWeight: "400",
          fontFamily: ptserif,
          fontStyle: "italic",
        },
        ".heading-02-regular": {
          fontSize: "50px",
          lineHeight: "60px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".heading-02-bold": {
          fontSize: "50px",
          lineHeight: "60px",
          fontWeight: "700",
          fontFamily: ptserif,
        },
        ".heading-02-regular-mobile": {
          fontSize: "20px",
          lineHeight: "30px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".heading-02-italic": {
          fontSize: "50px",
          lineHeight: "60px",
          fontWeight: "400",
          fontFamily: ptserif,
          fontStyle: "italic",
        },
        ".heading-03-regular": {
          fontSize: "40px",
          lineHeight: "60px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".heading-03-regular-mobile": {
          fontSize: "18px",
          lineHeight: "27px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".heading-02-bold-mobile": {
          fontSize: "20px",
          lineHeight: "26px",
          fontWeight: "700",
          fontFamily: ptserif,
        },
        ".heading-03-italic": {
          fontSize: "40px",
          lineHeight: "52px",
          fontWeight: "400",
          fontFamily: ptserif,
          fontStyle: "italic",
        },
        ".heading-03-bold": {
          fontSize: "40px",
          lineHeight: "60px",
          fontWeight: "700",
          fontFamily: ptserif,
        },
        ".heading-03-bold-mobile": {
          fontSize: "18px",
          lineHeight: "23.4px",
          fontWeight: "700",
          fontFamily: ptserif,
        },
        ".heading-04-bold-mobile": {
          fontSize: "16px",
          lineHeight: "20.8px",
          fontWeight: "700",
          fontFamily: ptserif,
          fontStyle: "normal",
        },

        ".heading-04-regular-mobile": {
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".heading-05-regular": {
          fontSize: "30px",
          lineHeight: "39px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".heading-05-italic": {
          fontSize: "30px",
          lineHeight: "39px",
          fontWeight: "400",
          fontFamily: ptserif,
          fontStyle: "italic",
        },
        ".heading-05-bold": {
          fontSize: "30px",
          lineHeight: "45px",
          fontWeight: "700",
          fontFamily: ptserif,
          fontStyle: "normal",
        },
        ".heading-05-bold-mobile": {
          fontSize: "16px",
          lineHeight: "20.8px",
          fontWeight: "700",
          fontFamily: ptserif,
        },

        // Title and Tag Styles
        ".title-01-regular": {
          fontSize: "80px",
          lineHeight: "96px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".title-01-italic": {
          fontSize: "80px",
          lineHeight: "96px",
          fontWeight: "400",
          fontStyle: "italic",
          fontFamily: ptserif,
        },
        ".title-02-regular-mobile": {
          fontSize: "30px",
          lineHeight: "39px",
          fontWeight: "400",
          fontFamily: ptserif,
        },
        ".tag-regular": {
          fontSize: "60px",
          lineHeight: "72px",
          fontWeight: "400",
          fontFamily: moontime,
        },
        ".tag-regular-mobile": {
          fontSize: "20px",
          lineHeight: "26px",
          fontWeight: "400",
          fontFamily: moontime,
        },

        // Additional Text Styles
        ".text-md-regular": {
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: "400",
          fontFamily: "Inter",
        },
        ".text-md-regular-mobile": {
          fontSize: "10px",
          lineHeight: "15px",
          fontWeight: "400",
          fontFamily: "Inter",
        },
      };
      const customScrollbars = {
        ".scrollbar-hide": {
          /* Firefox */
          scrollbarWidth: "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
        },
      };

      addUtilities({
        ...customTextStyles,
        ...customScrollbars,
      });
    }),
  ],
};

export default config;
