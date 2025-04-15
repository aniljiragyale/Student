// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import RegisterStudent from "./pages/Admin/RegisterStudent";
// import UpdateAttendance from "./pages/Admin/UpdateAttendance";
// import UpdateMarks from "./pages/Admin/UpdateMarks";
// import SharePage from "./pages/Admin/SharePage";
// import AddModule from "./pages/Admin/AddModule";



// function App() {
//   return (
//     <Router>
//       <Routes>
        
//         <Route path="/RegisterStudent" element={<RegisterStudent />} />
//         <Route path="/add-module" element={<AddModule />} />
//         <Route path="/update-attendance" element={<UpdateAttendance />} />
//         <Route path="/update-marks" element={<UpdateMarks />} />
//         <Route path="/share" element={<SharePage />} />     
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import StudentDashboard from "../src/pages/L&D/StudentDashboard"

function App() {
  return (
    <div className="App">
     
      <StudentDashboard companyCode="GSK2025A" studentId="Abhi_001" />
    </div>
  );
}

export default App;

