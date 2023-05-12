import React from 'react';
import { alertBox } from '../../commonRedux';
import GroupFilter from '../../components/Filter/groupFilter';
import RewardsWidget from '../../components/RewardsWidget';
import {
  mygroups,
  joinedgroups,
  getGpCategory,
  getallgroup,
} from '../../http/group-calls';
import './style/groups.scss';
import ManageGroup from '../SeeAll/manage-groups';
import MemberGroup from '../SeeAll/member-groups';
import AllGroups from './allgroup';
import { PostCount } from '../../GroupFunctions';

class Groupsall extends React.Component {
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
      postcounts: [],
      groupsall: [],
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
        this.setState({
          managegrop: res.data,
        });
      },
      (err) => {
        console.log(err);
      }
    );

    joinedgroups(d).then(
      (res) => {
        this.setState({
          manageusergrp: res.data,
        });
      },
      (err) => {
        console.log(err);
      }
    );

    getallgroup().then(
      (resp) => {
        const datas = resp.data;

        this.setState({
          groupsall: datas,
        });
      },
      (err) => {
        console.log(err);
      }
    );

    getGpCategory().then(
      (resp) => {
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
    PostCount().then((res) => {
      console.log(res.postdatas[0], 'res');
      this.setState({ postcounts: res.postdatas });
      console.log(this.state.postcounts, 'postcount');
    });
  }

  dataChange = (data = {}) => {
    this.setState({ data });
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
              <AllGroups
                currentUser={this.state.currentUser}
                props={this.props}
                page="all"
                filter={this.state.data}
                perpage="all"
                postcount={this.state.postcounts}
              />
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

export default Groupsall;
