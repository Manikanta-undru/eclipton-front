import React from 'react';
import { alertBox } from '../../commonRedux';
import { allGigRequests, getGigs } from '../../http/gig-calls';
import { postReport, postUnReport } from '../../http/http-calls';
import Images from '../../assets/images/images';
import './style/groups.scss';

class PageGroups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 4,
      page: 1,
      cid: 0,
      posts: [],
      category: '',
      reason: '',
      reportModal: false,
      data: {
        category: '',
        subCategory: '',
        priceFrom: '',
        priceTo: '',
        rating: '',
        key: '',
      },
      lastData: null,
      lastI: null,
      lastType: null,
      gigs: [],
      currentTab: 0,
    };
  }

  reportModal = (p = null, i = null, t = null) => {
    this.setState({
      lastData: p,
      lastI: i,
      lastType: t,
    });
    this.setState({ reportModal: !this.state.reportModal }); // true/false toggle
  };

  report = () => {
    const { lastData } = this.state;
    const { lastI } = this.state;
    const link = `gigonomy/gig/${lastData._id}`;
    postReport({
      id: lastData._id,
      type: this.state.lastType,
      link,
      category: this.state.category,
      reason: this.state.reason,
    }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        const temp = this.state.posts;
        temp[lastI].reported = 1;
        this.setState({ reportModal: false, posts: temp });
      },
      (error) => {
        alertBox(true, error.data.message);
        this.setState({ reportModal: false });
      }
    );
  };

  unReport = (post, i) => {
    postUnReport({ id: post._id }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        const temp = this.state.posts;
        temp[i].reported = 0;
        this.setState({ reportModal: false, posts: temp });
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  componentDidMount() {
    // this.getData();
    // this.getRequests();
  }

  categoryChange = (c) => {
    this.setState({
      cid: c,
      currentTab: 0,
    });
  };

  dataChange = (data = {}) => {
    // this.props.history.push("/passionomy/gig");
    this.getData(data);
    this.getRequests(data);
  };

  getData = (data = {}) => {
    this.setState({
      gigs: [],
    });
    const d = data;
    d.page = this.state.page;
    d.limit = this.state.limit;
    d.userid = this.props.currentUser._id;
    getGigs(d).then(
      (resp) => {
        this.setState(
          {
            gigs: resp.post,
          },
          () => {}
        );
      },
      (err) => {
        console.log(err);
      }
    );
  };

  getRequests = (data = {}) => {
    this.setState({
      posts: [],
    });
    const d = data;
    d.page = this.state.page;
    d.limit = this.state.limit;
    d.userid = this.props.currentUser._id;
    allGigRequests(data).then(
      (resp) => {
        this.setState({
          posts: resp,
        });
      },
      (err) => {}
    );
  };

  changeTab = (newValue) => {
    this.setState({ currentTab: newValue });
  };

  render() {
    return (
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
        </div>
      </div>
    );
  }
}

export default PageGroups;
