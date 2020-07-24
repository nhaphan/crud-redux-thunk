import * as types from "./actionType";
import * as authorApi from "../../api/authorApi";

export const loadAuthorSuccess = (authors) => {
  return { type: types.LOAD_AUTHORS_SUCCESS, authors };
};

export const loadAuthors = () => {
  return function (dispatch) {
    return authorApi
      .getAuthors()
      .then((authors) => {
        dispatch(loadAuthorSuccess(authors));
      })
      .catch((error) => {
        throw error;
      });
  };
};
