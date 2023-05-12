import React from 'react';
import { Link } from 'react-router-dom';
import { getallgroup } from '../../http/group-calls';
import Images from '../../assets/images/images';
import './style/groups.scss';

const pairsdet = require('./json/pairdetails.json');

class Filteredgroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupsall: [],
      filterstring: '',
      filterdata: [],
    };
  }

  componentDidMount() {
    if (
      this.props.filtersearch.category != '' ||
      this.props.filtersearch.sub != ''
    ) {
      this.getcatgrygrps();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const datas = prevProps.groupsall;
    let filgrop;
    if (this.props.filtersearch.search !== prevProps.filtersearch.search) {
      filgrop = [];
      datas.filter((items) => {
        if (items.name.includes(prevProps.filtersearch.search) == true) {
          filgrop.push(items);
        }
      });
      if (filgrop.length > 0) {
        this.setState({
          filterdata: filgrop,
        });
      }
    }

    if (this.props.filtersearch.location !== prevProps.filtersearch.location) {
      filgrop = [];
      datas.filter((items) => {
        if (
          items.location.toLowerCase() ==
          this.props.filtersearch.location.toLowerCase()
        ) {
          filgrop.push(items);
        }
      });
      if (filgrop.length > 0) {
        this.setState({
          filterdata: filgrop,
        });
      }
    }

    if (this.props.filtersearch.value !== prevProps.filtersearch.value) {
      datas.filter((items) => {
        pairsdet.map((pair) => {
          if (
            pair.fromCurrency.currencySymbol == items.currency &&
            pair.toCurrency.currencySymbol == 'USD'
          ) {
            const mprice = pair.marketPrice;
            const cprice = mprice * items.amount;
            if (
              cprice >= this.props.filtersearch.value[0] &&
              cprice <= this.props.filtersearch.value[1]
            ) {
              filgrop.push(items);
            }
          }
        });
      });
      if (filgrop.length > 0) {
        this.setState({
          filterdata: filgrop,
        });
      }
    }

    if (this.props.filtersearch.category != undefined) {
      if (
        this.props.filtersearch.category.length > 0 &&
        this.props.filtersearch.category !== prevProps.filtersearch.category
      ) {
        let countfil = 0;
        datas.map((items) => {
          if (this.props.filtersearch.category[0] != 'all') {
            for (let i = 0; i <= this.props.filtersearch.category.length; i++) {
              if (items.category == this.props.filtersearch.category[i]) {
                countfil++;
                filgrop.push(items);
              }
            }
          } else {
            countfil++;
            filgrop.push(items);
          }
        });
        if (filgrop.length == countfil && filgrop.length > 0) {
          this.setState({
            filterdata: filgrop,
          });
        }
      }
    }
    if (this.props.filtersearch.sub != undefined) {
      if (
        this.props.filtersearch.sub.length > 0 &&
        this.props.filtersearch.sub !== prevProps.filtersearch.sub
      ) {
        let countfil = 0;
        datas.map((items) => {
          for (let i = 0; i <= this.props.filtersearch.sub.length; i++) {
            const typepay =
              items.purchase_type.charAt(0).toUpperCase() +
              items.purchase_type.slice(1);
            if (
              typepay == this.props.filtersearch.sub[i] ||
              (this.props.filtersearch.sub[i] == 'One time Subscription' &&
                items.payment_type == '1time') ||
              (this.props.filtersearch.sub[i] == 'Recurrence' &&
                items.payment_type == 'recurrence')
            ) {
              countfil++;
              filgrop.push(items);
            } else if (this.props.filtersearch.sub[i] == 'free & paid') {
              countfil++;
              filgrop.push(items);
            }
          }
        });
        if (filgrop.length == countfil && filgrop.length > 0) {
          this.setState({
            filterdata: filgrop,
          });
        }
      }
    }
  }

  getfiltergrps() {
    const d = {};
    d.page = 1;
    d.limit = 4;
    d.perpage = 10;
    getallgroup(d).then(
      (resp) => {
        const datas = resp.data;
        console.log(datas, 'datasdatas');
        this.setState({
          groupsall: datas,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getcatgrygrps() {
    const datas = this.props.groupsall;
    let filgrop = [];
    if (this.props.filtersearch.category != undefined) {
      filgrop = [];
      datas.map((items) => {
        if (this.props.filtersearch.category[0] != 'all') {
          if (items.category == this.props.filtersearch.category[0]) {
            filgrop.push(items);
          }
        } else {
          filgrop.push(items);
        }
      });
      if (filgrop.length > 0) {
        this.setState({
          filterdata: filgrop,
        });
      }
    }

    if (this.props.filtersearch.sub != undefined) {
      filgrop = [];
      datas.map((items) => {
        const typepay =
          items.purchase_type.charAt(0).toUpperCase() +
          items.purchase_type.slice(1);
        if (typepay == this.props.filtersearch.sub[0]) {
          filgrop.push(items);
        }
      });
      if (filgrop.length > 0) {
        this.setState({
          filterdata: filgrop,
        });
      }
    }
  }

  render() {
    let groups_all = [];
    if (this.state.filterdata.length > 0) {
      groups_all = this.state.filterdata;
    } else {
      groups_all = this.state.groupsall;
    }

    const Grups = groups_all.map((groups, index) => (
      <div className="groupBlog" key={index}>
        {/* <img src={Images.image45} alt="img" /> */}
        <img src={groups.banner} alt="img" style={{ width: 100 }} />
        <div className="rightArea">
          <p>{groups.name}</p>
          <div className="dp-flex">
            <div>
              <ul>
                <li>10K followers</li>
                <li>10 post /day</li>
              </ul>
            </div>
            <span className="al-r freeText">
              {groups.purchase_type == 'free' ? 'Free' : 'Paid'}{' '}
            </span>
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
      <div className="groupsContainer">
        <div className="heading">
          <div>
            <p>Groups</p>
            <span>Free Groups you might be interested in</span>
          </div>
          <Link href="#">See more</Link>
        </div>
        <div className="groupBlogArea">
          {Grups}
          {groups_all == '' ? <div className="groupBlog">No Groups</div> : ''}
        </div>
      </div>
    );
  }
}

export default Filteredgroup;
