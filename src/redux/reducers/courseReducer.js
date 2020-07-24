import * as types from "../action/actionType";
import initState from "./initialState";

const courseReducer = (state = initState.authors, action) => {
  switch (action.type) {
    case types.CREATE_COURSE_SUCCESS: {
      return [...state, { ...action.course }];
    }
    case types.LOAD_COURSES_SUCCESS: {
      return action.courses;
    }
    case types.UPDATE_COURSE_SUCCESS: {
      const a = state.map((course) => {
        return course.id === action.course.id ? action.course : course;
      });
      return a;
    }
    case types.DELETE_COURSE_OPTIMISTIC: {
      console.log(state);
      return state.filter((course) => {
        return course.id !== action.course.id;
      });
    }
    default:
      return state;
  }
};

export default courseReducer;
