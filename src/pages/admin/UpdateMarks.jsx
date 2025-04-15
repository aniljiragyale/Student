import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import Navbar from "./Navbar";
import "./UpdateMarks.css";

const UpdateStudentMarks = () => {
  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [modules, setModules] = useState(["Module 1", "Module 2"]);

  const companyCode = localStorage.getItem("companyCode") || localStorage.getItem("orgCode");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsCollectionRef = collection(
          db,
          `CorporateClients/${companyCode}/studentInfo`
        );
        const querySnapshot = await getDocs(studentsCollectionRef);

        const studentsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setStudents(studentsList);

        const updatedMarks = {};
        studentsList.forEach((student) => {
          const existingMarks = student.marks || {};
          updatedMarks[student.id] = {};

          modules.forEach((module) => {
            updatedMarks[student.id][module] = {
              assignment: existingMarks[module]?.assignment || "",
              quiz: existingMarks[module]?.quiz || "",
            };
          });
        });

        setMarksData(updatedMarks);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    if (companyCode) {
      fetchStudents();
    }
  }, [companyCode, modules]);

  const handleMarksChange = (studentId, module, type, value) => {
    setMarksData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [module]: {
          ...prev[studentId]?.[module],
          [type]: value,
        },
      },
    }));
  };

  const handleUpdateMarks = async (studentId) => {
    const marks = marksData[studentId];
    try {
      const studentRef = doc(
        db,
        `CorporateClients/${companyCode}/studentInfo/${studentId}`
      );
      await updateDoc(studentRef, {
        marks: marks,
      });
      alert("Marks updated successfully!");
    } catch (error) {
      console.error("Error updating marks:", error);
      alert("Failed to update marks.");
    }
  };

  const getNextModuleNumber = () => {
    const numbers = modules.map((m) => parseInt(m.split(" ")[1])).filter(Boolean);
    return Math.max(...numbers, 0) + 1;
  };

  const handleAddModule = () => {
    const next = getNextModuleNumber();
    const newMod = `Module ${next}`;
    if (!modules.includes(newMod)) {
      const updatedModules = [...modules, newMod];
      setModules(updatedModules);

      const updatedMarksData = {};
      Object.entries(marksData).forEach(([studentId, studentMarks]) => {
        updatedMarksData[studentId] = {
          ...studentMarks,
          [newMod]: { assignment: "", quiz: "" },
        };
      });
      setMarksData(updatedMarksData);
    }
  };

  const handleRemoveModule = (modToRemove) => {
    const updatedModules = modules.filter((mod) => mod !== modToRemove);
    setModules(updatedModules);

    const updatedMarks = {};
    Object.entries(marksData).forEach(([studentId, marks]) => {
      const newMarks = { ...marks };
      delete newMarks[modToRemove];
      updatedMarks[studentId] = newMarks;
    });
    setMarksData(updatedMarks);
  };

  return (
    <div className="update-container">
      <Navbar />
      <div className="company-code">Company Code: {companyCode}</div>

      <h2 className="heading">Update Marks</h2>

      <button className="add-module-btn" onClick={handleAddModule}>➕ Add Module</button>

      <div className="modules-list">
        {modules.map((mod) => (
          <span className="module-tag" key={mod}>
            {mod}
            <button className="remove-btn" onClick={() => handleRemoveModule(mod)}>×</button>
          </span>
        ))}
      </div>

      <div className="students-section">
        <h3 className="sub-heading">Registered Students</h3>
        <table className="marks-table">
          <thead>
            <tr>
              <th>Name</th>
              {modules.map((mod) => (
                <th key={mod}>{mod}</th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                {modules.map((module) => (
                  <td key={`${module}-${student.id}`}>
                    <div className="marks-input-group">
                      <input
                        type="number"
                        value={marksData[student.id]?.[module]?.assignment || ""}
                        onChange={(e) =>
                          handleMarksChange(student.id, module, "assignment", e.target.value)
                        }
                        placeholder="Assignment"
                      />
                      <input
                        type="number"
                        value={marksData[student.id]?.[module]?.quiz || ""}
                        onChange={(e) =>
                          handleMarksChange(student.id, module, "quiz", e.target.value)
                        }
                        placeholder="Quiz"
                      />
                    </div>
                  </td>
                ))}
                <td>
                  <button
                    className="update-btn"
                    onClick={() => handleUpdateMarks(student.id)}
                  >
                    Update Marks
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpdateStudentMarks;
