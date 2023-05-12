import { store } from '../store';
import { SWITCH_LOADER, ALERTBOX, MODAL } from '../constants/actionTypes';

const _switchLoader = (isActive = false, loaderText) => {
  store.dispatch({
    type: SWITCH_LOADER,
    isActive,
    loaderText,
  });
};
const _triggerAlert = (alertOpen = false, message = '', type = 'error') => {
  store.dispatch({
    type: ALERTBOX,
    alertOpen,
    alertMessage: message,
    alertType: type,
  });
};

const _modal = (
  modalOpen = false,
  modalTitle = '',
  content = '',
  yesBtnText = 'Yes',
  type = 'general',
  props = {}
) => {
  store.dispatch({
    type: MODAL,
    modalOpen,
    modalContent: content,
    modalType: type,
    modalProps: props,
    modalTitle,
    modalYesBtnText: yesBtnText,
  });
};
export const switchLoader = _switchLoader;
export const alertBox = _triggerAlert;
export const modal = _modal;
// export default connect(mapStateToProps, mapDispatchToProps)(CommonRedux);
