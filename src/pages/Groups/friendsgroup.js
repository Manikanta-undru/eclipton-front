import React from 'react';
import { Link } from 'react-router-dom';
import { getFrndsgroup } from '../../http/group-calls';
import Images from '../../assets/images/images';
import './style/groups.scss';

function Imageview(props) {
  let image_url = '';
  if (props.imageid == 0) {
    image_url = Images.image45;
  } else if (props.imageid == 1) {
    image_url = Images.image46;
  } else if (props.imageid == 2) {
    image_url = Images.image47;
  } else {
    image_url = Images.image48;
  }
  return <img src={image_url} alt="img" />;
}

class FriendsGroups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 4,
      page: 1,
      perpage: 4,
      frndsgrop: [],
      currentUser: this.props.currentUser,
      _id: this.props.currentUser._id,
    };
  }

  componentDidMount() {
    const data = {};
    const d = data;
    d.page = this.state.page;
    d.perpage = 4;
    d.limit = this.state.limit;
    d._id = this.props.currentUser._id;
    getFrndsgroup(d).then(
      (res) => {
        this.setState({
          frndsgrop: res,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  render() {
    const frnds_grp = this.state.frndsgrop;
    const frnds = frnds_grp.map((fgrp, index) => (
      <div className="groupBlog" key={index}>
        <Imageview imageid={index} />
        <div className="rightArea">
          <p>{fgrp.groupsdata.name}</p>
          <div className="dp-flex">
            <div>
              <ul>
                <li>10K followers</li>
                <li>10 post /day</li>
              </ul>
            </div>
            <span className="al-r freeText">FREE </span>
          </div>
          <div className="dp-flex">
            <div>
              <img src={Images.shareIcon} alt="shareIcon" />
              <span className="shareText"> SHARE</span>
            </div>
            <button className="al-r">Join</button>
          </div>
        </div>
      </div>
    ));
    return (
      <>
        {frnds_grp.length > 0 ? (
          <div className="groupsContainer">
            <div className="heading">
              <div>
                <p>Friend’s Groups</p>
                <span>Groups your friends are in</span>
              </div>
              <Link href="#">See more</Link>
            </div>
            <div className="groupBlogArea">{frnds}</div>
          </div>
        ) : (
          ''
        )}
      </>
    );
  }
}

export default FriendsGroups;
