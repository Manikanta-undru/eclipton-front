import {
  APP_LOAD,
  REDIRECT,
  LOGOUT,
  ARTICLE_SUBMITTED,
  SETTINGS_SAVED,
  LOGIN,
  REGISTER,
  DELETE_ARTICLE,
  ARTICLE_PAGE_UNLOADED,
  EDITOR_PAGE_UNLOADED,
  HOME_PAGE_UNLOADED,
  PROFILE_PAGE_UNLOADED,
  PROFILE_FAVORITES_PAGE_UNLOADED,
  SETTINGS_PAGE_UNLOADED,
  LOGIN_PAGE_UNLOADED,
  REGISTER_PAGE_UNLOADED,
  SWITCH_LOADER,
  ALERTBOX,
  ALERTCLOSE,
  MODAL,
  MODALCLOSE,
  MODALNEXT,
} from '../constants/actionTypes';

const defaultState = {
  appName: 'Conduit',
  token: null,
  viewChangeCounter: 0,
  loaderState: false,
  loaderText: 'Loading...',
  alertOpen: false,
  alertMessage: '',
  alertType: 'error',
  modalType: 'general',
  modalTitle: 'Confirmation',
  modalContent: '',
  modalYesBtnText: 'Yes',
  modalProps: {},
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case APP_LOAD:
      return {
        ...state,
        token: action.token || null,
        appLoaded: true,
        currentUser: action.payload ? action.payload.user : null,
      };
    case REDIRECT:
      return { ...state, redirectTo: null };
    case LOGOUT:
      return { ...state, redirectTo: '/', token: null, currentUser: null };
    case ARTICLE_SUBMITTED: {
      const redirectUrl = `/article/${action.payload.article.slug}`;
      return { ...state, redirectTo: redirectUrl };
    }
    case SETTINGS_SAVED:
      return {
        ...state,
        redirectTo: action.error ? null : '/',
        currentUser: action.error ? null : action.payload.user,
      };
    case LOGIN:
    case REGISTER:
      return {
        ...state,
        redirectTo: action.error ? null : '/',
        token: action.error ? null : action.payload.user.token,
        currentUser: action.error ? null : action.payload.user,
      };
    case DELETE_ARTICLE:
      return { ...state, redirectTo: '/' };
    case ARTICLE_PAGE_UNLOADED:
    case EDITOR_PAGE_UNLOADED:
    case HOME_PAGE_UNLOADED:
    case PROFILE_PAGE_UNLOADED:
    case PROFILE_FAVORITES_PAGE_UNLOADED:
    case SETTINGS_PAGE_UNLOADED:
    case LOGIN_PAGE_UNLOADED:
    case REGISTER_PAGE_UNLOADED:
      return { ...state, viewChangeCounter: state.viewChangeCounter + 1 };
    case SWITCH_LOADER:
      return {
        ...state,
        loaderState: action.isActive,
        loaderText:
          action.loaderText && action.loaderText != ''
            ? action.loaderText
            : state.loaderText,
      };
    case ALERTBOX:
      return {
        ...state,
        alertOpen: action.alertOpen || false,
        alertMessage: action.alertMessage || '',
        alertType: action.alertType || 'error',
      };
    case ALERTCLOSE:
      return {
        ...state,
        alertOpen: false,
      };

    case MODAL:
      return {
        ...state,
        modalOpen: action.modalOpen || false,
        modalTitle: action.modalTitle || '',
        modalContent: action.modalContent || '',
        modalYesBtnText: action.modalYesBtnText || 'Yes',
        modalProps: action.modalProps || {},
        modalType: action.modalType || 'general',
      };
    case MODALCLOSE:
      return {
        ...state,
        modalOpen: false,
      };

    case MODALNEXT:
      return {
        ...state,
        modalNext: action.modalNext || '',
      };
    default:
      return state;
  }
};
