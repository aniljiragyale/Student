import { useState, useEffect } from "react";
import { db } from "../../firebase";
import Navbar from "./Navbar";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import "./RegisterStudent.css";

const RegisterStudent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [companyCode, setCompanyCode] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [student, setStudent] = useState({
    studentId: "",
    name: "",
    email: "",
    attendance: {},
    marks: {},
  });

  // Set company code from location or localStorage
  useEffect(() => {
    const storedCompanyCode =
      location.state?.companyCode || localStorage.getItem("orgCode") || localStorage.getItem("companyCode");

    if (!storedCompanyCode) {
      alert("Company code missing. Please login again.");
      navigate("/");
    } else {
      setCompanyCode(storedCompanyCode);
      localStorage.setItem("companyCode", storedCompanyCode);
    }
  }, [location, navigate]);

  // Fetch all registered students
  const fetchStudentsList = async () => {
    if (!companyCode) return;
    try {
      const querySnapshot = await getDocs(
        collection(db, `CorporateClients/${companyCode}/studentInfo`)
      );
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudentsList(list);
    } catch (error) {
      console.error("Error fetching students list:", error);
    }
  };

  // Fetch selected student details by ID
  useEffect(() => {
    const fetchStudent = async () => {
      if (!student.studentId.trim() || !companyCode) return;

      try {
        const docRef = doc(
          db,
          `CorporateClients/${companyCode}/studentInfo`,
          student.studentId
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setStudent({
            studentId: data.studentId || "",
            name: data.name || "",
            email: data.email || "",
            attendance: data.attendance || {},
            marks: data.marks || {},
          });
        } else {
          setStudent((prev) => ({
            ...prev,
            name: "",
            email: "",
            attendance: {},
            marks: {},
          }));
        }
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };

    fetchStudent();
  }, [student.studentId, companyCode]);

  useEffect(() => {
    fetchStudentsList();
  }, [companyCode]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!student.studentId.trim() || !student.name.trim() || !student.email.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const docRef = doc(
        db,
        `CorporateClients/${companyCode}/studentInfo`,
        student.studentId
      );

      await setDoc(docRef, {
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        attendance: student.attendance, // Include attendance
        marks: student.marks,           // Include marks
      });

      alert("Student registered/updated successfully!");
      setStudent({ studentId: "", name: "", email: "", attendance: {}, marks: {} });
      fetchStudentsList();
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Failed to save student.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await deleteDoc(
        doc(db, `CorporateClients/${companyCode}/studentInfo`, id)
      );
      alert("Student deleted successfully.");
      fetchStudentsList();
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-page">
        {/* Left Section */}
        <div className="left-section">
          <h3>Registered Students</h3>
          {studentsList.length > 0 ? (
            studentsList.map((s) => (
              <div key={s.studentId} className="student-item">
                <span>{s.name}</span>
                <span className="id">{s.studentId}</span>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(s.studentId)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No students registered.</p>
          )}
        </div>

        {/* Right Section */}
        <div className="right-section">
          <h2>Register or Update Student</h2>
          <form onSubmit={handleSubmit} className="register-form">
            <input
              type="text"
              name="studentId"
              placeholder="Student ID"
              value={student.studentId}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={student.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={student.email}
              onChange={handleChange}
              required
            />
            {/* Additional fields for attendance and marks can be added here */}
            <button type="submit">Register / Update</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterStudent;
