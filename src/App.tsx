import "./App.css";
import Login from "./component/Login";
import Register from "./component/Register";
import Invoice from "./component/Invoice"
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Routes>
      {/* <h1>Invoice generator</h1> */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/invoice" element={<Invoice />} />
    </Routes>
  );
};

export default App;
