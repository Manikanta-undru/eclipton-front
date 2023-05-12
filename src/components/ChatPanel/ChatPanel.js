import React, { useState, useRef } from 'react';
import Paper from '@material-ui/core/Paper';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckIcon from '@material-ui/icons/Check';
import ListItemText from '@material-ui/core/ListItemText';
import Spinner from '../Spinner';
import UploadModal from '../UploadModal/UploadModal';
import Modal from '../Popup';
import { image } from '../../config/constants';

import {
  addGigChat,
  getGigChat,
  gigStatusUpdate,
  gigSubmit,
  gigRating,
} from '../../http/gig-calls';
import './Chat.scss';
import { profilePic } from '../../globalFunctions';
import { alertBox, switchLoader } from '../../commonRedux';
import { gigRelease } from '../../http/wallet-calls';
import MediaViewer from './MediaViewer';
import { Link } from 'react-router-dom';

export function HandShake(props) {
  return (
    <div className="hand-shake">
      {props.placement === 'start' && (
        <ThumbUpIcon fontSize="large" style={{ paddingRight: '8px' }} />
      )}
      <span style={{ fontSize: '14px', opacity: '.5' }}>{props.text}</span>
      {props.placement === 'end' && (
        <ThumbUpIcon fontSize="large" style={{ paddingLeft: '8px' }} />
      )}
    </div>
  );
}
export function OrderPreview(props) {
  const { plan } = props.purchase.data;
  return (
    <Paper variant="outlined" square className="chat-payment-details">
      <div className="payment-option">
        <div className="payment-title">{props.purchase.data.plan}</div>
        <div className="payment-cost cost-margin-left">
          {`${props.purchase.currency} ${
            props.gig[`${props.purchase.data.plan}Price`]
          }`}
        </div>
      </div>
      <div className="order-item font12 font-bold">{props.gig.subject}</div>
      <div className="order-description font12 ">
        Package includes the following features
      </div>
      <List className="order-requirement">
        {props.gig.features.map((item) =>
          item != null && item[props.purchase.data.plan] == 1 ? (
            <ListItem key={item}>
              <ListItemIcon key={item}>
                <CheckIcon key={item} />
              </ListItemIcon>
              <ListItemText key={item}>{item.feature}</ListItemText>
            </ListItem>
          ) : null
        )}
        {props.purchase.data.extras.map((item) => (
          <ListItem key={item}>
            <ListItemIcon key={item}>
              <CheckIcon key={item} />
            </ListItemIcon>
            <ListItemText key={item}>
              {item.feature}
              <span className="pull-right" key={item}>
                {props.purchase.currency} {item.amount}
              </span>
            </ListItemText>
          </ListItem>
        ))}
      </List>
      <div className="delivery-details">
        <div className="delivery-days">
          <AccessTimeIcon />{' '}
          <span
            className={props.purchase.data.fast == undefined ? '' : 'strike'}
          >
            {props.gig[`${plan}Days`]} days delivery
          </span>
        </div>
        <List className="order-requirement">
          {props.purchase.data.fast != undefined && (
            <ListItem>
              <ListItemText>
                Extra Fast {props.purchase.data.days} Day(s) Delivery
                <span className="pull-right delivery-margin">
                  {`${props.purchase.currency} ${props.gig.fastPrice}`}
                </span>
              </ListItemText>
            </ListItem>
          )}
          {props.purchase.data.fee != undefined && (
            <ListItem>
              <ListItemText>
                Service Fee
                <span className="pull-right">
                  {`${props.purchase.currency} ${props.purchase.data.fee}`}
                </span>
              </ListItemText>
            </ListItem>
          )}
        </List>
      </div>
      <div className="payment-total">
        <div className="payment-title font12">TOTAL</div>
        <div className="payment-cost font-bold">
          {`${props.purchase.currency} ${props.purchase.amount}`}
        </div>
      </div>
    </Paper>
  );
}
export function WithUserImage(props) {
  return (
    <div className="user-image-chat">
      <div className="user-image">
        <Avatar src={props.data.image} alt={props.data.name} />
      </div>
      <div className="user-name-chat">
        {props.displayName && (
          <div className="chat-user-name">{props.data.name}</div>
        )}
        <div className="chat-user-text">{props.text}</div>
      </div>
    </div>
  );
}

export default function ChatPanel(props) {
  const [open, setOpen] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [chatdet, setchatid] = React.useState('');
  const [reviewModal, setReviewModal] = React.useState(false);
  const [previewModal, setPreviewModal] = React.useState(false);
  const [preview, setPreview] = React.useState('');
  const [text, setText] = React.useState('');
  const [rating, setRating] = React.useState(0);
  const [user, setUser] = React.useState(null);
  const [creator, setCreator] = React.useState(null);
  const [gig, setGig] = React.useState(null);
  const [purchase, setPurchase] = React.useState(null);
  const [chat, setChat] = React.useState([]);
  const [log, setLog] = React.useState(null);
  const [msg, setMessage] = React.useState('');
  const [attachment, setAttachment] = React.useState(null);
  const [buttonval, setButton] = React.useState('');
  const [feedback, setFeedback] = React.useState(null);
  const [submitAttachments, setSubmitAttachments] = React.useState([]);
  const [attachmentUrl, setAttachmentUrl] = React.useState('');
  const [messagesEnd, setMessagesEnd] = React.useState(null);
  const messagesEndRef = useRef(null);
  const [mediaPreviewSrc, setMediaPreviewSrc] = useState(null);
  const [purchase_status, setpurchasecon] = useState(null);
  const enum_purchase_status = {
    '-1': 'rejected',
    1: 'pending',
    2: 'accepted',
    3: 'completed',
    4: 'submitted',
    5: 'payment-released',
  };
  let Eclipton;

  React.useEffect(() => {
    if (msg != '') {
      setButton('');
    }
    scrollToBottom();
    getData();
  }, [props.chat]);

  const getData = () => {
    let data = {};
    if (props.chat != null) {
      if (props.chatcontents.purchaseid != undefined) {
        data = {
          order_id: props.chat._id,
          gig: props.chat.postid,
          purchaseid: props.chatcontents.purchaseid,
        };
      } else {
        data = {
          order_id: props.chat._id,
          gig: props.chat.postid,
        };
      }
      // var data = {
      //     order_id: props.chat._id,
      //     gig: props.chat.postid
      // };
      getGigChat(data).then((resp) => {
        if (resp) {
          setUser(resp.user);
          setCreator(resp.creator);
          setGig(resp.gig);
          setPurchase(resp.purchase);
          setChat(resp.chat);
          setFeedback(resp.rating);
          if (resp.log != null) {
            const lo = resp.log;
            lo.attachments =
              lo.attachments != '' ? JSON.parse(lo.attachments) : [];
            setLog(lo);
          }
          setpurchasecon(enum_purchase_status[resp.purchase.status]);
          scrollToBottom();
        } else {
          setGig(null);
          setPurchase(null);
          setChat([]);
        }
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const modalOpen = () => {
    setOpen(true);
  };

  const sendMsg = () => {
    setButton('disabled');
    if (msg) {
      const datagig = props.chat;
      const data = {
        purchaseid: purchase._id,
        receiver:
          props.panel == 'seller' ||
          (datagig.giguserinfo != undefined &&
            datagig.giguserinfo._id == props.currentUser._id)
            ? purchase.userid
            : gig.userid,
        message: msg,
      };
      if (attachment != null) {
        const f = [];
        f.push(attachment);
        data.files = f;
      }
      addGigChat(data).then(
        (resp) => {
          setMessage('');
          removeAttachment();
          setButton('');
          const temp = [...chat];
          temp.push(resp);
          setChat(temp);
          scrollToBottom();
        },
        (err) => {
          alertBox(true, err.data.message);
        }
      );
    } else {
      setButton('');
      alertBox(true, 'Please enter the message');
    }
  };

  const accept = () => {
    switchLoader(true, 'Please wait...');
    const { data } = purchase;
    data.statusAt = new Date().toISOString();
    const st = 2;
    const da = {
      data,
      status: st,
      id: purchase._id,
    };
    gigStatusUpdate(da).then(
      (resp) => {
        switchLoader();
        const temp = { ...purchase };
        temp.status = st;
        setPurchase(temp);
        setpurchasecon(enum_purchase_status[temp.status]);
        props.updateStatus(st);
      },
      (err) => {
        switchLoader();
        alertBox(true, err.data.message);
      }
    );
  };

  const reject = () => {
    switchLoader(true, 'Please wait...');
    const dat = {
      transfer_id: purchase.data.refid,
      status: 'cancel',
    };
    gigRelease(dat).then(
      (resp) => {
        const { data } = purchase;
        data.statusAt = new Date().toISOString();
        const st = -1;
        const da = {
          data,
          status: st,
          id: purchase._id,
        };
        gigStatusUpdate(da).then(
          (resp) => {
            switchLoader();
            const temp = { ...purchase };
            temp.status = st;
            setPurchase(temp);
            setpurchasecon(enum_purchase_status[temp.status]);
            props.updateStatus(st);
          },
          (err) => {
            switchLoader();
            alertBox(true, err.data.message);
          }
        );
      },
      (err) => {
        switchLoader();
        alertBox(true, err.data.message);
      }
    );
  };

  const release = () => {
    switchLoader(true, 'Please wait...');

    const dat = {
      transfer_id: purchase.data.refid,
      status: 'confirm',
    };
    gigRelease(dat).then(
      (resp) => {
        if (resp.Status == true) {
          const { data } = purchase;
          data.released = true;
          const st = 5;
          const da = {
            data,
            status: st,
            id: purchase._id,
            chatid: chatdet,
          };
          // return false;
          gigStatusUpdate(da).then(
            (resp) => {
              switchLoader();
              const temp = { ...purchase };
              temp.data = data;
              setPurchase(temp);
              setpurchasecon(enum_purchase_status[temp.status]);
              setPreviewModal(!previewModal);
              setModal(!modal);
              window.location.href = '';
            },
            (err) => {
              switchLoader();
              alertBox(true, err.data.message);
            }
          );
        } else {
          switchLoader();
          alertBox(true, resp.Message);
        }
      },
      (err) => {
        switchLoader();
        alertBox(true, err.data.message);
      }
    );
  };

  const rework = () => {
    switchLoader(true, 'Please wait...');

    const { data } = purchase;
    data.released = 'not-accept';
    const st = -1;
    const da = {
      data,
      status: st,
      id: purchase._id,
      chatid: chatdet,
    };
    setModal(false);
    setPreviewModal(false);
    gigStatusUpdate(da).then(
      (resp) => {
        switchLoader();
        const temp = { ...purchase };
        temp.data = data;
        setPurchase(temp);
        setpurchasecon(enum_purchase_status[temp.status]);
        alertBox(true, 'Successfully Rejected', 'success');
        window.location.href = '';
      },
      (err) => {
        switchLoader();
        alertBox(true, err.data.message);
      }
    );
  };

  const review = () => {
    if (rating == 0 || text == '') {
      alertBox(true, 'Please give both rating and review');
    } else {
      switchLoader(true, 'Please wait...');
      const da = {
        postid: gig._id,
        purchaseid: purchase._id,
        rating,
        review: text,
      };
      gigRating(da).then(
        (resp) => {
          setReviewModal(false);
          switchLoader();
          getData();
        },
        (err) => {
          switchLoader();
          alertBox(true, err.data.message);
        }
      );
    }
  };

  // handel for Buyer can view all files and release the payment to seller
  const selectModal = () => {
    setModal(!modal);
  };
  const closepreviewModal = () => {
    setPreviewModal(!previewModal);
    setModal(!modal);
  };
  const openReleaseModal = (cid) => {
    console.log(cid);
    setchatid(cid);
    setModal(true);
  };

  // handle change for feedback text area
  const openReviewModal = () => {
    setReviewModal(true);
  };
  const openCloseModal = () => {
    setReviewModal(!reviewModal);
  };
  const handleChange = (e) => {
    setText(e.target.value);
  };
  const handleUnsetPreview = (file, type) => {
    setPreviewModal(false);
    setModal(true);
    // window.open("/passionomy/preview/"+encodeURIComponent(file)+"/"+type, '_blank').close()
    Eclipton.close();
  };
  const handlePreview = (file, type) => {
    setPreview(file);
    Eclipton = window.open(
      `/passionomy/preview/${encodeURIComponent(file)}/${type}`,
      'Eclipton',
      'width=1000, height=1000'
    ); // Opens a new window
    // setPreviewModal(true);
    // setModal(false)
  };

  const handleAttachment = (e) => {
    const filed = e.target.files[0];
    const element = filed;
    let fileType = '';
    const getExt = element.name.split('.').pop();
    fileType = getExt.replace('.', '');
    let err = [];
    // add validation
    if (image.indexOf(`.${fileType}`) == -1) {
      err.push('Please select valid file');
    } else if (element.size > 2000000) {
      err.push('Please upload the attachment less than 2 MB');
    } else {
      err = [];
    }
    if (err.length > 0) {
      alertBox(true, err.join(','));
    } else {
      setAttachment(filed);
      setButton('');
      const reader = new FileReader();
      // it's onload event and you forgot (parameters)
      reader.onload = function (e) {
        // var image = document.getElementById(name+"_preview");
        // image.src = e.target.result;
        setAttachmentUrl(e.target.result);
      };
      // you have to declare the file loading
      reader.readAsDataURL(filed);
    }
  };

  const removeAttachment = () => {
    setAttachmentUrl('');
    setAttachment(null);
    document.getElementById('attachment').value = null;
  };
  const handleInput = (e) => {
    setMessage(e.target.value);
    setButton('');
  };
  const handleSubmit = () => {
    const err = [];
    if (submitAttachments.length <= 0) {
      alertBox(true, 'You need to choose at least one file to submit');
    } else {
      switchLoader(true, 'Submitting, Please wait...');
      setOpen(false);
      const data = {
        file: submitAttachments,
        id: purchase._id,
      };
      gigSubmit(data).then(
        (resp) => {
          switchLoader();
          if (resp.msg != undefined) {
            alertBox(true, resp.msg);
          } else {
            alertBox(true, 'Gig submitted for approval', 'success');
            props.updateStatus(3);
            window.location.href = '';
            getData();
          }
        },
        (err) => {
          switchLoader();
          alertBox(true, err.data.message);
        }
      );
    }
  };
  const scrollToBottom = () => {
    const objDiv = document.getElementsByClassName('rightchatBox_body')[0];
    if (objDiv != undefined) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  };
  const data = props.chat;

  if (data == null || user == null || gig == null || purchase == null) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  data.sellerPanel = !!(
    props.panel == 'seller' || creator._id == props.currentUser._id
  );
  data.buyerPanel = !!(
    props.panel == 'buyer' || user._id == props.currentUser._id
  );
  // const showAccept = data.sellerPanel && purchase.status == 1 && props.currentUser._id == data.gigs.userid;
  const showAccept =
    data.sellerPanel &&
    purchase_status == 'pending' &&
    props.currentUser._id == data.gigs.userid;

  const showSend =
    purchase_status == 'Accepted' ||
    purchase_status == 'completed' ||
    (purchase_status == 'rejected' &&
      props.chat.data.released == 'not-accept') ||
    purchase_status == 'submitted';
  // const showSend = purchase.status == 2 || purchase.status == 3 || purchase.status == -1 && props.chat.data.released == "not-accept"  || purchase.status == 4;
  const released_status =
    props.chat.data.released != undefined && props.chat.data.released == true
      ? props.chat.data.released
      : '';
  const panel_head_user = props.currentUser._id == creator._id ? user : creator;
  // console.log(data.sellerPanel,"sellpanel",data.buyerPanel,"buyerpanel",released_status)
  return (
    <>
      {mediaPreviewSrc !== null && (
        <MediaViewer
          type={mediaPreviewSrc.type}
          src={mediaPreviewSrc.src}
          setMediaPreviewSrc={setMediaPreviewSrc}
        />
      )}
      <div className="rightchatBox_head">
        <div className="row">
          <div className="col-lg-6 col-md-6">
            <div className="left">
              <Link to={`/u/${user._id}`}>
                <img
                  src={profilePic(user.avatar, user.name)}
                  className="chatPic"
                />
              </Link>
              <div className="rightchatBox_name">
                <h5 className="pt-2">
                  <Link to={`/u/${user._id}`}>{user.name}</Link>
                </h5>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            {(purchase_status == 'rejected' &&
              data.sellerPanel &&
              released_status != '') ||
            (purchase_status == 'rejected' &&
              data.sellerPanel &&
              props.chat.data.released == 'not-accept') ||
            (purchase.status >= 2 &&
              released_status == '' &&
              data.sellerPanel &&
              data.gigs.userid == props.currentUser._id &&
              data.status != 1) ? (
              <div className="right">
                <div className="rightchatBox_text">
                  <h6>
                    Submit all files for
                    <br /> Payment release
                  </h6>
                  <div className="rightBrdr" />
                  <button
                    className="subClosebtn"
                    onClick={() => {
                      if (data.status != 4) {
                        setOpen(true);
                      } else {
                        alertBox(
                          true,
                          'You are already submit the project, please wait until validate the job'
                        );
                      }
                    }}
                  >
                    Submit & Close the project
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="rightchatBox_body" ref={messagesEndRef}>
        <div className="chatBox_left">
          <i className="fa fa-thumbs-up" aria-hidden="true" />
          <p className="thumbTxt">Handshake initiated</p>
        </div>

        <div className="hireDet hireDetMod">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>{purchase.data.plan}</th>
                  <th className="text-right">
                    <span className="valueTxt">
                      {gig[`${purchase.data.plan}Price`]} {purchase.currency}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="2">
                    <h6>{gig.subject}</h6>
                    {gig.features.length > 0 && (
                      <p>Please includes the following features</p>
                    )}
                  </td>
                </tr>

                {gig.features.map((item) =>
                  item != null && item[purchase.data.plan] == 1 ? (
                    <tr key={item}>
                      <td colSpan="2" key={item}>
                        <h6 key={item}>
                          <i
                            className="fa fa-clock-o clockIc"
                            aria-hidden="true"
                            key={item}
                          />
                          {item.feature}
                        </h6>
                      </td>
                    </tr>
                  ) : null
                )}

                {purchase.data.extras.map((item) => (
                  <tr key={item}>
                    <td colSpan="2" key={item}>
                      <h6 key={item}>
                        <i
                          className="fa fa-clock-o clockIc"
                          aria-hidden="true"
                          key={item}
                        />
                        {item.feature} {item.amount} {purchase.currency}
                      </h6>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2">
                    <h6>
                      <i className="fa fa-clock-o clockIc" aria-hidden="true" />{' '}
                      {gig[`${purchase.data.plan}Days`]} days delivery
                    </h6>
                  </td>
                </tr>
                {purchase.data.fast != undefined && (
                  <tr>
                    <td>
                      <p> Fast Delivery</p>
                    </td>
                    <td>
                      <h6 className="text-right">
                        {`${gig.fastPrice} ${purchase.currency}`}
                      </h6>
                    </td>
                  </tr>
                )}
                {purchase.data.fee != undefined && (
                  <tr>
                    <td>
                      <p>Service Fee </p>
                    </td>
                    <td>
                      <h6 className="text-right">
                        {`${purchase.data.fee?.toFixed(8)} ${
                          purchase.currency
                        }`}
                      </h6>
                    </td>
                  </tr>
                )}

                <tr className="topBrd">
                  <td>
                    <h6>Total</h6>
                  </td>
                  <td>
                    <h6 className="text-right">
                      {' '}
                      {`${purchase.amount?.toFixed(8)} ${purchase.currency}`}
                    </h6>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {data.buyerPanel && purchase.status == 1 && (
          <div className="chatBox_right">
            <i className="fa fa-thumbs-up" aria-hidden="true" />

            <p className="thumbTxt">
              Waiting for mutal handshake from the seller
            </p>
          </div>
        )}
        {purchase.status == 2 ? (
          <div className="chatBox_right">
            <i
              // eslint-disable-next-line no-constant-condition
              className={`fa fa-thumbs-${data.buyerPanel ? 'down' : 'up'}`}
              aria-hidden="true"
            />
            <p className="thumbTxt">Handshake accepted</p>
          </div>
        ) : null}

        {showAccept && (
          <div className="chatBox_right">
            <div className="chatValues">
              <h4>
                {purchase.currency} {purchase.amount}
              </h4>
              <button className="acceBtns" onClick={accept}>
                Accept Handshake
              </button>
              <button className="rejeBtns" onClick={reject}>
                Reject
              </button>
            </div>
          </div>
        )}
        {chat.map((c, i) =>
          c.msgtype == null ? (
            c.attachment == null ? (
              <div
                className={`sellerchatContent${
                  c.sender == props.currentUser._id ? '' : '_left'
                }`}
                key={i}
              >
                <div
                  className={`sellerchatContent${
                    c.sender == props.currentUser._id ? '_user' : '_left_user'
                  }`}
                  id={`${c._id}gig`}
                >
                  <p className="message"> {c.message}</p>
                  <div
                    className={`sellerchatContent${
                      c.sender == props.currentUser._id ? '_Pic' : '_left_Pic'
                    }`}
                    id={`${c._id}gig`}
                  >
                    {c.sender != props.currentUser._id && (
                      <img
                        src={profilePic(
                          data.buyerPanel == true
                            ? creator.avatar
                            : user.avatar,
                          data.buyerPanel == true ? creator.name : user.name
                        )}
                        alt={data.buyerPanel == true ? creator.name : user.name}
                      />
                    )}

                    {c.sender == props.currentUser._id && (
                      <img
                        src={profilePic(
                          props.currentUser.avatar
                            ? props.currentUser.avatar
                            : '',
                          props.currentUser.name
                        )}
                        alt={props.currentUser.name}
                      />
                    )}
                  </div>
                  <br />
                </div>{' '}
              </div>
            ) : (
              <div
                className={`sellerchatContent${
                  c.sender == props.currentUser._id ? '' : '_left'
                }`}
                id={`${c._id}gig`}
              >
                <div
                  className={`sellerchatContent${
                    c.sender == props.currentUser._id ? '_user' : '_left_user'
                  }`}
                >
                  <div
                    className={`sellerchatContent${
                      c.sender == props.currentUser._id ? '_Pic' : '_left_Pic'
                    }`}
                  >
                    {c.sender != props.currentUser._id && (
                      <img
                        src={profilePic(
                          data.buyerPanel == true
                            ? creator.avatar
                            : user.avatar,
                          data.buyerPanel == true ? creator.name : user.name
                        )}
                        alt={data.buyerPanel == true ? creator.name : user.name}
                      />
                    )}

                    {c.sender == props.currentUser._id && (
                      <img
                        src={profilePic(
                          props.currentUser.avatar
                            ? props.currentUser.avatar
                            : '',
                          props.currentUser?.name
                        )}
                        alt={props.currentUser.name}
                      />
                    )}
                  </div>
                  <p
                    className={
                      c.attachmentType == 'mp3' ? 'message audioTag' : 'message'
                    }
                  >
                    {c.attachmentType == 'jpeg' ||
                    c.attachmentType == 'png' ||
                    c.attachmentType == 'jpg' ||
                    c.attachmentType == 'Image' ||
                    c.attachmentType == 'gif' ? (
                      <img
                        src={c.attachment}
                        onClick={() =>
                          setMediaPreviewSrc({
                            src: c.attachment,
                            type: 'image',
                          })
                        }
                      />
                    ) : null}

                    {c.attachmentType == 'mp4' ||
                    c.attachmentType == 'video' ? (
                      <video
                        src={c.attachment}
                        onClick={() =>
                          setMediaPreviewSrc({
                            src: c.attachment,
                            type: 'video',
                          })
                        }
                      />
                    ) : null}

                    {c.attachmentType == 'mp3' ? (
                      <audio src={c.attachment} controls />
                    ) : null}

                    {c.attachmentType == 'pdf' ? (
                      <a href={c.attachment}>
                        <i
                          className="fa fa-file-pdf-o icon-file"
                          style={{ 'font-size': '45px' }}
                        />
                      </a>
                    ) : null}

                    {c.attachmentType == 'docx' ? (
                      <a href={c.attachment}>
                        <i
                          className="fa fa-file-word-o icon-file"
                          style={{ 'font-size': '45px' }}
                        />
                      </a>
                    ) : null}

                    {c.attachmentType == 'txt' ? (
                      <a href={c.attachment}>
                        <i
                          className="fa fa-file-text-o icon-file"
                          style={{ 'font-size': '45px' }}
                        />
                      </a>
                    ) : null}

                    {c.attachmentType == 'xls' || c.attachmentType == 'xlsx' ? (
                      <a href={c.attachment}>
                        <i
                          className="fa fa-file-excel-o icon-file"
                          style={{ 'font-size': '45px' }}
                        />
                      </a>
                    ) : null}

                    <p className="message">{c.message}</p>
                  </p>
                  <br />
                </div>
              </div>
            ) // (purchase.status == 3) ?
          ) : (
            <div className="sellerchatContent" id={c._id} key={i}>
              {/* {c.msgtype}- {c.replystatus} */}
              <div className="sellerchatContent_user">
                {
                  // data.data.released != "not-accept" &&
                  c.msgtype == 'Submission' ? (
                    data.buyerPanel ? (
                      <p className="message submitClo">
                        {`${creator.name} has submitted all the files. Release the  payments and download the file.`}
                      </p>
                    ) : (
                      <p className="message submitClo">
                        {' You have submitted the files and closed the project'}
                      </p>
                    )
                  ) : (
                    ''
                  )
                }
                {
                  // data.data.released == "not-accept" &&

                  c.msgtype == 'Rejected' ? (
                    <p className="message submitClo">
                      {' Previous submitted files was rejected'}
                    </p>
                  ) : (
                    ''
                  )
                }

                {
                  // data.data.released == "not-accept" &&

                  c.msgtype == 'Released' ? (
                    data.buyerPanel == false ? (
                      <p className="message submitClo">
                        Previous submitted project payment was released
                      </p>
                    ) : (
                      <p className="message submitClo">Payment was released</p>
                    )
                  ) : (
                    ''
                  )
                }

                {c.replystatus != 'Released' && c.replystatus != 'Rejected' ? (
                  <div className="sellerchatContent_Pic">
                    {
                      // c.sender != props.currentUser._id && <Avatar className="chatPic" src={pic(data.buyerPanel ? creator.avatar : user.avatar)}  alt={data.buyerPanel ? creator.name : user.name} />
                      <img
                        src={profilePic(
                          data.buyerPanel == false
                            ? creator.avatar
                            : user.avatar,
                          data.buyerPanel == false ? creator.name : user.name
                        )}
                        alt={
                          data.buyerPanel == false ? creator.name : user.name
                        }
                      />
                    }
                  </div>
                ) : null}
              </div>
              {data.buyerPanel &&
              (c.msgtype == 'Released' || c.msgtype == 'Submission') &&
              c.replystatus != 'Rejected' &&
              c.replystatus != 'Released' ? (
                <div className="chatBox_right downloadfile_right">
                  {purchase.data.released ? (
                    <>
                      <i className="fa fa-download" aria-hidden="true" />
                      <p
                        className="thumbTxt"
                        onClick={(e) => openReleaseModal(c._id)}
                        style={{ cursor: 'pointer' }}
                      >
                        Download Files
                      </p>
                    </>
                  ) : c.replystatus != 'Rejected' ? (
                    <button
                      className="acceBtns"
                      onClick={(e) => openReleaseModal(c._id)}
                    >
                      Release Payment and Download Files
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              ) : null}

              {data.buyerPanel &&
                feedback == null &&
                c.msgtype == 'Released' &&
                purchase.data.released &&
                purchase.data.released != 'not-accept' && (
                  <div className="chatBox_right">
                    <div className="chatValues">
                      <button className="acceBtns" onClick={openReviewModal}>
                        Feedback
                      </button>
                    </div>
                  </div>
                )}

              {data.buyerPanel &&
                feedback != null &&
                c.msgtype == 'Released' && (
                  <div className="chatBox_right rating_right">
                    <p className="thumbTxt">
                      {[1, 2, 3, 4, 5].map((e, i) => {
                        if (e <= feedback.rating) {
                          return <i className="fa fa-star" key={i} />;
                        }
                        return <i key={i} className="fa fa-star-o" />;
                      })}{' '}
                    </p>
                    <p className="thumbTxt">{feedback.review}</p>
                  </div>
                )}
            </div>
          )
        )}

        {/* old{
                    purchase.status == 3 &&
                    <div className="sellerchatContent">
                        <div className="sellerchatContent_user">
                                {
                                (data.data.released != "not-accept") ? data.buyerPanel ? <p className="message submitClo">{user.name + " has submitted all the files. Release the  payments and download the file."}</p> : <p className="message submitClo">{" You have submitted the files and closed the project"}</p>
                                    : null
                            }
                            {
                                data.data.released == "not-accept" ? <p className="message submitClo">{" Previous submitted files was rejected"}</p> : ""
                            }
                            <div className="sellerchatContent_Pic">
                                {
                                    // c.sender != props.currentUser._id && <Avatar className="chatPic" src={pic(data.buyerPanel ? creator.avatar : user.avatar)}  alt={data.buyerPanel ? creator.name : user.name} />
                                    data.sellerPanel && <img src={profilePic(creator.avatar,creator.name)} />
                                }
                            </div>

                
                        </div>
                        {data.buyerPanel &&
                            <div className="chatBox_right downloadfile_right">
                            {
                                purchase.data.released ? <><i class="fa fa-download" aria-hidden="true"></i>
                                <p className='thumbTxt' onClick={openReleaseModal} style={{"cursor":"pointer"}}>Download Files</p></> : <button className='acceBtns' onClick={openReleaseModal}>Release Payment and Download Files
                                    </button>
                            }
                                    
                            </div>
                        }

                        {data.buyerPanel && feedback == null && purchase.data.released && purchase.data.released != "not-accept" &&
                        <div className="chatBox_right">
                            <div className="chatValues">
                            <button className='acceBtns' onClick={openReviewModal}>
                                Feedback
                            </button>
                            </div>
                        </div>
                        }

                        {
                        data.buyerPanel && feedback != null &&
                        <div className="chatBox_right rating_right">
                        <p className='thumbTxt'>{
                            [1, 2, 3, 4, 5].map((e, i) => {
                            if (e <= feedback.rating) {
                                return <i className="fa fa-star"></i>
                            } else {
                                return <i className="fa fa-star-o"></i>
                            }
                            })
                        } </p>
                        <p className='thumbTxt'>
                        {feedback.review}</p>

                        </div>
                        }

                    
                    </div>
                } */}

        {open && data.sellerPanel && (
          <UploadModal
            handleClose={handleClose}
            open={open}
            fileChange={(val) => {
              setSubmitAttachments(val);
            }}
            onSubmit={handleSubmit}
            purchaseId={purchase._id}
          />
        )}

        {/* modal for Buyer can view all files and release the payment to seller */}
        <Modal displayModal={modal} closeModal={selectModal}>
          <div className="review-modal">
            <div className="d-flex align-items-center">
              <div className="container mt-4 purchase-modal">
                <h5
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    marginLeft: '0.5rem',
                  }}
                >
                  All files
                </h5>
                <div className="row">
                  <div
                    className="col down-hold"
                    style={{ textAlign: 'center' }}
                  >
                    {purchase.data.released == true
                      ? log != null &&
                        log.attachments != undefined &&
                        log.attachments.length > 0 &&
                        log.attachments.map(
                          (l, r) =>
                            l != undefined && (
                              <div
                                className="down-item"
                                style={{
                                  backgroundImage:
                                    l.contenttype == 'Image'
                                      ? `url(${l.content_url})`
                                      : '',
                                }}
                                key={r}
                              >
                                <button
                                  type="button"
                                  className="review-btn"
                                  onClick={() => {
                                    window.open(l.content_url);
                                  }}
                                  key={r}
                                >
                                  {' '}
                                  Download{' '}
                                </button>
                              </div>
                            )
                        )
                      : log != null &&
                        log.attachments != undefined &&
                        log.attachments.map((l, r) => (
                          <div className="down-item" key={r}>
                            {
                              <i
                                className="fa fa-eye"
                                onClick={(e) =>
                                  handlePreview(l.content_url, l.contenttype)
                                }
                                key={r}
                              />
                              // preview == "" ?  <i className="fa fa-eye" onClick={(e) => handlePreview(l.content_url,l.contenttype)}></i> :
                              // <i className="fa fa-eye-slash" onClick={(e) => handleUnsetPreview(l.content_url,l.contenttype)}></i>
                            }
                          </div>
                        ))}
                  </div>
                </div>
                <br />
                <br />
                <br />
                <br />
              </div>
            </div>
            {purchase.data.released ? null : (
              <div className="modal-footer" style={{ borderTop: 'none' }}>
                Release the full payment to download all original files
                <button
                  type="button"
                  className="review-btn"
                  style={{ marginLeft: '1rem' }}
                  onClick={release}
                >
                  {' '}
                  Release{' '}
                </button>
                <button
                  type="button"
                  className="review-btn"
                  style={{ marginLeft: '1rem' }}
                  onClick={rework}
                >
                  {' '}
                  Not Ok{' '}
                </button>
              </div>
            )}
          </div>
        </Modal>
        {/* feedback modal */}
        <Modal displayModal={reviewModal} closeModal={openCloseModal}>
          {creator != null && (
            <div>
              <div
                className="d-flex align-items-center"
                style={{ padding: '1rem' }}
              >
                <div className="container mt-4 review-modal">
                  <div className="row">
                    <div className="col">
                      <h5 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                        Rate Your Experience with the seller
                      </h5>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-3 col-sm-3 col-md-3">
                      <img
                        className="media-object pic"
                        src={profilePic(creator.avatar, creator.name)}
                        alt="..."
                      />
                    </div>
                    <div className="col-6 col-sm-8 col-md-4">
                      <p className="para-text">{creator.name}</p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="rate">
                      <input
                        type="radio"
                        id="star5"
                        name="rate"
                        value="5"
                        onClick={() => {
                          setRating(5);
                        }}
                      />
                      <label htmlFor="star5" title="text" />
                      <input
                        type="radio"
                        id="star4"
                        name="rate"
                        value="4"
                        onClick={() => {
                          setRating(4);
                        }}
                      />
                      <label htmlFor="star4" title="text" />
                      <input
                        type="radio"
                        id="star3"
                        name="rate"
                        value="3"
                        onClick={() => {
                          setRating(3);
                        }}
                      />
                      <label htmlFor="star3" title="text" />
                      <input
                        type="radio"
                        id="star2"
                        name="rate"
                        value="2"
                        onClick={() => {
                          setRating(2);
                        }}
                      />
                      <label htmlFor="star2" title="text" />
                      <input
                        type="radio"
                        id="star1"
                        name="rate"
                        value="1"
                        onClick={() => {
                          setRating(1);
                        }}
                      />
                      <label htmlFor="star1" title="text" />
                    </div>
                    <textarea
                      className="form-control pull-left p-1 review-text-area"
                      placeholder="Your review will help others"
                      rows="3"
                      name="text"
                      value={text}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: 'none' }}>
                <button type="button" className="review-btn" onClick={review}>
                  {' '}
                  Submit{' '}
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
      {showSend && released_status == '' && (
        <div className="rightchatBox_footer">
          <div className="input-group">
            <label className="input-group-append" id="customFile">
              <input
                type="file"
                className="custom-file-input"
                id="attachment"
                aria-describedby="fileHelp"
                onChange={handleAttachment}
              />

              <span className="input-group-text attach_btn custom-file-control form-control-file">
                <i className="fa fa-paperclip" aria-hidden="true" />
                {attachment != null && (
                  <div className="d-flex align-items-center">
                    {' '}
                    <a href={attachmentUrl} target="_blank" rel="noreferrer">
                      {attachment.name}
                    </a>{' '}
                    <i
                      className="fa fa-times pl-2"
                      onClick={removeAttachment}
                    />{' '}
                  </div>
                )}
              </span>
            </label>
            <textarea
              name=""
              className="form-control type_msg"
              placeholder="Send your details and reference Document"
              value={msg}
              onChange={(e) => handleInput(e)}
            />
            <div className="input-group-append">
              {buttonval == 'disabled' ? (
                <button className="sendBtn" disabled>
                  Sending
                </button>
              ) : (
                <button className="sendBtn" onClick={sendMsg}>
                  Send
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
