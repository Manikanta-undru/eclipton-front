import React from 'react';
import { Link } from 'react-router-dom';
import { alertBox } from '../../commonRedux';
import {
  particularGroups,
  SendMessage,
  ReceiveAllmsg,
} from '../../http/group-calls';
import { profilePic, formatDate } from '../../globalFunctions';
import './style/groupMessage.scss';
import Header from '../../components/Header';
import SocialActivities from '../../components/Menu/SocialActivities';
import images from '../../assets/images/images';
import RewardsWidget from '../../components/RewardsWidget';
import {
  Messagegrp,
  connectSocket,
  tribesgrpConnect,
} from '../../hooks/socket';
import { Memberget, datedifference } from '../../GroupFunctions';

class ViewMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupsdet: [],
      groupmembers: [],
      groupcount: [],
      groupStatus: 'active',
      message: '',
      get_message: [],
      socket_message: [],
      attach: '',
    };
  }

  componentDidMount() {
    const grop_id = this.props.match.params.id;
    const userid = this.props.currentUser._id;
    if (this.props.currentUser != undefined) {
      connectSocket(this.props.currentUser._id);
    }

    // get message for socket
    // group connect
    this.groupconnect();
    this.getMessage();
    const d = {};
    d.group_id = grop_id;
    particularGroups(d).then(
      (res) => {
        this.setState({
          groupsdet: res,
        });
      },
      (err) => {
        alertBox(true, err, 'Error');
      }
    );
    // common functions
    Memberget(grop_id, userid).then((res) => {
      this.setState({
        groupmembers: res.member,
        groupcount: res.member_count,
        groupStatus: res.create_staus,
      });
    });

    // get messages
    ReceiveAllmsg(d).then((res) => {
      if (res) {
        this.setState({ get_message: res });
      }
    });
  }

  getMessage() {
    Messagegrp((request) => {
      const merge_message = [...this.state.get_message, ...request];

      this.setState({ get_message: merge_message });
    });
  }

  groupconnect() {
    tribesgrpConnect(this.props.currentUser._id, this.props.match.params.id);
  }

  changeTab = (newValue) => {
    this.setState({ currentTab: newValue });
  };

  getSelectedTabClassName = (tabValue) => {
    const { currentTab } = { ...this.state };
    if (tabValue === currentTab) return 'tab selected';
    return 'tab';
  };

  handleMessage = (e) => {
    this.setState({
      message: e.target.value,
    });
  };

  handleFile = (event) => {
    console.log(event.target.files[0]);
    this.setState({
      attach: event.target.files[0],
    });
  };

  submit = async (e, t) => {
    e.preventDefault();
    const { message } = this.state;
    const formData = new FormData();
    formData.append('message', message);
    formData.append('group_id', this.props.match.params.id);
    formData.append('attach', this.state.attach);

    SendMessage(formData).then(
      async (resp) => {
        this.setState({ message: '' });
      },
      (error) => {
        alertBox(true, 'Error send Message');
      }
    );
  };

  render() {
    const { currentTab, groupsdet, groupmembers, message, get_message } = {
      ...this.state,
    };
    const userall = groupmembers.map((groupsdata, index) => (
      <>
        {(groupsdata.member_status != 'blocked' &&
          groupsdata.member_status != 'left') ||
        groupsdata.groupuserid == this.props.currentUser._id ? (
          <>
            {groupsdata.avatar != undefined ? (
              <img src={profilePic(groupsdata.avatar)} alt="img" key={index} />
            ) : (
              <img src={profilePic()} alt="img" />
            )}
          </>
        ) : (
          ''
        )}
      </>
    ));

    const viewmessage = get_message.map((gmessage, index) => (
      <>
        {gmessage.groupsmsg.userid == this.props.currentUser._id ? (
          <div className="reply" key={index}>
            <div className="comment-Text">
              <div className="leftArea">
                <span className="content">{gmessage.groupsmsg.message}</span>
                {gmessage.groupsmsg.attachment ? (
                  <img
                    src={gmessage.groupsmsg.attachment}
                    alt="profileIcon"
                    style={{ height: '50px', width: '50px' }}
                  />
                ) : (
                  ''
                )}
              </div>
              <div className="rightArea">
                <span>{datedifference(gmessage.groupsmsg.createdAt)}</span>
              </div>
            </div>
            <div>
              <img
                className="profile-img"
                src={
                  gmessage.usersdata.avatar != undefined
                    ? profilePic(gmessage.usersdata.avatar)
                    : profilePic()
                }
                alt="profileIcon"
              />
            </div>
          </div>
        ) : (
          <div className="comment">
            <div>
              <img
                className="profile-img"
                src={
                  gmessage.usersdata.avatar != undefined
                    ? profilePic(gmessage.usersdata.avatar)
                    : profilePic()
                }
                alt="profileIcon"
              />
            </div>
            <div className="comment-Text">
              <div className="leftArea">
                <span className="content">{gmessage.groupsmsg.message}</span>
                {gmessage.groupsmsg.attachment ? (
                  <img
                    src={gmessage.groupsmsg.attachment}
                    alt="profileIcon"
                    style={{ height: '50px', width: '50px' }}
                  />
                ) : (
                  ''
                )}
              </div>
              <div className="rightArea">
                <span>{datedifference(gmessage.groupsmsg.createdAt)}</span>
              </div>
            </div>
          </div>
        )}
      </>
    ));

    return (
      <div className="viewMessagesTotalWrapper">
        <Header
          appName={this.props.appName}
          currentUser={this.props.currentUser}
        />
        <div className="container my-wall-container ">
          <div className="row mt-2">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column">
              <SocialActivities
                group_id={this.props.match.params.id}
                user_id={this.props.currentUser._id}
              />
              <div className="groupAreaWrapper">
                <div className="group">
                  <div className="groupImg">
                    <img src={this.state.groupsdet.banner} alt="img" />
                  </div>
                  <span className="groupName">{this.state.groupsdet.name}</span>
                  <div className="groupAccessType">
                    <img src={images.locked} alt="locked" />
                    <span> {this.state.groupsdet.privacy} Group</span>
                  </div>
                  <span className="groupDescription">
                    {this.state.groupsdet.description}
                  </span>
                  <div className="float-right">
                    <Link className="float-right">
                      See More <i className="fa fa-caret-down" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- end left column --> */}

            {/* <!-- center column --> */}
            <div className="col-sm empty-container-with-out-border center-column">
              <div className="viewMessagesTotalWrapper">
                <div className="header">
                  <div className="leftArea">
                    <div>
                      <span>Group Chat</span>
                    </div>
                  </div>
                </div>
                <div className="hLine" />
                <div className="groupChatDetails">
                  <img
                    className="groupIcon"
                    src={profilePic(this.props.currentUser.avatar)}
                    alt="groupImg"
                  />
                  <div>
                    <span className="groupChatName">{groupsdet.name}</span>
                    <span className="groupChatDescription">
                      Friend’s on Group
                    </span>
                  </div>
                  <div>
                    {groupsdet.userid == this.props.currentUser._id ? (
                      <span className="groupChatInstruction">
                        You are now Created this Group
                      </span>
                    ) : (
                      ''
                    )}

                    <span className="groupCreationDate">
                      {formatDate(groupsdet.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="parentreply">{viewmessage}</div>
                <div className="members">{userall}</div>
                <form
                  onSubmit={(e) => this.submit(e, 1)}
                  method="post"
                  autoComplete="off"
                  encType="multipart/form-data"
                >
                  <div className="commentActions">
                    <div>
                      <input
                        type="file"
                        id="addMorePic"
                        onChange={this.handleFile}
                      />
                      <label htmlFor="addMorePic">
                        <img src={images.addMorePic} alt="img" />
                      </label>
                    </div>
                    <div>
                      <input type="file" id="pic" onChange={this.handleFile} />
                      <label htmlFor="pic">
                        <img src={images.pic} alt="img" />
                      </label>
                    </div>
                    <div>
                      <input
                        type="file"
                        id="gifPic"
                        onChange={this.handleFile}
                      />
                      <label htmlFor="gifPic">
                        <img src={images.gifPic} alt="img" />
                      </label>
                    </div>

                    <div className="textArea">
                      <input
                        type="text"
                        placeholder="write message"
                        name="message"
                        value={message}
                        onChange={(e) => this.handleMessage(e)}
                      />
                      <img src={images.smile} alt="img" />
                    </div>
                    <button onClick={(e) => this.submit(e, 1)}>Send</button>
                    {/* <img src={images.LikeSolid} alt="img" /> */}
                  </div>
                </form>
              </div>
            </div>
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}
            <div className="col-sm empty-container-with-out-border right-column">
              <RewardsWidget {...this.props} />
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default ViewMessages;
