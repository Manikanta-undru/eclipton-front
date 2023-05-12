import React from 'react';
import { alertBox } from '../../commonRedux';
import {
  getGroupMember,
  followercount,
  JoinMember,
  particularGroups,
} from '../../http/group-calls';
import Images from '../../assets/images/images';
import './style/groups.scss';
import { history } from '../../store';
import Share from '../../components/Post/Share';
import { PostCount } from '../../GroupFunctions';

function Imageview(props) {
  let image_url = '';
  if (props.imageid == 0) {
    image_url = Images.image53;
  } else if (props.imageid == 1) {
    image_url = Images.image54;
  } else if (props.imageid == 2) {
    image_url = Images.image55;
  } else {
    image_url = Images.image56;
  }
  return <img src={image_url} alt="img" />;
}

class PopularGroups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 4,
      page: 1,
      perpage: 3,
      populargrop: this.props.populargrop,
      currentUser: this.props.currentUser,
      this_session_mem_grp: [],
      followerss: [],
      postcount: [],
    };
    this.postdatas();
  }

  componentDidMount() {
    // this.getRequests();
    this.getAllmember();
    this.postdatas();

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

  // getRequests = (data = {}) => {
  //   this.setState({
  //     posts: [],
  //   });
  //   var d = data;
  //   d["page"] = this.state.page;
  //   d["limit"] = this.state.limit;
  //   d["perpage"] = this.state.perpage;
  //   getallgroup(data).then(
  //     (resp) => {
  //       this.setState({
  //         populargrop: resp.data,
  //       });
  //     },
  //     (err) => { }
  //   );
  // };

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
          } else if (item.groupsMembers.approval_type == 'pending') {
            Grp[item.groupsMembers.group_id] = 'Requested';
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
      // this.Dynamic();
    });
  }

  postdatas = (d = {}) => {
    PostCount(d).then((res) => {
      this.setState({ postcount: res });
    });
  };

  handleJoin = (group_id) => {
    const d = { group_id };

    particularGroups(d).then((res) => {
      if (res) {
        d.approval_type = res.groups_request;
        if (res.purchase_type == 'free') {
          JoinMember(d).then((JoinResult) => {
            let message_dis;
            let redirect_url;

            if (JoinResult.message == 'success') {
              if (res.groups_request == 'admin') {
                message_dis = 'Successfully send request';
                redirect_url = '';
              } else {
                message_dis = 'Successfully Joined Group';
                redirect_url = `/viewgroup/${group_id}`;
              }

              alertBox(true, message_dis, 'success');
              window.location.href = redirect_url;
            } else {
              alertBox(
                true,
                JoinResult.message != ''
                  ? JoinResult.message
                  : 'Error! Joined Group'
              );
            }
          });
        } else {
          const isExecuted = window.confirm(
            'Are you sure to auto detect balance?'
          );
          if (isExecuted == true) {
            d.payment_type =
              res.payment_type == 'recurrence' ? 'recurrence' : '1time';
            if (res.payment_type == 'recurrence') {
              d.recurrence_type = res.recurrence_type;
            }

            this.state.balance.map((item) => {
              if (item.currencySymbol == res.currency) {
                const get_balance = item.balance;
                if (get_balance < res.amount) {
                  alertBox(true, 'Error! Insuffcient balance in your account');
                } else {
                  JoinMember(d).then((JoinResult) => {
                    console.log(JoinResult, 'JoinResult');
                    let message_dis;
                    let redirect_url;

                    if (JoinResult.message == 'success') {
                      if (res.groups_request == 'admin') {
                        message_dis = 'Successfully send request';
                        redirect_url = '';
                      } else {
                        message_dis = 'Successfully Joined Group';
                        redirect_url = `/viewgroup/${group_id}`;
                      }

                      alertBox(true, message_dis, 'success');
                      window.location.href = redirect_url;
                    } else {
                      alertBox(
                        true,
                        JoinResult.message != ''
                          ? JoinResult.message
                          : 'Error! Joined Group'
                      );
                    }
                  });
                }
              }
            });
          }
        }
      }
    });
  };

  render() {
    const popular_grp = this.state.populargrop;
    const popular = popular_grp.map((pgrp, index) => (
      <>
        {this.props.currentUser._id != pgrp.userid ? (
          <div className="groupBlog" key={index}>
            <img src={pgrp.banner} alt="img" style={{ width: 100 }} />
            <div className="rightArea">
              {this.state.this_session_mem_grp[pgrp._id] == 'Joined' ||
              (this.props.currentUser._id == pgrp.userid &&
                this.state.this_session_mem_grp[pgrp._id] == 'Requested') ? (
                <p
                  onClick={() =>
                    (window.location.href = `/viewgroup/${pgrp._id}`)
                  }
                >
                  {pgrp.name}
                </p>
              ) : (
                <p>{pgrp.name}</p>
              )}
              <div className="dp-flex">
                <div>
                  <ul>
                    {this.state.followerss[pgrp._id] ? (
                      <li>{this.state.followerss[pgrp._id]} followers</li>
                    ) : (
                      <li>0 followers</li>
                    )}
                    {this.props.postcount[0] != undefined ? (
                      <li>{this.props.postcount[0][pgrp._id]} post /day</li>
                    ) : (
                      <li>0 post /day</li>
                    )}
                  </ul>
                </div>
                <span className="al-r freeText">
                  {pgrp.purchase_type == 'free' ? 'FREE' : 'PAID'}{' '}
                </span>
              </div>
              <div className="dp-flex">
                <div>
                  <img
                    src={Images.shareIcon}
                    alt="shareIcon"
                    onClick={(e) => this.sharePost(pgrp)}
                  />
                  <span
                    className="shareText"
                    onClick={(e) => this.sharePost(pgrp)}
                  >
                    {' '}
                    SHARE
                  </span>
                </div>

                {this.state.this_session_mem_grp[pgrp._id] == 'Joined' ? (
                  <button className="primaryBtn al-r">Joined</button>
                ) : (
                  ''
                )}

                {this.state.this_session_mem_grp[pgrp._id] == 'Requested' ? (
                  <button className="primaryBtn al-r">Requested</button>
                ) : (
                  ''
                )}

                {this.props.currentUser._id != pgrp.userid &&
                this.state.this_session_mem_grp[pgrp._id] != 'Joined' &&
                this.state.this_session_mem_grp[pgrp._id] != 'Requested' ? (
                  <button
                    className="primaryBtn al-r"
                    onClick={(e) => this.handleJoin(pgrp._id)}
                  >
                    Join
                  </button>
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
      <div className="groupsContainer">
        <div className="heading">
          <div>
            <p>Popular</p>
            <span>Groups people in your area are in</span>
          </div>
        </div>
        <div className="groupBlogArea pos-rel">
          <img
            className="leftArrow"
            src={Images.leftArrowGallery}
            alt="left-arrow"
          />
          <img
            className="rightArrow"
            src={Images.rightArrowGallery}
            alt="left-arrow"
          />
          {popular}
          {this.state.shareModel && (
            <Share
              sharedtype="group"
              post={this.state.currPost}
              shareSuccess={this.shareSuccess}
              closeShareModal={this.closeShareModal}
            />
          )}
        </div>
      </div>
    );
  }
}

export default PopularGroups;
