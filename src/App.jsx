import { BrowserRouter, Routes, Route } from "react-router-dom";
import Join from "./pages/Join";
import Trainee from "./pages/Trainee";
import Instructor from "./pages/Instructor";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Join />} />
        <Route path="/trainee" element={<Trainee />} />
        <Route path="/instructor" element={<Instructor />} />
      </Routes>
    </BrowserRouter>
  );
}
