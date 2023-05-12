import React from 'react';
import { withRouter } from 'react-router';
import { profilePic } from '../globalFunctions';
import PopChat from './PopChat';
// if (getToken() !== null) {
require('../assets/css/style.scss');
// }

/* if (getToken() !== null) {
  commonStyle()
} */

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minimized: [],
      chats: [],
    };
    this.minimize = this.minimize.bind(this);
    this.close = this.close.bind(this);
  }

  minimize = (id) => {
    const temp = this.state.chats;
    // var foundIndex = temp.findIndex(x => x.id == id);
    const foundIndex = id;
    const temp2 = this.state.minimized;
    temp2.push(temp[foundIndex]);
    // temp.splice(foundIndex, 1);
    temp[foundIndex].minimized = true;

    this.setState({
      chats: temp,
      minimized: temp2,
    });
  };

  close = (id) => {
    const temp = this.state.chats;
    const foundIndex = id;
    temp.splice(foundIndex, 1);

    this.setState({
      chats: temp,
    });
  };

  restore = (id) => {
    const temp = this.state.minimized;
    let foundIndex = temp.findIndex((x) => x._id == id);
    temp.splice(foundIndex, 1);

    const temp2 = this.state.chats;
    foundIndex = temp2.findIndex((x) => x._id == id);
    temp2[foundIndex].minimized = false;

    this.setState({
      chats: temp2,
      minimized: temp,
    });
  };

  componentDidMount() {
    this.setState({
      chats: this.props.chats,
    });
  }

  // componentDidUpdate = (prevProps) => {
  //   if(this.props.location.pathname != prevProps.location.pathname){
  //
  //   if(this.props.location.pathname.indexOf("messenger") !== -1){
  //     this.setState({
  //       chats: [],
  //       minimized: []
  //     })
  //   }
  // }
  // }

  render() {
    return (
      <div className="footer">
        {this.state.chats.length > 0
          ? this.state.chats.map((r, i) =>
              r.minimized ? null : (
                <PopChat
                  minimize={this.minimize}
                  close={this.close}
                  id={i}
                  chat={r}
                  {...this.props}
                  key={i}
                />
              )
            )
          : null}
        <div className="minimizedChats">
          {this.state.minimized.length > 0
            ? this.state.minimized.map((r, i) => (
                <img
                  src={profilePic(
                    r.user1._id == this.props.currentUser._id
                      ? r.user2.avatar
                      : r.user1.avatar,
                    r.user1._id == this.props.currentUser._id
                      ? r.user2.name
                      : r.user1.name
                  )}
                  className="minimizedChatPic"
                  onClick={(e) => this.restore(r._id)}
                  key={i}
                />
              ))
            : null}
        </div>
      </div>
    );
  }
}

export default withRouter(Footer);
