import React from 'react';

class ManageGroup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const usersfilgrp = this.props.userGroups;
    const userfil = usersfilgrp.map((userfilgrps, index) => (
      <li className="list-group-item" key={index}>
        <img
          style={{ width: 30, borderRadius: '50%', marginRight: '10px' }}
          src={userfilgrps.banner}
        />
        {userfilgrps.name}
      </li>
    ));

    return (
      <div className="widget cardBody filterWidget">
        <div className="container">
          <div className="row">
            <ul className="list-group w-100">
              <li className="widgetTitle">
                <span>Groups You Manage</span>
              </li>
            </ul>
            {usersfilgrp.length > 0 ? (
              <ul className="list-group w-100 member-group">{userfil}</ul>
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
}

export default ManageGroup;
