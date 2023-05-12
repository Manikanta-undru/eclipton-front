import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import { animateScroll } from 'react-scroll';
import Avatar from '../../../../assets/images/market-place/avatar7.png';
import AvatarThumb from '../../../../assets/images/market-place/avatar-thumb.png';
import {
  clear,
  create,
  createFile,
  getChatMessages,
  getMessages,
} from '../../../../http/product-chat-call';
import { alertBox } from '../../../../commonRedux';
import { productChatReceived } from '../../../../hooks/socket';
import { getUser } from '../../../../http/product-calls';
import { getCurrentUser } from '../../../../http/token-interceptor';

require('./chat-inbox.scss');

const currentUser = JSON.parse(getCurrentUser());

class LiveChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receiver: {},
      sender: currentUser,
      products: this.props.products,
      senderId: '',
      receiverId: this.props.receiverId ? this.props.receiverId : '',
      msg: '',
      lastMessageId: '',
      isFocus: false,
      messages: [],
      chatBox: {},
      files: '',
      attachment: '',
      imgs: '',
      activeVariable: '',
      chatId: this.props.chatId ? this.props.chatId : '',
    };
    this.inputFile = React.createRef();
    this.handleFileInput = this.handleFileInput.bind(this);
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
      containerId: `chat${this.state.sender._id}`,
      duration: 200,
    });
  };

  componentDidMount() {
    if (this.state.products && this.state.products.userid) {
      getUser({ userid: this.state.products.userid }).then(
        async (resp) => {
          this.setState({
            receiver: resp,
          });
        },
        (error) => {}
      );
    }
    this.getMessagesData();
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousProps.chatId !== this.props.chatId) {
      this.setState({
        products: this.props.products,
        chatId: this.props.chatId ? this.props.chatId : '',
      });
      this.getMessagesData();
    }
    if (previousState.lastMessageId !== this.state.lastMessageId) {
      this.getMessagesData();
    }
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
    productChatReceived((newMessage) => {
      this.props.parentCallback(newMessage.message);
      if (newMessage.chatId == this.state.chatId) {
        let temp = this.state.messages;
        temp.push(newMessage.message);

        temp = temp.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t._id === value._id)
        );
        // var neww = this.state.new+1;
        this.setState(
          {
            lastMessageId: newMessage.message._id,
            messages: temp,
            //   new: neww
          },
          () => {
            this.scrollToDivBottom();
          }
        );
      }
    });

    if (this.props.chatId || this.state.chatId) {
      getChatMessages({
        chatId: this.props.chatId ? this.props.chatId : this.state.chatId,
      }).then(
        async (resp) => {
          let receiverId;
          if (resp.senderId === this.state.sender._id) {
            receiverId = resp.receiverId;
          } else {
            receiverId = resp.senderId;
          }
          getUser({ userid: receiverId }).then(
            async (resp) => {
              this.setState({
                receiver: resp,
              });
            },
            (error) => {}
          );
          this.setState(
            {
              messages: resp.replies,
              chatId: resp.chatId ? resp.chatId : this.state.chatId,
              receiverId,
            },
            () => {
              this.scrollToDivBottom();
            }
          );
        },
        (error) => {}
      );
    } else {
      if (this.state.products && this.state.products.userid !== 'undefined')
        var receiverId;
      if (this.state.products.userid === this.state.sender._id) {
        receiverId = this.state.receiverId;
      } else {
        receiverId = this.state.products.userid;
      }
      getMessages({
        senderId: this.state.sender._id,
        receiverId: this.state.products.userid,
        productId: this.state.products._id,
      }).then(
        async (resp) => {
          this.setState(
            {
              messages: resp.replies,
              chatId: resp.chatId,
              receiverId: this.state.products.userid,
            },
            () => {
              this.scrollToDivBottom();
            }
          );
        },
        (error) => {}
      );
    }
  };

  sendMsg = () => {
    if (
      this.state.msg != undefined &&
      this.state.msg != null &&
      this.state.msg.trim() != ''
    ) {
      create(
        {
          message: this.state.msg,
          senderId: this.state.sender._id,
          receiverId: this.state.receiverId
            ? this.state.receiverId
            : this.state.receiver._id,
          productId: this.state.products._id,
          chatId: this.state.chatId ? this.state.chatId : null,
        },
        true
      ).then(
        async (resp) => {
          this.props.parentCallback(resp.data);
          const temp = this.state.messages;
          temp.push(resp.data);
          this.setState(
            {
              lastMessageId: resp.data._id,
              chatId: resp.data.chatId,
              messages: temp,
              msg: '',
            },
            () => {
              this.scrollToDivBottom();
            }
          );
        },
        (error) => {
          alertBox(true, error.data.message);
        }
      );
    } else {
      alertBox(true, 'Please enter the message.');
    }
  };

  handleClear(e) {
    e.preventDefault();
    const formData = {
      chatId: this.state.chatId,
    };
    const con = window.confirm('Are you sure want to clear?');
    if (con == true) {
      clear(formData).then(
        async (resp) => {
          this.props.parentCallback(resp);
          this.setState(
            {
              messages: [],
            },
            () => {
              this.scrollToDivBottom();
            }
          );
          alertBox(true, 'Chat has been deleted!', 'success');
        },
        (error) => {
          alertBox(true, error.message);
        }
      );
    }
  }

  fileToDataURL = (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = function (event) {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  handleFileInput = async (e) => {
    e.preventDefault();
    const temp = e.target.files;
    //   /  var f = await this.fileToDataURL(e.target.files[0]);
    if (
      e.target.files &&
      e.target.files !== null &&
      e.target.files[0].size < 2e6
    ) {
      createFile({
        files: e.target.files[0],
        senderId: this.state.sender._id,
        receiverId: this.state.receiverId
          ? this.state.receiverId
          : this.state.receiver._id,
        productId: this.state.products._id,
        chatId: this.state.chatId ? this.state.chatId : null,
      }).then(
        async (resp) => {
          this.props.parentCallback(resp.data);
          const temp = this.state.messages;
          temp.push(resp.data);
          this.setState(
            {
              lastMessageId: resp.data._id,
              chatId: resp.data.chatId,
              messages: temp,
              msg: '',
            },
            () => {
              this.scrollToDivBottom();
            }
          );
        },
        (error) => {
          alertBox(true, error.data.message);
        }
      );
    }
    if (e.target.files[0].size > 2e6) {
      alertBox(true, 'Please upload a file smaller than 2 MB');
    }
  };

  onError = (e) => {};

  activeContent(attachment) {
    /* const docs = [
            { uri: attachment[0].src }
        ];
        return <DocViewer 
        pluginRenderers={DocViewerRenderers}
        documents={docs} /> */
    const ext = attachment[0].src.split('.');
    const extension = ext[ext.length - 1];
    const name = ext[ext.length - 2];
    if (extension === 'mp4') {
      return (
        <video controls style={{ width: '75%' }}>
          <source src={attachment[0].src} type="video/mp4" />{' '}
        </video>
      );
    }
    if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
      return (
        <a href={attachment[0].src} download>
          <i className="fa fa-download" />
          <img
            src={attachment[0].src}
            alt=""
            style={{ width: '250px', height: '150px' }}
          />
        </a>
      );
    }
    return (
      <details>
        <summary>
          {name.split('/')[1]}.{extension}
          <a href={attachment[0].src} download target="_blank" rel="noreferrer">
            {' '}
            <i className="fa fa-download" />
          </a>
        </summary>
        {/* <FileViewer
             fileType={extension} 
             filePath={attachment[0].src} 
             errorComponent={CustomErrorComponent} 
             onError={this.onError} 
             /> */}
      </details>
    );
  }

  render() {
    return (
      <div className="widget-live-chat">
        <div className="head">
          <div className="top">
            <div className="left">
              <div className="avatar">
                <img src={Avatar} alt="" />
                <span className="thumb">
                  <img src={AvatarThumb} alt="" />
                </span>
              </div>
              <div>
                <h3>
                  {' '}
                  {this.state.receiverId !== this.state.sender._id
                    ? this.state.receiver.name
                    : this.state.sender.name}{' '}
                </h3>
                <span className="online-status live"> Online </span>
              </div>
            </div>

            <div className="right">
              {/*    <button className="btn-icon">
                                    <img src={FlagIcon} alt="" />
                                </button>
                                <button className="btn-icon">
                                    <img src={PhoneIcon} alt="" />
                                </button>
                                <button className="btn-icon">
                                    <img src={ChatIcon} alt="" />
                                </button> */}
              <div className="dropdown-box dropdown-1">
                <button className="btn-icon">
                  {' '}
                  <i className="fa fa-ellipsis-v" />{' '}
                </button>
                <ul className="bg-lite">
                  <li>
                    {' '}
                    <Link
                      to={`/u/${this.state.receiver._id}`}
                      className="clear"
                    >
                      View Profile
                    </Link>{' '}
                  </li>
                  <li>
                    {' '}
                    <Link
                      onClick={(e) => this.handleClear(e)}
                      className="delete"
                    >
                      {' '}
                      Clear Chat{' '}
                    </Link>{' '}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div
          className="body"
          // id={"chat"+this.state.current._id}
        >
          <div className="chat-from">{/* <span> today </span> */}</div>
          {this.state.messages.map((msg, m) =>
            msg.clearChatUser1Id !== this.state.sender._id &&
            msg.clearChatUser2Id !== this.state.sender._id &&
            msg.senderId === this.state.sender._id ? (
              <div className="message-box sent" key={m}>
                {msg.attachment ? (
                  this.activeContent(msg.attachment)
                ) : (
                  <p key={m}>
                    <span className="msgeText" key={m}>
                      {msg.message}
                    </span>
                    <span className="date pull-right" key={m}>
                      {' '}
                      <TimeAgo date={msg.createdAt} key={m} />{' '}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              msg.clearChatUser1Id !== this.state.sender._id &&
              msg.clearChatUser2Id !== this.state.sender._id && (
                <div className="message-box received" key={m}>
                  {msg.attachment ? (
                    this.activeContent(msg.attachment)
                  ) : (
                    <p key={m}>
                      <span className="msgeText" key={m}>
                        {msg.message}
                      </span>
                      <span className="date pull-right" key={m}>
                        {' '}
                        <TimeAgo date={msg.createdAt} key={m} />{' '}
                      </span>
                    </p>
                  )}
                </div>
              )
            )
          )}
        </div>

        <input type="checkbox" id="showTabs" />
        <div className="footer">
          <div className="bottom">
            <span
              className="icon"
              onClick={() => this.inputFile.current.click()}
            >
              <i className="fa fa-paperclip">
                <input
                  type="file"
                  id="input_file"
                  accept=".jpg,.jpeg,.png,.mp4,.doc,.docx,.pdf,.xslx,.csv,.mp3"
                  style={{ display: 'none' }}
                  ref={this.inputFile}
                  onChange={(e) => {
                    this.handleFileInput(e);
                  }}
                />
              </i>
            </span>
            <input
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
            <button className="sendBtn" onClick={this.sendMsg}>
              {' '}
              Send{' '}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default LiveChat;
