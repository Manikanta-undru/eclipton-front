import { detect } from 'detect-browser';
import React from 'react';
import { FacebookLogin } from 'react-facebook-login-component';
import GoogleLogin from 'react-google-login';
import { alertBox, switchLoader } from '../../commonRedux';
import A from '../../components/A';
import Button from '../../components/Button';
import FrontPageFooter from '../../components/FrontPageFooter';
import FrontPageHeader from '../../components/FrontPageHeader';
import { GetAssetImage } from '../../globalFunctions';
import { login, verifyEmail } from '../../http/http-calls';
import { facebookAuth, googleAuth } from '../../http/oauth-calls';

require('./styles.scss');

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    const glogged = localStorage.getItem('glogged');
    this.state = {
      email: '',
      glogged,
      browser: null,
      password: '',
      pwdtype: 'password',
      errors: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    const browser = detect();
    this.setState({
      browser,
    });
    // localStorage.clear();
    if (this.props.match.params.emailToken) {
      switchLoader(true, 'Please wait, Activating your email');
      verifyEmail({ str: this.props.match.params.emailToken }).then(
        async (resp) => {
          switchLoader();
          alertBox(true, resp.message, 'success');
        },
        (error) => {
          alertBox(true, error.data.message);
          switchLoader();
        }
      );
    }
  }

  handleSuccess = (data) => {
    // this.setState({
    //   code: data.code,
    //   errorMessage: '',
    // });
  };

  handleFailure = (error) => {
    console.log(error);
    // this.setState({
    //   code: '',
    //   errorMessage: error.errorMessage,
    // });
  };

  handleChange = (evt) => {
    const { name, value } = evt.target;
    this.setState({ [name]: value }, () => {});
  };

  authHandler = (err, data) => {
    //
    switchLoader(true, 'Please wait, Validating your credentials...');
    setTimeout(() => {
      switchLoader();
    }, 2000);
  };

  startAuth = () => {
    this.props.history.push('/twitter-login');
  };

  handleValidation() {
    const fields = this.state;
    let formIsValid = true;
    const errors = {};

    if (!fields.email) {
      formIsValid = false;
      errors.email = 'Cannot be empty';
    }

    if (typeof fields.email !== 'undefined' && fields.email) {
      const lastAtPos = fields.email.lastIndexOf('@');
      const lastDotPos = fields.email.lastIndexOf('.');
      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          fields.email.indexOf('@@') == -1 &&
          lastDotPos > 2 &&
          fields.email.length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors.email = 'Email is not valid';
      }
    }

    if (!fields.password) {
      formIsValid = false;
      errors.password = 'Cannot be empty';
    }

    this.setState({ errors });
    return formIsValid;
  }

  submitForm = (e) => {
    e.preventDefault();
    if (this.handleValidation()) {
      const obj = {
        email: this.state.email,
        password: this.state.password,
        browser: this.state.browser,
        authflag: true,
      };
      switchLoader(true, 'Please wait, Validating your credentials...');
      login(obj).then(
        async (resp) => {
          localStorage.clear();
          localStorage.setItem('currentUser', JSON.stringify(resp.userinfo));
          localStorage.setItem('jwt', resp.token);
          localStorage.setItem('walletToken', resp.walletToken);
          window.location.href = '/';
          // twitterSync()
          // .then(async resp => {
          //
          // }, error => {
          //
          // });
          switchLoader();
        },
        (error) => {
          alertBox(true, error == undefined ? '' : error.data.message);
          switchLoader();
        }
      );
    } else {
      /* empty */
    }
  };

  esponseGoogle = (res) => {
    // if(this.state.glogged != null){
    try {
      switchLoader(true, 'Logging in...');
      const data = {
        id: res.profileObj.googleId,
        name: res.profileObj.name,
        avatar: res.profileObj.imageUrl,
        email: res.profileObj.email,
        browser: this.state.browser,
      };
      googleAuth(data).then(
        (resp) => {
          switchLoader();

          if (
            resp.status != undefined &&
            resp.status != null &&
            resp.status == 'new'
          ) {
            localStorage.setItem('vid', resp.userinfo._id);
            localStorage.setItem('loginredirect', 'true');
            localStorage.setItem('addphone', 'true');
            this.props.history.push('/verify-phone');
          } else if (
            resp.status != undefined &&
            resp.status != null &&
            resp.status == 'unverified'
          ) {
            if (
              resp.phone == undefined ||
              resp.phone == null ||
              resp.phone == '' ||
              resp.phone.indexOf('+') == -1
            ) {
              localStorage.setItem('vid', resp.id);
              localStorage.setItem('loginredirect', 'true');
              localStorage.setItem('addphone', 'true');
              this.props.history.push('/verify-phone');
            } else {
              localStorage.setItem('vid', resp.id);
              localStorage.setItem('loginredirect', 'true');
              this.props.history.push('/verify-phone');
            }
          } else {
            localStorage.clear();
            localStorage.setItem('currentUser', JSON.stringify(resp.userinfo));
            localStorage.setItem('jwt', resp.token);
            localStorage.setItem('walletToken', resp.walletToken);
            try {
              let path = this.props.location.search;
              if (path.indexOf('?next=') != -1) {
                path = path.replace('?next=', '');
                window.location.href = path;
              } else {
                window.location.href = '/home';
              }
            } catch (error) {
              window.location.href = '/home';
            }
          }
        },
        (err) => {
          switchLoader();
          alertBox(true, err.data.message);
        }
      );
    } catch (error) {
      switchLoader();
      alertBox(true, 'Error getting data from google');
    }
  };
  // }

  responseFacebook = (res) => {
    try {
      switchLoader(true, 'Logging in...');
      const data = {
        id: res.id,
        name: res.name,
        avatar:
          res.picture.data != undefined && res.picture.data.url != undefined
            ? res.picture.data.url
            : '',
        email: res.email,
        browser: this.state.browser,
      };
      facebookAuth(data).then(
        (resp) => {
          switchLoader();
          if (
            resp.status != undefined &&
            resp.status != null &&
            resp.status == 'new'
          ) {
            localStorage.setItem('vid', resp.userinfo._id);
            localStorage.setItem('loginredirect', 'true');
            localStorage.setItem('addphone', 'true');
            this.props.history.push('/verify-phone');
          } else if (
            resp.status != undefined &&
            resp.status != null &&
            resp.status == 'unverified'
          ) {
            if (
              resp.phone == undefined ||
              resp.phone == null ||
              resp.phone == '' ||
              resp.phone.indexOf('+') == -1
            ) {
              localStorage.setItem('vid', resp.id);
              localStorage.setItem('loginredirect', 'true');
              localStorage.setItem('addphone', 'true');
              this.props.history.push('/verify-phone');
            } else {
              localStorage.setItem('vid', resp.id);
              localStorage.setItem('loginredirect', 'true');
              this.props.history.push('/verify-phone');
            }
          } else {
            localStorage.clear();
            localStorage.setItem('currentUser', JSON.stringify(resp.userinfo));
            localStorage.setItem('jwt', resp.token);
            localStorage.setItem('walletToken', resp.walletToken);

            try {
              let path = this.props.location.search;
              if (path.indexOf('?next=') != -1) {
                path = path.replace('?next=', '');
                window.location.href = path;
              } else {
                window.location.href = '/home';
              }
            } catch (error) {
              window.location.href = '/home';
            }
          }
        },
        (err) => {
          switchLoader();
          alertBox(true, err.data.message);
        }
      );
    } catch (error) {
      switchLoader();
      alertBox(true, 'Error getting data from facebook');
    }
  };

  openMobNav = () => {
    this.props.openMobNav();
  };

  setLocal = () => {
    localStorage.setItem('glogged', 'true');
  };

  render() {
    const { email, name, phone, password, cPassword, pwdtype } = this.state;
    return (
      <>
        <FrontPageHeader openMobNav={this.openMobNav} />
        <div className="landingPage">
          <div className="hero">
            <div className="container">
              <div className="hero-captions">
                <h2>
                  <span className="capt1">Express</span>
                  <span className="capt2">YOURSELF</span>
                </h2>
                {/* <h2><span className="capt3">Feelings</span></h2> */}
                <div className="hr" />
                <p>
                  {`We're A Social Media Platform with Trusted Cryptocurrency
                  Exchange`}
                </p>
                <p>
                  Begin to trade in as many cryptocurrencies as you want (over
                  40 crypto pairs) and five supported fiat currencies (EUR, USD,
                  GBP, INR, SGD). So take the first step and choose us today.
                </p>
                <label>Sign in with</label>
                <div className="socialLogins">
                  <A href="/twitter-login">
                    <img
                      className="twitter-login-btn"
                      src={GetAssetImage('front/twitter-login.svg')}
                    />
                  </A>
                  <GoogleLogin
                    clientId="231889500330-jdm4rp9hlv8jdr4k4as2b4uqkeobhut3.apps.googleusercontent.com"
                    buttonText=""
                    autoLoad={false}
                    responseType="code,token"
                    redirectUri={`${process.env.REACT_APP_FRONTEND}login/`}
                    isSignedIn={false}
                    onRequest={this.setLocal}
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                    cookiePolicy="single_host_origin"
                    className="google-login-btn"
                  />
                  <FacebookLogin
                    socialId="690764608257761"
                    language="en_US"
                    scope="public_profile,email"
                    responseHandler={this.responseFacebook}
                    xfbml
                    fields="id,email,name,picture"
                    version="v2.5"
                    className="facebook-login-btn"
                    buttonText=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <section className="row">
              <div className="col-md-8 section-img spl">
                <div className="inner">
                  <div className="row">
                    <div className="col-md-6 flex-col-right">
                      <div className="spl1">
                        <h4>Express Yourself</h4>
                        <p>
                          By choosing us, you have the freedom to express
                          yourself the way only you can. With over 40 crypto
                          pairs and five fiat currencies, you are limitless.
                        </p>
                      </div>
                      <div className="spl3">
                        <h4>Be Part of a Global CommunityGlobal community</h4>
                        <p>
                          {`Join the tribe of people that trade and earn money.
                          Get support and guidance instead of competition. Who
                          needs a 9-5 job when you've got smart people?`}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6  flex-col-right">
                      <div className="spl2">
                        <h4>Why Should You Choose Us?</h4>
                        <p>
                          You should choose us simply because we provide a safe,
                          secure platform for crypto enthusiasts and users, as
                          well as innovative solutions for data-mining problems.
                          Here, you are not alone. People will hold your hand
                          and guide you through.
                        </p>
                      </div>
                      <div className="spl4">
                        <h4>Earn Money Online</h4>
                        <p>
                          Earning money has never been easier. You get richer
                          with comfort and ease, all online. Join the passion
                          economy and leverage your talent to earn (and in your
                          preferred currency too).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 section-details right">
                <h3>Built By People Just Like You</h3>
                <p>
                  You built this. At least, this is how you would have built it
                  because this was built by creative people like you. This was
                  built with you in mind. It was built for you to showcase your
                  creativity and talent while you earn money from customers
                  around the world in crypto and fiat options. This was built by
                  you, for you.
                </p>
              </div>
            </section>

            <section className="row">
              <div className="col-md-7 section-img">
                <img src={GetAssetImage('front/earn.svg')} className="earn" />
              </div>
              <div className="col-md-5 section-details right">
                <h3>Earn Money Online With Ease</h3>
                <p>
                  {` Earning money online is now easier and better. With Eclipton,
                  you leverage your talent, and you get paid. Just like that.
                  Even better, Eclipton is safe. We do not intrude on users'
                  data, and we will never steal users' data. Easy, safe, and
                  secure - just for you.`}
                </p>
              </div>
            </section>

            <section className="row">
              <div className="col-md-5 section-details">
                <h3>
                  Join your colleagues, classmates, and friends on Eclipton now!
                </h3>
                <p>
                  Eclipton is filled with like minds, and that is why you should
                  be here too. Because you will meet people who think the way
                  you do. Eclipton positively influences and educates you. It is
                  not just a platform, it is a community, and there is always
                  room for you.
                </p>
              </div>
              <div className="col-md-7 section-img right">
                <img src={GetAssetImage('front/join.svg')} className="join" />
              </div>
            </section>

            <section className="row">
              <div className="col-md-7 section-img">
                <img
                  src={GetAssetImage('front/coins2.png')}
                  className="coins"
                />
              </div>
              <div className="col-md-5 section-details">
                <h3>Access to The Top Coin Markets</h3>
                <p>
                  {`With Eclipton, you have the keys. Get instant access to the
                  top coin markets where you can trade. What's that saying you
                  have never heard? Everyone wants the top, but only a few can
                  get there. With Eclipton, you can.`}
                </p>
              </div>
            </section>

            <section className="row">
              <div className="col-md-8 section-img">
                <img src={GetAssetImage('front/laugh.png')} className="coins" />
              </div>
              <div className="col-md-4 section-details">
                <h3 className="express">Express</h3>
                <h3 className="thoughts">Your Thoughts</h3>
                <p>
                  A community is where you feel comfortable and free, and
                  Eclipton is exactly that. Here, you can express yourself in a
                  way that is uniquely you. Here, you will never feel stifled or
                  restricted. With our many, many trading options, the only
                  limit is you.
                </p>
              </div>
            </section>

            <section className="row last">
              <div className="col-md-5 section-details">
                <h3 className="jointoday">Join Today</h3>
                <p>
                  You built this, and that means you have to enjoy what you
                  built, particularly because you may not have the chance soon
                  if you put it off too later.
                </p>
                <p>
                  {`So why don't you sign up now? It's easy. Just click on the
                  button below, and that's it!`}
                </p>
              </div>
              <div className="col-md-7 right">
                <div className="signup-group">
                  <A href="/register/new">
                    <Button variant="primary" className="box big">
                      Sign up
                    </Button>
                  </A>
                  <img
                    src={GetAssetImage('front/click.svg')}
                    className="join"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
        <FrontPageFooter />
      </>
    );
  }
}

export default LandingPage;
