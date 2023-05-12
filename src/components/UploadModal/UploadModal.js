import React from 'react';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Paper from '@material-ui/core/Paper';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { alertBox } from '../../commonRedux';
import { image, video, file, audio } from '../../config/constants';

import './Upload.scss';

export default function UploadModal(props) {
  const [attachments, setAttachments] = React.useState([]);
  const [imgs, setImgs] = React.useState([]);
  const [attach_all, setImgAll] = React.useState([]);
  const [imgType, setImgType] = React.useState([]);
  const [dragclass, setDragclass] = React.useState('');

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragclass('enter');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragclass('');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragclass('over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragclass('');
    const dt = e.dataTransfer;
    const { files } = dt;
    handleFiles(files);
  };
  const addToGallery = (e) => {
    // e.target.value = null
    e.preventDefault();
    e.stopPropagation();
    setDragclass('');
    handleFiles(e.target.files);
  };
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const el = document.querySelector('.droppedFiles');
    if (!el.contains(e.target)) {
      document.getElementById('gallery').click();
    }
  };
  const fileToDataURL = (file) => {
    if (file != undefined) {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = function (event) {
          resolve(event.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const readAsDataURL = (filesArray) => {
    // target => <input type="file" id="file">
    // var filesArray = Array.prototype.slice.call(target.files)
    if (filesArray != undefined) {
      return Promise.all(filesArray.map(fileToDataURL));
    }
  };

  const handleFiles = async (files) => {
    let err = [];
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      const getExt = element.name.split('.').pop();
      const fileType = getExt.replace('.', '');
      // add validation
      if (
        image.indexOf(`.${fileType}`) == -1 &&
        video.indexOf(`.${fileType}`) == -1 &&
        file.indexOf(`.${fileType}`) == -1 &&
        audio.indexOf(`.${fileType}`) == -1
      ) {
        err.push('Please select valid file');
      } else if (element.size > 2000000) {
        err.push('Please upload the attachment less than 2 MB');
      } else {
        err = [];
      }
    }
    if (err.length > 0) {
      alertBox(true, err.join(', '));
    } else {
      const temp = [...files];
      const f = await readAsDataURL(temp);
      const all_img = [];
      setImgs(f);
      const reader = new FileReader();
      temp.map((item) => {
        const element = item;
        const getExt = element.name.split('.').pop();
        const fileType = getExt.replace('.', '');
        all_img.push(fileType);
      });
      setImgType(all_img);
      setAttachments(temp);
      if (all_img.length == temp.length) {
        const push_img = [];
        f.map((items, i) => {
          const img_up = {};
          img_up.src = items;
          img_up.type = all_img[i];
          push_img.push(img_up);
        });
        setImgAll(push_img);
      }
      props.fileChange(temp);
    }
  };

  const removeFile = (i) => {
    const temp = [...attachments];
    const temp2 = [...imgs];
    const temp3 = [...attach_all];
    delete temp[i];
    delete temp2[i];
    delete temp3[i];
    setAttachments(temp);
    setImgs(temp2);
    setImgAll(temp3);
    props.fileChange(temp);
  };

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="max-width-dialog-title"
      className="upload-file-modal"
    >
      <DialogContent>
        <div className="dialog-upload-desc">
          <div className="upload-btn">
            <DialogTitle id="max-width-dialog-title" className="dialog-title">
              Upload all necessary files <br />
            </DialogTitle>
          </div>
          <div className="upload-note">
            <span className="note-text">Note:</span> Before submitting the
            files, make sure your customer is happy and has no more changes for
            smooth payment release
            <br />
          </div>
        </div>
        <Paper
          variant="outlined"
          square
          className={`uploadArea ${dragclass}`}
          onDrop={(e) => handleDrop(e)}
          onDragOver={(e) => handleDragOver(e)}
          onDragEnter={(e) => handleDragEnter(e)}
          onDragLeave={(e) => handleDragLeave(e)}
          onClick={(e) => handleClick(e)}
        >
          {/* <div className="files-container">
                    <div className="uploaded-file">
                        <Paper variant="outlined" square className="uploaded-files" >
                        </Paper>
                        <div className="file-name">Logo1.jpg</div>
                    </div>
                    <div className="uploaded-file">
                        <Paper variant="outlined" square className="uploaded-files" >
                        </Paper>
                        <div className="file-name">Logo2.jpg</div>
                    </div>
                    <div className="uploaded-file">
                        <Paper variant="outlined" square className="uploaded-files" >
                        </Paper>
                        <div className="file-name">Logo3.jpg</div>
                    </div>
               </div> */}
          <div className="droppedFiles">
            {attach_all.map(
              (f, i) =>
                f != undefined && (
                  <div className="file" key={i}>
                    {/* <img src={f} /> */}
                    {f.type == 'jpeg' ||
                    f.type == 'png' ||
                    f.type == 'jpg' ||
                    f.type == 'Image' ||
                    f.type == 'gif' ? (
                      <img src={f.src} />
                    ) : null}

                    {f.type == 'mp4' || f.type == 'video' ? (
                      <video src={f.src} controls />
                    ) : null}

                    {f.type == 'mp3' ? <audio src={f.src} controls /> : null}

                    {f.type == 'pdf' ? (
                      <a href={f.src}>
                        <i
                          className="fa fa-file-pdf-o icon-file"
                          style={{ 'font-size': '45px' }}
                        />
                      </a>
                    ) : null}

                    {f.type == 'doc' ? (
                      <a href={f.src}>
                        <i
                          className="fa fa-file-word-o icon-file"
                          style={{ 'font-size': '45px' }}
                        />
                      </a>
                    ) : null}

                    {f.type == 'txt' ? (
                      <a href={f.src}>
                        <i
                          className="fa fa-file-text-o icon-file"
                          style={{ 'font-size': '45px' }}
                        />
                      </a>
                    ) : null}

                    {f.type == 'xls' || f.type == 'xlsx' ? (
                      <a href={f.src}>
                        <i
                          className="fa fa-file-excel-o icon-file"
                          style={{ 'font-size': '45px' }}
                        />
                      </a>
                    ) : null}

                    {/* <iframe src={f.src} /> */}
                    <i className="fa fa-times" onClick={() => removeFile(i)} />
                  </div>
                )
            )}
          </div>
          <div className="drag-droup">Browse / Drag and drop</div>
        </Paper>
        <span className="note-text">Accepted files:</span>{' '}
        jpeg,jpg,png,gif,doc,txt,mp4,mp3,pdf,xls,xlsx
        <input
          type="file"
          multiple
          id="gallery"
          onChange={(e) => addToGallery(e)}
          style={{ display: 'none' }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          style={{ backgroundColor: '#5931ea' }}
          className="submit-payment"
          onClick={props.onSubmit}
        >
          Submit for approval and payment
        </Button>
      </DialogActions>
    </Dialog>
  );
}
