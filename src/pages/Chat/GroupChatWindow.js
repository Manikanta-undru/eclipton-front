import React from 'react';
import { animateScroll } from 'react-scroll';
import TimeAgo from 'react-timeago';
import { profilePic } from '../../globalFunctions';
import {
  getMessages,
  deleteMessage,
  deleteChat,
  senGrpdMessage,
  createFileInGroup,
} from '../../http/message-calls';
import { alertBox } from '../../commonRedux';
import { grpMessageReceived } from '../../hooks/socket';

class GroupChatWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: this.props.chat,
      user: {},
      isFocus: false,
      messages: [],
      isReplyingMsg: false,
      replyingMsg: {},
      attachment: [],
      attachmentUrl: [],
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
    if (this.state.current && this.state.current !== undefined) {
      animateScroll.scrollToBottom({
        containerId: `chat${this.state.current._id}`,
        duration: 200,
      });
    }
  };

  componentDidMount() {
    let user;
    if (this.state.current && this.state.current !== undefined) {
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

      grpMessageReceived((newMessage) => {
        if (newMessage.chatId == this.state.current._id) {
          const temp = this.state.current;
          temp.groupConversation.push(newMessage.conversation);
          this.setState(
            {
              current: temp,
            },
            () => {
              this.scrollToDivBottom();
            }
          );
        }
      });
    }
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      /* empty */
    } else if (e.key === 'Enter') {
      this.sendMsg();
    }
  };

  getMessagesData = () => {
    getMessages({ id: this.state.current._id, isgroup: true }).then(
      async (resp) => {
        console.log('group chat window');
        this.setState({ messages: resp, current: resp[0] }, () => {
          this.scrollToDivBottom();
        });
      },
      (error) => {}
    );
  };

  deleteMessages = (message) => {
    deleteMessage({ id: message._id, isgroup: true }).then(
      async (resp) => {
        alertBox(true, 'Message Deleted!', 'success');
        this.getMessagesData();
      },
      (error) => {}
    );
  };

  replyingMessage = (message) => {
    this.setState({ isReplyingMsg: true, replyingMsg: message });
  };

  cancelReplyingMessage = () => {
    this.setState({ isReplyingMsg: false, replyingMsg: {} });
  };

  deleteChats = () => {
    deleteChat({ id: this.state.current._id, isgroup: true }).then(
      async (resp) => {
        alertBox(true, 'Chat Deleted!', 'success');
        this.getMessagesData();
      },
      (error) => {}
    );
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
        message = this.state.msg;
      }
      createFileInGroup({
        files: this.state.attachment,
        chat: this.state.current._id,
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
          this.setState({ msg: '' }, () => {
            this.scrollToDivBottom();
          });
          this.setState({ sendingStatus: false });
          this.getMessagesData();
        },
        (error) => {
          alertBox(true, error.data.message);
        }
      );
    } else if (
      this.state.msg != undefined &&
      this.state.msg != null &&
      this.state.msg.trim() != ''
    ) {
      replyid = '';
      if (this.state.isReplyingMsg) {
        replyid = this.state.replyingMsg._id;
      }
      const msgTemp = this.state?.msg;
      this.setState({ msg: '' });
      senGrpdMessage(
        { message: msgTemp, chat: this.state.current._id, replyId: replyid },
        true
      ).then(
        async (resp) => {
          this.props.parentCallback({
            isNewMessage: true,
            currantChatId: this.state.current._id,
          });
          this.cancelReplyingMessage();
          // var temp = this.state.current;
          // temp.groupConversation.push(resp);
          // this.setState({ messages: temp, current:temp, msg: '' }, () => {
          //   this.scrollToDivBottom();
          // });

          this.setState({ msg: '' }, () => {
            this.scrollToDivBottom();
          });
        },
        (error) => {
          alertBox(true, error?.data.message);
        }
      );
    } else {
      alertBox(true, 'Can not send an empty message.');
    }
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

  activeContent(attachment, replied = false) {
    if (attachment !== undefined) {
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
  }

  scrollIntoView(id) {
    const replyMsg = document.getElementById(id);
    replyMsg.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    return this.state.current && this.state.current !== undefined ? (
      <div className="chatBox">
        <div className="chatBox_head">
          <div className="left">
            <img
              src={
                this.state.current
                  ? profilePic(this.state.current.pic, this.state.current.name)
                  : ''
              }
            />
            <div className="chatBox_name">
              <h5 className="pt-2">
                {this.state.current ? this.state.current.name : ''}
              </h5>
              {this.state.current
                ? this.state.current.groupMembers.map((member, index) =>
                    this.state.current.createdBy == member._id ? (
                      <a
                        href={`/u/${member._id}`}
                        className="grp_members admin"
                        key={index}
                      >
                        {this.props.currentUser._id ==
                        this.state.current.createdBy
                          ? index < 6 && '(Admin)You'
                          : index < 6 && `(Admin)${member.name}`}
                        {index != this.state.current.groupMembers.length - 1 &&
                        index < 5
                          ? ', '
                          : ''}
                        {index == 6 && '.... and more'}
                      </a>
                    ) : (
                      <a
                        key={index}
                        href={`/u/${member._id}`}
                        className="grp_members"
                      >
                        {index < 6 && member.name}
                        {index != this.state.current.groupMembers.length - 1 &&
                        index < 5
                          ? ', '
                          : ''}
                        {index == 6 && '.... and more'}
                        {/* <span>2 min ago</span> */}
                      </a>
                    )
                  )
                : ''}
            </div>
          </div>
          <div className="right">
            <div className="dropdown">
              {/* <i className="fa fa-ellipsis-v" aria-hidden="true" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></i>
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
              </div> */}
            </div>
          </div>
        </div>

        <div
          className="chatBox_body"
          id={`chat${
            this.state.current && this.state.current !== undefined
              ? this.state.current._id
              : ''
          }`}
        >
          {/* <div className='chatBox_cale'><div className='chatBox_date mt-3'>Yesterday</div></div> */}

          {/* <div className='chatBox_left'>
            <div className='d-flex justify-content-between'>
              <div>&nbsp;</div>
              <div className="dropdown pr-2">
                <i className="fa fa-ellipsis-v" aria-hidden="true" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false"></i>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                  <a className="dropdown-item" href="#">Reply</a>
                  <a className="dropdown-item redTxt" href="#">Delete</a>
                </div>
              </div>
            </div>
            <video controls>
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              <source src="https://www.w3schools.com/html/mov_bbb.ogg" type="video/ogg" />
              Your browser does not support HTML video.
            </video>
            <p>Hi this Jhon, kindly check above video file</p>
            <span className='chatBox_dtime'>6:03 AM</span>
          </div> */}

          {this.state.current
            ? this.state.current.groupConversation.map((msg, m) =>
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
                    {msg.replyId &&
                    this.state.current.groupConversation.find(
                      (x) => x._id == msg.replyId
                    ) ? (
                      <div
                        className="replyBox_right pointer"
                        onClick={() => this.scrollIntoView(msg.replyId)}
                        key={m}
                      >
                        {/* <h6 class="replyBox_name1">You</h6> */}
                        <h6 className="replyBox_name2" key={m}>
                          {' '}
                          {
                            this.state.current.groupMembers.find(
                              (x) =>
                                x._id ==
                                this.state.current.groupConversation.find(
                                  (x) => x._id == msg.replyId
                                ).senderId
                            ).name
                          }
                        </h6>
                        {this.state.current.groupConversation.find(
                          (x) => x._id == msg.replyId
                        ).attachment &&
                          this.activeContent(
                            this.state.current.groupConversation.find(
                              (x) => x._id == msg.replyId
                            ).attachment,
                            true
                          )}

                        <p
                          dangerouslySetInnerHTML={{
                            __html: this.state.current.groupConversation
                              .find((x) => x._id == msg.replyId)
                              .message.replace(/(?:\r\n|\r|\n)/g, '<br>'),
                          }}
                          key={m}
                        />
                      </div>
                    ) : (
                      <div key={m} />
                    )}
                    {msg.attachment !== null ? (
                      <p key={m}>
                        {this.activeContent(msg.attachment)}
                        <p
                          dangerouslySetInnerHTML={{
                            __html: msg.message.replace(
                              /(?:\r\n|\r|\n)/g,
                              '<br>'
                            ),
                          }}
                          key={m}
                        />
                      </p>
                    ) : (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: msg.message.replace(
                            /(?:\r\n|\r|\n)/g,
                            '<br>'
                          ),
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
                    {msg.replyId &&
                    this.state.current.groupConversation.find(
                      (x) => x._id == msg.replyId
                    ) ? (
                      <div
                        className="replyBox_right pointer"
                        onClick={() => this.scrollIntoView(msg.replyId)}
                        key={m}
                      >
                        {/* <h6 class="replyBox_name1">You</h6> */}
                        <h6 className="replyBox_name2" key={m}>
                          {' '}
                          {
                            this.state.current.groupMembers.find(
                              (x) =>
                                x._id ==
                                this.state.current.groupConversation.find(
                                  (x) => x._id == msg.replyId
                                ).senderId
                            ).name
                          }
                        </h6>
                        {this.state.current.groupConversation.find(
                          (x) => x._id == msg.replyId
                        ).attachment &&
                          this.activeContent(
                            this.state.current.groupConversation.find(
                              (x) => x._id == msg.replyId
                            ).attachment,
                            true
                          )}

                        <p
                          dangerouslySetInnerHTML={{
                            __html: this.state.current.groupConversation
                              .find((x) => x._id == msg.replyId)
                              .message.replace(/(?:\r\n|\r|\n)/g, '<br>'),
                          }}
                          key={m}
                        />
                      </div>
                    ) : (
                      <div key={m} />
                    )}
                    <p key={m}>
                      {
                        this.state.current.groupMembers.find(
                          (x) => x._id == msg.senderId
                        ).name
                      }
                    </p>
                    {msg.attachment !== null ? (
                      <p key={m}>
                        {this.activeContent(msg.attachment)}
                        <p
                          dangerouslySetInnerHTML={{
                            __html: msg.message.replace(
                              /(?:\r\n|\r|\n)/g,
                              '<br>'
                            ),
                          }}
                          key={m}
                        />
                      </p>
                    ) : (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: msg.message.replace(
                            /(?:\r\n|\r|\n)/g,
                            '<br>'
                          ),
                        }}
                        key={m}
                      />
                    )}
                    <span className="chatBox_dtime" key={m}>
                      <TimeAgo date={msg.createdAt} key={m} />
                    </span>
                  </div>
                )
              )
            : ''}
        </div>

        {this.state.isReplyingMsg ? (
          <div className="replyBox">
            <div className="replyBox_text">
              {/* <h6 className='replyBox_name1'>You</h6> */}
              <h6 className="replyBox_name2">
                {
                  this.state.current.groupMembers.find(
                    (x) => x._id == this.state.replyingMsg.senderId
                  ).name
                }
              </h6>
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
              className="form-control type_msg"
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
    ) : (
      <div> No results </div>
    );
  }
}

export default GroupChatWindow;
