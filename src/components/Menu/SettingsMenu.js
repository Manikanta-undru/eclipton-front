import React from 'react';
import './styles.scss';

function SettingsMenu(props) {
  return (
    <div className="widget cardBody SettingsMenus">
      <div className="container">
        <div className="row">
          <ul className="list-group w-100">
            <li className="widgetTitle">
              <i className="fa fa-cog" /> <span>Settings</span>
            </li>
          </ul>

          <ul className="list-group w-100 menu">
            {/* <li className={this.state.about == 1 && "active"} onClick={() => this.switch(1)} ><i className="fa fa-cog"></i> General</li>
                <li className={this.state.about == 2 && "active"} onClick={() => this.switch(2)} ><i className="fa fa-shield"></i> Security & Login</li>
                <li className={this.state.about == 3 && "active"} onClick={() => this.switch(3)} ><i className="fa fa-tags"></i> Timeline & Tagging</li>
                <li className={this.state.about == 4 && "active"} onClick={() => this.switch(4)} ><i className="fa fa-file"></i> Public Posts</li>
             */}
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == 1 && 'current'
              }`}
            >
              <span
                className="pointer align-items-center d-flex"
                onClick={() => props.switch(1)}
              >
                <i className="fa fa-user aicon" /> General
              </span>
            </li>
            {/* <li className={"list-group-item d-flex justify-content-between align-items-center "+(props.current == 2 && 'current')}>
                <span className="pointer align-items-center d-flex"  onClick={() => props.switch(2)}><i className="fa fa-lock aicon"></i> Security & Login</span>
              </li> */}
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == 3 && 'current'
              }`}
            >
              <span
                className="pointer align-items-center d-flex"
                onClick={() => props.switch(3)}
              >
                <i className="fa fa-tag aicon" /> Timeline & Tagging
              </span>
            </li>
            <li
              className={`list-group-item d-flex justify-content-between align-items-center ${
                props.current == 4 && 'current'
              }`}
            >
              <span
                className="pointer align-items-center d-flex"
                onClick={() => props.switch(4)}
              >
                <i className="fa fa-book aicon" /> Public Posts
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SettingsMenu;
