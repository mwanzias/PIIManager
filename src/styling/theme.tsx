import { createTheme, IStackStyles, ITextStyles } from "@fluentui/react";

// Define the color palette
export const colors = {
  primary: "#0078d4",
  primaryDark: "#005a9e",
  primaryLight: "#e6f7ff",
  secondary: "#107c10",
  error: "#d13438",
  warning: "#ffaa44",
  black: "#000000",
  white: "#ffffff",
  gray10: "#faf9f8",
  gray20: "#f3f2f1",
  gray30: "#edebe9",
  gray40: "#d2d0ce",
  gray50: "#c8c6c4",
  gray60: "#a19f9d",
  gray70: "#8a8886",
  gray80: "#605e5c",
  gray90: "#3b3a39",
  gray100: "#323130",
  gray110: "#201f1e",
  gray120: "#161514",
  gray130: "#0b0a09",
};

// Create a theme that can be used across the application
export const appTheme = createTheme({
  palette: {
    themePrimary: colors.primary,
    themeLighterAlt: "#f3f9fd",
    themeLighter: "#d0e7f8",
    themeLight: "#a9d3f2",
    themeTertiary: "#5ca9e5",
    themeSecondary: "#1a86d9",
    themeDarkAlt: "#006cbe",
    themeDark: "#005ba1",
    themeDarker: "#004377",
    neutralLighterAlt: "#faf9f8",
    neutralLighter: "#f3f2f1",
    neutralLight: "#edebe9",
    neutralQuaternaryAlt: "#e1dfdd",
    neutralQuaternary: "#d0d0d0",
    neutralTertiaryAlt: "#c8c6c4",
    neutralTertiary: "#a19f9d",
    neutralSecondary: "#605e5c",
    neutralPrimaryAlt: "#3b3a39",
    neutralPrimary: "#323130",
    neutralDark: "#201f1e",
    black: "#000000",
    white: "#ffffff",
  },
});

// Common container styles
export const containerStyles: IStackStyles = {
  root: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },
};

// Section styles
export const sectionStyles: IStackStyles = {
  root: {
    padding: "60px 0",
    width: "100%",
  },
};

// Hero section styles
export const heroSectionStyles: IStackStyles = {
  root: {
    backgroundColor: colors.gray20,
    padding: "80px 0",
    textAlign: "center",
    width: "100%",
  },
};

// Headline styles
export const headlineStyles: ITextStyles = {
  root: {
    fontSize: "42px",
    fontWeight: "600",
    marginBottom: "16px",
    color: colors.primary,
  },
};

// Subheadline styles
export const subheadlineStyles: ITextStyles = {
  root: {
    fontSize: "20px",
    fontWeight: "400",
    marginBottom: "32px",
    maxWidth: "800px",
    margin: "0 auto 32px",
  },
};

// Section title styles
export const sectionTitleStyles: ITextStyles = {
  root: {
    fontSize: "32px",
    fontWeight: "600",
    marginBottom: "24px",
    textAlign: "center",
    color: colors.primary,
  },
};

// Card styles
export const cardStyles: IStackStyles = {
  root: {
    backgroundColor: colors.white,
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    flex: 1,
    minWidth: "300px",
  },
};

// Button styles
export const primaryButtonStyles = {
  root: {
    padding: "0 32px",
    height: "44px",
    fontSize: "16px",
  },
};

export const outlineButtonStyles = {
  root: {
    padding: "0 32px",
    height: "44px",
    fontSize: "16px",
    borderColor: colors.primary,
    color: colors.primary,
  },
};

// Text styles
export const bodyTextStyles = {
  fontSize: "16px",
  lineHeight: "1.6",
  maxWidth: "800px",
  margin: "0 auto",
};

export const emphasisTextStyles = {
  fontSize: "18px",
  fontWeight: "600",
  lineHeight: "1.6",
  maxWidth: "800px",
  margin: "16px auto 0",
};

// Banner styles
export const bannerStyles: IStackStyles = {
  root: {
    backgroundColor: colors.primaryLight,
    padding: "32px",
    borderRadius: "8px",
    marginTop: "40px",
    marginBottom: "40px",
    border: `1px solid ${colors.primary}`,
  },
};

// Footer styles
export const footerStyles: IStackStyles = {
  root: {
    backgroundColor: colors.gray20,
    padding: "60px 0",
    textAlign: "center",
    width: "100%",
  },
};

// List styles
export const listItemStyles = {
  marginBottom: "8px",
};

// Media query breakpoints
export const breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
};

// Responsive styles
export const getResponsiveStyles = (windowWidth: number) => {
  if (windowWidth <= breakpoints.mobile) {
    return {
      headline: {
        fontSize: "32px",
      },
      subheadline: {
        fontSize: "18px",
      },
      sectionTitle: {
        fontSize: "28px",
      },
    };
  } else if (windowWidth <= breakpoints.tablet) {
    return {
      headline: {
        fontSize: "36px",
      },
      subheadline: {
        fontSize: "18px",
      },
      sectionTitle: {
        fontSize: "30px",
      },
    };
  } else {
    return {
      headline: {
        fontSize: "42px",
      },
      subheadline: {
        fontSize: "20px",
      },
      sectionTitle: {
        fontSize: "32px",
      },
    };
  }
};
