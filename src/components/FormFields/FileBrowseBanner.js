import React, { useEffect, useRef, useState } from 'react';
import Spinner from '../Spinner/index';
import { uploadFile } from '../../http/http-calls';
import { alertBox } from '../../commonRedux';
import 'react-image-crop/dist/ReactCrop.css';
import './styles.scss';
import ReactCrop from 'react-image-crop';

function FileBrowse(props) {
  const [selected, setSelected] = useState('');
  const [accept, setAccept] = useState('valid');
  const [loading, setLoading] = useState(false);
  const imageRef = useRef();
  const [modal, setModal] = useState(false);
  const [crop, setCrop] = useState({
    unit: 'px',
    aspect: 3 / 1,
    height: 200,
  });

  useEffect(() => {
    const st = props.accept;
    if (st != undefined && st != null && st != '' && st != '*') {
      let s = 'valid ';
      const sts = st.split(',');
      sts.forEach((el) => {
        if (el.trim() == 'image/*') {
          s += 'image';
        } else {
          s += ', pdf';
        }
      });
      setAccept(s);
    }
  }, []);
  const selectModal = (info) => {
    setModal(!modal); // true/false toggle
  };
  const handleOnCropChange = (crop) => {
    setCrop(crop);
  };
  const onImageLoaded = (image) => {
    imageRef.current = image;
  };
  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // As Base64 string
    // const base64Image = canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          blob.name = fileName;
          resolve(blob);
        },
        'image/jpeg',
        1
      );
    });
  };
  const setBannerImg = (e) => {
    const file = e.target.files[0];

    if (file.type.split('/')[0] === 'image') {
      //   this.setState({ selected: URL.createObjectURL(file), modal: true });
      setSelected(URL.createObjectURL(file));
      setModal(true);
    } else {
      alertBox(true, 'Please choose valid image files only');
    }
    e.target.value = '';
    // updateProfile({avatar: file}).then(resp=>{
    //   window.location.reload();
    // }, err => {
    //
    // })
  };

  const savePic = async (e) => {
    e.preventDefault();

    if (imageRef.current && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef.current,
        crop,
        `${Date.now()}.jpeg`
      );
      const blob2fle = new File([croppedImageUrl], croppedImageUrl.name, {
        type: 'image/jpeg',
      });
      inputChange(blob2fle);
      selectModal(false);
    }
  };
  const browse = (e) => {
    const target = e.target.getAttribute('data-target');
    document.getElementById(target).click();
  };
  const onCropComplete = (crop) => {
    // this.makeClientCrop(crop);
  };
  const inputChange = (file) => {
    const val = file;
    const st = props.accept;
    const ft = val.type;
    let ft2 = ft.split('/')[0];
    let ftf = ft2;
    if (ft2 == 'application') {
      ft2 = ft;
      ftf = ft.split('/')[1];
    }
    let accept = '';
    if (st == 'image') {
      accept = 'png,jpg,jpeg';
    } else {
      accept = 'png,jpg,jpeg,pdf';
    }
    if (!val.name.match(/\.(png|jpg|jpeg)$/) && st == 'image') {
      alertBox(true, `Please choose valid format ${accept}`);
    } else if (val.size > 2000000) {
      alertBox(true, 'Please upload the attachment less than 2 MB');
    } else if (
      st == undefined ||
      st == null ||
      st == '' ||
      st == '*' ||
      st.indexOf(ft2) != -1
    ) {
      setSelected(val.name);
      if (props.type == 'upload') {
        // setLoading(true);
        uploadFile({
          page: props.page == null ? 'general' : props.page,
          file: val,
        }).then(
          async (resp) => {
            props.fileChange(props.name, props.type, resp.file.filePath);
            // setLoading(true);
          },
          (error) => {
            // setLoading(false);
            if (error != undefined) {
              alertBox(true, error.message);
            } else {
              alertBox(true, 'File upload getting error');
            }
          }
        );
      } else {
        props.fileChange(props.name, props.type, val);
      }
    } else {
      alertBox(true, `Please choose valid format ${accept}`);
    }
  };

  return (
    <div className="fileBrowse">
      <div className="d-flex flex-column justify-content-start align-items">
        <input
          className="new-form-control"
          value={
            props.type == 'upload'
              ? selected
              : props.value != undefined
              ? props.value.name
              : ''
          }
          readOnly
          type="text"
          placeholder={
            props.accept == 'image'
              ? 'jpg, png, jpeg files only'
              : 'jpg, png, jpeg, pdf files only'
          }
          data-target={props.name}
          onClick={(e) => browse(e)}
        />

        <input
          type="file"
          name="file"
          className="hide"
          id={props.name}
          onChange={(e) => setBannerImg(e)}
          accept={
            props.accept != undefined && props.accept != null
              ? props.accept
              : '*'
          }
        />
        <button
          className="primaryBtn mt-2"
          data-target={props.name}
          type="button"
          onClick={(e) => browse(e)}
        >
          {loading ? <Spinner /> : 'Browse'}
        </button>
      </div>

      {/* <Modal displayModal={modal} closeModal={selectModal} > */}
      {/* onChange={this.crop} onImageLoaded={this.onImageLoaded}
          onComplete={this.onCropComplete} onClick={this.savePic} */}
      {/* <ReactCrop src={selected} minWidth={50} minHeight={50} crop={crop} onChange={handleOnCropChange} onComplete={onCropComplete} onImageLoaded={onImageLoaded} />
        <div className="d-flex align-items-center justify-content-center">
          <Button variant="primary" size="compact m-2" onClick={savePic} >Save</Button>
          <Button variant="secondary" size="compact m-2" onClick={selectModal}>Cancel</Button>
        </div> */}

      <div
        className={`modal fade ${modal ? 'show' : ''}`}
        style={{ display: `${modal ? 'block' : 'none'}` }}
        id="bannerModal"
        tabIndex="-1"
        aria-labelledby="bannerModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" style={{ maxWidth: 'fit-content' }}>
          <div className="modal-content">
            <div className="modal-body">
              <ReactCrop
                src={selected}
                minWidth={50}
                minHeight={50}
                crop={crop}
                onChange={handleOnCropChange}
                onComplete={onCropComplete}
                onImageLoaded={onImageLoaded}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => setModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={savePic}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* </Modal> */}
    </div>
  );
}

export default FileBrowse;
