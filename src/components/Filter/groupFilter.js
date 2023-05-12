import React, { useState, useEffect } from 'react';
import Slider from '@material-ui/core/Slider';
import './styles.scss';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { GetAssetImage } from '../../globalFunctions';
import DebouncedInput from '../DebouncedInput/DebouncedInput';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: '20px',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

function GroupFilter(props) {
  const categry = props.groupscategory;

  const catdata = {};
  catdata.all = false;
  categry.map((catlist) => {
    catdata[catlist.category] = false;
  });

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [value, setValue] = React.useState([0, 10]);
  const [price, setprice] = React.useState();
  const [coins, setCoins] = useState([]);
  const [checked, setChecked] = React.useState(true);
  const [category, setcategory] = React.useState([]);
  const [sub, setsub] = React.useState([]);
  const activefilter = [];
  const activesubfilter = [];
  let activeprice = 0;

  useEffect(() => {
    const data = {
      search,
    };
    props.dataChange(data);
  }, [search]);

  // const allPairs = () =>{
  //   console.log("allpairs");
  //     getTradePairs().then(async resp => {
  //         setCoins(resp);
  //     }, error => {
  //     });
  // }
  const rangeSelector = (event, newValue) => {
    setValue(newValue);
  };

  const categories = categry.map((cat, index) => cat.category);

  const subscriptions = [
    'Free',
    'Paid',
    // "Recurrence",
    // "One time Subscription"
  ];

  const handleChange = (event, newValue) => {
    console.log(newValue, 'newValue');
    activeprice = 1;
    setValue(newValue);
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  const onFilterChange = (event, value) => {
    catdata[value] = event.target.checked;
    let index;
    let allindex;
    let newArr;
    if (value != 'all') {
      newArr = [...category]; // copy old value
      allindex = newArr.indexOf('all');
      if (allindex !== -1) {
        newArr.splice(allindex, 1);
      }
      index = newArr.indexOf(value);
      if (index !== -1) {
        newArr.splice(index, 1);
      }
      if (event.target.checked == true) {
        activefilter.push(value);
        newArr.push(value); // replace e.target.value with whatever you want to change it to
      } else {
        index = newArr.indexOf(value);
        if (index !== -1) {
          newArr.splice(index, 1);
        }
        allindex = newArr.indexOf('all');
        if (allindex !== -1) {
          newArr.splice(allindex, 1);
        }
      }
    } else {
      newArr = [];
      if (event.target.checked == true) {
        newArr.push(value);
        categry.map((catlist) => {
          catdata[catlist.category] = true;
          newArr.push(catlist.category);
        });
      }
    }
    setcategory(newArr);
  };

  const onFiltersub = (event, value) => {
    let newArr;
    if (value != 'all') {
      newArr = [...sub]; // copy old value
      if (event.target.checked == true) {
        activesubfilter.push(value);
        newArr.push(value); // replace e.target.value with whatever you want to change it to
      } else {
        const index = newArr.indexOf(value);
        if (index !== -1) {
          newArr.splice(index, 1);
        }
      }
    }
    setsub(newArr);
  };

  function valuetext(value) {
    return `${value}°C`;
  }
  const classes = useStyles();
  return (
    <div className="widget cardBody filterWidget">
      <div className="container">
        <div className="row">
          <ul className="list-group w-100">
            <li className="widgetTitle">
              <img src={GetAssetImage('Icon feather-filter.png')} />
              <span>Filter</span>
            </li>
          </ul>
          <form className="form p-3 w-100">
            <div className="form-group">
              <DebouncedInput
                type="text"
                className="form-control"
                placeholder="Search Group"
                value={search}
                onChange={(val) => {
                  setSearch(val);
                }}
              />
              <div className={classes.root}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}>
                      Category
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {categories.map((cate) => (
                        <div key={cate} className="form-group row">
                          <div className="col-sm-10" key={cate}>
                            <div className="form-check" key={cate}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    onClick={(e) => onFilterChange(e, cate)}
                                    name={cate}
                                    color="primary"
                                    key={cate}
                                  />
                                }
                                label={cate}
                                key={cate}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography className={classes.heading}>
                      Subscription
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {subscriptions.map((cate) => (
                        <div className="form-check" key={cate}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                onClick={(e) => onFiltersub(e, cate)}
                                name={cate}
                                color="primary"
                                key={cate}
                              />
                            }
                            label={cate}
                            key={cate}
                          />
                        </div>
                      ))}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography className={classes.heading}>
                      Price Range
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Slider
                      value={value}
                      onChange={handleChange}
                      valueLabelDisplay="auto"
                      aria-labelledby="range-slider"
                      getAriaValueText={valuetext}
                    />
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography className={classes.heading}>
                      Location
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <DebouncedInput
                      type="text"
                      className="form-control"
                      placeholder="Search Location (Eg: India)"
                      value={location}
                      onChange={(val) => {
                        setLocation(val);
                      }}
                    />
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default GroupFilter;
