import React from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { switchLoader } from '../../commonRedux';
import Button from '../../components/Button';
import GlobalFriends from '../../components/Friends/GlobalFriends';
import Modal from '../../components/Popup';
import GlobalGigs from '../../components/Post/Gigs';
import ProfileBlogs from '../../components/Post/ProfileBlogs';
import ProfilePosts from '../../components/Post/ProfilePosts';
import TabsUI from '../../components/Tabs/index';
import { profilePic } from '../../globalFunctions';
import { connectSocket, friendRequest } from '../../hooks/socket';
import {
  acceptRequest,
  cancelRequest,
  followUser,
} from '../../http/http-calls';
import {
  getCurrentChat,
  setMessageNotificationsViewed,
} from '../../http/message-calls';
import {
  checkFriendRequest,
  getGlobalProfile,
  getGlobalProfileExtras,
  updateProfile,
  updateProfileExtras,
} from '../../http/profile-calls';
import './styles.scss';

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      friends: 0,
      posts: 0,
      currentTab: 0,
      latestpost: {},
      request: '',
      cid: 0,
      followerid: 0,
      filter: '',
      about: 0,
      generalEdit: false,
      profilePic: '',
      refreshing: false,
      modal: false,
      messages: [],
      user: {},
      general: {
        type: 'general',
        name: '',
        username: '',
        bio: '',
        password: '',
      },
      work_edit: false,
      workplaces: [],
      work: {
        type: 'workplaces',
        designation: '',
        company: '',
        city: '',
        country: '',
      },
      education_edit: false,
      educations: [],
      education: {
        type: 'educations',
        course: '',
        institution: '',
        city: '',
        country: '',
      },
      current_edit: false,
      currents: [],
      current: {
        type: 'current_cities',
        city: '',
        country: '',
      },
      home_edit: false,
      homes: [],
      home: {
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
    };
    this.myRef = React.createRef();
    this.myRef2 = React.createRef();
  }

  selectModal = (info) => {
    this.setState({ modal: !this.state.modal }); // true/false toggle
  };

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

  goToMessage = (r) => {
    setMessageNotificationsViewed();
    this.props.openChat(r);
  };

  getChat = () => {
    getCurrentChat({ id: this.state.id }).then(
      (resp) => {
        this.goToMessage(resp);
      },
      (error) => {
        console.log(error);
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
    if (this.props.match.params.id == this.props.currentUser._id) {
      window.location.href = '/profile';
    } else {
      this.checkRequest();
      this.getProfile();
      this.getExtras();
    }
    if (this.props.currentUser != undefined) {
      connectSocket(this.props.currentUser._id);
    }
    friendRequest((request) => {
      if (window.location.href.indexOf('/u') != -1) {
        window.location.reload();
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps != undefined &&
      this.props.match.params.id != undefined &&
      prevProps.match.params.id != this.props.match.params.id
    ) {
      // window.location.reload();
      if (this.props.match.params.id == this.props.currentUser._id) {
        window.location.href = '/profile';
      } else {
        window.location.href = `/u/${this.props.match.params.id}`;
        // this.checkRequest();
        // this.getProfile();
        // this.getExtras();
      }
    }
  }

  checkRequest = () => {
    checkFriendRequest({ id: this.state.id }, true).then(
      async (resp) => {
        this.setState({
          request: resp.request,
          cid: resp._id,
          followerid: resp.followerid,
        });
      },
      (error) => {
        this.setState({
          request: '',
          cid: 0,
          followerid: 0,
        });
      }
    );
  };

  addFriend = (id, index) => {
    switchLoader(true, 'Sending Request... ');
    followUser({ followerid: id }, true).then(
      async (resp) => {
        switchLoader();
        this.checkRequest();
      },
      (error) => {
        switchLoader();
        this.checkRequest();
      }
    );
  };

  accept = (id, item) => {
    switchLoader(true, 'Sending Request... ');
    if (item == 0) {
      acceptRequest({ id: this.state.cid }, true).then(
        async (resp) => {
          setTimeout(() => {
            switchLoader();
            this.checkRequest();
            this.getProfile();
            this.getExtras();
          }, 1000);
        },
        (error) => {
          switchLoader();
          this.checkRequest();
        }
      );
    } else {
      cancelRequest({ id }, true).then(
        async (resp) => {
          switchLoader();
          this.checkRequest();
        },
        (error) => {
          switchLoader();
          this.checkRequest();
        }
      );
    }
  };

  cancelRequest = (id, item) => {
    switchLoader(true, 'Cancelling...! ');
    cancelRequest({ id }, true).then(
      async (resp) => {
        switchLoader();
        this.checkRequest();
      },
      (error) => {
        switchLoader();
        this.checkRequest();
      }
    );
  };

  getProfile = () => {
    getGlobalProfile({ id: this.state.id }).then((resp) => {
      this.setState({
        user: resp,
      });
    });
  };

  getExtras = () => {
    getGlobalProfileExtras({ id: this.state.id }).then((resp) => {
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
    this.setState({ profilePic: URL.createObjectURL(file), modal: true });
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

  handleChange = (e) => {
    const val = e.target.value;
    const { name } = e.target;
    const type = e.target.getAttribute('data-type');
    const temp = { ...this.state[type] };
    temp[name] = val;
    this.setState({
      [type]: temp,
    });
  };

  crop = (crop) => {
    this.setState({ crop });
  };

  submit = (e, type) => {
    e.preventDefault();
    updateProfileExtras(this.state[type]).then(
      (resp) => {
        if (type == 'general') {
          window.location.reload();
        } else {
          this.setState({ [`${type}_edit`]: false });
          this.getExtras();
        }
      },
      (error) => {}
    );
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
          window.location.reload();
        },
        (err) => {
          console.log(err);
        }
      );
    }
  };

  render() {
    const { user } = this.state;
    const { cid } = this.state;
    const { request } = this.state;
    const { followerid } = this.state;
    const { id } = this.state;

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
          <div className="d-flex align-items-center justify-content-center">
            <Button variant="primary" size="compact m-2" onClick={this.savePic}>
              Save
            </Button>
            <Button
              variant="secondary"
              size="compact m-2"
              onClick={this.selectModal}
            >
              Cancel
            </Button>
          </div>
        </Modal>
        <div className="container my-wall-container">
          <div className="row mt-2">
            <div className="col-sm empty-container-with-out-border center-column-alt">
              <div className="container">
                <div className="row smFlex">
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
                      />
                      <div className="user-meta editPro">
                        <div className="d-flex justify-content-between align-items-center">
                          <p className="nameText">
                            {user.name == undefined || user.name == ''
                              ? user.username
                              : user.name}
                          </p>
                          {request == '' && (
                            <Button
                              variant="removeBtn_border addWhites"
                              onClick={() => this.addFriend(id)}
                            >
                              <i className="fa fa-plus" /> Add
                            </Button>
                          )}
                          {request == 'accepted' && (
                            <Button
                              variant="secondaryBtn"
                              onClick={this.getChat}
                            >
                              Chat
                            </Button>
                          )}
                          {request == 'pending' && followerid == id && (
                            <Button
                              variant="dropdownBtn"
                              layout="dropdown"
                              dropdownOptions={['Cancel']}
                              onClick={(n) => this.cancelRequest(id, n)}
                            >
                              Pending
                            </Button>
                          )}
                          {request == 'pending' && followerid != id && (
                            <Button
                              variant="dropdownBtn"
                              layout="dropdown"
                              dropdownOptions={['Accept', 'Reject']}
                              onClick={(n) => this.accept(id, n)}
                            >
                              Respond
                            </Button>
                          )}
                        </div>
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
                          <p>
                            <span>{this.state.friends}</span> Friends
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="cardBody profileDescription">
                      {user.about && <div className="bio">{user.about}</div>}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 mt-3 mb-3 cardBody">
                    <div className="overviewText">
                      <h3>Overview</h3>
                      <ul className="about">
                        {this.state.workplaces[0] && (
                          <li>
                            <i className="fa fa-suitcase" />
                            <span>
                              {this.state.workplaces[0].designation} at{' '}
                            </span>
                            <strong>{this.state.workplaces[0].company}</strong>
                          </li>
                        )}
                        {this.state.educations[0] && (
                          <li>
                            <i className="fa fa-graduation-cap" />
                            <span>{this.state.educations[0].course} at </span>
                            <strong>
                              {this.state.educations[0].institution}
                            </strong>
                          </li>
                        )}
                        {this.state.currents[0] && (
                          <li>
                            <i className="fa fa-home" />
                            <span>{this.state.currents[0].city}, </span>
                            <strong>{this.state.currents[0].country}</strong>
                          </li>
                        )}
                        {this.state.homes[0] && (
                          <li>
                            <i className="fa fa-map-marker" />
                            <span>{this.state.homes[0].city}, </span>
                            <strong>{this.state.homes[0].country}</strong>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                {/* <div className="mt-2 row">
                    <div className="col-md-12 p-0">
                      <Highlights {...this.props} seeAll={(e) => this.filterPosts('highlighted')} />
                    </div>
                  </div> */}
                <div className="row sm-m-0 ">
                  <TabsUI
                    tabs={['Feed', 'Friends', 'Blogs', 'Gigs']}
                    className="noBorder"
                    currentTab={this.state.currentTab}
                    changeTab={this.changeTab}
                    width="auto"
                  />
                  {this.state.currentTab == 0 && (
                    <div
                      className="tabPanelItem"
                      ref={(ref) => (this.myRef2 = ref)}
                    >
                      <ProfilePosts
                        query=""
                        id={id}
                        setState={this.setStateFunc}
                        latestpost={this.state.latestpost}
                        {...this.props}
                        refreshHighlights={this.refreshHighlights}
                        mine
                      />
                    </div>
                  )}
                  {this.state.currentTab == 1 && (
                    <div className="tabPanelItem">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="">
                            {!this.state.refreshing && (
                              <GlobalFriends
                                {...this.props}
                                refresh={this.refresh}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {this.state.currentTab == 2 && (
                    <div className="tabPanelItem">
                      <ProfileBlogs
                        query=""
                        id={id}
                        setState={this.setStateFunc}
                        latestpost={this.state.latestpost}
                        {...this.props}
                        refreshHighlights={this.refreshHighlights}
                        type="blogs"
                        mine
                      />
                    </div>
                  )}
                  {this.state.currentTab == 3 && (
                    <div className="tabPanelItem">
                      <GlobalGigs
                        query=""
                        id={id}
                        setState={this.setStateFunc}
                        latestpost={this.state.latestpost}
                        {...this.props}
                        refreshHighlights={this.refreshHighlights}
                        mine
                      />
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
