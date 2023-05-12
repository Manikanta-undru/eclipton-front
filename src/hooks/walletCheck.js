import { displayApplicantDataForFe } from '../http/http-calls';
import { store } from '../store';
import { UPDATE_KYC } from '../constants/actionTypes';
import { getCurrentUser } from '../http/token-interceptor';

const currentUser = JSON.parse(getCurrentUser());

export const mapCommonStateToProps = (state) => ({
  samsubStatus: state.kyc.samsubStatus,
});

export const updateKycState = (currentUser) => {
  if (currentUser) {
    const {
      walletDetails: { cognito_id },
    } = currentUser;
    displayApplicantDataForFe({ cognitoUserId: cognito_id }).then((res) => {
      const samsubStatus = res?.data?.applicantStatus || res?.data?.status;
      store.dispatch({ type: UPDATE_KYC, payload: { samsubStatus } });
    });
  }
};

const walletCheck = (params) => {
  if (currentUser) {
    return new Promise((resolve, reject) => {
      const kycStatus = store.getState()?.kyc?.samsubStatus;
      if (kycStatus) {
        const status =
          kycStatus == 'GREEN' || kycStatus == 'Accept' ? 'Accept' : 'Reject';
        const sendData = { data: { status } };
        resolve(sendData);
      } else {
        reject('Wallet Server Unauthorized');
      }
    });
  }
};
export default walletCheck;
