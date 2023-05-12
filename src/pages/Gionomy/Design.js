import queryString from 'query-string';
import React, { Component } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Link } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap-tabs';
import Dialog from '@material-ui/core/Dialog';
import { alertBox, switchLoader } from '../../commonRedux';
import A from '../../components/A';
import Button from '../../components/Button';
import Modal from '../../components/Popup';
import TabsUI from '../../components/Tabs/index';
import WalletAvailableBalance from '../../components/Wallet/availableBalance';
import { profilePic } from '../../globalFunctions';
import {
  getGig,
  getGigBids,
  getGigRequest,
  gigStatusUpdate,
  likePost,
  purchaseGig,
  rejectBid,
  removeBid,
  removeGig,
} from '../../http/gig-calls';

import { postReport, postUnReport } from '../../http/http-calls';
import {
  gigHandshake,
  gigRelease,
  removeReport,
} from '../../http/wallet-calls';
import { history } from '../../store';
import { Tiles } from './ImageView';
import GigReportModal from '../../components/Report/gig';
import MobileNav from '../../components/Menu/MobileNav';

require('./styles.scss');

const coins = require('./add/coins.json');

class Design extends Component {
  constructor(props) {
    super(props);
    this.state = {
      global: false,
      id: this.props.match.params.id,
      gig: null,
      agree: false,
      reported: false,
      coinId: null,
      extras: [],
      reason: '',
      category: '',
      hashtags_gig: '',
      extraAmount: 0,
      reportModal: false,
      deliverytime: 0,
      fast: false,
      subtotal: 0,
      fee: 0,
      total: 0,
      qs: null,
      slug: '',
      currentTab: 0,
      standardPrice: false,
      premiumPrice: false,
      totalPrice: false,
      buyModal: false,
      enableEditButton: false,
      premiumTotal: false,
      enablePremiumEditButton: false,
      isGigReport: false,
      activeIndex: -1,
      data: [
        {
          title: 'Platform',
          options: ['iOS & Android (dual)'],
        },
        {
          title: 'App Type',
          options: ['Hybrid'],
        },
        {
          title: 'Development Technology',
          options: ['Flutter', 'React Native', 'Java'],
        },
        {
          title: 'Purpose',
          options: [
            'Chat',
            'Delivery',
            'Restaurant',
            'Shopping',
            'Taxi',
            'Entertainment',
            'Health & fitness',
            'Maps & navigation',
            'News',
            'Productivity tools',
          ],
        },
        {
          title: 'Expertise',
          options: [
            'Performance',
            'Design',
            'Ads & monetization',
            'Firebase',
            'Release management',
            'Instant App/App Clip',
          ],
        },
      ],
      isApproveReject: false,
      isRequestTotal: false,
      requestBidTotal: null,
      requestBidCurrency: null,
      requestUserId: null,
      requestBidEmail: null,
      requestBid: null,
      requestId: null,
      bid: null,
    };
  }

  reportModal = () => {
    this.setState({ isGigReport: true }); // true/false toggle
  };

  buyModal = () => {
    this.setState({ buyModal: !this.state.buyModal });

    // var sales_gigs = this.state.gig.sales;

    // if (sales_gigs != undefined && sales_gigs.length > 0) {
    //     sales_gigs.map((item) => {
    //         if ((item.status == 2 || item.status == 1) && (item.userid == this.props.currentUser._id && item.postid == this.state.gig._id)) {
    //             alertBox(true, "Your buy request gigs are currently process with that profile");

    //         } else {
    //             this.setState({ buyModal: !this.state.buyModal })

    //         }
    //     })
    // } else {
    //     this.setState({ buyModal: !this.state.buyModal })
    // }
  };

  report = (p) => {
    if (this.state.category == '') {
      alertBox(true, 'You need to select a category');
    } else {
      const link = `gigonomy/gig/${p._id}`;
      postReport({
        id: p._id,
        type: 'gig',
        link,
        category: this.state.category,
        reason: this.state.reason,
      }).then(
        async (resp) => {
          alertBox(true, resp.message, 'success');
          this.setState({ reportModal: false, reported: true });
        },
        (error) => {
          alertBox(true, error.data.message);
          this.setState({ reportModal: false });
        }
      );
    }
  };

  unReport = (p) => {
    const con = window.confirm('Are you sure want to undo this report?');
    if (con == true) {
      postUnReport({ id: p.gig._id }).then(
        async (resp) => {
          removeReport({ item_id: p.gig._id }).then(
            async (resp) => {},
            (error) => {
              alertBox(true, 'Something went wrong!');
            }
          );
          alertBox(true, resp.message, 'success');
          this.setState({ reported: false });
        },
        (error) => {
          alertBox(true, error.data.message);
        }
      );
    }
  };

  componentDidMount() {
    if (this.props.match.params.id !== 'edit') {
      switchLoader(true, 'Please wait...');

      const restrict_type = ['audio', 'video'];
      for (let index = 0; index < restrict_type.length; index++) {
        const element = restrict_type[index];
        const data_dat = document.getElementsByTagName(element)[0];
        if (data_dat) {
          data_dat.setAttribute('controlslist', 'nodownload');
        }
      }
      try {
        const queries = queryString.parse(this.props.location.search);
        if (
          queries.request != undefined &&
          queries.request != null &&
          queries.request != ''
        ) {
          this.setState({
            qs: queries.request,
            isApproveReject: true,
          });
        }
        if (
          queries.bid != undefined &&
          queries.bid != null &&
          queries.bid != ''
        ) {
          this.setState({
            bid: queries.bid,
            isApproveReject: true,
          });
        }
      } catch (error) {
        /* empty */
      }

      this.getData();
      const p = this.props.location.pathname;
      if (
        p.indexOf('/blog/') != -1 &&
        (this.props.currentUser == undefined || this.props.currentUser == null)
      ) {
        this.setState({
          global: true,
        });
      } else {
        this.setState({
          global: false,
        });
        // this.logout();
      }
    }
  }

  loginRedirect = () => {
    window.location.href = `/login?next=${this.props.location.pathname}`;
  };

  getData = () => {
    const queries = queryString.parse(this.props.location.search);
    if (
      queries.request != undefined &&
      queries.request != null &&
      queries.request != ''
    ) {
      getGigRequest({ id: queries.request, userid: null }).then(
        (resp) => {
          this.setState({
            requestId: resp.post._id,
            requestUserId: resp.post.userid,
            requestBidTotal: resp.post.budget,
            requestBidCurrency: resp.post.preferedCurrency,
            requestBidEmail: resp.post.userinfo.email,
          });
          getGigBids({ id: resp.post._id, limit: 100, page: 1 }).then(
            (resp) => {
              if (
                queries.bid != undefined &&
                queries.bid != null &&
                queries.bid != ''
              ) {
                const data = resp.filter((data) => data._id === queries.bid);
                this.setState({
                  requestBid: data[0],
                });
              }
            }
          );
        },
        (err) => {}
      );
    }
    getGig({
      id: this.state.id,
      userid:
        this.props.currentUser && this.props.currentUser._id
          ? this.props.currentUser._id
          : 0,
    }).then(
      (resp) => {
        if (resp && resp.message != 'Not Found') {
          let hashtags_gig = '';
          const standardPay = {
            standardPrice: resp.standardPrice,
            standardDays: resp.standardDays,
          };
          const premiumPay = {
            premiumPrice: resp.premiumPrice,
            premiumDays: resp.premiumDays,
          };
          if (
            this.state.standardPrice === false &&
            this.state.premiumPrice === false
          ) {
            this.standardHandler(standardPay);
          } else if (
            this.state.standardPrice === true &&
            this.state.premiumPrice === false
          ) {
            this.standardHandler(standardPay);
          } else if (
            this.state.standardPrice === false &&
            this.state.premiumPrice === true
          ) {
            this.premiumHandler(premiumPay);
          }

          resp.hashtags.map((item, i) => {
            if (resp.hashtags.length != i + 1) {
              hashtags_gig += `${item},`;
            } else {
              hashtags_gig += item;
            }
          });
          if (
            resp.price_extra != undefined &&
            typeof resp.price_extra === 'object'
          ) {
            var all_curr = [];

            all_curr.push({
              currency: resp.preferedCurrency,
              standard_price: resp.standardPrice,
              premium_price: resp.premiumPrice,
            });

            const price_extra_list = resp.price_extra.map((item) => {
              if (item != null && item != undefined) {
                const object_cur = {
                  currency: item.pay_currency,
                  standard_price: item.standard_amount,
                  premium_price: item.premium_amount,
                };
                all_curr.push(object_cur);
              }
            });
          } else {
            all_curr = [resp.preferedCurrency];
          }
          let extra_fields_forms = [];
          if (
            resp.dynamic_fields != undefined &&
            resp.dynamic_fields.length > 0 &&
            resp.metadata != undefined &&
            resp.metadata.length > 0
          ) {
            extra_fields_forms = [...resp.dynamic_fields, ...resp.metadata];
          } else if (
            (resp.dynamic_fields == undefined ||
              resp.dynamic_fields.length == 0) &&
            resp.metadata != undefined &&
            resp.metadata.length > 0
          ) {
            extra_fields_forms = resp.metadata;
          } else if (
            resp.dynamic_fields != undefined &&
            resp.dynamic_fields.length > 0 &&
            resp.metadata == undefined &&
            resp.metadata.length == 0
          ) {
            extra_fields_forms = resp.dynamic_fields;
          } else {
            extra_fields_forms = [];
          }
          console.log(extra_fields_forms, 'extra_fields_forms');
          const purchase_data = resp.sales.filter(
            (item) =>
              item.data.gig_req_id === this.state.requestId && item.status === 1
          );
          this.setState(
            {
              gig: resp,
              purchase: purchase_data[0],
              data: extra_fields_forms,
              seller_perferred: all_curr,
              prefer_first_currency: resp.preferedCurrency,
              reported: resp.reported >= 1,
              hashtags_gig,
            },
            () => {
              // this.premiumHandler(premiumPay);
              // try {
              //     var text = resp.editorContent == undefined || resp.editorContent == null || resp.editorContent == '' ?  resp.text : JSON.parse(resp.editorContent);
              //     this.setState({
              //         postText: text
              //     });
              // } catch (error) {
              //     this.setState({
              //         postText: resp.text
              //         })
              //     }
            }
          );

          coins.forEach((e) => {
            if (e.currencySymbol == resp.preferedCurrency) {
              this.setState({
                coinId: e._id,
              });
            }
          });
        } else {
          alertBox(true, resp.message);
        }
        switchLoader();
      },
      (err) => {
        console.log(err);
      }
    );
  };

  changeTab = (newValue) => {
    this.setState({
      currentTab: newValue,
    });
  };

  closeHandler = () => {
    history.push('/passionomy');
  };

  standardHandler = (resp) => {
    resp = resp != undefined ? resp : this.state.gig;
    const fee = (resp.standardPrice * 2.2) / 100;
    const tot = resp.standardPrice + fee;
    const { extras } = this.state;
    if (this.state.fast == false && extras.length == 0) {
      this.setState({
        deliverytime: resp.standardDays,
        fee,
        total: tot,
        subtotal: resp.standardPrice,
        agree: false,
        standardPrice: true,
        premiumPrice: false,
        enableEditButton: false,
        enablePremiumEditButton: false,
      });
    } else {
      this.setState({
        standardPrice: true,
        premiumPrice: false,
        enableEditButton: false,
        enablePremiumEditButton: false,
      });
    }
  };

  premiumHandler = (resp) => {
    resp = resp != undefined ? resp : this.state.gig;
    const fee = (resp.premiumPrice * 2.2) / 100;
    const tot = resp.premiumPrice + fee;
    const { extras } = this.state;

    if (this.state.fast == false && extras.length == 0) {
      this.setState({
        deliverytime: resp.premiumDays,
        fee,
        agree: false,
        subtotal: resp.premiumPrice,
        total: tot,
        premiumPrice: true,
        standardPrice: false,
        enableEditButton: false,
        enablePremiumEditButton: false,
      });
    } else {
      this.setState({
        premiumPrice: true,
        standardPrice: false,
        enableEditButton: false,
        enablePremiumEditButton: false,
      });
    }
  };

  standardIconHandler = () => {
    this.setState({
      currentTab: 0,
      standardPrice: false,
      premiumPrice: false,
      enableEditButton: false,
      enablePremiumEditButton: false,
    });
  };

  premiumIconHandler = () => {
    this.setState({
      currentTab: 1,
      standardPrice: false,
      premiumPrice: false,
      enableEditButton: false,
      enablePremiumEditButton: false,
    });
  };

  totalHandler = () => {
    this.setState({
      buyModal: true,
      totalPrice: true,
      standardPrice: false,
      premiumPrice: false,
      enableEditButton: false,
      enablePremiumEditButton: false,
    });
  };

  premiumTotalHandler = () => {
    this.setState({
      buyModal: true,
      premiumTotal: true,
      standardPrice: false,
      premiumPrice: false,
      enableEditButton: false,
      enablePremiumEditButton: false,
    });
  };

  requestTotalHandler = () => {
    this.setState({
      approveopen: false,
      buyModal: true,
      isRequestTotal: true,
      premiumTotal: false,
      standardPrice: false,
      premiumPrice: false,
      enableEditButton: false,
      enablePremiumEditButton: false,
    });
  };

  totalIconHandler = () => {
    this.setState({
      // standardPrice: true,
      // premiumPrice: false,
      // totalPrice: false,
      // enableEditButton: false,
      // premiumTotal: false,
      // enablePremiumEditButton: false
    });
  };

  premiumTotalIconHandler = () => {
    // this.setState({ standardPrice: false, premiumPrice: true, totalPrice: false, enableEditButton: false, premiumTotal: false, enablePremiumEditButton: false })
  };

  viewHandler = () => {
    // window.location.href = '/passionomy/gigs/purchased';
    // window.location.href = '/passionomy/dashboard/purchased';
    window.location.href = `/passionomy/dashboard/gig/${this.state.gig._id}`;
  };

  mutualButtonHandler = () => {
    if (this.state.agree) {
      switchLoader(true, 'Payment in progress, please wait...');
      const data = {
        currency: this.state.gig.preferedCurrency,
        amount: this.state.total,
        type: 'Pending',
        currId: this.state.coinId,
        email: this.state.gig.userinfo.email,
      };

      gigHandshake(data).then(
        (resp) => {
          if (resp.Status == true) {
            const data2 = {
              request:
                this.state.qs != '' ? this.state.qs : this.state.gig.slug,
              receiver: this.state.gig.userid,
              postid: this.state.gig._id,
              amt: this.state.total,
              fee: this.state.fee,
              days: this.state.deliverytime,
              fast: this.state.fast,
              currency: this.state.gig.preferedCurrency,
              email: this.state.gig.userinfo.email,
              refid: resp.Data,
              plan: 'standard',
              extras: this.state.extras,
            };
            purchaseGig(data2).then(
              (resp2) => {
                switchLoader();
                this.setState({
                  standardPrice: false,
                  premiumPrice: false,
                  totalPrice: false,
                  premiumTotal: false,
                  enableEditButton: true,
                  enablePremiumEditButton: false,
                  buyModal: false,
                });
                setTimeout(() => {
                  // After 3 seconds set the show value to false
                  alertBox(
                    true,
                    'You have successfully purchased this gig',
                    'success'
                  );
                }, 3000);

                window.location.href = `/passionomy/dashboard/gig/${this.state.gig._id}`;
              },
              (err2) => {
                switchLoader();
                alertBox(
                  true,
                  `Error purchasing the gig, please check your ${this.state.gig.preferedCurrency} balance`
                );
              }
            );
          } else {
            switchLoader();
            alertBox(
              true,
              `Error purchasing the gig, please check your ${this.state.gig.preferedCurrency} balance`
            );
          }
        },
        (err) => {
          switchLoader();
          alertBox(
            true,
            `Error purchasing the gig, please check your ${this.state.gig.preferedCurrency} balance`
          );
        }
      );
    } else {
      alertBox(true, 'You need to agree to the terms and conditions');
    }
  };

  premiumMutualButtonHandler = () => {
    if (this.state.agree) {
      switchLoader(true, 'Payment in progress, please wait premium...');
      const data = {
        currency: this.state.gig.preferedCurrency,
        amount: this.state.total,
        type: 'Pending',
        currId: this.state.coinId,
        email: this.state.gig.userinfo.email,
      };
      gigHandshake(data).then(
        (resp) => {
          if (resp.Status == true) {
            const data2 = {
              request:
                this.state.qs != '' ? this.state.qs : this.state.gig.slug,
              receiver: this.state.gig.userid,
              postid: this.state.gig._id,
              amt: this.state.total,
              days: this.state.deliverytime,
              fast: this.state.fast,
              fee: this.state.fee,
              currency: this.state.gig.preferedCurrency,
              email: this.state.gig.userinfo.email,
              refid: resp.Data,
              plan: 'premium',
              extras: this.state.extras,
            };
            purchaseGig(data2).then(
              (resp2) => {
                switchLoader();
                this.setState({
                  standardPrice: false,
                  premiumPrice: false,
                  totalPrice: false,
                  premiumTotal: false,
                  enableEditButton: false,
                  enablePremiumEditButton: true,
                  buyModal: false,
                });
                alertBox(
                  true,
                  'You have successfully purchased this gig',
                  'success'
                );
              },
              (err2) => {
                switchLoader();
                alertBox(
                  true,
                  `Error purchasing the gig, please check your ${this.state.gig.preferedCurrency} balance`
                );
              }
            );
          } else {
            switchLoader();
            alertBox(
              true,
              `Error purchasing the gig, please check your ${this.state.gig.preferedCurrency} balance`
            );
          }
        },
        (err) => {
          switchLoader();
          alertBox(
            true,
            `Error purchasing the gig, please check your ${this.state.gig.preferedCurrency} balance`
          );
        }
      );
    } else {
      alertBox(true, 'You need to agree to the terms and conditions');
    }
  };

  requestMutualButtonHandler = () => {
    if (this.state.agree) {
      coins.forEach((e) => {
        if (e.currencySymbol == this.state.requestBidCurrency) {
          this.setState({
            coinId: e._id,
          });
          switchLoader(true, 'Payment in progress, please wait premium...');
          const data = {
            currency: this.state.requestBidCurrency,
            amount: this.state.requestBidTotal,
            type: 'Pending',
            currId: e._id,
            email: this.state.gig.userinfo.email,
          };
          gigHandshake(data).then(
            (resp) => {
              if (resp.Status == true) {
                const data2 = {
                  request:
                    this.state.qs != '' ? this.state.qs : this.state.gig.slug,
                  receiver: this.state.gig.userid,
                  postid: this.state.gig._id,
                  amt: this.state.requestBidTotal,
                  days: this.state.deliverytime,
                  fast: this.state.fast,
                  fee: this.state.fee,
                  currency: this.state.requestBidCurrency,
                  email: this.state.gig.userinfo.email,
                  refid: resp.Data,
                  plan: 'premium',
                  extras: this.state.extras,
                  bid: this.state.requestBid._id,
                };
                purchaseGig(data2).then(
                  (resp2) => {
                    switchLoader();
                    this.setState({
                      isRequestTotal: false,
                      standardPrice: false,
                      premiumPrice: false,
                      totalPrice: false,
                      premiumTotal: false,
                      enableEditButton: false,
                      enablePremiumEditButton: true,
                      buyModal: false,
                    });
                    window.location.href = `/passionomy/request/${this.state.qs}`;
                    alertBox(
                      true,
                      'You have successfully purchased this gig',
                      'success'
                    );
                  },
                  (err2) => {
                    switchLoader();
                    alertBox(
                      true,
                      `Error purchasing the gig, please check your ${this.state.requestBidCurrency} balance`
                    );
                  }
                );
              } else {
                switchLoader();
                alertBox(
                  true,
                  `Error purchasing the gig, please check your ${this.state.requestBidCurrency} balance`
                );
              }
            },
            (err) => {
              switchLoader();
              alertBox(
                true,
                `Error purchasing the gig, please check your ${this.state.requestBidCurrency} balance`
              );
            }
          );
        }
      });
    } else {
      alertBox(true, 'You need to agree to the terms and conditions');
    }
  };

  likePostFn = (postId, liked) => {
    // if(liked != 0){
    this.setState({ post: { ...this.state.post, likeActive: 1 - liked } });
    // }
    likePost({ postid: postId }, true).then(
      async (resp) => {
        let temp;
        if (resp.message == 'Like') {
          temp = { ...this.state.gig };
          temp.likeActive = 1;
          temp.likesCount += 1;
          this.setState({
            gig: temp,
          });
          alertBox(true, 'You gave a heart to this gig', 'success');
        } else if (resp.message == 'Dislike') {
          temp = { ...this.state.gig };
          temp.likeActive = 0;
          temp.likesCount -= 1;
          this.setState({
            gig: temp,
          });
          alertBox(true, 'You removed your heart from this gig', 'success');
        }
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  addFast = (e) => {
    const { checked } = e.target;
    const price = this.state.gig.fastPrice;
    const days = this.state.gig.fastDays;
    let dt = this.state.deliverytime;
    let st = this.state.subtotal;
    let ot = this.state.oldtime;
    let fast = false;
    if (checked) {
      fast = true;
      st += price;
      ot = dt;
      dt = days;
    } else if (price != st) {
      st -= price;
      dt = ot;
    } else {
      st = price;
      dt = ot;
    }
    const fee = (st * 2.2) / 100;
    const tot = st + fee;
    this.setState({
      deliverytime: dt,
      oldtime: ot,
      fast,
      subtotal: st,
      fee,
      total: tot,
    });
  };

  findAndRemove = (array, property, value) => {
    array.forEach((result, index) => {
      if (result[property] === value) {
        // Remove from array
        array.splice(index, 1);
      }
    });
    return array;
  };

  addExtra = async (e, i, extraname) => {
    const { checked } = e.target;
    let extra = [...this.state.extras];
    let st = this.state.subtotal;
    const ex = { ...this.state.gig.extras[i] };
    let delivery = ex.value;
    let extrachecked = false;
    if (checked) {
      extrachecked = true;
      ex.num = i;
      extra.push(ex);
      st += Number(ex.amount);
    } else {
      st -= Number(ex.amount);
      extra = this.findAndRemove(extra, 'num', i);
      delivery =
        this.state.standardPrice == true
          ? this.state.gig.standardDays
          : this.state.gig.premiumDays;
    }
    const fee = (st * 2.2) / 100;
    const tot = st + fee;
    this.setState(
      {
        extras: extra,
        [extraname]: extrachecked,
        deliverytime: delivery,
        subtotal: st,
        total: tot,
        fee,
      },
      () => {}
    );
  };

  handleChange = (evt, index) => {
    const { name, value } = evt.target;
    const { gig } = this.state;
    if (name == 'pay_currency' && value != this.state.prefer_first_currency) {
      const fil_val = this.state.gig.price_extra.filter(
        (e) => e != null && e.pay_currency == value
      );
      const standard_price_val =
        fil_val.length > 0 ? Number(fil_val[0].standard_amount) : '';
      const premium_price_val =
        fil_val.length > 0 ? Number(fil_val[0].premium_amount) : '';
      const prefer_coin_id = coins.filter((coi) => coi.currencySymbol == value);
      const standardPay = {
        standardPrice: standard_price_val,
        standardDays: gig.standardDays,
      };
      const premiumPay = {
        premiumPrice: premium_price_val,
        premiumDays: gig.premiumDays,
      };
      // this.standardHandler(standardPay);
      // if(this.state.premiumPrice === true){
      //     this.premiumHandler(premiumPay)
      // }
      if (
        this.state.standardPrice === false &&
        this.state.premiumPrice === false
      ) {
        this.standardHandler(standardPay);
      } else if (
        this.state.standardPrice === true &&
        this.state.premiumPrice === false
      ) {
        this.standardHandler(standardPay);
      } else if (
        this.state.standardPrice === false &&
        this.state.premiumPrice === true
      ) {
        this.premiumHandler(premiumPay);
      }
      // if(this.state.standardPrice == true) { this.standardHandler(standardPay) }else{t};
      const seller_prefer = this.state.seller_perferred;
      const fil_currency = seller_prefer.filter(
        (t) => t.currency == this.state.gig.preferedCurrency
      );
      const update_gig = [];

      this.setState((prevState) => ({
        gig: {
          ...prevState.gig,
          standardPrice: standard_price_val,
          premiumPrice: premium_price_val,
          preferedCurrency: value,
          // seller_perferred:update_gig
        },
        coinId: prefer_coin_id[0]._id,
        agree: false,
      }));
      //     this.setState({
      //         standardHandler_view:'<p style="marginTop: 0, marginBottom: "5px"">'+value + " " + standard_price_val+'<br /> Standard</p>',
      //         premiumHandler_view:'<p style="marginTop: 0, marginBottom: "5px"">'+value + " " + premium_price_val+'<br /> Standard</p>'

      //    })
    } else {
      this.getData();
    }

    // this.setState({ [name]: value }, () => { });
  };

  editGig = (gig) => {
    '/passionomy/gig/edit/';
  };

  removePost = (postid) => {
    removeGig({ id: postid }).then(
      async (resp) => {
        alertBox(true, resp.message, 'success');
        history.push('/passionomy/dashboard');
      },
      (error) => {
        alertBox(true, error.data.message);
      }
    );
  };

  clickView = (urlattach, urltype) => {
    // if(urltype == "pdf"){
    //     var type = 'application/pdf'
    // }else{
    //     var type = '';
    // }
    // const file = new Blob([urlattach], { type: type })
    // const fileURL = URL.createObjectURL(file)
    let pdfWindow;
    // pdfWindow = window.open(urlattach,"<iframe>", "width=1000, height=1000")
    pdfWindow = window.open(
      `/passionomy/preview/${encodeURIComponent(urlattach)}/${urltype}`,
      'pdfWindow',
      'width=1000, height=1000'
    ); // Opens a new window
  };

  handleCallbackReport = (data) => {
    if (data.status === 'success') {
      this.setState({
        isGigReport: data.isGigReport,
        reported: true,
      });
    } else {
      this.setState({
        isGigReport: data.isGigReport,
      });
    }
  };

  rejectRequest = (bid) => {
    this.setState({ last: bid, rejectopen: true });
  };

  cancelRequest = (bid) => {
    this.setState({ last: bid, cancelopen: true });
  };

  approveRequest = () => {
    this.setState({ approveopen: true });
  };

  handleClose = () => this.setState({ approveopen: !this.state.approveopen });

  handleCancelClose = () =>
    this.setState({ rejectopen: !this.state.rejectopen });

  handleCancelButtonClose = () =>
    this.setState({ cancelopen: !this.state.cancelopen });

  rejectBid = () => {
    switchLoader(true, 'Please wait...');
    this.setState({ rejectopen: !this.state.rejectopen });
    try {
      rejectBid({ _id: this.state.last }).then((resp) => {
        if (resp.message) {
          switchLoader();
          alertBox(true, resp.message, 'success');
          window.location.href = `/passionomy/request/${this.state.qs}`;
        } else {
          switchLoader();
          alertBox(true, 'Error occured, try again');
        }
      });
    } catch (err) {
      switchLoader();
      alertBox(true, 'Error occured, try again');
    }
  };

  remove = (id) => {
    switchLoader(true, 'Please wait...');
    try {
      removeBid({ id }).then(
        (resp) => {
          switchLoader();
          this.init();
        },
        (err) => {
          switchLoader();
          alertBox(true, err.data.message);
        }
      );
    } catch (error) {
      switchLoader();
      alertBox(true, 'Error occured, try again');
    }
  };

  cancel = () => {
    switchLoader(true, 'Please wait...');
    this.setState({ cancelopen: !this.state.cancelopen });
    if (this.state.purchase && this.state.purchase.data) {
      const dat = {
        transfer_id: this.state.purchase.data.refid,
        status: 'cancel',
      };
      gigRelease(dat).then(
        (resp) => {
          const { data } = this.state.purchase;
          data.statusAt = new Date().toISOString();
          const st = -1;
          const da = {
            data,
            status: st,
            id: this.state.purchase._id,
            bid: this.state.requestBid._id,
          };
          gigStatusUpdate(da).then(
            (resp) => {
              switchLoader();
              const temp = { ...this.state.purchase };
              temp.status = st;
              alertBox(true, 'Gig canceled successfully', 'success');
              window.location.href = `/passionomy/request/${this.state.qs}`;
              this.setState({
                purchase: temp,
              });
            },
            (err) => {
              switchLoader();
              alertBox(true, err.data.message);
            }
          );
        },
        (err) => {
          switchLoader();
          alertBox(true, err.data.message);
        }
      );
    }
  };

  render() {
    let tileStyle = {};
    if (this.state.open) {
      tileStyle = {
        height: '80vh',

        position: 'absolute',
        top: '0%',
        left: '0%',
        right: '0%',
        bottom: '0%',
        boxShadow: '0 0 40px 5px rgba(0, 0, 0, 0.3)',
        transform: 'none',
        zIndex: '1000',
      };
    } else {
      tileStyle = {
        width: '10vw',
      };
    }
    const { gig } = this.state;
    const {
      standardPrice,
      premiumPrice,
      currentTab,
      totalPrice,
      enableEditButton,
      premiumTotal,
      requestBidTotal,
      enablePremiumEditButton,
      isRequestTotal,
    } = this.state;
    const standardLabel = (
      <p style={{ marginTop: 0, marginBottom: '5px' }}>
        {gig != null && `${gig.preferedCurrency} ${gig.standardPrice}`} <br />{' '}
        Standard
      </p>
    );
    const premiumLabel = (
      <p style={{ marginTop: 0, marginBottom: '5px' }}>
        {gig != null && `${gig.preferedCurrency} ${gig.premiumPrice}`} <br />{' '}
        Premium{' '}
      </p>
    );
    // const standardLabelWithIcon = <div onClick={this.standardIconHandler} ><i className="fa fa-arrow-left" aria-hidden="true" style={{ float: 'left', marginTop: '10px', fontSize: '20px' }} /> <span>{gig != null && gig.preferedCurrency + " " + gig.standardPrice} <br /> Standard</span> </div>
    // const premiumLabelWithIcon = <div onClick={this.premiumIconHandler} ><i className="fa fa-arrow-left" aria-hidden="true" style={{ float: 'left', marginTop: '10px', fontSize: '20px' }} /> <span>{gig != null && gig.preferedCurrency + " " + gig.premiumPrice} <br /> Premium</span> </div>
    // const totalLableWithIcon = <div onClick={this.totalIconHandler} > <span>{gig != null && gig.preferedCurrency + " " + this.state.total} <br /> Total</span> </div>
    // const premiumTotalLableWithIcon = <div onClick={this.premiumTotalIconHandler} ><span>{gig != null && gig.preferedCurrency + " " + this.state.total} <br /> Total</span> </div>
    const standardLabelWithIcon = (
      <div onClick={this.standardIconHandler}>
        <i
          className="fa fa-arrow-left"
          aria-hidden="true"
          style={{ float: 'left', marginTop: '10px', fontSize: '20px' }}
        />{' '}
        <span>
          {gig != null && `${gig.preferedCurrency} ${gig.standardPrice}`} <br />{' '}
          Standard
        </span>{' '}
      </div>
    );
    const premiumLabelWithIcon = (
      <div onClick={this.premiumIconHandler}>
        <i
          className="fa fa-arrow-left"
          aria-hidden="true"
          style={{ float: 'left', marginTop: '10px', fontSize: '20px' }}
        />{' '}
        <span>
          {gig != null && `${gig.preferedCurrency} ${gig.premiumPrice}`} <br />{' '}
          Premium
        </span>{' '}
      </div>
    );
    const totalLableWithIcon = (
      <div onClick={this.totalIconHandler}>
        {' '}
        <span>
          {gig != null && `${gig.preferedCurrency} ${this.state.total}`} <br />{' '}
          Total
        </span>{' '}
      </div>
    );
    const premiumTotalLableWithIcon = (
      <div onClick={this.premiumTotalIconHandler}>
        <span>
          {gig != null && `${gig.preferedCurrency} ${this.state.total}`} <br />{' '}
          Total
        </span>{' '}
      </div>
    );
    const isRequestTotalLableWithIcon = (
      <div>
        <span>
          {gig != null &&
            `${this.state.requestBidCurrency} ${this.state.requestBidTotal}`}{' '}
          <br /> Total
        </span>{' '}
      </div>
    );

    let buttonLabel;
    const mutualLabel = (
      <>
        Mutual handshake
        <p className="tooltip" style={{ margin: 0 }}>
          <i
            className="fa fa-info-circle"
            aria-hidden="true"
            style={{ marginLeft: '5px' }}
          />
          <span className="tooltiptext">
            Payment will be freezed and will be credited to the seller once the
            work is complete.
          </span>
        </p>
      </>
    );
    let buttonCallFunction;

    if (
      currentTab === 0 &&
      isRequestTotal === false &&
      standardPrice === false &&
      premiumPrice === false &&
      totalPrice === false &&
      enableEditButton === false &&
      premiumTotal === false &&
      enablePremiumEditButton === false
    ) {
      buttonLabel = `Continue (${
        gig != null && `${gig.preferedCurrency} ${gig.standardPrice}`
      })`;
      buttonCallFunction = this.standardHandler;
    } else if (isRequestTotal) {
      buttonLabel = `Continue (${`${this.state.requestBidCurrency} ${this.state.requestBidTotal}`})`;
      buttonCallFunction = this.requestMutualButtonHandler;
    } else if (
      currentTab === 1 &&
      isRequestTotal === false &&
      standardPrice === false &&
      premiumPrice === false &&
      totalPrice === false &&
      enableEditButton === false &&
      premiumTotal === false &&
      enablePremiumEditButton === false
    ) {
      buttonLabel = `Continue (${
        gig != null && `${gig.preferedCurrency} ${gig.premiumPrice}`
      })`;
      buttonCallFunction = this.premiumHandler;
    } else if ((isRequestTotal === false && standardPrice) || premiumPrice) {
      buttonLabel = 'Checkout';
      if (standardPrice) {
        buttonCallFunction = this.totalHandler;
      } else {
        buttonCallFunction = this.premiumTotalHandler;
      }
    } else if ((isRequestTotal === false && totalPrice) || premiumTotal) {
      buttonLabel = mutualLabel;
      if (totalPrice) {
        buttonCallFunction = this.mutualButtonHandler;
      }
      if (premiumTotal) {
        buttonCallFunction = this.premiumMutualButtonHandler;
      }
    } else if (
      (isRequestTotal === false && enableEditButton) ||
      enablePremiumEditButton
    ) {
      if (enableEditButton && currentTab === 0) {
        buttonLabel = 'View';
        buttonCallFunction = this.viewHandler;
      }
      if (enablePremiumEditButton && currentTab === 1) {
        buttonLabel = 'View';
        buttonCallFunction = this.viewHandler;
      }
      if (enableEditButton && currentTab === 1) {
        buttonLabel = `Continue (${
          gig != null && `${gig.preferedCurrency} ${gig.premiumPrice}`
        })`;
        buttonCallFunction = this.premiumHandler;
      }
      if (enablePremiumEditButton && currentTab === 0) {
        buttonLabel = `Continue (${
          gig != null && `${gig.preferedCurrency} ${gig.standardPrice}`
        })`;
        buttonCallFunction = this.standardHandler;
      }
    }

    return (
      <div className="settingsPage gigonomyPage">
        <Modal
          displayModal={this.state.reportModal}
          closeModal={this.reportModal}
        >
          <div>
            <div className="form-group">
              <select
                className="form-control"
                value={this.state.category}
                onChange={(e) => this.setState({ category: e.target.value })}
              >
                <option value="">Select Category</option>
                <option>Violence</option>
                <option>Racism / Hatespeech</option>
                <option>Pornographic</option>
                <option>Spam</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <textarea
                type="text"
                placeholder="Reason"
                className="form-control"
                onChange={(e) => this.setState({ reason: e.target.value })}
                value={this.state.reason}
              />
            </div>
          </div>
          <div className="">
            <Button
              variant="primary"
              size="compact m-2"
              onClick={() => this.report(gig)}
            >
              Report
            </Button>
            <Button
              variant="secondary"
              size="compact m-2"
              onClick={this.reportModal}
            >
              Cancel
            </Button>
          </div>
        </Modal>
        <Dialog
          onClose={this.handleCancelClose}
          className="confirm-modal"
          open={this.state.rejectopen}
        >
          <strong className="text-center p-2">
            <big>Confirmation</big>
          </strong>
          <p className="p-2">Are you sure about reject this?</p>
          <div className="p-2 d-flex align-items-center justify-content-around">
            <Button onClick={this.handleCancelClose} variant="secondary">
              Cancel
            </Button>
            <Button onClick={this.rejectBid} variant="primary">
              Yes
            </Button>
          </div>
        </Dialog>
        <Dialog
          onClose={this.handleCancelButtonClose}
          className="confirm-modal"
          open={this.state.cancelopen}
        >
          <strong className="text-center p-2">
            <big>Confirmation</big>
          </strong>
          <p className="p-2">Are you sure about cancel this?</p>
          <div className="p-2 d-flex align-items-center justify-content-around">
            <Button onClick={this.handleCancelButtonClose} variant="secondary">
              Cancel
            </Button>
            <Button onClick={this.cancel} variant="primary">
              Yes
            </Button>
          </div>
        </Dialog>
        <Dialog
          onClose={this.handleClose}
          className="confirm-modal"
          open={this.state.approveopen}
        >
          <strong className="text-center p-2">
            <big>Confirmation</big>
          </strong>
          <p className="p-2">Are you sure about approve this?</p>
          <div className="p-2 d-flex align-items-center justify-content-around">
            <Button onClick={this.handleClose} variant="secondary">
              Cancel
            </Button>
            <Button
              onClick={(e) =>
                this.state.global
                  ? this.loginRedirect()
                  : this.requestTotalHandler()
              }
              variant="primary"
            >
              Yes
            </Button>
          </div>
        </Dialog>
        {this.state.gig == null ? (
          <div />
        ) : (
          <div className="modal-1 active checkDesign-modal">
            <Modal
              displayModal={this.state.buyModal}
              closeModal={this.buyModal}
            >
              <div
                className="container w-100 design-price"
                style={{ paddingTop: '1rem' }}
              >
                <div className="row">
                  <ul className="list-group w-100">
                    {
                      // (totalPrice && standardPrice === false && premiumPrice === false && premiumTotal === false) &&
                      totalPrice &&
                        standardPrice === false &&
                        premiumPrice === false &&
                        premiumTotal === false && (
                          <div className="premium-design-price">
                            <TabsUI
                              style={{
                                height: '50px',
                                borderBotton: '4px solid #8362fb',
                              }}
                              tabs={[totalLableWithIcon]}
                              type="transactions"
                              className="noBorder"
                              currentTab={this.state.currentTab}
                              changeTab={this.changeTab}
                            />
                          </div>
                        )
                    }

                    {
                      // (totalPrice && standardPrice === false && premiumPrice === false && premiumTotal === false) &&
                      isRequestTotal &&
                        standardPrice === false &&
                        premiumPrice === false &&
                        premiumTotal === false && (
                          <div className="premium-design-price">
                            <TabsUI
                              style={{
                                height: '50px',
                                borderBotton: '4px solid #8362fb',
                              }}
                              tabs={[isRequestTotalLableWithIcon]}
                              type="transactions"
                              className="noBorder"
                              currentTab={this.state.currentTab}
                              changeTab={this.changeTab}
                            />
                          </div>
                        )
                    }

                    {
                      // (premiumTotal && standardPrice === false && premiumPrice === false && totalPrice === false) &&
                      premiumTotal &&
                        standardPrice === false &&
                        premiumPrice === false && (
                          <div className="premium-design-price">
                            <TabsUI
                              style={{
                                height: '50px',
                                borderBotton: '4px solid #8362fb',
                              }}
                              tabs={[premiumTotalLableWithIcon]}
                              type="transactions"
                              className="noBorder"
                              currentTab="0"
                              changeTab={this.changeTab}
                            />
                          </div>
                        )
                    }

                    <li
                      style={{ height: ' auto' }}
                      className="list-group-item d-flex justify-content-between align-items-start flex-column header-drak "
                    >
                      {totalPrice ? (
                        <div style={{ height: 'auto', marginTop: '1rem' }}>
                          <b>Available currency</b>
                          <WalletAvailableBalance />
                          <div style={{ marginTop: '0' }}>
                            <b>Seller Preferred Currency</b>
                            <p>
                              {this.state.seller_perferred.length > 0 &&
                                this.state.seller_perferred.map((e, r) =>
                                  e != null &&
                                  r + 1 != this.state.seller_perferred.length
                                    ? `${e.currency},`
                                    : e.currency
                                )}
                            </p>

                            <div className="form-group agree-form">
                              <div className="checkbox">
                                <input
                                  type="checkbox"
                                  name="extAgree"
                                  value={this.state.agree}
                                  onClick={() => {
                                    this.setState({ agree: !this.state.agree });
                                  }}
                                />
                                <span className="ps-1">I agree to the</span>{' '}
                                <A
                                  href={`${process.env.REACT_APP_FRONTEND}terms-and-conditions.pdf`}
                                  target="_BLANK"
                                  className="text-main"
                                >
                                  Terms & Conditions
                                </A>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        premiumTotal ||
                        (isRequestTotal && (
                          <div style={{ height: ' auto', marginTop: '1rem' }}>
                            <b>Available currency</b>
                            <WalletAvailableBalance />

                            <div style={{ marginTop: '0' }}>
                              <b>Seller Preferred Currency</b>
                              <p>
                                {this.state.seller_perferred.length > 0 &&
                                  this.state.seller_perferred.map((e, r) =>
                                    e != null &&
                                    r + 1 != this.state.seller_perferred.length
                                      ? `${e.currency},`
                                      : e.currency
                                  )}
                              </p>
                              <div className="form-group agree-form">
                                <div className="checkbox">
                                  <input
                                    type="checkbox"
                                    name="extAgree"
                                    value={this.state.agree}
                                    onClick={() => {
                                      this.setState({
                                        agree: !this.state.agree,
                                      });
                                    }}
                                  />
                                  <span className="ps-1">I agree to the</span>{' '}
                                  <A
                                    href={`${process.env.REACT_APP_FRONTEND}terms-and-conditions.pdf`}
                                    target="_BLANK"
                                    className="text-main"
                                  >
                                    Terms & Conditions
                                  </A>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                      <br />
                      <div className="col-md-12 text-end">
                        {/* <p>{enableEditButton || enablePremiumEditButton ? 'You have successfully initiated the handshake' : ''}</p> */}
                        <button
                          className={
                            buttonLabel === 'View'
                              ? 'continueBtn edit-btn'
                              : 'continueBtn'
                          }
                          onClick={() =>
                            this.state.global
                              ? this.loginRedirect()
                              : buttonCallFunction()
                          }
                        >
                          {' '}
                          {buttonLabel}{' '}
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </Modal>
          </div>
        )}
        {this.state.gig == null ? (
          <div style={{ margin: '5%' }} />
        ) : (
          <div className="container my-wall-container design">
            <MobileNav />
            <div className="offset-md-2 col-md col-lg-8 col-sm m-auto d-flex justify-content-center mobileProfile">
              <div className="gigViews centerWrapper">
                <div className="container">
                  <div className="row">
                    <div className="col">
                      <h4>{gig.subject}</h4>
                    </div>
                    <div className="col">
                      <div className="dropdown floRight">
                        <i className="fa fa-ellipsis-h" aria-hidden="true" />
                        <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                          {gig.userid != this.props.currentUser._id ? (
                            this.state.reported > 0 ? (
                              <a
                                onClick={() => this.unReport(this.state)}
                                className="dropdown-item"
                              >
                                <i className="fa fa-undo" />
                                <span className="m-1">Undo Report</span>
                              </a>
                            ) : (
                              <a
                                onClick={() => this.reportModal()}
                                className="dropdown-item"
                              >
                                <i className="fa fa-exclamation-circle" />
                                <span className="m-1">Report</span>
                              </a>
                            )
                          ) : null}
                          {gig.userid == this.props.currentUser._id && (
                            <Link
                              to={`/passionomy/gig/edit/${gig.slug}`}
                              className="dropdown-item edit-remove-padding"
                            >
                              <img
                                className="mr-1"
                                src={require('../../assets/images/edit-icon.png')}
                              />
                              <span className="m-1">Edit</span>
                            </Link>
                          )}

                          {gig.userid == this.props.currentUser._id && (
                            <a
                              className="dropdown-item edit-remove-padding"
                              onClick={(e) => this.removePost(gig._id)}
                            >
                              <img
                                className="mr-1"
                                src={require('../../assets/images/remove-icon.png')}
                              />
                              <span className="m-1">Remove</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <img
                        src={this.state.gig.banner}
                        className="img-fluid gigViewsImg"
                      />
                    </div>
                    <div className="col py-2">
                      <div className="gigViewsproImg">
                        <a
                          className="text-secondary"
                          href={`/u/${gig.userinfo._id}`}
                        >
                          <img
                            src={profilePic(
                              gig.userinfo.avatar,
                              gig.userinfo.name
                            )}
                            className="img-fluid"
                          />
                          <span className="desipro">
                            {gig.userinfo.name
                              ? gig.userinfo.name
                              : gig.userinfo.username}
                          </span>
                        </a>
                      </div>
                    </div>
                    <div className="col text-right py-3">
                      <h5 className="catTitle">
                        {gig.category}{' '}
                        <i className="fa fa-chevron-right" aria-hidden="true" />{' '}
                        {gig.subCategory}
                      </h5>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <h4 className="pt-1">About this {gig.subject}</h4>
                    </div>
                    {this.props.currentUser._id !== gig.userid && (
                      <div className="col">
                        <div className="likeBt">
                          <i
                            className={`fa fa-heart heartThis ${
                              gig != undefined && gig.likeActive > 0
                                ? 'active'
                                : ''
                            }`}
                            onClick={(e) => {
                              this.props.currentUser == null
                                ? (window.location.href = `/login?next=/passionomy/gig/${gig.slug}`)
                                : this.likePostFn(gig._id, gig.likeActive);
                            }}
                          />
                          <span className="count">{gig.likesCount}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="row mb-2">
                    <div className="gigViewspage">
                      <div
                        className="dynamic-content"
                        dangerouslySetInnerHTML={{ __html: gig.text }}
                      />
                    </div>
                  </div>

                  <div className="row meta-data mb-2">
                    <div
                      className="accordion mb-4 gigs-accordion"
                      id="accordionExample"
                    >
                      {this.state.data.map((item, index) => (
                        <div className="accordion-item" key={index}>
                          <h2
                            className="accordion-header"
                            id={`heading${index}`}
                          >
                            <button
                              className="accordion-button collapsed "
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapse${index}`}
                              aria-expanded="false"
                              aria-controls={`collapse${index}`}
                            >
                              {item.field_name !== undefined
                                ? item.field_name
                                : item.title}
                            </button>
                          </h2>
                          <div
                            id={`collapse${index}`}
                            className="accordion-collapse collapse"
                            aria-labelledby="headingTwo"
                            data-bs-parent="#accordionExample"
                          >
                            <ul className="accordion-body">
                              <p>
                                {item.field_value != undefined
                                  ? item.field_value
                                  : item.checkedvalues != '' &&
                                    item.other_val != ''
                                  ? `${item.checkedvalues},${item.other_val}`
                                  : item.checkedvalues != ''
                                  ? item.checkedvalues
                                  : ''}
                              </p>
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="row">
                    <div className="galDisplayPre">
                      <label className="mb-3">Gallery of gigs </label>
                      <br />
                      {/* <span class="galDisplay"><i class="fa fa-file-image-o" aria-hidden="true" ></i> Gallery Attachment</span> */}

                      <Tiles data={gig.contents} />
                    </div>
                  </div>

                  <div className="row tagseBox">
                    <div className="col">
                      {gig.hashtags.length > 0 &&
                        gig.hashtags.map((items) => (
                          <span className="tagseBox_btn" key={items}>
                            {items}
                          </span>
                        ))}
                    </div>

                    <div className="col tagseBox_no">
                      <div className="tagseBox_count">
                        <i className="fa fa-shopping-cart mainIcon" />
                        <span className="count">{gig.salesCount}</span>
                      </div>
                      <div className="tagseBox_count">
                        <i className="fa fa-star startIc" aria-hidden="true" />
                        <span className="count">{gig.rating}</span>
                      </div>
                    </div>
                  </div>

                  {this.state.isApproveReject &&
                  this.state.requestUserId === this.props.currentUser._id &&
                  this.state.requestBid !== null &&
                  this.state.requestBid !== undefined ? (
                    <div className="offset-lg-2 col-lg-8 col-md-12 mt-4 d-flex justify-content-center">
                      <div className="row">
                        <div className="startData">
                          {this.state.requestBid.status == 1 ? (
                            <p className="text-success">Accepted</p>
                          ) : this.state.requestBid.status == 0 ? (
                            <>
                              <a
                                className="acceptedBtns"
                                href="javascript:void(0)"
                                onClick={(e) => this.approveRequest()}
                              >
                                Accept
                              </a>
                              <a
                                className="remBtn"
                                href="javascript:void(0)"
                                onClick={(e) =>
                                  this.rejectRequest(this.state.bid)
                                }
                              >
                                Reject
                              </a>
                            </>
                          ) : this.state.requestBid.status == 2 ? (
                            <p className="text-success">Rejected</p>
                          ) : this.state.requestBid.status == -1 ? (
                            <p className="text-success">Canceled</p>
                          ) : null}
                          {this.state.requestBid.status == 0 &&
                          this.state.requestUserId !=
                            this.props.currentUser._id ? (
                            <p className="text-success">Requested</p>
                          ) : (
                            <p />
                          )}
                          {this.state.requestBid.status == 1 &&
                          this.state.requestUserId ==
                            this.props.currentUser._id ? (
                            <button
                              className="remBtn"
                              onClick={(e) => this.cancelRequest()}
                            >
                              Cancel
                            </button>
                          ) : (
                            <p />
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="gigviewformBox">
                        <h3>Price Details</h3>
                        <label className="p-2">Select Category</label>
                        <Tabs
                          onSelect={(index, label, gig) => {
                            const labbesl = label.match('Standard');
                            labbesl !== null
                              ? this.standardHandler(gig)
                              : this.premiumHandler(gig);
                          }}
                        >
                          <Tab
                            label={
                              gig != null &&
                              `Standard ${gig.preferedCurrency} ${gig.standardPrice}`
                            }
                          >
                            <div className="gigTabform">
                              <div className="row">
                                {/* <div className='col-md-4'> */}
                                {/* <label>Standard Price</label> */}
                                {/* {
                                                                        gig.features.map((f, i) => {
                                                                            return f == null || f.feature == "" ? null : <p style={{ marginBottom: 0 }}>{f.feature} : <i className="fa fa-check" aria-hidden="true" style={{ color: (f.standard == 1) ? '#8362fb' : '#bfbfbf' }} /> </p>
                                                                        })
                                                                    } */}
                                {/* </div> */}
                                <div className="col-md-4">
                                  <label>Currency</label>
                                  <div className="multiSelecttext">
                                    <p>
                                      <span>
                                        <div className="form-group">
                                          <select
                                            className="form-control currencySelect"
                                            name="pay_currency"
                                            onChange={this.handleChange}
                                            value={
                                              this.state.gig.preferedCurrency
                                            }
                                          >
                                            {/* <option value={gig.preferedCurrency}>{gig.preferedCurrency}</option> */}
                                            {this.state.seller_perferred
                                              .length > 0 &&
                                              this.state.seller_perferred.map(
                                                (e, r) =>
                                                  e != null && e != 'BLCK' ? (
                                                    <option
                                                      key={r}
                                                      value={e.currency}
                                                    >
                                                      {e.currency} -{' '}
                                                      {e.standard_price}
                                                    </option>
                                                  ) : null
                                              )}
                                          </select>
                                        </div>
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <label>Delivery</label>
                                  <p>
                                    Delivery Time :{' '}
                                    <span>
                                      {' '}
                                      {gig.standardDays}{' '}
                                      {parseInt(gig.standardDays) > 1
                                        ? 'Days Delivery'
                                        : 'Day Delivery'}{' '}
                                      <i
                                        className="fa fa-clock-o"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </p>
                                </div>
                                <div className="col-md-4">
                                  <div className="spanLable">
                                    <span className="spanLable_span">
                                      Fast Delivery
                                    </span>
                                    <span className="spanLable_span">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="paymentType"
                                        value="paid"
                                        id="paid"
                                        onClick={(e) => this.addFast(e)}
                                        // eslint-disable-next-line react/no-unknown-property
                                        uncheckedValue="free"
                                        checked={this.state.fast == true}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="exampleCheck1"
                                      >
                                        {' '}
                                        {gig.fastDays}{' '}
                                        {parseInt(gig.fastDays) > 1
                                          ? 'Days'
                                          : 'Day'}{' '}
                                        (
                                        {`${gig.preferedCurrency} ${gig.fastPrice}`}
                                        ){' '}
                                      </label>
                                    </span>
                                  </div>
                                </div>

                                {gig.extras.map((ex, i) =>
                                  ex == null ? null : (
                                    <div className="col-md-4" key={i}>
                                      <div className="spanLable">
                                        <span className="spanLable_span">
                                          {ex.feature}
                                        </span>
                                        <span className="spanLable_span">
                                          {/* <input className="form-check-input" type="checkbox" name="paymentType" value="paid" id="paid" uncheckedValue="free" onClick={(e) => this.addExtra(e, i, ex.feature)} checked={this.state[ex.feature] == true ? true : false} /> */}
                                          <label
                                            className="form-check-label"
                                            htmlFor="defaultCheck1"
                                            style={{ fontSize: '14px' }}
                                          >
                                            {ex.value_one}
                                          </label>
                                        </span>
                                      </div>
                                    </div>
                                  )
                                )}

                                {/* <div className='col-md-4'>
                                                                    <div className='spanLable'>
                                                                        <span className='spanLable_span'>Extra 2</span>
                                                                        <span>
                                                                            <input type="checkbox" class="form-check-input" id="exampleCheck1" />
                                                                            <label class="form-check-label" for="exampleCheck1">1/2 Days (USD 5)</label>
                                                                        </span>
                                                                    </div>
                                                                </div> */}
                              </div>
                              {this.props.currentUser._id !== gig.userid ? (
                                <div className="gigvtable">
                                  <h6 className="gigvtable_h6">Summary</h6>
                                  <div className="table-responsive">
                                    <table className="table gigs_price">
                                      <tbody>
                                        <tr>
                                          <td>Delivery time</td>
                                          <td className="text-right">
                                            {this.state.deliverytime} Day(s)
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Subtotal</td>
                                          <td className="text-right">
                                            {`${
                                              gig.preferedCurrency
                                            } ${this.state.subtotal?.toFixed(
                                              8
                                            )}`}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Service fee</td>
                                          <td className="text-right">
                                            {`${
                                              gig.preferedCurrency
                                            } ${this.state.fee?.toFixed(8)}`}
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>Total</th>
                                          <th className="text-right">
                                            {`${
                                              gig.preferedCurrency
                                            } ${this.state.total?.toFixed(8)}`}
                                          </th>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>

                                  <div className="pull-right pb-3">
                                    <button
                                      className="primaryBtn"
                                      onClick={(e) =>
                                        this.state.global
                                          ? this.loginRedirect()
                                          : this.totalHandler()
                                      }
                                    >
                                      Checkout
                                    </button>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </Tab>
                          <Tab
                            label={
                              gig != null &&
                              `Premium ${gig.preferedCurrency} ${gig.premiumPrice}`
                            }
                          >
                            <div className="gigTabform">
                              <div className="row">
                                {/* <div className='col-md-4'> */}
                                {/* <label>Premium Price</label> */}
                                {/* {
                                                                        gig.features.map((f, i) => {
                                                                            return f == null || f.feature == "" ? null : <p style={{ marginBottom: 0 }}> {f.feature} : <i className="fa fa-check" aria-hidden="true" style={{ color: (f.premium == 1) ? '#8362fb' : '#bfbfbf' }} /></p>
                                                                        })
                                                                    } */}
                                {/* </div> */}
                                <div className="col-md-4">
                                  <label>Currency</label>
                                  <div className="multiSelecttext">
                                    <p>
                                      <span>
                                        <div className="form-group">
                                          <select
                                            className="form-control currencySelect"
                                            name="pay_currency"
                                            onChange={this.handleChange}
                                            value={
                                              this.state.gig.preferedCurrency
                                            }
                                          >
                                            {/* <option value={gig.preferedCurrency}>{gig.preferedCurrency}</option> */}
                                            {this.state.seller_perferred
                                              .length > 0 &&
                                              this.state.seller_perferred.map(
                                                (e, r) =>
                                                  e != null && e != 'BLCK' ? (
                                                    <option
                                                      key={r}
                                                      value={e.currency}
                                                    >
                                                      {e.currency} -{' '}
                                                      {e.premium_price}
                                                    </option>
                                                  ) : null
                                              )}
                                          </select>
                                        </div>
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <label>Delivery</label>
                                  <p>
                                    Delivery Time:{' '}
                                    <span>
                                      {' '}
                                      {this.state.gig.premiumDays}{' '}
                                      {parseInt(this.state.gig.premiumDays) > 1
                                        ? 'Days Delivery'
                                        : 'Day Delivery'}{' '}
                                      <i
                                        className="fa fa-clock-o"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </p>
                                </div>
                                <div className="col-md-4">
                                  <div className="spanLable">
                                    <span className="spanLable_span">
                                      Fast Delivery
                                    </span>
                                    <span className="spanLable_span">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        name="paymentType"
                                        value="paid"
                                        id="paid"
                                        onClick={(e) => this.addFast(e)}
                                        // eslint-disable-next-line react/no-unknown-property
                                        uncheckedValue="free"
                                        checked={this.state.fast == true}
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="exampleCheck1"
                                      >
                                        {' '}
                                        {gig.fastDays}{' '}
                                        {parseInt(gig.fastDays) > 1
                                          ? 'Days'
                                          : 'Day'}{' '}
                                        (
                                        {`${gig.preferedCurrency} ${gig.fastPrice}`}
                                        )
                                      </label>
                                    </span>
                                  </div>
                                </div>

                                {gig.extras.map((ex, i) =>
                                  ex == null ? null : (
                                    <div className="col-md-4" key={i}>
                                      <div className="spanLable">
                                        <span className="spanLable_span">
                                          {ex.feature}
                                        </span>
                                        <span className="spanLable_span">
                                          {/* <input type="checkbox" name="paymentType" value="paid" id="paid" uncheckedValue="free" onClick={(e) => this.addExtra(e, i, ex.feature)} checked={this.state[ex.feature] == true ? true : false} /> */}
                                          <label
                                            className="form-check-label"
                                            htmlFor="exampleCheck1"
                                          >
                                            {ex.value_two}
                                          </label>
                                        </span>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                              {this.props.currentUser._id !== gig.userid ? (
                                <div className="gigvtable">
                                  <h6 className="gigvtable_h6">Summary</h6>

                                  <div className="table-responsive">
                                    <table className="table gigs_price">
                                      <tbody>
                                        <tr>
                                          <td className="noborder">
                                            Delivery time
                                          </td>
                                          <td className="text-right second">
                                            {this.state.deliverytime} Day(s)
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Subtotal</td>
                                          <td className="text-right second">
                                            {`${
                                              gig.preferedCurrency
                                            } ${this.state.subtotal?.toFixed(
                                              8
                                            )}`}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>Service fee</td>
                                          <td className="text-right second">
                                            {`${
                                              gig.preferedCurrency
                                            } ${this.state.fee?.toFixed(8)}`}
                                          </td>
                                        </tr>
                                        <tr>
                                          <th>Total</th>
                                          <th className="text-right second">
                                            {`${
                                              gig.preferedCurrency
                                            } ${this.state.total?.toFixed(8)}`}
                                          </th>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>

                                  <div className="pull-right pb-3">
                                    <button
                                      className="primaryBtn"
                                      onClick={(e) =>
                                        this.state.global
                                          ? this.loginRedirect()
                                          : this.premiumTotalHandler()
                                      }
                                    >
                                      Checkout
                                    </button>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </Tab>
                        </Tabs>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {this.state.isGigReport && (
          <GigReportModal
            parentCallback={this.handleCallbackReport}
            isGigReport={this.state.isGigReport}
            gigId={gig._id}
          />
        )}
      </div>
    );
  }
}

export default Design;
