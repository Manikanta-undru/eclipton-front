import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../http/token-interceptor';
import * as group from '../../http/group-calls';
import './style.scss';

const currentUser = JSON.parse(getCurrentUser());

function GroupWidget(props) {
  const [groupsall, setGroups] = useState([]);

  useEffect(() => {
    getallgroups();
  }, []);

  const getallgroups = async () => {
    const d = {};
    d.perpage = 2;
    d.limit = 2;
    d.page = 1;
    d.show = 'visible';
    d.userid = currentUser._id;
    d.shownType = 'left';
    group.getallgroup(d).then(
      (resp) => {
        setGroups(resp.data);
      },
      (err) => {
        setGroups([]);
      }
    );
  };

  return (
    <div className="groupWidget">
      {groupsall.map((groupdet, index) => (
        <div className="group" key={index}>
          <div className="image-box">
            <img
              src={groupdet.groups.banner}
              style={{ height: '200px', width: '265px' }}
            />
          </div>
          <div className="text-box">
            <div className="left">
              <h4>{groupdet.groups.name}</h4>
              {props.follower[groupdet.groups._id] ? (
                <span>{props.follower[groupdet.groups._id]} members</span>
              ) : (
                <span>0 members</span>
              )}
            </div>
            <div className="right">
              <button
                onClick={() =>
                  (window.location.href = `/viewgroup/${groupdet.groups._id}`)
                }
              >
                Visit group
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GroupWidget;
