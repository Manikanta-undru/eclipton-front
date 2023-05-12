import React from 'react';
import { Link } from 'react-router-dom';
import Images from '../../assets/images/images';
import './style/groups.scss';

function Imageview(props) {
  let image_url = '';
  if (props.imageid == 0) {
    image_url = Images.image33;
  } else if (props.imageid == 1) {
    image_url = Images.image34;
  } else if (props.imageid == 2) {
    image_url = Images.image35;
  } else {
    image_url = Images.image36;
  }
  return <img src={image_url} alt="img" />;
}

class CategoryGroups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupscategory: props.groupscategory,
    };
  }

  render() {
    const groups_allcat = this.props.groupscategory;
    const Grupscate = groups_allcat.map((groupscat, index) => (
      <div className="categoryBlog" key={index}>
        <Imageview imageid={index} />
        <span>{groupscat.category}</span>
      </div>
    ));
    return (
      <div className="groupsContainer">
        <div className="heading">
          <div>
            <p>Categories</p>
            <span>Find a group by browsing top categories</span>
          </div>
          <Link href="#">See more</Link>
        </div>
        <div className="categoriesBlogArea">
          <img
            className="leftArrow"
            src={Images.leftArrowGallery}
            alt="left-arrow"
          />
          <img
            className="rightArrow"
            src={Images.rightArrowGallery}
            alt="left-arrow"
          />
          {Grupscate}
        </div>
      </div>
    );
  }
}

export default CategoryGroups;
