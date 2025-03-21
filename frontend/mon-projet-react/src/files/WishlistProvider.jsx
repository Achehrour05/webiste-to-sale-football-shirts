// index.js or App.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { WishlistProvider } from "./WishlistContext"; // Import the context

ReactDOM.render(
  <WishlistProvider>
    <App />
  </WishlistProvider>,
  document.getElementById("root")
);