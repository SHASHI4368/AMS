import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from "./App";
import { registerLicense } from "@syncfusion/ej2-base";


// Registering Syncfusion license key
registerLicense(
  "ORg4AjUWIQA/Gnt2UFhhQlJBfVtdX2pWfFN0QXNedVx0flZPcDwsT3RfQFljSn1Td0xhXn1cd3FVQw=="
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Route path="/" component={App} />
  </Router>
);
