import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as courseAction from "../../redux/action/courseAction";
import * as authorAction from "../../redux/action/authorAction";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import CoursesList from "./CourseList";
import Spinner from "../common/Spinner";
import CourseList from "./CourseList";
import { toast } from "react-toastify";

const CoursesPage = (props) => {
  const { courses, loading } = props;

  useEffect(() => {
    console.log("load");
    props.actions.loadCourses().catch((error) => {
      alert("Load courses failed " + error);
    });

    props.actions.loadAuthors().catch((error) => {
      alert("Load authors failed " + error);
    });
  }, []);

  const handleDelete = async (course) => {
    toast.success("Course deleted");
    try {
     await props.actions.deleteCourse(course)
    } catch(error) {
      toast.error("delete failed " + error.message, { autoClose: false });
    }
  }

  const renderSpinner = () => {
    if (loading) {
      return <Spinner />;
    }
    return <CourseList onDeleteClick={handleDelete} courses={courses} />;
  };

  return (
    <div>
      <h2>Courses</h2>
      {renderSpinner()}
    </div>
  );
};

CoursesPage.propTypes = {
  courses: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
    courses:
      state.authors.length === 0
        ? []
        : state.courses.map((course) => {
            return {
              ...course,
              authorName: state.authors.find((a) => a.id === course.authorId)
                .name,
            };
          }),
    authors: state.authors,
    loading: state.apiCallsInProgress > 0,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadCourses: bindActionCreators(courseAction.loadCourses, dispatch),
      loadAuthors: bindActionCreators(authorAction.loadAuthors, dispatch),
      deleteCourse: bindActionCreators(courseAction.deleteCourse, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
