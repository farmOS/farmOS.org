import React from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from "@material-ui/styles";
import ResponsiveDrawer from "./responsive-drawer";
import nav from './nav-stub';
import theme from "../theme";

export default function Layout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ResponsiveDrawer nav={nav} header="farmOS 2.x Docs"/>
      {children}
    </ThemeProvider>
  );
};
