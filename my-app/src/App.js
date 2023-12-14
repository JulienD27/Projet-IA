import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Admin from "./Components/Admin";
import Student from "./Components/Student";
import NavBar from "./Utils/NavBar";

function App() {
  return (
      <Router>
        <div>
            <NavBar/>
          <Routes>
            <Route path="/" />
            <Route path="/Student" element={<Student />} />
            <Route path="/Admin" element={<Admin />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
