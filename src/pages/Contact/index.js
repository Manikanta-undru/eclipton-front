import React from 'react';
import Select from 'react-dropdown-select';
import { alertBox, switchLoader } from '../../commonRedux';
import A from '../../components/A';
import Button from '../../components/Button';
import FrontPageFooter from '../../components/FrontPageFooter';
import { GetAssetImage } from '../../globalFunctions';
import support from '../../assets/images/customer-service.png';
import { contact } from '../../http/http-calls';
import './styles.scss';

const ccodes = require('../Register/ccodes.json');
require('../Login/styles.scss');

class ContactUs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      rcode: '',
      message: '',
      values: [],
      countryCode: '',
      phone: '',
      password: '',
      cPassword: '',
      errors: {},
      pwdtype: 'password',
      cpwdtype: 'password',
      countryCodes: [
        { name: 'US', code: '+1' },
        { name: 'IN', code: '+91' },
        { name: 'GB', code: '+44' },
      ],
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    try {
      this.setState({
        rcode:
          this.props.match.params.username == undefined ||
          this.props.match.params.username == 'new'
            ? ''
            : this.props.match.params.username,
      });
    } catch (error) {
      /* empty */
    }
  }

  handleChange = (evt) => {
    const { name, value } = evt.target;
    const errors = {};
    if (name === 'email' && typeof value !== 'undefined') {
      const lastAtPos = value.lastIndexOf('@');
      const lastDotPos = value.lastIndexOf('.');
      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          value.indexOf('@@') == -1 &&
          lastDotPos > 2 &&
          value.length - lastDotPos > 2
        )
      ) {
        errors.email = 'Email is not valid';
        alertBox(true, 'Email is not valid');
      }
      this.setState({ [name]: value }, () => {});
    } else {
      this.setState({ [name]: value }, () => {});
    }
  };

  submitForm = (e) => {
    e.preventDefault();
    const errors = {};
    if (typeof this.state.email !== 'undefined') {
      const lastAtPos = this.state.email.lastIndexOf('@');
      const lastDotPos = this.state.email.lastIndexOf('.');
      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          this.state.email.indexOf('@@') == -1 &&
          lastDotPos > 2 &&
          this.state.email.length - lastDotPos > 2
        )
      ) {
        errors.email = 'Email is not valid';
        alertBox(true, 'Email is not valid');
      } else {
        const obj = {
          name: this.state.name,
          email: this.state.email,
          phone: `${this.state.countryCode}${this.state.phone}`,
          message: this.state.message,
        };
        switchLoader(true, 'Please wait...');
        contact(obj).then(
          async (resp) => {
            switchLoader();
            alertBox(
              true,
              'Your message has been sent, you will receive a mail shortly!',
              'success'
            );
            this.setState({
              name: '',
              email: '',
              countryCode: '',
              phone: '',
              message: '',
              values: [],
            });
            document.getElementById('textarea').value = '';
          },
          (error) => {
            switchLoader();
            const alert =
              error && error.data && error.data.message
                ? typeof error.data.message === 'object'
                  ? Object.values(error.data.message).join(',')
                  : error.data.message
                : '';
            alertBox(true, alert);
          }
        );
      }
    }
  };

  render() {
    const { email, name, phone, password, cPassword, pwdtype, rcode } =
      this.state;
    return (
      <>
        <div className="loginPage contactPage">
          <div className="container">
            <header>
              <A href="/">
                <img
                  className="logo"
                  src={GetAssetImage('logo-main.png')}
                  alt=""
                />
              </A>
              <nav>
                <A href="/">
                  <button className="secondaryBtn">Home</button>
                </A>
              </nav>
            </header>
            <div className="row contactContainer">
              <div className="col-md-7">
                {/* <A href="/"><img className="logo" src={GetAssetImage('logo-main.png')} alt="" /></A> */}
                {/* <p className="intro-text">Social Media Platform with Trusted Cryptocurrency Exchange</p>
            <img className="coins" src={GetAssetImage('front/coins1.png')} /> */}
                <div className="left-container">
                  <img className="customer-support" src={support} />
                  <div className="info">
                    <h4>Have some questions?</h4>
                    <p>
                      Please use this form or email us directly if you have any
                      questions about our product or services.
                    </p>
                    <span>support@eclipton.com</span>
                  </div>
                </div>
              </div>
              <div className="col-md-5">
                <div className="loginForm">
                  <form action="" method="post" onSubmit={this.submitForm}>
                    <h1>Get in touch</h1>
                    <div className="input-group mb-3">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Full Name"
                        name="name"
                        required
                        pattern="[a-zA-Z0-9 ]{6,160}"
                        title="Enter Minimum 6 characters, Maximum 160 characters, Alpha-Numeric without special charcters"
                        value={this.state.name}
                        onChange={(e) => this.handleChange(e)}
                      />
                      <span style={{ color: 'red', width: '100%' }}>
                        {this.state.errors.name}
                      </span>
                    </div>
                    <div className="input-group mb-3">
                      <input
                        className="form-control"
                        type="email"
                        required
                        placeholder="hello@eclipton.com"
                        name="email"
                        value={this.state.email}
                        onChange={(e) => this.handleChange(e)}
                      />
                      <span style={{ color: 'red', width: '100%' }}>
                        {this.state.errors.email}
                      </span>
                    </div>

                    <div className="input-group mb-3">
                      <div className="input-group-append mr-2 d-block">
                        {/* <select required className="form-control" name="countryCode" id=""
                                onChange={(e) => this.handleChange(e)}
                                value={this.state.countryCode} >
                                {ccodes.map((country, i) => (
                                  <option  value={country.dial_code} >
                                    {country.code} {country.dial_code}
                                  </option>
                                ))}
                              </select> */}
                        <Select
                          placeholder="Country"
                          options={ccodes}
                          values={this.state.values}
                          labelField="name"
                          valueField="name"
                          name="ccode"
                          className="form-control"
                          onChange={(values) => {
                            try {
                              this.setState({
                                countryCode: values[0].dial_code,
                                values,
                              });
                            } catch (error) {
                              this.setState({
                                countryCode: '',
                                values,
                              });
                            }
                          }}
                        />
                        <div>
                          <span style={{ color: 'red', width: '100%' }}>
                            {this.state.errors.ccode}
                          </span>
                        </div>
                      </div>
                      <input
                        className="form-control"
                        type="tel"
                        maxLength="10"
                        minLength="10"
                        pattern="[0-9]{10}"
                        title="Minimum 10 digit, numbers only"
                        placeholder="Mobile (optional)"
                        name="phone"
                        value={this.state.phone}
                        onChange={(e) => this.handleChange(e)}
                      />
                      <span style={{ color: 'red', width: '100%' }}>
                        {this.state.errors.phone}
                      </span>
                    </div>
                    <div className="input-group mb-3">
                      <textarea
                        id="textarea"
                        className=" contact-message"
                        type="text"
                        placeholder="Message"
                        name="message"
                        required
                        rows={4}
                        onChange={(e) => this.handleChange(e)}
                      >
                        {this.state.message}
                      </textarea>
                      <div>
                        <span style={{ color: 'red', width: '100%' }}>
                          {this.state.errors.message}
                        </span>
                      </div>
                    </div>
                    <div className="terms">
                      <input type="checkbox" required />{' '}
                      <span style={{ marginLeft: '7px' }}>
                        I am over age 18 and I agree to
                      </span>{' '}
                      <a
                        href={`${process.env.REACT_APP_FRONTEND}terms-and-conditions.pdf`}
                        target="_BLANK"
                        className="terms"
                        rel="noreferrer"
                      >
                        <span className="pointer text-blue">
                          Terms & Conditions{' '}
                        </span>
                      </a>
                    </div>
                    <div className="form-group">
                      <Button
                        variant="login_Btn"
                        className="mt-4"
                        disabled={this.props.inProgress}
                      >
                        Send
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FrontPageFooter />
      </>
    );
  }
}

export default ContactUs;
