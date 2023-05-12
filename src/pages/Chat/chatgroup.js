import React from 'react';
import 'react-image-crop/dist/ReactCrop.css';

import Modal from '../../components/Popup';

import './styles.scss';

class ChatGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      friends: 0,
      refbal: 0,
      posts: 0,
      currentTab: 0,
      latestpost: {},
      filter: '',
      about: 0,
      generalEdit: false,
      profilePic: '',
      refreshing: false,
      modal: false,
    };
    this.myRef = React.createRef();
    this.myRef2 = React.createRef();
  }

  openChat = () => {
    this.setState({ modal: !this.state.modal }); // true/false toggle
  };

  render() {
    const user = this.props.currentUser;
    return (
      <div className="chatIndex">
        <div className="container-fluid chatContainer">
          <div className="row">
            <div className="col-lg-4 col-md-6">
              <div className="chatProfile">
                <div className="chatProfile_top">
                  <div className="chatProfile_head">
                    <a href="#" className="left">
                      <img
                        src={require('../../assets/images/chat/chat-main-profile-1.png')}
                      />
                      <div className="chatProfile_name">
                        <h5 className="pt-2">Rock Band</h5>
                      </div>
                    </a>
                    <div className="right">
                      <div className="right_count">
                        <img
                          src={require('../../assets/images/chat/chat_bubble_outline.svg')}
                        />
                        <span>13</span>
                      </div>
                      <div className="dropdown">
                        <i
                          className="fa fa-ellipsis-v"
                          aria-hidden="true"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        />
                        <div
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a className="dropdown-item" href="#">
                            - View Profile
                          </a>
                          <a className="dropdown-item" href="#">
                            - New group
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="chatProfile_search">
                    <form>
                      <div className="input-group mb-3">
                        <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">
                            <i className="fa fa-search" aria-hidden="true" />
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search"
                          aria-label="Username"
                          aria-describedby="basic-addon1"
                        />
                      </div>
                    </form>
                  </div>
                </div>
                <div className="chatProfile_pro">
                  <div className="chatProfile_pro_list d-flex justify-content-between">
                    <div className="left">
                      <div className="left_count">
                        <img
                          src={require('../../assets/images/chat/chat-main-profile-11.png')}
                        />
                        <span>10</span>
                      </div>
                      <div className="chatProfile_name">
                        <h5 className="pt-1">Rock Band</h5>
                        <span>Thanks for you...</span>
                      </div>
                    </div>
                    <div className="right">
                      <p>Aug 11, 2022</p>
                      <div className="dropdown">
                        <i
                          className="fa fa-ellipsis-v"
                          aria-hidden="true"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        />
                        <div
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a className="dropdown-item" href="#">
                            Pin Chat
                          </a>
                          <a className="dropdown-item redTxt" href="#">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="chatProfile_pro_list d-flex justify-content-between">
                    <div className="left">
                      <div className="left_count">
                        <img
                          src={require('../../assets/images/chat/chat-main-profile-3.png')}
                        />
                        {/* <span>5</span> */}
                      </div>
                      <div className="chatProfile_name">
                        <h5 className="pt-1">Steffy Ken</h5>
                        <span>Ok</span>
                      </div>
                    </div>
                    <div className="right">
                      <p>Aug 10, 2022</p>
                      <div className="dropdown">
                        <i
                          className="fa fa-ellipsis-v"
                          aria-hidden="true"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        />
                        <div
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a className="dropdown-item" href="#">
                            Pin Chat
                          </a>
                          <a className="dropdown-item redTxt" href="#">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="chatProfile_pro_list d-flex justify-content-between">
                    <div className="left">
                      <div className="left_count">
                        <img
                          src={require('../../assets/images/chat/chat-main-profile-4.png')}
                        />
                        {/* <span>5</span> */}
                      </div>
                      <div className="chatProfile_name">
                        <h5 className="pt-1">Stay Benson</h5>
                        <span>Good Morning</span>
                      </div>
                    </div>
                    <div className="right">
                      <p>2 min ago</p>
                      <div className="dropdown">
                        <i
                          className="fa fa-ellipsis-v"
                          aria-hidden="true"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        />
                        <div
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a className="dropdown-item" href="#">
                            Pin Chat
                          </a>
                          <a className="dropdown-item redTxt" href="#">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="chatProfile_pro_list d-flex justify-content-between">
                    <div className="left">
                      <div className="left_count">
                        <img
                          src={require('../../assets/images/chat/chat-main-profile-5.png')}
                        />
                        <span>1</span>
                      </div>
                      <div className="chatProfile_name">
                        <h5 className="pt-1">Rock Band</h5>
                        <span>Dear welcome..</span>
                      </div>
                    </div>
                    <div className="right">
                      <p>Aug 03, 2022</p>
                      <div className="dropdown">
                        <i
                          className="fa fa-ellipsis-v"
                          aria-hidden="true"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        />
                        <div
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a className="dropdown-item" href="#">
                            Pin Chat
                          </a>
                          <a className="dropdown-item redTxt" href="#">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="chatProfile_pro_list d-flex justify-content-between">
                    <div className="left">
                      <div className="left_count">
                        <img
                          src={require('../../assets/images/chat/chat-main-profile-6.png')}
                        />
                        {/* <span>5</span> */}
                      </div>
                      <div className="chatProfile_name">
                        <h5 className="pt-1">Verny Sans</h5>
                        <span>Most Dan...</span>
                      </div>
                    </div>
                    <div className="right">
                      <p>Aug 15, 2022</p>
                      <div className="dropdown">
                        <i
                          className="fa fa-ellipsis-v"
                          aria-hidden="true"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        />
                        <div
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a className="dropdown-item" href="#">
                            Pin Chat
                          </a>
                          <a className="dropdown-item redTxt" href="#">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="chatProfile_pro_list d-flex justify-content-between">
                    <div className="left">
                      <div className="left_count">
                        <img
                          src={require('../../assets/images/chat/chat-main-profile-7.png')}
                        />
                        <span>1</span>
                      </div>
                      <div className="chatProfile_name">
                        <h5 className="pt-1">Devit Cam</h5>
                        <span>Sure will soon</span>
                      </div>
                    </div>
                    <div className="right">
                      <p>Yesterday</p>
                      <div className="dropdown">
                        <i
                          className="fa fa-ellipsis-v"
                          aria-hidden="true"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        />
                        <div
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a className="dropdown-item" href="#">
                            Pin Chat
                          </a>
                          <a className="dropdown-item redTxt" href="#">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="chatProfile_pro_list d-flex justify-content-between">
                    <div className="left">
                      <div className="left_count">
                        <img
                          src={require('../../assets/images/chat/chat-main-profile-8.png')}
                        />
                        <span>1</span>
                      </div>
                      <div className="chatProfile_name">
                        <h5 className="pt-1">Jerome Ant</h5>
                        <span>Very urjent...</span>
                      </div>
                    </div>
                    <div className="right">
                      <p>10 min ago</p>
                      <div className="dropdown">
                        <i
                          className="fa fa-ellipsis-v"
                          aria-hidden="true"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        />
                        <div
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a className="dropdown-item" href="#">
                            Pin Chat
                          </a>
                          <a className="dropdown-item redTxt" href="#">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="chatProfile_pro_list d-flex justify-content-between">
                    <div className="left">
                      <div className="left_count">
                        <img
                          src={require('../../assets/images/chat/chat-main-profile-9.png')}
                        />
                        {/* <span>5</span> */}
                      </div>
                      <div className="chatProfile_name">
                        <h5 className="pt-1">Kennady</h5>
                        <span>For your Feat</span>
                      </div>
                    </div>
                    <div className="right">
                      <p>Aug 18, 2022</p>
                      <div className="dropdown">
                        <i
                          className="fa fa-ellipsis-v"
                          aria-hidden="true"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        />
                        <div
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a className="dropdown-item" href="#">
                            Pin Chat
                          </a>
                          <a className="dropdown-item redTxt" href="#">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="chatProfile_pro_list d-flex justify-content-between">
                    <div className="left">
                      <div className="left_count">
                        <img
                          src={require('../../assets/images/chat/chat-main-profile-1.png')}
                        />
                        {/* <span>5</span> */}
                      </div>
                      <div className="chatProfile_name">
                        <h5 className="pt-1">Analisisciclico</h5>
                        <span>Thanks for you...</span>
                      </div>
                    </div>
                    <div className="right">
                      <p>Aug 11, 2022</p>
                      <div className="dropdown">
                        <i
                          className="fa fa-ellipsis-v"
                          aria-hidden="true"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        />
                        <div
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a className="dropdown-item" href="#">
                            Pin Chat
                          </a>
                          <a className="dropdown-item redTxt" href="#">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8 col-md-6">
              <div className="chatBox">
                <div className="chatBox_head">
                  <div className="left">
                    <img
                      src={require('../../assets/images/chat/chat-main-profile-11.png')}
                    />
                    <div className="chatBox_name">
                      <h5 className="pt-2">Rock Band</h5>
                      <div className="chatBox_time">
                        Verny Sans, Steffy Ken, Jhon Wilson, Devit Cam, Kennady
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <div className="dropdown">
                      <i
                        className="fa fa-ellipsis-v"
                        aria-hidden="true"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      />
                      <div
                        className="dropdown-menu dropdown-menu-right"
                        aria-labelledby="dropdownMenuButton"
                      >
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={(e) => this.openChat()}
                        >
                          - Group Info
                        </a>
                        <a className="dropdown-item" href="#">
                          - Clear Chat
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="chatBox_body">
                  <div className="chatBox_cale">
                    <div className="chatBox_date mt-3">Today</div>
                  </div>
                  <div className="chatBox_left">
                    <div className="d-flex justify-content-between">
                      <div className="groupPro_name">SGR</div>
                      <div className="dropdown pr-2">
                        <i
                          className="fa fa-ellipsis-v"
                          aria-hidden="true"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        />
                        <div
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a className="dropdown-item" href="#">
                            Reply
                          </a>
                          <a className="dropdown-item redTxt" href="#">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                    <p>
                      There are many variations of passages of Lorem Ipsum
                      available but the majority have suffered alteration.
                    </p>
                    <span className="chatBox_dtime">6:03 AM</span>
                  </div>
                  <div className="chatBox_left">
                    <div className="d-flex justify-content-between">
                      <div className="groupPro_name">Verny Sans</div>
                      <div className="dropdown pr-2">
                        <i
                          className="fa fa-ellipsis-v"
                          aria-hidden="true"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        />
                        <div
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a className="dropdown-item" href="#">
                            Reply
                          </a>
                          <a className="dropdown-item redTxt" href="#">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                    <p>
                      It is a long established fact that a reader will be
                      distracted.
                    </p>
                    <span className="chatBox_dtime">6:06 AM</span>
                  </div>
                  <div className="chatBox_left">
                    <div className="d-flex justify-content-between">
                      <div className="groupPro_name">Steffy Ken</div>
                      <div className="dropdown pr-2">
                        <i
                          className="fa fa-ellipsis-v"
                          aria-hidden="true"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        />
                        <div
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a className="dropdown-item" href="#">
                            Reply
                          </a>
                          <a className="dropdown-item redTxt" href="#">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                    <p>
                      Contrary to popular belief, Lorem Ipsum is not simply
                      random text. It has roots.
                    </p>
                    <span className="chatBox_dtime">6:10 AM</span>
                  </div>
                  <div className="chatBox_right">
                    <div className="d-flex justify-content-between">
                      <div className="groupPro_name">You</div>
                      <div className="dropdown pr-2">
                        <i
                          className="fa fa-ellipsis-v"
                          aria-hidden="true"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        />
                        <div
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a className="dropdown-item" href="#">
                            Reply
                          </a>
                          <a className="dropdown-item redTxt" href="#">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                    <p>
                      Simply dummy text of the printing and typesetting
                      industry.
                    </p>
                    <span className="chatBox_dtime">6:13 AM</span>
                  </div>
                  <div className="chatBox_left">
                    <div className="d-flex justify-content-between">
                      <div className="groupPro_name">Devit Cam</div>
                      <div className="dropdown pr-2">
                        <i
                          className="fa fa-ellipsis-v"
                          aria-hidden="true"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        />
                        <div
                          className="dropdown-menu dropdown-menu-right"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <a className="dropdown-item" href="#">
                            Reply
                          </a>
                          <a className="dropdown-item redTxt" href="#">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                    <p>Hi Good Morning</p>
                    <span className="chatBox_dtime">6:30 AM</span>
                  </div>
                </div>

                <div className="chatBox_footer">
                  <div className="input-group">
                    <label className="input-group-append" id="customFile">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="exampleInputFile"
                        aria-describedby="fileHelp"
                      />
                      <span className="input-group-text attach_btn custom-file-control form-control-file">
                        <i className="fa fa-paperclip" aria-hidden="true" />
                      </span>
                    </label>
                    <textarea
                      name=""
                      className="form-control type_msg"
                      placeholder="Type your message..."
                    />
                    <div className="input-group-append">
                      <button className="primaryBtn">Send</button>
                    </div>
                  </div>
                </div>

                {/* Modal Start */}
                <div className="">
                  <Modal
                    displayModal={this.state.modal}
                    closeModal={this.openChat}
                  >
                    <div className="container">
                      <div className="row">
                        <div className="col-md-12">
                          <h4 className="modalHeads">Group info</h4>
                        </div>
                        <div className="modalGroupbg">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="newGroupmodal">
                                <div className="newGroupmodal_top">
                                  <div className="newGroupmodal_head">
                                    <a href="#" className="left">
                                      <div className="newGroupmodal_name">
                                        <h5 className="pt-2">Rock Band</h5>
                                      </div>
                                    </a>
                                    <div className="right">
                                      <div className="right_count">
                                        <img
                                          src={require('../../assets/images/chat/chat_men_icon.svg')}
                                        />
                                        <span>13</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="newGroupmodal_search">
                                    <form>
                                      <div className="input-group mb-1">
                                        <div className="input-group-prepend">
                                          <span
                                            className="input-group-text"
                                            id="basic-addon1"
                                          >
                                            <i
                                              className="fa fa-search"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        </div>
                                        <input
                                          type="text"
                                          className="form-control"
                                          placeholder="Search"
                                          aria-label="Username"
                                          aria-describedby="basic-addon1"
                                        />
                                      </div>
                                    </form>
                                  </div>
                                  <div className="addMembers">
                                    <div className="addMembers_box">
                                      <img
                                        src={require('../../assets/images/chat/chat-main-profile-1.png')}
                                      />
                                      <div className="addMembers_box_name">
                                        Jhon Wilson
                                      </div>
                                      <div className="addMembers_box_close">
                                        X
                                      </div>
                                    </div>
                                    <div className="addMembers_box">
                                      <img
                                        src={require('../../assets/images/chat/chat-main-profile-2.png')}
                                      />
                                      <div className="addMembers_box_name">
                                        Rock Band
                                      </div>
                                      <div className="addMembers_box_close">
                                        X
                                      </div>
                                    </div>
                                    <div className="addMembers_box">
                                      <img
                                        src={require('../../assets/images/chat/chat-main-profile-3.png')}
                                      />
                                      <div className="addMembers_box_name">
                                        Verny Sans
                                      </div>
                                      <div className="addMembers_box_close">
                                        X
                                      </div>
                                    </div>
                                    <div className="addMembers_box">
                                      <img
                                        src={require('../../assets/images/chat/chat-main-profile-4.png')}
                                      />
                                      <div className="addMembers_box_name">
                                        Devit Cam
                                      </div>
                                      <div className="addMembers_box_close">
                                        X
                                      </div>
                                    </div>
                                    <div className="addMembers_box">
                                      <img
                                        src={require('../../assets/images/chat/chat-main-profile-2.png')}
                                      />
                                      <div className="addMembers_box_name">
                                        Jerome Ant
                                      </div>
                                      <div className="addMembers_box_close">
                                        X
                                      </div>
                                    </div>
                                    <div className="addMembers_box">
                                      <img
                                        src={require('../../assets/images/chat/chat-main-profile-1.png')}
                                      />
                                      <div className="addMembers_box_name">
                                        Kennady
                                      </div>
                                      <div className="addMembers_box_close">
                                        X
                                      </div>
                                    </div>
                                    <div className="addMembers_box">
                                      <img
                                        src={require('../../assets/images/chat/chat-main-profile-3.png')}
                                      />
                                      <div className="addMembers_box_name">
                                        Analisisciclico
                                      </div>
                                      <div className="addMembers_box_close">
                                        X
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="newGroupmodal_pro">
                                  <div className="newGroupmodal_pro_list d-flex justify-content-between">
                                    <div className="left">
                                      <div className="left_count">
                                        <img
                                          src={require('../../assets/images/chat/chat-main-profile-2.png')}
                                        />
                                      </div>
                                      <div className="newGroupmodal_name">
                                        <h5 className="pt-1">Jhon Wilson</h5>
                                        <span>Hey there!</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="newGroupmodal_pro_list d-flex justify-content-between">
                                    <div className="left">
                                      <div className="left_count">
                                        <img
                                          src={require('../../assets/images/chat/chat-main-profile-3.png')}
                                        />
                                        {/* <span>5</span> */}
                                      </div>
                                      <div className="newGroupmodal_name">
                                        <h5 className="pt-1">Steffy Ken</h5>
                                        <span>Am Busy!</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="newGroupmodal_pro_list d-flex justify-content-between">
                                    <div className="left">
                                      <div className="left_count">
                                        <img
                                          src={require('../../assets/images/chat/chat-main-profile-4.png')}
                                        />
                                      </div>
                                      <div className="newGroupmodal_name">
                                        <h5 className="pt-1">Stay Benson</h5>
                                        <span>Always available</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="newGroupmodal_pro_list d-flex justify-content-between">
                                    <div className="left">
                                      <div className="left_count">
                                        <img
                                          src={require('../../assets/images/chat/chat-main-profile-5.png')}
                                        />
                                      </div>
                                      <div className="newGroupmodal_name">
                                        <h5 className="pt-1">Rock Band</h5>
                                        <span>Dear Welcome..</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="newGroupmodal_pro_list d-flex justify-content-between">
                                    <div className="left">
                                      <div className="left_count">
                                        <img
                                          src={require('../../assets/images/chat/chat-main-profile-6.png')}
                                        />
                                      </div>
                                      <div className="newGroupmodal_name">
                                        <h5 className="pt-1">Verny Sans</h5>
                                        <span>Most Dan...</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="newGroupmodal_pro_list d-flex justify-content-between">
                                    <div className="left">
                                      <div className="left_count">
                                        <img
                                          src={require('../../assets/images/chat/chat-main-profile-7.png')}
                                        />
                                      </div>
                                      <div className="newGroupmodal_name">
                                        <h5 className="pt-1">Devit Cam</h5>
                                        <span>Sure will soon</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="newGroupmodal_pro_list d-flex justify-content-between">
                                    <div className="left">
                                      <div className="left_count">
                                        <img
                                          src={require('../../assets/images/chat/chat-main-profile-8.png')}
                                        />
                                      </div>
                                      <div className="newGroupmodal_name">
                                        <h5 className="pt-1">Jerome Ant</h5>
                                        <span>Very urjent...</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="newGroupmodal_pro_list d-flex justify-content-between">
                                    <div className="left">
                                      <div className="left_count">
                                        <img
                                          src={require('../../assets/images/chat/chat-main-profile-9.png')}
                                        />
                                      </div>
                                      <div className="newGroupmodal_name">
                                        <h5 className="pt-1">Kennady</h5>
                                        <span>For your Feat</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="newGroupmodal_pro_list d-flex justify-content-between">
                                    <div className="left">
                                      <div className="left_count">
                                        <img
                                          src={require('../../assets/images/chat/chat-main-profile-1.png')}
                                        />
                                      </div>
                                      <div className="newGroupmodal_name">
                                        <h5 className="pt-1">
                                          Analisisciclico
                                        </h5>
                                        <span>Thanks for you...</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="groupDet">
                                <form className="groupForms">
                                  <div className="imageUpload">
                                    <label>
                                      <img
                                        src=""
                                        alt=""
                                        className="uploaded-image"
                                      />
                                      <div className="text-center">
                                        {/* <i className="fa fa-user imageUpload_icon"></i> */}
                                        <img
                                          src={require('../../assets/images/chat/chat-main-profile-5.png')}
                                          className="imageUpload_img"
                                        />
                                        <h5>
                                          <b>Choose Your Image to Upload</b>
                                        </h5>
                                      </div>
                                      <input
                                        data-required="image"
                                        type="file"
                                        name="image_name"
                                        id="file_upload"
                                        className="image-input"
                                        data-traget-resolution="image_resolution"
                                      />
                                    </label>
                                  </div>

                                  <div className="form-group">
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="exampleInputEmail1"
                                      aria-describedby="emailHelp"
                                      placeholder="Enter group name"
                                      value="Rock Band"
                                    />
                                  </div>
                                  <div className="form-group">
                                    <textarea
                                      className="form-control"
                                      id="exampleFormControlTextarea1"
                                      rows="3"
                                      placeholder="Enter subject"
                                      value="There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour."
                                    />
                                  </div>
                                  <button type="submit" className="sendBtn">
                                    Update
                                  </button>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <button onClick={(e) => this.openChat()} >Close</button> */}
                  </Modal>
                </div>
                {/* Modal End */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatGroup;
