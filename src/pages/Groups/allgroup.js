import React from 'react';
import { alertBox, switchLoader } from '../../commonRedux';
import {
  getallgroup,
  followercount,
  particularGroups,
  JoinMember,
  getGroupMember,
  mygroups,
  savegroups,
  getSaveGroups,
} from '../../http/group-calls';
import { getAllBalance } from '../../http/wallet-calls';
import Images from '../../assets/images/images';
import './style/groups.scss';
import { history } from '../../store';
import Modal from '../../components/Popup';
import Share from '../../components/Post/Share';
import { Switch } from '@material-ui/core';
import InfiniteScroll from 'react-infinite-scroller';

class AllGroups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupsall: [],
      followerss: [],
      groupmembers: [],
      this_session_mem_grp: [],
      balance: [],
      managegrop: [],
      savegroupsget: [],
      joinModal: false,
      joingroup_id: '',
      joincurrency: '',
      joinamount: '',
      grouppay_type: '',
      auto_pay: false,
      postcount: props.postcount,
      filterdata: this.props.filter,
      page: 1,
      limit: this.props.limit != undefined ? 4 : 10,
      hasMore: false,
    };
  }

  componentDidMount() {
    this.getallgroups({});
    this.getAllmember();
    getAllBalance().then(async (resp) => {
      this.setState({ balance: resp.data });
    });

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
    const d = {};
    d._id = this.props.currentUser._id;
    mygroups(d).then(
      (res) => {
        this.setState({
          managegrop: res.data,
        });
      },
      (err) => {}
    );

    getSaveGroups().then(
      (res) => {
        const Grpsave = [];
        res.map((item, index) => {
          Grpsave[item.group_id] = 'Saved';
        });
        this.setState({
          savegroupsget: Grpsave,
        });
      },
      (err) => {}
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.filter != this.props.filter) {
      this.setState({ filterdata: this.props.filter });
      this.getallgroups(this.props.filter);
    }
  }

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

  getallgroups(data) {
    const d = data;
    if (this.props.page == 'mygroup') {
      d.mine = 'true';
    }
    d.limit = this.state.limit;
    d.page = this.state.page;
    d.userid = this.props.currentUser._id;
    getallgroup(d).then(
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
            groupsall: uniqueItems,
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

    //   PostCount().then((res) => {
    //   console.log(res.postdatas[0],"res")
    //   this.setState({postcounts:res.postdatas})
    //   console.log(this.state.postcounts,"postcount")
    // })
  }

  handleGroups = (group_id) => {
    window.location.href = `/tribesfeeds/${group_id}`;
  };

  SaveGroups = (group_id) => {
    const d = {};
    d.userid = this.props.currentUser._id;
    d.group_id = group_id;
    savegroups(d).then((result) => {
      if (result.message == 'success') {
        alertBox(true, 'Successfully saved group', 'success');
      } else if (result.message == 'Already this group was saved') {
        alertBox(true, result.message, 'Error');
      } else {
        alertBox(true, 'Error saved group', 'Error');
      }
    });
  };

  handleJoin = (group_id) => {
    const d = {};
    d.group_id = group_id;
    switchLoader(true, 'Please wait...');
    particularGroups(d).then((res) => {
      if (res) {
        d.approval_type = res.groups_request;
        if (res.purchase_type == 'free') {
          JoinMember(d).then((JoinResult) => {
            if (JoinResult.message == 'success') {
              let message_dis;
              let redirect_url;
              if (res.groups_request == 'admin') {
                message_dis = 'Successfully send request';
                redirect_url = '';
              } else {
                message_dis = 'Successfully Joined Group';
                redirect_url = `/tribesfeeds/${group_id}`;
              }
              alertBox(true, message_dis, 'success');
              window.location.href = redirect_url;
            } else if (JoinResult.message != '') {
              alertBox(true, JoinResult.message);
            } else {
              alertBox(true, 'Error! Joined Group');
            }
          });
        } else {
          switchLoader();
          if (res.payment_type == 'recurrence') {
            d.payment_type = 'recurrence';
            d.recurrence_type = res.recurrence_type;
          } else {
            d.payment_type = '1time';
          }
          d.auto_pay = this.state.auto_pay;
          d.group_id = this.state.auto_pay;
          // check balance
          const { balance } = this.state;
          console.log(balance, 'balance test');
          if (balance.length > 0) {
            balance.map((item) => {
              if (item.currencySymbol == res.currency) {
                const get_balance = item.balance;
                console.log(get_balance, res.amount, 'chkec balance');
                if (get_balance < res.amount) {
                  alertBox(true, 'Error! Insuffcient balance in your account');
                } else {
                  JoinMember(d).then(
                    (JoinResult) => {
                      console.log(JoinResult, 'JoinResult');
                      switchLoader();
                      if (JoinResult.message == 'success') {
                        let message_dis;
                        let redirect_url;
                        if (res.groups_request == 'admin') {
                          message_dis = 'Successfully send request';
                          redirect_url = '';
                        } else {
                          message_dis = 'Successfully Joined Group';
                          redirect_url = `/tribesfeeds/${group_id}`;
                        }
                        alertBox(true, message_dis, 'success');
                        window.location.href = redirect_url;
                      } else if (JoinResult.message != '') {
                        alertBox(true, JoinResult.message);
                      } else {
                        alertBox(true, 'Error! Joined Group');
                      }
                    },
                    (error) => {
                      const { data } = error;
                      switchLoader();
                      if (data.message) {
                        alertBox(true, data.message);
                      } else {
                        alertBox(true, 'Something went wrong');
                      }
                    }
                  );
                }
              }
            });
          } else {
            alertBox(true, 'Error! Insufficient Balance');
          }
        }
      }
    });
  };

  handleSwitch = () => {
    this.setState({ auto_pay: !this.state.auto_pay });
  };

  joinModal = (group_id) => {
    const d = {};
    d.group_id = group_id;
    particularGroups(d).then((res) => {
      this.setState({
        joincurrency: res.currency,
        joinamount: res.amount,
        grouppay_type: res.payment_type,
      });
    });
    this.setState({ joinModal: !this.state.joinModal, joingroup_id: group_id }); // true/false toggle
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

  fetchMoreData = () => {
    console.log('testss');
    this.setState(
      (prevState) => ({
        ...prevState,
        page: prevState.page + 1,
      }),
      () =>
        this.props.limit == undefined
          ? this.getallgroups({})
          : this.setState({ hasMore: false })
    );
  };

  render() {
    const groups_all = this.state.groupsall;
    const Grups =
      groups_all.length > 0 &&
      groups_all.map((groups, index) => (
        <>
          {groups != undefined &&
          (this.props.page == 'mygroup' || this.props.page == 'all') ? (
            <div className="groupBlog" key={index}>
              <img src={groups.banner} alt="img" style={{ width: 80 }} />
              <div className="rightArea">
                {this.state.this_session_mem_grp[groups._id] == 'Joined' ||
                (this.props.currentUser._id == groups.userid &&
                  this.state.this_session_mem_grp[groups._id] ==
                    'Requested') ? (
                  <p onClick={() => this.handleGroups(groups._id)}>
                    {groups.name}
                  </p>
                ) : (
                  <p>{groups.name}</p>
                )}

                <div className="dp-flex">
                  <div>
                    <ul>
                      {this.state.followerss[groups._id] ? (
                        <li>{this.state.followerss[groups._id]} followers</li>
                      ) : (
                        <li>0 followers</li>
                      )}

                      {this.props.postcount[0] != undefined ? (
                        <li>{this.props.postcount[0][groups._id]} post /day</li>
                      ) : (
                        <li>0 post /day</li>
                      )}
                    </ul>
                  </div>
                  <span className="al-r freeText">
                    {groups.purchase_type.toUpperCase()}
                  </span>
                </div>
                <div className="dp-flex">
                  <div>
                    <img
                      src={Images.shareIcon}
                      alt="shareIcon"
                      onClick={(e) => this.sharePost(groups)}
                    />
                    <span
                      className="shareText"
                      onClick={(e) => this.sharePost(groups)}
                    >
                      {' '}
                      SHARE
                    </span>{' '}
                    &nbsp; &nbsp;
                  </div>
                  <div>
                    {this.state.savegroupsget[groups._id] == 'Saved' ? (
                      <i className="fa fa-star  wishlist-star" title="Saved" />
                    ) : (
                      <i
                        className="fa fa-star-o wishlist-star"
                        onClick={(e) => this.SaveGroups(groups._id)}
                        title="Add to wishlist"
                      />
                    )}
                  </div>

                  {this.state.this_session_mem_grp[groups._id] == 'Joined' ? (
                    <button className="primaryBtn al-r">Joined</button>
                  ) : (
                    ''
                  )}

                  {this.state.this_session_mem_grp[groups._id] ==
                  'Requested' ? (
                    <button className="primaryBtn al-r">Requested</button>
                  ) : (
                    ''
                  )}

                  {this.props.currentUser._id != groups.userid &&
                  this.state.this_session_mem_grp[groups._id] != 'Joined' &&
                  this.state.this_session_mem_grp[groups._id] != 'Requested' &&
                  groups.purchase_type.toUpperCase() == 'PAID' ? (
                    <button
                      className="primaryBtn al-r"
                      onClick={(e) => this.joinModal(groups._id)}
                    >
                      Join
                    </button>
                  ) : (
                    ''
                  )}

                  {this.props.currentUser._id != groups.userid &&
                  this.state.this_session_mem_grp[groups._id] != 'Joined' &&
                  this.state.this_session_mem_grp[groups._id] != 'Requested' &&
                  groups.purchase_type.toUpperCase() == 'FREE' ? (
                    <button
                      className="primaryBtn al-r"
                      onClick={(e) => this.handleJoin(groups._id)}
                    >
                      Join
                    </button>
                  ) : (
                    ''
                  )}

                  {this.props.currentUser._id == groups.userid ? (
                    <button className="primaryBtn al-r">Created By You</button>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {this.props.currentUser._id == groups.userid &&
              index + 1 == groups_all.length &&
              this.state.managegrop.length == 0 ? (
                <div>
                  <p>No Group Found</p>
                </div>
              ) : (
                ''
              )}
            </>
          )}
        </>
      ));

    return (
      <div className="groupsContainer">
        <div className="heading">
          <Modal
            displayModal={this.state.joinModal}
            closeModal={this.joinModal}
          >
            <div className="joinPayment">
              <div className="joinHead">
                <h4>Payment</h4>
              </div>
            </div>
            <table className="table">
              <tbody>
                <tr>
                  <th scope="row">Currency</th>
                  <td>{this.state.joincurrency}</td>
                </tr>
                <tr>
                  <th scope="row">Amount</th>
                  <td>{this.state.joinamount}</td>
                </tr>
                {this.state.grouppay_type != '1time' ? (
                  <tr>
                    <th>Auto Payment</th>
                    <td>
                      {' '}
                      <div className="joinToggle">
                        <Switch onChange={() => this.handleSwitch()} />
                      </div>
                    </td>
                  </tr>
                ) : null}

                <button
                  className="al-r"
                  onClick={(e) => this.handleJoin(this.state.joingroup_id)}
                >
                  Join
                </button>
              </tbody>
            </table>
          </Modal>

          <div>
            <p>Groups</p>
            <span>Free Groups you might be interested in</span>
          </div>
          {this.props.perpage != 'all' ? (
            <a
              href="javascript:void(0)"
              onClick={() => (window.location.href = '/allgroups')}
            >
              See more
            </a>
          ) : (
            ''
          )}
        </div>

        {this.state.groupsall.length > 0 ? (
          <InfiniteScroll
            initialLoad={false}
            pageStart={0}
            // dataLength={this.state.posts.length}
            loadMore={this.fetchMoreData}
            hasMore={this.state.hasMore}
          >
            <div className="groupBlogArea">
              {Grups}

              {this.state.shareModel && (
                <Share
                  sharedtype="group"
                  post={this.state.currPost}
                  shareSuccess={this.shareSuccess}
                  closeShareModal={this.closeShareModal}
                />
              )}
            </div>
          </InfiniteScroll>
        ) : (
          <div className="groupBlogArea">
            <p>No Groups Found</p>
          </div>
        )}
      </div>
    );
  }
}

export default AllGroups;
