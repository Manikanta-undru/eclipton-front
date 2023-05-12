import React from 'react';
import Helmet from 'react-helmet';
import Loadable from 'react-loadable';
import LoadingOverlay from 'react-loading-overlay';
import { connect } from 'react-redux';
import { Router, Switch, Redirect } from 'react-router-dom';
import { push } from 'react-router-redux';
import queryString from 'query-string';
import Alert from './components/Alert';
import Footer from './components/Footer';
import Header from './components/Header/index';
import Modal from './components/Modal';
import {
  ALERTCLOSE,
  APP_LOAD,
  MODALCLOSE,
  MODALNEXT,
  REDIRECT,
  SWITCH_LOADER,
} from './constants/actionTypes';
import PrivateRoute from './hooks/PrivateRoute';
import PublicRoute from './hooks/PublicRoute';
import { getCurrentUser } from './http/token-interceptor';
import WalletConfirm from './pages/Wallet/confirm';
import CreditCard from './pages/Front/CreditCard/index.js';
import PaymentWallet from './pages/Front/payment/payment.js';
import { history, store } from './store';
import Spinner from './components/Spinner';
import MarketDiscounts from './pages/MarketArea/discount';
import DiscountAdd from './pages/MarketArea/discount/add';

const mapStateToProps = (state) => ({
  appLoaded: state.common.appLoaded,
  appName: state.common.appName,
  currentUser: state.common.currentUser,
  redirectTo: state.common.redirectTo,
  loaderState: state.common.loaderState,
  loaderText: state.common.loaderText,
  alertOpen: state.common.alertOpen,
  alertMessage: state.common.alertMessage,
  alertType: state.common.alertType,
  alertClose: state.common.alertClose,
  modalOpen: state.common.modalOpen,
  modalProps: state.common.modalProps,
  modalType: state.common.modalType,
  modalClose: state.common.modalClose,
  modalNext: state.common.modalNext,
});

const mapDispatchToProps = (dispatch) => ({
  onLoad: (payload, token) =>
    dispatch({ type: APP_LOAD, payload, token, skipTracking: true }),
  onRedirect: () => dispatch({ type: REDIRECT }),
  switchLoaderRoot: (isActive, loaderText) =>
    dispatch({
      type: SWITCH_LOADER,
      isActive,
      loaderText,
    }),
});

function Loading() {
  const styles = {
    newLoader: {
      position: 'fixed',
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
      background: '#ffffff10',
      zIndex: '9998',
    },
    spinner: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      zIndex: '9999',
    },
  };
  return (
    <div className="new-loader" style={styles.newLoader}>
      <div style={styles.spinner}>
        {' '}
        <Spinner />
      </div>
    </div>
  );
}

const Login = Loadable({
  loader: () => import('./pages/Login'),
  loading: Loading,
});

const AuthResponse = Loadable({
  loader: () => import('./pages/AuthResponse'),
  loading: Loading,
});

const TwitterLogin = Loadable({
  loader: () => import('./pages/TwitterLogin'),
  loading: Loading,
});

const GoogleLoginn = Loadable({
  loader: () => import('./pages/GoogleLogin'),
  loading: Loading,
});

const Register = Loadable({
  loader: () => import('./pages/Register'),
  loading: Loading,
});

const Home = Loadable({
  loader: () => import('./pages/Home'),
  loading: Loading,
});
const MyFeed = Loadable({
  loader: () => import('./pages/MyFeed'),
  loading: Loading,
});
const MyBlogs = Loadable({
  loader: () => import('./pages/MyBlogs'),
  loading: Loading,
});

const ForgotPassword = Loadable({
  loader: () => import('./pages/ForgotPassword'),
  loading: Loading,
});

const MyProfile = Loadable({
  loader: () => import('./pages/MyProfile'),
  loading: Loading,
});

const GlobalProfile = Loadable({
  loader: () => import('./pages/GlobalProfile'),
  loading: Loading,
});

const SinglePost = Loadable({
  loader: () => import('./pages/SinglePost'),
  loading: Loading,
});

const AddBlog = Loadable({
  loader: () => import('./pages/MyBlogs/add'),
  loading: Loading,
});

const EditBlog = Loadable({
  loader: () => import('./pages/MyBlogs/edit'),
  loading: Loading,
});

const WalletDashboard = Loadable({
  loader: () => import('./pages/Wallet'),
  loading: Loading,
});
const APIKeys = Loadable({
  loader: () => import('./pages/Wallet/api'),
  loading: Loading,
});
const WalletDeposit = Loadable({
  loader: () => import('./pages/Wallet/deposit'),
  loading: Loading,
});
const WalletTransfer = Loadable({
  loader: () => import('./pages/Wallet/transfer'),
  loading: Loading,
});
const BuyCryptoOrders = Loadable({
  loader: () => import('./pages/Wallet/BuyCryptoOrders'),
  loading: Loading,
});
const WalletTransactions = Loadable({
  loader: () => import('./pages/Wallet/transactions'),
  loading: Loading,
});
const WalletVerification = Loadable({
  loader: () => import('./pages/Wallet/verification'),
  loading: Loading,
});
const WalletWithdraw = Loadable({
  loader: () => import('./pages/Wallet/withdraw'),
  loading: Loading,
});
const SingleBlog = Loadable({
  loader: () => import('./pages/SingleBlog'),
  loading: Loading,
});

const Settings = Loadable({
  loader: () => import('./pages/Settings'),
  loading: Loading,
});

const SearchResult = Loadable({
  loader: () => import('./pages/SearchResult'),
  loading: Loading,
});

const CategoryWiseBlogs = Loadable({
  loader: () => import('./pages/CategoryWiseBlogs'),
  loading: Loading,
});
const AuthorWiseBlogs = Loadable({
  loader: () => import('./pages/SeeAll/author-blogs'),
  loading: Loading,
});
const AuthorWiseGigs = Loadable({
  loader: () => import('./pages/SeeAll/author-gigs'),
  loading: Loading,
});
const AllSuggested = Loadable({
  loader: () => import('./pages/SeeAll/suggested'),
  loading: Loading,
});
const AllPopularArticles = Loadable({
  loader: () => import('./pages/SeeAll/popular-articles'),
  loading: Loading,
});
const AllPopularGigs = Loadable({
  loader: () => import('./pages/SeeAll/popular-gigs'),
  loading: Loading,
});

const AllNotifications = Loadable({
  loader: () => import('./pages/SeeAll/notifications'),
  loading: Loading,
});

const ContactUs = Loadable({
  loader: () => import('./pages/Contact'),
  loading: Loading,
});

const LandingPage = Loadable({
  loader: () => import('./pages/LandingPage'),
  loading: Loading,
});

const WalletTrade = Loadable({
  loader: () => import('./pages/Wallet/trade'),
  loading: Loading,
});

const TFA = Loadable({
  loader: () => import('./pages/Wallet/tfa'),
  loading: Loading,
});

const Verify = Loadable({
  loader: () => import('./pages/Register/verify'),
  loading: Loading,
});

const Gionomy = Loadable({
  loader: () => import('./pages/Gionomy'),
  loading: Loading,
});

const AddGig = Loadable({
  loader: () => import('./pages/Gionomy/add/index'),
  loading: Loading,
});

const EditGig = Loadable({
  loader: () => import('./pages/Gionomy/add/edit'),
  loading: Loading,
});

const GigRequest = Loadable({
  loader: () => import('./pages/Gionomy/request'),
  loading: Loading,
});
const MyGigRequests = Loadable({
  loader: () => import('./pages/Gionomy/requests/index'),
  loading: Loading,
});
const AllGigRequests = Loadable({
  loader: () => import('./pages/Gionomy/all-requests'),
  loading: Loading,
});
const AllGigs = Loadable({
  loader: () => import('./pages/Gionomy/all-gigs'),
  loading: Loading,
});
const ViewGigRequest = Loadable({
  loader: () => import('./pages/Gionomy/ViewRequest'),
  loading: Loading,
});

const Design = Loadable({
  loader: () => import('./pages/Gionomy/Design'),
  loading: Loading,
});
const SellerCustomer = Loadable({
  loader: () => import('./pages/Gionomy/Seller/Seller'),
  loading: Loading,
});
const SellerDashboard = Loadable({
  loader: () => import('./pages/Gionomy/SellerDashboard/SellerDashboard'),
  loading: Loading,
});

const Preview = Loadable({
  loader: () => import('./pages/Gionomy/Preview'),
  loading: Loading,
});

const PurchasedGigs = Loadable({
  loader: () => import('./pages/Gionomy/PurchasedGigs/PurchasedGigs'),
  loading: Loading,
});

const ZignsecSuccess = Loadable({
  loader: () => import('./pages/ZignsecSuccess'),
  loading: Loading,
});
const ZignsecFailed = Loadable({
  loader: () => import('./pages/ZignsecFailed'),
  loading: Loading,
});
const WithdrawAddresses = Loadable({
  loader: () => import('./pages/Wallet/address'),
  loading: Loading,
});
const WithdrawalPassword = Loadable({
  loader: () => import('./pages/Wallet/password'),
  loading: Loading,
});

const WithdrawalRepassword = Loadable({
  loader: () => import('./pages/Wallet/resetpassword'),
  loading: Loading,
});

// Groups
const Groups = Loadable({
  loader: () => import('./pages/Groups'),
  loading: Loading,
});

const CategoryWiseGroups = Loadable({
  loader: () => import('./pages/CategoryWiseGroups'),
  loading: Loading,
});

const addGroup = Loadable({
  loader: () => import('./pages/Groups/addgroup'),
  loading: Loading,
});

const viewgroup = Loadable({
  loader: () => import('./pages/Groups/viewgroup'),
  loading: Loading,
});

const tribesfeeds = Loadable({
  loader: () => import('./pages/Groups/tribesfeeds'),
  loading: Loading,
});

const editpost = Loadable({
  loader: () => import('./pages/Groups/editpost'),
  loading: Loading,
});

const mygroup = Loadable({
  loader: () => import('./pages/Groups/mygroups'),
  loading: Loading,
});

const allgroups = Loadable({
  loader: () => import('./pages/Groups/allgroups'),
  loading: Loading,
});

const membergroups = Loadable({
  loader: () => import('./pages/Groups/membergroups'),
  loading: Loading,
});

const groupsettings = Loadable({
  loader: () => import('./pages/Groups/groupsettings'),
  loading: Loading,
});

const groupmembers = Loadable({
  loader: () => import('./pages/Groups/groupmember'),
  loading: Loading,
});

const groupmedia = Loadable({
  loader: () => import('./pages/Groups/media'),
  loading: Loading,
});

const groupalbum = Loadable({
  loader: () => import('./pages/Groups/createalbum'),
  loading: Loading,
});

const viewalbum = Loadable({
  loader: () => import('./pages/Groups/viewalbum'),
  loading: Loading,
});

const events = Loadable({
  loader: () => import('./pages/Groups/events'),
  loading: Loading,
});

const personalevents = Loadable({
  loader: () => import('./pages/Groups/personalEvent'),
  loading: Loading,
});

const onlineevents = Loadable({
  loader: () => import('./pages/Groups/onlineEvent'),
  loading: Loading,
});
const eventsdetails = Loadable({
  loader: () => import('./pages/Groups/eventDetails'),
  loading: Loading,
});

const settings = Loadable({
  loader: () => import('./pages/Groups/settings'),
  loading: Loading,
});

const groupMessages = Loadable({
  loader: () => import('./pages/Groups/groupMessage'),
  loading: Loading,
});
// Chat Start
const ChatIndex = Loadable({
  loader: () => import('./pages/Chat/index'),
  loading: Loading,
});
const ChatGroup = Loadable({
  loader: () => import('./pages/Chat/chatgroup'),
  loading: Loading,
});
// Chat End

// Marketplace

const MarketDefaultView = Loadable({
  loader: () => import('./pages/MarketArea/globalView/defaultView'),
  loading: Loading,
});
const MarketProductDetail = Loadable({
  loader: () => import('./pages/MarketArea/globalView/productDetail'),
  loading: Loading,
});

const MarketProductDetailView = Loadable({
  loader: () =>
    import('./pages/MarketArea/globalView/productDetail/detailView'),
  loading: Loading,
});

const MarketCreateAd = Loadable({
  loader: () => import('./pages/MarketArea/sellOnMarketPlace/createAd'),
  loading: Loading,
});
const MarketProductOverview = Loadable({
  loader: () => import('./pages/MarketArea/sellOnMarketPlace/productOverview'),
  loading: Loading,
});
const MarketProductDescription = Loadable({
  loader: () =>
    import('./pages/MarketArea/sellOnMarketPlace/productDescription'),
  loading: Loading,
});
const MarketProductPricing = Loadable({
  loader: () => import('./pages/MarketArea/sellOnMarketPlace/productPricing'),
  loading: Loading,
});
const MarketProductGallery = Loadable({
  loader: () => import('./pages/MarketArea/sellOnMarketPlace/productGallery'),
  loading: Loading,
});
const MarketProductGalleryPreview = Loadable({
  loader: () =>
    import('./pages/MarketArea/sellOnMarketPlace/productGallery/preview'),
  loading: Loading,
});

const MarketProductFAQ = Loadable({
  loader: () => import('./pages/MarketArea/sellOnMarketPlace/productFAQ'),
  loading: Loading,
});

const MarketProductReturnAndWarranty = Loadable({
  loader: () =>
    import('./pages/MarketArea/sellOnMarketPlace/productReturnAndWarranty'),
  loading: Loading,
});

const MarketProductPublish = Loadable({
  loader: () => import('./pages/MarketArea/sellOnMarketPlace/productPublish'),
  loading: Loading,
});

const MarketDelivery = Loadable({
  loader: () => import('./pages/MarketArea/sellStore/delivery'),
  loading: Loading,
});

const MarketSellStoreDefault = Loadable({
  loader: () => import('./pages/MarketArea/sellStore/defaultView'),
  loading: Loading,
});
const ChatWithSeller1 = Loadable({
  loader: () => import('./pages/MarketArea/chatWithSeller/chat1'),
  loading: Loading,
});
const ChatWithSeller2 = Loadable({
  loader: () => import('./pages/MarketArea/chatWithSeller/chat2'),
  loading: Loading,
});
const ChatWithSeller3 = Loadable({
  loader: () => import('./pages/MarketArea/chatWithSeller/chat3'),
  loading: Loading,
});
const ChatWithSeller4 = Loadable({
  loader: () => import('./pages/MarketArea/chatWithSeller/chat4'),
  loading: Loading,
});
const MyOrders = Loadable({
  loader: () => import('./pages/MarketArea/checkOut/orders'),
  loading: Loading,
});
const Cart1 = Loadable({
  loader: () => import('./pages/MarketArea/checkOut/cart'),
  loading: Loading,
});

const CheckoutRefund = Loadable({
  loader: () => import('./pages/MarketArea/checkOut/refund'),
  loading: Loading,
});

const CheckoutInformation = Loadable({
  loader: () => import('./pages/MarketArea/checkOut/information'),
  loading: Loading,
});
const CheckoutShipping = Loadable({
  loader: () => import('./pages/MarketArea/checkOut/shipping'),
  loading: Loading,
});
const CheckoutPayment = Loadable({
  loader: () => import('./pages/MarketArea/checkOut/payment'),
  loading: Loading,
});
const CheckoutSuccess = Loadable({
  loader: () => import('./pages/MarketArea/checkOut/success'),
  loading: Loading,
});
const MyCart = Loadable({
  loader: () => import('./pages/MarketArea/checkOut/myCart'),
  loading: Loading,
});
const MarketDashboard = Loadable({
  loader: () => import('./pages/MarketArea/dashboard/defaultView/default'),
  loading: Loading,
});
const MarketDashboardAccordion = Loadable({
  loader: () => import('./pages/MarketArea/dashboard/accordionView'),
  loading: Loading,
});
const MarketDashboardEmpty = Loadable({
  loader: () => import('./pages/MarketArea/dashboard/empty'),
  loading: Loading,
});
const FirstTimeUser = Loadable({
  loader: () => import('./pages/MarketArea/accountFlow/firstTimeUser'),
  loading: Loading,
});
const FirstTimePublish = Loadable({
  loader: () => import('./pages/MarketArea/accountFlow/firstTimePublish'),
  loading: Loading,
});
const RegularUser = Loadable({
  loader: () => import('./pages/MarketArea/accountFlow/regularUser'),
  loading: Loading,
});
const RegularUser2 = Loadable({
  loader: () =>
    import('./pages/MarketArea/accountFlow/regularUser/regularUser2'),
  loading: Loading,
});
const NoPromotions = Loadable({
  loader: () => import('./pages/MarketArea/promotions/noPromotions'),
  loading: Loading,
});
const PromotionOverview = Loadable({
  loader: () => import('./pages/MarketArea/promotions/promotionOverview'),
  loading: Loading,
});
const PromotionDescription = Loadable({
  loader: () => import('./pages/MarketArea/promotions/promotionDescription'),
  loading: Loading,
});
const PromotionPricing = Loadable({
  loader: () => import('./pages/MarketArea/promotions/promotionPricing'),
  loading: Loading,
});
const PromotionBanner = Loadable({
  loader: () => import('./pages/MarketArea/promotions/promotionBanner'),
  loading: Loading,
});
const CreatePromotion = Loadable({
  loader: () => import('./pages/MarketArea/promotions/createPromotion'),
  loading: Loading,
});
const PromotionSuccess = Loadable({
  loader: () => import('./pages/MarketArea/promotions/promotionSuccess'),
  loading: Loading,
});
const YourPromotions = Loadable({
  loader: () => import('./pages/MarketArea/promotions/yourPromotions'),
  loading: Loading,
});
const WishList = Loadable({
  loader: () => import('./pages/MarketArea/promotions/wishList'),
  loading: Loading,
});

const ReviewList = Loadable({
  loader: () => import('./pages/MarketArea/sellStore/reviewList'),
  loading: Loading,
});
// end of market place
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPageLoaded: false,
      chats: [],
      scrollup: true,
      mobNav: false,
      prevScrollpos: window.pageYOffset,
    };
  }

  handleScroll = () => {
    const { prevScrollpos } = this.state;
    const currentScrollPos = window.pageYOffset;
    const scrollup = prevScrollpos > currentScrollPos;

    this.setState({
      prevScrollpos: currentScrollPos,
      scrollup,
    });
  };

  openMobNav = () => {
    this.setState({
      mobNav: !this.state.mobNav,
    });
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      store.dispatch(push(nextProps.redirectTo));
      this.props.onRedirect();
    }
  }

  openChat = (r) => {
    const temp = this.state.chats;
    const foundIndex = temp.findIndex((x) => x._id == r._id);
    if (foundIndex == -1) {
      temp.push(r);
    }
    this.setState({
      chats: temp,
    });
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    // this.props.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.setState({ isPageLoaded: true });
    /* setTimeout(() => {
      this.setState({isPageLoaded:true});
    }, 4000); */
    /* if(!localStorage.csrf){
      setCSRF()
        .then(async resp => {
          localStorage.setItem('csrf',resp._csrf);
        }, error => {
          
        });
    } */
    // const location = this.props.location.search;
    const { pathname } = window.location;

    if (pathname == '/PaymentWallet') {
      const queryParams = queryString.parse(window.location.search);
      console.log(pathname, ' pathname+queryParams');
      localStorage.setItem('PaymentWallet', pathname + window.location.search);
    }
  }

  render() {
    const currentUser = JSON.parse(getCurrentUser());
    const twitterStats = JSON.parse(localStorage.getItem('twitterStats'));

    return (
      <>
        <Helmet>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1"
          />
        </Helmet>
        {this.state.isPageLoaded ? (
          <>
            <Alert
              message={this.props.alertMessage}
              severity={this.props.alertType}
              open={this.props.alertOpen}
              handleclose={() => store.dispatch({ type: ALERTCLOSE })}
            />
            <Modal
              title={this.props.modalTitle}
              content={this.props.modalContent}
              type={this.props.modalType}
              open={this.props.modalOpen}
              yesBtnText={this.props.modalYesBtnText}
              handleclose={() => store.dispatch({ type: MODALCLOSE })}
              handlenext={() => store.dispatch({ type: MODALNEXT })}
            />
            <LoadingOverlay
              active={this.props.loaderState}
              spinner
              text={this.props.loaderText}
              styles={{
                overlay: (base) => ({
                  ...base,
                  position: 'fixed',
                  zIndex: '9999 !important',
                }),
              }}
            >
              <div
                className={`${
                  (this.state.mobNav ? 'mobNav ' : '') +
                  (this.state.scrollup ? 'scrollUp' : 'scrollDown')
                } content`}
              >
                {/* <Router forceRefresh={true}> */}
                <Router history={history}>
                  <Switch>
                    <PublicRoute
                      exact
                      name="login"
                      path="/login"
                      component={Login}
                      restricted
                    />
                    <PublicRoute
                      exact
                      name="zignsec-success"
                      path="/kyc/zignsec-success"
                      component={ZignsecSuccess}
                    />
                    <PublicRoute
                      exact
                      name="zignsec-failed"
                      path="/kyc/zignsec-failed"
                      component={ZignsecFailed}
                    />
                    <PublicRoute
                      exact
                      name="AuthResponse"
                      path="/signout"
                      component={AuthResponse}
                      restricted
                    />

                    <PublicRoute
                      exact
                      name="register"
                      path="/register/:username"
                      component={Register}
                      restricted
                    />
                    <PublicRoute
                      exact
                      name="verify"
                      path="/verify-phone"
                      component={Verify}
                      restricted
                    />
                    <PublicRoute
                      exact
                      name="verifyemail"
                      path="/verifyemail/:emailToken"
                      component={Login}
                      restricted
                    />
                    <PublicRoute
                      exact
                      name="forgotpassword"
                      path="/forgotpassword"
                      component={ForgotPassword}
                      restricted
                    />
                    <PublicRoute
                      exact
                      name="twitter-login"
                      path="/twitter-login"
                      component={TwitterLogin}
                      restricted
                    />
                    <PublicRoute
                      exact
                      name="google-login"
                      path="/google-login"
                      component={GoogleLoginn}
                      restricted
                    />
                    <PublicRoute
                      exact
                      name="contact-us"
                      path="/contact-us"
                      component={ContactUs}
                    />
                    <PublicRoute exact path="/">
                      <Redirect to="/home" />
                    </PublicRoute>
                    {/* <PublicRoute exact name="landing" path='/' component={LandingPage} restricted={true} openMobNav={this.openMobNav} /> */}
                    {/* <Route exact path="/" render={() => {window.location.href="https://eclipton.com"}} /> */}
                    <PrivateRoute
                      exact
                      name="creditcard"
                      path="/buy-crypto-credit-card"
                      component={CreditCard}
                      currentUser={currentUser}
                      nextTo="/buy-crypto-credit-card"
                    />
                    <PrivateRoute
                      exact
                      name="PaymentWallet"
                      path="/PaymentWallet"
                      component={PaymentWallet}
                      currentUser={currentUser}
                      nextTo={localStorage.getItem('PaymentWallet')}
                    />
                    <PrivateRoute
                      name="passionomy-preview-file"
                      exact
                      path="/passionomy/preview/:file/:type"
                      component={Preview}
                      currentUser={currentUser}
                    />

                    <>
                      <Header
                        currentUser={currentUser}
                        openChat={this.openChat}
                        openMobNav={this.openMobNav}
                        openedChats={this.state.chats}
                      />
                      <PrivateRoute
                        exact
                        name="profile"
                        path="/u/:id"
                        component={GlobalProfile}
                        currentUser={currentUser}
                        openChat={this.openChat}
                        openedChats={this.state.chats}
                      />
                      <PrivateRoute
                        exact
                        name="post"
                        path="/post/:postid"
                        component={SinglePost}
                        currentUser={currentUser}
                      />
                      <PublicRoute
                        exact
                        name="blog"
                        path="/blog/:postid"
                        component={SingleBlog}
                        currentUser={currentUser}
                      />

                      <PublicRoute
                        name="passionomy"
                        exact
                        path="/passionomy"
                        component={Gionomy}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="all-gigs"
                        exact
                        path="/passionomy/gigs"
                        component={AllGigs}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="all-requests"
                        exact
                        path="/passionomy/requests"
                        component={AllGigRequests}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="passionomy-add"
                        exact
                        path="/passionomy/gigs/add"
                        component={AddGig}
                        currentUser={currentUser}
                      />
                      {/* <PrivateRoute name="passionomy-add" exact path='/passionomy/gigs/add' component={NewAddGigs} currentUser={currentUser}    /> */}
                      <PrivateRoute
                        name="passionomy-edit"
                        exact
                        path="/passionomy/gig/edit/:id"
                        component={AddGig}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="passionomy-request"
                        exact
                        path="/passionomy/requests/add"
                        component={GigRequest}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="passionomy-request-edit"
                        exact
                        path="/passionomy/request/edit/:id"
                        component={GigRequest}
                        currentUser={currentUser}
                      />
                      <PublicRoute
                        name="passionomy-view-gig"
                        exact
                        path="/passionomy/gig/:id"
                        component={Design}
                        currentUser={currentUser}
                      />
                      <PublicRoute
                        name="passionomy-view-request"
                        exact
                        path="/passionomy/request/:id"
                        component={ViewGigRequest}
                        currentUser={currentUser}
                      />
                      <PublicRoute
                        name="passionomy-view-request-bid"
                        exact
                        path="/passionomy/gig/:id/:bid"
                        component={Design}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="purchased-gigs"
                        exact
                        path="/passionomy/dashboard/purchased"
                        component={PurchasedGigs}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="passionomy-seller-customers"
                        exact
                        path="/passionomy/dashboard"
                        component={SellerCustomer}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="passionomy-requests"
                        exact
                        path="/passionomy/dashboard/requests"
                        component={MyGigRequests}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="passionomy-buyer-request"
                        exact
                        path="/passionomy/dashboard/gig/:id"
                        component={SellerDashboard}
                        currentUser={currentUser}
                      />
                      {/* <PrivateRoute name="zignsec-success"  path='/kyc/zignsec-success' component={ZignsecSuccess} currentUser={currentUser}    /> */}

                      <PrivateRoute
                        name="home"
                        exact
                        path="/home"
                        component={Home}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="my-feed"
                        exact
                        path="/feed"
                        component={MyFeed}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="my-blogs"
                        exact
                        path="/blogs"
                        component={MyBlogs}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="add-blog"
                        exact
                        path="/add-blog"
                        component={AddBlog}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="edit-blog"
                        exact
                        path="/edit-blog/:id"
                        component={AddBlog}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="my-profile"
                        exact
                        path="/profile"
                        component={MyProfile}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="my-profile"
                        exact
                        path="/profile/:id"
                        component={MyProfile}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="my-profile"
                        exact
                        path="/profile/feed/:filter"
                        component={MyProfile}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="wallet"
                        exact
                        path="/wallet"
                        component={WalletDashboard}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="api-keys"
                        exact
                        path="/wallet/api"
                        component={APIKeys}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="wallet-deposit"
                        exact
                        path="/wallet/deposit"
                        component={WalletDeposit}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="wallet-transfer"
                        exact
                        path="/wallet/transfer"
                        component={WalletTransfer}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="wallet-transfer"
                        exact
                        path="/wallet/BuyCryptoOrders"
                        component={BuyCryptoOrders}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="wallet-transactions"
                        exact
                        path="/wallet/transactions"
                        component={WalletTransactions}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="wallet-verification"
                        exact
                        path="/wallet/verification"
                        component={WalletVerification}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="wallet-withdraw"
                        exact
                        path="/wallet/withdraw/:with_id?"
                        component={WalletWithdraw}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="wallet-confirm"
                        exact
                        path="/wallet/confirm/:type"
                        component={WalletConfirm}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="wallet-trading"
                        exact
                        path="/wallet/trading/:pair?"
                        component={WalletTrade}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="tfa"
                        exact
                        path="/wallet/tfa"
                        component={TFA}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="withdraw-password"
                        exact
                        path="/wallet/password"
                        component={WithdrawalPassword}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="withdraw-repassword"
                        exact
                        path="/wallet/repassword"
                        component={WithdrawalRepassword}
                        currentUser={currentUser}
                      />

                      <PrivateRoute
                        name="withdraw-address"
                        exact
                        path="/wallet/address/:coin"
                        component={WithdrawAddresses}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="settings"
                        exact
                        path="/settings"
                        component={Settings}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="search"
                        exact
                        path="/search"
                        component={SearchResult}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="all-suggested"
                        exact
                        path="/all/suggested"
                        component={AllSuggested}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="all-popular-blogs"
                        exact
                        path="/all/popular-blogs"
                        component={AllPopularArticles}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="all-notifications"
                        exact
                        path="/all/notifications"
                        component={AllNotifications}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="all-popular-gigs"
                        exact
                        path="/all/popular-gigs"
                        component={AllPopularGigs}
                        currentUser={currentUser}
                      />
                      <PublicRoute
                        name="category-wise-blogs"
                        exact
                        path="/blogs/:category"
                        component={CategoryWiseBlogs}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="author-wise-blogs"
                        exact
                        path="/all/author-blogs/:id"
                        component={AuthorWiseBlogs}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="author-wise-gigs"
                        exact
                        path="/all/author-gigs/:id"
                        component={AuthorWiseGigs}
                        currentUser={currentUser}
                      />
                      {/* Groups */}
                      <PrivateRoute
                        name="groups"
                        exact
                        path="/groups"
                        component={Groups}
                        currentUser={currentUser}
                      />
                      {/* <PublicRoute name="category-wise-groups" exact path='/groups/:category' component={CategoryWiseGroups} currentUser={currentUser}  /> */}
                      <PrivateRoute
                        name="creategroup"
                        exact
                        path="/group"
                        component={addGroup}
                        currentUser={currentUser}
                      />

                      <PrivateRoute
                        name="editpost"
                        exact
                        path="/editpost/:id"
                        component={editpost}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="viewgroup"
                        exact
                        path="/viewgroup/:id"
                        component={viewgroup}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="tribesfeeds"
                        exact
                        path="/tribesfeeds/:id"
                        component={tribesfeeds}
                        currentUser={currentUser}
                      />

                      <PrivateRoute
                        name="mygroup"
                        exact
                        path="/mygroup"
                        component={mygroup}
                        currentUser={currentUser}
                      />

                      <PrivateRoute
                        name="allgroups"
                        exact
                        path="/allgroups"
                        component={allgroups}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="mygroup"
                        exact
                        path="/mygroup/:id"
                        component={mygroup}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="membergroups"
                        exact
                        path="/membergroups"
                        component={membergroups}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="editgroup"
                        exact
                        path="/group/edit/:id"
                        component={addGroup}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="groupsettings"
                        exact
                        path="/groupsettings/:id"
                        component={groupsettings}
                        currentUser={currentUser}
                        appName={this.props.appName}
                      />
                      <PrivateRoute
                        name="groupmembers"
                        exact
                        path="/groupmembers/:id"
                        component={groupmembers}
                        currentUser={currentUser}
                        appName={this.props.appName}
                      />
                      <PrivateRoute
                        name="groupmedia"
                        exact
                        path="/groupmedia/:id"
                        component={groupmedia}
                        currentUser={currentUser}
                        appName={this.props.appName}
                      />
                      <PrivateRoute
                        name="albumcreate"
                        exact
                        path="/groupalbum/:id"
                        component={groupalbum}
                        currentUser={currentUser}
                        appName={this.props.appName}
                      />
                      <PrivateRoute
                        name="viewalbum"
                        exact
                        path="/viewalbum/:id"
                        component={viewalbum}
                        currentUser={currentUser}
                        appName={this.props.appName}
                      />
                      <PrivateRoute
                        name="events"
                        exact
                        path="/events/:id"
                        component={events}
                        currentUser={currentUser}
                        appName={this.props.appName}
                      />
                      <PrivateRoute
                        name="personalevents"
                        exact
                        path="/personalevent/:id"
                        component={personalevents}
                        currentUser={currentUser}
                        appName={this.props.appName}
                      />
                      <PrivateRoute
                        name="personalevents"
                        exact
                        path="/onlineevent/:id"
                        component={onlineevents}
                        currentUser={currentUser}
                        appName={this.props.appName}
                      />
                      <PrivateRoute
                        name="eventsdetails"
                        exact
                        path="/eventsdetails/:id"
                        component={eventsdetails}
                        currentUser={currentUser}
                        appName={this.props.appName}
                      />
                      <PrivateRoute
                        name="settings"
                        exact
                        path="/settings/:id"
                        component={settings}
                        currentUser={currentUser}
                        appName={this.props.appName}
                      />
                      <PrivateRoute
                        name="messages"
                        exact
                        path="/messages/:id"
                        component={groupMessages}
                        currentUser={currentUser}
                        appName={this.props.appName}
                      />

                      <PrivateRoute
                        name="affiliate-marketing"
                        exact
                        path="/Chat"
                        component={ChatIndex}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="affiliate-marketing"
                        exact
                        path="/Chat/chatgroup"
                        component={ChatGroup}
                        currentUser={currentUser}
                      />

                      {/* MarketArea START */}
                      <PublicRoute
                        name="MarketDefaultView"
                        exact
                        path="/market-default-view"
                        component={MarketDefaultView}
                        // currentUser={currentUser}
                      />

                      <PublicRoute
                        name="MarketDefaultViewWithCategory"
                        exact
                        path="/market-default-view/:id"
                        component={MarketDefaultView}
                        // currentUser={currentUser}
                      />

                      <PublicRoute
                        name="MarketProductDetail"
                        exact
                        path="/market-product-detail"
                        component={MarketProductDetail}
                        // currentUser={currentUser}
                      />
                      <PublicRoute
                        name="MarketProductDetail"
                        exact
                        path="/market-product-detail-view/:id"
                        component={MarketProductDetailView}
                        currentUser={currentUser}
                      />

                      <PrivateRoute
                        name="MarketDiscounts"
                        exact
                        path="/market-discounts"
                        component={MarketDiscounts}
                        currentUser={currentUser}
                      />

                      <PrivateRoute
                        name="DiscountAdd"
                        exact
                        path="/market-discount-add"
                        component={DiscountAdd}
                        currentUser={currentUser}
                      />

                      <PrivateRoute
                        name="MarketCreateAd"
                        exact
                        path="/market-create-ad"
                        component={MarketCreateAd}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="MarketProductOverview"
                        exact
                        path="/market-product-overview"
                        component={MarketProductOverview}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="MarketProductDescription"
                        exact
                        path="/market-product-description"
                        component={MarketProductDescription}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="MarketProductPricing"
                        exact
                        path="/market-product-pricing"
                        component={MarketProductPricing}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="MarketProductGallery"
                        exact
                        path="/market-product-gallery"
                        component={MarketProductGallery}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="MarketProductFAQ"
                        exact
                        path="/market-product-faq"
                        component={MarketProductFAQ}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="MarketProductReturnAndWarranty"
                        exact
                        path="/market-product-returns"
                        component={MarketProductReturnAndWarranty}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="MarketProductGalleryPreview"
                        exact
                        path="/market-product-gallery-preview"
                        component={MarketProductGalleryPreview}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="MarketProductPublish"
                        exact
                        path="/market-product-publish"
                        component={MarketProductPublish}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="MarketSellStoreDefault"
                        exact
                        path="/market-sell-store-default"
                        component={MarketSellStoreDefault}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="ChatWithSeller1"
                        exact
                        path="/market-chat-with-seller-1"
                        component={ChatWithSeller1}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="ChatWithSeller2"
                        exact
                        path="/market-chat-with-seller-2"
                        component={ChatWithSeller2}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="ChatWithSeller3"
                        exact
                        path="/market-chat-with-seller-3"
                        component={ChatWithSeller3}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="ChatWithSeller4"
                        exact
                        path="/market-chat-with-seller-4"
                        component={ChatWithSeller4}
                        currentUser={currentUser}
                      />

                      <PrivateRoute
                        name="MyOrders"
                        exact
                        path="/market-my-orders"
                        component={MyOrders}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="CheckoutRefund"
                        exact
                        path="/market-checkout-refund"
                        component={CheckoutRefund}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="Cart1"
                        exact
                        path="/market-checkout"
                        component={Cart1}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="CheckoutInformation"
                        exact
                        path="/market-checkout-information"
                        component={CheckoutInformation}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="CheckoutShipping"
                        exact
                        path="/market-checkout-shipping"
                        component={CheckoutShipping}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="CheckoutPayment"
                        exact
                        path="/market-checkout-payment"
                        component={CheckoutPayment}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="CheckoutSuccess"
                        exact
                        path="/market-checkout-success"
                        component={CheckoutSuccess}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="MyCart"
                        exact
                        path="/market-my-cart"
                        component={MyCart}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="MarketDashboard"
                        exact
                        path="/market-dashboard"
                        component={MarketDashboard}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="MarketDashboardAccordion"
                        exact
                        path="/market-dashboard-accordion"
                        component={MarketDashboardAccordion}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="MarketDashboardEmpty"
                        exact
                        path="/market-dashboard-empty"
                        component={MarketDashboardEmpty}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="MarketDelivery"
                        exact
                        path="/market-delivery"
                        component={MarketDelivery}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="ReviewList"
                        exact
                        path="/market-review-list"
                        component={ReviewList}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="FirstTimeUser"
                        exact
                        path="/market-account-flow"
                        component={FirstTimeUser}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="FirstTimePublish"
                        exact
                        path="/market-publish-first-time"
                        component={FirstTimePublish}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="RegularUser"
                        exact
                        path="/market-account-flow-regular"
                        component={RegularUser}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="RegularUser2"
                        exact
                        path="/market-account-flow-regular-2"
                        component={RegularUser2}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="NoPromotions"
                        exact
                        path="/market-promotions"
                        component={NoPromotions}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="PromotionOverview"
                        exact
                        path="/market-promotion-overview"
                        component={PromotionOverview}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="PromotionPricing"
                        exact
                        path="/market-promotion-pricing"
                        component={PromotionPricing}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="PromotionBanner"
                        exact
                        path="/market-promotion-banner"
                        component={PromotionBanner}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="CreatePromotion"
                        exact
                        path="/market-promotion-create"
                        component={CreatePromotion}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="PromotionSuccess"
                        exact
                        path="/market-promotion-success"
                        component={PromotionSuccess}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="YourPromotions"
                        exact
                        path="/market-your-promotions"
                        component={YourPromotions}
                        currentUser={currentUser}
                      />
                      <PrivateRoute
                        name="Wish List"
                        exact
                        path="/market-account-wishlist"
                        component={WishList}
                        currentUser={currentUser}
                      />
                      {/* MarketArea END */}

                      <Footer
                        appName={this.props.appName}
                        currentUser={currentUser}
                        chats={this.state.chats}
                      />
                    </>
                  </Switch>
                </Router>
                <div className="mobMenuOverlay" onClick={this.openMobNav} />
              </div>
            </LoadingOverlay>
          </>
        ) : (
          <LoadingOverlay
            active
            spinner
            text="Loading..."
            styles={{
              overlay: (base) => ({
                ...base,
                position: 'fixed',
                zIndex: '9999 !important',
              }),
            }}
          />
        )}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
