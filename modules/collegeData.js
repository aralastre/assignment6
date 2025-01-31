const Sequelize = require('sequelize');
var sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', 'EpyVNaFxY84m', {
    dialectModule: require('pg'),
    host: 'ep-fragrant-star-a5pw0u4n.us-east-2.aws.neon.tech',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }, 
    query: { raw: true }
});

// Define Student model
const Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
    // Note: The 'course' column will be added automatically when defining the relationship
});

// Define Course model
const Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

// Define the relationship
Course.hasMany(Student, { foreignKey: 'courseId' });
Student.belongsTo(Course, { foreignKey: 'courseId' });

module.exports.initialize = function () {
    return sequelize.sync().then(function () {
        // The promise is resolved and the DB tables are created/updated
        console.log("Database synced");
    }).catch(function (error) {
        // There was an error syncing the database
        throw error;
    });
};

module.exports.getAllStudents = function () {
    return Student.findAll().then(function (students) {
        // The promise is resolved and we have the students data
        return students;
    }).catch(function (error) {
        // There was an error fetching all students
        throw error;
    });
};

module.exports.getStudentsByCourse = function (course) {
    return Student.findAll({
        where: { courseId: course }
    }).then(function (students) {
        // The promise is resolved and we have the students data for the course
        return students;
    }).catch(function (error) {
        // There was an error fetching students by course
        throw error;
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: { studentNum: num }
        }).then((data) => {
            if (data.length > 0) {
                resolve(data[0]); // resolve with the first student object
            } else {
                reject("No results returned"); // reject if no student is found
            }
        }).catch((error) => {
            reject("No results returned"); // reject if there's an error during the query
        });
    });
};


module.exports.getCourses = function () {
    return Course.findAll().then(function (courses) {
        if(courses.length > 0) {
            return courses;
        } else {
            return Promise.reject("no results returned");
        }
    }).catch(function (error) {
        return Promise.reject("no results returned");
    });
};

module.exports.getCourseById = function (id) {
    return Course.findByPk(id).then(function (course) {
        if(course) {
            return course;
        } else {
            return Promise.reject("no results returned");
        }
    }).catch(function (error) {
        return Promise.reject("no results returned");
    });
};

module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        // Ensure the TA property is a boolean
        studentData.TA = (studentData.TA) ? true : false;
        
        // Replace blank values with null
        for (let prop in studentData) {
            if (studentData[prop] === "") {
                studentData[prop] = null;
            }
        }
        
        // Create the student
        Student.create(studentData)
            .then(() => resolve("Operation was a success"))
            .catch((error) => reject("Unable to create student"));
    });
};

module.exports.updateStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        // Ensure the TA property is a boolean
        studentData.TA = (studentData.TA) ? true : false;
        
        // Replace blank values with null
        for (let prop in studentData) {
            if (studentData[prop] === "") {
                studentData[prop] = null;
            }
        }
        
        // Update the student
        Student.update(studentData, { where: { studentNum: studentData.studentNum } })
            .then(() => resolve("Operation was a success"))
            .catch((error) => reject("Unable to update student"));
    });
};

module.exports.addCourse = function (courseData) {
    // Replace any empty strings with null
    Object.keys(courseData).forEach(key => courseData[key] = courseData[key] === "" ? null : courseData[key]);
    
    // Create a new course with the provided data
    return Course.create(courseData).then((course) => {
        // Resolves with the new course data
        return course;
    }).catch((error) => {
        // Rejects the promise with an error message
        return Promise.reject("unable to create course");
    });
};

module.exports.updateCourse = function (courseData) {
    // Replace any empty strings with null
    Object.keys(courseData).forEach(key => courseData[key] = courseData[key] === "" ? null : courseData[key]);

    // Update the course with the provided data
    return Course.update(courseData, {
        where: { courseId: courseData.courseId }
    }).then(() => {
        // Resolves without data
        return;
    }).catch((error) => {
        // Rejects the promise with an error message
        return Promise.reject("unable to update course");
    });
};

module.exports.deleteCourseById = function (id) {
    // Delete the course by its id
    return Course.destroy({
        where: { courseId: id }
    }).then(() => {
        // Resolves if the delete operation was successful
        return;
    }).catch((error) => {
        // Rejects the promise if the delete operation failed
        return Promise.reject("unable to delete course");
    });
};

module.exports.deleteStudentByNum = function(studentNum) {
    return Student.destroy({
        where: { studentNum: studentNum }
    }).then(() => {
        return;
    }).catch((error) => {
        return Promise.reject("unable to delete student");
    });
};