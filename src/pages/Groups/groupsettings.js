import React from 'react';
import { Link } from 'react-router-dom';

import { alertBox } from '../../commonRedux';
import SocialActivities from '../../components/Menu/SocialActivities';
import SavedGroups from '../../components/SavedGroups/index';
import GroupWidget from '../../components/GroupWidget/index';
import Header from '../../components/Header';
import GroupMembers from '../../components/GroupMembers/index';
import images from '../../assets/images/images';
import './style/viewgrp.scss';
import './style/groupsetting.scss';
import { getAllBalance } from '../../http/wallet-calls';
import { getTagUsers } from '../../http/http-calls';
import {
  getGpCategory,
  getGroupMember,
  getSaveGroups,
  followercount,
  getallgroup,
  particularGroups,
} from '../../http/group-calls';
import AdminActivity from './admingropsettings';
import walletCheck from '../../hooks/walletCheck';

const coins = require('./json/coins.json');

class GroupSettings extends React.Component {
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
      data: {
        category: '',
        subCategory: '',
        priceFrom: '',
        priceTo: '',
        rating: '',
        key: '',
      },
      lastData: null,
      lastI: null,
      lastType: null,
      gigs: [],
      currentTab: 0,
      groupscategory: [],
      coins: [],
      groupmembers: [],
      saveGroups: [],
      follower: [],
      groupsall: [],
      groupsdata: [],
      suggestfriends: [],
    };
  }

  getAllmember() {
    const dataupdate = [];
    getGroupMember().then((res) => {
      console.log(res, 'response');
      let ii = 0;
      res.map((item, index) => {
        if (this.props.match.params.id == item._id) {
          dataupdate[ii] = {
            grop_admin: item.userid,
            userid: item.groupsMembers.userid,
            name: item.usersdata.name,
            avatar: item.usersdata.avatar,
            groupid: item.groupsMembers.group_id,
          };
          ii++;
        }
      });
      this.setState({
        groupmembers: dataupdate,
      });
    });
  }

  fetchData = (key = '') => {
    getTagUsers({ key }, true).then(
      async (resp) => {
        const suggestion_user = [];
        resp.map((item) => {
          suggestion_user.push(item);
        });
        this.setState({ suggestfriends: suggestion_user });
      },
      (error) => {}
    );
  };

  componentDidMount() {
    followercount().then((res) => {
      const result_follow = res[0];
      const followresult = [];
      for (const [key, value] of Object.entries(result_follow)) {
        // console.log(`${key}: ${value.count}`);
        followresult[key] = value;
      }
      this.setState({
        follower: followresult,
      });
    });
    this.getallgroups();
    getSaveGroups().then(
      (res) => {
        console.log(res, 'getSaveGroups');
        this.setState({
          saveGroups: res,
        });
      },
      (err) => {
        console.log(err);
      }
    );
    getGpCategory().then(
      (resp) => {
        console.log('resp', resp);
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

    const grop_id = this.props.match.params.id;
    const d = {};
    d.group_id = grop_id;
    particularGroups(d).then(
      (res) => {
        this.setState({
          groupsdata: res,
        });
      },
      (err) => {
        console.log(err);
      }
    );

    this.getAllmember();

    this.fetchData();
    this.checkWallet();
  }

  checkWallet = () => {
    walletCheck().then(
      (resp) => {
        this.getCoins();
      },
      (err) => {
        console.log(err);
      }
    );
  };

  getCoins = () => {
    getAllBalance().then(async (resp) => {
      console.log(resp, 'datasss');
      this.setState({ coins: resp.data });
    });
  };

  getallgroups(data = {}) {
    const d = data;
    d.perpage = 2;
    d.limit = 2;
    d.page = 1;
    d.show = 'visible';
    d.userid = this.props.currentUser._id;
    d.shownType = 'left';

    getallgroup(d).then(
      (resp) => {
        this.setState({
          groupsall: resp.data,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  render() {
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
              <SocialActivities
                group_id={this.props.match.params.id}
                user_id={this.props.currentUser._id}
              />
              <div className="groupAreaWrapper">
                <div className="group">
                  <span className="groupName">
                    {this.state.groupsdata.name}
                  </span>
                  <div className="groupAccessType">
                    <img src={images.locked} alt="locked" />
                    <span> {this.state.groupsdata.privacy} Group</span>
                  </div>
                  <span className="groupDescription">
                    {this.state.groupsdata.description}
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
              <div className="groupSettingsArea">
                <AdminActivity
                  currentUser={this.props.currentUser}
                  grop_id={this.props.match.params.id}
                />
              </div>
            </div>
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}
            {/* <!--  right column --> */}
            <div className="col-sm empty-container-with-out-border right-column">
              <SavedGroups
                saveGroups={this.state.saveGroups}
                group_id={this.props.match.params.id}
                follower={this.state.follower}
              />
              <GroupMembers
                group_id={this.props.match.params.id}
                groupmembers={this.state.groupmembers}
                suggestion={this.state.suggestfriends}
              />
              <GroupWidget
                follower={this.state.follower}
                groupsall={this.state.groupsall}
                joinedusers={this.state.this_session_mem_grp}
              />
            </div>
            {/* <!-- end right column --> */}
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default GroupSettings;
