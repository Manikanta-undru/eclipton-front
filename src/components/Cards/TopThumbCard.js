import React, { useEffect, useState } from 'react';
import A from '../A';
import { history } from '../../store';
import './styles2.scss';
import { Link } from 'react-router-dom';
import { pic, profilePic, roundvalue } from '../../globalFunctions';
// import 'bootstrap/dist/css/bootstrap.scss';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

function TopThumbCard(props) {
  const [post, setPost] = useState(props.post);
  const [postpurchasedata, setPostdata] = useState(props.post.postpurchases);
  const [request, setRequest] = useState(props.request);
  const [reported, setReported] = useState(props.reported);
  const [styleclr, setColor] = useState('');
  const [availableCur, setAvailableCur] = useState([]);
  const [previewcurrency, setPreviewCurrency] = useState(post.preferedCurrency);
  const [previewprice, setPreviewPrice] = useState(
    post.standardPrice == undefined ? post.budget : post.standardPrice
  );

  const goTo = (url) => {
    history.push(url);
  };
  useEffect(() => {
    setPost(props.post);
    setPostdata(props.post.postpurchases);
    setReported(props.reported);
    setPreviewCurrency(post.preferedCurrency);
    let avail_cur = [];
    let remaining_currency = [];
    setPreviewPrice(
      post.standardPrice == undefined ? post.budget : post.standardPrice
    );
    setColor(
      props.post.banner != undefined && props.post.banner != ''
        ? '#fff'
        : '#000'
    );
    const prices = props.post.price_extra;

    if (props.filterdata != undefined && prices != undefined) {
      if (props.request) {
        avail_cur = [];
        remaining_currency = prices.filter(
          (pri) => pri != null && pri.prefered_currency != props.filterdata.coin
        );
        remaining_currency.map((curr) => {
          if (props.filterdata.coin != '') {
            avail_cur.push(curr.prefered_currency);
          }
        });
        if (
          props.filterdata.coin != '' &&
          props.filterdata.coin != props.post.preferedCurrency
        ) {
          avail_cur.push(props.post.preferedCurrency);
        }
      } else {
        avail_cur = [];
        remaining_currency = prices.filter(
          (pri) => pri != null && pri.pay_currency != props.filterdata.coin
        );
        remaining_currency.map((curr) => {
          if (props.filterdata.coin != '') {
            avail_cur.push(curr.pay_currency);
          }
        });
        if (
          props.filterdata.coin != '' &&
          props.filterdata.coin != props.post.preferedCurrency
        ) {
          avail_cur.push(props.post.preferedCurrency);
        }
      }
      setAvailableCur(Array.from(new Set(avail_cur)));
      if (prices.length > 0 && props.filterdata.coin != '') {
        let filter_price_currency = [];

        if (props.request) {
          filter_price_currency = prices.filter(
            (pri) =>
              pri != null && pri.prefered_currency == props.filterdata.coin
          );
        } else {
          filter_price_currency = prices.filter(
            (pri) => pri != null && pri.pay_currency == props.filterdata.coin
          );
        }
        if (filter_price_currency.length > 0) {
          setPreviewCurrency(props.filterdata.coin);
          setPreviewPrice(
            props.request
              ? filter_price_currency[0].budget_amount
              : filter_price_currency[0].standard_amount
          );
        }
      }
      // setPreviewCurrency();
    }
  }, [props.post, props.reported]);
  return (
    <div className="card topThumbCard">
      <A href={props.url} className="block">
        {/* <div className="thumb" style={{backgroundImage: `url(${pic(post.contents[0] != undefined ? post.contents[0].content_url : '')})`}} > */}
        <div
          className="thumb"
          style={{
            backgroundImage: `url(${pic(
              post.banner != undefined ? post.banner : ''
            )})`,
          }}
        >
          {post.status == 'draft' || post.estatus == 'draft' ? (
            <small
              className="badge badge-secondary draft-label ml-2 mt-1"
              style={{ color: styleclr }}
            >
              Draft
            </small>
          ) : null}
        </div>
      </A>
      <div className="body">
        <div className="row-b">
          {/* <A href={"/u/"+post.userid} className="userinfo">
      <div className="pic" style={{backgroundImage: `url(${ profilePic(post.userinfo.avatar)})`}}></div>
      <div className="">
        <div className="name ">{post.userinfo.name}</div>
       
      </div>
    </A> */}
          <A href={`u/${post.userinfo._id}`} className="userinfo">
            <div
              className="pic sf"
              style={{
                backgroundImage: `url(' ${profilePic(
                  post.userinfo.avatar,
                  post.userinfo.name
                    ? post.userinfo.name
                    : post.userinfo.username
                )} ')`,
              }}
              data-name={profilePic(
                post.userinfo.avatar,
                post.userinfo.name ? post.userinfo.name : post.userinfo.username
              )}
            />
            <div className="">
              <div className="name ">
                {post.userinfo.name
                  ? post.userinfo.name
                  : post.userinfo.username}
              </div>
            </div>
          </A>
          {props.filter != 'messages' &&
          props.currentUser != undefined &&
          post.shared == undefined &&
          post.userid == props.currentUser._id ? (
            <span className="list-group-item  p-1 pr-2 pointer  dropdown pull-right">
              <i className="dots fa fa-ellipsis-h" />
              <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                <Link to={props.base + post.slug} className="dropdown-item">
                  <img
                    className="mr-1"
                    src={require('../../assets/images/edit-icon.png')}
                  />
                  <span className="m-1">Edit</span>
                </Link>

                {(props.currentUser != undefined &&
                  post.sharedBy == props.currentUser._id) ||
                  (post.userid == props.currentUser._id && (
                    <a
                      className="dropdown-item"
                      onClick={(e) => props.removePost(post._id)}
                    >
                      <img
                        className="mr-1"
                        src={require('../../assets/images/remove-icon.png')}
                      />
                      <span className="m-1">Remove</span>
                    </a>
                  ))}
              </div>
            </span>
          ) : (
            props.filter != 'messages' &&
            post.userid !== props.currentUser._id && (
              <span className="list-group-item  p-1 pr-2 pointer  dropdown pull-right ">
                <i className="dots fa fa-ellipsis-h" />
                {reported ? (
                  <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                    <a
                      onClick={() => props.unReport()}
                      className="dropdown-item"
                    >
                      <i className="fa fa-undo" />
                      <span className="m-1">Undo Report</span>
                    </a>
                  </div>
                ) : (
                  <div className="dropdown-menu hasUpArrow dropdown-menu-right">
                    <a onClick={() => props.report()} className="dropdown-item">
                      <i className="fa fa-exclamation-circle" />
                      <span className="m-1">Report</span>
                    </a>
                  </div>
                )}
              </span>
            )
          )}
        </div>

        <A
          href={
            props.filter == 'messages'
              ? `/passionomy/dashboard/gig/${post._id}`
              : props.url
          }
        >
          <div className="card-title">
            <span title={post?.subject?.length > 50 ? post?.subject : ''}>
              {post?.subject?.length > 50
                ? `${post?.subject.substring(0, 30)}...`
                : post?.subject}
            </span>
            <div className="rating">
              {!request && (
                <>
                  <i className="fa fa-star" /> {roundvalue(post.rating)} (
                  {post.ratingCount}){' '}
                </>
              )}
            </div>
          </div>
        </A>
        {(postpurchasedata !== undefined &&
          props.currentUser._id == postpurchasedata.userid) ||
        post.purchase_status !== undefined ? (
          postpurchasedata !== undefined && postpurchasedata.status == 1 ? (
            <A href={`/passionomy/dashboard/gig/${post._id}`}>
              <span className="waiting">waiting for approval</span>
            </A>
          ) : post.waiting == 0 ? (
            <A href={`/passionomy/dashboard/gig/${post._id}`}>
              <span className="waiting">
                {props.filter == 'messages' ? 'Messages' : 'View'}
              </span>
            </A>
          ) : (
            post.waiting > 0 && (
              <A href={`/passionomy/dashboard/gig/${post._id}`}>
                <span className="waiting">
                  {`${post.waiting} Orders waiting`}
                </span>
              </A>
            )
          )
        ) : post.waiting > 0 ? (
          <A href={`/passionomy/dashboard/gig/${post._id}`}>
            <span className="waiting">{`${post.waiting} Orders waiting`}</span>
          </A>
        ) : props.filter == 'purchased' ? (
          <A href={`/passionomy/dashboard/gig/${post._id}`}>
            <span className="waiting">View</span>
          </A>
        ) : null}
        {/* {
            post.waiting > 0 || post.postpurchases != undefined && props.currentUser._id == post.postpurchases.userid && <A href={"/passionomy/dashboard/gig/"+post._id}><span className="waiting">
          {post.waiting+" Orders waiting" }
          </span></A>
        } */}
        <div className="highlight-meta">
          {request ? 'Budget' : 'Starting from'}{' '}
          <div className="price" title={availableCur.join(',')}>
            {`${previewcurrency} ${previewprice}`}
          </div>
          {availableCur.length > 0 ? (
            <OverlayTrigger
              delay={{ hide: 450, show: 300 }}
              overlay={(props) => (
                <Tooltip {...props}>{availableCur.join(',')}</Tooltip>
              )}
              placement="bottom"
            >
              <div className="price">Supported currency</div>
            </OverlayTrigger>
          ) : null}
        </div>

        {/* <A href={"/passionomy/gig/"+post._id}><Button  className="w-100 mt-1">View</Button></A> */}
      </div>
    </div>
  );
}

export default TopThumbCard;
