import React, { useState, useEffect } from 'react';
import {
  getTagUsers,
  getSuggestions,
  cancelRequest,
} from '../../http/http-calls';
import { inviteFriendsTribesGroup } from '../../http/group-calls';

import { profilePic } from '../../globalFunctions';
import DebouncedInput from '../../components/DebouncedInput/DebouncedInput';
import A from '../../components/A';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';
import { alertBox } from '../../commonRedux';

const InviteFriends = ({ groupid }, { match }) => {
  const [search, setSearch] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [users, setUsers] = useState([]);
  const [searchVal, setSearchVal] = useState('');

  const fetchData = (key = '') => {
    getTagUsers({ key }, true).then(
      async (resp) => {
        setUsers(resp);
      },
      (error) => {}
    );
  };

  const handleSearch = (val) => {
    setSearchVal(val);
    if (val.length > 1) {
      fetchData(val);
      setSearch(true);
    } else if (val === '') {
      setSearch(false);
      fetchData();
    }
  };

  const getSuggestedFriends = (page = page, key = '') => {
    getSuggestions({ limit, page, key }, true).then(
      async (resp) => {
        setUsers(resp.message);
        checkMore(1);
      },
      (error) => {}
    );
  };

  const checkMore = (i, key = '') => {
    getSuggestions({ limit: 6, page: i + 1, key }, true).then(
      async (resp) => {
        if (resp.message !== undefined && resp.message.length > 0) {
          // setSeeMore(true);
        } else {
          // setSeeMore(false);
        }
      },
      (error) => {}
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (
      typeof match !== 'undefined' &&
      typeof match?.params !== 'undefined' &&
      match?.params.id
    ) {
      fetchData();
    }
  }, [match]);

  return (
    <div className=" myfriends friendsWidget " style={{ width: '400px' }}>
      <div className="container">
        <div className="row">
          <ul className="list-group w-100">
            <li className="widgetTitle">
              <i className="fa fa-users"></i>
              <span>Invite Friends</span>
            </li>
          </ul>
          <form className="w-100 d-block my-2">
            <DebouncedInput
              type="text"
              className="form-control"
              autoFocus
              placeholder="Search"
              id="friendSearch"
              onChange={handleSearch}
            />
          </form>
          {users.map((user, i) => (
            <UserRow user={user} i={i} groupid={groupid} key={i} />
          ))}
          {users.length === 0 && (
            <ul className="list-group w-100">
              <li className="list-group-item d-flex justify-content-center align-items-center">
                <A href="/all/suggested" className="btn primaryBtn">
                  Add Friends +
                </A>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const UserRow = ({ user, i, groupid, setUsers, users }) => {
  const [loading, setLoading] = useState(false);

  const cancelInvite = (userId, index) => {
    cancelRequest(userId, true).then(
      async (resp) => {
        const newUsers = [...users];
        newUsers.splice(index, 1, resp);
        setUsers(newUsers);
      },
      (error) => {}
    );
  };

  const inviteFriend = (userId, index, setLoading, groupid) => {
    setLoading(true);
    var request = {};
    request.userid = userId;
    request.group_id = groupid;
    request.payment_type = 'recurrence';
    inviteFriendsTribesGroup(request).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        setLoading(false);
      },
      (error) => {}
    );
  };

  return (
    <ul className="list-group w-100 m-0">
      <li className="list-group-item">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="media-left proImg_left me-2">
              {user && (
                <A
                  href={
                    '/u/' +
                    (user.inviteStatus !== undefined &&
                    user.inviteStatus === 'invited'
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
                    (user.inviteStatus !== undefined &&
                    user.inviteStatus === 'invited'
                      ? user.uid
                      : user._id)
                  }
                >
                  <p className="media-heading">{user.name}</p>
                </A>
              )}
            </div>
          </div>
          <div className="media-right homePen">
            {!loading && user && user.inviteStatus === 'invited' && (
              <Button
                variant="primary dropdownBtn"
                layout="dropdown"
                dropdownOptions={['cancel']}
                onClick={() => cancelInvite(user._id, i)}
              >
                Invited
              </Button>
            )}
            {!loading && user && user.inviteStatus === undefined && (
              <Button
                variant="removeBtn_border"
                className=""
                onClick={() => inviteFriend(user._id, i, setLoading, groupid)}
              >
                <i className="fa fa-plus"></i> Invite
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

export default InviteFriends;
