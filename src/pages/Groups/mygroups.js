import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import GroupFilter from '../../components/Filter/groupFilter';
import RewardsWidget from '../../components/RewardsWidget';
import { alertBox } from '../../commonRedux';
import Images from '../../assets/images/images';
import ManageGroup from '../SeeAll/manage-groups';
import MemberGroup from '../SeeAll/member-groups';
import * as group from '../../http/group-calls';
import Share from '../../components/Post/Share';
import { history } from '../../store';

import './style/mygroups.scss';

class Mygroups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
      currentdata: '',
      limit: 4,
      page: 1,
      filter: 0,
      hasMore: false,
      managegrop: [],
      usergroups: [],
      manageusergrp: [],
      mygroupsall: [],
      data: {},
      followerss: [],
      filterdata: [],
      currentUser: this.props.currentUser,
      _id: this.props.currentUser._id,
      groupscategory: [],
      saveposts: [],
      saveGroups: [],
      groupmembers: [],
      this_session_mem_grp: [],
      allmemberCnt: 0,
      postcounts: [],
      groupsall: [],
    };
  }

  componentDidMount() {
    const dataa = {};
    const d = dataa;
    this.setState({
      currentdata: this.props.match.params.id,
    });
    if (this.props.match.params.id == 'all') {
      d._id = this.props.currentUser._id;
    } else {
      d.page = this.state.page;
      d.perpage = 4;
      d.limit = this.state.limit;
      d._id = this.props.currentUser._id;
    }
    this.getAllmember();
    this.mygroups('');
    // group.mygroups(d).then((res) => {
    //   this.setState({
    //     managegrop: res.data,
    //     // usergroups: res.data
    //   });
    //   var usergroup = res.data;
    //   let count = 1
    //   let allmem = 0;
    //   usergroup.map((items) => {
    //    ;
    //     Memberget(items._id,this.props.currentUser._id).then((members) => {
    //       allmem += members.member.length;
    //       if(usergroup.length == count){
    //         this.setState({allmemberCnt:allmem})
    //       }
    //       count++;
    //     });
    //   })
    // }, (err) => {
    //   console.log(err)
    // });

    group.followercount().then((res) => {
      const result_follow = res[0];
      const followresult = [];
      for (const [key, value] of Object.entries(result_follow)) {
        followresult[key] = value;
      }
      this.setState({
        followerss: followresult,
      });
    });
    group.joinedgroups(d).then(
      (res) => {
        this.setState({
          manageusergrp: res.data,
        });
      },
      (err) => {
        console.log(err);
      }
    );

    group.getSavepost().then(
      (res) => {
        this.setState({
          saveposts: res,
        });
      },
      (err) => {
        console.log(err);
      }
    );

    group.getSaveGroups().then(
      (res) => {
        this.setState({
          saveGroups: res,
        });
      },
      (err) => {
        console.log(err);
      }
    );

    // PostCount().then((res) => {
    //   console.log(res.postdatas[0], 'res');
    //   this.setState({ postcounts: res.postdatas });
    //   console.log(this.state.postcounts, 'postcount');
    // });
  }

  dataChange = (data = {}) => {
    console.log(data, 'data', Object.keys(data).length);
    if (Object.keys(data).length > 0) {
      if (
        (data.category != undefined &&
          data.search != '' &&
          data.sub != undefined &&
          data.location != '' &&
          data.value != '') ||
        data.search != '' ||
        data.category != undefined ||
        data.sub != undefined ||
        data.location != '' ||
        data.value != ''
      ) {
        this.setState({
          current: '',
          data,
          filter: 1,
        });
      } else {
        this.setState({
          current: '',
          data,
          filter: 0,
        });
      }
    } else {
      this.setState({
        current: '',
        data,
        filter: 0,
      });
    }
  };

  getAllmember() {
    const allmemGrp = [];
    const members = [];
    const dataupdate = [];
    const Grp = [];
    group.getGroupMember().then((res) => {
      let ii = 0;
      res.map((item, index) => {
        if (this.props.currentUser._id == item.groupsMembers.userid) {
          dataupdate[ii] = {
            userid: item.groupsMembers.userid,
            groupid: item.groupsMembers.group_id,
          };
          Grp[item.groupsMembers.group_id] = 'Joined';
          ii++;
        }
      });

      allmemGrp.push(dataupdate);

      this.setState({
        groupmembers: allmemGrp[0],
        this_session_mem_grp: Grp,
      });
      // this.Dynamic();
    });
  }

  datediffer = (date1) => {
    const dates = new Date(date1);
    const date2 = new Date();
    const diffMs = date2 - dates;
    const diffDays = Math.floor(diffMs / 86400000); // days
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    // var convert = [];
    // convert.push({"days":diffDays,"hours":diffHrs,"mint":diffMins})
    if (diffDays > 0) {
      return `${diffDays} days ago`;
    }
    if (diffHrs > 1) {
      return `${diffHrs} hours ago`;
    }
    if (diffMins == '0') {
      return 'Just now';
    }
    return `${diffMins} minutes ago`;
  };

  changeTab = (newValue) => {
    if (newValue == 3) {
      this.mygroups('draft');
    }
    this.setState({ currentTab: newValue });
  };

  getSelectedTabClassName = (tabValue) => {
    const { currentTab } = { ...this.state };
    if (tabValue === currentTab) return 'tab selected';
    return 'tab';
  };

  handlePopupOpenClose = (event) => {
    this.props.history.push('/group');
  };

  handleallgroups = (event) => {
    this.props.history.push('/mygroup/all');
  };

  handleGroups = (group_id) => {
    this.props.history.push(`/tribesfeeds/${group_id}`);
  };

  sharePost = (groups) => {
    this.setState({ shareModel: true, currPost: groups });
  };

  shareSuccess = () => {
    alertBox(true, 'Group Shared Successfully!', 'success');
    history.push('/home');
  };

  closeShareModal = () => {
    this.setState({ shareModel: false });
  };

  mygroups = (mode) => {
    const d = {};
    d.mine = 'true';
    d.limit = this.state.limit;
    d.page = this.state.page;
    d.userid = this.props.currentUser._id;
    if (mode != '') {
      d.draft = '1';
    }
    group.getallgroup(d).then(
      (resp) => {
        if (resp.data.length > 0) {
          const hasMore = resp.data.length > 0;
          const mergedArray = [...this.state.groupsall, ...resp.data];
          const uniqueItems = Object.values(
            mergedArray.reduce((acc, item) => {
              acc[item._id] = item;
              return acc;
            }, {})
          );

          this.setState({
            usergroups: uniqueItems,
            hasMore, // update hasMore based on API response
          });
        } else {
          this.setState({
            hasMore: false,
          });
        }
      },
      (err) => {
        this.setState({
          hasMore: false,
        });
      }
    );
  };

  fetchMoreData = () => {
    console.log('testss');
    this.setState(
      (prevState) => ({
        ...prevState,
        page: prevState.page + 1,
      }),
      () =>
        this.props.limit == undefined
          ? this.mygroups({})
          : this.setState({ hasMore: false })
    );
  };

  render() {
    const Grupsall = this.state.usergroups.map((groups, index) => (
      <div className="groupBlog" key={index}>
        <img src={groups.banner} alt="img" style={{ width: 100 }} />
        <div className="rightArea">
          <p onClick={() => this.handleGroups(groups._id)}>{groups.name}</p>
          <div className="dp-flex">
            <div>
              <ul>
                {this.state.followerss[groups._id] ? (
                  <li>{this.state.followerss[groups._id]} followers</li>
                ) : (
                  <li>0 followers</li>
                )}
                <li>
                  {this.state.postcounts[0] != undefined
                    ? this.state.postcounts[0][groups._id]
                    : 0}{' '}
                  post /day
                </li>
              </ul>
            </div>
          </div>
          <div className="dp-flex">
            <div onClick={(e) => this.sharePost(groups)}>
              <img src={Images.shareIcon} alt="shareIcon" />
              <span className="shareText"> SHARE</span>
            </div>
            <span className="al-r freeText">
              {groups.purchase_type.toUpperCase()}{' '}
            </span>
          </div>
        </div>
      </div>
    ));

    return (
      <div className="registerUser">
        <div className="container my-wall-container ">
          <div className="row mt-2">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column">
              <GroupFilter
                dataChange={this.dataChange}
                groupscategory={this.state.groupscategory}
              />
              <ManageGroup userGroups={this.state.managegrop} />
              <MemberGroup usermanagegrp={this.state.manageusergrp} />
              {/* <AllSuggested /> */}
            </div>
            {/* <!-- end left column --> */}

            {/* <!-- center column --> */}
            <div className="col-sm empty-container-with-out-border center-column">
              {this.state.shareModel && (
                <Share
                  sharedtype="group"
                  post={this.state.currPost}
                  shareSuccess={this.shareSuccess}
                  closeShareModal={this.closeShareModal}
                />
              )}
              {this.state.currentdata !== 'all' && (
                <>
                  <div className="profileWrapper">
                    <div className="profileSummary">
                      <span className="heading">My Profiles</span>
                      <div className="summary">
                        <div>
                          <span className="sum">
                            {this.state.usergroups.length}{' '}
                          </span>
                          <span>No of Groups</span>
                        </div>
                        <div>
                          {this.state.allmemberCnt > 1000 ? (
                            <span className="sum">
                              {this.state.allmemberCnt} K
                            </span>
                          ) : (
                            <span className="sum">
                              {this.state.allmemberCnt}
                            </span>
                          )}

                          <span> Members</span>
                        </div>
                      </div>
                    </div>
                    <div className="hLine" />

                    <div className="header">
                      <div className="leftArea">
                        <div
                          className={this.getSelectedTabClassName(0)}
                          onClick={() => this.changeTab(0)}
                        >
                          <span className="tabName">All</span>
                        </div>
                        <div
                          onClick={() => this.changeTab(1)}
                          className={this.getSelectedTabClassName(1)}
                        >
                          <span className="tabName">Wishlist</span>
                        </div>
                        <div
                          onClick={() => this.changeTab(3)}
                          className={this.getSelectedTabClassName(3)}
                        >
                          <span className="tabName">Draft</span>
                        </div>
                      </div>
                      <div className="rightArea">
                        <button
                          className="primaryBtn"
                          onClick={() => this.handlePopupOpenClose()}
                        >
                          Add Groups
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="hLine" />
                </>
              )}
              <div className="profileWrapper">
                <div className="groupsContainer">
                  <div className="heading">
                    <div>
                      <p>My Groups</p>
                      <span>My Groups you might be interested in</span>
                    </div>
                  </div>
                  <div className="groupBlogArea">
                    <InfiniteScroll
                      initialLoad={false}
                      pageStart={0}
                      // dataLength={this.state.posts.length}
                      loadMore={this.fetchMoreData}
                      hasMore={this.state.hasMore}
                    >
                      {Grupsall}
                    </InfiniteScroll>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm empty-container-with-out-border right-column">
              <RewardsWidget {...this.props} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Mygroups;
