import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadCourses, saveCourse } from "../../redux/action/courseAction";
import { loadAuthors } from "../../redux/action/authorAction";
import PropTypes from "prop-types";
import CourseForm from "./CourseForm";
import { newCourse } from "../../../tools/mockData";

const ManagerCoursePage = (props) => {
  const {
    history,
    courses,
    authors,
    loadAuthors,
    loadCourses,
    saveCourse,
  } = props;

  const [errors, setErrors] = useState({});
  const [course, setCourse] = useState({ ...props.course });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (courses.length === 0) {
      loadCourses().catch((error) => {
        alert("Loading courses failed" + error);
      });
    } else {
      setCourse({ ...props.course });
    }

    if (authors.length === 0) {
      loadAuthors().catch((error) => {
        alert("Loading authors failed" + error);
      });
    }
  }, [props.course]);



  function formIsValid() {
    const { title, authorId, category } = course;
    const errors = {};
    console.log("title :::::");
    if (!title) errors.title = "Title is required.";
    if (!authorId) errors.author = "Author is required";
    if (!category) errors.category = "Category is required";

    setErrors(errors);
    // Form is valid if the errors object still has no properties
    return Object.keys(errors).length === 0;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCourse((prevCouse) => ({
      ...prevCouse,
      [name]: name === "authorId" ? parseInt(value, 10) : value,
    }));
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (!formIsValid()) return;
    setSaving(true);
    saveCourse(course)
      .then(() => {})
      .catch((error) => {
        setSaving(false);
        console.log("eeror: ", error.message);
        setErrors({ onSave: error.message });
      });
  };

  return (
    <div>
      <h2>Manage Course</h2>
      <CourseForm
        onChange={handleChange}
        course={course}
        errors={errors}
        authors={authors}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
};

export function getCourseBySlug(courses, slug) {
  return courses.find((course) => course.slug === slug) || null;
}

const mapStateToProps = (state, ownProps) => {
  const slug = ownProps.match.params.slug;
  const course =
    slug && state.courses.length > 0
      ? getCourseBySlug(state.courses, slug)
      : newCourse;
  return {
    course,
    courses: state.courses,
    authors: state.authors,
  };
};

const mapDispatchToProps = {
  loadCourses,
  loadAuthors,
  saveCourse,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagerCoursePage);

ManagerCoursePage.propTypes = {
  loadCourses: PropTypes.func.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  course: PropTypes.object.isRequired,
  saveCourse: PropTypes.func.isRequired,
};
