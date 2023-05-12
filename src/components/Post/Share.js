import React from 'react';
import { sharePost } from '../../http/http-calls';
import { switchLoader } from '../../commonRedux/';
import { GetAssetImage } from '../../globalFunctions';

const Share = (props) => {
  const [post, setPost] = React.useState(props.post);
  const [shareType, setShareType] = React.useState(
    props.sharedtype ? 'group' : 'post'
  );
  const [inputText, setInputText] = React.useState('');

  const sharePostFn = () => {
    switchLoader(true, 'Please wait. Your post sharing...!');
    var send_data = {};
    if (props.sharedtype == 'group_post') {
      send_data = {
        postid: post._id,
        text: inputText,
        type: props.sharedtype,
        group_id: post.groupsdata._id,
      };
    } else if (props.sharedtype == 'group') {
      send_data = {
        postid: post._id,
        text: inputText,
        type: props.sharedtype,
        group_id: post._id,
      };
    } else {
      send_data = { postid: post._id, text: inputText, type: props.type };
    }
    sharePost(send_data, true).then(
      async (resp) => {
        props.shareSuccess();
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
    <div className="row">
      <div className="modal-1 user-report-modal active">
        <div className="overlay close-modal"></div>
        <div className="content">
          <div className="headTitle">
            <span className="close" onClick={props.closeShareModal}>
              &times;
            </span>
          </div>

          <div className="modal-content">
            <h2>Share</h2>
            <div className="shareContent">
              <div className="shareIcons text-center mb-2">
                {props.type == 'blog' ? (
                  <React.Fragment>
                    <a
                      target="_blank"
                      href={
                        'https://www.facebook.com/sharer/sharer.php?u=' +
                        encodeURI(
                          process.env.REACT_APP_FRONTEND + 'blog/' + post._id
                        )
                      }
                      rel="noreferrer"
                    >
                      <img src={GetAssetImage('facebook.png')} />
                    </a>
                    <a
                      target="_blank"
                      href={
                        'http://twitter.com/share?url=' +
                        encodeURI(
                          process.env.REACT_APP_FRONTEND + 'blog/' + post._id
                        )
                      }
                      rel="noreferrer"
                    >
                      <img src={GetAssetImage('twitter.png')} />
                    </a>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <a
                      target="_blank"
                      href={
                        'https://www.facebook.com/sharer/sharer.php?u=' +
                        encodeURI(
                          process.env.REACT_APP_FRONTEND + 'post/' + post._id
                        )
                      }
                      rel="noreferrer"
                    >
                      <img src={GetAssetImage('facebook.png')} />
                    </a>
                    <a
                      target="_blank"
                      href={
                        'http://twitter.com/share?url=' +
                        encodeURI(
                          process.env.REACT_APP_FRONTEND + 'post/' + post._id
                        )
                      }
                      rel="noreferrer"
                    >
                      <img src={GetAssetImage('twitter.png')} />
                    </a>
                  </React.Fragment>
                )}
              </div>
              <div className="mb-2 text-center">-OR-</div>
              <ul className="p-0 m-0 w-100">
                <li className="list-group-item p-0 pt-1">
                  <select
                    className="form-control custom-select"
                    id=""
                    defaultValue={'DEFAULT'}
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
                  ></textarea>
                </li>
              </ul>
            </div>
            <div className="modal-footer d-flex align-items-center">
              <button
                type="button"
                className="compact secondaryBtn me-1"
                data-dismiss="modal"
                onClick={props.closeShareModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="compact primaryBtn ms-1"
                onClick={sharePostFn}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Share;
