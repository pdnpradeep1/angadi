import React from "react";
import ReactDOM from "react-dom";
// import './index.css';
// import App from './App';
import "../index.css"; // Ensure the path is correct
import App from "../App"; // Ensure the correct relative path

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
