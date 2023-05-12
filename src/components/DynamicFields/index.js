import React from 'react';
import './style.scss';

class DynamicFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: props.inputdata,
      dynamic_fields: props.values,
    };
  }

  componentDidMount() {
    this.state.dynamic_fields.map((fields_data) => {
      const { fields } = this.state;
      if (fields.input_label_name == fields_data.field_name && this.props.id) {
        fields.value = fields_data.field_value;
        this.setState({ fields });
        // this.props.setStateFunc("dynamic_fields",fields)
      }
    });
  }

  handleInput = (e, str, value) => {
    const val = e.target.value;
    const { name } = e.target;
    const temp = this.state.dynamic_fields;
    const find_name = temp.findIndex((e) => e.field_name == name);
    if (find_name != -1) {
      const previous_data = temp[find_name];
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
    this.setState({ dynamic_fields: temp });

    temp.map((fields_data) => {
      const { fields } = this.state;
      if (fields.input_label_name == fields_data.field_name && this.props.id) {
        fields.value = fields_data.field_value;
        this.setState({ fields });
        // this.props.setStateFunc("dynamic_fields",fields)
      }
    });
    this.props.setStateFunc('dynamic_fields', temp);
  };

  render() {
    const { fields, dynamic_fields } = this.state;
    return (
      <div>
        {/* Text Box Type */}
        {fields.input_extra == true && fields.input_style_type == 'Textbox' ? (
          <div className="row my-2 my-sm-5 ">
            <div className="col-md-6 input-block">
              <div className="clearfix">
                <h4>
                  {fields.input_label_name}{' '}
                  <span className="required text-danger">*</span>
                  <div className="info-pop d-inline-block d-sm-none " />
                </h4>
              </div>
            </div>
            <div className="col-md-6">
              <div className=" clearfix">
                <input
                  type="text"
                  placeholder={fields.input_place_value}
                  name={fields.input_label_name}
                  className="new-form-control w-100"
                  value={fields.value}
                  onChange={(e) => this.handleInput(e, 'extra', '')}
                />
              </div>
            </div>
          </div>
        ) : null}
        {/* Textarea */}
        {fields.input_extra == true && fields.input_style_type == 'Textarea' ? (
          <div className="row my-2 my-sm-5 ">
            <div className="col-md-6 input-block">
              <div className="clearfix">
                <h4>
                  {fields.input_label_name}{' '}
                  <span className="required text-danger">*</span>{' '}
                  <div className="info-pop d-inline-block d-sm-none " />
                </h4>
              </div>
            </div>
            <div className="col-md-6">
              <div className=" clearfix">
                <textarea
                  className="new-form-control"
                  name={fields.input_label_name}
                  rows={4}
                  onChange={(e) => this.handleInput(e, 'extra')}
                  value={fields.value}
                />
              </div>
            </div>
          </div>
        ) : null}
        {/* Checkbox || Radio  */}
        {(fields.input_extra == true &&
          fields.input_style_type == 'Checkbox') ||
        fields.input_style_type == 'Radio' ? (
          <div className="row my-2 my-sm-5 ">
            <div className="col-md-6 input-block">
              <div className="clearfix">
                <h4>
                  {fields.input_label_name}{' '}
                  <span className="required text-danger">*</span>{' '}
                  <div className="info-pop d-inline-block d-sm-none " />
                </h4>
              </div>
            </div>
            <div className="col-md-6">
              <div className=" clearfix">
                <ul className="dynamic">
                  {fields.input_content_value.split(',').map((d) => {
                    let values = fields.value;
                    let values_exist = [];
                    if (values != undefined) {
                      values = values.split(',');
                      values_exist = values.filter((val) => val == d);
                    } else {
                      values_exist = [];
                    }
                    return fields.input_style_type == 'Checkbox' ? (
                      <li key={d}>
                        {values_exist.length > 0 ? (
                          <input
                            type="checkbox"
                            className="new-form-control"
                            value={d}
                            name={fields.input_label_name}
                            id={fields.input_label_name}
                            onChange={(e) =>
                              this.handleInput(e, 'check_extra', d)
                            }
                            checked
                            key={d}
                          />
                        ) : (
                          <input
                            type="checkbox"
                            className="new-form-control"
                            value={d}
                            name={fields.input_label_name}
                            id={fields.input_label_name}
                            onChange={(e) =>
                              this.handleInput(e, 'check_extra', d)
                            }
                            key={d}
                          />
                        )}{' '}
                        {d}
                      </li>
                    ) : (
                      <li key={d}>
                        {values_exist.length > 0 ? (
                          <input
                            type="radio"
                            className="new-form-control"
                            name={fields.input_label_name}
                            onChange={(e) =>
                              this.handleInput(e, 'radio_extra', d)
                            }
                            checked
                            key={d}
                          />
                        ) : (
                          <input
                            type="radio"
                            className="new-form-control"
                            name={fields.input_label_name}
                            onChange={(e) =>
                              this.handleInput(e, 'radio_extra', d)
                            }
                            key={d}
                          />
                        )}{' '}
                        {d}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        ) : null}
        {fields.input_extra == true &&
        fields.input_style_type == 'Selectbox' ? (
          <div className="row my-2 my-sm-5 ">
            <div className="col-md-6 input-block">
              <div className="clearfix">
                <h4>
                  {fields.input_label_name}{' '}
                  <span className="required text-danger">*</span>{' '}
                  <div className="info-pop d-inline-block d-sm-none " />
                </h4>
              </div>
            </div>
            <div className="col-md-6">
              <div className=" clearfix">
                <select
                  className="new-form-control w-100"
                  name={fields.input_label_name}
                  onChange={(e) => this.handleInput(e, 'extra', '')}
                >
                  {fields.input_content_value.split(',').map((d) => (
                    <option value={d} selected={d == fields.value} key={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default DynamicFields;
