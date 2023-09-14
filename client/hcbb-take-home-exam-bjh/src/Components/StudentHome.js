import React, { useEffect, useState } from "react";
import Student from "./Student";
import { getAllStudents } from "../Modules/StudentManager";
import "./StudentHome.css";
import CreateStudent from "./CreateStudent";

const StudentHome = () => {

    const [students, setStudents] = useState([]);
    const [showForm, setShowForm] = useState(null);
    const [reloader, setReloader] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [searchBy, setSearchBy] = useState("Last Name");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchError, setSearchError] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState("");
    const [showUpcomingBirthdays, setShowUpcomingBirthdays] = useState(false);

    const getStudents = () => {
        getAllStudents()
            .then((students) => {
                setStudents(students);
            })
            .catch((error) => {
                console.error('Error fetching students:', error);
                window.alert('An error occurred while fetching students. Please try again later.');
            });
    };

    const toggleTodaysBirthdays = () => {
        setShowUpcomingBirthdays(!showUpcomingBirthdays);
    };

    const hasTodaysBirthday = (dob) => {
        const currentDate = new Date();
        const birthDate = new Date(dob);

        currentDate.setDate(currentDate.getDate() - 1);

        birthDate.setFullYear(currentDate.getFullYear());

        return (
            birthDate.getDate() === currentDate.getDate() &&
            birthDate.getMonth() === currentDate.getMonth()
        );
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);

        let age = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = currentDate.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSelectedGradeChange = (event) => {
        setSelectedGrade(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (searchBy === "Last Name") {
            const keyCode = event.charCode;
            if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 122) && keyCode !== 45) {
                event.preventDefault();
            }
        } else if (searchBy === "Phone") {
            const keyCode = event.charCode;
            if (keyCode < 48 || keyCode > 57) {
                event.preventDefault();
            }
            if (searchTerm.length >= 10) {
                event.preventDefault();
            }
        }
    };

    const handleSearchInputChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        if (searchBy === "Last Name" && (!/^[a-zA-Z-]*$/g.test(value) || value.length < 2)) {
            setSearchError(true);
        } else if (searchBy === "Phone" && (value.length < 10 || value.length > 10 || isNaN(value))) {
            setSearchError(true);
        } else {
            setSearchError(false);
        }
    };

    const handleSearchCriteriaChange = (event) => {
        setSearchBy(event.target.value);
    };

    const filteredStudents = students.filter((student) => {
        const searchMatch = searchBy === "Last Name"
            ? student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
            : searchBy === "Phone"
                ? (student.ICE ? student.ICE.toString().includes(searchTerm) : false)
                : false;

        const age = calculateAge(student.DOB);
        const gradeFilter = selectedGrade === ""
            ? true
            : age === parseInt(selectedGrade);

        const upcomingBirthdayFilter = showUpcomingBirthdays
            ? hasTodaysBirthday(student.DOB)
            : true;

        return searchMatch && gradeFilter && upcomingBirthdayFilter;
    });

    useEffect(() => {
        getStudents();
    }, []);

    useEffect(() => {
        getStudents();
    }, [reloader]);

    return (
        <div className="studentHomeContainer">
            <div className="upperHomeContainer">
                <div className="searchContainer">
                    <div className={searchError ? "searchInputWithError searchInput" : "searchInput"}>
                        <input
                            type="text"
                            id="searchInput"
                            className={searchError ? "searchError" : ""}
                            placeholder={`Search by ${searchBy}`}
                            value={searchTerm}
                            onChange={handleSearchInputChange}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    <div className="criteriaContainer">
                        <div className="criteriaLabel">
                            Search By: 
                        </div>
                        <div className="searchCriteria">
                            <label>
                                <input
                                    type="radio"
                                    value="Last Name"
                                    checked={searchBy === "Last Name"}
                                    onChange={handleSearchCriteriaChange}
                                />
                                Last Name
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    value="Phone"
                                    checked={searchBy === "Phone"}
                                    onChange={handleSearchCriteriaChange}
                                />
                                Phone
                            </label>
                    <div className="gradeFilterContainer">
                        <label htmlFor="gradeFilter">Grade: </label>
                        <select
                            id="gradeFilter"
                            value={selectedGrade}
                            onChange={handleSelectedGradeChange}
                        >
                            <option value="">All</option>
                            <option value="5">K</option>
                            <option value="6">1</option>
                            <option value="7">2</option>
                            <option value="8">3</option>
                            <option value="9">4</option>
                            <option value="10">5</option>
                            <option value="11">6</option>
                            <option value="12">7</option>
                            <option value="13">8</option>
                            <option value="14">9</option>
                            <option value="15">10</option>
                            <option value="16">11</option>
                            <option value="17">12</option>
                        </select>
                    </div>
                        </div>
                    </div>
                    <button
                        className="showTodaysBirthdaysButton"
                        onClick={toggleTodaysBirthdays}
                    >
                        {showUpcomingBirthdays
                            ? "↩"
                            : "Show Today's Birthdays"}
                    </button>
                    <div className="resultsCount">
                        Results: {filteredStudents.length}
                    </div>
                </div>
                <div className="createContainer">
                    <button
                        className="showCreateButton"
                        onClick={(click) => {
                            showCreate ? setShowCreate(false) : setShowCreate(true);
                        }}
                    >
                        {!showCreate ? "Add New Student" : "↩️"}
                    </button>
                    <div className="createForm">
                        {
                            showCreate ? (
                                <CreateStudent
                                    reloader={reloader}
                                    setReloader={setReloader}
                                    showCreate={showCreate}
                                    setShowCreate={setShowCreate}
                                />
                            ) : (
                                ""
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="lowerHomeContainer">
                {
                    filteredStudents.length > 0 ? (
                        <div className="studentList">
                            {filteredStudents.map((student) => (
                                <Student
                                    key={student.id}
                                    student={student}
                                    showForm={showForm}
                                    setShowForm={setShowForm}
                                    reloader={reloader}
                                    setReloader={setReloader}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="noResultsNotification">
                            Your search criteria did not match any students
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default StudentHome;