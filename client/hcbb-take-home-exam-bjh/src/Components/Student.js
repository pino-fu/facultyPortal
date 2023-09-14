import { useEffect, useState } from "react";
import EditStudent from "./EditStudent";
import "./StudentCard.css";
import { deleteStudent } from "../Modules/StudentManager";

const Student = ({ student, showForm, setShowForm, reloader, setReloader }) => {

    const [grade, setGrade] = useState("");
    const [studentCopy, setStudentCopy] = useState({
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        DOB: student.DOB,
        email: student.email,
        ICE: student.ICE,
    });

    const toggleForm = () => {
        if (showForm === student.id) {
            setShowForm(null);
        } else {
            setShowForm(student.id);
        }
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const currentDate = new Date();
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = currentDate.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const age = calculateAge(student.DOB);

    const confirmDelete = () => {
        deleteStudent(student.id)
            .then((res) => {
                reloader ? setReloader(false) : setReloader(true);
            })
            .catch((error) => {
                console.error('Error deleting student:', error);
                window.alert('An error occurred while deleting the student. Please try again later.');
            });
    };

    // const gradeSetter = (age) => {

    //     for (let i = age; i <= 20; i++; ) {
    //         if (i === 5) {
    //             setGrade("K")
    //         } else {
    //             if (i > 5) {
    //                 setGrade(toString(age - 5))
    //             }
    //         }
    //     }
    // }

    useEffect(() => {
       
      // gradeSetter(age);
       
        if (age === 5) {
            setGrade("K");
        } else if (age === 6) {
            setGrade("1");
        } else if (age === 7) {
            setGrade("2");
        } else if (age === 8) {
            setGrade("3");
        } else if (age === 9) {
            setGrade("4");
        } else if (age === 10) {
            setGrade("5");
        } else if (age === 11) {
            setGrade("6");
        } else if (age === 12) {
            setGrade("7");
        } else if (age === 13) {
            setGrade("8");
        } else if (age === 14) {
            setGrade("9");
        } else if (age === 15) {
            setGrade("10");
        } else if (age === 16) {
            setGrade("11");
        } else {
            setGrade("12");
        }
    }, [age]);

    return (
        <>
            <section className="studentCard" key={student.id} id={student.id}>
                <div className="studentInfo">

                    {
                        grade === "K" ?
                            <span className="studentName">
                                {student.firstName} {student.lastName} - Kindergarten
                            </span>
                            :
                            <span className="studentName">
                                {student.firstName} {student.lastName} - Grade {grade}
                            </span>
                    }
                </div>
                <div className="studentInfo">
                    <span className="studentLabel">Grade:</span>
                    <span className="studentGrade">
                        {grade === "K" ? "Kindergarten" : "Grade " + grade}
                    </span>
                </div>
                <div className="studentInfo">
                    <span className="studentLabel">Age:</span>
                    <span className="studentAge">{age}</span>
                </div>
                <div className="studentInfo">
                    <span className="studentLabel">DOB:</span>
                    <span className="studentDOB">{student.DOB}</span>
                </div>
                <div className="studentInfo">
                    <span className="studentLabel">Email:</span>
                    <span className="studentEmail">{student.email}</span>
                </div>
                <div className="studentInfo">
                    <span className="studentLabel">ICE:</span>
                    <span className="studentIce">{student.ICE}</span>
                </div>
                <div className="buttonPanel">
                    <button
                        className="deleteButton"
                        onClick={() => {
                            if (window.confirm("Permanently delete this student?")) {
                                confirmDelete();
                            }
                        }}
                    >
                        🗑️
                    </button>
                    <button
                        className="editButton"
                        onClick={toggleForm}
                    >
                        {showForm === student.id ? '↩️' : '✎'}
                    </button>
                </div>
                <div className="editPanel">
                    {showForm === student.id ? (
                        <div className="studentCardFormContainer">
                            <EditStudent student={student}
                                reloader={reloader}
                                setReloader={setReloader}
                                showForm={showForm}
                                setShowForm={setShowForm}
                            />
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </section>
        </>
    );
};

export default Student;