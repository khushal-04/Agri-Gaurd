import { useState } from "react";
import Navbar from "./Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Body from "./Body";
import { Pepper } from "./Pepper";
import { Potato } from "./Potato";
import { Tomato } from "./Tomato";
import { All } from "./All";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "@fontsource/roboto/300.css";
const theme = createTheme({
  spacing: 8, // Default spacing function multiplier
  // You can customize your theme here
});
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Body />,
    },
    {
      path: "/Potato",
      element: <Potato />,
    },
    {
      path: "/All",
      element: <All />,
    },
    {
      path: "/Pepper",
      element: <Pepper />,
    },
    {
      path: "/Tomato",
      element: <Tomato />,
    },
  ]);

  return (
    <>
      <Navbar />
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
