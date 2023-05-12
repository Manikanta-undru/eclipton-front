import React, { useEffect, useState } from 'react';
import './styles.scss';

function TabsUI(props) {
  const [currentTab, setCurrent] = useState(props.currentTab);
  const [tabs, setTabs] = useState(props.tabs);
  const [panels, setPanels] = useState(props.panels);
  const [content, setContent] = useState(props.content);

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
  useEffect(() => {
    if (content != null) {
      setContent(content);
    }
    setCurrent(props.currentTab);
  }, [props.currentTab]);

  return (
    <div className="tabs">
      <div className={`tabBar ${props.width != null && ` ${props.width}`}`}>
        {tabs != null &&
          tabs.length > 0 &&
          tabs.map((e, i) => (
            <div
              className={`tabBarItem${currentTab == i ? ' active' : ''}`}
              onClick={(e) => handleChange(i)}
              key={i}
            >
              {typeof e === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: e }} />
              ) : (
                e
              )}
            </div>
          ))}
      </div>
      <div className="tabPanel">
        {panels != null &&
          tabs.length > 0 &&
          tabs.map((e, i) => (
            <div
              className={`tabPanelItem ${currentTab == i ? ' active' : ''}`}
              key={i}
            >
              {typeof e === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: e }} />
              ) : (
                e
              )}
            </div>
          ))}
        {content != undefined && content != null ? content : null}
      </div>
    </div>
  );
}

export default TabsUI;
