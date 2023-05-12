import { ContentState, EditorState } from 'draft-js';
import edjsHTML from 'editorjs-html';
import htmlToDraft from 'html-to-draftjs';
import React from 'react';
import EditorJs from 'react-editor-js';
import { alertBox, switchLoader } from '../../../commonRedux';
import Spinner from '../../../components/Spinner';
import FileBrowseBanner from '../../../components/FormFields/FileBrowseBanner';
import {
  createGigRequest,
  getCategories,
  getGigRequest,
  getGigRequestDraft,
} from '../../../http/gig-calls';
import { EDITOR_JS_TOOLS } from '../../MyBlogs/tools';
import { image, video, file, audio } from '../../../config/constants';
import { convertDataToHtml } from '../../../globalFunctions';

require('./styles.scss');
const coins = require('./coins.json');

class GigRequestTab extends React.Component {
  constructor(props) {
    super(props);

    // const edjsParser = editorjsHTML();
    const edjsParser = edjsHTML({
      table: convertDataToHtml,
      checklist: convertDataToHtml,
      image: convertDataToHtml,
      raw: convertDataToHtml,
      warning: convertDataToHtml,
    });

    const html =
      '{"time":1612692654392,"blocks":[{"type":"paragraph","data":{"text":"sdff"}},{"type":"paragraph","data":{"text":"<b>sdfsdf</b>"}}],"version":"2.19.1"}';
    const contentBlock = htmlToDraft(html);
    this.editor = React.createRef();
    this.reactTags = React.createRef();
    this.imgBannerRefHide = React.createRef();
    this.img_banner_pre = React.createRef();
    let editor = null;
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      editor = editorState;
    }
    this.state = {
      id: 0,
      ide: false,
      loading: true,
      editorState: editor,
      editorInstance: null,
      edjsParser,
      tags: [],
      level: 1,
      dragclass: '',
      parent: '',
      files: [],
      files2: [],
      features: [{ feature: '', standard: 0, premium: 1 }],
      extras: [{ feature: '', value: '', amount: '' }],
      level1: [],
      level2: [],
      level3: [],
      level4: [],
      level5: [],
      coins,
      title: '',
      currency: '',
      category: '',
      category_id: '',
      sub_category: [],
      sub_category_id: [],
      format: [],
      maxGigs: 0,
      delivery: '',
      budget: null,
      gallery: [],
      type: '',
      edit_image: null,
      banner_image: null,
      selectedsub_category: [],
      price_extra: [],
      all_currency_accept: 1,
      gallery_dimensions: {},
      banner_dimensions: {},
      fileimgs: [],
      removedFiles: [],
    };
    this.onImgLoad = this.onImgLoad.bind(this);
    this.onGImgLoad = this.onGImgLoad.bind(this);
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  onDelete(i) {
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    this.setState({ tags });
  }

  onAddition(tag) {
    const tags = [].concat(this.state.tags, tag);
    this.setState({ tags });
  }

  tagChange = (val) => {};

  handleFeature = (i, e) => {
    const { name } = e.target;
    const temp = this.state.features;
    let val;
    if (name == 'feature') {
      val = e.target.value;
      temp[i][name] = val;
    } else {
      val = e.target.checked;
      temp[i][name] = val ? 1 : 0;
    }
    this.setState({
      features: temp,
    });
  };

  addFeature = () => {
    const temp = this.state.features;
    temp.push({ feature: '', standard: 0, premium: 1 });
    this.setState({
      features: temp,
    });
  };

  removeFeature = (i) => {
    const temp = this.state.features;
    delete temp[i];
    this.setState({
      features: temp,
    });
  };

  handleExtra = (i, e) => {
    const { name } = e.target;
    const temp = this.state.extras;
    const val = e.target.value;
    temp[i][name] = val;
    this.setState({
      extras: temp,
    });
  };

  addExtra = () => {
    const temp = this.state.extras;
    temp.push({ feature: '', value: '', amount: '' });
    this.setState({
      extras: temp,
    });
  };

  removeExtra = (i) => {
    const temp = this.state.extras;
    delete temp[i];
    this.setState({
      extras: temp,
    });
  };

  componentDidMount() {
    // this.getGigCategories(1);
    //  if(this.props.match.params.id != undefined && this.props.match.params.id != null){
    //    this.getData(this.props.match.params.id);
    //  }
    if (this.props.id != undefined && this.props.id != null) {
      this.getData();
    } else {
      this.setState({
        loading: false,
      });
    }
    this.getGigCategories(1);
  }

  addItem(name, value) {
    const selectval = [];
    value.map((item) => {
      selectval.push(item.key);
    });
    if (name == 'sub_category') {
      const selectcat = [];
      value.map((item) => {
        selectcat.push(item.cat);
      });
      this.setState({ sub_category_id: selectcat });
    }
    this.setState({
      [name]: selectval,
      [`selected${name}`]: value,
    });
  }

  getGigCategories = (level) => {
    getCategories({ level, parent: this.state.parent }).then(
      (resp) => {
        if (level == 2) {
          const options_curr = [];
          resp.map((item) => {
            const valobjcurr = { cat: item._id, key: item.category };
            options_curr.push(valobjcurr);
          });
          let optios_curr = {};
          optios_curr = options_curr;
          this.setState({
            [`level${level}`]: resp,
          });
        } else {
          this.setState({
            [`level${level}`]: resp,
          });
        }
      },
      (err) => {}
    );
  };

  getData = () => {
    //
    getGigRequest({ id: this.props.id }).then(
      (res) => {
        let f_subcategory = '';
        let f_subcategoryid = '';
        const sub_category = res.post.subCategory;
        const sub_category_id = res.post.subCategoryId;
        if (sub_category.length > 0 && typeof sub_category === 'object') {
          f_subcategory = sub_category[0];
          f_subcategoryid = sub_category_id[0];
        } else {
          f_subcategory = sub_category;
          f_subcategoryid = sub_category_id;
        }
        try {
          const resp = res.post;
          this.setState(
            {
              sub_category: resp.category,
              sub_category_id: resp.categoryId,
              parent: resp.categoryId,
              level: 2,
            },
            () => {
              this.getGigCategories(2);
            }
          );
          this.setState(
            {
              id: resp._id,
              title: resp.subject,
              data: JSON.parse(resp.editorContent),
              currency: resp.preferedCurrency,
              edit_image: resp.banner,
              banner_image: resp.banner,
              desc: resp.text,
              extras: resp.extras,
              budget: resp.budget,
              delivery: resp.duration,
              maxGigs: resp.maxGigs,
              files2: resp.contents,
              category: resp.category,
              category_id: resp.categoryId,
              sub_category: f_subcategory,
              sub_category_id: f_subcategoryid,
              // selectedsub_category:op_cur,
              price_extra:
                typeof resp.price_extra === 'object' ? resp.price_extra : [],
              all_currency_accept: resp.all_currency_accept,
            },
            () => {
              setTimeout(() => {
                this.setState({
                  loading: false,
                });
              }, 1000);
            }
          );
        } catch (error) {
          this.setState({
            ide: true,
            loading: false,
          });
        }
      },
      (err) => {
        this.setState({ loading: false });
      }
    );
  };

  addPrice = () => {
    const temp = this.state.price_extra;
    temp.push({ prefered_currency: '', budget_amount: '' });
    this.setState({
      price_extra: temp,
    });
  };

  removePrice = (i) => {
    const temp = this.state.price_extra;
    delete temp[i];
    this.setState({
      price_extra: temp,
    });
  };

  getDraft = () => {
    getGigRequestDraft().then(
      (res) => {
        const resp = res;
        this.setState(
          {
            id: resp._id,
            title: resp.subject,
            data: JSON.parse(resp.editorContent),
            currency: resp.preferedCurrency,
            desc: resp.text,
            extras: resp.extras,
            budget: resp.budget,
            delivery: resp.duration,
            maxGigs: resp.maxGigs,
            files2: resp.contents,
            category: resp.category,
            category_id: resp.categoryId,
            sub_category: resp.subCategory,
            sub_category_id: resp.subCategoryId,
            edit_image: resp.banner,
            banner_image: resp.banner,
          },
          () => {
            setTimeout(() => {
              this.setState({
                loading: false,
              });
            }, 1000);
          }
        );
      },
      (err) => {
        this.setState({ loading: false });
      }
    );
  };

  handleInput = (e) => {
    let val = e.target.value;
    const { name } = e.target;
    if (name === 'maxGigs') {
      if (val === '' || val.trim() === '') {
        alertBox(true, 'Please enter the maximum gigs');
      } else if (val === '0' || val === 0) {
        alertBox(true, 'Maximum gig must be greater than 0');
      } else {
        const regex = /^[0-9]+$/;
        if (val.search(regex) === -1) {
          alertBox(true, 'Only numbers are allowed not a decimal');
        }
        this.setState({
          [name]: val,
        });
      }
    }
    if (name === 'desc') {
      if (val.length > 1200) {
        val = val.substring(0, 1200);
        alertBox(true, 'Only allow 1200 characters');
      }
      this.setState({
        [name]: val,
      });
    }
    if (name == 'title') {
      if (val === '' || val.trim() === '') {
        alertBox(true, 'Please enter the title');
      } else {
        if (val.length > 80) {
          val = val.substring(0, 80);
        }
        const regex = /^[a-zA-Z0-9-_.,&()/:;\s]+$/;
        if (val.search(regex) === -1) {
          alertBox(
            true,
            'Only alphabets, numbers, hyphen, underscore, dot, commas, colons, semicolons, and, slash, parenthesis'
          );
        }
        this.setState({
          [name]: val,
        });
      }
      this.setState({
        [name]: val,
      });
    } else {
      this.setState({
        [name]: val,
      });
    }
  };

  handleCategory = (val, i) => {
    this.setState({
      sub_category: '',
      sub_category_id: '',
      selectedsub_category: [],
    });
    if (val === '' && i === 2) {
      this.setState({
        level2: [],
      });
    }
    if (val != '') {
      const v = val.split('^');
      this.setState({ selectedsub_category: [] });
      if (i == 2) {
        this.setState(
          {
            category: v[1],
            category_id: v[0],
            parent: v[0],
            level: i,
          },
          () => {
            if (i < 6) {
              this.getGigCategories(i);
            }
          }
        );
      } else {
        this.setState(
          {
            sub_category: v[1],
            sub_category_id: v[0],
            parent: v[0],
            level: i,
          },
          () => {
            if (i < 6) {
              this.getGigCategories(i);
            }
          }
        );
      }
    }
  };

  handleFile = (name, type, value) => {
    this.setState(
      {
        [name]: value,
      },
      () => {
        const reader = new FileReader();
        // it's onload event and you forgot (parameters)
        reader.onload = function (e) {
          const image = document.getElementById(`${name}_preview`);
          image.src = e.target.result;
        };
        // you have to declare the file loading
        reader.readAsDataURL(value);
      }
    );
  };

  handleextra = (i, e) => {
    const temp = this.state.price_extra;
    const { name } = e.target;
    const val = e.target.value;
    let err = 0;
    if (name == 'prefered_currency') {
      if (val === '') {
        err = 1;
        alertBox(true, 'Please choose currency');
      } else {
        const find_same_currency = temp.filter(
          (i) =>
            i != null &&
            (i.prefered_currency == val || this.state.currency == val)
        );
        if (find_same_currency.length > 0) {
          err = 1;
          alertBox(true, 'Please choose other currency,Already have the price');
        }
      }
    }
    if (val === '0' || val === 0) {
      err = 1;
      temp[i][name] = val;
      this.setState({ price_extra: temp });
      alertBox(true, 'Price must be greater than zero');
    }
    if (err == 0) {
      temp[i][name] = val;
      this.setState({ price_extra: temp });
    }
  };

  submit = async (e, t) => {
    e.preventDefault();
    const edata = await this.editor.save();
    const err = [];

    if (this.state.title === '' || this.state.title.trim() === '') {
      err.push('Title is required');
    }
    if (this.state.maxGigs === '') {
      err.push('Maximum Gigs is required');
    }
    if (
      (!this.state.maxGigs && this.state.maxGigs !== 0) ||
      this.state.maxGigs === '0' ||
      parseInt(this.state.maxGigs) < 0
    ) {
      err.push('Maximum Gigs must be greater than zero');
    }
    const maxgig_regex = /^[0-9]+$/;
    if (
      this.state.maxGigs &&
      this.state.maxGigs.toString().search(maxgig_regex) === -1
    ) {
      err.push('Only numbers are allowed not a decimal');
    }
    if (this.state.title.length > 80 || this.state.title.length < 4) {
      err.push('Title is required with in 4 to 80 charecters ');
    }
    const regex = /^[a-zA-Z0-9-_.,&()/:;\s]+$/;
    if (this.state.title.search(regex) === -1) {
      err.push(
        'Only alphabets, numbers, hyphen, underscore, dot, commas, colons, semicolons, and, slash, space, parenthesis'
      );
    }
    if (this.state.category == '') {
      err.push('Category is required');
    }
    if (this.state.sub_category == '' || this.state.sub_category.length === 0) {
      err.push('Sub Category is required');
    }
    if (this.state.banner_image == null || this.state.banner_image == '') {
      err.push('Banner image is required');
    }
    if (this.state.files.length == 0 && this.state.files2.length == 0) {
      err.push('At least one gallery image is required');
    }
    if (this.state.currency == '') {
      err.push('Please choose the currency');
    }
    if (this.state.budget) {
      /* empty */
    }
    if (this.state.budget <= 0 || parseInt(this.state.budget) < 0) {
      err.push('Budget must be greater than zero');
    }
    const find_same_currency = this.state.price_extra.filter(
      (i) => i != null && i.prefered_currency === this.state.currency
    );
    if (find_same_currency.length > 0) {
      err.push('Please choose other currency');
    }

    const find_zero_val =
      this.state.price_extra !== undefined
        ? this.state.price_extra.filter(
            (i) =>
              i != null &&
              (i.budget_amount === '0' || parseInt(i.budget_amount) < 0)
          )
        : [];
    if (find_zero_val.length > 0) {
      err.push('Amount must be greater than zero');
    }

    const find_currency_val =
      this.state.price_extra !== undefined
        ? this.state.price_extra.filter(
            (i) => i != null && i.prefered_currency === ''
          )
        : [];
    if (find_currency_val.length > 0) {
      err.push('Please Choose the currency');
    }

    if (this.state.delivery == 0 || parseInt(this.state.delivery) < 0) {
      err.push('Delivery days must be greater than zero');
    }
    // if (this.state.desc == '' || this.state.desc.trim().length == 0) {
    //   err.push("About content is required");
    // }

    if (t == 1) {
      var status = 'active';
    } else {
      status = 'draft';
    }

    // if (this.state.sub_category.length > 0) {
    //   var sub_category = this.state.sub_category.join(",");
    // } else {
    //   var sub_category = '';
    // }

    // if (this.state.sub_category_id.length > 0) {
    //   var sub_category_id = this.state.sub_category_id.join(",");
    // } else {
    //   var sub_category_id = '';
    // }

    let removed_files;
    if (this.state.removedFiles.length > 0) {
      removed_files = this.state.removedFiles.join(',');
    } else {
      removed_files = [];
    }

    let isemptydescription = true;
    if (edata && edata.blocks && edata.blocks.length > 0) {
      for (let index = 0; index < edata.blocks.length; index++) {
        const element = edata.blocks[index];
        const emptychecks = element.data.text;
        const emptycheck = emptychecks.replace(/&nbsp;/g, '').trim();
        if (emptycheck) {
          isemptydescription = false;
        }
      }
    }

    if (isemptydescription) {
      err.push('About content is required');
    }

    if (err.length > 0) {
      if (err.length > 2) {
        alertBox(true, 'Please enter all the mandatory fields');
      } else {
        alertBox(true, err.join(', '));
      }
    } else {
      let data = this.state.edjsParser.parse(edata);
      data = data.join(' ');
      switchLoader('Posting request, please wait...');
      const formData = {
        status,
        subject: this.state.title,
        category: this.state.category,
        category_id: this.state.category_id,
        sub_category: this.state.sub_category,
        sub_category_id: this.state.sub_category_id,
        maxGigs:
          this.state.maxGigs == '' || this.state.maxGigs == null
            ? 0
            : this.state.maxGigs,
        all_currency_accept: this.state.all_currency_accept,
        currency: this.state.currency,
        budget: this.state.budget,
        delivery: this.state.delivery,
        text: data,
        editorContent: JSON.stringify(edata),
        files: this.state.files,
        files2:
          this.props.id != undefined ? JSON.stringify(this.state.files2) : [],
        price_extra: JSON.stringify(this.state.price_extra),
      };

      if (
        this.props.id != undefined &&
        this.props.id != null &&
        !this.state.ide
      ) {
        formData.id = this.props.id;
        if (removed_files.length > 0) {
          formData.removedFiles = removed_files;
        }
      }
      if (this.state.id != 0 && !this.state.ide) {
        formData.id = this.state.id;
      }
      formData.banner_image = this.state.banner_image;

      createGigRequest(formData).then(
        async (resp) => {
          if (t == 1) {
            window.location.href = '/passionomy/dashboard/requests';
          } else if (resp.post != undefined) {
            alertBox(true, 'Draft has been saved!', 'success');
            this.props.history.push(
              `/passionomy/request/edit/${resp.post.slug}`
            );
          } else {
            alertBox(true, 'Error creating the hire talent');
          }

          switchLoader();
        },
        (error) => {
          alertBox(true, error.message);
          switchLoader();
        }
      );
    }
  };

  handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragclass: 'enter',
    });
  };

  handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragclass: '',
    });
  };

  handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragclass: 'over',
    });
  };

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragclass: '',
    });
    const dt = e.dataTransfer;
    const { files } = dt;
    this.handleFiles(files);
  };

  addToGallery = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      dragclass: '',
    });
    this.handleFiles(e.target.files);
  };

  handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const el = document.querySelector('.droppedFiles');
    if (!el.contains(e.target)) {
      document.getElementById('gallery').click();
    }
  };

  fileToDataURL = (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = function (event) {
        resolve(event.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  readAsDataURL = (filesArray) =>
    // target => <input type="file" id="file">
    // var filesArray = Array.prototype.slice.call(target.files)
    Promise.all(filesArray.map(this.fileToDataURL));

  handleFiles = async (files) => {
    this.setState({
      files: [],
      // files2: [],
      imgs: [],
    });
    let fileType = '';
    const total_files = this.state.files2.length + files.length;
    if (total_files > 5) {
      alertBox(true, "Can't upload more than 5 images");
      return;
    }
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      const getExt = element.name.split('.').pop();
      // if (! element.type.match('image*') || !element.type.match('video*') || !element.type.match('audio*') || !element.type.match('pdf*') || !element.type.match('xls*')) {
      //   alertBox(true, "Please select valid file");
      //   return;
      // }
      if (element.size > 2000000) {
        alertBox(true, 'Please upload the attachment less than 2 MB');
        return;
      }
      fileType = getExt.replace('.', '');
      if (
        image.indexOf(`.${fileType}`) == -1 &&
        video.indexOf(`.${fileType}`) == -1 &&
        file.indexOf(`.${fileType}`) == -1 &&
        audio.indexOf(`.${fileType}`) == -1
      ) {
        alertBox(true, 'Please select valid file');
        return;
      }
    }
    const temp = [...files];
    const f = await this.readAsDataURL(temp);
    const filesmerge = [];
    temp.map((f_item, index) => {
      const f_var = {};
      const element = f_item;
      const getExt = element.name.split('.').pop();
      const fileType = getExt.replace('.', '');
      f_var.img = f[index];
      f_var.type = fileType;
      filesmerge.push(f_var);
    });
    this.setState({
      files: temp,
      imgs: f,
      type: fileType,
      fileimgs: filesmerge,
    });

    // if(this.imgBannerRefHide.current != null){
    //   var ImageHide = this.imgBannerRefHide.current
    //   ImageHide.onload = function() {
    //     var height = ImageHide.height;
    //     var width = ImageHide.width;
    //     if(width < 200  && height < 200 && fileType == "png" || fileType == "jpeg" || fileType == "jpg" || fileType == "gif"){
    //       this.setState({
    //         files: [],
    //         imgs: "",
    //         type: ""
    //       });
    //       alertBox(true,"Please upload the image should be 1500px X 200px (width X height)");
    //     }
    //   }

    // }
  };

  removeFile = (e, i, n = 1) => {
    let temp;
    e.preventDefault();
    const removedFiles = [];
    if (n == 2) {
      temp = this.state.files2;
      removedFiles.push(this.state.files2[i]._id);
      this.setState({
        removedFiles: [...this.state.removedFiles, ...removedFiles],
      });
      if (temp != undefined && temp.length > 0) {
        temp.splice(i, 1);
      }
      this.setState({
        files2: temp,
      });
    } else {
      temp = this.state.files;
      const temp2 = this.state.imgs;
      const temp3 = this.state.fileimgs;
      temp.splice(i, 1);
      if (temp2 != undefined && temp2.length > 0) {
        temp2.splice(i, 1);
      }
      if (temp3 != undefined && temp3.length > 0) {
        temp3.splice(i, 1);
      }
      this.setState({
        files: temp,
        imgs: temp2,
        fileimgs: temp3,
      });
    }
  };

  handleBannerFile = (name, type, value) => {
    this.setState(
      {
        [name]: value,
      },
      () => {
        const reader = new FileReader();
        // it's onload event and you forgot (parameters)
        reader.onload = function (e) {
          const image = document.getElementById(`${name}_preview`);
          const image_hide = document.getElementById(`${name}_preview_hide`);
          image_hide.src = e.target.result;
          image.src = e.target.result;
        };
        // you have to declare the file loading
        reader.readAsDataURL(value);
      }
    );
  };

  onImgLoad = ({ target: img }) => {
    const img_width = img.width;
    const img_height = img.height;
    // if(img_width < 200 || img_height < 200){
    //   alertBox(true,"Please upload the image should be 1500px X 200px (width X height)");
    //   return this.setState({banner_dimensions:{width:img.width,height:img.height},banner_image:""});

    // }else{
    return this.setState({ banner_dimensions: {} });

    // }
  };

  handleBannerRemove = (e) => {
    const name = e.target.getAttribute('name');
    this.setState({
      [name]: null,
      edit_image: null,
    });
  };

  opennew = (file) => {
    let Eclipton;
    Eclipton = window.open(file, 'Eclipton', 'width=1000, height=1000'); // Opens a new window
  };

  onGImgLoad = ({ target: img }) => {
    const img_width = img.width;
    const img_height = img.height;
    if (img_width < 200 || img_height < 200) {
      alertBox(
        true,
        'Please upload the image should be 1500px X 200px (width X height)'
      );
      return this.setState({
        gallery_dimensions: { width: img.width, height: img.height },
        files: [],
        fileimgs: [],
        imgs: '',
        type: '',
      });
    }
    return this.setState({
      gallery_dimensions: {},
    });
  };

  clickView = (urlattach, urltype) => {
    let pdfWindow;
    pdfWindow = window.open(
      `/passionomy/preview/${encodeURIComponent(urlattach)}/${urltype}`,
      'pdfWindow',
      'width=1000, height=1000'
    ); // Opens a new window
  };

  render() {
    return (
      <div className="container my-wall-container  add-hire-page">
        <div className="row ">
          <header className="d-flex mt-4 mt-md-3 justify-content-between align-items-center">
            <div className="col-md-9 pe-md-4">
              <h1>Hire Talents</h1>
              <p className=" page-desc">
                Ut tempor fugiat qui ex magna officia quis laborum. Laboris id
                aute quis occaecat nostrud magna eiusmod. Ea aute ullamco nulla
                ipsum veniam.
              </p>
            </div>
            <div className="d-none col-md-3 d-sm-flex justify-content-end">
              <button
                className="secondaryBtn"
                onClick={(e) => this.submit(e, 0)}
              >
                Draft
              </button>
              <button
                className="ms-2 primaryBtn"
                onClick={(e) => this.submit(e, 1)}
              >
                Publish
              </button>
            </div>
          </header>
        </div>
        <form
          onSubmit={(e) => this.submit(e, 1)}
          method="post"
          className="form-wrapper"
        >
          <div className="row my-2 my-sm-5 ">
            <div className="col-md-6 input-block">
              <div className="clearfix">
                <h4>
                  I am Looking For{' '}
                  <span className="required text-danger">*</span>{' '}
                  <div className="info-pop d-inline-block d-sm-none ">
                    <a>
                      <i className="fa fa-info-circle" />{' '}
                      <p className=" shadow-sm">
                        Ad elit veniam nisi voluptate eu occaecat officia. Sit
                        dolor cillum enim nisi labore irure magna dolore
                        consequat. Cillum dolor non pariatur proident ipsum
                        laborum amet officia tempor occaecat exercitation
                        voluptate elit. Adipisicing laborum sint in deserunt.
                        Adipisicing veniam consectetur nostrud est cillum
                        eiusmod. Qui occaecat mollit non ex sit ad proident.
                      </p>
                    </a>
                  </div>
                </h4>
                <p className="d-none d-sm-block">
                  Laboris do pariatur laboris ipsum occaecat reprehenderit quis
                  cillum labore quis id est. Esse cupidatat consequat esse nisi
                  et laborum ullamco labore. Aliqua ut culpa quis velit dolor
                  duis anim occaecat tempor consectetur consectetur non sunt.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className=" clearfix">
                <input
                  type="text"
                  required
                  placeholder="I will help you for..."
                  name="title"
                  className="new-form-control w-100"
                  onChange={this.handleInput}
                  value={this.state.title}
                />
                <small className="pt-1 text-secondary pull-right">
                  {this.state.title.length} / 80 max
                </small>
              </div>
            </div>
          </div>
          <div className="row my-2 my-sm-5 ">
            <div className="col-md-6 input-block">
              <div className="clearfix">
                <h4>
                  Banner<span className="required text-danger">*</span>{' '}
                  <div className="info-pop d-inline-block d-sm-none ">
                    <a>
                      <i className="fa fa-info-circle" />{' '}
                      <p className=" shadow-sm">
                        Fugiat dolore consequat magna irure eiusmod ex.
                      </p>
                    </a>
                  </div>
                </h4>
                <p className="d-none d-sm-block">
                  Aute ipsum quis mollit est tempor velit voluptate deserunt et.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group newCreatebox_banner">
                <FileBrowseBanner
                  name="banner_image"
                  page="blogs"
                  fileChange={this.handleBannerFile}
                  value={
                    this.state.banner_image != '' ? this.state.banner_image : ''
                  }
                  accept="image"
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                />
                <div style={{ display: 'none' }}>
                  <img id="banner_image_preview_hide" onLoad={this.onImgLoad} />
                </div>
                {this.state.banner_image != null &&
                  this.state.edit_image != null &&
                  this.state.banner_image != '' &&
                  this.state.edit_image != '' && (
                    <div className="uploadedImage shadow  bannerPreviewImg">
                      <img
                        src={this.state.edit_image}
                        id="banner_image_preview"
                        ref={this.imgBannerRef}
                      />
                      <div className=" preview-close">
                        <button
                          onClick={this.handleBannerRemove}
                          name="banner_image"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}

                {this.state.banner_image != null &&
                  this.state.edit_image == null &&
                  this.state.banner_image != '' && (
                    <div className="uploadedImage shadow-sm  bannerPreviewImg">
                      <img
                        src={this.state.banner_image.tmp_name}
                        id="banner_image_preview"
                        ref={this.imgBannerRef}
                      />
                      <div className=" preview-close">
                        <button
                          onClick={this.handleBannerRemove}
                          name="banner_image"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="row my-2 my-sm-5 ">
            <div className="col-md-6 input-block">
              <div className="clearfix">
                <h4>
                  Category<span className="required text-danger">*</span>
                  <div className="info-pop d-inline-block d-sm-none ">
                    <a>
                      <i className="fa fa-info-circle" />{' '}
                      <p className=" shadow-sm">
                        Select an awesome banner image for your gig and make
                        sure to use banner size
                      </p>
                    </a>
                  </div>
                </h4>
                <p className="d-none d-sm-block">
                  Select an awesome banner image for your gig and make sure to
                  use banner size
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <select
                type="text"
                placeholder="I will help you for..."
                name="category"
                className="new-form-control w-100"
                onChange={(e) => this.handleCategory(e.target.value, 2)}
              >
                <option value="">Select a category</option>
                {this.state.level1.map((c, k) => (
                  <option
                    key={k}
                    value={`${c._id}^${c.category}`}
                    selected={this.state.category == c.category}
                  >
                    {c.category}
                  </option>
                ))}
              </select>
              <select
                type="text"
                placeholder="I will help you for..."
                name="category"
                className="new-form-control w-100 mt-3"
                onChange={(e) => this.handleCategory(e.target.value, 3)}
              >
                <option value="">Select a sub category</option>
                {this.state.level2.map((c, k) => (
                  <option
                    key={k}
                    value={`${c._id}^${c.category}`}
                    selected={this.state.sub_category == c.category}
                  >
                    {c.category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row my-2 my-sm-5 ">
            <div className="col-md-6 input-block">
              <div className="clearfix">
                <h4>
                  Maximum gigs required
                  <span className="required text-danger">*</span>{' '}
                  <div className="info-pop d-inline-block d-sm-none ">
                    <a>
                      <i className="fa fa-info-circle" />{' '}
                      <p className=" shadow-sm">
                        Fugiat dolore consequat magna irure eiusmod ex.
                      </p>
                    </a>
                  </div>
                </h4>
                <p className="d-none d-sm-block">
                  Aute ipsum quis mollit est tempor velit voluptate deserunt et.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="">
                <div className="d-flex align-items-center pb-2">
                  <div>
                    <input
                      type="checkbox"
                      checked={this.state.maxGigs === 0}
                      onClick={() => {
                        if (this.state.maxGigs == 0) {
                          this.setState({ maxGigs: null });
                        } else {
                          this.setState({ maxGigs: 0 });
                        }
                      }}
                    />{' '}
                  </div>
                  <div className="ps-2">Infinity</div>
                </div>
                <input
                  type="number"
                  onInput={(e) => {
                    if (e.target.value.length > e.target.maxLength)
                      e.target.value = e.target.value.slice(
                        0,
                        e.target.maxLength
                      );
                  }}
                  maxLength={8}
                  disabled={this.state.maxGigs === 0}
                  required
                  name="maxGigs"
                  min="0"
                  placeholder="or Enter the limit in numbers"
                  className="new-form-control w-100"
                  value={this.state.maxGigs}
                  onChange={this.handleInput}
                />
              </div>
            </div>
          </div>
          <div className="row my-2 my-sm-5 ">
            <div className="col-md-6 input-block">
              <div className="clearfix">
                <h4>
                  Delivery duration
                  <span className="required text-danger">*</span>{' '}
                  <div className="info-pop d-inline-block d-sm-none ">
                    <a>
                      <i className="fa fa-info-circle" />{' '}
                      <p className=" shadow-sm">
                        Fugiat dolore consequat magna irure eiusmod ex.
                      </p>
                    </a>
                  </div>
                </h4>
                <p className="d-none d-sm-block">
                  Aute ipsum quis mollit est tempor velit voluptate deserunt et.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <input
                type="number"
                onInput={(e) => {
                  if (e.target.value.length > e.target.maxLength)
                    e.target.value = e.target.value.slice(
                      0,
                      e.target.maxLength
                    );
                }}
                maxLength={8}
                required
                placeholder="in Days"
                name="delivery"
                className="new-form-control w-100"
                value={this.state.delivery}
                onChange={this.handleInput}
              />
            </div>
          </div>
          <div className="row mt-2 mt-sm-5 ">
            <div className="col-md-6 input-block">
              <div className="clearfix">
                <h4>
                  Budget<span className="required text-danger">*</span>{' '}
                  <div className="info-pop d-inline-block d-sm-none ">
                    <a>
                      <i className="fa fa-info-circle" />{' '}
                      <p className=" shadow-sm">
                        Fugiat dolore consequat magna irure eiusmod ex.
                      </p>
                    </a>
                  </div>
                </h4>
                <p className="d-none d-sm-block">
                  Aute ipsum quis mollit est tempor velit voluptate deserunt et.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <select
                name="currency"
                value={this.state.currency}
                required
                className="new-form-control w-100"
                onChange={this.handleInput}
              >
                <option value="">Preferred currency</option>
                {this.state.coins.map((e, i) => (
                  <option value={e.currencySymbol} key={i}>
                    {`${e.currencyName} (${e.currencySymbol})`}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={this.state.budget}
                required
                placeholder="Budget"
                name="budget"
                className="new-form-control mt-3  w-100"
                step="any"
                min="0"
                onChange={this.handleInput}
              />
            </div>
          </div>

          {this.state.price_extra != null &&
            this.state.price_extra.length > 0 &&
            this.state.price_extra.map(
              (v, i) =>
                this.state.price_extra[i] != null && (
                  <div className="row preferred-block my-2 my-sm-3 " key={i}>
                    <div className="col-md-6 mt-2">
                      <div className="ms-auto d-flex justify-content-end align-items-center">
                        <a
                          className="close-cross"
                          onClick={() => this.removePrice(i)}
                        >
                          <i className="fa fa-minus" />
                        </a>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <select
                        name="prefered_currency"
                        value={this.state.price_extra[i].prefered_currency}
                        required
                        className="new-form-control w-100"
                        onChange={(e) => this.handleextra(i, e)}
                      >
                        <option value="">Preferred currency</option>
                        {this.state.coins.map((e, i) => (
                          <option value={e.currencySymbol} key={i}>
                            {`${e.currencyName} (${e.currencySymbol})`}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={this.state.price_extra[i].budget_amount}
                        required
                        placeholder="Amount"
                        min="0"
                        step="any"
                        name="budget_amount"
                        className="new-form-control w-100 mt-3"
                        onChange={(e) => this.handleextra(i, e)}
                      />
                    </div>
                  </div>
                )
            )}
          <div className="row">
            <div className="d-flex mt-2">
              <button
                className="ms-auto  primaryBtn"
                type="button"
                onClick={() => this.addPrice()}
              >
                Add another currency <i className="fa fa-plus-circle" />
              </button>
            </div>
          </div>

          <div className="row my-2 my-sm-5">
            <div className="col-md-6 input-block">
              <div className="clearfix">
                <h4>
                  Description <span className="required text-danger">*</span>{' '}
                  <div className="info-pop d-inline-block d-sm-none ">
                    <a>
                      <i className="fa fa-info-circle" />{' '}
                      <p className=" shadow-sm">
                        Ad elit veniam nisi voluptate eu occaecat officia. Sit
                        dolor cillum enim nisi labore irure magna dolore
                        consequat. Cillum dolor non pariatur proident ipsum
                        laborum amet officia tempor occaecat exercitation
                        voluptate elit. Adipisicing laborum sint in deserunt.
                        Adipisicing veniam consectetur nostrud est cillum
                        eiusmod. Qui occaecat mollit non ex sit ad proident.
                      </p>
                    </a>
                  </div>
                </h4>
                <p className="d-none d-sm-block">
                  Laboris do pariatur laboris ipsum occaecat reprehenderit quis
                  cillum labore quis id est. Esse cupidatat consequat esse nisi
                  et laborum ullamco labore. Aliqua ut culpa quis velit dolor
                  duis anim occaecat tempor consectetur consectetur non sunt.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="text-block">
                {this.state.loading ? (
                  <Spinner />
                ) : (
                  <EditorJs
                    className="hello"
                    instanceRef={(instance) => {
                      this.editor = instance;
                    }}
                    data={this.state.data}
                    tools={EDITOR_JS_TOOLS}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="row my-5 gallery-block">
            <div className="col-md-6 input-block">
              <div className="clearfix">
                <h4>
                  Reference images
                  <span className="required text-danger">*</span>
                  <div className="info-pop d-inline-block d-sm-none ">
                    <a>
                      <i className="fa fa-info-circle" />{' '}
                      <p className=" shadow-sm">
                        Select an awesome work image for your gig and make sure
                        to use banner size
                      </p>
                    </a>
                  </div>
                </h4>
                <p className="d-none d-sm-block">
                  Select an awesome work image for your gig and make sure to use
                  banner size
                </p>
                <small className="text-secondary">
                  JPEG,JPG,PNG,GIF,DOCX,XLS,MP3,MP4
                </small>
              </div>
            </div>
            <div className="col-md-6">
              <div className="gallery-upload">
                <div
                  className={`uploadArea new-form-control ${this.state.dragclass}`}
                  onDrop={(e) => this.handleDrop(e)}
                  onDragOver={(e) => this.handleDragOver(e)}
                  onDragEnter={(e) => this.handleDragEnter(e)}
                  onDragLeave={(e) => this.handleDragLeave(e)}
                  onClick={(e) => this.handleClick(e)}
                >
                  <b>Browse / Drag and Drop</b>
                </div>
                <button
                  type="button"
                  onClick={(e) => this.handleClick(e)}
                  className="primaryBtn w-100 mt-2"
                  size="compact"
                >
                  Upload
                </button>
                <input
                  type="file"
                  id="gallery"
                  onChange={this.addToGallery}
                  style={{ display: 'none' }}
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                  multiple
                />

                {/* <small className="text-secondary">JPEG,JPG,PNG,GIF,DOCX,XLS,MP3,MP4</small> */}
              </div>
            </div>
          </div>
          <div className="row files-preview droppedFiles">
            {this.state.files2.map((f, i) => (
              <div className="col-md-3" key={i}>
                <div className="preview shadow-sm">
                  {f.contenttype == 'pdf' ? (
                    <div
                      onClick={(e) =>
                        this.clickView(f.content_url, f.contenttype)
                      }
                      className="filePreview"
                    >
                      <i
                        className="fa fa-file-pdf-o imageSec_pdf"
                        aria-hidden="true"
                      />
                    </div>
                  ) : null}
                  {f.contenttype == 'docx' ? (
                    <div
                      onClick={(e) =>
                        this.clickView(f.content_url, f.contenttype)
                      }
                      className="filePreview"
                    >
                      <i
                        className="fa fa-file-word-o imageSec_pdf"
                        aria-hidden="true"
                      />
                    </div>
                  ) : null}
                  {f.contenttype == 'xls' || f.contenttype == 'xlsx' ? (
                    <div
                      onClick={(e) =>
                        this.clickView(f.content_url, f.contenttype)
                      }
                      className="filePreview"
                    >
                      <i
                        className="fa fa-file-excel-o imageSec_pdf"
                        aria-hidden="true"
                      />
                    </div>
                  ) : null}

                  {f.contenttype == 'txt' ? (
                    <div
                      onClick={(e) =>
                        this.clickView(f.content_url, f.contenttype)
                      }
                      className="filePreview"
                    >
                      <i
                        className="fa fa-file-text-o imageSec_pdf"
                        aria-hidden="true"
                      />
                    </div>
                  ) : null}

                  {f.contenttype == 'mp4' ? (
                    <div
                      className="filePreview"
                      onClick={(e) =>
                        this.clickView(f.content_url, f.contenttype)
                      }
                    >
                      <i
                        className="fa fa-file-video-o imageSec_pdf"
                        aria-hidden="true"
                      />
                    </div>
                  ) : null}

                  {f.contenttype == 'mp3' ? (
                    <div
                      className="filePreview"
                      onClick={(e) =>
                        this.clickView(f.content_url, f.contenttype)
                      }
                    >
                      <i
                        className="fa fa-file-audio-o imageSec_pdf"
                        aria-hidden="true"
                      />
                      <span className="dropSpan" />
                    </div>
                  ) : null}
                  {f.contenttype == 'png' ||
                  f.contenttype == 'jpeg' ||
                  f.contenttype == 'jpg' ||
                  f.contenttype == 'gif' ? (
                    <div
                      className="filePreview"
                      onClick={(e) =>
                        this.clickView(f.content_url, f.contenttype)
                      }
                    >
                      <img src={f.content_url} />
                    </div>
                  ) : null}
                  {/* <img src={f.content_url !=undefined ? f.content_url : this.state.imgs[i]} /> */}
                  <div
                    className=" preview-close"
                    onClick={(e) => this.removeFile(e, i, 2)}
                  >
                    <button>Remove</button>
                  </div>
                </div>
              </div>
            ))}
            {this.state.fileimgs != undefined &&
              this.state.fileimgs.map((f, i) => (
                <div className="col-md-3" key={i}>
                  <div className="preview shadow-sm">
                    {f.type == 'pdf' ? (
                      <div className="filePreview">
                        <i
                          className="fa fa-file-pdf-o imageSec_pdf"
                          aria-hidden="true"
                        />
                        <span className="dropSpan">{f.img.name}</span>
                      </div>
                    ) : null}
                    {f.type == 'docx' ? (
                      <div className="filePreview">
                        <i
                          className="fa fa-file-word-o imageSec_pdf"
                          aria-hidden="true"
                        />
                        <span className="dropSpan">{f.img.name}</span>
                      </div>
                    ) : null}
                    {f.type == 'xls' || f.type == 'xlsx' ? (
                      <div className="filePreview">
                        <i
                          className="fa fa-file-excel-o imageSec_pdf"
                          aria-hidden="true"
                        />
                        <span className="dropSpan">{f.img.name}</span>
                      </div>
                    ) : null}

                    {f.type == 'txt' ? (
                      <div className="filePreview">
                        <i
                          className="fa fa-file-text-o imageSec_pdf"
                          aria-hidden="true"
                        />
                        <span className="dropSpan">{f.img.name}</span>
                      </div>
                    ) : null}

                    {f.type == 'mp4' ? (
                      <div className="filePreview">
                        <i
                          className="fa fa-file-video-o imageSec_pdf"
                          aria-hidden="true"
                        />
                        <span className="dropSpan">{f.img.name}</span>
                      </div>
                    ) : null}

                    {f.type == 'mp3' ? (
                      <div className="filePreview">
                        <i
                          className="fa fa-file-audio-o imageSec_pdf"
                          aria-hidden="true"
                        />
                        <span className="dropSpan">{f.img.name}</span>
                      </div>
                    ) : null}

                    {f.type == 'png' ||
                    f.type == 'jpeg' ||
                    f.type == 'jpg' ||
                    f.type == 'gif' ? (
                      <div className="filePreview file-preview-img ">
                        <img
                          src={this.state.fileimgs[i].img}
                          ref={this.imgRef}
                          id="uploadImages"
                        />
                      </div>
                    ) : null}

                    {f.type == 'png' ||
                    f.type == 'jpeg' ||
                    f.type == 'jpg' ||
                    f.type == 'gif' ? (
                      <div style={{ display: 'none' }}>
                        <img
                          src={this.state.fileimgs[i].img}
                          ref={this.imgBannerRefHide}
                          id="uploadImagehide"
                          onLoad={this.onGImgLoad}
                        />
                      </div>
                    ) : null}

                    {/* {
                            this.state.type != "xls" && this.state.type != "xlsx" && this.state.type != "txt" && this.state.type != "pdf" && this.state.type != "docx" && this.state.type != "doc" ? <FileViewer fileType={this.state.type} filePath={this.state.imgs[i]} /> : null
                          } */}
                    <div
                      className=" preview-close"
                      onClick={(e) => this.removeFile(e, i)}
                    >
                      <button>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className=" my-4 d-flex justify-content-between align-items-center">
            <span className="text-left text-sm" style={{ fontSize: '8px' }}>
              All fields marked <span className="text-danger">*</span> are
              mandatory
            </span>
            <div className="text-right">
              <button
                className="secondaryBtn"
                onClick={(e) => this.submit(e, 0)}
              >
                Draft
              </button>
              <button
                className="primaryBtn ms-4"
                onClick={(e) => this.submit(e, 1)}
              >
                Publish
              </button>
            </div>
            {/* <Button type="button" variant="primary-outline" className="ml-2" size="big" onClick={(e) => this.review(e)}>Review</Button> */}
          </div>
        </form>
      </div>
    );
  }
}

export default GigRequestTab;
