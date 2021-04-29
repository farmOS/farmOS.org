import React from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import ResponsiveDrawer from "./responsive-drawer";
import nav from './nav-stub';

export default function Layout({ children }) {
  return (
    <div style={{ margin: `3rem auto`, maxWidth: 650, padding: `0 1rem` }}>
      <CssBaseline />
      <ResponsiveDrawer nav={nav} header="farmOS 2.x Docs"/>
      {children}
    </div>
  );
};
