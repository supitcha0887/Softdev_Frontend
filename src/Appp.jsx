import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Report from "./Report";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Report />} />
    </Routes>
  );
}

export default App;