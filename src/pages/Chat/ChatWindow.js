import React from 'react';
import { animateScroll } from 'react-scroll';
import TimeAgo from 'react-timeago';
import { profilePic } from '../../globalFunctions';
import {
  sendMessage,
  getMessages,
  deleteMessage,
  deleteChat,
  createFile,
} from '../../http/message-calls';
import { alertBox } from '../../commonRedux';
import { messageReceived } from '../../hooks/socket';
import A from '../../components/A';

// const [previewModal, setPreviewModal] = React.useState(false);
// const [preview, setPreview] = React.useState('');
// const [attachment, setAttachment] = React.useState(null);
// const [submitAttachments, setSubmitAttachments] = React.useState([]);
// const [attachmentUrl, setAttachmentUrl] = React.useState('');
// var Eclipton;

class ChatWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: this.props.chat,
      user: {},
      isFocus: false,
      messages: [],
      isReplyingMsg: false,
      replyingMsg: {},
      previewModal: '',
      preview: '',
      attachment: [],
      submitAttachments: '',
      attachmentUrl: [],
      files: [],
      sendingStatus: false,
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
        this.setState(
          {
            messages: temp,
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
      /* empty */
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

  deleteMessages = (message) => {
    deleteMessage({ id: message._id }).then(
      async (resp) => {
        alertBox(true, 'Message Deleted!', 'success');
        this.getMessagesData();
      },
      (error) => {}
    );
  };

  deleteChats = () => {
    deleteChat({ id: this.state.current._id }).then(
      async (resp) => {
        alertBox(true, 'Chat Deleted!', 'success');
        this.getMessagesData();
        this.props.parentCallback({
          isNewMessage: true,
          currantChatId: this.state.current._id,
        });
      },
      (error) => {}
    );
  };

  fileToDataURL = (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = function (event) {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  handleAttachment = async (e) => {
    e.preventDefault();
    const temp = e.target.files;
    let i = 0;
    const { length } = temp;
    const temp_attachment = this.state.attachment;
    const temp_attachmentUrl = this.state.attachmentUrl;
    if (temp && temp !== null) {
      while (i < length) {
        if (temp[i] !== null && temp[i].size < 2e6) {
          const f = await this.fileToDataURL(temp[i]);
          temp_attachment.push(temp[i]);
          temp_attachmentUrl.push(f);
        }
        if (temp[i] !== null && temp[i].size > 2e6) {
          alertBox(
            true,
            `${temp[i].name} Please upload a file smaller than 2 MB`
          );
        }
        i++;
      }

      this.setState({
        attachment: temp_attachment,
        attachmentUrl: temp_attachmentUrl,
      });
    }
  };

  handlePreview = (file, type) => {
    // setPreview(file);
    // Eclipton = window.open("/passionomy/preview/" + encodeURIComponent(file) + "/" + type, "Eclipton", "width=1000, height=1000");   // Opens a new window
    // // setPreviewModal(true);
    // // setModal(false)
  };

  removeAttachment = (attachmentUrl, data, i) => {
    if (
      data !== undefined &&
      data.name !== undefined &&
      attachmentUrl !== undefined
    ) {
      const temp_attachment = this.state.attachment.filter(
        (attach_data) => attach_data.name !== data.name
      );
      const temp_attachment_url = this.state.attachment.filter(
        (attach_url_data) => attach_url_data !== attachmentUrl
      );
      this.setState({
        attachment: temp_attachment,
        attachmentUrl: temp_attachment_url,
      });
      /* document.getElementById("attachment").value = null; */
    }
  };

  sendMsg = () => {
    if (this.state.attachment.length > 0 && this.state.attachment !== null) {
      this.setState({ sendingStatus: true });
      var replyid = '';
      if (this.state.isReplyingMsg) {
        replyid = this.state.replyingMsg._id;
      }
      let message = '';
      if (this.state.msg) {
        message = this.state.msg.trim();
      }
      createFile({
        files: this.state.attachment,
        chat: this.state.current._id,
        id: this.state.user._id,
        replyId: replyid,
        message,
      }).then(
        async (resp) => {
          this.props.parentCallback({
            isNewMessage: true,
            currantChatId: this.state.current._id,
          });
          this.cancelReplyingMessage();
          this.setState({
            attachment: [],
            attachmentUrl: [],
          });
          document.getElementById('attachment').value = null;
          const temp = this.state.messages;
          resp.map((res_data) => {
            temp.push(res_data);
            this.setState({ messages: temp, msg: '' }, () => {
              this.scrollToDivBottom();
            });
          });
          this.setState({ sendingStatus: false });
        },
        (error) => {
          alertBox(true, error.data.message);
        }
      );
    } else if (this.state?.msg?.trim()) {
      replyid = '';
      if (this.state.isReplyingMsg) {
        replyid = this.state.replyingMsg._id;
      }
      const msgTemp = this.state?.msg;
      this.setState({ msg: '' });
      sendMessage(
        {
          message: msgTemp,
          chat: this.state.current._id,
          id: this.state.user._id,
          replyId: replyid,
        },
        true
      ).then(
        async (resp) => {
          this.props.parentCallback({
            isNewMessage: true,
            currantChatId: this.state.current._id,
          });
          this.cancelReplyingMessage();
          const temp = this.state.messages;
          temp.push(resp);
          this.setState({ messages: temp }, () => {
            this.scrollToDivBottom();
          });
        },
        (error) => {
          alertBox(true, error.data.message);
        }
      );
    } else {
      alertBox(true, 'Can not send an empty message.');
    }
  };

  replyingMessage = (message) => {
    this.setState({ isReplyingMsg: true, replyingMsg: message });
  };

  cancelReplyingMessage = () => {
    this.setState({ isReplyingMsg: false, replyingMsg: {} });
  };

  activeContent(attachment, replied = false) {
    const ext = attachment.split('.');
    const extension = ext[ext.length - 1];
    const name = ext[ext.length - 2];
    if (extension === 'mp4') {
      return (
        <video controls style={{ width: '75%' }}>
          <source src={attachment} type="video/mp4" />{' '}
        </video>
      );
    }
    if (extension === 'png' || extension === 'jpg' || extension === 'jpeg') {
      return (
        <a
          href={attachment}
          download
          onClick={(e) => {
            if (replied) {
              e.preventDefault(); // prevent the default download behavior
            }
          }}
        >
          {!replied && <i className="fa fa-download" />}
          <img
            src={attachment}
            alt=""
            style={{ width: '250px', height: '150px' }}
          />
        </a>
      );
    }
    return (
      <a href={attachment} download target="_blank" rel="noreferrer">
        {' '}
        <i className="fa fa-download" /> {name}
      </a>
    );
  }

  scrollIntoView(id) {
    const replyMsg = document.getElementById(id);
    replyMsg.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    return (
      <div className="chatBox">
        <div className="chatBox_head">
          <A
            href={`/u/${this.state.user._id}`}
            className="left block text-decoration-none"
          >
            <img
              src={profilePic(this.state.user.avatar, this.state.user.name)}
            />
            <div className="chatBox_name">
              <h5 className="pt-2">{this.state.user.name}</h5>
              {/* <div className='chatBox_time'>Last Seen <span>2 min ago</span></div> */}
            </div>
          </A>
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
                <a className="dropdown-item" href={`/u/${this.state.user._id}`}>
                  Contact Info
                </a>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={(e) => {
                    this.deleteChats();
                  }}
                >
                  Clear Chat
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="chatBox_body" id={`chat${this.state.current._id}`}>
          {/* <div className='chatBox_cale'><div className='chatBox_date mt-3'>Yesterday</div></div> */}

          {this.state.messages.map((msg, m) =>
            msg.senderId == this.props.currentUser._id ? (
              <div className="chatBox_right" id={msg._id} key={m}>
                <div className="d-flex justify-content-between" key={m}>
                  <div key={m}>&nbsp;</div>
                  <div className="dropdown pr-2" key={m}>
                    <i
                      className="fa fa-ellipsis-v"
                      aria-hidden="true"
                      id="dropdownMenuButton"
                      data-toggle="dropdown"
                      aria-expanded="false"
                      key={m}
                    />
                    <div
                      className="dropdown-menu dropdown-menu-right"
                      aria-labelledby="dropdownMenuButton"
                      key={m}
                    >
                      <a
                        className="dropdown-item"
                        onClick={(e) => {
                          this.replyingMessage(msg);
                        }}
                        key={m}
                      >
                        Reply
                      </a>
                      <a
                        className="dropdown-item redTxt"
                        href="#"
                        onClick={(e) => {
                          this.deleteMessages(msg);
                        }}
                        key={m}
                      >
                        Delete
                      </a>
                    </div>
                  </div>
                </div>
                {msg.replyId ? (
                  <div
                    className="replyBox_right pointer"
                    onClick={() => this.scrollIntoView(msg.replyId)}
                    key={m}
                  >
                    {/* <h6 class="replyBox_name1">You</h6> */}
                    {/* <h6 class="replyBox_name2">Others Name</h6> */}
                    {this.state.messages?.find((x) => x._id == msg.replyId)
                      ?.attachment &&
                      this.activeContent(
                        this.state.messages?.find((x) => x._id == msg.replyId)
                          ?.attachment,
                        true
                      )}

                    <p
                      dangerouslySetInnerHTML={{
                        __html: this.state.messages
                          ?.find((x) => x._id == msg.replyId)
                          ?.message?.replace(/(?:\r\n|\r|\n)/g, '<br>'),
                      }}
                      key={m}
                    />
                  </div>
                ) : (
                  <div key={m} />
                )}
                {msg.attachment != null ? (
                  <p key={m}>
                    {this.activeContent(msg.attachment)}
                    <p
                      dangerouslySetInnerHTML={{
                        __html: msg.message.replace(/(?:\r\n|\r|\n)/g, '<br>'),
                      }}
                      key={m}
                    />
                  </p>
                ) : (
                  <p
                    dangerouslySetInnerHTML={{
                      __html: msg.message.replace(/(?:\r\n|\r|\n)/g, '<br>'),
                    }}
                    key={m}
                  />
                )}

                <span className="chatBox_dtime" key={m}>
                  <TimeAgo date={msg.createdAt} key={m} />
                </span>
              </div>
            ) : (
              <div className="chatBox_left" id={msg._id} key={m}>
                <div className="d-flex justify-content-between" key={m}>
                  <div key={m}>&nbsp;</div>
                  <div className="dropdown pr-2" key={m}>
                    <i
                      className="fa fa-ellipsis-v"
                      aria-hidden="true"
                      id="dropdownMenuButton"
                      data-toggle="dropdown"
                      aria-expanded="false"
                      key={m}
                    />
                    <div
                      className="dropdown-menu dropdown-menu-right"
                      aria-labelledby="dropdownMenuButton"
                      key={m}
                    >
                      <a
                        className="dropdown-item"
                        onClick={(e) => {
                          this.replyingMessage(msg);
                        }}
                        key={m}
                      >
                        Reply
                      </a>
                      {/* <a className="dropdown-item redTxt" href="#">Delete</a> */}
                    </div>
                  </div>
                </div>
                {msg.replyId ? (
                  <div
                    className="replyBox_right"
                    onClick={() => this.scrollIntoView(msg.replyId)}
                    key={m}
                  >
                    {/* <h6 class="replyBox_name1">You</h6> */}
                    {/* <h6 class="replyBox_name2">Others Name</h6> */}
                    {this.state.messages?.find((x) => x._id == msg.replyId)
                      ?.attachment &&
                      this.activeContent(
                        this.state.messages?.find((x) => x._id == msg.replyId)
                          ?.attachment,
                        true
                      )}
                    <p
                      dangerouslySetInnerHTML={{
                        __html: this.state.messages
                          ?.find((x) => x._id == msg.replyId)
                          ?.message?.replace(/(?:\r\n|\r|\n)/g, '<br>'),
                      }}
                      key={m}
                    />
                  </div>
                ) : (
                  <div key={m} />
                )}
                {msg.attachment != null ? (
                  <p key={m}>
                    {this.activeContent(msg?.attachment)}
                    <p
                      dangerouslySetInnerHTML={{
                        __html: msg?.message.replace(/(?:\r\n|\r|\n)/g, '<br>'),
                      }}
                      key={m}
                    />
                  </p>
                ) : (
                  msg.message && (
                    <p
                      dangerouslySetInnerHTML={{
                        __html: msg?.message.replace(/(?:\r\n|\r|\n)/g, '<br>'),
                      }}
                      key={m}
                    />
                  )
                )}
                <span className="chatBox_dtime" key={m}>
                  <TimeAgo date={msg.createdAt} key={m} />
                </span>
              </div>
            )
          )}
        </div>
        {this.state.isReplyingMsg ? (
          <div className="replyBox">
            <div className="replyBox_text">
              {/* <h6 className='replyBox_name1'>You</h6> */}
              {/* <h6 className='replyBox_name2'>{this.state.user.name}</h6> */}
              <p>{this.state.replyingMsg.message}</p>
              <span className="chatBox_dtime">
                <TimeAgo date={this.state.replyingMsg.createdAt} />
              </span>
              <span
                className="crossBtn"
                onClick={(e) => {
                  this.cancelReplyingMessage();
                }}
              >
                <i className="fa fa-times" aria-hidden="true" />
              </span>
            </div>
          </div>
        ) : (
          <div />
        )}
        <div className="chatBox_footer">
          <div className="input-group">
            <label className="input-group-append" id="customFile">
              <input
                type="file"
                className="custom-file-input"
                multiple
                id="attachment"
                onChange={this.handleAttachment}
                aria-describedby="fileHelp"
              />
              <span className="input-group-text attach_btn custom-file-control form-control-file">
                <i className="fa fa-paperclip" aria-hidden="true" />
              </span>
            </label>
            {this.state.attachment != null &&
              this.state.attachment.map((data, i) => (
                <div className={`d-flex align-items-center ${i}`} key={i}>
                  <a
                    href={this.state.attachmentUrl[i]}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {data.name}
                  </a>
                  <i
                    className="fa fa-times pl-2"
                    onClick={() =>
                      this.removeAttachment(
                        this.state.attachmentUrl[i],
                        data,
                        i
                      )
                    }
                  />
                </div>
              ))}
            <textarea
              className="form-control type_msg chatMessageInput"
              value={this.state.msg}
              name="msg"
              onChange={(e) => {
                this.handleChange(e);
              }}
              onKeyPress={this.handleKeyPress}
              placeholder="Type your message..."
            />
            <div className="input-group-append">
              <button
                className="primaryBtn"
                disabled={this.state.sendingStatus}
                style={
                  this.state.sendingStatus ? { background: '#5832e0d9' } : null
                }
                onClick={this.sendMsg}
              >
                {this.state.sendingStatus ? 'Sending' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatWindow;
