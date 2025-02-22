import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import AppRoutes from "./Routers";

function App() {
  return (
    // <Routes>
    //   <Route path="/" element={<Home />} />
    //   <Route path="/login" element={<Login />} />
    //   <Route path="/dashboard" element={<Dashboard />} />
    // </Routes>
    <ThemeProvider>
      <div className="App">
        <Navbar />
        <AppRoutes /> {/* ✅ Use modified Routes component */}
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
