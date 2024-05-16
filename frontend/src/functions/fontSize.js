import { useTheme, useMediaQuery } from "@mui/material";
function FontSize() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isLap = useMediaQuery(theme.breakpoints.down("lg"));
  if (isMobile) {
    return "smaller";
  } else if (isTablet) {
    return "medium";
  } else if (isLap) {
    return "x-large";
  } else {
    return "x-large";
  }
}
export { FontSize };
