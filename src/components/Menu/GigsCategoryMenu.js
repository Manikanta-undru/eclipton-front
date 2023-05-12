import React, { useState, useEffect } from 'react';
import { getDynamicCategories } from '../../http/gig-calls';
import './styles.scss';

function GigsCategoryMenu(props) {
  const [openCloseToggle, setOpenCloseToggle] = useState(true);
  const [isActive, setIsActive] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    getDynamicCategories().then(
      (resp) => {
        // var temp = [];
        // resp.forEach(element => {
        //     element.open = 0;
        //     temp.push(element);
        // });
        setCategories(resp);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const toggleBody = (i, i2 = null, i3 = null, i4 = null, i5 = null) => {
    const temp = [...categories];
    let id = 0;
    if (i2 == null && i3 == null && i4 == null && i5 == null) {
      temp[i].open = temp[i].open != undefined ? !temp[i].open : true;
      id = temp[i]._id;
    } else if (i3 == null && i4 == null && i5 == null) {
      temp[i].children[i2].open =
        temp[i].children[i2].open != undefined
          ? !temp[i].children[i2].open
          : true;
      id = temp[i].children[i2]._id;
    } else if (i4 == null && i5 == null) {
      temp[i].children[i2].children[i3].open =
        temp[i].children[i2].children[i3].open != undefined
          ? !temp[i].children[i2].children[i3].open
          : true;
      id = temp[i].children[i2].children[i3]._id;
    } else if (i5 == null) {
      temp[i].children[i2].children[i3].children[i4].open =
        temp[i].children[i2].children[i3].children[i4].open != undefined
          ? !temp[i].children[i2].children[i3].children[i4].open
          : true;
      id = temp[i].children[i2].children[i3].children[i4]._id;
    } else {
      temp[i].children[i2].children[i3].children[i4].children[i5].open =
        temp[i].children[i2].children[i3].children[i4].children[i5].open !=
        undefined
          ? !temp[i].children[i2].children[i3].children[i4].children[i5].open
          : true;
      id = temp[i].children[i2].children[i3].children[i4].children[i5]._id;
    }

    props.onChange(id);
    setCategories(temp);
    setIsActive(id);
  };

  const onSelectItem = (obj, index) => {
    setIsActive(index);
  };

  return (
    <div className="widget cardBody gigonomyMenus ">
      <div className="container">
        <div className="row">
          <ul className="list-group w-100 mb-0">
            <li className="list-group-item d-flex justify-content-between align-items-center header-drak widgetTitle text-size">
              Gigs Category
            </li>
          </ul>
          <ul className="list-group w-100 mb-0 menu  p-2">
            {categories.map((c, i) => (
              <div key={i}>
                <li
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    isActive == c._id ? 'current' : ''
                  }`}
                  onClick={() => toggleBody(i)}
                >
                  <span className="pointer link align-items-center d-flex">
                    {c.category}{' '}
                  </span>
                  {c.children.length > 0 && (
                    <span>
                      {c.open === true ? (
                        <i className="fa fa-chevron-down text-small design-btn-icon" />
                      ) : (
                        <i className="fa fa-chevron-up text-small design-btn-icon" />
                      )}
                    </span>
                  )}
                </li>
                {c.open === true && c.children.length > 0 && (
                  <div>
                    {c.children.map((c2, i2) => (
                      <li
                        onClick={() => toggleBody(i, i2)}
                        key={i2}
                        className={`submenu  list-group-item gigsCategoryMenu design-btn pointer ${
                          isActive == c2._id ? 'current' : ''
                        }`}
                      >
                        <span className="design-text ">{c2.category} </span>
                      </li>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default GigsCategoryMenu;
