import { useEffect, useState } from "react";
import { editStudent } from "../Modules/StudentManager";
import "./StudentCard.css";

const EditStudent = ({ student, reloader, setReloader, showForm, setShowForm }) => {

    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const [isFirstNameValid, setIsFirstNameValid] = useState(true);
    const [isLastNameValid, setIsLastNameValid] = useState(true);
    const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isDOBValid, setIsDOBValid] = useState(true);
    const [newStudent, setNewStudent] = useState({
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        ICE: student.ICE,
        DOB: student.DOB
    });

    const validateData = (data) => {
        const iceAsString = data.ICE.toString();
        if (
            !data.firstName ||
            !data.lastName ||
            !data.email.includes("@") ||
            !data.DOB
        ) {
            return false;
        }
        if (iceAsString.length !== 10 || isNaN(iceAsString)) {
            return false;
        }
        return true;
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhoneNumber = (number) => {
        return number.length === 10 && number >= 1000000000 && number < 10000000000;
    };

    const validateDOB = (dob) => {
        const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
        return dobRegex.test(dob);
    };

    const updateFormValidity = () => {
        setIsFormValid(
            isFirstNameValid &&
            isLastNameValid &&
            isPhoneNumberValid &&
            isEmailValid &&
            isDOBValid
        );
    };

    const calculateMinMaxDates = () => {
        const currentDate = new Date();
        const minDate = new Date(
            currentDate.getFullYear() - 25,
            currentDate.getMonth(),
            currentDate.getDate()
        );
        const maxDate = new Date(
            currentDate.getFullYear() - 5,
            currentDate.getMonth(),
            currentDate.getDate()
        );

        setMinDate(minDate.toISOString().split("T")[0]);
        setMaxDate(maxDate.toISOString().split("T")[0]);
    };

    const handleAlphabeticInput = (e) => {
        const { id, value } = e.target;

        setNewStudent((prev) => ({
            ...prev,
            [id]: value,
        }));

        const alphabeticRegex = /^[a-zA-Z\s-]*$/;
        if (id === "firstName") {
            setIsFirstNameValid(value.length > 0 && alphabeticRegex.test(value));
        } else if (id === "lastName") {
            setIsLastNameValid(value.length > 0 && alphabeticRegex.test(value));
        }
    };

    const handleNumberInput = (e) => {
        const { id, value } = e.target;

        let filteredValue = value.replace(/\D/g, '');
        if (filteredValue.length > 10) {
            filteredValue = filteredValue.slice(0, 10);
        }

        setNewStudent((prev) => ({
            ...prev,
            [id]: filteredValue === "" ? "" : parseInt(filteredValue, 10),
        }));
        setIsPhoneNumberValid(validatePhoneNumber(filteredValue));
    };

    const restrictInvalidCharacters = (e) => {
        const alphabeticRegex = /^[a-zA-Z\s-]*$/;
        if (!alphabeticRegex.test(e.target.value)) {
            e.target.value = e.target.value.slice(0, -1);
        }
    };

    const handleEmailChange = (e) => {
        const { value } = e.target;
        setIsEmailValid(validateEmail(value));
        handleStudentChange(e);
    };

    const handleDOBChange = (e) => {
        const confirmation = window.confirm("Are you sure you want to edit this student's date of birth?");
        if (confirmation) {
            const { value } = e.target;
            setIsDOBValid(validateDOB(value));
            handleStudentChange(e);
    
            setNewStudent((prev) => ({
                ...prev,
                DOB: value,
            }));
        } else {
            e.target.value = newStudent.DOB;
        }
    };

    const handleStudentChange = (e) => {
        const { id, value } = e.target;
        setNewStudent(prev => ({
            ...prev,
            [id]: value,
        }));
    }
    
    const confirmSave = () => {
        if (!validateData(newStudent)) {
            console.log("validation error");
            return;
        }
    
        if (window.confirm("Are you sure you want to save this newly edited student?")) {
            editStudent(newStudent)
                .then((res) => {
                    showForm ? setShowForm(false) : setShowForm(true);
                    reloader ? setReloader(false) : setReloader(true);
                })
                .catch((error) => {
                    console.error('Error editing student:', error);
                    window.alert('An error occurred while editing the student. Please try again later.');
                });
        }
    };

    useEffect(() => {
        calculateMinMaxDates();
        updateFormValidity();
    }, [isFirstNameValid, isLastNameValid, isPhoneNumberValid, isEmailValid, isDOBValid]);

    return (
        <>
            <div className="editStudentForm">
                <h4 className="editStudentFormTitle">
                    Edit Student
                </h4>
                <fieldset>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input
                            id="firstName"
                            title="Only alphabetic characters"
                            required autoFocus
                            type="text"
                            className="form-control"
                            value={newStudent.firstName}
                            onChange={handleAlphabeticInput}
                            onInput={restrictInvalidCharacters}
                        />
                        {!isFirstNameValid && (
                            <div className="firstNameFailIcon">
                                ❌
                            </div>
                        )}
                    </div>
                </fieldset>
                <fieldset>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            id="lastName"
                            title="Only alphabetic characters"
                            required
                            type="text"
                            className="form-control"
                            value={newStudent.lastName}
                            onChange={handleAlphabeticInput}
                            onInput={restrictInvalidCharacters}
                        />
                        {!isLastNameValid && (
                            <div className="lastNameFailIcon">
                                ❌
                            </div>
                        )}
                    </div>
                </fieldset>
                <fieldset>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            required
                            type="email"
                            className="form-control"
                            value={newStudent.email}
                            onChange={handleEmailChange} />
                        {!isEmailValid && (
                            <div className="emailFailIcon">
                                ❌
                            </div>
                        )}
                    </div>
                </fieldset>
                <fieldset>
                    <div className="form-group">
                        <label htmlFor="ICE">Phone Number:</label>
                        <input
                            id="ICE"
                            required
                            type="tel"
                            className="form-control"
                            value={newStudent.ICE}
                            onChange={handleNumberInput} />
                        {!isPhoneNumberValid && (
                            <div className="phoneFailIcon">
                                ❌
                            </div>
                        )}
                    </div>
                </fieldset>
                <fieldset>
                    <div className="form-group">
                        <label htmlFor="DOB">Date of Birth:</label>
                        <input
                            id="DOB"
                            required
                            type="date"
                            onChange={(e) => handleDOBChange(e)}
                            min={minDate}
                            max={maxDate}
                            value={newStudent.DOB}
                        />
                        {!isDOBValid && (
                            <div className="dobFailIcon">
                                ❌
                            </div>
                        )}
                    </div>
                </fieldset>
                <button
                    className="btn btn-primary"
                    disabled={!isFormValid}
                    onClick={confirmSave}
                >
                    Save Changes
                </button>
            </div>
        </>
    );
}


export default EditStudent;