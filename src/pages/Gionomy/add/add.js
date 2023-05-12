import edjsHTML from 'editorjs-html';
import React from 'react';
import { alertBox, switchLoader } from '../../../commonRedux';
import FileBrowseBanner from '../../../components/FormFields/FileBrowseBanner';
import {
  createGig,
  getCategories,
  getGigEdit,
  getGigDraft,
  getQueryForm,
} from '../../../http/gig-calls';
import { image, video, file, audio } from '../../../config/constants';
import { convertDataToHtml } from '../../../globalFunctions';
import ScrollTabs from '../../../components/ScrollTabs';
import DynamicFields from '../../../components/DynamicFields';

require('./styles.scss');
const coins = require('./coins.json');

class AddGigTab extends React.Component {
  constructor(props) {
    super(props);

    const edjsParser = edjsHTML({
      table: convertDataToHtml,
      checklist: convertDataToHtml,
      image: convertDataToHtml,
      raw: convertDataToHtml,
      warning: convertDataToHtml,
    });
    this.state = {
      id: 0,
      ide: false,
      edjsParser,
      tags: [],
      data: {},
      level: 1,
      dragclass: '',
      parent: '',
      files: [],
      files2: [],
      fileimgs: [],
      features: [{ feature: '', standard: 0, premium: 0 }],
      extras: [{ feature: '', value_one: '', value_two: '' }],
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
      sub_category: '',
      sub_category_id: '',
      format: '',
      standard_days: '',
      premium_days: '',
      standard_price: '',
      premium_price: '',
      fast_days: '',
      fast_price: '',
      desc: '',
      gallery: [],
      loading: true,
      type: '',
      banner_image: null,
      selectedcurrency: [],
      selectedsub_category: [],
      selectedformat: [],
      options_currency: [],
      price_extra: [],
      deliveryTimevisible: true,
      fastDeliveryvisible: true,
      gallery_dimensions: {},
      banner_dimensions: {},
      removedFiles: [],
      tagInput: '',
      fields_show: false,
      format_fields: [],
      dynamic_fields: [],
      meta_store_data: [],
      checkerror: false,
      db_sub_category: '',
      db_sub_category_id: '',
      db_category: '',
      categorychanged: 0,
    };
    this.tagRef = React.createRef();

    this.editor = React.createRef();
    this.reactTags = React.createRef();
    this.imgRef = React.createRef();
    this.imgBannerRef = React.createRef();
    this.imgBannerRefHide = React.createRef();
    this.onImgLoad = this.onImgLoad.bind(this);
    this.GalleryImag = this.onGImgLoad.bind(this);
  }

  onDelete(i) {
    const temp = this.state.tags;
    temp.splice(i, 1);
    this.setState({ tags: temp });
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
    temp.push({ feature: '', standard: 0, premium: 0 });
    this.setState({
      features: temp,
    });
  };

  addPrice = (e) => {
    e.preventDefault();
    const temp = this.state.price_extra;
    temp.push({ pay_currency: '', standard_amount: '', premium_amount: '' });
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
    if (this.props.id != undefined && this.props.id != null) {
      this.getData();
    } else {
      this.setState({
        loading: false,
      });
    }
    // coins
    const options_coins = [];

    this.state.coins.map((item) => {
      const valobjcurr = { cat: 'Group 1', key: item.currencySymbol };
      options_coins.push(valobjcurr);
    });
    this.setState({
      options_currency: options_coins,
    });
    this.getGigCategories(1);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.id != prevProps.id &&
      this.props.id != undefined &&
      this.props.id != null
    ) {
      this.getData();
    }
  }

  getData = () => {
    getGigEdit({ id: this.props.id, page: 'edit' }).then(
      (resp) => {
        try {
          this.setState(
            {
              sub_category: resp.subCategory,
              sub_category_id: resp.subCategoryId,
              db_sub_category: resp.subCategory,
              db_sub_category_id: resp.subCategoryId,
              db_category: resp.category,
              parent: resp.categoryId,
              level: 2,
            },
            () => {
              this.getGigCategories(2);
              this.getQueryForm(resp.subCategoryId);
            }
          );
          const meta_store_data = [];
          resp.metadata.length > 0 &&
            resp.metadata.map((it) => {
              meta_store_data.push({
                title: it.title,
                checkedvalues: it.checkedvalues,
                other_val: it.other_val,
                sub_category_id: resp.subCategoryId,
                db_sub_category_id: resp.subCategoryId,
              });
            });

          this.setState(
            {
              title: resp.subject,
              format: resp.format,
              currency: resp.preferedCurrency,
              // banner_image:resp.banner,
              edit_image: resp.banner,
              banner_image: resp.banner,
              desc: resp.text,
              dynamic_fields: resp.dynamic_fields,
              service: resp.service,
              meta_store_data,
              // data: edc,
              tags:
                resp.hashtags == undefined ||
                resp.hashtags[0] == undefined ||
                resp.hashtags[0] == ''
                  ? []
                  : resp.hashtags,
              extras: resp.extras,
              standard_days: resp.standardDays,
              premium_days: resp.premiumDays,
              standard_price: resp.standardPrice,
              premium_price: resp.premiumPrice,
              fast_days: resp.fastDays,
              fast_price: resp.fastPrice,
              features: resp.features,
              category: resp.category,
              category_id: resp.categoryId,
              sub_category: resp.subCategory,
              sub_category_id: resp.subCategoryId,
              files2: resp.contents,
              // selectedsub_category: op_cur,
              // selectedformat: op_file,
              price_extra:
                typeof resp.price_extra === 'object' ? resp.price_extra : [],
            },
            () => {
              setTimeout(() => {
                this.setState({
                  loading: false,
                });
                // this.getGigCategories(2);
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
        this.setState({
          loading: false,
        });
      }
    );
  };

  getDraft = () => {
    getGigDraft().then(
      (resp) => {
        const edc = JSON.parse(resp.editorContent);
        this.setState(
          {
            id: resp._id,
            title: resp.subject,
            format: resp.format,
            currency: resp.preferedCurrency,
            // desc: resp.text,
            data: edc,
            edit_image: resp.banner,
            banner_image: resp.banner,
            tags:
              resp.hashtags == undefined ||
              resp.hashtags[0] == undefined ||
              resp.hashtags[0] == ''
                ? []
                : resp.hashtags,
            extras: resp.extras,
            standard_days: resp.standardDays,
            premium_days: resp.premiumDays,
            standard_price: resp.standardPrice,
            premium_price: resp.premiumPrice,
            fast_days: resp.fastDays,
            fast_price: resp.fastPrice,
            features: resp.features,
            category: resp.category,
            category_id: resp.categoryId,
            sub_category: resp.subCategory,
            sub_category_id: resp.subCategoryId,
            files2: resp.contents,
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
        this.setState({
          loading: false,
        });
      }
    );
  };

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

  handleInput = (e, str, value) => {
    let val = e.target.value;
    const { name } = e.target;
    if (str == undefined || str == '') {
      if (
        name === 'standard_price' ||
        name === 'premium_price' ||
        name === 'standard_days' ||
        name === 'premium_days' ||
        name === 'fast_days' ||
        name === 'fast_price'
      ) {
        if (val === 0 || val === '0') {
          alertBox(true, 'Value must be greater than zero');
        } else {
          this.setState({
            [name]: val,
          });
        }
      }
      if (name === 'currency') {
        const find_same_currency = this.state.price_extra.filter(
          (i) => i != null && i.pay_currency === val
        );
        if (find_same_currency.length > 0) {
          alertBox(true, 'Please choose other currency,Already have the price');
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
      if (name === 'title') {
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
              'Only letters, number, hyphen, underscore, dot, commas, colons, semicolons, and, slash, parenthesis'
            );
          }
        }
        this.setState({
          [name]: val,
        });
      } else {
        this.setState({
          [name]: val,
        });
      }
    } else {
      const temp = this.state.dynamic_fields;
      const find_name = temp.findIndex((e) => e.field_name == name);
      if (find_name != -1) {
        const previous_data = temp[find_name];
        console.log(previous_data, 'previous_data', str);
        if (str == 'check_extra') {
          let pre_check_list = '';
          if (previous_data.field_value != '') {
            const map_pre = previous_data.field_value.split(',');
            const fin_map = map_pre.findIndex((chk_val) => chk_val == value);
            if (fin_map == -1) {
              pre_check_list = `${previous_data.field_value},${value}`;
            } else {
              map_pre.splice(fin_map, 1);
              pre_check_list = map_pre.join(',');
            }
          } else {
            pre_check_list = value;
          }
          temp[find_name] = { field_name: name, field_value: pre_check_list };
        } else if (str == 'radio_extra') {
          temp[find_name] = { field_name: name, field_value: value };
        } else {
          temp[find_name] = { field_name: name, field_value: val };
        }
      }
      // temp[find_name] = {field_name:name,field_value:val};
      this.setState({ dynamic_fields: temp });
    }
  };

  setStateFunc = (key, value) => {
    this.setState({ [key]: value });
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
      let v = val.split('^');
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

      // get category query
      v = val.split('^');
      this.getQueryForm(v[0]);
      this.setState({ categorychanged: 1 });
    }
  };

  getQueryForm = (val) => {
    getQueryForm({ subcategory: val }).then((resp) => {
      if (resp != '' && resp.format_fields !== undefined) {
        const dynamic_data = [];
        resp.format_fields.length > 0 &&
          resp.format_fields.map((it) => {
            if (it.input_extra == true) {
              dynamic_data.push({
                field_name: it.input_label_name,
                field_value: '',
              });
            }
          });
        const meta_store_data = [];
        resp.metadata.length > 0 &&
          resp.metadata.map((it) => {
            console.log(it, 'it');
            let checkedvalues_oth = '';
            if (it.type == 'Checkbox') {
              checkedvalues_oth = '';
            } else {
              // var checkedvalues_oth = "other";
              checkedvalues_oth = '';
            }
            meta_store_data.push({
              title: it.title,
              checkedvalues: checkedvalues_oth,
              other_val: '',
              sub_category_id: this.state.sub_category_id,
              db_sub_category_id: this.state.db_sub_category_id,
            });
          });
        if (
          (this.props.id != '' && this.props.id == undefined) ||
          this.state.db_sub_category_id != this.state.sub_category_id
        ) {
          this.setState({
            meta_store_data,
            dynamic_fields: dynamic_data,
          });
        }
        this.setState({
          format_fields: resp.format_fields,
          metadata: resp.metadata,
          category_service:
            resp.service != undefined ? resp.service.split(',') : [],
          category_service_heading: resp.serviceheading,
          fields_show: true,
        });
      } else {
        if (resp.message && resp.message !== undefined) {
          alertBox(true, resp.message);
        }
        this.setState({ fields_show: false });
      }
    });
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

  submit = async (e, t) => {
    e.preventDefault();
    // var edata = await this.editor.save();
    const err = [];

    const find_same_currency =
      this.state.price_extra !== undefined
        ? this.state.price_extra.filter(
            (i) => i != null && i.pay_currency === this.state.currency
          )
        : [];

    if (find_same_currency.length > 0) {
      err.push('Please choose other currency,Already have the price');
    }

    if (this.state.currency == '' || this.state.currency.trim().length == 0) {
      err.push('Currency is required');
    }
    // var feature_length = this.state.features.filter((i) => i != null && (i.feature.length > 100));
    // if (feature_length.length > 0) {
    //   err.push("Feature must be with in 100 charectors");
    // }

    // var extra_length = this.state.extras.filter((i) => i != null && (i.feature.length > 100 || i.value_one.length > 100 || i.value_two.length > 100));
    // if (extra_length.length > 0) {
    //   err.push("Feature or text must be with in 100 charectors");
    // }

    const meta_data_chk =
      this.state.meta_store_data !== undefined
        ? this.state.meta_store_data.filter(
            (i) =>
              i != null &&
              i.checkedvalues == '' &&
              i.other_val !== undefined &&
              i.other_val == ''
          )
        : [];
    if (meta_data_chk.length > 0) {
      console.log(meta_data_chk, 'meta_data_chk');
      meta_data_chk.map((ers) => {
        err.push(`${ers.title} Meta data must be required`);
      });
    }
    // check other
    let error_metadata = 0;
    let error_otherdata = 0;
    const meta_store_data_stae = this.state.meta_store_data;
    meta_store_data_stae.map((items) => {
      // error_metadata = 0;
      // error_otherdata = 0;
      const check_val = items.checkedvalues.split(',');
      const other_chk = check_val.findIndex((e) => e == 'other');
      // return false;
      if (
        (other_chk >= 0 && items.checkedvalues != 'other') ||
        (items.other_val != '' && other_chk == -1)
      ) {
        err.push(
          'Please choose any one of metadata or choose other & enter other details'
        );
        error_metadata = 1;
        error_otherdata = 1;
      }

      const meta_data_chk_other =
        this.state.meta_store_data !== undefined
          ? this.state.meta_store_data.filter(
              (i) =>
                i != null &&
                i.checkedvalues == 'other' &&
                i.other_val !== undefined &&
                i.other_val == ''
            )
          : [];

      if (
        meta_data_chk_other.length > 0 ||
        (other_chk >= 0 && items.other_val == '')
      ) {
        err.push(
          'Please choose any one of metadata or choose other & enter other details'
        );
      }
    });

    const dynamic_fields_chk =
      this.state.dynamic_fields !== undefined
        ? this.state.dynamic_fields.filter(
            (i) => i != null && i.field_value == ''
          )
        : [];
    if (dynamic_fields_chk.length > 0) {
      err.push(`${dynamic_fields_chk[0].field_name} must be required`);
    }

    const find_zero_val =
      this.state.price_extra !== undefined
        ? this.state.price_extra.filter(
            (i) =>
              i != null &&
              (i.standard_amount == '0' ||
                i.premium_amount == '0' ||
                parseInt(i.standard_amount) < 0 ||
                parseInt(i.premium_amount) < 0)
          )
        : [];

    if (find_zero_val.length > 0) {
      err.push('Amount must be greater than zero');
    }
    if (!this.state.standard_price) {
      err.push('Standard price is required');
    }
    if (
      this.state.standard_price == '0' ||
      this.state.standard_price === 0 ||
      parseInt(this.state.standard_price) < 0
    ) {
      err.push('Standard price must be greater than zero');
    }
    if (!this.state.premium_price) {
      err.push('Premium price is required');
    }
    if (
      this.state.premium_price == '0' ||
      this.state.premium_price === 0 ||
      parseInt(this.state.premium_price) < 0
    ) {
      err.push('Premium price must be greater than zero');
    }
    if (!this.state.fast_price) {
      err.push('Fast price is required');
    }
    if (
      this.state.fast_price == '0' ||
      this.state.fast_price === 0 ||
      parseInt(this.state.fast_price) < 0
    ) {
      err.push('Fast price must be greater than zero');
    }
    if (!this.state.standard_days) {
      err.push('Standard Days is required');
    }
    if (
      this.state.standard_days == '0' ||
      this.state.standard_days === 0 ||
      parseInt(this.state.standard_days) < 0
    ) {
      err.push('Standard Days must be greater than zero');
    }
    if (!this.state.premium_days) {
      err.push('Premium Days is required');
    }
    if (
      this.state.premium_days == '0' ||
      this.state.premium_days === 0 ||
      parseInt(this.state.premium_days) < 0
    ) {
      err.push('Premium Days must be greater than zero');
    }

    if (
      this.state.fast_days == '0' ||
      this.state.fast_days === 0 ||
      parseInt(this.state.fast_days) < 0
    ) {
      err.push('Fast Days must be greater than zero');
    }

    if (this.state.title === '' || this.state.title.trim() === '') {
      err.push('Title is required');
    }
    const regex = /^[a-zA-Z0-9-_.,&()/:;\s]+$/;
    if (this.state.title.search(regex) === -1) {
      err.push(
        'Only letters, number, hyphen, underscore, dot, commas, colons, semicolons, and, slash, parenthesis'
      );
    }
    if (this.state.title.length > 80 || this.state.title.length < 4) {
      err.push('Title is required with in 4 to 80 charecters ');
    }
    if (this.state.category == '') {
      err.push('Category is required');
    }
    if (this.state.sub_category == '' || this.state.sub_category.length === 0) {
      err.push('Sub Category is required');
    }
    // if (this.state.format == '' || this.state.format.length === 0) {
    //   err.push("File Format is required");
    // }
    // if (edata.blocks.length <= 0) {
    //   err.push("About content is required");
    // }

    if (this.state.desc == '' || this.state.desc.trim().length == 0) {
      err.push('About content is required');
    }

    if (this.state.files.length == 0 && this.state.files2.length == 0) {
      err.push('Gallery image is required');
    }
    if (this.state.banner_image == null || this.state.banner_image == '') {
      err.push('Banner image is required');
    }
    let index = 0;
    this.state.tags.forEach((tagitem) => {
      index++;
      if (tagitem.length > 50 && index == this.state.tags.length) {
        err.push('Keywords Tag must be with in 50 charectors');
      }
    });
    if (this.state.tags.length > 30) {
      err.push('Keywords Tag must be with in 30 Tags');
    }

    // if(this.state.banner_dimensions !== undefined){
    //   var banner_img_size = this.state.banner_dimensions;
    //   if(banner_img_size.width < 200 && banner_img_size.height < 200){
    //     err.push("Banner Image must be with in 1500px to 200 px (width & height)");
    //   }
    // }

    // if(this.state.gallery_dimensions !== undefined){
    //   var gallery_img_size = this.state.gallery_dimensions;
    //   if(gallery_img_size.width < 200 && gallery_img_size.height < 200){
    //     err.push("Gallery Image must be with in 1500px to 200 px (width & height)");
    //   }
    // }
    let status = '';
    if (t == 1) {
      status = 'active';
    } else {
      status = 'draft';
    }
    if (err.length > 0) {
      if (err.length > 5) {
        alertBox(true, 'Please enter all the mandatory fields');
      } else {
        const errs = Array.from(new Set(err));
        alertBox(true, errs.join(','));
      }
    } else {
      let hashtags = '';
      // var data = this.state.edjsParser.parse(edata);

      // data = data.join(" ");
      if (this.state.tags.length > 0) {
        hashtags = this.state.tags.join(',');
      } else {
        hashtags = '';
      }

      // // if (this.state.sub_category.length > 0) {
      // //   var sub_category = this.state.sub_category.join(",");
      // // } else {
      // //   var sub_category = '';
      // // }

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

      // if (this.state.format.length > 0) {
      //   var format = this.state.format.join(",");
      // } else {
      //   var format = '';
      // }

      const banner_images = this.state.banner_image;

      const formData = {
        status,
        subject: this.state.title,
        category: this.state.category,
        category_id: this.state.category_id,
        sub_category: this.state.sub_category,
        sub_category_id: this.state.sub_category_id,
        // format: format,
        currency: this.state.currency,
        standard_price: this.state.standard_price,
        premium_price: this.state.premium_price,
        standard_days: this.state.standard_days,
        premium_days: this.state.premium_days,
        features: JSON.stringify(this.state.features),
        extras: JSON.stringify(this.state.extras),
        price_extra: JSON.stringify(this.state.price_extra),
        metadata: JSON.stringify(this.state.meta_store_data),
        service: this.state.service,
        dynamic_fields: JSON.stringify(this.state.dynamic_fields),
        fast_days: this.state.fast_days,
        fast_price: this.state.fast_price,
        hashtags,
        // text: data,
        text: this.state.desc,
        // editorContent: JSON.stringify(edata),
        editorContent: this.state.desc,
        files: this.state.files,
        files2: this.state.files2,
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
      // return false;
      switchLoader('Your post is being updated...');
      createGig(formData).then(
        async (resp) => {
          if (t == 1) {
            window.location.href = '/passionomy/dashboard';
            // this.props.history.push("/passionomy/seller")
          } else {
            this.props.history.push(`/passionomy/gig/edit/${resp.post.slug}`);
            alertBox(true, 'Draft has been saved!', 'success');
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
      fileType = getExt.replace('.', '');

      if (element.size > 2000000) {
        alertBox(true, 'Please upload the attachment less than 2 MB');
        return;
      }
      if (
        image.indexOf(`.${fileType}`) == -1 &&
        video.indexOf(`.${fileType}`) == -1 &&
        file.indexOf(`.${fileType}`) == -1 &&
        audio.indexOf(`.${fileType}`) == -1
      ) {
        alertBox(true, 'Please select valid file');
        return;
      }
      // if (! element.type.match('image*') && !element.type.match('video*') && !element.type.match('audio*') && !element.type.match('pdf*') && !element.type.match('xls*')) {
      //   alertBox(true, "Please select valid file");
      //   return;
      // }
    }
    // var temp = [...this.state.files, ...files];
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
  };

  clearDatas = (params) => {
    this.setState({
      params,
    });
  };

  handleBannerFile = (name, type, value) => {
    this.setState(
      {
        [name]: value,
      },
      () => {
        const reader = new FileReader();
        const image = document.getElementById(`${name}_preview`);
        // it's onload event and you forgot (parameters)
        const image_hide = document.getElementById(`${name}_preview_hide`);
        reader.onload = function (e) {
          image.src = e.target.result;
          image_hide.src = e.target.result;
        };
        reader.readAsDataURL(value);
      }
    );
  };

  onImgLoad = ({ target: img }) => {
    const img_width = img.width;
    const img_height = img.height;
    // if (img_width < 200 || img_height < 200) {
    //   alertBox(true, "Please upload the image should be 1500px X 200px (width X height)");
    //   return this.setState({ banner_dimensions: { width: img.width, height: img.height }, banner_image: "" });

    // } else {
    //   return this.setState({ banner_dimensions: {} });

    // }
    return this.setState({ banner_dimensions: {} });
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

  handleBannerRemove = (e) => {
    const name = e.target.getAttribute('name');
    console.log('hire', name);
    this.setState({
      [name]: null,
    });
  };

  removeFile = (e, i, n = 1) => {
    let temp;
    e.preventDefault();
    const removedFiles = [];

    if (n === 2) {
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

  removeItem(name, value) {
    const selectval = [];
    value.map((item) => {
      selectval.push(item.key);
    });
    if (name == 'sub_category') {
      const selectcat = [];
      value.map((item) => {
        selectcat.push(item.cat);
      });
      // this.setState({ sub_category_id: selectcat })
    }
    this.setState({
      [name]: selectval,
      [`selected${name}`]: value,
    });
  }

  handlemeta = (i, e, category) => {
    const { name } = e.target;
    const temp = this.state.meta_store_data;
    let data_get;
    let other_val;
    // this.setState({checkerror:false})
    const find_name = temp.findIndex((e) => e.title == category);
    if (find_name != -1) {
      data_get = temp[find_name];
      let pre_check_list = data_get.checkedvalues;
      other_val = data_get.other_val;
      if (
        name != `${category}_other` &&
        e.target.type != 'radio' &&
        e.target.type != 'select-one'
      ) {
        if (pre_check_list != '') {
          const map_pre = pre_check_list.split(',');
          const fin_map = map_pre.findIndex((chk_val) => chk_val == name);
          if (fin_map == -1) {
            pre_check_list = `${pre_check_list},${name}`;
          } else {
            map_pre.splice(fin_map, 1);
            pre_check_list = map_pre.join(',');
          }
        } else {
          pre_check_list = name;
        }
      }

      if (name != `${category}_other` && e.target.type == 'radio') {
        data_get = temp[find_name];
        pre_check_list = e.target.value;
      }

      if (name != `${category}_other` && e.target.type == 'select-one') {
        pre_check_list = e.target.value;
      }
      other_val;
      if (name == `${category}_other`) {
        other_val = e.target.value;
      } else {
        other_val = data_get.other_val;
      }

      temp[find_name] = {
        title: category,
        checkedvalues: pre_check_list,
        other_val,
      };
    }
    this.setState({ meta_store_data: temp });
  };

  handlePrice = (i, e) => {
    const temp = this.state.price_extra;
    const { name } = e.target;
    const val = e.target.value;
    let err = 0;
    if (name == 'pay_currency') {
      const find_same_currency = temp.filter(
        (i) =>
          i != null && (i.pay_currency == val || this.state.currency == val)
      );
      if (find_same_currency.length > 0) {
        err = 1;
        temp[i].pay_currency = '';
        this.setState({ price_extra: temp });
        alertBox(true, 'Please choose other currency,Already have the price');
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

  clickView = (urlattach, urltype) => {
    let pdfWindow;
    pdfWindow = window.open(
      `/passionomy/preview/${encodeURIComponent(urlattach)}/${urltype}`,
      'pdfWindow',
      'width=1000, height=1000'
    ); // Opens a new window
  };

  handleTagKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.target.value !== '' && e.target.value.trim() !== '') {
        const regex = /^[a-zA-Z]+$/;
        if (e.target.value.search(regex) === -1) {
          alertBox(true, 'Only allow alphabets');
        } else {
          const tags = [].concat(this.state.tags, e.target.value);
          this.setState({ tags });
          this.tagRef.current.value = '';
        }
      }
    }

    // this.onAddition(e.target.value);
  }

  render() {
    return (
      <div className="container my-wall-container  add-gigs-page">
        <div className="row ">
          <header className="d-flex mt-4 mt-md-3 justify-content-between align-items-center">
            <div className="col-md-9 pe-md-4">
              <h1>
                {this.props.match.params.id !== undefined ? 'Edit' : 'Add'} your
                gig
              </h1>
              <p className=" page-desc">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
              </p>
            </div>
            <div className="d-none col-md-3 d-sm-flex justify-content-end">
              <button
                className="secondaryBtn"
                onClick={(e) => this.submit(e, 0)}
              >
                Save Draft
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
                  {`Gig's Title`}
                  <span className="required text-danger">*</span>{' '}
                  <div className="info-pop d-inline-block d-sm-none ">
                    <a>
                      <i className="fa fa-info-circle" />{' '}
                      <p className=" shadow-sm">
                        As your Gig storefront, your title is the most important
                        place to include keywords that buyers would likely use
                        to search for a service like yours
                      </p>
                    </a>
                  </div>
                </h4>

                <p className="d-none d-sm-block">
                  As your Gig storefront, your title is the most important place
                  to include keywords that buyers would likely use to search for
                  a service like yours
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
                  Category<span className="required text-danger">*</span>
                  <div className="info-pop d-inline-block d-sm-none ">
                    <a>
                      <i className="fa fa-info-circle" />{' '}
                      <p className=" shadow-sm">Select Category</p>
                    </a>
                  </div>
                </h4>
                <p className="d-none d-sm-block">Select Category</p>
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
                {this.state.level2.length > 0 &&
                  this.state.level2.map((c, k) => (
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
          {this.state.fields_show &&
            this.state.format_fields.map((fields, i) => (
              <>
                {fields.input_name == 'file' &&
                fields.input_label_name == 'Banner' ? (
                  <div
                    className={
                      i == '0' ? "'row my-2 my-sm-5'" : 'row my-2 my-sm-5 mt-3'
                    }
                  >
                    {' '}
                    <div className="col-md-6 input-block">
                      <div className="clearfix">
                        <h4>
                          Banner
                          <span className="required text-danger">*</span>{' '}
                          <div className="info-pop d-inline-block d-sm-none ">
                            <a>
                              <i className="fa fa-info-circle" />{' '}
                              <p className=" shadow-sm">
                                Add banner image to your gig
                              </p>
                            </a>
                          </div>
                        </h4>
                        <p className="d-none d-sm-block">
                          Add banner image to your gig
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
                            this.state.banner_image != ''
                              ? this.state.banner_image
                              : ''
                          }
                          accept="image"
                          onClick={(event) => {
                            event.target.value = null;
                          }}
                        />
                        <div style={{ display: 'none' }}>
                          <img
                            id="banner_image_preview_hide"
                            onLoad={this.onImgLoad}
                          />
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
                ) : null}
                {/* Service  */}
                {fields.servicedata ? (
                  // console.log(fields.servicedata['0'].serviceheading,"ts")
                  <div className="row my-2 my-sm-5 mt-3 ">
                    <div className="col-md-6 input-block">
                      <div className="clearfix">
                        <h4>
                          Service type {fields.servicedata['0'].serviceheading}
                          <span className="required text-danger">*</span>
                        </h4>
                        <p />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <select
                        type="text"
                        placeholder="I will help you for..."
                        name="service"
                        className="new-form-control w-100"
                        onChange={(e) => this.handleInput(e, '')}
                      >
                        <option value="">Select a service type</option>
                        {fields.servicedata['0'].servicecontent != '' &&
                          fields.servicedata['0'].servicecontent
                            .split(',')
                            .map((c, i) => (
                              <option
                                key={i}
                                value={c}
                                selected={c == this.state.service}
                              >
                                {c}
                              </option>
                            ))}
                      </select>
                    </div>
                  </div>
                ) : null}
                {/* Meta Data */}
                {fields.metadata ? (
                  <div className="row my-2 my-sm-5 mt-3 ">
                    <div className="col-md-6 input-block">
                      <div className="clearfix">
                        <h4>
                          Gigs Metadata
                          <span className="required text-danger">*</span>
                          <div className="info-pop d-inline-block d-sm-none ">
                            <a>
                              <i className="fa fa-info-circle" />{' '}
                              <p className=" shadow-sm">
                                Select the required metadata for your gig
                              </p>
                            </a>
                          </div>
                        </h4>
                        <p className="d-none d-sm-block">
                          Select the required metadata for your gig
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="clearfix">
                        <ScrollTabs
                          {...this.state}
                          data={fields.metadata}
                          removedpre={this.state.removedpre}
                          value={this.state.meta_store_data}
                          handlemeta={this.handlemeta}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
                {/* About */}
                {fields.input_name == 'about' &&
                fields.input_label_name == 'About' ? (
                  <div className="row my-2 my-sm-5 mt-3">
                    <div className="col-md-6 input-block">
                      <div className="clearfix">
                        <h4>
                          About<span className="required text-danger">*</span>
                          <div className="info-pop d-inline-block d-sm-none ">
                            <a>
                              <i className="fa fa-info-circle" />{' '}
                              <p className=" shadow-sm">
                                Enter Brief description for your gig
                              </p>
                            </a>
                          </div>
                        </h4>
                        <p className="d-none d-sm-block">
                          Enter Brief description for your gig
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className=" clearfix">
                        {/* {
                this.state.loading ?
                  <Spinner />
                  : <EditorJs instanceRef={instance => { this.editor = instance }} data={this.state.data} tools={EDITOR_JS_TOOLS} />} */}

                        <textarea
                          className="new-form-control"
                          rows={4}
                          name="desc"
                          placeholder="Write something about your gig"
                          onChange={this.handleInput}
                          value={this.state.desc}
                        >
                          {this.state.desc}
                        </textarea>
                      </div>
                    </div>
                  </div>
                ) : null}
                {/* Tags */}
                {fields.input_name == 'tags' &&
                fields.input_label_name == 'Tags' ? (
                  <div className="row my-2 my-sm-5 ">
                    <div className="col-md-6 input-block">
                      <div className="clearfix">
                        <h4>
                          Tags{' '}
                          <div className="info-pop d-inline-block d-sm-none ">
                            <a>
                              <i className="fa fa-info-circle" />{' '}
                              <p className=" shadow-sm">
                                Add the important tags for your gigs
                              </p>
                            </a>
                          </div>
                        </h4>
                        <p>Add the important tags for your gigs</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className=" clearfix">
                        <div className="tags-block">
                          <div className="">
                            {this.state.tags.map((tag, i) => (
                              <span key={i}>
                                {tag}{' '}
                                <i
                                  className="fa fa-times"
                                  onClick={() => this.onDelete(i)}
                                />
                              </span>
                            ))}
                          </div>
                          <input
                            onKeyDown={this.handleTagKeyDown.bind(this)}
                            ref={this.tagRef}
                            type="text"
                            placeholder="Enter tags"
                            name="title"
                            className="new-form-control w-100"
                          />
                        </div>
                        <small className="pt-1 text-secondary pull-right">
                          30 max
                        </small>
                      </div>
                    </div>
                  </div>
                ) : null}
                {/* Pricing */}
                {fields.input_name == 'pricing' &&
                fields.input_label_name == 'Pricing' ? (
                  <div className="row my-2 my-sm-5 ">
                    <div className="col-md-6 input-block">
                      <div className="clearfix">
                        <h4>
                          Pricing
                          <span className="required text-danger">*</span>
                        </h4>
                      </div>
                    </div>
                    <div className="input-pricing">
                      <div className="row">
                        <div className="col-6 input-block">
                          <p>
                            Add different pricing for different features for you
                            gig
                          </p>
                        </div>
                        <div className="col-6">
                          <div className="row">
                            <div className="col-6">
                              <h5 className="price-heading">Standard</h5>
                            </div>
                            <div className="col-6">
                              <h5 className="price-heading">Premium</h5>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row currency-block my-2 mt-md-4 ">
                        <div className="col-6 input-block">
                          <select
                            type="text"
                            placeholder="I will help you for..."
                            name="currency"
                            className="new-form-control w-100"
                            onChange={this.handleInput}
                          >
                            <option value="">Choose currency</option>
                            {this.state.coins.map((e, i) => (
                              // return <option value={e.currencySymbol} selected={e.currencySymbol == this.state.currency}>{e.currencyName + " (" + e.currencySymbol + ")"}</option>
                              <option
                                key={i}
                                value={e.currencySymbol}
                                selected={
                                  e.currencySymbol == this.state.currency
                                }
                              >
                                {e.currencySymbol}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-6">
                          <div className="row">
                            <div className="col-6">
                              <input
                                type="number"
                                required
                                placeholder="Enter amount"
                                className="new-form-control w-100"
                                step="any"
                                min="0"
                                name="standard_price"
                                value={this.state.standard_price}
                                onChange={this.handleInput}
                              />
                            </div>
                            <div className="col-6">
                              <input
                                type="number"
                                required
                                placeholder="Enter amount"
                                className="new-form-control w-100"
                                step="any"
                                min="0"
                                name="premium_price"
                                value={this.state.premium_price}
                                onChange={this.handleInput}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {this.state.price_extra &&
                        this.state.price_extra.map(
                          (data, i) =>
                            data != null && (
                              <div className="row currency-block my-4" key={i}>
                                <div className="col-6 input-block d-flex">
                                  <select
                                    type="text"
                                    placeholder="I will help you for..."
                                    name="pay_currency"
                                    className="new-form-control w-100"
                                    value={
                                      this.state.price_extra[i].pay_currency
                                    }
                                    onChange={(e) => this.handlePrice(i, e)}
                                  >
                                    <option value="">Choose currency</option>
                                    {this.state.coins.map((e, i) => (
                                      // return <option value={e.currencySymbol} selected={e.currencySymbol == this.state.currency}>{e.currencyName + " (" + e.currencySymbol + ")"}</option>
                                      <option
                                        key={i}
                                        value={e.currencySymbol}
                                        selected={
                                          e.currencySymbol ==
                                          this.state.currency
                                        }
                                      >
                                        {e.currencySymbol}
                                      </option>
                                    ))}
                                  </select>
                                  <div className="ms-2 d-flex justify-content-center align-items-center">
                                    <a
                                      className="close-cross"
                                      onClick={() => this.removePrice(i)}
                                    >
                                      <i className="fa fa-minus" />
                                    </a>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="row">
                                    <div className="col-6">
                                      <input
                                        type="number"
                                        placeholder="Enter amount"
                                        step="any"
                                        min="0"
                                        name="standard_amount"
                                        className="new-form-control w-100"
                                        value={
                                          this.state.price_extra[i]
                                            .standard_amount
                                        }
                                        onChange={(e) => this.handlePrice(i, e)}
                                        required
                                      />
                                    </div>
                                    <div className="col-6">
                                      <input
                                        type="number"
                                        placeholder="Enter amount"
                                        step="any"
                                        min="0"
                                        name="premium_amount"
                                        className="new-form-control w-100"
                                        onChange={(e) => this.handlePrice(i, e)}
                                        required
                                        value={
                                          this.state.price_extra[i]
                                            .premium_amount
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                        )}
                      <div className="row text-block my-4">
                        <div className="col-6 input-block">
                          <h5 className="text-header">Delivery time</h5>
                        </div>
                        <div className="col-6">
                          <div className="row">
                            <div className="col-6">
                              <input
                                type="number"
                                placeholder="Enter days"
                                step="any"
                                min="0"
                                name="standard_days"
                                className="new-form-control w-100"
                                value={this.state.standard_days}
                                onChange={this.handleInput}
                                required
                              />
                            </div>
                            <div className="col-6">
                              <input
                                type="number"
                                placeholder="Enter days"
                                className="new-form-control w-100"
                                step="any"
                                min="0"
                                name="premium_days"
                                onChange={this.handleInput}
                                value={this.state.premium_days}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row text-block my-4">
                        <div className="col-6 input-block">
                          <h5 className="text-header">Fast delivery</h5>
                        </div>
                        <div className="col-6">
                          <div className="row">
                            <div className="col-6">
                              <input
                                type="number"
                                placeholder="Enter days"
                                className="new-form-control w-100"
                                step="any"
                                min="0"
                                name="fast_days"
                                value={this.state.fast_days}
                                onChange={this.handleInput}
                                required
                              />
                            </div>
                            <div className="col-6">
                              <input
                                type="number"
                                placeholder="Enter Price"
                                className="new-form-control w-100"
                                step="any"
                                min="0"
                                name="fast_price"
                                onChange={this.handleInput}
                                value={this.state.fast_price}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex">
                        <button
                          className="ms-auto  primaryBtn"
                          onClick={(e) => this.addPrice(e)}
                        >
                          Add another currency{' '}
                          <i className="fa fa-plus-circle" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
                {/* For Dynamic New fields (Text box) */}
                {fields.input_extra == true ? (
                  <DynamicFields
                    inputdata={fields}
                    values={this.state.dynamic_fields}
                    handleInput={this.handleInput}
                    id={this.props.id}
                    setStateFunc={this.setStateFunc}
                  />
                ) : null}
                {/* Gallery */}
                {fields.input_name == 'gallery' ? (
                  <>
                    <div className="row my-5 gallery-block">
                      <div className="col-md-6 input-block">
                        <div className="clearfix">
                          <h4>
                            Gallery
                            <span className="required text-danger">*</span>
                            <div className="info-pop d-inline-block d-sm-none ">
                              <a>
                                <i className="fa fa-info-circle" />{' '}
                                <p className=" shadow-sm">
                                  Select an awesome work image for your gig and
                                  make sure to use banner size
                                </p>
                              </a>
                            </div>
                          </h4>
                          <p className="d-none d-sm-block">
                            Select an awesome work image for your gig and make
                            sure to use banner size
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
                            {f.contenttype == 'xls' ||
                            f.contenttype == 'xlsx' ? (
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
                            <div className=" preview-close">
                              <button onClick={(e) => this.removeFile(e, i, 2)}>
                                Remove
                              </button>
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
                              <div className=" preview-close">
                                <button onClick={(e) => this.removeFile(e, i)}>
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                ) : null}
              </>
            ))}

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
                Save Draft
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

export default AddGigTab;
