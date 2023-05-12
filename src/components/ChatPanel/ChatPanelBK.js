/* eslint-disable react/jsx-key */
import React, { useRef } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PermScanWifiOutlinedIcon from '@material-ui/icons/PermScanWifiOutlined';
import CheckIcon from '@material-ui/icons/Check';
import TextField from '@material-ui/core/TextField';
import ListItemText from '@material-ui/core/ListItemText';
import Spinner from '../Spinner';
import UploadModal from '../UploadModal/UploadModal';
import Modal from '../Popup';

import {
  addGigChat,
  getGigChat,
  gigStatusUpdate,
  gigSubmit,
  gigRating,
} from '../../http/gig-calls';
import './Chat.scss';
import { profilePic, pic } from '../../globalFunctions';
import { alertBox, switchLoader } from '../../commonRedux';
import { gigRelease } from '../../http/wallet-calls';

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
        <div className="payment-cost">
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
                <span className="pull-right">
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
  const [feedback, setFeedback] = React.useState(null);
  const [submitAttachments, setSubmitAttachments] = React.useState([]);
  const [attachmentUrl, setAttachmentUrl] = React.useState('');
  const [messagesEnd, setMessagesEnd] = React.useState(null);
  const messagesEndRef = useRef(null);
  let Eclipton;

  React.useEffect(() => {
    scrollToBottom();
    getData();
  }, [props.chat]);

  const getData = () => {
    if (props.chat != null) {
      const data = {
        order_id: props.chat._id,
        gig: props.chat.postid,
      };
      getGigChat(data).then((resp) => {
        setUser(resp.user);
        setCreator(resp.creator);
        setGig(resp.gig);
        setPurchase(resp.purchase);
        setChat(resp.chat);
        setFeedback(resp.rating);
        if (resp.log != null) {
          const lo = resp.log;
          lo.attachments = JSON.parse(lo.attachments);
          setLog(lo);
        }
        scrollToBottom();
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
          const st = 3;
          const da = {
            data,
            status: st,
            id: purchase._id,
          };
          gigStatusUpdate(da).then(
            (resp) => {
              switchLoader();
              const temp = { ...purchase };
              temp.data = data;
              setPurchase(temp);
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
    const st = 3;
    const da = {
      data,
      status: st,
      id: purchase._id,
    };
    setModal(false);
    setPreviewModal(false);
    gigStatusUpdate(da).then(
      (resp) => {
        switchLoader();
        const temp = { ...purchase };
        temp.data = data;
        setPurchase(temp);
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
  const openReleaseModal = () => {
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
    const file = e.target.files[0];
    setAttachment(file);
    const reader = new FileReader();
    // it's onload event and you forgot (parameters)
    reader.onload = function (e) {
      // var image = document.getElementById(name+"_preview");
      // image.src = e.target.result;
      setAttachmentUrl(e.target.result);
    };
    // you have to declare the file loading
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachmentUrl('');
    setAttachment(null);
    document.getElementById('attachment').value = null;
  };

  const handleSubmit = () => {
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
          alertBox(true, 'Gig submitted for approval', 'success');
          props.updateStatus(3);
          window.location.href = '';
          getData();
        },
        (err) => {
          switchLoader();
          alertBox(true, err.data.message);
        }
      );
    }
  };
  const scrollToBottom = () => {
    const objDiv = document.getElementsByClassName('chat-container')[0];
    if (objDiv != undefined) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
    if (messagesEndRef.current != null) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
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
    props.panel == 'seller' ||
    (data.giguserinfo != undefined &&
      data.giguserinfo._id == props.currentUser._id)
  );
  data.buyerPanel = !!(
    props.panel == 'buyer' ||
    (data.userinfo != undefined && data.userinfo._id == props.currentUser._id)
  );
  const showAccept =
    data.sellerPanel &&
    purchase.status == 1 &&
    props.currentUser._id == data.gigs.userid;
  const showSend = purchase.status == 2 || purchase.status == 3;
  const released_status =
    props.chat.data.released != undefined && props.chat.data.released == true
      ? props.chat.data.released
      : '';
  return (
    <Paper
      variant="outlined"
      square
      className={`chat-panel ${showSend ? 'accepted-view' : ' pending-view'}`}
    >
      <div className="chat-header">
        <div className="chat-user-info">
          <Avatar src={profilePic(user.avatar, user.name)} alt={user.name} />
          {data.userid == props.currentUser._id &&
          data.giguserinfo != undefined ? (
            <span className="chat-user-name">{data.giguserinfo.name}</span>
          ) : (
            <span className="chat-user-name">{user.name}</span>
          )}
        </div>
        {purchase.status >= 2 &&
          released_status == '' &&
          data.sellerPanel &&
          data.gigs.userid == props.currentUser._id &&
          data.status != 1 && (
            <div className="buyer-submit">
              <div className="buyer-submit-text">
                Submit all files for payment release
              </div>
              <div>
                <Fab
                  variant="extended"
                  size="small"
                  color="primary"
                  aria-label="add"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Submit &amp; close the project
                </Fab>
              </div>
            </div>
          )}
      </div>
      <div className="chat-container" ref={messagesEndRef}>
        <div className="chat-text-area">
          <div className="chat-content buyer-chat">
            <HandShake placement="start" text="Handshake initiated" />
          </div>

          <div className="chat-content buyer-chat">
            <OrderPreview gig={gig} purchase={purchase} />
          </div>

          {data.buyerPanel && (
            <>
              {purchase.status == 1 && (
                <div className="chat-content buyer-chat">
                  <WithUserImage
                    displayName
                    data={data}
                    text="Waiting for mutal handshake from the seller"
                  />
                </div>
              )}
            </>
          )}

          {purchase.status == 2 && (
            <div className="chat-content seller-chat">
              <div className="user-image-hand">
                {/* {data.buyerPanel &&
                        <Avatar src={user.image}  alt={user.name} />
                      } */}
                <HandShake
                  placement={data.buyerPanel ? 'end' : 'start'}
                  text="Handshake Accepted"
                />
              </div>
            </div>
          )}
        </div>
        {showAccept && (
          <div className="chat-accept">
            <div className="accept-total text-center">
              <div className="total-amount">
                {purchase.currency} {purchase.amount}
              </div>
              <Button
                onClick={accept}
                variant="contained"
                style={{ backgroundColor: '#8bc34a' }}
              >
                Accept Handshake
              </Button>
            </div>
            <div>
              <Button
                onClick={reject}
                variant="contained"
                style={{ backgroundColor: '#ff3d00' }}
              >
                Reject
              </Button>
            </div>
          </div>
        )}

        {chat.map((c, i) => (
          <div
            className={`chat-content ${
              c.sender == gig.userid ? 'seller' : 'buyer'
            }-chat`}
            key={i}
          >
            <div className="user-image-hand">
              {c.sender != props.currentUser._id && (
                <Avatar
                  className="chatPic"
                  src={pic(data.buyerPanel ? creator.avatar : user.avatar)}
                  alt={data.buyerPanel ? creator.name : user.name}
                />
              )}
              <p className="message">
                {c.message}

                {c.attachment != undefined &&
                  c.attachment != null &&
                  c.attachment != '' && (
                    <div className="chat-attach">
                      <a href={c.attachment} target="_blank" rel="noreferrer">
                        {c.attachmentType == 'Image' ? (
                          <img src={c.attachment} />
                        ) : (
                          <>
                            <i className="fa fa-file" /> view attachment
                          </>
                        )}
                      </a>
                    </div>
                  )}
              </p>

              {c.sender == props.currentUser._id && (
                <Avatar
                  className="chatPic"
                  src={pic(props.currentUser.avatar)}
                  alt={props.currentUser.name}
                />
              )}
            </div>
          </div>
        ))}

        {purchase.status == 3 && (
          <div className="chat-content seller-chat">
            <div className="d-flex align-items-start ">
              {
                // c.sender != props.currentUser._id && <Avatar className="chatPic" src={pic(data.buyerPanel ? creator.avatar : user.avatar)}  alt={data.buyerPanel ? creator.name : user.name} />
                data.buyerPanel && (
                  <Avatar
                    className="chatPic"
                    src={pic(user.avatar)}
                    alt={user.name}
                  />
                )
              }

              {data.data.released != 'not-accept' ? (
                data.buyerPanel ? (
                  <p className="message">
                    {`${user.name} has submitted all the files. Release the  payments and download the file.`}
                  </p>
                ) : (
                  <p className="message">
                    {' You have submitted the files and closed the project'}
                  </p>
                )
              ) : null}

              {data.data.released == 'not-accept' ? (
                <p className="message">
                  {' Previous submitted files was rejected'}
                </p>
              ) : (
                ''
              )}
              {
                // c.sender != props.currentUser._id && <Avatar className="chatPic" src={pic(data.buyerPanel ? creator.avatar : user.avatar)}  alt={data.buyerPanel ? creator.name : user.name} />
                data.sellerPanel && (
                  <Avatar
                    className="chatPic"
                    src={pic(creator.avatar)}
                    alt={creator.name}
                  />
                )
              }
            </div>
            {data.buyerPanel && (
              <div className="release-payment">
                <div className="release-payment-logo">
                  <PermScanWifiOutlinedIcon />
                </div>
                <div className="release-payment-btn">
                  <Button
                    variant="contained"
                    style={{ backgroundColor: '#5931ea' }}
                    onClick={openReleaseModal}
                  >
                    {purchase.data.released
                      ? 'Download Files'
                      : 'Release Payment and Download Files'}
                  </Button>
                </div>
                {/* <div className="release-payment-text">FOUNDATION</div> */}
                {feedback == null ? (
                  <div className="release-payment-btn">
                    <Button
                      variant="contained"
                      style={{ backgroundColor: '#5931ea' }}
                      onClick={openReviewModal}
                    >
                      Feedback
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="rating-text">
                      {[1, 2, 3, 4, 5].map((e, i) => {
                        if (e <= feedback.rating) {
                          return <i className="fa fa-star" key={i} />;
                        }
                        return <i className="fa fa-star-o" />;
                      })}
                    </p>
                    <p className="review-text">{`"${feedback.review}"`}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

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
                        log.attachments.map((l, r) => (
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
                        ))
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

        {/* Preview Modal */}
        {/* <Modal displayModal={previewModal} closeModal={closepreviewModal} >
            <div className='review-modal'>
              <div className="d-flex align-items-center">
                <div className='container mt-4 purchase-modal'>
                  <h5 style={{ fontWeight: 'bold', marginBottom: '1rem', marginLeft:'0.5rem' }} >All files</h5>
                  <div className='row'>
                    <div className='col down-hold' style={{textAlign: 'center'}}>
                      
                          <div className="down-item">
                          <img src={preview}></img>
                         </div>
                         <div style={{"position":"relative","top":"50%","right":"10%"}}>
                         <i className="fa fa-eye-slash"  onClick={(e) => handleUnsetPreview(preview)}></i>

                         </div>
                    </div>
                  </div>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                </div>
              </div>
              {
                purchase.data.released ? null : <div className="modal-footer" style={{ borderTop: 'none' }}>
                Release the full payment to download all original files<button type="button" className="review-btn" style={{marginLeft: '1rem'}} onClick={release}> Release </button>
              </div>
              }
              
            </div>
          </Modal> */}

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
                        style={{ borderRadius: '50%' }}
                        className="media-object pic "
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
        <div className="chat-send">
          <TextField
            placeholder="Send details and reference documents"
            variant="outlined"
            fullWidth
            className="send-input"
            value={msg}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />

          <div className="send-attach">
            <div
              className="attach-file"
              onClick={() => {
                document.getElementById('attachment').click();
              }}
            >
              <AttachFileIcon />
              <input
                type="file"
                name="attachment"
                id="attachment"
                style={{ display: 'none' }}
                onChange={handleAttachment}
              />
              <span>PNG, Jpeg, SVG, PDF, Docs, XLS, MP4, MP3</span>
            </div>
            {attachment != null && (
              <div className="d-flex align-items-center">
                {' '}
                <a href={attachmentUrl} target="_blank" rel="noreferrer">
                  {attachment.name}
                </a>{' '}
                <i className="fa fa-times pl-2" onClick={removeAttachment} />{' '}
              </div>
            )}
            <div className="send-btn">
              <Button
                variant="contained"
                style={{ backgroundColor: '#5931ea' }}
                onClick={sendMsg}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </Paper>
  );
}
