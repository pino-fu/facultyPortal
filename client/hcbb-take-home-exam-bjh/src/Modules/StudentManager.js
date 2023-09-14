const _apiUrl = 'http://localhost:8088/students'

export const getAllStudents = () => {
    return fetch(`${_apiUrl}`)
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error("An unknown error occurred while trying to fetch students");
            }
        })
        .then((students) => {
            const sortedStudents = students.sort((a, b) => {
                if (a.lastName.toLowerCase() < b.lastName.toLowerCase()) {
                    return -1;
                }
                if (a.lastName.toLowerCase() > b.lastName.toLowerCase()) {
                    return 1;
                }
                return 0;
            });
            return sortedStudents;
        });
};

export const createStudent = (student) => {
    console.log("Submitting student:", student);

    return fetch(`${_apiUrl}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
    })
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error(
                    `An error occurred while trying to create a student (status: ${res.status})`
                );
            }
        })
        // is this needed?
        .catch((error) => {
            console.error("Error during fetch:", error);
            throw error;
        });
};

export const editStudent = (student) => {
    return fetch(`${_apiUrl}/${student.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
    }).then((res) => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error("An unknown error occurred while trying to edit the student");
        }
    });
};

export const deleteStudent = (studentId) => {
    return fetch(`${_apiUrl}/${studentId}`, {
        method: "DELETE",
    }).then((res) => {
        if (res.ok) {
            return res.json();
        } else {
            throw new Error("An unknown error occurred while trying to delete the student");
        }
    });
};