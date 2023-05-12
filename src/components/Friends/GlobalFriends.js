import React, { useState, useEffect } from 'react';
import { getGlobalTagUsers } from '../../http/http-calls';
import {
  followUser,
  acceptRequest,
  cancelRequest,
} from '../../http/http-calls';
import { profilePic } from '../../globalFunctions';
import Button from '../Button';
import A from '../A';
import './style.scss';
import DebouncedInput from '../DebouncedInput/DebouncedInput';
import Spinner from '../Spinner';

const ActionType = {
  ADD: 'Add',
  CANCEL: 'Cancel',
  ACCEPT: 'Accept',
  REJECT: 'Reject',
  PENDING: 'Pending',
};

const GlobalFriends = (props) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, [props.match.params.id]);

  const fetchData = async (key = '') => {
    try {
      const resp = await getGlobalTagUsers(
        { key, id: props.match.params.id, lid: props.currentUser._id },
        false
      );
      setUsers(resp);
    } catch (error) {
      /* empty */
    }
  };

  const search = (val) => {
    if (val.length > 1) {
      fetchData(val);
    } else if (val === '') {
      fetchData();
    }
  };

  return (
    <div className="cardBody myfriends friendsWidget widget">
      <div className="container">
        <div className="row">
          <ul className="list-group w-100">
            <li className="list-group-item d-flex justify-content-between align-items-center  widgetTitle">
              Friends
              <span className="text-secondary pl-2">
                <div className="input-group navbar--search friend-search">
                  <div className="input-group-append">
                    <button type="button">
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                  <DebouncedInput
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    onChange={search}
                  />
                </div>
              </span>
            </li>
          </ul>

          {users.map((user, i) => (
            <UserRow
              user={user}
              i={i}
              fetchData={fetchData}
              ActionType={ActionType}
              key={i}
            />
          ))}

          {users.length === 0 ? (
            <ul className="list-group w-100">
              <li className="list-group-item d-flex justify-content-center align-items-center">
                <p>No Friends</p>
              </li>
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
};
const RequestStatus = {
  PENDING: 'pending',
  RECEIVED: 'received',
  SENT: 'sent',
  UNDEFINED: 'undefined',
};

const UserRow = ({ user, fetchData }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (actionType) => {
    setLoading(true);
    try {
      switch (actionType) {
        case ActionType.ADD:
          await followUser({ followerid: user._id }, true);
          break;
        case ActionType.CANCEL:
          await cancelRequest({ id: user.uid }, true);
          break;
        case ActionType.ACCEPT:
          await acceptRequest({ id: user._id }, true);
          break;
        case ActionType.REJECT:
          await cancelRequest({ id: user.userid }, true);
          break;
        default:
          break;
      }
      fetchData();
    } catch (error) {
      /* empty */
    } finally {
      setLoading(false);
    }
  };
  return (
    <ul className="list-group w-100">
      <li className="list-group-item">
        <div className="media">
          <div className="media-left proImg_left">
            {user && (
              <A
                href={
                  '/u/' + (user.request === 'pending' ? user.uid : user._id)
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
                  '/u/' + (user.request === 'pending' ? user.uid : user._id)
                }
              >
                <p className="media-heading">{user.name}</p>
              </A>
            )}
          </div>
          <div className="col media-right homePen">
            {!loading && user && user.request === RequestStatus.UNDEFINED && (
              <Button
                variant="removeBtn_border"
                className=""
                onClick={() => handleAction(ActionType.ADD)}
              >
                <i className="fa fa-plus"></i> Add
              </Button>
            )}
            {!loading &&
              user &&
              user.request === RequestStatus.PENDING &&
              user.type === RequestStatus.SENT && (
                <Button
                  variant="dropdownBtn"
                  layout="dropdown"
                  dropdownOptions={[ActionType.CANCEL]}
                  onClick={() => handleAction(ActionType.CANCEL)}
                >
                  {ActionType.PENDING}
                </Button>
              )}
            {!loading &&
              user &&
              user.request === RequestStatus.PENDING &&
              user.type === RequestStatus.RECEIVED && (
                <Button
                  variant="dropdownBtn"
                  layout="dropdown"
                  dropdownOptions={[ActionType.ACCEPT, ActionType.REJECT]}
                  onClick={(n) => handleAction(n)}
                >
                  Respond
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

export default GlobalFriends;
