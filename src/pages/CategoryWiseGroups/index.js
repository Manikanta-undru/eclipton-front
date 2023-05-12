import React from 'react';
import { Link } from 'react-router-dom';
import Images from '../../assets/images/images';
import './style.scss';

// require ("./styles.scss");

class CategoryWiseGroups extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="groupsContainer">
          <div className="heading">
            <div>
              <p>Groups</p>
              <span>Free Groups you might be interested in</span>
            </div>
            <Link href="#">See more</Link>
          </div>
          <div className="groupBlogArea">
            <div className="groupBlog">
              <img src={Images.image45} alt="img" />
              <div className="rightArea">
                <p>Group name position lorem dolor sit amet</p>
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
            <div className="groupBlog">
              <img src={Images.image46} alt="img" />
              <div className="rightArea">
                <p>Group name position lorem dolor sit amet</p>
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
            <div className="groupBlog">
              <img src={Images.image47} alt="img" />
              <div className="rightArea">
                <p>Group name position lorem dolor sit amet</p>
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
            <div className="groupBlog">
              <img src={Images.image48} alt="img" />
              <div className="rightArea">
                <p>Group name position lorem dolor sit amet</p>
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
            <div className="groupBlog">
              <img src={Images.image49} alt="img" />
              <div className="rightArea">
                <p>Group name position lorem dolor sit amet</p>
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
            <div className="groupBlog">
              <img src={Images.image50} alt="img" />
              <div className="rightArea">
                <p>Group name position lorem dolor sit amet</p>
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
            <div className="groupBlog">
              <img src={Images.image51} alt="img" />
              <div className="rightArea">
                <p>Group name position lorem dolor sit amet</p>
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
            <div className="groupBlog">
              <img src={Images.image52} alt="img" />
              <div className="rightArea">
                <p>Group name position lorem dolor sit amet</p>
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
          </div>
        </div>
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
            <div className="categoryBlog">
              <img src={Images.image33} alt="img" />
              <span>Faith & Spirituality</span>
            </div>
            <div className="categoryBlog">
              <img src={Images.image34} alt="img" />
              <span>Business</span>
            </div>
            <div className="categoryBlog">
              <img src={Images.image35} alt="img" />
              <span>Stock In Trade</span>
            </div>
            <div className="categoryBlog">
              <img src={Images.image36} alt="img" />
              <span>Buy & Sell</span>
            </div>
          </div>
        </div>
        <div className="groupsContainer">
          <div className="heading">
            <div>
              <p>Friend’s Groups</p>
              <span>Groups your friends are in</span>
            </div>
            <Link href="#">See more</Link>
          </div>
          <div className="groupBlogArea">
            <div className="groupBlog">
              <img src={Images.image45} alt="img" />
              <div className="rightArea">
                <p>Group name position lorem dolor sit amet</p>
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
            <div className="groupBlog">
              <img src={Images.image46} alt="img" />
              <div className="rightArea">
                <p>Group name position lorem dolor sit amet</p>
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
            <div className="groupBlog">
              <img src={Images.image47} alt="img" />
              <div className="rightArea">
                <p>Group name position lorem dolor sit amet</p>
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
            <div className="groupBlog">
              <img src={Images.image48} alt="img" />
              <div className="rightArea">
                <p>Group name position lorem dolor sit amet</p>
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
          </div>
        </div>

        <div className="groupsContainer">
          <div className="heading">
            <div>
              <p>Popular</p>
              <span>Groups people in your area are in</span>
            </div>
            <Link href="#">See more</Link>
          </div>
          <div className="groupBlogArea pos-rel">
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
            <div className="groupBlog">
              <img src={Images.image53} alt="img" />
              <div className="rightArea">
                <p>Group name position lorem dolor sit amet</p>
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
            <div className="groupBlog">
              <img src={Images.image54} alt="img" />
              <div className="rightArea">
                <p>Group name position lorem dolor sit amet</p>
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
            <div className="groupBlog">
              <img src={Images.image55} alt="img" />
              <div className="rightArea">
                <p>Group name position lorem dolor sit amet</p>
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
            <div className="groupBlog">
              <img src={Images.image56} alt="img" />
              <div className="rightArea">
                <p>Group name position lorem dolor sit amet</p>
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
          </div>
        </div>
        <div className="groupsContainer">
          <div className="heading">
            <div>
              <p>Pages</p>
              <span>Find a group by browsing top categories</span>
            </div>
          </div>
          <div className="PagesBlogsArea">
            <div className="pagesBlog">
              <img src={Images.image37} alt="img" />
              <div className="blogDetails">
                <div>
                  <p>Ekharedari</p>
                  <span>Sajawal invited you to like this Page</span>
                </div>
                <img src={Images.Liked} alt="Liked" />
              </div>
            </div>
            <div className="pagesBlog">
              <img src={Images.image38} alt="img" />
              <div className="blogDetails">
                <div>
                  <p>Race of Ranks</p>
                  <span>Shafiq invited you to like this Page</span>
                </div>
                <img src={Images.Like} alt="Like" />
              </div>
            </div>
            <div className="pagesBlog">
              <img src={Images.image39} alt="img" />
              <div className="blogDetails">
                <div>
                  <p>Li Ning Pakistan</p>
                  <span>Habiba invited you to like this Page</span>
                </div>
                <img src={Images.Like} alt="Like" />
              </div>
            </div>
            <div className="pagesBlog">
              <img src={Images.image40} alt="img" />
              <div className="blogDetails">
                <div>
                  <p>Sohan Warriors</p>
                  <span>Majid invited you to like this Page</span>
                </div>
                <img src={Images.Like} alt="Like" />
              </div>
            </div>
            <div className="line" />
            <div className="pagesBlog">
              <img src={Images.image41} alt="img" />
              <div className="blogDetails">
                <div>
                  <p>Noor e Haya</p>
                  <span>Ameen invited you to like this Page</span>
                </div>
                <img src={Images.Like} alt="Like" />
              </div>
            </div>
            <div className="pagesBlog">
              <img src={Images.image42} alt="img" />
              <div className="blogDetails">
                <div>
                  <p>Techndevs</p>
                  <span>Muhammad invited you to like this Page</span>
                </div>
                <img src={Images.Like} alt="Like" />
              </div>
            </div>
            <div className="pagesBlog">
              <img src={Images.image43} alt="img" />
              <div className="blogDetails">
                <div>
                  <p>Wanhaar Blood</p>
                  <span>Ijlal invited you to like this Page</span>
                </div>
                <img src={Images.Like} alt="Like" />
              </div>
            </div>
            <div className="pagesBlog">
              <img src={Images.image44} alt="img" />
              <div className="blogDetails">
                <div>
                  <p>Just For Fun</p>
                  <span>Ahmad invited you to like this Page</span>
                </div>
                <img src={Images.Like} alt="Like" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CategoryWiseGroups;
