import React from 'react';

function MemberGroup(props) {
  // console.log(props,"mem_grp");
  const userGp = props.usermanagegrp;
  const userflgp = userGp.map((usergrp, index) => (
    <li className="list-group-item" key={index}>
      <img
        style={{ width: 30, borderRadius: '50%', marginRight: '10px' }}
        src={usergrp.groupsdata.banner}
      />
      {usergrp.groupsdata.name}
    </li>
  ));
  return (
    <div className="widget cardBody filterWidget">
      <div className="container">
        <div className="row">
          <ul className="list-group w-100">
            <li className="widgetTitle">
              <span>Groups You’re Member of</span>
            </li>
          </ul>

          {userGp.length > 0 ? (
            <ul className="list-group w-100">
              {userflgp}
              <li
                className="list-group-item list-group-item-action text-center"
                onClick={(e) => (window.location.href = '/membergroups')}
              >
                See More
              </li>
            </ul>
          ) : (
            <ul className="list-group w-100 member-group">
              <li className="list-group-item">No Groups Found</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemberGroup;
