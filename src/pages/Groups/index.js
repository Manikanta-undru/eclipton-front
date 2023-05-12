import React from 'react';
import { alertBox } from '../../commonRedux';
import A from '../../components/A';
import Button from '../../components/Button';
import GroupFilter from '../../components/Filter/groupFilter';
import RewardsWidget from '../../components/RewardsWidget';
import { mygroups, joinedgroups, getGpCategory } from '../../http/group-calls';
import Images from '../../assets/images/images';
import './style/groups.scss';
import ManageGroup from '../SeeAll/manage-groups';
import MemberGroup from '../SeeAll/member-groups';
import AllGroups from './allgroup';
import CategoryGroups from './categorygroup';
// import {PostCount} from '../../GroupFunctions';

class Groups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 4,
      page: 1,
      perpage: 4,
      filter: 0,
      managegrop: [],
      manageusergrp: [],
      data: {
        search: '',
      },
      filterdata: [],
      currentUser: this.props.currentUser,
      _id: this.props.currentUser._id,
      groupscategory: [],
      groupsall: [],
      postcounts: [],
    };
  }

  componentDidMount() {
    const dataa = {};
    const d = dataa;
    d.page = this.state.page;
    d.perpage = 4;
    d.limit = this.state.limit;
    d._id = this.props.currentUser._id;
    mygroups(d).then(
      (res) => {
        console.log(res, 'resultsss');
        this.setState({
          managegrop: res.data,
        });
      },
      (err) => {
        console.log(err);
      }
    );

    //   getallgroup().then(
    //     (resp) => {
    //      var datas = resp.data;

    //      this.setState({
    //       groupsall:datas
    //       })
    //     },
    //     (err) => {
    //     console.log(err);
    //     }
    // );

    joinedgroups(d).then(
      (res) => {
        console.log(res);
        this.setState({
          manageusergrp: res.data,
        });
      },
      (err) => {
        console.log(err);
      }
    );

    getGpCategory({ limit: 4 }).then(
      (resp) => {
        console.log('resp', resp);
        if (resp.message == 'success' && resp.status == 200) {
          this.setState({
            groupscategory: resp.data,
          });
        }
      },
      (err) => {
        alertBox(true, err, 'Error');
      }
    );
    // walletbalance().then((result) => {
    // })

    // PostCount().then((res) => {
    //   console.log(res.postdatas[0],"res")
    //   this.setState({postcounts:res.postdatas})
    //   console.log(this.state.postcounts,"postcount")
    // })
  }

  dataChange = (data = {}) => {
    this.setState({ data });
    console.log(data.search, 'data', Object.keys(data).length);
  };

  render() {
    return (
      <div className="firstTimeGroupFilterPage">
        <div className="container my-wall-container ">
          <div className="row mt-2">
            {/* <!-- left column --> */}
            <div className="col-sm empty-container-with-out-border left-column">
              <GroupFilter
                dataChange={this.dataChange}
                groupscategory={this.state.groupscategory}
              />
              <ManageGroup userGroups={this.state.managegrop} />
              <MemberGroup usermanagegrp={this.state.manageusergrp} />
              {/* <AllSuggested /> */}
            </div>
            {/* <!-- end left column --> */}

            {/* <!-- center column --> */}
            <div className="col-sm empty-container-with-out-border center-column">
              {this.state.filter == 0 ? (
                <div className="banner">
                  <div className="banner-header" />
                  <div className="banner-body">
                    <div className="banner-img">
                      <img src={Images.Ellipse39} alt="banner" />
                    </div>
                    <div className="banner-desc">
                      <h3>{`Let's hire work or hire talents!`}</h3>
                      <p>
                        An easy marketplace for digital services where
                        individuals or companies can go to find freelancers and
                        gigs with a skill that suits their needs.
                      </p>
                    </div>
                    <div className="banner-btns">
                      <A href="/group">
                        <Button className="primaryBtn">Create Groups</Button>
                      </A>
                      <A href="/mygroup">
                        <Button className="primaryBtn">My Groups</Button>
                      </A>
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}

              <AllGroups
                currentUser={this.state.currentUser}
                props={this.props}
                limit={4}
                page="all"
                filter={this.state.data}
                postcount={this.state.postcounts}
              />
              {/* {this.state.filter == 0 ?  <AllGroups currentUser={this.state.currentUser} props={this.props} limit={4} page="all" filter={this.state.data} postcount={this.state.postcounts} />
 : <Filteredgroup filter={this.state.filter} filtersearch={this.state.data} groupsall={this.state.groupsall}/>} */}
              {/* <Filteredgroup filter={this.state.filter} filtersearch={this.state.data} groupsall={this.state.groupsall}/>} */}
              {this.state.filter == 0 ? (
                <CategoryGroups groupscategory={this.state.groupscategory} />
              ) : (
                ''
              )}
              {/* {this.state.filter == 0 ? <FriendsGroups currentUser={this.state.currentUser} /> : ""} */}
              {/* {this.state.filter == 0 ? <PopularGroups currentUser={this.state.currentUser}  populargrop = {this.state.groupsall} postcount={this.state.postcounts}/> :""} */}
              {/* {this.state.filter == 0 ? <PageGroups /> :""} */}
            </div>
            {/* <!-- end center column --> */}

            {/* <!--  right column --> */}
            <div className="col-sm empty-container-with-out-border right-column">
              <RewardsWidget {...this.props} />
            </div>
            {/* <!-- end right column --> */}
          </div>
        </div>
      </div>
    );
  }
}

export default Groups;
