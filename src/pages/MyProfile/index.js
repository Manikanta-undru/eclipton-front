import React from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import A from '../../components/A';
import { alertBox, switchLoader } from '../../commonRedux';
import Button from '../../components/Button';
import MyFriends from '../../components/Friends/MyFriends';
import RecommendedFriends from '../../components/Friends/RecommendedFriends';
import Modal from '../../components/Popup';
import BlogPosts from '../../components/Post/BlogPosts';
import CreatePost from '../../components/Post/CreatePost';
import FilteredBlogPosts from '../../components/Post/FilteredBlogPosts';
import FilteredPosts from '../../components/Post/FilteredPosts';
import GlobalRequests from '../../components/Post/GigRequests';
import GlobalPurchased from '../../components/Post/GigPurchased';
import GlobalGigs from '../../components/Post/Gigs';
import Posts from '../../components/Post/Posts';
import TabsUI from '../../components/Tabs/index';
import InlineBalance from '../../components/Wallet/inlineBlance';
import { profilePic } from '../../globalFunctions';
import {
  getProfileExtras,
  updateProfile,
  updateProfileExtras,
  removeProfileExtras,
} from '../../http/profile-calls';
import { getAllTransactions } from '../../http/trans-calls';
import { gertRewardPoints } from '../../http/wallet-calls';
import { changePassword } from '../../auth/cognitoAuth';
import './styles.scss';
import MobileNav from '../../components/Menu/MobileNav';
import { getCitiesOfCountry, getCountryList } from '../../http/http-calls';

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      friends: 0,
      refbal: 0,
      posts: 0,
      currentTab: 0,
      gofeed: 0,
      latestpost: {},
      filter: '',
      about: 0,
      generalEdit: false,
      profilePic: '',
      refreshing: false,
      modal: false,
      errors: {},
      changepassword: {
        type: 'changepassword',
        oldpassword: '',
        newpassword: '',
      },

      general: {
        type: 'general',
        name: this.props.currentUser.name,
        username: this.props.currentUser.username,
        bio: this.props.currentUser.about,
        password: '',
      },
      work_edit: false,
      workplaces: [],
      work: {
        _id: null,
        type: 'workplaces',
        designation: '',
        company: '',
        city: '',
        country: '',
      },
      education_edit: false,
      eductions: [],
      education: {
        _id: null,
        type: 'educations',
        course: '',
        institution: '',
        city: '',
        country: '',
      },
      current_edit: false,
      currents: [],
      current: {
        _id: null,
        type: 'current_cities',
        city: '',
        country: '',
      },
      home_edit: false,
      homes: [],
      home: {
        _id: null,
        type: 'hometown',
        city: '',
        country: '',
      },
      email_edit: false,
      emails: [],
      email: {
        type: 'emails',
        email: '',
      },
      mobile_edit: false,
      mobiles: [],
      mobile: {
        type: 'mobiles',
        mobile: '',
      },
      crop: {
        aspect: 16 / 16,
        width: 230,
      },
      countries: [],
      cities: [],
      country_name: '',
    };
    this.myRef = React.createRef();
    this.myRef2 = React.createRef();
  }

  selectModal = (info) => {
    this.setState({ modal: !this.state.modal }); // true/false toggle
  };

  setStateFunc = (key, value) => {
    if (key == 'latestpost') {
      this.setState({ posts: this.state.posts + 1 });
    }
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

  updatePost = (key, value) => {
    const temp = [...this.state.posts];
    temp[key] = value;
    this.setState({ modal: false, posts: temp });
  };

  refresh = () => {
    const dis = this;
    this.getExtras();
    this.setState({
      refreshing: true,
    });
    setTimeout(() => {
      dis.setState({
        refreshing: false,
      });
    }, 500);
  };

  filterPosts = (opt, page) => {
    if (page == 'post') {
      if (opt != '') {
        this.props.history.push(`/profile/feed/${opt}`);
      } else {
        this.props.history.push('/profile/feed/all');
      }
    }

    this.setState({
      latestpost: {},
      filter: opt,
    });
  };

  componentDidMount() {
    if (
      this.props.match.params.filter == 'saved' ||
      this.props.match.params.filter == 'hidden' ||
      this.props.match.params.filter == 'all'
    ) {
      if (this.props.match.params.filter == 'all') {
        this.setState({ filter: '', currentTab: 1, latestpost: {} });
      } else {
        this.setState({
          filter: this.props.match.params.filter,
          currentTab: 1,
          latestpost: {},
        });
      }
    }

    if (this.props.match.params.id == 'Friends') {
      this.setState({ currentTab: 2 });
    } else if (this.props.match.params.id == 'Blogs') {
      this.setState({ currentTab: 3 });
    } else if (this.props.match.params.id == 'Gigs') {
      this.setState({ currentTab: 4 });
    } else if (this.props.match.params.id == 'Transactions') {
      this.setState({ currentTab: 5 });
    } else if (this.props.match.params.id == 'Feed') {
      this.setState({ currentTab: 1 });
    } else if (this.props.match.params.filter == undefined) {
      this.setState({ currentTab: 0 });
    }
    this.getCountriesData();
    this.getExtras();
    this.getTransactions();
    this.getRef();
  }

  // componentDidUpdate (prevProps){

  // }

  getCountriesData = () => {
    getCountryList().then(
      (resp) => {
        if (resp && resp.length > 0) {
          this.setState({
            countries: resp,
          });
        }
      },
      (err) => {}
    );
  };

  getCityData = (countryCode) => {
    getCitiesOfCountry({ countryCode }).then(
      (resp) => {
        if (resp && resp.length > 0) {
          this.setState({
            cities: resp,
          });
        }
      },
      (err) => {}
    );
  };

  getCountryByCodeData = (countryCode) => {
    const country_name = this.state.countries.filter(
      (data) => data.isoCode === countryCode
    );
    return country_name.length > 0 ? country_name[0].name : '';
  };

  getRef = () => {
    gertRewardPoints().then(
      (resp) => {
        if (resp.status == true) {
          this.setState({
            refbal: resp.balance,
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  getTransactions = () => {
    getAllTransactions().then(
      (resp) => {
        this.setState({
          transactions: resp,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  };

  getExtras = () => {
    getProfileExtras().then((resp) => {
      this.setState({
        workplaces: resp.workplaces,
        emails: resp.emails,
        mobiles: resp.mobiles,
        educations: resp.educations,
        homes: resp.homes,
        currents: resp.currents,
        friends: resp.friends,
        posts: resp.posts,
      });
    });
  };

  changeTab = (newValue) => {
    let tab_val = '';
    this.setState({
      loading: true,
    });
    const temp = newValue == 0 ? this.state.sent : this.state.received;

    this.setState({
      currentTab: newValue,
      loading: false,
      content: temp,
      filter: '',
    });
    if (newValue == 2) {
      tab_val = 'Friends';
    } else if (newValue == 3) {
      tab_val = 'Blogs';
    } else if (newValue == 4) {
      tab_val = 'Gigs';
    } else if (newValue == 5) {
      tab_val = 'Transactions';
    } else if (newValue == 1) {
      tab_val = 'Feed';
    } else {
      tab_val = 'About';
    }
    this.props.history.push(`/profile/${tab_val}`);
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
    if (file.type.split('/')[0] === 'image') {
      this.setState({ profilePic: URL.createObjectURL(file), modal: true });
    } else {
      alertBox(true, 'Please choose valid image files only');
    }
    // updateProfile({avatar: file}).then(resp=>{
    //   window.location.reload();
    // }, err => {
    //   console.log(err);
    // })
  };

  goToEdit = () => {
    this.setState({ currentTab: 0, generalEdit: true });
    setTimeout(() => {
      this.myRef.scrollIntoView();
    }, 300);
  };

  goToFeed = () => {
    this.setState({ currentTab: 1 });
    setTimeout(() => {
      this.myRef2.scrollIntoView();
    }, 300);
  };

  addNew = (name) => {
    this.setState({
      [name]: true,
    });
  };

  closeNew = (name) => {
    this.setState({
      [name]: false,
    });
  };

  editWorkPlace = (workDetail) => {
    workDetail.type = 'workplaces';
    this.setState({
      work: workDetail,
    });
  };

  editEducation = (education) => {
    education.type = 'educations';
    this.setState({
      education,
    });
  };

  editCurrant = (education) => {
    education.type = 'current_cities';
    this.setState({
      current: education,
    });
  };

  editHometown = (education) => {
    education.type = 'hometown';
    this.setState({
      home: education,
    });
  };

  handleChange = (e) => {
    const val = e.target.value;
    const { name } = e.target;
    const type = e.target.getAttribute('data-type');
    console.log('handleChange', type, name, val);
    if (name === 'country') {
      this.getCityData(val);
    }
    const temp = { ...this.state[type] };
    temp[name] = val;
    this.setState({
      [type]: temp,
    });
  };

  crop = (crop) => {
    this.setState({ crop });
  };

  removeExtras = (data) => {
    switchLoader(true, 'Sending Request... ');
    removeProfileExtras(data).then(
      (resp) => {
        this.getExtras();
        this.cleanDaa(data.type);
        setTimeout(() => {
          switchLoader();
        }, 1500);
      },
      (error) => {
        switchLoader();
      }
    );
  };

  cleanDaa = (type) => {
    if (type == 'work') {
      this.setState({
        [type]: {
          _id: null,
          type: 'workplaces',
          designation: '',
          company: '',
          city: '',
          country: '',
        },
      });
    } else if (type == 'education') {
      this.setState({
        [type]: {
          _id: null,
          type: 'educations',
          course: '',
          institution: '',
          city: '',
          country: '',
        },
      });
    } else if (type == 'current') {
      this.setState({
        [type]: {
          _id: null,
          type: 'current_cities',
          city: '',
          country: '',
        },
      });
    } else if (type == 'home') {
      this.setState({
        [type]: {
          _id: null,
          type: 'hometown',
          city: '',
          country: '',
        },
      });
    } else if (type == 'mobile') {
      this.setState({
        [type]: {
          type: 'mobiles',
          mobile: '',
        },
      });
    }
  };

  submit = (e, type) => {
    e.preventDefault();
    if (type == 'changepassword') {
      if (this.state[type].newpassword) {
        const strongRegex = new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
        );
        if (!strongRegex.test(this.state[type].newpassword)) {
          alertBox(
            true,
            'Minimum 8 Characters including, 1 uppercase, 1 lowercase, 1 numeric and 1 special charcater'
          );
        }
      } else if (this.state[type].oldpassword == this.state[type].newpassword) {
        alertBox(true, 'Old Password and new password cannot be same');
      } else {
        changePassword(
          this.state[type].oldpassword,
          this.state[type].newpassword
        )
          .then((userData) => {
            alertBox(true, userData, 'success');
            this.setState((prevState) => ({
              [type]: {
                ...prevState[type],
                oldpassword: '',
                newpassword: '',
              },
            }));
          })
          .catch((err) => {
            console.log(err);
            if (err && err.code == 'NotAuthorizedException') {
              alertBox(true, "Passwords doesn't match");
            } else {
              alertBox(true, err.message);
            }
          });
      }
    } else {
      if (type == 'general') {
        if (
          this.state[type].name == null ||
          this.state[type].name.trim() == ''
        ) {
          alertBox(true, 'Please enter a name');
          return;
        }
        if (this.state[type].bio == null || this.state[type].bio.trim() == '') {
          alertBox(true, 'Please enter a bio');
          return;
        }
      }
      updateProfileExtras(this.state[type]).then(
        (resp) => {
          if (type == 'general') {
            window.location.reload();
          } else {
            this.setState({
              [`${type}_edit`]: false,
            });
            this.getExtras();
            this.cleanDaa(type);
          }
        },
        (error) => {}
      );
    }
  };

  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = (crop) => {
    // this.makeClientCrop(crop);
  };

  getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // As Base64 string
    // const base64Image = canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          blob.name = fileName;
          resolve(blob);
        },
        'image/jpeg',
        1
      );
    });
  };

  savePic = async () => {
    if (this.imageRef && this.state.crop.width && this.state.crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        this.state.crop,
        `${Date.now()}.jpeg`
      );
      updateProfile({ avatar: croppedImageUrl }).then(
        (resp) => {
          // this.props.history.push('/profile');
          window.location.reload();
          // this.props.currentUser = localStorage.getItem('currentUser');
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };

  copyThis = (e) => {
    const input = e.target.getAttribute('data-target');
    const val = document.getElementById(input).value;
    navigator.clipboard.writeText(val);
    alertBox(true, 'URL Copied!', 'success');
  };

  render() {
    const user = this.props.currentUser;
    let gigsData = '';
    if (this.state.filter == 'purchased') {
      gigsData = (
        <GlobalPurchased
          setState={this.setStateFunc}
          latestpost={this.state.latestpost}
          {...this.props}
          refreshHighlights={this.refreshHighlights}
          purchased
          mine
        />
      );
    } else if (this.state.filter == 'requests') {
      gigsData = (
        <GlobalRequests
          setState={this.setStateFunc}
          latestpost={this.state.latestpost}
          {...this.props}
          refreshHighlights={this.refreshHighlights}
          mine
        />
      );
    } else {
      gigsData = (
        <GlobalGigs
          setState={this.setStateFunc}
          latestpost={this.state.latestpost}
          {...this.props}
          refreshHighlights={this.refreshHighlights}
          mine
        />
      );
    }

    return (
      <div className="profilePage">
        <Modal displayModal={this.state.modal} closeModal={this.selectModal}>
          <ReactCrop
            src={this.state.profilePic}
            crop={this.state.crop}
            onChange={this.crop}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
          />
          <div className="mt-3 text-end">
            <Button
              variant="secondaryBtn"
              size="compact me-2"
              onClick={this.selectModal}
            >
              Cancel
            </Button>
            <Button variant="primaryBtn" size="compact" onClick={this.savePic}>
              Save
            </Button>
          </div>
        </Modal>
        <div className="container my-wall-container ">
          <div className="row mt-2 mobileNavRow">
            <div className="col-sm empty-container-with-out-border center-column-alt mobileProfile">
              <MobileNav />
              <div className="container centerWrapper">
                <div className="row smFlex ">
                  <div className="col-md-12 p-0 col-sm-12 iborder">
                    <div className="profilePage-box cardBody d-flex align-items-start justify-content-between me-0 xsFlex">
                      <div
                        className="profile-pic"
                        style={{
                          backgroundImage: `url(' ${profilePic(
                            user.avatar,
                            user.name
                          )} ')`,
                        }}
                      >
                        <i className="fa fa-camera" onClick={this.choosePic} />
                        <input
                          type="file"
                          id="profilePic"
                          className="d-none"
                          onChange={this.updateProfilePic}
                          accept="image/*"
                        />
                      </div>
                      <div className="user-meta mainPro">
                        <Button
                          variant="editBtn"
                          size="big"
                          onClick={this.goToEdit}
                        >
                          <i
                            className="fa-solid fa-pencil"
                            aria-hidden="true"
                          />
                        </Button>
                        <p className="nameText">{user.name}</p>
                        <div className="d-flex mainPro-job">
                          {user.job ? (
                            <p className="me-4">
                              <span>Job </span>
                              {user.job}
                            </p>
                          ) : (
                            <p />
                          )}
                          {user.location && (
                            <p>
                              <span>Location </span>
                              {user.location}
                            </p>
                          )}
                        </div>
                        <div className="d-flex mainPro-text">
                          <p className="me-4">
                            <span>{this.state.posts}</span> Posts
                          </p>
                          <p className="me-4">
                            <span>{this.state.friends}</span> Friends
                          </p>
                          <p className="me-4">
                            <span>
                              <InlineBalance {...this.props} />
                            </span>{' '}
                            Wallet Balance
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="cardBody profileDescription">
                      {user.about && <div className="bio">{user.about}</div>}
                    </div>
                  </div>
                  {/* <div className="col-md-4 col-sm-12 pl-0 pr-0 mt2">
                <div className="">
                <WalletBalanceWidget variant="full"  />
                </div>
              </div> */}
                </div>
                <div className="mt-2 row sm-m-0 mt-3 mb-3">
                  <div className="col-md-12 p-0">
                    <CreatePost
                      setState={this.setStateFunc}
                      {...this.props}
                      onClick={this.goToFeed}
                    />
                  </div>
                </div>
                <div className="mt-3 row sm-m-0 iborder">
                  <TabsUI
                    tabs={[
                      'About',
                      'Feed',
                      'Friends',
                      'Blogs',
                      'Gigs',
                      'Transactions',
                    ]}
                    className="noBorder"
                    currentTab={this.state.currentTab}
                    changeTab={this.changeTab}
                    width="auto"
                  />
                  {this.state.currentTab == 0 && (
                    <div
                      className="tabPanelItem  bg-white rounded mt-2"
                      ref={(ref) => (this.myRef = ref)}
                    >
                      <div className="row m-0">
                        <div className="col-md-3 p-0">
                          <div className="profileTab-ul">
                            <ul id="switch">
                              <li
                                className={this.state.about == 0 && 'active'}
                                onClick={() => this.switch(0)}
                              >
                                General
                              </li>
                              <li
                                className={this.state.about == 8 && 'active'}
                                onClick={() => this.switch(8)}
                              >
                                Password
                              </li>
                              <li
                                className={this.state.about == 1 && 'active'}
                                onClick={() => this.switch(1)}
                              >
                                Work
                              </li>
                              <li
                                className={this.state.about == 2 && 'active'}
                                onClick={() => this.switch(2)}
                              >
                                Education
                              </li>
                              <li
                                className={this.state.about == 3 && 'active'}
                                onClick={() => this.switch(3)}
                              >
                                Current City
                              </li>
                              <li
                                className={this.state.about == 4 && 'active'}
                                onClick={() => this.switch(4)}
                              >
                                Hometown
                              </li>
                              {/* <li className={this.state.about == 5 && "active"} onClick={() => this.switch(5)} >Mobile</li> */}
                              {/* <li className={this.state.about == 6 && "active"} onClick={() => this.switch(6)} >Email</li> */}
                              <li
                                className={this.state.about == 7 && 'active'}
                                onClick={() => this.switch(7)}
                              >
                                Referral
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-md-9 p-0 ">
                          <div className="bordered tabBody">
                            {this.state.about == 0 && (
                              <div className="s0 ">
                                {this.state.generalEdit ? (
                                  <form
                                    className="addForm pt-2"
                                    onSubmit={(e) => this.submit(e, 'general')}
                                  >
                                    <div className="form-group mb-2">
                                      <input
                                        type="text"
                                        maxLength="25"
                                        required
                                        pattern="[a-zA-Z0-9-_ ]{6,25}"
                                        title="Enter Minimum 8 characters, Maximum 25 characters, Alpha-Numeric Hyphen-Underscore without special charcters"
                                        placeholder="Name"
                                        name="name"
                                        data-type="general"
                                        value={this.state.general.name}
                                        onChange={this.handleChange}
                                        className="form-control"
                                      />
                                    </div>
                                    <span
                                      style={{ color: 'red', width: '100%' }}
                                    >
                                      {this.state.errors.name}
                                    </span>
                                    {/* <div className="form-group mb-2">
                                        <input type="text" placeholder="Username"
                                        pattern="[a-zA-Z0-9-_]{8,25}" title="Enter Minimum 8 characters, Maximum 25 characters, Alpha-Numeric Hyphen-Underscore without special charcters"
                                         name="username" data-type="general" value={this.state.general.username} onChange={this.handleChange} className="form-control" />

                                      </div> 
                                      <span style={{ color: "red", width: "100%" }}>{this.state.errors["username"]}</span> */}
                                    <div className="form-group mb-2">
                                      {/* <input type="password" placeholder="Password" name="password" data-type="general" value={this.state.general.password} onChange={this.handleChange} className="form-control" /> */}
                                    </div>
                                    <div className="form-group mb-2">
                                      <input
                                        type="text"
                                        maxLength="150"
                                        placeholder="Bio"
                                        name="bio"
                                        data-type="general"
                                        value={this.state.general.bio}
                                        onChange={this.handleChange}
                                        className="form-control"
                                      />
                                    </div>
                                    <div className="form-group mb-2 text-end">
                                      <Button
                                        variant="secondaryBtn me-2"
                                        type="button"
                                        size="compact"
                                        onClick={() =>
                                          this.closeNew('generalEdit')
                                        }
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="primaryBtn"
                                        size="compact"
                                      >
                                        Save
                                      </Button>
                                    </div>
                                  </form>
                                ) : (
                                  <div>
                                    {/* <div className="srow">
                              <a href={process.env.REACT_APP_FRONTEND+"register/"+this.props.currentUser.walletDetails.username }>{process.env.REACT_APP_FRONTEND+"register/"+this.props.currentUser.walletDetails.username}</a>
                              </div> */}
                                    <div className="labelText">
                                      <label>Name:</label>{' '}
                                      <span>{user.name}</span>
                                    </div>
                                    <div className="labelText">
                                      <label>Username:</label>{' '}
                                      <span>{user.username}</span>
                                    </div>
                                    {/* <div className="srow"><label>Password</label><div className="value">Update Only</div></div> */}
                                    <div className="labelText">
                                      <label>Bio:</label>{' '}
                                      <span>{user.about}</span>
                                    </div>
                                    <div className="srow1 text-end">
                                      <Button
                                        variant="editBtn-icon"
                                        className="mt-4"
                                        onClick={this.goToEdit}
                                      >
                                        <i className="fa-solid fa-pencil" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {this.state.about == 8 && (
                              <div className="s1 text-capitalize">
                                <div className="add-new">
                                  <label>Change Password</label>
                                </div>
                                <form
                                  className="addForm"
                                  onSubmit={(e) =>
                                    this.submit(e, 'changepassword')
                                  }
                                >
                                  <div className="form-group mb-2">
                                    <input
                                      onChange={this.handleChange}
                                      type="password"
                                      required
                                      placeholder="Old Password"
                                      name="oldpassword"
                                      data-type="changepassword"
                                      value={
                                        this.state.changepassword.oldpassword
                                      }
                                      className="form-control"
                                    />
                                  </div>

                                  <div className="form-group mb-2">
                                    <input
                                      onChange={this.handleChange}
                                      type="password"
                                      required
                                      placeholder="New Password"
                                      name="newpassword"
                                      data-type="changepassword"
                                      value={
                                        this.state.changepassword.newpassword
                                      }
                                      className="form-control"
                                    />
                                  </div>

                                  <div className="form-group mb-2 text-end">
                                    <Button variant="primaryBtn" size="compact">
                                      Update Password
                                    </Button>
                                  </div>
                                </form>
                              </div>
                            )}

                            {this.state.about == 1 && (
                              <div className="s1 text-capitalize addIcon-form">
                                <div
                                  className="add-new"
                                  onClick={() => this.addNew('work_edit')}
                                >
                                  <i className="fa fa-plus-circle" />{' '}
                                  <span>Add a Workplace</span>
                                </div>
                                {this.state.work_edit && (
                                  <form
                                    className="addForm"
                                    onSubmit={(e) => this.submit(e, 'work')}
                                  >
                                    <div className="form-group mb-2">
                                      <input
                                        type="text"
                                        required
                                        pattern="[a-zA-Z0-9-_.,&()/:;\s]{4,80}"
                                        title="Enter Minimum 4 characters, Maximum 80 characters, Alpha-Numeric Hyphen-Underscore commas, periods, colons, and semicolons without special charcters"
                                        placeholder="Designation"
                                        name="designation"
                                        data-type="work"
                                        value={this.state.work.designation}
                                        onChange={this.handleChange}
                                        className="form-control"
                                      />
                                    </div>
                                    <div className="form-group mb-2">
                                      <input
                                        type="text"
                                        required
                                        pattern="[a-zA-Z0-9\s]{4,65}"
                                        title="Enter Minimum 4 characters, Maximum 65 characters, Alpha-Numeric without special charcters"
                                        placeholder="Company"
                                        name="company"
                                        data-type="work"
                                        value={this.state.work.company}
                                        onChange={this.handleChange}
                                        className="form-control"
                                      />
                                    </div>
                                    <div className="form-group mb-2">
                                      <select
                                        className="form-control"
                                        value={this.state.work.country}
                                        name="country"
                                        data-type="work"
                                        onChange={this.handleChange}
                                        placeholder="Country"
                                      >
                                        <option>Select Country</option>
                                        {this.state.countries.length > 0 &&
                                          this.state.countries.map((e, i) => (
                                            <option value={e.isoCode} key={i}>
                                              {e.name}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                    <div className="form-group mb-2">
                                      <select
                                        className="form-control"
                                        value={this.state.work.city}
                                        name="city"
                                        data-type="work"
                                        onChange={this.handleChange}
                                        placeholder="City"
                                      >
                                        <option>Select City</option>
                                        {this.state.cities.length > 0 &&
                                          this.state.cities.map((e, i) => (
                                            <option value={e.isoCode} key={i}>
                                              {e.name}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                    <div className="form-group mb-2 text-end">
                                      <Button
                                        variant="secondaryBtn me-2"
                                        type="button"
                                        size="compact"
                                        onClick={() =>
                                          this.closeNew('work_edit')
                                        }
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="primaryBtn"
                                        size="compact"
                                      >
                                        Save
                                      </Button>
                                    </div>
                                  </form>
                                )}
                                {this.state.workplaces != undefined &&
                                  this.state.workplaces.length > 0 &&
                                  this.state.workplaces.map((r, i) => (
                                    <div
                                      className="sItem text-capitalize"
                                      key={i}
                                    >
                                      <p>
                                        <strong>{r.designation}</strong>{' '}
                                        <span>at</span>{' '}
                                        <strong>{r.company}</strong>
                                      </p>
                                      <div className="text-secondary">
                                        {r.city},{' '}
                                        {r.country
                                          ? this.getCountryByCodeData(r.country)
                                          : ''}
                                      </div>
                                      {this.state.work._id == r._id && (
                                        <form
                                          className="addForm"
                                          onSubmit={(e) =>
                                            this.submit(e, 'work')
                                          }
                                        >
                                          <div className="form-group mb-2">
                                            <input
                                              type="text"
                                              required
                                              pattern="[a-zA-Z0-9-_.,&()/:;\s]{4,80}"
                                              title="Enter Minimum 4 characters, Maximum 80 characters, Alpha-Numeric Hyphen-Underscore commas, periods, colons, and semicolons without special charcters"
                                              placeholder="Designation"
                                              name="designation"
                                              data-type="work"
                                              value={
                                                this.state.work.designation
                                              }
                                              onChange={this.handleChange}
                                              className="form-control"
                                            />
                                          </div>
                                          <div className="form-group mb-2">
                                            <input
                                              type="text"
                                              required
                                              pattern="[a-zA-Z0-9\s]{4,65}"
                                              title="Enter Minimum 4 characters, Maximum 65 characters, Alpha-Numeric without special charcters"
                                              placeholder="Company"
                                              name="company"
                                              data-type="work"
                                              value={this.state.work.company}
                                              onChange={this.handleChange}
                                              className="form-control"
                                            />
                                          </div>
                                          <div className="form-group mb-2">
                                            <select
                                              className="form-control"
                                              value={this.state.work.country}
                                              name="country"
                                              data-type="work"
                                              onChange={this.handleChange}
                                              placeholder="Country"
                                            >
                                              <option>Select Country</option>
                                              {this.state.countries.length >
                                                0 &&
                                                this.state.countries.map(
                                                  (e, i) => (
                                                    <option
                                                      value={e.isoCode}
                                                      key={i}
                                                    >
                                                      {e.name}
                                                    </option>
                                                  )
                                                )}
                                            </select>
                                          </div>
                                          <div className="form-group mb-2">
                                            <select
                                              className="form-control"
                                              value={this.state.work.city}
                                              name="city"
                                              data-type="work"
                                              onChange={this.handleChange}
                                              placeholder="City"
                                            >
                                              <option>Select City</option>
                                              {this.state.cities.length > 0 &&
                                                this.state.cities.map(
                                                  (e, i) => (
                                                    <option
                                                      value={e.isoCode}
                                                      key={i}
                                                    >
                                                      {e.name}
                                                    </option>
                                                  )
                                                )}
                                            </select>
                                          </div>
                                          <div className="form-group mb-2 text-end">
                                            <Button
                                              variant="secondaryBtn me-2"
                                              type="button"
                                              size="compact"
                                              onClick={() =>
                                                this.cleanDaa('work')
                                              }
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              variant="primaryBtn"
                                              size="compact"
                                            >
                                              Save
                                            </Button>
                                          </div>
                                        </form>
                                      )}
                                      {this.state.work._id == null && (
                                        <div className="form-group mb-2 text-end">
                                          <Button
                                            variant="deleteBtn-icon me-2"
                                            type="button"
                                            size="compact"
                                            onClick={() =>
                                              this.removeExtras({
                                                id: r._id,
                                                type: 'workplaces',
                                              })
                                            }
                                          >
                                            <i className="fa-solid fa-trash-can" />
                                          </Button>
                                          <Button
                                            variant="editBtn-icon"
                                            size="compact"
                                            onClick={() =>
                                              this.editWorkPlace(r)
                                            }
                                          >
                                            <i
                                              className="fa-solid fa-pencil"
                                              aria-hidden="true"
                                            />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            )}
                            {this.state.about == 2 && (
                              <div className="s1 addIcon-form">
                                <div
                                  className="add-new"
                                  onClick={() => this.addNew('education_edit')}
                                >
                                  <i className="fa fa-plus-circle" />{' '}
                                  <span>Add an Education</span>
                                </div>
                                {this.state.education_edit && (
                                  <form
                                    className="addForm"
                                    onSubmit={(e) =>
                                      this.submit(e, 'education')
                                    }
                                  >
                                    <div className="form-group mb-2">
                                      <input
                                        type="text"
                                        required
                                        pattern="[a-zA-Z0-9-_.,&()/:;\s]{4,80}"
                                        title="Enter Minimum 4 characters, Maximum 80 characters, Alpha-Numeric Hyphen-Underscore commas, periods, colons, and semicolons without special charcters"
                                        placeholder="Course"
                                        name="course"
                                        data-type="education"
                                        value={this.state.education.course}
                                        onChange={this.handleChange}
                                        className="form-control"
                                      />
                                    </div>
                                    <div className="form-group mb-2">
                                      <input
                                        type="text"
                                        required
                                        pattern="[a-zA-Z0-9\s]{4,65}"
                                        title="Enter Minimum 4 characters, Maximum 65 characters, Alpha-Numeric without special charcters"
                                        placeholder="Institution"
                                        name="institution"
                                        data-type="education"
                                        value={this.state.education.institution}
                                        onChange={this.handleChange}
                                        className="form-control"
                                      />
                                    </div>
                                    <div className="form-group mb-2">
                                      <select
                                        className="form-control"
                                        value={this.state.education.country}
                                        name="country"
                                        data-type="education"
                                        onChange={this.handleChange}
                                        placeholder="Country"
                                      >
                                        <option>Select Country</option>
                                        {this.state.countries.length > 0 &&
                                          this.state.countries.map((e, i) => (
                                            <option value={e.isoCode} key={i}>
                                              {e.name}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                    <div className="form-group mb-2">
                                      <select
                                        className="form-control"
                                        value={this.state.education.city}
                                        name="city"
                                        data-type="education"
                                        onChange={this.handleChange}
                                        placeholder="City"
                                      >
                                        <option>Select City</option>
                                        {this.state.cities.length > 0 &&
                                          this.state.cities.map((e, i) => (
                                            <option value={e.isoCode} key={i}>
                                              {e.name}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                    <div className="form-group mb-2 text-end">
                                      <Button
                                        variant="secondaryBtn me-2"
                                        type="button"
                                        size="compact"
                                        onClick={() =>
                                          this.closeNew('education_edit')
                                        }
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="primaryBtn"
                                        size="compact"
                                      >
                                        Save
                                      </Button>
                                    </div>
                                  </form>
                                )}
                                {this.state.educations != undefined &&
                                  this.state.educations.length > 0 &&
                                  this.state.educations.map((r, i) => (
                                    <div
                                      className="sItem text-capitalize"
                                      key={i}
                                    >
                                      <p>
                                        <strong>{r.course}</strong>{' '}
                                        <span>at</span>{' '}
                                        <strong>{r.institution}</strong>
                                      </p>
                                      <div className="text-secondary">
                                        {r.city},{' '}
                                        {r.country
                                          ? this.getCountryByCodeData(r.country)
                                          : ''}
                                      </div>
                                      {this.state.education._id == r._id && (
                                        <form
                                          className="addForm"
                                          onSubmit={(e) =>
                                            this.submit(e, 'education')
                                          }
                                        >
                                          <div className="form-group mb-2">
                                            <input
                                              type="text"
                                              required
                                              pattern="[a-zA-Z0-9-_.,&()/:;\s]{4,80}"
                                              title="Enter Minimum 4 characters, Maximum 80 characters, Alpha-Numeric Hyphen-Underscore commas, periods, colons, and semicolons without special charcters"
                                              placeholder="Course"
                                              name="course"
                                              data-type="education"
                                              value={
                                                this.state.education.course
                                              }
                                              onChange={this.handleChange}
                                              className="form-control"
                                            />
                                          </div>
                                          <div className="form-group mb-2">
                                            <input
                                              type="text"
                                              required
                                              pattern="[a-zA-Z0-9\s]{4,65}"
                                              title="Enter Minimum 4 characters, Maximum 65 characters, Alpha-Numeric without special charcters"
                                              placeholder="Institution"
                                              name="institution"
                                              data-type="education"
                                              value={
                                                this.state.education.institution
                                              }
                                              onChange={this.handleChange}
                                              className="form-control"
                                            />
                                          </div>
                                          <div className="form-group mb-2">
                                            <select
                                              className="form-control"
                                              value={
                                                this.state.education.country
                                              }
                                              name="country"
                                              data-type="education"
                                              onChange={this.handleChange}
                                              placeholder="Country"
                                            >
                                              <option>Select Country</option>
                                              {this.state.countries.length >
                                                0 &&
                                                this.state.countries.map(
                                                  (e, i) => (
                                                    <option
                                                      value={e.isoCode}
                                                      key={i}
                                                    >
                                                      {e.name}
                                                    </option>
                                                  )
                                                )}
                                            </select>
                                          </div>
                                          <div className="form-group mb-2">
                                            <select
                                              className="form-control"
                                              value={this.state.education.city}
                                              name="city"
                                              data-type="education"
                                              onChange={this.handleChange}
                                              placeholder="City"
                                            >
                                              <option>Select City</option>
                                              {this.state.cities.length > 0 &&
                                                this.state.cities.map(
                                                  (e, i) => (
                                                    <option
                                                      value={e.isoCode}
                                                      key={i}
                                                    >
                                                      {e.name}
                                                    </option>
                                                  )
                                                )}
                                            </select>
                                          </div>
                                          <div className="form-group mb-2 text-end">
                                            <Button
                                              variant="secondaryBtn me-2"
                                              type="button"
                                              size="compact"
                                              onClick={() =>
                                                this.cleanDaa('education')
                                              }
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              variant="primaryBtn"
                                              size="compact"
                                            >
                                              Save
                                            </Button>
                                          </div>
                                        </form>
                                      )}
                                      {this.state.education._id == null && (
                                        <div className="form-group mb-2 text-end">
                                          <Button
                                            variant="deleteBtn-icon me-2"
                                            type="button"
                                            size="compact"
                                            onClick={() =>
                                              this.removeExtras({
                                                id: r._id,
                                                type: 'educations',
                                              })
                                            }
                                          >
                                            <i className="fa-solid fa-trash-can" />
                                          </Button>
                                          <Button
                                            variant="editBtn-icon"
                                            size="compact"
                                            onClick={() =>
                                              this.editEducation(r)
                                            }
                                          >
                                            <i
                                              className="fa-solid fa-pencil"
                                              aria-hidden="true"
                                            />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            )}
                            {this.state.about == 3 && (
                              <div className="s1 text-capitalize addIcon-form">
                                <div
                                  className="add-new"
                                  onClick={() => this.addNew('current_edit')}
                                >
                                  <i className="fa fa-plus-circle" />{' '}
                                  <span>Add a City</span>
                                </div>
                                {this.state.current_edit && (
                                  <form
                                    className="addForm"
                                    onSubmit={(e) => this.submit(e, 'current')}
                                  >
                                    <div className="form-group mb-2">
                                      <select
                                        className="form-control"
                                        value={this.state.current.country}
                                        name="country"
                                        data-type="current"
                                        onChange={this.handleChange}
                                        placeholder="Country"
                                      >
                                        <option>Select Country</option>
                                        {this.state.countries.length > 0 &&
                                          this.state.countries.map((e, i) => (
                                            <option value={e.isoCode} key={i}>
                                              {e.name}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                    <div className="form-group mb-2">
                                      <select
                                        className="form-control"
                                        value={this.state.current.city}
                                        name="city"
                                        data-type="current"
                                        onChange={this.handleChange}
                                        placeholder="City"
                                      >
                                        <option>Select City</option>
                                        {this.state.cities.length > 0 &&
                                          this.state.cities.map((e, i) => (
                                            <option value={e.isoCode} key={i}>
                                              {e.name}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                    <div className="form-group mb-2 text-end">
                                      <Button
                                        variant="secondaryBtn me-2"
                                        type="button"
                                        size="compact"
                                        onClick={() =>
                                          this.closeNew('current_edit')
                                        }
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="primaryBtn"
                                        size="compact"
                                      >
                                        Save
                                      </Button>
                                    </div>
                                  </form>
                                )}
                                {this.state.currents != undefined &&
                                  this.state.currents.length > 0 &&
                                  this.state.currents.map((r, i) => (
                                    <div className="sItem" key={i}>
                                      <div className="text-secondary">
                                        {r.city},{' '}
                                        {r.country
                                          ? this.getCountryByCodeData(r.country)
                                          : ''}
                                      </div>
                                      {this.state.current._id == r._id && (
                                        <form
                                          className="addForm"
                                          onSubmit={(e) =>
                                            this.submit(e, 'current')
                                          }
                                        >
                                          <div className="form-group mb-2">
                                            <select
                                              className="form-control"
                                              value={this.state.current.country}
                                              name="country"
                                              data-type="current"
                                              onChange={this.handleChange}
                                              placeholder="Country"
                                            >
                                              <option>Select Country</option>
                                              {this.state.countries.length >
                                                0 &&
                                                this.state.countries.map(
                                                  (e, i) => (
                                                    <option
                                                      value={e.isoCode}
                                                      key={i}
                                                    >
                                                      {e.name}
                                                    </option>
                                                  )
                                                )}
                                            </select>
                                          </div>
                                          <div className="form-group mb-2">
                                            <select
                                              className="form-control"
                                              value={this.state.current.city}
                                              name="city"
                                              data-type="current"
                                              onChange={this.handleChange}
                                              placeholder="City"
                                            >
                                              <option>Select City</option>
                                              {this.state.cities.length > 0 &&
                                                this.state.cities.map(
                                                  (e, i) => (
                                                    <option
                                                      value={e.isoCode}
                                                      key={i}
                                                    >
                                                      {e.name}
                                                    </option>
                                                  )
                                                )}
                                            </select>
                                          </div>
                                          <div className="form-group mb-2 text-end">
                                            <Button
                                              variant="secondaryBtn me-2"
                                              type="button"
                                              size="compact"
                                              onClick={() =>
                                                this.cleanDaa('current')
                                              }
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              variant="primaryBtn"
                                              size="compact"
                                            >
                                              Save
                                            </Button>
                                          </div>
                                        </form>
                                      )}
                                      {this.state.current._id == null && (
                                        <div className="form-group mb-2 text-end">
                                          <Button
                                            variant="deleteBtn-icon me-2"
                                            type="button"
                                            size="compact"
                                            onClick={() =>
                                              this.removeExtras({
                                                id: r._id,
                                                type: 'current_cities',
                                              })
                                            }
                                          >
                                            <i className="fa-solid fa-trash-can" />
                                          </Button>
                                          <Button
                                            variant="editBtn-icon"
                                            size="compact"
                                            onClick={() => this.editCurrant(r)}
                                          >
                                            <i
                                              className="fa-solid fa-pencil"
                                              aria-hidden="true"
                                            />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            )}
                            {this.state.about == 4 && (
                              <div className="s1 text-capitalize addIcon-form">
                                <div
                                  className="add-new"
                                  onClick={() => this.addNew('home_edit')}
                                >
                                  <i className="fa fa-plus-circle" />{' '}
                                  <span>Add a City</span>
                                </div>
                                {this.state.home_edit && (
                                  <form
                                    className="addForm"
                                    onSubmit={(e) => this.submit(e, 'home')}
                                  >
                                    <div className="form-group mb-2">
                                      <select
                                        className="form-control"
                                        value={this.state.home.country}
                                        name="country"
                                        data-type="home"
                                        onChange={this.handleChange}
                                        placeholder="Country"
                                      >
                                        <option>Select Country</option>
                                        {this.state.countries.length > 0 &&
                                          this.state.countries.map((e, i) => (
                                            <option value={e.isoCode} key={i}>
                                              {e.name}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                    <div className="form-group mb-2">
                                      <select
                                        className="form-control"
                                        value={this.state.home.city}
                                        name="city"
                                        data-type="home"
                                        onChange={this.handleChange}
                                        placeholder="City"
                                      >
                                        <option>Select City</option>
                                        {this.state.cities.length > 0 &&
                                          this.state.cities.map((e, i) => (
                                            <option value={e.isoCode} key={i}>
                                              {e.name}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                    <div className="form-group mb-2 text-end">
                                      <Button
                                        variant="secondaryBtn me-2"
                                        type="button"
                                        size="compact"
                                        onClick={() =>
                                          this.closeNew('home_edit')
                                        }
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="primaryBtn"
                                        size="compact"
                                      >
                                        Save
                                      </Button>
                                    </div>
                                  </form>
                                )}
                                {this.state.homes != undefined &&
                                  this.state.homes.length > 0 &&
                                  this.state.homes.map((r, i) => (
                                    <div className="sItem" key={i}>
                                      <div className="text-secondary">
                                        {r.city},{' '}
                                        {r.country
                                          ? this.getCountryByCodeData(r.country)
                                          : ''}
                                      </div>
                                      {this.state.home._id == r._id && (
                                        <form
                                          className="addForm"
                                          onSubmit={(e) =>
                                            this.submit(e, 'home')
                                          }
                                        >
                                          <div className="form-group mb-2">
                                            <select
                                              className="form-control"
                                              value={this.state.home.country}
                                              name="country"
                                              data-type="home"
                                              onChange={this.handleChange}
                                              placeholder="Country"
                                            >
                                              <option>Select Country</option>
                                              {this.state.countries.length >
                                                0 &&
                                                this.state.countries.map(
                                                  (e, i) => (
                                                    <option
                                                      value={e.isoCode}
                                                      key={i}
                                                    >
                                                      {e.name}
                                                    </option>
                                                  )
                                                )}
                                            </select>
                                          </div>
                                          <div className="form-group mb-2">
                                            <select
                                              className="form-control"
                                              value={this.state.home.city}
                                              name="city"
                                              data-type="home"
                                              onChange={this.handleChange}
                                              placeholder="City"
                                            >
                                              <option>Select City</option>
                                              {this.state.cities.length > 0 &&
                                                this.state.cities.map(
                                                  (e, i) => (
                                                    <option
                                                      value={e.isoCode}
                                                      key={i}
                                                    >
                                                      {e.name}
                                                    </option>
                                                  )
                                                )}
                                            </select>
                                          </div>
                                          <div className="form-group mb-2 text-end">
                                            <Button
                                              variant="secondaryBtn me-2"
                                              type="button"
                                              size="compact"
                                              onClick={() =>
                                                this.cleanDaa('home')
                                              }
                                            >
                                              Cancel
                                            </Button>
                                            <Button
                                              variant="primaryBtn"
                                              size="compact"
                                            >
                                              Save
                                            </Button>
                                          </div>
                                        </form>
                                      )}
                                      {this.state.home._id == null && (
                                        <div className="form-group mb-2 text-end">
                                          <Button
                                            variant="deleteBtn-icon me-2"
                                            type="button"
                                            size="compact"
                                            onClick={() =>
                                              this.removeExtras({
                                                id: r._id,
                                                type: 'hometown',
                                              })
                                            }
                                          >
                                            <i className="fa-solid fa-trash-can" />
                                          </Button>
                                          <Button
                                            variant="editBtn-icon"
                                            size="compact"
                                            onClick={() => this.editHometown(r)}
                                          >
                                            <i
                                              className="fa-solid fa-pencil"
                                              aria-hidden="true"
                                            />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            )}
                            {this.state.about == 5 && (
                              <div className="s1 text-capitalize addIcon-form">
                                <div
                                  className="add-new"
                                  onClick={() => this.addNew('mobile_edit')}
                                >
                                  <i className="fa fa-plus-circle" />{' '}
                                  <span>Add a Mobile</span>
                                </div>
                                {this.state.mobile_edit && (
                                  <form
                                    className="addForm"
                                    onSubmit={(e) => this.submit(e, 'mobile')}
                                  >
                                    <div className="form-group mb-2">
                                      <input
                                        type="tel"
                                        minLength="6"
                                        required
                                        placeholder="Mobile Number"
                                        name="mobile"
                                        data-type="mobile"
                                        value={this.state.mobile.mobile}
                                        onChange={this.handleChange}
                                        className="form-control"
                                      />
                                    </div>
                                    <div className="form-group mb-2 text-end">
                                      <Button
                                        variant="secondaryBtn me-2"
                                        type="button"
                                        size="compact"
                                        onClick={() =>
                                          this.closeNew('mobile_edit')
                                        }
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="primaryBtn"
                                        size="compact"
                                      >
                                        Save
                                      </Button>
                                    </div>
                                  </form>
                                )}
                                {this.state.mobiles != undefined &&
                                  this.state.mobiles.length > 0 &&
                                  this.state.mobiles.map((r, i) => (
                                    <div className="sItem" key={i}>
                                      <div className="text-secondary">
                                        {r.mobile}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                            {this.state.about == 6 && (
                              <div className="s1 text-capitalize addIcon-form">
                                <div
                                  className="add-new"
                                  onClick={() => this.addNew('email_edit')}
                                >
                                  <i className="fa fa-plus-circle" />{' '}
                                  <span>Add a Email</span>
                                </div>
                                {this.state.email_edit && (
                                  <form
                                    className="addForm"
                                    onSubmit={(e) => this.submit(e, 'email')}
                                  >
                                    <div className="form-group mb-2">
                                      <input
                                        type="text"
                                        placeholder="Email"
                                        required
                                        name="email"
                                        data-type="email"
                                        value={this.state.email.email}
                                        onChange={this.handleChange}
                                        className="form-control"
                                      />
                                    </div>
                                    <div className="form-group mb-2 text-end">
                                      <Button
                                        variant="secondaryBtn me-2"
                                        type="button"
                                        size="compact"
                                        onClick={() =>
                                          this.closeNew('email_edit')
                                        }
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="primaryBtn"
                                        size="compact"
                                      >
                                        Save
                                      </Button>
                                    </div>
                                  </form>
                                )}
                                {this.state.emails.length != null &&
                                  this.state.emails.length > 0 &&
                                  this.state.emails.map((r, i) => (
                                    <div className="sItem" key={i}>
                                      <p>
                                        <div className="text-secondary">
                                          {r.email}
                                        </div>
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            )}
                            {this.state.about == 7 && (
                              <div className="s1 addIcon-form">
                                <div className="col-md-8 mx-auto referralIcon">
                                  <i className="fa-solid fa-gift" />
                                  <p className="text-ref">
                                    Referral Point Balance:
                                    <span className="text-big text-success points refText">
                                      {this.state.refbal}
                                    </span>
                                  </p>

                                  <div className="d-flex fileButton">
                                    <a
                                      target="_BLANK"
                                      className="copyIn"
                                      href={`${process.env.REACT_APP_FRONTEND}register/${this.props.currentUser.walletDetails.username}`}
                                      rel="noreferrer"
                                    >
                                      <i className="fa fa-link" />{' '}
                                      {`${process.env.REACT_APP_FRONTEND}register/${this.props.currentUser.walletDetails.username}`}
                                    </a>
                                    <input
                                      type="hidden"
                                      id="url"
                                      value={`${process.env.REACT_APP_FRONTEND}register/${this.props.currentUser.walletDetails.username}`}
                                    />
                                    <button
                                      className="primaryBtn"
                                      onClick={(e) => this.copyThis(e)}
                                      data-target="url"
                                    >
                                      Copy
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {this.state.currentTab == 1 && (
                    <div
                      className="tabPanelItem"
                      ref={(ref) => (this.myRef2 = ref)}
                    >
                      <div className="feedFilters">
                        <h3 className="subtitle">My Feed</h3>
                        <ul className="feedFilters_tab">
                          <li>
                            <button
                              className={`btn ${
                                this.state.filter == ''
                                  ? 'btn-main'
                                  : 'btn-outline'
                              }`}
                              onClick={(e) => this.filterPosts('', 'post')}
                            >
                              All
                            </button>
                          </li>
                          <li>
                            <button
                              className={`btn ${
                                this.state.filter == 'saved'
                                  ? 'btn-main'
                                  : 'btn-outline'
                              }`}
                              onClick={(e) => this.filterPosts('saved', 'post')}
                            >
                              Saved
                            </button>
                          </li>
                          <li>
                            <button
                              className={`btn ${
                                this.state.filter == 'hidden'
                                  ? 'btn-main'
                                  : 'btn-outline'
                              }`}
                              onClick={(e) =>
                                this.filterPosts('hidden', 'post')
                              }
                            >
                              Hidden
                            </button>
                          </li>
                          {this.props.currentUser.twitterID != null &&
                            this.props.currentUser.twitterID > 0 && (
                              <li>
                                <button
                                  className={`btn ${
                                    this.state.filter == 'twitter'
                                      ? 'btn-main'
                                      : 'btn-outline'
                                  }`}
                                  onClick={(e) => this.filterPosts('twitter')}
                                >
                                  Posted on Twitter
                                </button>
                              </li>
                            )}
                          {/* <li><button className={"btn "+(this.state.filter == 'highlighted' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('highlighted')}>Highlighted</button></li> */}
                        </ul>
                      </div>
                      {this.state.filter == '' ? (
                        <Posts
                          setState={this.setStateFunc}
                          latestpost={this.state.latestpost}
                          {...this.props}
                          filter={this.state.filter}
                          refreshHighlights={this.refreshHighlights}
                          mine
                          history={this.props.history}
                        />
                      ) : (
                        <FilteredPosts
                          setState={this.setStateFunc}
                          latestpost={this.state.latestpost}
                          {...this.props}
                          filter={this.state.filter}
                          currentTab={this.state.currentTab}
                          history={this.props.history}
                        />
                      )}
                    </div>
                  )}
                  {this.state.currentTab == 2 && (
                    <div className="tabPanelItem proTab-item">
                      <div className="row">
                        <div className="col-md-5">
                          <div className="">
                            {!this.state.refreshing && (
                              <MyFriends
                                {...this.props}
                                refresh={this.refresh}
                              />
                            )}
                          </div>
                        </div>
                        <div className="col-md-7">
                          {!this.state.refreshing && (
                            <RecommendedFriends
                              {...this.props}
                              refresh={this.refresh}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {this.state.currentTab == 3 && (
                    <div className="tabPanelItem">
                      <div className="feedFilters">
                        <h3 className="subtitle">My Blogs</h3>
                        <ul className="feedFilters_tab">
                          <li>
                            <button
                              className={`btn ${
                                this.state.filter == ''
                                  ? 'btn-main'
                                  : 'btn-outline'
                              }`}
                              onClick={(e) => this.filterPosts('')}
                            >
                              All
                            </button>
                          </li>
                          <li>
                            <button
                              className={`btn ${
                                this.state.filter == 'saved'
                                  ? 'btn-main'
                                  : 'btn-outline'
                              }`}
                              onClick={(e) => this.filterPosts('saved')}
                            >
                              Wishlist
                            </button>
                          </li>
                          <li>
                            <button
                              className={`btn ${
                                this.state.filter == 'draft'
                                  ? 'btn-main'
                                  : 'btn-outline'
                              }`}
                              onClick={(e) => this.filterPosts('draft')}
                            >
                              Draft
                            </button>
                          </li>
                          <li>
                            <button
                              className={`btn ${
                                this.state.filter == 'paid'
                                  ? 'btn-main'
                                  : 'btn-outline'
                              }`}
                              onClick={(e) => this.filterPosts('paid')}
                            >
                              Paid
                            </button>
                          </li>
                          <li className="">
                            <button
                              className={`btn ${
                                this.state.filter == 'purchased'
                                  ? 'btn-main'
                                  : 'btn-outline'
                              }`}
                              onClick={(e) => this.filterPosts('purchased')}
                            >
                              Purchased
                            </button>
                          </li>
                          {/* <li><button className={"btn "+(this.state.filter == 'highlighted' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('highlighted')}>Highlighted</button></li> */}
                        </ul>
                      </div>
                      {this.state.filter == '' ? (
                        <BlogPosts
                          setState={this.setStateFunc}
                          latestpost={this.state.latestpost}
                          {...this.props}
                          refreshHighlights={this.refreshHighlights}
                          type="blogs"
                          isFromProfile="true"
                          mine
                        />
                      ) : (
                        <FilteredBlogPosts
                          setState={this.setStateFunc}
                          latestpost={this.state.latestpost}
                          {...this.props}
                          filter={this.state.filter}
                          mine
                          from="my_profile"
                        />
                      )}
                    </div>
                  )}
                  {this.state.currentTab == 4 && (
                    <div className="tabPanelItem">
                      <div className="feedFilters">
                        <h3 className="subtitle">My Gigs</h3>
                        <ul className="feedFilters_tab">
                          <li>
                            <button
                              className={`btn ${
                                this.state.filter == '' ||
                                this.state.filter == 'gigs'
                                  ? 'btn-main'
                                  : 'btn-outline'
                              }`}
                              onClick={(e) => this.filterPosts('gigs')}
                            >
                              Find Jobs
                            </button>
                          </li>
                          {/* <li><button className={"btn "+(this.state.filter == 'saved' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('saved')}>Saved</button></li> */}

                          <li>
                            <button
                              className={`btn ${
                                this.state.filter == 'requests'
                                  ? 'btn-main'
                                  : 'btn-outline'
                              }`}
                              onClick={(e) => this.filterPosts('requests')}
                            >
                              Hire Talents
                            </button>
                          </li>
                          {/* <li><button className={"btn " + (this.state.filter == 'requests' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.props.history.push("/passionomy/dashboard/requests")}>Hire Talents</button></li> */}

                          {/* <li className=""><button className={"btn " + (this.state.filter == 'saved' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.props.history.push("/passionomy/dashboard/purchased")}>Purchased Gigs</button></li> */}
                          <li className="">
                            <button
                              className={`btn ${
                                this.state.filter == 'purchased'
                                  ? 'btn-main'
                                  : 'btn-outline'
                              }`}
                              onClick={(e) => this.filterPosts('purchased')}
                            >
                              Purchased Gigs
                            </button>
                          </li>

                          {/* <li><button className={"btn "+(this.state.filter == 'highlighted' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('highlighted')}>Highlighted</button></li> */}
                        </ul>
                      </div>

                      {gigsData}
                    </div>
                  )}
                  {this.state.currentTab == 5 && (
                    <div className="tabPanelItem">
                      <div className="feedFilters">
                        <h3 className="subtitle">Transactions</h3>
                        <ul className="feedFilters_tab">
                          <li>
                            <button
                              className={`btn ${
                                this.state.filter == ''
                                  ? 'btn-main'
                                  : 'btn-outline'
                              }`}
                              onClick={(e) => this.filterPosts('')}
                            >
                              All
                            </button>
                          </li>
                          <li>
                            <button
                              className={`btn ${
                                this.state.filter == 'paid'
                                  ? 'btn-main'
                                  : 'btn-outline'
                              }`}
                              onClick={(e) => this.filterPosts('paid')}
                            >
                              Paid
                            </button>
                          </li>
                          <li>
                            <button
                              className={`btn ${
                                this.state.filter == 'earnings'
                                  ? 'btn-main'
                                  : 'btn-outline'
                              }`}
                              onClick={(e) => this.filterPosts('earnings')}
                            >
                              Earnings
                            </button>
                          </li>
                        </ul>
                      </div>
                      {this.state.transactions.length > 0 &&
                        this.state.transactions.map((t, i) => {
                          const me =
                            this.props.currentUser._id == t.sender ? 1 : 0;
                          const u1 = t.senderinfo;

                          return this.state.filter == '' ||
                            (this.state.filter == 'paid' && me == 1) ||
                            (this.state.filter == 'earnings' && me == 0) ? (
                            <ul className="list-group w-100" key={i}>
                              <li className="list-group-item">
                                <div className="d-flex">
                                  <div className="media-left">
                                    <A href={`/u/${u1._id}`}>
                                      <img
                                        className="media-object circle widgetAvatar"
                                        src={profilePic(u1.avatar, u1.name)}
                                        alt="..."
                                      />
                                    </A>
                                  </div>
                                  <div className="media-body">
                                    <p className="media-subheading">
                                      {me == 1 ? (
                                        t.type == 'Tips' ? (
                                          <span>
                                            You sent a tip of {t.currency}{' '}
                                            {t.amount} for the{' '}
                                            {t.type == 'Gig Purchase'
                                              ? 'gig'
                                              : 'blog'}{' '}
                                          </span>
                                        ) : (
                                          <span>
                                            You paid {t.currency} {t.amount} for
                                            purchasing the{' '}
                                            {t.type == 'Gig Purchase'
                                              ? 'gig'
                                              : 'blog'}{' '}
                                          </span>
                                        )
                                      ) : t.type == 'Tips' ? (
                                        <span>
                                          <A
                                            className="text-main"
                                            href={`/u/${u1._id}`}
                                          >
                                            {u1.name} &nbsp;
                                          </A>{' '}
                                          <span>
                                            {' '}
                                            sent you a tip of {t.currency}{' '}
                                            {t.amount} for the{' '}
                                            {t.type == 'Gig Purchase'
                                              ? 'gig'
                                              : 'blog'}
                                          </span>
                                        </span>
                                      ) : (
                                        <span>
                                          <A
                                            className="text-main"
                                            href={`/u/${u1._id}`}
                                          >
                                            {u1.name} &nbsp;
                                          </A>{' '}
                                          <span>
                                            {' '}
                                            paid you {t.currency} {t.amount} for
                                            purchasing the{' '}
                                            {t.type == 'Gig Purchase'
                                              ? 'gig'
                                              : 'blog'}{' '}
                                          </span>
                                        </span>
                                      )}
                                    </p>
                                    <p className="media-heading">
                                      <A href={`/blog/${t.postinfo._id}`}>
                                        {t.postinfo.subject}
                                      </A>
                                    </p>
                                  </div>
                                  {/* <div className="media-right">
                          {
                              <Button variant="primary" size="compact" layout="dropdown" dropdownOptions={["Unfriend"]} onClick={() => this.cancelRequest(user._id, i)}>Friends</Button>
                          }
                      </div> */}
                                </div>
                              </li>
                            </ul>
                          ) : null;
                        })}
                      {this.state.transactions.length == 0 ? (
                        <p>No Transactions Found</p>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyProfile;
