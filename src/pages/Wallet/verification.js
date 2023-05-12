import React from 'react';
import { alertBox, switchLoader } from '../../commonRedux/';
import WalletMenu from '../../components/Menu/WalletMenu';
import WalletMenuMobile from '../../components/Menu/WalletMenuMobile';
import Spinner from '../../components/Spinner';
import TabsUI from '../../components/Tabs/index';
import WalletAllBalance from '../../components/Wallet/allBalance';
import {
  displayApplicantDataForFe,
  getprofile_basisid,
  getSumsubApplicantData,
  getSumsubToken,
  getUploadedFiles,
  removeUploadedFile,
  updateApplicant,
} from '../../http/http-calls';
import { saveKYC } from '../../http/wallet-calls';
import './styles.scss';
import NavigationBlocker from '../../components/NavigationBlocker';
import { Container, ThemeProvider } from 'react-bootstrap';
import { Box, CssBaseline, Paper } from '@material-ui/core';
import SumsubWebSdk from '@sumsub/websdk-react';
import axios from 'axios';
import { getToken } from '../../http/token-interceptor';
import { updateKycState } from '../../hooks/walletCheck';
import {
  ReviewStatus,
  ReviewAnswer,
  applicantConStatus,
} from '../../constants/actionTypes';
class WalletVerification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      attempt: 0,
      loading: true,
      status: '',
      applicantStatus: '',
      content: 'loading',
      currentTab: 0,
      file: '',
      selected: [],
      files: [],
      userId: null,
      cognitoUserId: null,
      accessToken: null,
      uRLObj: null,
      reviewAnswer: '',
      reviewStatus: '',
      rejectReason: '',
    };
  }

  loadStatus = async () => {
    const userRes = await getprofile_basisid();
    let cognitoUserId = userRes.walletDetails.cognito_id;
    this.setState({ cognitoUserId });
    const sumsubRes = await getSumsubToken({ cognitoUserId });
    this.setState({ accessToken: sumsubRes.token });
    if (cognitoUserId) {
      const applicantDataRes = await getSumsubApplicantData({
        cognitoUserId: sumsubRes.userId,
      });
      if (!applicantDataRes?.fixedInfo) applicantDataRes.fixedInfo = {};
      if (!applicantDataRes?.review) applicantDataRes.review = {};
      const {
        id,
        externalUserId,
        email,
        review: { reviewStatus },
        fixedInfo: { legalName, dob, phone, gender, country, addresses },
      } = applicantDataRes;

      const reviewAnswer =
        applicantDataRes?.review?.reviewResult?.reviewAnswer || undefined;
      const rejectLabels = applicantDataRes?.review?.reviewResult?.rejectLabels;
      const rejectReason =
        rejectLabels && rejectLabels[0]
          ? rejectLabels[0]
          : applicantDataRes?.review?.reviewResult?.moderationComment;
      const newStr = rejectReason
        ? rejectReason
            .toLowerCase()
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        : '';

      if (rejectReason) this.setState({ loading: false, rejectReason: newStr });
      this.applicantId = id;
      var applicantData = {};

      if (applicantDataRes?.review?.reviewStatus && this.state.currentTab === 0)
        this.setState({
          loading: false,
          reviewStatus: applicantDataRes?.review?.reviewStatus,
        });

      if (reviewAnswer && this.state.currentTab === 0) {
        this.setState({ loading: false, reviewAnswer });
      }
      applicantData['userId'] = externalUserId || undefined;
      applicantData['legalName'] = legalName || undefined;
      applicantData['gender'] = gender || undefined;
      applicantData['phone'] = phone || undefined;
      applicantData['country'] = country || undefined;
      applicantData['email'] = email || undefined;
      applicantData['dob'] = dob || undefined;
      applicantData['status'] = reviewStatus || undefined;

      if (addresses)
        for (const address of addresses)
          applicantData['full_address'] = `
          ${address.flatNumber},
          ${address.buildingNumber},
          ${address.street},
          ${address.subStreet},
          ${address.town},
          ${address.state},
          ${address.postCode}`;

      var updateApplicantObj = {};
      if (reviewAnswer == ReviewAnswer.GREEN)
        updateApplicantObj.applicantStatus = applicantConStatus.ACCEPT;
      else if (
        reviewStatus == ReviewStatus.PENDING &&
        reviewAnswer == ReviewAnswer.RED
      )
        updateApplicantObj.applicantStatus = applicantConStatus.PENDING;
      else if (reviewAnswer == ReviewAnswer.RED)
        updateApplicantObj.applicantStatus = applicantConStatus.REJECT;
      else if (reviewStatus == ReviewStatus.PENDING)
        updateApplicantObj.applicantStatus = applicantConStatus.PENDING;
      const updateApplicantRes = await updateApplicant({
        ...applicantData,
        ...updateApplicantObj,
      });
      updateKycState(userRes);
      let headers = {
        responseType: 'blob',
        'Content-Type': 'application/json',
        headers: { Authorization: 'Bearer ' + getToken() },
      };
      const apiUrl = `${process.env.REACT_APP_BASEURL}getting-applicant-pdf-report`;

      if (this.applicantId !== undefined) {
        const apiPayload = { applicantId: this.applicantId };
        const applicatePdfRes = await axios.post(apiUrl, apiPayload, headers);
        if (applicatePdfRes?.data) {
          // Set filename with .pdf extension
          const filename = `applicant_report_${this.applicantId}.pdf`;

          // Set Content-Disposition header with filename and extension
          const contentDispositionHeader = `attachment; filename="${filename}"`;
          applicatePdfRes.headers['content-disposition'] =
            contentDispositionHeader;

          let theURLObj = URL.createObjectURL(applicatePdfRes.data);
          if (this.state.currentTab == 0) {
            this.setState({ uRLObj: theURLObj });
          }
        }
      }
    }
    await this.setState({ userId: userRes._id });
    this.checkWallet();
  };
  downloadPdfFile(theURLObj, filename) {
    const link = document.createElement('a');
    link.href = theURLObj;
    link.download = filename + '.pdf';
    link.click();
  }
  componentDidMount = () => {
    this.loadStatus();
    this.setState({ uRLObj: null });
  };
  getNewAccessToken() {
    return Promise.resolve(this.state.accessToken);
  }
  componentWillUnmount = () => {
    window.onbeforeunload = null;
    this.setState({
      open: false,
    });
  };
  closeModal = () => {
    this.setState({ open: false });
  };
  leave = () => {
    this.setState({
      open: false,
      doc1: null,
      doc2: null,
      doc3: null,
      doc4: null,
    });
  };

  checkWallet = () => {
    displayApplicantDataForFe({ cognitoUserId: this.state.cognitoUserId }).then(
      (resp) => {
        if (
          resp?.data?.applicantStatus == ReviewAnswer.GREEN ||
          resp?.data?.applicantStatus == ReviewAnswer.RED ||
          resp?.data?.status == ReviewStatus.PENDING ||
          resp?.data?.status == ReviewStatus.ON_HOLD
        ) {
          this.setState(
            {
              loading: false,
              status: resp.data.status,
              applicantStatus: resp.data.applicantStatus,
            },
            () => {
              window.localStorage.setItem('status', resp.data.status);
              window.localStorage.setItem(
                'applicantStatus',
                resp.data.applicantStatus
              );
            }
          );
          // this.setState( {
          //   loading : false,
          //   kycStatus : resp.data.kycStatus
          // })
        } else {
          this.setState({
            loading: false,
          });
        }
      },
      (err) => {
        this.setState({
          loading: false,
          error: 'Authentication Error!',
        });
      }
    );
  };

  uploadedFiles = () => {
    getUploadedFiles({ page: 'walletKYC' }).then(
      async (resp) => {
        this.setState({
          files: resp.files,
        });
      },
      (error) => {}
    );
  };

  removeFile = (file) => {
    switchLoader(true, 'File is being removed, please wait...');
    removeUploadedFile(file).then(
      async (resp) => {
        this.uploadedFiles();
        switchLoader();
      },
      (error) => {
        alertBox(true, error.message);
        switchLoader();
      }
    );
  };

  changeTab = (newValue) => {
    this.loadStatus();
    this.setState({
      open: false,
      currentTab: newValue,
    });
    this.checkWallet();
  };

  browse = (e) => {
    var target = e.target.getAttribute('data-target');
    var input = document.getElementById(target);
    input.click();
  };

  chooseFile = (e) => {
    // var temp = this.state.files;
    // temp[i]['selected'] = (temp[i]['selected']) ? false : true;
    // this.setState({
    //     files: temp
    // });
  };
  viewDocument = (e) => {
    var file = this.state[e];
    if (file instanceof File) {
      window.open(URL.createObjectURL(file));
    } else {
      window.open(file);
    }
  };

  clearFile = (e) => {
    var input = e.target;
    var id = input.getAttribute('data-target');
    this.setState(
      {
        [id]: null,
      },
      () => {
        if (
          (this.state.doc1 != null ||
            this.state.doc2 != null ||
            this.state.doc3 != null ||
            this.state.doc4 != null) &&
          this.state.status == ''
        ) {
          this.setState({ open: true });
        } else {
          this.setState({ open: false });
        }
      }
    );
  };

  inputChange = (e) => {
    var input = e.target;
    var id = input.getAttribute('id');
    var file = input.files[0];
    if (!file.type.includes('image/') && file.type != 'application/pdf') {
      alertBox(true, 'PDF/Image files only allowed');
    } else if (file.size > 1048576) {
      alertBox(true, 'File size should be lesser than or equal to 1 MB');
    } else {
      this.setState(
        {
          [id]: input.files[0],
        },
        () => {
          if (
            (this.state.doc1 != null ||
              this.state.doc2 != null ||
              this.state.doc3 != null ||
              this.state.doc4 != null) &&
            this.state.status == ''
          ) {
            this.setState({ open: true });
          } else {
            this.setState({ open: false });
          }
        }
      );
    }
  };
  blobify = (selected, url) => {
    return new Promise((resolve, reject) => {
      if (selected) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'blob';
        request.onload = function () {
          resolve(request.response);
        };
        request.send();
      } else {
        resolve('');
      }
    });
  };

  summaryReport = () => {
    const { reviewStatus, reviewAnswer } = this.state;

    return (
      reviewStatus === ReviewStatus.PENDING ||
      reviewStatus === ReviewStatus.ON_HOLD ||
      reviewAnswer === ReviewAnswer.RED ||
      reviewAnswer === ReviewAnswer.GREEN
    );
  };

  submit = async () => {
    switchLoader(true, 'Submitting, please wait...');
    if (
      this.state.doc1 == null ||
      this.state.doc2 == null ||
      this.state.doc3 == null ||
      this.state.doc4 == null
    ) {
      switchLoader();
      alertBox(true, 'Please select files for all categories!');
    } else {
      // var selected = [
      //     this.state.doc1,
      //     this.state.doc2,
      //     this.state.doc3,
      //     this.state.doc4
      // ];
      var data = {
        Front: this.state.doc1,
        Back: this.state.doc2,
        Doc: this.state.doc3,
        Bank: this.state.doc4,
      };
      saveKYC(data).then(
        async (resp) => {
          if (resp.status == false) {
            alertBox(true, resp.message);
          }
          switchLoader();
          this.setState(
            {
              status: 'Pending',
            },
            this.changeTab(0)
          );
          //window.location.reload();
        },
        (error) => {
          switchLoader();
          alertBox(
            true,
            error == undefined ? 'Someting went wrong' : error.message
          );
        }
      );
    }
    // })
  };

  render() {
    return (
      <div className="container my-wall-container depositPage">
        {this.state.open && (
          <NavigationBlocker navigationBlocked={this.state.open} />
        )}
        {/* <Modal displayModal={this.state.open} closeModal={this.closeModal} >
                     <div>
                         <p>You have selected but haven't submitted your documents yet</p>
                         <p>Are you sure about leaving the page?</p>
                     </div>
                <div className="">
                <Button variant="primary" size="compact m-2" onClick={() => this.leave()}>Yes</Button>
                <Button variant="secondary" size="compact m-2" onClick={this.closeModal}>No</Button>
                </div>
             </Modal> */}
        <div className="row mt-2">
          {/* <!-- left column --> */}
          <div className="col-sm empty-container-with-out-border left-column">
            <WalletMenu {...this.props} />
          </div>
          {/* <!-- end left column --> */}

          {/* <!-- center column --> */}
          <div className="col-sm empty-container-with-border center-column">
            <WalletMenuMobile {...this.props} />
            <TabsUI
              tabs={['Verification Status', 'Manage Documents']}
              type="transactions"
              className="noBorder"
              currentTab={this.state.currentTab}
              preventChange={this.state.open}
              changeTab={this.changeTab}
            />
            {this.state.currentTab == 0 ? (
              <div>
                <div className="tab row m--1 mt-2">
                  <div className="p-4 w-100">
                    {this.state.loading ||
                    (this.state.reviewStatus == ReviewStatus.INIT &&
                      !this.state.uRLObj) ? (
                      <Spinner />
                    ) : this.state.reviewStatus == ReviewStatus.INIT ||
                      this.state.reviewStatus == '' ? (
                      <p className="text-center text-danger col-md-6 mx-auto p-3">
                        {`Your account hasn't been verified yet, Please go to
                        "Manage Documents" tab and upload your documents and
                        wait for approval!`}
                      </p>
                    ) : this.state.reviewStatus == ReviewStatus.PENDING ||
                      this.state.reviewStatus == ReviewStatus.ON_HOLD ? (
                      <p className="text-center text-warning col-md-6 mx-auto p-3">
                        You have already submitted your documents, Please wait
                        for approval
                      </p>
                    ) : this.state.reviewAnswer == ReviewAnswer.RED ? (
                      <p className="text-center text-danger col-md-6 mx-auto">
                        Your account verification has been rejected, Please
                        resubmit it again!
                        <br />
                        <span
                          style={{
                            display: 'block',
                            textAlign: 'center',
                            textDecoration: 'underline',
                          }}
                        >
                          Reason: {this.state.rejectReason}
                        </span>
                      </p>
                    ) : this.state.reviewAnswer == ReviewAnswer.GREEN ? (
                      <p className="text-center text-success col-md-6 mx-auto p-3">
                        You account has been verified, now you can use all
                        wallet features!
                      </p>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <div>
                  {this.summaryReport() ? (
                    <strong>To view your verification summary please</strong>
                  ) : (
                    ''
                  )}
                  {this.summaryReport() ? (
                    <a
                      href="#"
                      onClick={() =>
                        this.downloadPdfFile(this.state.uRLObj, 'report')
                      }
                    >
                      {' '}
                      click here
                    </a>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            ) : (
              <div className="tab mt-3">
                <ThemeProvider>
                  <CssBaseline />
                  <Container component={Box} p={4}>
                    <Paper component={Box} p={3}>
                      <SumsubWebSdk
                        accessToken={this.state.accessToken}
                        expirationHandler={() => this.getNewAccessToken()}
                        config={{
                          lang: 'en',
                          i18n: {
                            document: {
                              subTitles: {
                                IDENTITY:
                                  'Upload a document that proves your identity',
                              },
                            },
                          },
                          onMessage: (type, payload) => {},
                          uiConf: {
                            customCssStr:
                              ':root {\n  --black: #000000;\n   --grey: #F5F5F5;\n  --grey-darker: #B2B2B2;\n  --border-color: #DBDBDB;\n}\n\np {\n  color: var(--black);\n  font-size: 16px;\n  line-height: 24px;\n}\n\nsection {\n  margin: 40px auto;\n}\n\ninput {\n  color: var(--black);\n  font-weight: 600;\n  outline: none;\n}\n\nsection.content {\n  background-color: var(--grey);\n  color: var(--black);\n  padding: 40px 40px 16px;\n  box-shadow: none;\n  border-radius: 6px;\n}\n\nbutton.submit,\nbutton.back {\n  text-transform: capitalize;\n  border-radius: 6px;\n  height: 48px;\n  padding: 0 30px;\n  font-size: 16px;\n  background-image: none !important;\n  transform: none !important;\n  box-shadow: none !important;\n  transition: all 0.2s linear;\n}\n\nbutton.submit {\n  min-width: 132px;\n  background: none;\n  background-color: var(--black);\n}\n\n.round-icon {\n  background-color: var(--black) !important;\n  background-image: none !important;\n}',
                          },
                          onError: (error) => {},
                        }}
                        options={{
                          addViewportTag: false,
                          adaptIframeHeight: true,
                        }}
                        onMessage={(type, payload) => {}}
                        onError={(error) => {}}
                      />
                    </Paper>
                  </Container>
                </ThemeProvider>
              </div>
            )}
          </div>
          {/* <!-- end center column --> */}
          <div className="col-sm empty-container-with-out-border right-column">
            <WalletAllBalance />
          </div>
        </div>
      </div>
    );
  }
}

export default WalletVerification;
