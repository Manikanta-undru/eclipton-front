// import ListErrors from './ListErrors';
import React, { useState } from 'react';
import {
  getTagUsers,
  followUser,
  acceptRequest,
  cancelRequest,
  getSuggestions,
} from '../../http/http-calls';
import { profilePic } from '../../globalFunctions';
import Button from '../Button';
import { switchLoader } from '../../commonRedux/';
import A from '../A';
import './style.scss';
import DebouncedInput from '../DebouncedInput/DebouncedInput';
import Spinner from '../Spinner';
class MyFriends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: false,
      page: 1,
      limit: 20,
      users: [],
      searchVal: '',
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (
      typeof this.props.match != 'undefined' &&
      typeof prevProps.match != 'undefined' &&
      prevProps.match.params.id !== this.props.match.params.id
    ) {
      this.fetchData();
    }
  }

  fetchData = (key = '') => {
    getTagUsers({ key }, true).then(
      async (resp) => {
        this.setState({ users: resp });
      },
      (error) => {}
    );
  };

  accept = (user, index, item) => {
    switchLoader(true, 'Sending Request... ');
    if (item == 0) {
      acceptRequest({ id: user._id }, true).then(
        async (resp) => {
          switchLoader();
          let tempUser = this.state.users;
          delete tempUser[index];
          // if(this.props.refresh != null){
          //     this.props.refresh();
          // }
          this.setState({
            users: tempUser,
          });
          this.fetchData();
        },
        (error) => {
          switchLoader();
        }
      );
    } else {
      cancelRequest({ id: user.uid }, true).then(
        async (resp) => {
          switchLoader();
          let tempUser = this.state.users;
          // tempUser[index] = null;
          delete tempUser[index].request;
          // if(this.props.refresh != null){
          //     this.props.refresh();
          // }
          this.setState({
            users: tempUser,
          });
          this.fetchData();
        },
        (error) => {
          switchLoader();
        }
      );
    }
  };

  cancelRequest = (id, index, setLoading) => {
    setLoading(true);
    cancelRequest({ id }, true).then(
      async (resp) => {
        setLoading(false);
        let tempUser = this.state.users;
        // tempUser[index] = null;
        delete tempUser[index].request;
        // if(this.props.refresh != null){
        //     this.props.refresh();
        // }
        this.setState({
          users: tempUser,
        });
        this.fetchData();
      },
      (error) => {
        setLoading(false);
      }
    );
  };

  search = (val) => {
    this.setState({ searchVal: val });
    // this.getSuggestedFriends(1, val);
    if (val.length > 1) {
      // this.fetchData(val);
      this.setState({ search: true });
      //this.getSuggestedFriends(1, val);
      this.fetchData(val);
    } else if (val == '') {
      this.setState({ search: false });

      this.fetchData();
    }
  };

  getSuggestedFriends = (page = this.state.page, key = '') => {
    getSuggestions(
      { limit: this.state.limit, page: page, key: key },
      true
    ).then(
      async (resp) => {
        this.setState({ users: resp.message, showSkeleton: false }, () => {
          this.checkMore(1);
        });
      },
      (error) => {}
    );
  };

  addFriend = (id, userIndex) => {
    var searchval = this.state.searchVal;
    switchLoader(true, 'Sending Request... ');
    followUser({ followerid: id }, true).then(
      async (resp) => {
        switchLoader();
        let tempUser = this.state.users;
        tempUser[userIndex]._id = resp._id;
        tempUser[userIndex].request = resp.request;
        tempUser[userIndex].type = 'sent';
        tempUser[userIndex].uid = resp.followerid;
        // if(this.props.refresh != null){
        //     this.props.refresh();
        // }
        this.setState({
          users: tempUser,
          //searchVal:searchval
        });
        // if (searchval) {
        //   this.setState({search:true})
        // this.getSuggestedFriends(1, searchval);
        // }
      },
      (error) => {
        switchLoader();
      }
    );
  };

  checkMore = (i, key = '') => {
    getSuggestions({ limit: 6, page: i + 1, key: key }, true).then(
      async (resp) => {
        if (resp.message !== undefined && resp.message.length > 0) {
          this.setState({
            seemore: true,
          });
        } else {
          this.setState({
            seemore: false,
          });
        }
      },
      (error) => {}
    );
  };

  render() {
    return (
      <div className="cardBody myfriends friendsWidget widget">
        <div className="container">
          <div className="row">
            <ul className="list-group w-100">
              <li className="widgetTitle">
                <i className="fa fa-users"></i>
                <span>Friends</span>
              </li>
            </ul>
            {
              <form className="w-100 d-block  my-2">
                <DebouncedInput
                  type="text"
                  className="form-control"
                  autoFocus
                  placeholder="Search"
                  id="friendSearch"
                  onChange={this.search}
                />
              </form>
            }

            {this.state.users.map((user, i) => (
              <UserRow
                user={user}
                i={i}
                cancelRequest={this.cancelRequest}
                key={i}
              />
            ))}

            {this.state.users.length === 0 ? (
              <ul className="list-group w-100">
                <li className="list-group-item d-flex justify-content-center align-items-center">
                  <A href="/all/suggested" className="btn primaryBtn">
                    Add Friends +
                  </A>
                </li>
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
const UserRow = ({ user, i, addFriend, cancelRequest, accept }) => {
  const [loading, setLoading] = useState(false);

  return (
    <ul className="list-group w-100">
      <li className="list-group-item">
        <div className="media">
          <div className="media-left proImg_left">
            {user && (
              <A
                href={
                  '/u/' +
                  (user.request !== undefined && user.request == 'pending'
                    ? user.uid
                    : user._id)
                }
              >
                <img
                  className="media-object circle widgetAvatar"
                  src={profilePic(user.avatar, user.name)}
                  alt="..."
                />
              </A>
            )}
          </div>
          <div className="media-body">
            {user && (
              <A
                href={
                  '/u/' +
                  (user.request !== undefined && user.request == 'pending'
                    ? user.uid
                    : user._id)
                }
              >
                <p className="media-heading">{user.name}</p>
              </A>
            )}
            {/* <p className="media-subheading">{user.job == null ? "Eclipton User" : user.job}</p> */}
          </div>
          <div className="col media-right homePen">
            {!loading && user && user.request == undefined && (
              <Button
                variant="primary dropdownBtn"
                layout="dropdown"
                dropdownOptions={['Unfriend']}
                onClick={() => cancelRequest(user._id, i, setLoading)}
              >
                Friends
              </Button>
            )}
            {loading && (
              <div className="loader-spinner">
                <Spinner style={{ width: '25px', height: '25px' }} />
              </div>
            )}
          </div>
        </div>
      </li>
    </ul>
  );
};

export default MyFriends;
