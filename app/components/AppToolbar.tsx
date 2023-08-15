"use client";
import { AppBar, Toolbar, Typography } from "@mui/material";
import DarkModeSwitch from "./DarkModeSwitch";

interface AppToolbarProps {
  darkMode: boolean;
  handleDarkModeToggle: () => void;
}

const AppToolbar: React.FC<AppToolbarProps> = ({
  darkMode,
  handleDarkModeToggle,
}) => {
  return (
    <AppBar position="static" component="nav">
      <Toolbar>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Invoice Manager
        </Typography>
        <DarkModeSwitch
          id="dark-mode-toggle"
          data-testid="dark-mode-toggle"
          aria-checked={darkMode}
          checked={darkMode}
          size="small"
          onChange={handleDarkModeToggle}
        />
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;
