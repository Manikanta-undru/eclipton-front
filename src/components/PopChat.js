import React from 'react';
import { animateScroll } from 'react-scroll';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import { sendMessage, getMessages } from '../http/message-calls';
import { GetAssetImage, profilePic } from '../globalFunctions';
import { alertBox } from '../commonRedux';
import { messageReceived } from '../hooks/socket';

class PopChat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: this.props.chat,
      user: {},
      isFocus: false,
      messages: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.scrollToDivBottom = this.scrollToDivBottom.bind(this);
  }

  handleChange = (evt) => {
    const { name, value } = evt.target;
    this.setState({ [name]: value }, () => {});
    if (value == '') {
      this.setState({ isFocus: false });
    } else {
      this.setState({ isFocus: true });
    }
  };

  scrollToDivBottom = () => {
    animateScroll.scrollToBottom({
      containerId: `chat${this.state.current._id}`,
      duration: 200,
    });
  };

  componentDidMount() {
    let user;
    try {
      if (this.state.current.user1._id == this.props.currentUser._id) {
        user = this.state.current.user2;
      } else {
        user = this.state.current.user1;
      }
    } catch (error) {
      if (this.state.current.user1Id == this.props.currentUser._id) {
        user = this.state.current.user2Id;
      } else {
        user = this.state.current.user1Id;
      }
    }

    this.setState({
      user,
    });
    this.getMessagesData();
    messageReceived((newMessage) => {
      if (newMessage.chatId == this.state.current._id) {
        const temp = this.state.messages;
        temp.push(newMessage.message);

        // var neww = this.state.new+1;
        this.setState(
          {
            messages: temp,
            //   new: neww
          },
          () => {
            this.scrollToDivBottom();
          }
        );
      }
    });
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      // this.setState({
      //     msg: this.state.msg + "\n"
      // });
    } else if (e.key === 'Enter') {
      this.sendMsg();
    }
  };

  getMessagesData = () => {
    getMessages({ id: this.state.current._id }).then(
      async (resp) => {
        this.setState({ messages: resp }, () => {
          this.scrollToDivBottom();
        });
      },
      (error) => {}
    );
  };

  sendMsg = () => {
    if (
      this.state.msg != undefined &&
      this.state.msg != null &&
      this.state.msg.trim() != ''
    ) {
      sendMessage(
        {
          message: this.state.msg,
          chat: this.state.current._id,
          id: this.state.user._id,
        },
        true
      ).then(
        async (resp) => {
          const temp = this.state.messages;
          temp.push(resp);
          this.setState({ messages: temp, msg: '' }, () => {
            this.scrollToDivBottom();
          });
        },
        (error) => {
          alertBox(true, error.data.message);
        }
      );
    } else {
      alertBox(true, 'Please enter the message.');
    }
  };

  render() {
    return (
      <div className="popChat">
        <div className="popChatHeader">
          <Link to={`/u/${this.state.user._id}`}>
            <img
              src={profilePic(this.state.user.avatar, this.state.user.name)}
              className="chatPic"
            />
          </Link>
          <span>{this.state.user.name}</span>
          <div>
            <span
              className="pointer"
              onClick={(e) => this.props.minimize(this.props.id)}
            >
              <svg height="26px" width="26px" viewBox="-4 -4 24 24">
                <line
                  stroke="#bec2c9"
                  strokeLinecap="round"
                  strokeWidth="2"
                  x1="2"
                  x2="14"
                  y1="8"
                  y2="8"
                />
              </svg>
            </span>
            <span
              className="pointer"
              onClick={(e) => this.props.close(this.props.id)}
            >
              <svg height="26px" width="26px" viewBox="-4 -4 24 24">
                <line
                  stroke="#bec2c9"
                  strokeLinecap="round"
                  strokeWidth="2"
                  x1="2"
                  x2="14"
                  y1="2"
                  y2="14"
                />
                <line
                  stroke="#bec2c9"
                  strokeLinecap="round"
                  strokeWidth="2"
                  x1="2"
                  x2="14"
                  y1="14"
                  y2="2"
                />
              </svg>
            </span>
          </div>
        </div>
        <div className="popChatBody" id={`chat${this.state.current._id}`}>
          {this.state.messages.map((msg, m) =>
            msg.senderId == this.props.currentUser._id ? (
              <div className="senderDiv" key={m}>
                <div className="sender" key={m}>
                  <div className="media w-100 d-flex align-items-end" key={m}>
                    <div className="media-left" key={m} />
                    <div className="media-body" key={m}>
                      <p
                        className="chat-window popChatMsg"
                        dangerouslySetInnerHTML={{
                          __html: msg.message.replace(
                            /(?:\r\n|\r|\n)/g,
                            '<br>'
                          ),
                        }}
                        key={m}
                      />
                    </div>
                    <div className="media-right" key={m}>
                      <span className="d-block" key={m}>
                        <img
                          className="media-object circle chatPic"
                          src={profilePic(
                            this.props.currentUser.avatar,
                            this.props.currentUser.name
                          )}
                          alt="..."
                          key={m}
                        />
                      </span>
                    </div>
                  </div>
                  <span className="time font-size-10" key={m}>
                    <TimeAgo date={msg.createdAt} key={m} />
                  </span>
                </div>
              </div>
            ) : (
              <div className="receiverDiv" key={m}>
                <div className="receiver" key={m}>
                  <div className="media w-100 d-flex align-items-end" key={m}>
                    <div className="media-left" key={m}>
                      <span className="d-block" key={m}>
                        <img
                          className="media-object circle chatPic"
                          src={profilePic(
                            this.state.user.avatar,
                            this.state.user.name
                          )}
                          alt="..."
                          key={m}
                        />
                      </span>
                    </div>
                    <div className="media-body" key={m}>
                      <p
                        className="chat-window popChatMsg"
                        dangerouslySetInnerHTML={{
                          __html: msg.message.replace(
                            /(?:\r\n|\r|\n)/g,
                            '<br>'
                          ),
                        }}
                        key={m}
                      />
                    </div>
                    <div className="media-right" key={m} />
                  </div>
                  <span className="time font-size-10" key={m}>
                    <TimeAgo date={msg.createdAt} key={m} />
                  </span>
                </div>
              </div>
            )
          )}
        </div>
        <div className="popChatInput">
          <div className="container">
            <div className="row ">
              <div className="media w-100 d-flex align-items-center">
                {/* <div className="media-left">
                          <a href="#">
                              <img className="media-object circle" src={GetAssetImage('smile.jpg')} alt="..." />
                          </a>
                      </div> */}
                <div className="media-body">
                  <textarea
                    className="text"
                    type="text"
                    value={this.state.msg}
                    placeholder="Type Something..."
                    name="msg"
                    onChange={(e) => {
                      this.handleChange(e);
                    }}
                    onKeyPress={this.handleKeyPress}
                  />
                </div>
                <div className="media-right">
                  <button
                    className="btn btn-transparent"
                    onClick={this.sendMsg}
                  >
                    <img
                      className="media-object circle sentmsg"
                      src={
                        this.state.isFocus
                          ? GetAssetImage('send-active.jpg')
                          : GetAssetImage('send.jpg')
                      }
                      alt="..."
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PopChat;
