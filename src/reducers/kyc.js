import { UPDATE_KYC } from '../constants/actionTypes';

const initialState = { applicantStatus: '', samsubStatus: '' };

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_KYC:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const mapStateToProps = (state) => ({
  appLoaded: state.common.appLoaded,
  kyc: state.kyc,
});
