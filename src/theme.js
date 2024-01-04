import { createTheme } from "@mui/material";

export const customTheme = createTheme({
    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: "white",
            color: "black",
            fontSize: "0.8em",
          },
        },
      },
    },
  });