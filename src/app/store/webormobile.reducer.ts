/* eslint-disable indent */
import { I_WebOrMobile } from './../app.model';
import { ActionsTypes } from './webormobile.action';


const INITIAL_STATE: I_WebOrMobile = {
  isMobile: null,
  isTablet: null,
  isWeb: null
};

export const reducer = (state = INITIAL_STATE, action: any) : I_WebOrMobile => {
  switch (action.type) {
    case ActionsTypes.GET_USER_ACTION: {
      return {
        ...state,
        isMobile: action.isMobile,
        isTablet: action.isTablet,
        isWeb: action.isWeb,
      };
    }
    default: return state;
  }
};
