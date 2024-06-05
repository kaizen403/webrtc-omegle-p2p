import "./App.css";
import { Landing } from "../src/components/Landing.tsx";
import { Room } from "../src/components/Room.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
