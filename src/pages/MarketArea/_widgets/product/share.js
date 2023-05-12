import React from 'react';
import { switchLoader, alertBox } from '../../../../commonRedux';
import { GetAssetImage } from '../../../../globalFunctions';
import { shareProduct } from '../../../../http/product-calls';

function Share(props) {
  const [product, setPost] = React.useState(props.product);
  const [inputText, setInputText] = React.useState('');

  const sharePostFn = () => {
    switchLoader(true, 'Please wait. Your post sharing...!');
    shareProduct({ product_id: product._id, text: inputText }, true).then(
      async (resp) => {
        alertBox(true, 'Product shared to post', 'success');
        props.closeShareModal();
        switchLoader();
      },
      (error) => {
        props.closeShareModal();
        switchLoader();
      }
    );
  };
  const onChangeHandler = (event) => {
    setInputText(event.target.value);
  };
  return (
    <div className="social-wall-share-popup ">
      <div className="modal-content share-popup--content">
        <div className="modal-header d-flex align-items-center">
          <h5 className="modal-title">Share</h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={props.closeShareModal}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div className="modal-body">
          <div className="shareIcons text-center mb-2">
            <a
              target="_blank"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURI(
                `${process.env.REACT_APP_FRONTEND}market-product-detail-view/${product._id}`
              )}`}
              rel="noreferrer"
            >
              <img src={GetAssetImage('facebook.png')} />
            </a>
            <a
              target="_blank"
              href={`http://twitter.com/share?url=${encodeURI(
                `${process.env.REACT_APP_FRONTEND}market-product-detail-view/${product._id}`
              )}`}
              rel="noreferrer"
            >
              <img src={GetAssetImage('twitter.png')} />
            </a>
          </div>
          <div className="mb-2 text-center">-OR-</div>
          <ul className="p-0 m-0 w-100">
            <li className="list-group-item p-0 pt-1">
              <select
                className="form-control custom-select"
                id=""
                defaultValue="DEFAULT"
              >
                <option disabled value="DEFAULT">
                  {' '}
                  Share on my wall
                </option>
              </select>
            </li>
            <li className="list-group-item p-0 pt-2">
              <textarea
                name="inputText"
                id=""
                cols="30"
                rows="4"
                placeholder="Message"
                value={inputText}
                onChange={onChangeHandler}
              />
            </li>
          </ul>
        </div>
        <div className="modal-footer d-flex align-items-center pt-1 p-3">
          <button
            type="button"
            className="btn btn-secondary cancel-btn me-3"
            data-dismiss="modal"
            onClick={props.closeShareModal}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary yes-btn"
            onClick={sharePostFn}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
export default Share;
