const vaultColors = {
  navy: "#284b5c",
  emerald: "#519892",
  accent: "#aeddd5",
  accentDark: "#3D7A74", 
};

export const Colors = {
  light: {
    background: "#F2F5F7", 
    text: "#1E2A32",
    textMuted: "#64748B",
    card: "#FFFFFF",
    border: "rgba(40, 75, 92, 0.08)", 
    navy: vaultColors.navy,
    emerald: vaultColors.emerald,
    accent: vaultColors.accentDark, 
    white: "#FFFFFF",
    whiteOpacity: (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
    accentOpacity: (opacity: number) => `rgba(61, 122, 116, ${opacity})`,
    blackOpacity: (opacity: number) => `rgba(0, 0, 0, ${opacity})`,
  },
  dark: {
    background: vaultColors.navy,
    text: "#FFFFFF",
    textMuted: "rgba(255, 255, 255, 0.5)",
    card: "#1e3843",
    border: "rgba(255, 255, 255, 0.1)",
    navy: vaultColors.navy,
    emerald: vaultColors.emerald,
    accent: vaultColors.accent, 
    white: "#FFFFFF",
    whiteOpacity: (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
    accentOpacity: (opacity: number) => `rgba(174, 221, 213, ${opacity})`,
    blackOpacity: (opacity: number) => `rgba(0, 0, 0, ${opacity})`,
  },
};
