import React from 'react';
import { alertBox } from '../../commonRedux';
import GroupFilter from '../../components/Filter/groupFilter';
import RewardsWidget from '../../components/RewardsWidget';
import Images from '../../assets/images/images';
import './style/groups.scss';
import ManageGroup from '../SeeAll/manage-groups';
import MemberGroup from '../SeeAll/member-groups';
import {
  mygroups,
  joinedgroups,
  getGpCategory,
  getGroupMember,
  followercount,
} from '../../http/group-calls';

class MemberGroups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 4,
      page: 1,
      perpage: 4,
      filter: 0,
      managegrop: [],
      manageusergrp: [],
      alljoingrop: [],
      data: {},
      filterdata: [],
      currentUser: this.props.currentUser,
      _id: this.props.currentUser._id,
      groupscategory: [],
      this_session_mem_grp: [],
      followerss: [],
    };
  }

  componentDidMount() {
    this.getAllmember();

    const dataa = {};
    const d = dataa;
    d.page = this.state.page;
    d.perpage = 4;
    d.limit = this.state.limit;
    d._id = this.props.currentUser._id;
    mygroups(d).then(
      (res) => {
        this.setState({
          managegrop: res.data,
        });
      },
      (err) => {
        console.log(err);
      }
    );

    getGpCategory().then(
      (resp) => {
        // console.log("resp",resp)
        if (resp.message == 'success' && resp.status == 200) {
          this.setState({
            groupscategory: resp.data,
          });
        }
      },
      (err) => {
        alertBox(true, err, 'Error');
      }
    );

    this.getJoinedGroups('all');
    this.getJoinedGroups('limit');
    followercount().then((res) => {
      const result_follow = res[0];
      const followresult = [];
      for (const [key, value] of Object.entries(result_follow)) {
        followresult[key] = value;
      }
      this.setState({
        followerss: followresult,
      });
    });
  }

  getJoinedGroups = (types) => {
    const d = {};
    if (types == 'all') {
      d._id = this.props.currentUser._id;
    } else {
      d.page = this.state.page;
      d.perpage = 4;
      d.limit = this.state.limit;
      d._id = this.props.currentUser._id;
    }
    joinedgroups(d).then(
      (res) => {
        if (types == 'all') {
          this.setState({
            alljoingrop: res.data,
          });
        } else {
          this.setState({
            manageusergrp: res.data,
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  dataChange = (data = {}) => {
    if (
      (data.category != undefined &&
        data.search != '' &&
        data.sub != undefined &&
        data.location != '') ||
      data.category != undefined ||
      data.sub != undefined ||
      (data.location != '' && data.search != '')
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
  };

  getAllmember() {
    const allmemGrp = [];
    const members = [];
    const dataupdate = [];
    const Grp = [];
    getGroupMember().then((res) => {
      let ii = 0;
      res.map((item, index) => {
        if (this.props.currentUser._id == item.groupsMembers.userid) {
          dataupdate[ii] = {
            userid: item.groupsMembers.userid,
            groupid: item.groupsMembers.group_id,
          };
          if (item.groupsMembers.memberstatus == 'left') {
            Grp[item.groupsMembers.group_id] = 'Left';
          } else {
            Grp[item.groupsMembers.group_id] = 'Joined';
          }
          ii++;
        }
      });
      allmemGrp.push(dataupdate);
      this.setState({
        groupmembers: allmemGrp[0],
        this_session_mem_grp: Grp,
      });
    });
  }

  render() {
    const groups_all = this.state.alljoingrop;
    const Grups = groups_all.map((groups, index) => (
      <>
        {this.state.this_session_mem_grp[groups.groupsdata._id] == 'Joined' ? (
          <div className="groupBlog" key={index}>
            <img
              src={groups.groupsdata.banner}
              alt="img"
              style={{ width: 80 }}
            />
            <div className="rightArea">
              {this.state.this_session_mem_grp[groups.groupsdata._id] ==
                'Joined' ||
              this.props.currentUser._id == groups.groupsdata.userid ? (
                <p
                  onClick={(e) =>
                    (window.location.href = `/viewgroup/${groups.groupsdata._id}`)
                  }
                >
                  {groups.groupsdata.name}
                </p>
              ) : (
                <p>{groups.groupsdata.name}</p>
              )}

              <div className="dp-flex">
                <div>
                  <ul>
                    {this.state.followerss[groups.groupsdata._id] ? (
                      <li>
                        {this.state.followerss[groups.groupsdata._id]} followers
                      </li>
                    ) : (
                      <li>0 followers</li>
                    )}

                    <li>10 post /day</li>
                  </ul>
                </div>
                <span className="al-r freeText">
                  {groups.groupsdata.purchase_type.toUpperCase()}
                </span>
              </div>
              <div className="dp-flex">
                <div>
                  <img src={Images.shareIcon} alt="shareIcon" />
                  <span className="shareText"> SHARE</span>
                </div>
                {/* {
        (this.state.this_session_mem_grp[groups._id] != undefined) ? (console.log(this.state.this_session_mem_grp[groups._id],"inrender")) : ""
      } */}
                {/* <JoinButton currentUser={this.props.currentUser} groupsmemall = {this.state.groupmembers} group_id={groups._id}/> */}

                {this.state.this_session_mem_grp[groups.groupsdata._id] ==
                'Joined' ? (
                  <button className="al-r">Joined</button>
                ) : (
                  ''
                )}

                {this.props.currentUser._id != groups.groupsdata.userid &&
                this.state.this_session_mem_grp[groups.groupsdata._id] !=
                  'Joined' ? (
                  <button
                    className="al-r"
                    onClick={(e) => this.handleJoin(groups.groupsdata._id)}
                  >
                    Join
                  </button>
                ) : (
                  ''
                )}

                {this.props.currentUser._id == groups.groupsdata.userid ? (
                  <button className="al-r">Created By You</button>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </>
    ));

    return (
      <div className="firstTimeGroupFilterPage">
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
              <div className="groupsContainer">
                <div className="heading">
                  <div>
                    <p>Joined Groups</p>
                  </div>
                </div>
                <div className="groupBlogArea">{Grups}</div>
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

export default MemberGroups;
