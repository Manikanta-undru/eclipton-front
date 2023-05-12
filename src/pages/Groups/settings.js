import React from 'react';
import { Link } from 'react-router-dom';
import { alertBox } from '../../commonRedux';
import AdminActivity from './adminActivity';
import ScheduledPosts from './scheduledPosts';
import MemberRequest from './memberRequest';
import GroupPurchasedPlan from './groupPurchase';
import PaymentGroup from './PaymentGroup';
// import Notification from "./notification/index";
// import CreateRules from "./createRules";
// import MembershipQuestions from "./membershipQuestions";
// import MemberReported from "./memberReported";

import {
  particularGroups,
  getGroupMember,
  ChangeMemberStatus,
  getPosts,
  findGroups,
} from '../../http/group-calls';
import { Memberget } from '../../GroupFunctions';

import './style/settings.scss';
import Header from '../../components/Header';
import SocialActivities from '../../components/Menu/SocialActivities';
import images from '../../assets/images/images';

class settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 4,
      page: 1,
      cid: 0,
      posts: [],
      category: '',
      reason: '',
      reportModal: false,
      groupStatus: '',
      groupsdet: [],
      currentTab: 1,
      pendingmembers: [],
      schedulePost: [],
      isload: false,
      paymentDet: {},
    };
  }

  componentDidMount() {
    const grop_id = this.props.match.params.id;
    const d = {};
    d.group_id = grop_id;
    findGroups(d).then((res) => {
      if (res.extend_payment_status == 'Overdue') {
        this.changeTab(11);
        // this.setState({paymentDet:res,isload:true})
      }
      this.setState({ paymentDet: res, isload: true });
    });
    const userid = this.props.currentUser._id;

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
    const schedulePosts = [];
    // d['group_id'] = this.props.match.params.id;
    d.page = 1;
    d.limit = 5;
    getPosts(d).then(
      (result) => {
        console.log(result.data, 'res.data');

        // if (result.message == "success") {
        //   let i = 0;
        //   var data = result.data
        //   data.map((item,index)=>{
        //     var postdate = new Date(item.groupspost.createdAt).toISOString().split('T')[0];
        //     var currentDate = new Date().toISOString().split('T')[0];
        //   if(item.groupspost.schedulepost == true && item.groupspost.userid == this.props.currentUser._id && currentDate < postdate){
        //      schedulePosts[i] = item
        //       i++;
        //   }
        //   });
        //   this.setState({
        //     schedulePost: schedulePosts,
        //   });
        // } else {
        //   alertBox(true, result.message, "Error");
        // }
      },
      (err) => {
        alertBox(true, err, 'Error');
      }
    );

    const dataupdate = [];
    getGroupMember().then((res) => {
      let ii = 0;
      res.map((item, index) => {
        if (item.groupsMembers.approval_type == 'pending') {
          dataupdate[ii] = {
            member_position: '',
            username: item.usersdata.name,
            userid: item.groupsMembers.userid,
            groupid: item.groupsMembers.group_id,
            approval_type: item.groupsMembers.approval_type,
          };
          ii++;
        }
      });
      this.setState({
        pendingmembers: dataupdate,
      });
    });

    Memberget(grop_id, userid).then((res) => {
      const groupdata = this.state.groupsdet;
      this.setState({
        groupStatus: res.create_staus,
      });
      if (
        groupdata.post_permission == 'any' &&
        groupdata.userid != this.props.currentUser._id &&
        this.state.groupStatus == '' &&
        this.state.paymentDet.extend_payment_status === undefined
      ) {
        this.setState({
          currentTab: 3,
        });
      }
    });
  }

  handleLeaveGroup = () => {
    const gropid = this.props.match.params.id;
    const memberid = this.props.currentUser._id;
    const d = {};
    d.user_id = memberid;
    d.group_id = gropid;
    d.leaveGroup = 1;
    ChangeMemberStatus(d).then(
      (res) => {
        if (res.message == 'error') {
          alertBox(true, res.errors);
        } else if (res.message == 'success') {
          alertBox(true, 'Successfully left from group', 'Success');
          setTimeout(() => {
            window.location.href = '/membergroups';
          }, 3000);
        } else {
          alertBox(true, res.message, 'Error');
        }
      },
      (err) => {
        alertBox(true, err, 'Error');
      }
    );
  };

  changeTab = (newValue) => {
    this.setState({ currentTab: newValue });
  };

  render() {
    const { currentTab: tabValue } = { ...this.state };
    return (
      <div className="viewEditGroupModerator">
        <Header
          appName={this.props.appName}
          currentUser={this.props.currentUser}
        />
        <div className="container my-wall-container ">
          <div className="row mt-2">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column">
              {this.state.paymentDet.extend_payment_status === undefined &&
              this.state.isload == true ? (
                <SocialActivities
                  group_id={this.props.match.params.id}
                  user_id={this.props.currentUser._id}
                />
              ) : null}
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
              <div className="createPersonalEventAreaWrapper groupSettingsArea">
                {tabValue == 1 && this.state.isload == true && (
                  <AdminActivity
                    group_id={this.props.match.params.id}
                    currentUser={this.props.currentUser}
                  />
                )}
                {/* {tabValue === 2 && <TopicsForPost />} */}
                {tabValue === 3 && (
                  <ScheduledPosts group_id={this.props.match.params.id} />
                )}
                {tabValue === 4 && (
                  <MemberRequest
                    group_id={this.props.match.params.id}
                    currentUser={this.props.currentUser._id}
                    members={this.state.pendingmembers}
                  />
                )}
                {/* {tabValue === 4 && <MemberRequest />}
                {tabValue === 5 && <Notification />}
                {tabValue === 6 && <CreateRules />}
                {tabValue === 7 && <MembershipQuestions />}
                {tabValue === 8 && <MemberReported />} */}
                {tabValue === 9 && (
                  <GroupPurchasedPlan
                    group_id={this.props.match.params.id}
                    currentUser={this.props.currentUser}
                  />
                )}
                {tabValue === 11 && (
                  <PaymentGroup
                    group_id={this.props.match.params.id}
                    currentUser={this.props.currentUser}
                  />
                )}
              </div>
            </div>
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}
            <div className="col-sm empty-container-with-out-border right-column">
              <div className="ListGroup">
                <ul className="list-group">
                  {this.state.groupStatus == 'active' ||
                  this.state.groupsdet.userid == this.props.currentUser._id ? (
                    <>
                      {' '}
                      <li
                        onClick={() => this.changeTab(1)}
                        className="list-group-item d-flex active justify-content-between align-items-center"
                      >
                        Admin Activity
                      </li>
                      <li
                        onClick={() => this.changeTab(3)}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        Scheduled Posts
                        <span className="badge badge-primary badge-pill">
                          {this.state.schedulePost.length}
                        </span>
                      </li>
                      <li
                        onClick={() => this.changeTab(4)}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        Member Requests
                        <span className="badge badge-primary badge-pill">
                          {this.state.pendingmembers.length}
                        </span>
                      </li>
                      {this.state.groupsdet.userid ==
                      this.props.currentUser._id ? (
                        <li
                          onClick={() => this.changeTab(9)}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          Group Plan settings
                        </li>
                      ) : (
                        <>
                          {this.state.groupsdet.purchase_type == 'paid' ? (
                            <li
                              onClick={() => this.changeTab(11)}
                              className="list-group-item d-flex justify-content-between align-items-center"
                            >
                              Group Purchased Plan
                            </li>
                          ) : (
                            ''
                          )}
                        </>
                      )}
                      {this.state.groupStatus == 'active' &&
                      this.state.groupsdet.userid !=
                        this.props.currentUser._id ? (
                        <li
                          onClick={() => this.handleLeaveGroup()}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          Leave Group
                        </li>
                      ) : (
                        ''
                      )}
                      {/* <li
                    onClick={() => this.changeTab(10)}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    Insights
                  </li>  */}
                    </>
                  ) : (
                    <>
                      {this.state.groupsdet.post_permission == 'any' &&
                      this.state.paymentDet.extend_payment_status ===
                        undefined ? (
                        <li
                          onClick={() => this.changeTab(3)}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          Scheduled Posts
                          <span className="badge badge-primary badge-pill">
                            {this.state.schedulePost.length}
                          </span>
                        </li>
                      ) : (
                        ''
                      )}
                      {this.state.groupsdet.purchase_type == 'paid' ? (
                        <li
                          onClick={() => this.changeTab(11)}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          Group Purchased Plan
                        </li>
                      ) : (
                        ''
                      )}

                      <li
                        onClick={() => this.handleLeaveGroup()}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        Leave Group
                      </li>
                    </>
                  )}
                </ul>
              </div>
              {/* <CreateGigWidget extra={true} />
                    <PopularGigs /> */}
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default settings;
