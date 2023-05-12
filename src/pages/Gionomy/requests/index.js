import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import ToggleButton from 'react-toggle-button';
import { alertBox, switchLoader } from '../../../commonRedux';
import A from '../../../components/A';
import Button from '../../../components/Button';
import GigFilter from '../../../components/Filter/gigFilter';
import MyGigsMenu from '../../../components/Menu/MyGigsMenu';
import Modal from '../../../components/Popup';
import RewardsWidget from '../../../components/RewardsWidget';
import {
  getGigRequestStats,
  myGigRequests,
  removeGig,
} from '../../../http/gig-calls';
import { history } from '../../../store';
import '../Seller/Seller.scss';
import GigRequest from '../../../components/Gigs/GigRequest';
import PopularGigRequests from '../../../components/Gigs/PopularGigRequests';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  createBtn: {
    borderRadius: '25px',
    paddingTop: '2px',
    paddingBottom: '2px',
    marginLeft: '20px',
    textTransform: 'none',
    fontSize: '12px',
    '& .MuiSvgIcon-root': {
      fontSize: '16px',
    },
  },
  customerList: {
    marginTop: '10px',
    display: 'flex',
    paddingRight: '10px',
  },
}));
export function UserPanel(props) {
  const classes = useStyles();
  return (
    <>
      {/* <Paper variant="outlined" square className={classes.paper} borderBottom={0}>
        <UserDetails {...props} />
      </Paper>
      <Paper variant="outlined" square className={classes.paper}>
        <MenuItems activeIndex={props.activeIndex} />
      </Paper> */}
      <MyGigsMenu {...props} />
    </>
  );
}

export default function Seller(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [gigs, setGigs] = React.useState([]);
  const [del, setDelete] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(20);
  const [stats, setStats] = React.useState(null);
  const [filter, setFilter] = React.useState('');
  const [data, setdatafill] = React.useState({});
  const anchorRef = React.useRef(null);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const deleteGig = (item) => {
    setDelete(item._id);
    setModal(!modal);
  };

  const editGig = (item) => {
    props.history.push(`/passionomy/gig/edit/${item.slug}`);
  };

  const previewGig = (item) => {
    props.history.push(`/passionomy/gig/${item.slug}`);
  };

  const processDelete = () => {
    setModal(!modal);
    switchLoader(true, 'Deleting the gig, please wait...');
    removeGig({ id: del }).then(
      (resp) => {
        const temp = gigs;
        const index = temp.findIndex((i) => i._id == del);
        delete temp[index];
        setGigs(temp);
        switchLoader();
        alertBox(true, 'Gig has been deleted', 'success');
      },
      (err) => {
        switchLoader();
        alertBox(true, err.data.message);
      }
    );
  };

  const getGigs = (f = '', data = {}) => {
    const d = data;
    d.page = page;
    d.limit = limit;
    d.userid = props.currentUser._id;
    if (f != '') {
      d.filter = f;
    }
    myGigRequests(d).then((resp) => {
      if (f == 'purchased') {
        const posts = resp.post;
        const postlist = [];
        const postpush = [];
        posts.length > 0 &&
          posts.map((item) => {
            // postlist[item._id] = {count : 0}
            const count =
              postlist[item._id] == undefined
                ? 0
                : postlist[item._id].count + 1;
            if (postlist[item._id] == undefined) {
              postlist[item._id] = { count };
              postpush.push(item);
            }
          });
        // if(postpush.length > 0){
        setGigs(postpush);
        // }
      } else {
        setGigs(resp);
      }
    });
  };

  const getStats = () => {
    getGigRequestStats().then((resp) => {
      setStats(resp);
    });
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  const filterPosts = (va) => {
    setFilter(va);
    setGigs([]);
    getGigs(va);
  };

  const dataChange = (data = {}) => {
    const err = [];
    if (parseInt(data.priceFrom) > parseInt(data.priceTo)) {
      err.push('Price to must be greater than price from');
    }
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      getGigs(filter, data);
      setdatafill(data);
    }
  };
  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    getStats();
    getGigs();
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  const selectCustomer = (id) => {
    history.push(`/passionomy/dashboard/${id}`);
  };
  return (
    <div className="seller-customers">
      <Modal
        displayModal={modal}
        closeModal={(e) => {
          setModal(!modal);
        }}
      >
        <p>Are you sure about deleting this gig?</p>
        <div className="d-flex align-items-center justify-content-center">
          <Button
            color="primary"
            variant="contained"
            onClick={() => processDelete()}
          >
            Yes
          </Button>{' '}
          &nbsp;{' '}
          <Button
            onClick={() => {
              setModal(!modal);
            }}
            color="dark"
            variant="contained"
          >
            Cancel
          </Button>
        </div>
      </Modal>
      <div className="container my-wall-container ">
        <div className="row ">
          {/* <!-- left column --> */}
          <div className="col-sm empty-container-with-out-border left-column">
            <GigFilter dataChange={dataChange} />
          </div>
          {/* <!-- end left column --> */}

          {/* <!-- center column --> */}
          <div className="col-sm empty-container-with-out-border center-column gigs-details-container">
            <div className="banner">
              <div className="banner-body">
                <div className="banner-desc">
                  <h3>My Hire Profiles</h3>
                  <div className="row-s mt-3">
                    <div className="mr-3 p-1">
                      <strong>{stats == null ? 0 : stats.requests}</strong>{' '}
                      Listings
                    </div>
                    <div className="mr-3 p-1">
                      <strong>{stats == null ? 0 : stats.bids}</strong> Bids
                    </div>
                    <div>
                      <strong>{stats == null ? 0 : stats.jobs}</strong>{' '}
                      Completed
                    </div>
                  </div>
                </div>
                <div className="banner-btns">
                  <span className="p-2">Find Jobs</span>
                  <ToggleButton
                    activeLabel=""
                    inactiveLabel=""
                    value
                    onToggle={(value) => {
                      if (value) {
                        props.history.push('/passionomy/dashboard');
                      }
                    }}
                  />
                  <span className="p-2">Hire Talents</span>
                </div>
              </div>
            </div>
            <div className="banner bottom">
              <div className="banner-body">
                <ul className="filters">
                  <li>
                    <span
                      className={`filter ${filter == '' ? 'active' : ''}`}
                      onClick={(e) => filterPosts('')}
                    >
                      All
                    </span>
                  </li>
                  {/* <li><button className={"btn "+(filter == 'saved' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('saved')}>Saved</button></li> */}
                  <li>
                    <span
                      className={`filter ${filter == 'draft' ? 'active' : ''}`}
                      onClick={(e) => filterPosts('draft')}
                    >
                      Draft
                    </span>
                  </li>
                  <li>
                    <span
                      className={`filter ${
                        filter == 'purchased' ? 'active' : ''
                      }`}
                      onClick={(e) => filterPosts('purchased')}
                    >
                      Purchased
                    </span>
                  </li>
                  {/* <li><button className={"btn "+(filter == 'hidden' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('hidden')}>Hidden</button></li>
       <li><button className={"btn "+(filter == 'paid' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('paid')}>Paid</button></li>
       <li className="ml-auto"><button className={"btn "+(filter == 'purchased' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('purchased')}>Blogs purchased by me</button></li> */}
                  {/* <li><button className={"btn "+(filter == 'highlighted' ? 'btn-main' : 'btn-outline')} onClick={(e) => this.filterPosts('highlighted')}>Highlighted</button></li> */}
                </ul>

                <A href="/passionomy/requests/add">
                  <Button variant="primaryBtn">Add</Button>
                </A>
              </div>
            </div>
            <div className="row-1 clearfix">
              {gigs.length == 0 && (
                <p className="no-found">No Hire Gigs Found</p>
              )}
              {gigs.map((gig, i) => (
                <GigRequest
                  {...props}
                  post={gig}
                  mine
                  filter={filter}
                  data={data}
                  key={i}
                />
              ))}
            </div>
            <div className="mt-3">
              <PopularGigRequests {...props} />
            </div>
          </div>
          <div className="col-sm empty-container-with-out-border right-column">
            <RewardsWidget {...props} />
          </div>
        </div>
      </div>
    </div>
  );
}
