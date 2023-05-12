import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { alertBox, switchLoader } from '../../../commonRedux';
import A from '../../../components/A';
import Button from '../../../components/Button';
import Modal from '../../../components/Popup';
import Spinner from '../../../components/Spinner';
import { pic, profilePic } from '../../../globalFunctions';
import { postReport, postUnReport } from '../../../http/http-calls';
import { removeReport } from '../../../http/wallet-calls';

import { Tiles } from '../ImageView';
import GigReportModal from '../../../components/Report/gig';
import {
  bidRequest,
  getGigBids,
  getGigRequest,
  myGigs,
  removeBid,
  removeGigRequest,
} from '../../../http/gig-calls';

require('./styles.scss');

class ViewGigRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      loading: true,
      modal: false,
      deletemodal: false,
      author: false,
      bidded: 0,
      bids_pend_purchase: [],
      isGigReport: false,
      post: null,
      gig: '',
      msg: '',
      bids: [],
      gigs: [],
    };
  }

  componentDidMount() {
    this.setState(
      {
        id: this.props.match.params.id,
      },
      this.init()
    );
  }

  init = () => {
    this.getData();
    // if(this.props.currentUser != null){
    //   this.getGigs();
    // }
  };

  reportModal = () => {
    this.setState({ isGigReport: true }); // true/false toggle
  };

  unReport = (p) => {
    const con = window.confirm('Are you sure want to undo this report?');
    if (con == true) {
      postUnReport({ id: p.post._id }).then(
        async (resp) => {
          removeReport({ item_id: p.post._id }).then(
            async (resp) => {},
            (error) => {
              alertBox(true, 'Something went wrong!');
            }
          );
          alertBox(true, resp.message, 'success');
          this.setState({ reported: false });
        },
        (error) => {
          alertBox(true, error.data.message);
        }
      );
    }
  };

  report = () => {
    const { lastData } = this.state;
    const { lastI } = this.state;
    const link = `gigonomy/gig/${lastData._id}`;
    postReport({
      id: lastData._id,
      type: this.state.lastType,
      link,
      category: this.state.category,
      reason: this.state.reason,
    }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        const temp = this.state.posts;
        temp[lastI].reported = 1;
        this.setState({ reportModal: false, posts: temp });
      },
      (error) => {
        alertBox(true, error.data.message);
        this.setState({ reportModal: false });
      }
    );
  };

  getData = () => {
    try {
      getGigRequest({
        id: this.props.match.params.id,
        userid: this.props.currentUser == null ? 0 : this.props.currentUser._id,
      }).then(
        (resp) => {
          this.setState(
            {
              loading: false,
              post: resp.post,
              bidded: resp.bidded,
            },
            () => {
              if (resp.post != undefined) {
                this.getBids(resp.post._id);
                this.getGigs(resp.post.categoryId, resp.post.subCategoryId);
                if (
                  this.props.currentUser != null &&
                  resp.post.userid == this.props.currentUser._id
                ) {
                  this.setState({
                    author: true,
                  });
                }
              }
            }
          );
        },
        (err) => {
          this.setState({
            loading: false,
          });
        }
      );
    } catch (error) {
      this.setState({
        loading: false,
      });
    }
  };

  getGigs = (categoryid, subcategoryid) => {
    let sub_category_id;
    if (typeof subcategoryid === 'object' && subcategoryid.length > 0) {
      sub_category_id = subcategoryid[0];
    } else {
      sub_category_id = subcategoryid;
    }
    try {
      myGigs({
        limit: 100,
        page: 1,
        category: categoryid,
        subCategory: sub_category_id,
      }).then(
        (resp) => {
          this.setState({
            gigs: resp.post,
          });
        },
        (err) => {}
      );
    } catch (error) {
      /* empty */
    }
  };

  getBids = (id) => {
    try {
      getGigBids({ id, limit: 100, page: 1 }).then(
        (resp) => {
          this.setState({
            bids: resp,
          });
          resp.map((item) => {
            const posts_pending = [];
            item.purchases_post.map((posts) => {
              if (posts.status == 1) {
                posts_pending.push({ post_id: posts.postid, count: 1 });
              }
            });
            if (posts_pending.length > 0) {
              this.setState({
                // bids_pend_purchase: posts_pending
              });
            }
          });
        },
        (err) => {}
      );
    } catch (error) {
      /* empty */
    }
  };

  bid = () => {
    if (this.state.gig == '') {
      alertBox(true, 'You need to select a gig');
    } else {
      try {
        const selected_gigs = this.state.gigs;
        const price_extra_gigs = this.state.gigs.price_extra;
        let valid = false;
        const filters_currency = selected_gigs.filter(
          (filgigs) =>
            filgigs.preferedCurrency == this.state.post.preferedCurrency
        );
        if (
          price_extra_gigs != undefined &&
          typeof price_extra_gigs === 'object' &&
          price_extra_gigs.length > 0
        ) {
          let filters;
          price_extra_gigs.map((eitem) => {
            filters = selected_gigs.filter(
              (filgigs) => filgigs.preferedCurrency == eitem.pay_currency
            );
          });

          if (filters.length > 0) {
            valid = true;
          }
        }
        if (filters_currency > 0) {
          valid = true;
        }
        if (this.state.post.all_currency_accept == 1) {
          valid = true;
        } else {
          // valid = valid; i dont see any logic here - mani
        }
        if (valid == false) {
          alertBox(
            true,
            'please  choose a gig with preferred budget currency '
          );
        } else if (
          this.state.post.maxGigs > this.state.bids.length ||
          (this.state.post.maxGigs == 0 && valid == true)
        ) {
          switchLoader(true, 'Please wait...');
          bidRequest({
            id: this.props.match.params.id,
            gig: this.state.gig,
            msg: this.state.msg,
          }).then(
            (resp) => {
              // return false;
              if (resp.msg == undefined) {
                switchLoader();
                this.setState({
                  modal: false,
                  gig: '',
                  msg: '',
                });
                this.init();
              } else {
                switchLoader();
                this.setState({
                  modal: false,
                });
                alertBox(true, resp.msg);
              }
            },
            (err) => {
              switchLoader();
              alertBox(true, err.data.message);
            }
          );
        } else {
          alertBox(true, 'Sorry! Gigs are reached max gigs limit');
        }
      } catch (error) {
        switchLoader();
        alertBox(true, 'Error occured, try again');
      }
    }
  };

  remove = (id) => {
    switchLoader(true, 'Please wait...');
    try {
      removeBid({ id }).then(
        (resp) => {
          switchLoader();
          this.init();
        },
        (err) => {
          switchLoader();
          alertBox(true, err.data.message);
        }
      );
    } catch (error) {
      switchLoader();
      alertBox(true, 'Error occured, try again');
    }
  };

  handleCallbackReport = (data) => {
    if (data.status === 'success') {
      this.setState({
        isGigReport: data.isGigReport,
        reported: true,
      });
    } else {
      this.setState({
        isGigReport: data.isGigReport,
      });
    }
  };

  delete = () => {
    switchLoader(true, 'Please wait...');
    try {
      removeGigRequest({ slug: this.props.match.params.id }).then(
        (resp) => {
          switchLoader();
          alertBox(true, resp.message, 'success');
          window.location.href = '/passionomy/dashboard/requests';
        },
        (err) => {
          switchLoader();
          alertBox(true, err.data.message);
        }
      );
    } catch (error) {
      switchLoader();
      alertBox(true, 'Error occured, try again');
    }
  };

  confirm = (on = true) => {
    if (on) {
      this.setState({ deletemodal: !this.state.deletemodal });
    } else {
      this.setState({ deletemodal: false }, this.delete());
    }
  };

  render() {
    const { modal } = this.state;
    const { deletemodal } = this.state;
    return (
      <div className="ViewGigRequest">
        <Modal displayModal={this.state.deletemodal} closeModal={this.confirm}>
          <i className="fa-solid fa-trash-can" />
          <p className="p-2">Are you sure about deleting this?</p>
          <div>
            <Button
              variant="secondaryBtn me-2"
              size="compact"
              onClick={this.confirm}
            >
              No
            </Button>
            <Button
              variant="primaryBtn"
              size="compact"
              onClick={() => this.confirm(false)}
            >
              Yes
            </Button>
          </div>
        </Modal>
        {this.state.isGigReport && (
          <GigReportModal
            parentCallback={this.handleCallbackReport}
            isGigReport={this.state.isGigReport}
            gigId={this.state.post._id}
            type="gig_request"
          />
        )}
        <Modal
          displayModal={modal}
          closeModal={(e) => {
            this.setState({ modal: !modal });
          }}
        >
          <h3>Choose one of your gigs</h3>
          {this.state.gigs.length > 0 ? (
            <div className="mt-2">
              <select
                className="form-control"
                onChange={(e) => {
                  this.setState({ gig: e.target.value });
                }}
                value={this.state.gig}
              >
                <option value="">Select</option>
                {this.state.gigs.map((g, i) =>
                  this.state.bids_pend_purchase.length > 0 ? (
                    this.state.bids_pend_purchase[0].post_id != g._id && (
                      <option value={g._id} key={i}>
                        {g.subject} - {g.preferedCurrency} {g.standardPrice}
                      </option>
                    )
                  ) : (
                    <option key={i} value={g._id}>
                      {g.subject} - {g.preferedCurrency} {g.standardPrice}
                    </option>
                  )
                )}
              </select>
              <textarea
                className="mt-2 form-control"
                placeholder="Message (optional)"
                onChange={(e) => {
                  this.setState({ msg: e.target.value });
                }}
              />
            </div>
          ) : (
            <div className="mt-2 d-flex align-items-center justify-content-center">
              <p>
                {`You don't have any gig, please`}
                <A href="/passionomy/gigs/add" className="text-primary">
                  create
                </A>{' '}
                one and come back to this page
              </p>
            </div>
          )}
          <div className="text-end mt-1">
            {this.state.gigs.length > 0 && (
              <Button variant="primaryBtn me-2" onClick={() => this.bid()}>
                BID
              </Button>
            )}
            <Button
              onClick={(e) => {
                this.setState({ modal: !modal });
              }}
              variant="secondaryBtn"
            >
              Cancel
            </Button>
          </div>
        </Modal>
        <div className="container my-wall-container ">
          <div className="row mt-2">
            <div className="col-sm empty-container-with-out-border center-column">
              {this.state.loading ? (
                <Spinner />
              ) : this.state.post == null ? (
                <p className="no-found">No Data Found</p>
              ) : (
                <>
                  {/* New Design Start */}
                  <div className="offset-lg-2 col-lg-8 col-md-12 m-auto d-flex justify-content-center">
                    <div className="row">
                      <div className="viewReq">
                        <div className="container">
                          <div className="row">
                            <div className="col-sm">
                              <h4>{this.state.post.subject}</h4>
                            </div>
                            <div className="col-sm">
                              <div className="dropdown floRight">
                                <span className="dropdown">
                                  <i
                                    className="fa fa-ellipsis-v"
                                    aria-hidden="true"
                                  />
                                </span>
                                <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                                  {this.state.post.userid !=
                                  this.props.currentUser._id ? (
                                    this.state.reported > 0 ? (
                                      <a
                                        onClick={() =>
                                          this.unReport(this.state)
                                        }
                                        className="dropdown-item"
                                      >
                                        <i className="fa fa-undo" />
                                        <span className="m-1">Undo Report</span>
                                      </a>
                                    ) : (
                                      <a
                                        onClick={() => this.reportModal()}
                                        className="dropdown-item"
                                      >
                                        <i className="fa fa-exclamation-circle" />
                                        <span className="m-1">Report</span>
                                      </a>
                                    )
                                  ) : null}

                                  {this.state.post.userid ==
                                    this.props.currentUser._id && (
                                    <a
                                      href={`/passionomy/request/edit/${this.state.post.slug}`}
                                      className="dropdown-item"
                                    >
                                      <i className="fa fa-pencil" />
                                      <span className="m-1">Edit</span>
                                    </a>
                                  )}

                                  {this.state.post.userid ==
                                    this.props.currentUser._id && (
                                    <a
                                      onClick={(e) => this.confirm()}
                                      className="dropdown-item"
                                    >
                                      <i className="fa fa-trash" />
                                      <span className="m-1">Remove</span>
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <img
                                src={pic(
                                  this.state.post.banner != undefined
                                    ? this.state.post.banner
                                    : ''
                                )}
                                className="img-fluid gigViewsImg"
                              />
                            </div>
                            <div className="col-sm py-2">
                              <div className="viewsReqproimg">
                                <a
                                  className="text-secondary"
                                  onClick={() => {
                                    window.location.href = `/u/${this.state.post.userinfo._id}`;
                                  }}
                                  href="javascript:void(0)"
                                >
                                  {this.state.post.userinfo !== undefined ? (
                                    <img
                                      src={profilePic(
                                        this.state.post.userinfo.avatar !=
                                          undefined
                                          ? this.state.post.userinfo.avatar
                                          : '',
                                        this.state.post.userinfo.name !=
                                          undefined
                                          ? this.state.post.userinfo.name
                                          : ''
                                      )}
                                      className="img-fluid"
                                    />
                                  ) : (
                                    <img
                                      src={profilePic()}
                                      className="img-fluid"
                                    />
                                  )}
                                  <span className="desipro">
                                    {this.state.post.userinfo !== undefined &&
                                    this.state.post.userinfo.name
                                      ? this.state.post.userinfo.name
                                      : this.state.post.userinfo.username}
                                  </span>
                                </a>
                              </div>
                            </div>
                            <div className="col-sm text-right py-3">
                              <h5 className="catTitle">
                                {this.state.post.category}{' '}
                                <i
                                  className="fa fa-chevron-right"
                                  aria-hidden="true"
                                />{' '}
                                {this.state.post.subCategory}
                              </h5>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-sm">
                              <h4 className="p-1">
                                About this {this.state.post.subject}
                              </h4>
                            </div>
                            {/* <div class="col-sm">
                            <div className='likeBtns'>
                                <i className="fa fa-heart heartThis"></i>
                                <span className='count'>6</span>
                            </div>
                        </div> */}
                          </div>

                          <div className="row">
                            <div className="viewsReqpage">
                              <p>
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: this.state.post.text,
                                  }}
                                />
                              </p>
                            </div>
                          </div>
                          <div className="row">
                            <div className="galDisplayPre">
                              <label className="mb-3">
                                Reference Attachment{' '}
                              </label>
                              <Tiles data={this.state.post.contents} />
                              {/* {
                                this.state.post.contents.map((img, i) => {
                                  return <div  className="imageSec">
                                    {
                                      img.contenttype == "pdf" ? <><i class="fa fa-file-pdf-o imageSec_pdf" aria-hidden="true"></i><span class="pl-2" style={{"cursor":"pointer"}} onClick={() => window.location.href = img.content_url}>Click here</span></> : null
                                    }
                                    {
                                      img.contenttype == "docx" ? <><i class="fa fa-file-word-o imageSec_pdf" aria-hidden="true"></i><span class="pl-2"  style={{"cursor":"pointer"}} onClick={() => window.location.href = img.content_url}>Click here</span></> : null
                                    }
                                    {
                                      img.contenttype == "xls" || img.contenttype == "xlsx" ? <><i class="fa fa-file-excel-o imageSec_pdf" aria-hidden="true"></i><span class="pl-2"  style={{"cursor":"pointer"}} onClick={() => window.location.href = img.content_url}>Click here</span></> : null
                                    }
                                      {       
                                          img.contenttype == "mp4"  ? <><video controls><source src={img.content_url} type="video/mp4"></source></video></> : null
                                      }
                                      {       
                                          img.contenttype == "png" || img.contenttype == "jpeg" || img.contenttype == "jpg" || img.contenttype == "gif"  ? <><img src={img.content_url}></img></> : null
                                      }
                                  </div>
                                })
                              } */}
                            </div>
                          </div>
                          <div className="row">
                            <div className="viewreqformBox">
                              <h3>Welcome</h3>
                              <div className="viewWelcomebox">
                                <div className="row">
                                  <div className="col-md-6">
                                    <p className="pFlex pt-3 p-2">
                                      Preferred Budget :
                                      <span>
                                        <div className="form-group">
                                          <select
                                            className="form-control"
                                            id="exampleFormControlSelect1"
                                          >
                                            <option>
                                              {this.state.post.budget !=
                                                undefined &&
                                                this.state.post.budget?.toFixed(
                                                  8
                                                )}{' '}
                                              {this.state.post
                                                .preferedCurrency !=
                                                undefined &&
                                                this.state.post
                                                  .preferedCurrency}
                                            </option>
                                            {this.state.post.price_extra !=
                                              undefined &&
                                              this.state.post.price_extra
                                                .length > 0 &&
                                              this.state.post.price_extra.map(
                                                (items, i) =>
                                                  this.state.post.price_extra[
                                                    i
                                                  ] !== null &&
                                                  this.state.post.price_extra[
                                                    i
                                                  ] !== undefined && (
                                                    <option key={i}>
                                                      {
                                                        this.state.post
                                                          .price_extra[i]
                                                          .prefered_currency
                                                      }{' '}
                                                      {Number(
                                                        this.state.post
                                                          .price_extra[i]
                                                          .budget_amount
                                                      )?.toFixed(8)}{' '}
                                                      {
                                                        this.state.post
                                                          .price_extra[i]
                                                          .prefered_currency
                                                      }
                                                    </option>
                                                  )
                                              )}
                                          </select>
                                        </div>
                                      </span>
                                    </p>
                                    <p className="p-2">
                                      No of Applications :{' '}
                                      <span>
                                        {this.state.post.acceptedGig ?? 0} /{' '}
                                        {this.state.post.maxGigs == 0
                                          ? 'Infinity'
                                          : this.state.post.maxGigs}
                                      </span>
                                    </p>
                                    {/* <p className='p-2'>Accept bid with all currency : <span>{this.state.post.all_currency_accept == 1  ? 'Accepted' : "Not accepted"}</span></p> */}
                                  </div>
                                  <div className="col-md-6">
                                    <div className="pull-right pt-3">
                                      {this.state.author ? (
                                        <Button
                                          onClick={this.confirm}
                                          variant="secondaryBtn"
                                        >
                                          Delete
                                        </Button>
                                      ) : (
                                        this.state.bidded == 0 &&
                                        (this.state.post.maxGigs == 0 ||
                                          this.state.post.acceptedGig <
                                            this.state.post.maxGigs) && (
                                          <Button
                                            variant="primaryBtn"
                                            onClick={(e) => {
                                              this.props.currentUser == null
                                                ? (window.location.href = `/login?next=/passionomy/request/${this.state.post.slug}`)
                                                : this.setState({
                                                    modal: !modal,
                                                  });
                                            }}
                                          >
                                            Apply Job
                                          </Button>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="offset-lg-2 col-lg-8 col-md-12 m-auto d-flex justify-content-center">
                    <div className="row">
                      <div className="bidlistBox">
                        <h3 className="bidlistBox_count">
                          Bids <span>({this.state.bids.length})</span>
                        </h3>

                        {this.state.bids.length > 0 &&
                          this.state.bids.map((bid, i) => (
                            <React.Fragment key={i}>
                              <div className="bidlistBox_box">
                                <div className="row">
                                  <div className="col-md-3">
                                    <div className="bidPost_img">
                                      <img
                                        src={pic(
                                          bid.giginfo.banner != undefined
                                            ? bid.giginfo.banner
                                            : ''
                                        )}
                                        className="img-fluid gigViewsImg"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="bidPost_data">
                                      <h3>{bid.giginfo.subject}</h3>
                                      <div className="viewreqsproImg">
                                        <a
                                          className="text-secondary"
                                          onClick={() => {
                                            window.location.href = `/u/${bid.userid}`;
                                          }}
                                          href="javascript:void(0)"
                                        >
                                          <img
                                            src={pic(
                                              bid.userinfo.avatar != undefined
                                                ? bid.userinfo.avatar
                                                : ''
                                            )}
                                            className="img-fluid"
                                          />
                                          <span className="desipro">
                                            {bid.userinfo.name}
                                          </span>
                                        </a>
                                      </div>
                                      <p>{bid.message}</p>
                                    </div>
                                  </div>
                                  <div className="col-md-3">
                                    <div className="startData">
                                      {/* <p>Starts at</p>
                                        <h6>{bid.giginfo.preferedCurrency} {bid.giginfo.standardPrice}</h6> */}
                                      <a
                                        className="acceptedBtns"
                                        href="javascript:void(0)"
                                        onClick={() => {
                                          window.location.href = `/passionomy/gig/${bid.giginfo.slug}?request=${this.props.match.params.id}&bid=${bid._id}`;
                                        }}
                                      >
                                        View
                                      </a>
                                      {bid.status == 1 ? (
                                        <p className="text-success">Accepted</p>
                                      ) : bid.status == 0 ? (
                                        this.state.author ? (
                                          <p />
                                        ) : (
                                          <p />
                                        )
                                      ) : bid.status == 2 ? (
                                        <p className="text-success">Rejected</p>
                                      ) : bid.status == -1 ? (
                                        <p className="text-success">Canceled</p>
                                      ) : null}
                                      {bid.status === -1 ||
                                      (bid.purchases_bid_post.length === 0 &&
                                        bid.userid ===
                                          this.props.currentUser._id) ? (
                                        <button
                                          className="remBtn"
                                          onClick={() => this.remove(bid._id)}
                                        >
                                          Remove
                                        </button>
                                      ) : bid.status == 0 &&
                                        bid.userid !==
                                          this.props.currentUser._id ? (
                                        <p className="text-success">
                                          Requested
                                        </p>
                                      ) : (
                                        <p />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr />
                            </React.Fragment>
                          ))}
                      </div>
                    </div>
                  </div>
                  {/* New Design End */}
                </>
              )}
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default ViewGigRequest;
