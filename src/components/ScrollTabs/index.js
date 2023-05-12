import React, { useEffect, useState, useRef } from 'react';
import './styles.scss';

function ScrollTabs(props) {
  const [currentTab, setCurrent] = useState(0);
  const [tabs, setTabs] = useState(props.tabs);
  const [panels, setPanels] = useState(props.panels);
  const [content, setContent] = useState(props.content);
  const headerRef = useRef(null);
  const [leftScroll, setLeftScroll] = useState(false);
  const [rightScroll, setRightScroll] = useState(true);
  const [data, setData] = useState([]);
  const [metavalue, setMetaValue] = useState([]);
  const [checkerror, setCheckerror] = useState(props.checkerror);
  const [categoryChange, setCategorychange] = useState(false);

  const handleChange = (newValue) => {
    if (props.preventChange == true) {
      const con = window.confirm('Are you sure want to leave?');
      if (con == true) {
        setCurrent(newValue);
        props.changeTab(newValue);
      }
    } else {
      setCurrent(newValue);
      props.changeTab(newValue);
    }
  };

  const handleScrollRight = () => {
    headerRef.current.scrollBy({
      left: 150,
      behavior: 'smooth',
    });
    setLeftScroll(true);
    // console.log("scroll",currentTab)
  };
  const handleScrollLeft = () => {
    headerRef.current.scrollBy({
      left: -150,
      behavior: 'smooth',
    });
    // console.log("scroll",currentTab)
    if (headerRef.current.scrollLeft <= 150) {
      setLeftScroll(false);
    }
  };

  useEffect(() => {
    if (headerRef.current.scrollWidth > headerRef.current.clientWidth) {
      setRightScroll(true);
    } else {
      setRightScroll(false);
    }
    setData(props.data);
    setMetaValue(props.value);
    setCategorychange(props.categorychanged);
  }, [props]);

  return (
    console.log(categoryChange, 'categoryChange'),
    (
      <div className="scroll-tabs">
        <div className="scroll-tabs-header">
          <div
            className={`scroll-icon scroll-icon-right  ${
              rightScroll ? '' : 'd-none'
            }`}
            onClick={() => handleScrollRight()}
          >
            <i className="fa fa-chevron-right" />
          </div>
          <div
            className={`scroll-icon scroll-icon-left ${
              leftScroll ? '' : 'd-none'
            }`}
            onClick={() => handleScrollLeft()}
          >
            <i className="fa fa-chevron-left" />
          </div>
          <ul className="scroll-tabs-tabs" ref={headerRef}>
            {data.map((item, i) => (
              <li
                className={`scroll-tabs-tab   ${
                  currentTab == i ? 'active' : ''
                }`}
                onClick={() => setCurrent(i)}
                key={i}
              >
                {item.title}{' '}
                <i className="fa fa-chevron-down" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
        <div className="scroll-tabs-body">
          {data !== undefined &&
            metavalue !== undefined &&
            data.map((item, i) => {
              const filter_values = metavalue.filter(
                (val) => item.title == val.title
              );
              const checked_values =
                filter_values.length > 0 &&
                filter_values[0].checkedvalues != undefined &&
                filter_values[0].checkedvalues != ''
                  ? filter_values[0].checkedvalues.split(',')
                  : [];
              const check_others = checked_values.filter(
                (val) => val == 'other'
              );
              const other_val =
                filter_values.length > 0 &&
                filter_values[0].other_val != undefined
                  ? filter_values[0].other_val
                  : '';
              return (
                <div
                  className={`scroll-tabs-body-tab  ${
                    currentTab == i ? 'active' : ''
                  }`}
                  key={i}
                >
                  {item.type && item.type == 'Checkbox' ? (
                    <ul>
                      {item.choices.split(',').map((d, i) => {
                        const values_exist = checked_values.filter(
                          (val) =>
                            val == d &&
                            props.db_sub_category_id == props.sub_category_id
                        );
                        return (
                          <li key={i}>
                            {values_exist.length > 0 && (
                              <input
                                type="checkbox"
                                name={d}
                                defaultChecked={values_exist > 0}
                                multiple
                                onChange={(e) =>
                                  props.handlemeta(i, e, item.title)
                                }
                              />
                            )}
                            {values_exist.length == 0 && (
                              <input
                                type="checkbox"
                                name={d}
                                multiple
                                onChange={(e) =>
                                  props.handlemeta(i, e, item.title)
                                }
                                defaultChecked={false}
                              />
                            )}
                            {d}
                          </li>
                        );
                      })}
                      <li>
                        {check_others.length > 0 && (
                          <input
                            type="checkbox"
                            name="other"
                            defaultChecked={check_others.length > 0}
                            onChange={(e) => props.handlemeta(i, e, item.title)}
                          />
                        )}
                        {check_others.length == 0 && (
                          <input
                            type="checkbox"
                            name="other"
                            onChange={(e) => props.handlemeta(i, e, item.title)}
                            defaultChecked={false}
                          />
                        )}
                        Other{' '}
                      </li>
                      <li className="other-option">
                        <label>Other</label>
                        <input
                          className=" new-form-control w-100"
                          name={`${item.title}_other`}
                          onChange={(e) => props.handlemeta(i, e, item.title)}
                          value={other_val}
                        />
                      </li>
                    </ul>
                  ) : item.type == 'Radio' ? (
                    <ul>
                      {item.choices.split(',').map((d, i) => {
                        const values_exist = checked_values.filter(
                          (val) => val == d
                        );
                        return (
                          <li key={i}>
                            {values_exist.length > 0 ? (
                              <input
                                type="radio"
                                value={d}
                                name={`metadata_radio_${item.title}`}
                                defaultChecked={values_exist.length > 0}
                                onChange={(e) =>
                                  props.handlemeta(i, e, item.title)
                                }
                              />
                            ) : (
                              <input
                                type="radio"
                                value={d}
                                name={`metadata_radio_${item.title}`}
                                onChange={(e) =>
                                  props.handlemeta(i, e, item.title)
                                }
                              />
                            )}{' '}
                            {d}
                          </li>
                        );
                      })}

                      <li>
                        <input
                          type="radio"
                          value="other"
                          name={`metadata_radio_${item.title}`}
                          defaultChecked={check_others.length > 0}
                          onChange={(e) => props.handlemeta(i, e, item.title)}
                        />{' '}
                        Other
                      </li>

                      <li className="other-option">
                        <label>Other</label>
                        <input
                          className=" new-form-control w-100"
                          name={`${item.title}_other`}
                          onChange={(e) => props.handlemeta(i, e, item.title)}
                          value={other_val}
                        />
                      </li>
                    </ul>
                  ) : (
                    <ul>
                      <li>
                        <select
                          className="new-form-control w-100 mb-3"
                          name={item.title}
                          onChange={(e) => props.handlemeta(i, e, item.title)}
                        >
                          <option value="">Choose</option>
                          {item.choices.split(',').map((d, i) => {
                            const values_exist = checked_values.filter(
                              (val) => val == d
                            );
                            return values_exist.length > 0 ? (
                              <option value={d} selected key={i}>
                                {' '}
                                {d}
                              </option>
                            ) : (
                              <option value={d}> {d}</option>
                            );
                          })}
                          {check_others.length > 0 ? (
                            <option value="other" selected>
                              Other
                            </option>
                          ) : (
                            <option value="other">Other</option>
                          )}
                          <option
                            value="other"
                            selected={
                              check_others.length > 0 ? 'selected' : false
                            }
                          >
                            Other
                          </option>
                        </select>
                      </li>
                      <li className="other-option">
                        <label>Other</label>
                        <input
                          className=" new-form-control w-100"
                          name={`${item.title}_other`}
                          onChange={(e) => props.handlemeta(i, e, item.title)}
                          value={other_val}
                        />
                      </li>
                    </ul>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    )
  );
}

export default ScrollTabs;
