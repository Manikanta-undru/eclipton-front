import React, { useEffect, useState } from 'react';
import Spinner from '../Spinner/index';
import { uploadFile } from '../../http/http-calls';
import { alertBox } from '../../commonRedux';
import './styles.scss';

function FileBrowse(props) {
  const [selected, setSelected] = useState('');
  const [accept, setAccept] = useState('valid');
  const [loading, setLoading] = useState(false);

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

  const browse = (e) => {
    const target = e.target.getAttribute('data-target');
    document.getElementById(target).click();
  };

  const inputChange = (e) => {
    const val = e.target.files[0];
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
            console.log(error, 'error log');
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
    e.target.value = '';
  };

  return (
    <div className="fileBrowse">
      <div className="d-flex justify-content-start align-items">
        <input
          className="form-control"
          value={
            props.type == 'upload'
              ? selected
              : props.value != undefined
              ? props.value.name
              : ''
          }
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
          onChange={(e) => inputChange(e)}
          accept={
            props.accept != undefined && props.accept != null
              ? props.accept
              : '*'
          }
        />
        <button
          className="btn btn-main box"
          data-target={props.name}
          type="button"
          onClick={(e) => browse(e)}
        >
          {loading ? <Spinner /> : 'Browse'}
        </button>
      </div>
    </div>
  );
}

export default FileBrowse;
