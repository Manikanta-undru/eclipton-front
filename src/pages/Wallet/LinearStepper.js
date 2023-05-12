import React, { useEffect } from 'react';
import {
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import useState from 'react-usestateref';
import {
  createProfile,
  getKycDetailsForFe,
  getKycStatus,
  getprofile_basisid,
  getzignsec_liveness,
  getzignsec_token,
  updateUser,
  uploadFile,
} from '../../http/http-calls';
import { alertBox } from '../../commonRedux';

const ccodes = require('./ccodes.json');
const timezone = require('./timezone.json');

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: theme.spacing(1),
  },
}));

function getSteps() {
  return [
    'General Settings',
    'Upload Documents',
    'Video Selfie',
    // "Payment",
  ];
}

function BasicForm() {
  const {
    control,
    // formState: { errors },
  } = useFormContext();

  const [profiledata, setProfileData] = useState([]);
  const [mobileno, setMobile] = useState('');
  const today_date = new Date();
  const tyear = today_date.getFullYear() - 18;
  const tmonth = today_date.getMonth();
  const tday = today_date.getDate();
  const max_date = new Date(tyear, tmonth, tday);
  const [maxdate, setMaxdate] = useState(max_date.toISOString().split('T')[0]);
  const [selected, setSelected] = useState('');

  const initialFormValue = {
    email: '',
    address: '',
    name: '',
    dob: '',
    phonecode: '',
    phone: '',
    timezone: '',
  };

  const [formValue, setFormValue] = useState(initialFormValue);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = () => {
    getprofile_basisid().then(
      async (resp) => {
        setProfileData(resp);
        const mobile_no = resp.phone.replace(resp.phonecode, '');
        setUserId(resp._id);
        setMobile(mobile_no);
      },
      (err) => {}
    );
  };

  const handle_step1 = (e) => {
    const { name, value } = e.target;
    const formData = { ...formValue, ...{ [name]: value } };
    setFormValue(formData);
  };

  const inputChange = (e) => {
    const val = e.target.files[0];
    const accept = 'png,jpg,jpeg,pdf';
    if (!val.name.match(/\.(png|jpg|jpeg|pdf)$/)) {
      alertBox(true, `Please choose valid format ${accept}`);
    } else {
      setSelected(val.name);
      uploadFile({ page: 'kyc', file: val }).then(
        async (resp) => {
          getKycStatus({ userId, status: 'Pending' });
        },
        (error) => {
          console.log(error, 'error log');
          // setLoading(false);
          if (error != undefined) {
            alertBox(true, error.message);
          } else {
            alertBox(true, 'File upload getting error');
          }
        }
      );
    }
  };

  return (
    <form id="formsubmit">
      <h4 className="wizardH4">Personal Details</h4>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="exampleInputEmail1" className="wizardLabel">
              Email
            </label>
            <input
              type="email"
              name="email"
              defaultValue={profiledata.email}
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter email"
              required
              onChange={(e) => handle_step1(e)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="exampleInputEmail1" className="wizardLabel">
              Full Address
            </label>
            <input
              type="text"
              name="address"
              className="form-control"
              id="exampleInputEmail1"
              defaultValue={profiledata.city}
              aria-describedby="emailHelp"
              placeholder="Enter address"
              onChange={(e) => handle_step1(e)}
              required
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="exampleInputEmail1" className="wizardLabel">
              Legal Name
            </label>
            <input
              type="text"
              name="name"
              defaultValue={profiledata.name}
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter Legal name"
              required
              onChange={(e) => handle_step1(e)}
            />
          </div>
        </div>
        {/* <div className="col-md-6">
                <div className="form-group">
                    <label for="exampleInputEmail1" className="wizardLabel">Profile Picture Upload</label>
                    <input type="file" className="form-control noHide" id="myFile" aria-describedby="profileHelp" />
                </div>
            </div> */}
        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="exampleInputEmail1" className="wizardLabel">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="MM/DD/YYYY"
              max={maxdate}
              onChange={(e) => handle_step1(e)}
              required
            />
          </div>
        </div>
      </div>
      <div className="row">
        {/* <div className="col-md-6">
                <div className="form-group">
                    <label for="exampleInputEmail1" className="wizardLabel">Date of Birth</label>
                    <input type="date" name="dob" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="MM/DD/YYYY" max={maxdate} onChange={(e) => handle_step1(e)}/>
                </div>
            </div> */}
        <div className="col-md-6">
          <div className="input-group mobileInput">
            <label htmlFor="exampleInputEmail1" className="wizardLabel w-100">
              Mobile
            </label>
            <div
              className="input-group-prepend"
              style={{ paddingRight: '10px' }}
            >
              {/* <select aria-label="Default select example" className="form-select">
                      <option selected="">+91</option>
                      <option value="1" ng-reflect-value="1">+96</option>
                      <option value="2" ng-reflect-value="2">+001</option>
                      <option value="3" ng-reflect-value="3">+044</option>
                    </select> */}
              <select
                aria-label="Default select example"
                className="form-select"
                name="phonecode"
                onChange={(e) => handle_step1(e)}
              >
                {ccodes.map((c, k) => (
                  <option
                    key={k}
                    value={c.dial_code}
                    selected={profiledata.phonecode == c.dial_code}
                  >
                    {c.dial_code}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              name="phone"
              defaultValue={mobileno}
              aria-label="Text input with dropdown button"
              className="form-control"
              placeholder="Enter Mobile no"
              onChange={(e) => handle_step1(e)}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label htmlFor="exampleInputEmail1" className="wizardLabel">
              TimeZone
            </label>
            {/* <select className="form-control" id="exampleFormControlSelect1">
                      <option>Select Timezone</option>
                      <option>India (GMT+5:30)</option>
                      <option>USA (GMT-4)</option>
                      <option>Germany (GMT+2)</option>
                    </select> */}
            <select
              className="form-control"
              name="timezone"
              id="exampleFormControlSelect1"
              onChange={(e) => handle_step1(e)}
            >
              {timezone.map((c, k) => (
                <option
                  key={k}
                  value={c.value}
                  selected={profiledata.timezone == c.value}
                >
                  {c.text}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <label htmlFor="exampleInputEmail1" className="wizardLabel">
            Address Proof Upload
          </label>
          <input
            type="file"
            name="address_proof"
            className="form-control"
            style={{ visibility: 'visible', position: 'inherit' }}
            id="myFile"
            aria-describedby="profileHelp"
            onChange={inputChange}
          />
        </div>
      </div>
      {/* <div className="row"> */}
      {/* <div className="col-md-6">
                <div className="form-group">
                    <label for="exampleInputEmail1" className="wizardLabel">TimeZone</label>
                    {/* <select className="form-control" id="exampleFormControlSelect1">
                      <option>Select Timezone</option>
                      <option>India (GMT+5:30)</option>
                      <option>USA (GMT-4)</option>
                      <option>Germany (GMT+2)</option>
                    </select> */}
      {/* <select className="form-control" name="timezone" id="exampleFormControlSelect1" onChange={(e) => handle_step1(e)}>
                      {
                        timezone.map((c, k) => {
                          return <option key={k} value={c.value} selected={profiledata.timezone == c.value}>{c.text}</option>
                        })
                      }
                    </select>
                </div>
            </div> */}
      {/* <div className="col-md-6">
                <div className="form-group">
                    <label for="exampleInputEmail1" className="wizardLabel">ID Proof Upload</label>
                    <input type="file" className="form-control noHide" id="myFile" aria-describedby="profileHelp" />
                </div>
            </div> */}
      {/* </div> */}
      {/* <h4 className="wizardH4 pt-3">Add your Bank Details</h4>
        <div className="row">
            <div className="col-md-6">
                <div className="form-group">
                    <label for="exampleInputEmail1" className="wizardLabel">Bank Name</label>
                    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Bank name" />
                </div>
            </div>
            <div className="col-md-6">
                <div className="form-group">
                    <label for="exampleInputEmail1" className="wizardLabel">Account Name</label>
                    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Account name" />
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-md-6">
                <div className="form-group">
                    <label for="exampleInputEmail1" className="wizardLabel">Account Number</label>
                    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Account no" />
                </div>
            </div>
            <div className="col-md-6">
                <div className="form-group">
                    <label for="exampleInputEmail1" className="wizardLabel">IFSC</label>
                    <select className="form-control" id="exampleFormControlSelect1">
                      <option>xxx0000000</option>
                      <option>xx00000000</option>
                      <option>x000000000</option>
                      <option>F0000000000</option>
                    </select>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-md-6">
                <div className="form-group">
                    <label for="exampleInputEmail1" className="wizardLabel">Branch</label>
                    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Branch" />
                </div>
            </div>
        </div> */}
    </form>
  );
}

function ContactForm() {
  const { control } = useFormContext();
  const [zignsecSelfie, setZignsecSelfie, zignsecdataref] = useState();
  const [zignsecload, setZignLoad, zignsecloadref] = useState(false);

  useEffect(() => {
    ZignsecSelfie();
  }, []);

  const ZignsecSelfie = () => {
    getzignsec_token().then(async (res) => {
      const result = JSON.parse(res.data.body);
      const selfieUrl = result.data.redirect_url;
      setZignsecSelfie(selfieUrl);
      if (res.status) {
        setZignsecSelfie(selfieUrl);
        setZignLoad(true);
      }
    });
  };

  return (
    <form className="widgetsForm" id="uploadDocs" style={{ display: 'none' }}>
      <h4 className="wizardH4">Upload Documents</h4>

      <div className="row">
        <div className="col-md-12 pb-3">
          <iframe src={zignsecSelfie} width="540px" height="520px" />
        </div>
      </div>
    </form>
  );
}
function PersonalForm() {
  const { control } = useFormContext();
  const [zignsecLive, setZignsecLive, zignsecliveref] = useState();

  useEffect(() => {
    getZignsecLiveness();
  }, []);

  // const getZignsec = () =>{
  //   getzignsec_token().then(async resp => {
  //       if(resp.status)
  //       {
  //         console.log(resp,'liveresonse====')
  //         setZignseclive(resp.zignsec_live_url);
  //         setZignLoad(true);
  //       }
  //   }, err => {
  //   })
  // }
  const getZignsecLiveness = () => {
    getzignsec_liveness().then((res) => {
      const result = JSON.parse(res.data.body);
      const livenessUrl = result.data.redirect_url;
      setZignsecLive(livenessUrl);
      if (res.status) {
        setZignsecLive(livenessUrl);
      }
    });
  };
  return (
    <>
      <form style={{ display: 'none' }}>
        <h4 className="wizardH4">Video KYC</h4>

        <div className="row">
          <div className="col-md-12 pb-3">
            <iframe
              src={zignsecLive}
              width="100%"
              height="400px"
              allow="camera;microphone"
            />
          </div>
        </div>
      </form>
      {/* <div className="settingsTab_3">
        <div className="row">
          <div className="col-md-6 py-2">
              <h5>KYC Registration on epay</h5>
              <p>Your KYC status is <span className="redText">Pending</span></p>
          </div>
          <div className="col-md-6 text-right py-1">
              <p>*Only verified members after admin approves</p>
              <p>*Documents size should be <b>50kb - 200kb</b></p>
          </div>
        </div>
      </div>
      <hr />
      <div className="settingsTab_1 py-4">
      <div className="row">
         <div className="col-md-6">
            <h5>1. RG, CNH or Passport - Front</h5>
            <p>Upload a clear RG, CNH or Passport Front page</p>
         </div>
         <div className="col-md-6">
            <div className="form-group">
               <div className="chooseFile pb-1">
               	<input type="file" id="exampleInputPassword1" className="form-control noHide" />
               </div>
               <div className="text-right">
               	<a href="javascript:void(0)" className="viewBtn">View Document</a>
               </div>
            </div>
         </div>
      </div>
      <div className="row">
         <div className="col-md-6">
            <h5>2. RG, CNH or Passport - Back</h5>
            <p>Upload a clear RG, CNH or Passport Back page</p>
         </div>
         <div className="col-md-6">
            <div className="form-group">
               <div className="chooseFile pb-1">
               	<input type="file" id="exampleInputPassword1" className="form-control noHide" />
               </div>
               <div className="text-right">
               	<a href="javascript:void(0)" className="viewBtn">View Document</a>
               </div>
            </div>
         </div>
      </div>
      <div className="row">
         <div className="col-md-6">
            <h5>3. Selfie with Document</h5>
            <p>Upload your selfie with document</p>
         </div>
         <div className="col-md-6">
            <div className="form-group">
               <div className="chooseFile pb-2">
               	<input type="file" id="exampleInputPassword1" className="form-control noHide" />
               </div>
               <div className="text-right">
               	<a href="javascript:void(0)" className="viewBtn">View Document</a>
               </div>
            </div>
         </div>
      </div>
      <div className="row">
         <div className="col-md-6">
            <h5>4. Proof of financial capability - Bank Statement / Income Tax / Income Proof.</h5>
            <p>Upload your Bank Statement / Income Tax / Income Proof</p>
         </div>
         <div className="col-md-6">
            <div className="form-group">
               <div className="chooseFile pb-2">
               	<input type="file" id="exampleInputPassword1" className="form-control noHide" />
               </div>
               <div className="text-right">
               	<a href="javascript:void(0)" className="viewBtn">View Document</a>
               </div>
            </div>
         </div>
      </div>
   </div> */}
    </>
  );
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <BasicForm />;

    case 1:
      return <ContactForm />;
    case 2:
      return <PersonalForm />;
    // case 3:
    //   return <PaymentForm />;
    default:
      return 'unknown step';
  }
}

function LinaerStepper(props) {
  const showNavigation = true;
  const classes = useStyles();
  const methods = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      nickName: '',
      emailAddress: '',
      phoneNumber: '',
      alternatePhone: '',
      address1: '',
      address2: '',
      country: '',
      cardNumber: '',
      cardMonth: '',
      cardYear: '',
    },
  });
  const [activeStep, setActiveStep] = useState(0);
  const [skippedSteps, setSkippedSteps] = useState([]);
  const [userId, setUserId] = useState('');
  useEffect(() => {
    getProfile();
  }, []);

  const steps = getSteps();
  const isStepOptional = (step) => step === 1 || step === 2;
  const isStepFalied = () =>
    Boolean(Object.keys(methods.formState.errors).length);
  const isStepSkipped = (step) => skippedSteps.includes(step);
  const createProfileData = (data) => {
    createProfile(data).then(async (res) => {
      alertBox(true, res.message, 'success');
    });
  };
  const saveProfileData = (data) => {
    updateUser(data).then((res) => {
      alertBox(true, res.message, 'success');
    });
  };
  const getProfile = () => {
    getprofile_basisid().then((res) => {
      setUserId(res._id);
      getKycDetailsForFe({ userId: res._id }).then((resp) => {
        if (resp?.data?.status == 'Pending') setActiveStep(1);
      });
    });
  };

  const handleNext = (data) => {
    const formvalue = document.getElementById('formsubmit');

    if (formvalue) {
      const { email, address, name, phonecode, phone, dob, address_proof } =
        formvalue;
      const personalForm = {
        userId,
        email: email.value,
        address: address.value,
        uname: name.value,
        country_code: phonecode.value,
        dob: dob.value,
        mobile: phone.value,
        address_proof: address_proof.value,
      };
      // createProfileData(personalForm);
      saveProfileData(personalForm);
    }

    if (activeStep == steps.length - 1) {
      fetch('')
        .then((data) => data.json())

        .then((res) => {
          setActiveStep(activeStep + 1);
        });
    } else {
      setActiveStep(activeStep + 1);
      setSkippedSteps(
        skippedSteps.filter((skipItem) => skipItem !== activeStep)
      );
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSkip = () => {
    if (!isStepSkipped(activeStep)) {
      setSkippedSteps([...skippedSteps, activeStep]);
    }
    setActiveStep(activeStep + 1);
  };
  const uploadDocs = document.getElementById('uploadDocs');
  // const onSubmit = (data) => {
  // };
  return (
    <div>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        style={{ display: 'none' }}
      >
        {steps.map((step, index) => {
          const labelProps = {};
          const stepProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption" align="center" key={index}>
                optional
              </Typography>
            );
          }
          if (isStepFalied() && activeStep == index) {
            labelProps.error = true;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step {...stepProps} key={index}>
              <StepLabel {...labelProps}>{step}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <Typography variant="h3" align="center">
          {/* Thank You */}
        </Typography>
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleNext)}>
            {getStepContent(activeStep)}

            <div className="row wizardButton" style={{ marginTop: '50px' }}>
              <div className="col">
                <Button
                  className={classes.button}
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  color="primary"
                  variant="contained"
                >
                  back
                </Button>
              </div>
              {activeStep === steps.length - 1 ? (
                <div className="col pull-right" style={{ marginLeft: '381px' }}>
                  <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={handleNext && uploadDocs}
                    type="submit"
                  >
                    Finish
                  </Button>
                </div>
              ) : (
                <div className="col pull-right" style={{ marginLeft: '388px' }}>
                  <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={handleNext && uploadDocs}
                    type="submit"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
}

export default LinaerStepper;
