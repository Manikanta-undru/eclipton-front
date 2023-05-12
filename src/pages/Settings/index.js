import React from 'react';
import TimeAgo from 'react-timeago';
import ToggleButton from 'react-toggle-button';
import { alertBox, switchLoader } from '../../commonRedux';
import Button from '../../components/Button';
import SettingsMenu from '../../components/Menu/SettingsMenu';
import { getLoginLog, updateProfile } from '../../http/http-calls';
import {
  getSettings,
  updateNewPhone,
  updateNewPhoneVerify,
  updateSettings,
} from '../../http/settings-calls';
import { facebookAuth } from '../../http/oauth-calls';
import './styles.scss';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      facebookID: 0,
      otpEdit: false,
      otp: '',
      currentTab: 0,
      log: [],
      phone: '',
      phoneEdit: false,
      email: '',
      limit: 20,
      seemore: false,
      page: 1,
      preferedCurrency: '',
      preferedCurrencyEdit: false,
      allowSharing: false,
      allowSharingEdit: false,
      tagging: '',
      taggingEdit: false,
      follow: '',
      followEdit: false,
      comments: '',
      commentsEdit: false,
      notifications: '',
      notificationsEdit: false,
      current: 1,
      twitter: false,
      saveLogin: false,
      logins: [],
      share: false,
      taggingSaved: '',
      followSaved: '',
      commentsSaved: '',
      notificationsSaved: '',
      preferedCurrencySaved: '',
      allowSharingSaved: false,
      latestpost: {},
      filter: '',
      about: 1,
      refreshing: false,
    };
    this.myRef = React.createRef();
  }

  setStateFunc = (key, value) => {
    this.setState({ [key]: value });
  };

  refreshHighlights = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        this.setState({
          refreshing: false,
        });
      }
    );
  };

  refresh = () => {
    const dis = this;
    this.setState({
      refreshing: true,
    });
    setTimeout(() => {
      dis.setState({
        refreshing: false,
      });
    }, 500);
  };

  filterPosts = (opt) => {
    this.setState({
      latestpost: {},
      filter: opt,
    });
  };

  componentDidMount() {
    this.setState({ facebookID: this.props.currentUser.facebookID });
    this.getData();
    this.getLog();
  }

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

  getLog = () => {
    getLoginLog({ page: this.state.page, limit: this.state.limit }).then(
      (resp) => {
        if (resp.length > 0) {
          let temp = this.state.log;
          temp = temp.concat(resp);
          this.setState({ log: temp, page: this.state.page + 1 }, () => {
            this.checkMore();
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  checkMore = () => {
    getLoginLog({ page: this.state.page, limit: this.state.limit }).then(
      (resp) => {
        if (resp.length > 0) {
          this.setState({ seemore: true });
        } else {
          this.setState({ seemore: false });
        }
      },
      (err) => {
        this.setState({ seemore: false });
      }
    );
  };

  getData = () => {
    getSettings().then(
      (resp) => {
        this.setState({
          phone: resp.info.phone,
          email: resp.info.email,
        });
        if (resp.settings != null) {
          this.setState({
            preferedCurrency: resp.settings.preferedCurrency,
            preferedCurrencySaved: resp.settings.preferedCurrency,
            allowSharing: resp.settings.allowSharing,
            allowSharingSaved: resp.settings.allowSharing,
            tagging: resp.settings.tagging,
            taggingSaved: resp.settings.tagging,
            follow: resp.settings.follow,
            followSaved: resp.settings.follow,
            comments: resp.settings.comments,
            commentsSaved: resp.settings.comments,
            notifications: resp.settings.notifications,
            notificationsSaved: resp.settings.notifications,
            saveLogin: resp.settings.saveLogin,
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  changeTab = (newValue) => {
    this.setState({
      loading: true,
    });
    const temp = newValue == 0 ? this.state.sent : this.state.received;
    this.setState({ currentTab: newValue, loading: false, content: temp });
  };

  switch = (val) => {
    this.setState({
      about: val,
    });
  };

  choosePic = () => {
    const pic = document.getElementById('profilePic');
    pic.click();
  };

  updateProfilePic = (e) => {
    const file = e.target.files[0];
    updateProfile({ avatar: file }).then(
      (resp) => {
        window.location.reload();
      },
      (err) => {
        console.log(err);
      }
    );
  };

  goToEdit = () => {
    this.setState({ currentTab: 0 });
    setTimeout(() => {
      this.myRef.scrollIntoView();
    }, 300);
  };

  handleChange = (e) => {
    const val = e.target.value;
    const { name } = e.target;
    if (name == 'allowSharing') {
      this.setState({
        allowSharing_is_change: 1,
      });
    }
    this.setState({
      [name]: val,
    });
  };

  handleEdit = (opt) => {
    const type = `${opt}Edit`;
    this.setState({
      [type]: true,
    });
  };

  handleCancel = (opt) => {
    const type = `${opt}Edit`;
    this.setState({
      [type]: false,
    });

    const savedValue = this.state[`${opt}Saved`];
    this.setState({ [opt]: savedValue });
  };

  handleSave = (opt) => {
    const val = this.state[opt];
    const type = `${opt}Edit`;
    updateSettings({ type: opt, value: val }).then(
      (resp) => {
        this.setState({
          [type]: false,
        });
        this.setState({ [`${opt}Saved`]: val });
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  handleSave2 = (e) => {
    e.preventDefault();

    const opt = 'phone';
    const val = this.state[opt];
    const type = `${opt}Edit`;
    updateNewPhone({ phone: val }).then(
      (resp) => {
        alertBox(true, 'Please enter the OTP sent to your mobile', 'success');
        this.setState({
          otpEdit: true,
        });
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  phoneVerify = (e) => {
    e.preventDefault();
    if (this.state.otp == '') {
      alertBox(true, 'OTP is required');
    } else {
      updateNewPhoneVerify({ otp: this.state.otp }).then(
        (resp) => {
          alertBox(
            true,
            'You have successfully updated your mobile number',
            'success'
          );
          this.setState({
            otpEdit: false,
            phoneEdit: false,
          });
        },
        (error) => {
          alertBox(true, error.data.message);
        }
      );
    }
  };

  render() {
    const user = this.props.currentUser;
    return (
      <div className="settingsPage">
        <div className="container my-wall-container ">
          <div className="row mt-2">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column">
              <SettingsMenu
                {...this.props}
                current={this.state.about}
                switch={this.switch}
              />
              {/* <WalletBalanceWidget  {...this.props}/>
                  
                  <RecommendedFriends {...this.props}  /> */}
            </div>
            <div className="col-sm empty-container-with-out-border center-column">
              <div className="tabPanelItem " ref={(ref) => (this.myRef = ref)}>
                <div className="row m-0">
                  {/* <div className="col-md-4 p-0">
                    <div className="bordered ms-2 me-2">
                    <ul className="list-group w-100"><li className="list-group-item d-flex justify-content-between align-items-center header-drak ">SETTINGS</li></ul>
                      <ul id="switch">
                        <li className={this.state.about == 1 && "active"} onClick={() => this.switch(1)} ><i className="fa fa-cog"></i> General</li>
                        <li className={this.state.about == 2 && "active"} onClick={() => this.switch(2)} ><i className="fa fa-shield"></i> Security & Login</li>
                        <li className={this.state.about == 3 && "active"} onClick={() => this.switch(3)} ><i className="fa fa-tags"></i> Timeline & Tagging</li>
                        <li className={this.state.about == 4 && "active"} onClick={() => this.switch(4)} ><i className="fa fa-file"></i> Public Posts</li>
                      </ul>
                    </div>
                  </div> */}
                  <div className="col-md-12 p-0">
                    <div className="scard bordered p-0 ms-2 me-2">
                      <div className="settings-body">
                        {this.state.about == 1 && (
                          <div className="s1">
                            <ul className="list-group w-100 mb-0">
                              <li className="list-group-item d-flex justify-content-between align-items-center header-drak ">
                                <h3>General Account Settings</h3>
                              </li>
                            </ul>

                            <div className="srow">
                              <label>Mobile</label>
                              {this.state.phoneEdit ? (
                                this.state.otpEdit ? (
                                  <form
                                    method="post"
                                    id="settingsphone"
                                    action=""
                                    onSubmit={this.phoneVerify}
                                  >
                                    <input
                                      type="number"
                                      pattern="[0-9]{6}"
                                      title="6 digit, numbers only"
                                      className=""
                                      value={this.state.otp}
                                      name="otp"
                                      onChange={this.handleChange}
                                      placeholder="OTP"
                                    />
                                    <button
                                      id="saveOtp"
                                      style={{ display: 'none' }}
                                    />
                                  </form>
                                ) : (
                                  <form
                                    method="post"
                                    id="settingsphone"
                                    action=""
                                    onSubmit={this.handleSave2}
                                  >
                                    <input
                                      type="number"
                                      title="Minimum 6 digit, numbers only"
                                      className=""
                                      value={this.state.phone}
                                      name="phone"
                                      onChange={this.handleChange}
                                      placeholder="Mobile"
                                    />
                                    <button
                                      id="savePhone"
                                      style={{ display: 'none' }}
                                    />
                                  </form>
                                )
                              ) : (
                                <div className="value">{this.state.phone}</div>
                              )}
                              {
                                this.state.phoneEdit ? (
                                  this.state.otpEdit ? (
                                    <div>
                                      <span
                                        className="pointer"
                                        onClick={() =>
                                          document
                                            .getElementById('saveOtp')
                                            .click()
                                        }
                                      >
                                        Verify
                                      </span>
                                      <span
                                        className="pointer ms-2"
                                        onClick={() => this.handleCancel('otp')}
                                      >
                                        Cancel
                                      </span>
                                    </div>
                                  ) : (
                                    <div>
                                      <Button
                                        variant="primaryBtn"
                                        className="pointer"
                                        onClick={() =>
                                          document
                                            .getElementById('savePhone')
                                            .click()
                                        }
                                      >
                                        Save
                                      </Button>
                                      <Button
                                        variant="secondaryBtn"
                                        className="pointer ms-2"
                                        onClick={() =>
                                          this.handleCancel('phone')
                                        }
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  )
                                ) : (
                                  <div />
                                )
                                // <div className="pointer round" onClick={() => this.handleEdit("phone")}><i className="fa fa-pencil"></i></div>
                              }
                            </div>
                            <div className="srow">
                              <label>Email</label>
                              <div className="value">{this.state.email}</div>
                              <span
                                className="pointer"
                                style={{ width: '12px', height: '30px' }}
                              />
                            </div>
                            <div className="srow">
                              <label>Default Currency</label>
                              {this.state.preferedCurrencyEdit ? (
                                <select
                                  type="text"
                                  className="me-2"
                                  value={this.state.preferedCurrency}
                                  name="preferedCurrency"
                                  onChange={this.handleChange}
                                  placeholder=""
                                >
                                  <option value="None">None</option>
                                  <option value="BTC">BTC</option>
                                  <option value="ETH">ETH</option>
                                  <option value="LTC">LTC</option>
                                  <option value="XRP">XRP</option>
                                  <option value="BCH">BCH</option>
                                  <option value="USDT">USDT</option>
                                  <option value="USD">USD</option>
                                  <option value="EUR">EUR</option>
                                  <option value="INR">INR</option>
                                </select>
                              ) : (
                                <div className="value ps-1">
                                  {this.state.preferedCurrency === 'Select'
                                    ? 'None'
                                    : this.state.preferedCurrency}
                                </div>
                              )}
                              {this.state.preferedCurrencyEdit ? (
                                <div className="d-flex mx-2">
                                  <Button
                                    variant="primaryBtn"
                                    className="pointer"
                                    onClick={() =>
                                      this.handleSave('preferedCurrency')
                                    }
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    variant="secondaryBtn"
                                    className="pointer ms-2"
                                    onClick={() =>
                                      this.handleCancel('preferedCurrency')
                                    }
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                // <Button className="pointer" onClick={() => this.handleEdit("preferedCurrency")} variant="primaryBtn">Edit</Button>
                                <div
                                  className="pointer round"
                                  onClick={() =>
                                    this.handleEdit('preferedCurrency')
                                  }
                                >
                                  <i className="fa fa-pencil" />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {this.state.about == 2 && (
                          <div className="s1">
                            <ul className="list-group w-100 mb-0">
                              <li className="list-group-item d-flex justify-content-between align-items-center header-drak ">
                                SECURITY AND LOGIN
                              </li>
                            </ul>
                            <div className="legend">
                              <div className="legend-title">Login</div>
                              <div className="legend-body">
                                {
                                  <div className="srow">
                                    <div className="left">
                                      <i className="fa fa-key" />{' '}
                                      <div>
                                        Facebook{' '}
                                        <span>
                                          Account is connected to Facebook
                                        </span>
                                      </div>
                                    </div>
                                    <div className="right">
                                      <Button variant="primaryBtn">
                                        {this.state.facebookID > 0
                                          ? 'Connected'
                                          : 'Not Connected'}
                                      </Button>
                                      {/* <div className="socialLogins">
                                      <a onClick={() => { federatedSignIn("Facebook") }}>
                                        <img className="twitter-login-btn" src={GetAssetImage('front/fb-icon.svg')} />
                                      </a>
                                      <FacebookLogin socialId="690764608257761"
                                        language="en_US"
                                        scope="public_profile,email"
                                        responseHandler={this.responseFacebook}
                                        xfbml={true}
                                        fields="id,email,name,picture"
                                        version="v2.5"
                                        className="facebook-login-btn"
                                        buttonText="" />
                                    </div> */}
                                    </div>
                                  </div>
                                }
                                <div className="srow">
                                  <div className="left">
                                    <i className="fa fa-sign-out" />{' '}
                                    <div>
                                      Save your login information{' '}
                                      <span>
                                        It will only be saved on the browsers
                                        and devices you choose
                                      </span>
                                    </div>
                                  </div>
                                  <div className="right">
                                    <ToggleButton
                                      value={this.state.saveLogin || false}
                                      onToggle={(value) => {
                                        this.setState({
                                          saveLogin: !value,
                                        });
                                        updateSettings({
                                          type: 'saveLogin',
                                          value: !value,
                                        }).then(
                                          (resp) => {},
                                          (error) => {
                                            alertBox(true, error.data.message);
                                          }
                                        );
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="legend mb-3">
                              <div className="legend-title">
                                {/* Where you're logged in */}
                              </div>
                              <div className="legend-body">
                                {this.state.log.length > 0 &&
                                  this.state.log.map((r, i) => (
                                    <div className="srow" key={i}>
                                      <div className="left">
                                        {r.os.toLowerCase().indexOf('linux') !=
                                        -1 ? (
                                          <i className="fa fa-linux" />
                                        ) : r.os
                                            .toLowerCase()
                                            .indexOf('windows') != -1 ? (
                                          <i className="fa fa-windows" />
                                        ) : r.os
                                            .toLowerCase()
                                            .indexOf('android') != -1 ? (
                                          <i className="fa fa-android" />
                                        ) : r.os.toLowerCase().indexOf('mac') !=
                                            -1 ||
                                          r.os.toLowerCase().indexOf('ios') !=
                                            -1 ? (
                                          <i className="fa fa-apple" />
                                        ) : (
                                          <i className="fa fa-desktop" />
                                        )}
                                        <div>
                                          {r.name} <span>{r.os}</span>
                                        </div>
                                      </div>
                                      <div className="right">
                                        <span className="location">
                                          <TimeAgo date={r.createdAt} />
                                        </span>
                                        {/* <span className="pointer"><i className="fa fa-ellipsis-v"></i></span> */}
                                      </div>
                                    </div>
                                  ))}
                                {/*                               
                              <div className="srow">
                                <div className="left"><i className="fa fa-desktop"></i> <div>Windows PC <span>Chrome</span></div></div>
                                <div className="right"><span className="location">New York, US</span><span className="pointer"><i className="fa fa-ellipsis-v"></i></span></div>
                              </div> */}
                                {this.state.seemore && (
                                  <div
                                    className="seemore-alt"
                                    onClick={this.getLog}
                                  >
                                    Seemore
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        {this.state.about == 3 && (
                          <div className="s1">
                            <ul className="list-group w-100 mb-0">
                              <li className="list-group-item d-flex justify-content-between align-items-center header-drak ">
                                <h3>Timeline and Tagging Settings</h3>
                              </li>
                            </ul>
                            <div className="srow">
                              <label className="big">
                                Allow others to share your posts to their story?
                              </label>
                              {this.state.allowSharingEdit ? (
                                <select
                                  type="text"
                                  className=""
                                  value={this.state.allowSharing}
                                  name="allowSharing"
                                  onChange={this.handleChange}
                                  placeholder=""
                                >
                                  <option value>On</option>
                                  <option value={false}>Off</option>
                                </select>
                              ) : (
                                <div className="value">
                                  {this.state.allowSharing.toString() == 'true'
                                    ? 'On'
                                    : 'Off'}
                                </div>
                              )}
                              {this.state.allowSharingEdit ? (
                                <div className="d-flex mx-2">
                                  <Button
                                    variant="primaryBtn"
                                    className="pointer"
                                    onClick={() =>
                                      this.handleSave('allowSharing')
                                    }
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    variant="secondaryBtn"
                                    className="pointer ms-2"
                                    onClick={() =>
                                      this.handleCancel('allowSharing')
                                    }
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                // <Button variant="primaryBtn" className="pointer" onClick={() => this.handleEdit("allowSharing")}>Edit</Button>
                                <div
                                  className="pointer round"
                                  onClick={() =>
                                    this.handleEdit('allowSharing')
                                  }
                                >
                                  <i className="fa fa-pencil" />
                                </div>
                              )}
                            </div>
                            <div className="srow">
                              <label className="big">Who can tag me</label>
                              {this.state.taggingEdit ? (
                                <select
                                  type="text"
                                  className=""
                                  value={this.state.tagging}
                                  name="tagging"
                                  onChange={this.handleChange}
                                  placeholder=""
                                >
                                  <option>Everyone</option>
                                  <option>Friends Of Friends</option>
                                  <option>Friends</option>
                                  <option>None</option>
                                </select>
                              ) : (
                                <div className="value">
                                  {this.state.tagging}
                                </div>
                              )}
                              {this.state.taggingEdit ? (
                                <div className="d-flex mx-2">
                                  {/* <span className="pointer" onClick={() => this.handleSave("tagging")}>Save</span>
                                <span className="pointer ms-2" onClick={() => this.handleCancel("tagging")}>Cancel</span> */}
                                  <Button
                                    variant="primaryBtn"
                                    className="pointer"
                                    onClick={() => this.handleSave('tagging')}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    variant="secondaryBtn"
                                    className="pointer ms-2"
                                    onClick={() => this.handleCancel('tagging')}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                // <span className="pointer" onClick={() => this.handleEdit("tagging")}>Edit</span>
                                <div
                                  className="pointer round"
                                  onClick={() => this.handleEdit('tagging')}
                                >
                                  <i className="fa fa-pencil" />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {this.state.about == 4 && (
                          <div className="s1">
                            <ul className="list-group w-100 mb-0">
                              <li className="list-group-item d-flex justify-content-between align-items-center header-drak ">
                                <h3>Public Post Filters and Tools</h3>
                              </li>
                            </ul>
                            <div className="srow">
                              <div className="left">
                                <div>
                                  Who can follow me
                                  <span>
                                    Followers see your posts in News Feed,
                                    Friends follow your posts by default, but
                                    you can also allow people who are not your
                                    friends to follow your public posts, Use
                                    this setting to choose who can follow you.
                                  </span>
                                </div>
                              </div>
                              {this.state.followEdit ? (
                                <select
                                  type="text"
                                  className=""
                                  value={this.state.follow}
                                  name="follow"
                                  onChange={this.handleChange}
                                  placeholder=""
                                >
                                  <option>Everyone</option>
                                  <option>Friends</option>
                                  <option>Friends Of Friends</option>
                                  <option>None</option>
                                </select>
                              ) : (
                                <div className="value">{this.state.follow}</div>
                              )}
                              {this.state.followEdit ? (
                                <div className="d-flex mx-2">
                                  {/* <span className="pointer" onClick={() => this.handleSave("follow")}>Save</span>
                                <span className="pointer ms-2" onClick={() => this.handleCancel("follow")}>Cancel</span> */}
                                  <Button
                                    variant="primaryBtn"
                                    className="pointer"
                                    onClick={() => this.handleSave('follow')}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    variant="secondaryBtn"
                                    className="pointer ms-2"
                                    onClick={() => this.handleCancel('follow')}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                // <span className="pointer" onClick={() => this.handleEdit("follow")}>Edit</span>
                                <div
                                  className="pointer round"
                                  onClick={() => this.handleEdit('follow')}
                                >
                                  <i className="fa fa-pencil" />
                                </div>
                              )}
                            </div>
                            <div className="srow">
                              <div className="left">
                                <div>
                                  Public post comments
                                  <span>
                                    Who can comment on your public posts?
                                  </span>
                                </div>
                              </div>
                              {this.state.commentsEdit ? (
                                <select
                                  type="text"
                                  className=""
                                  value={this.state.comments}
                                  name="comments"
                                  onChange={this.handleChange}
                                  placeholder=""
                                >
                                  <option>Everyone</option>
                                  <option>Friends Of Friends</option>
                                  <option>Friends</option>
                                  <option>None</option>
                                </select>
                              ) : (
                                <div className="value">
                                  {this.state.comments}
                                </div>
                              )}
                              {this.state.commentsEdit ? (
                                <div className="d-flex mx-2">
                                  {/* <span className="pointer" onClick={() => this.handleSave("comments")}>Save</span>
                                <span className="pointer ms-2" onClick={() => this.handleCancel("comments")}>Cancel</span> */}
                                  <Button
                                    variant="primaryBtn"
                                    className="pointer"
                                    onClick={() => this.handleSave('comments')}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    variant="secondaryBtn"
                                    className="pointer ms-2"
                                    onClick={() =>
                                      this.handleCancel('comments')
                                    }
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                // <span className="pointer" onClick={() => this.handleEdit("comments")}>Edit</span>
                                <div
                                  className="pointer round"
                                  onClick={() => this.handleEdit('comments')}
                                >
                                  <i className="fa fa-pencil" />
                                </div>
                              )}
                            </div>
                            <div className="srow">
                              <div className="left">
                                <div>
                                  Public post notifications
                                  <span>Get notification from public</span>
                                </div>
                              </div>
                              {this.state.notificationsEdit ? (
                                <select
                                  type="text"
                                  className=""
                                  value={this.state.notifications}
                                  name="notifications"
                                  onChange={this.handleChange}
                                  placeholder=""
                                >
                                  <option value>On</option>
                                  <option value={false}>Off</option>
                                </select>
                              ) : (
                                <div className="value">
                                  {this.state.notifications.toString() == 'true'
                                    ? 'On'
                                    : 'Off'}
                                </div>
                              )}
                              {this.state.notificationsEdit ? (
                                <div>
                                  {/* <span className="pointer" onClick={() => this.handleSave("notifications")}>Save</span>
                                <span className="pointer ms-2" onClick={() => this.handleCancel("notifications")}>Cancel</span> */}
                                  <Button
                                    variant="primaryBtn"
                                    className="pointer"
                                    onClick={() =>
                                      this.handleSave('notifications')
                                    }
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    variant="secondaryBtn"
                                    className="pointer ms-2"
                                    onClick={() =>
                                      this.handleCancel('notifications')
                                    }
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                // <span className="pointer" onClick={() => this.handleEdit("notifications")}>Edit</span>
                                <div
                                  className="pointer round"
                                  onClick={() =>
                                    this.handleEdit('notifications')
                                  }
                                >
                                  <i className="fa fa-pencil" />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm empty-container-with-out-border right-column">
              {/* <PopularArticles /> */}
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
