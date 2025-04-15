import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/RegisterStudent">New Student</Link>
        <Link to="/update-attendance">Update Attendance</Link>
        <Link to="/update-marks">Update Marks</Link>
        <Link to="/add-module">Add Modules</Link>
        <Link to="/share">Share via Email</Link>
      </div>
    </nav>
  );
};

export default Navbar;
