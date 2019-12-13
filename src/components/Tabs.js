import React, { useState } from 'react';

import About from "./About";
import Preferences from "./Preferences";


const Tabs = ({ tabs = [], fallback = 'No tabs' }) => {

  const [active, setActive] = useState(0);

  if (active !== 0 && active >= tabs.length) {
    setActive(tabs.length > 0 ? tabs.length - 1 : 0);
  }

  return (
    !tabs.length ? fallback : (
      <div id="tabs">
        <div className="ui attached tabular menu" style={{ paddingRight: '6em' }}>
          {tabs.map(({ name, title }, index) =>
            <Tab key={`tab-${name}`} isActive={index === active} onClick={() => setActive(index)}>
              {title}
            </Tab>
          )}
          <span style={{ top: '0.7em', right: '1em', position: 'absolute' }}>
            <Preferences />
            <About />
          </span>
        </div>
        {tabs.map(({ name, content }, index) => (
          <TabContent key={`tabContent-${name}`} isActive={index === active}>{content}</TabContent>
        ))}
      </div>
    )
  );
};

const Tab = ({ name, isActive = false, onClick, children }) => (
  <span style={{ cursor: 'pointer' }} onClick={() => onClick(name)} className={`item${isActive ? ' active' : ''}`}>
    {children}
  </span>
);

const TabContent = ({ isActive, children }) => (
  <div className={`ui bottom attached segment tab${isActive ? ' active' : ''}`}>
    {children}
  </div>
);

export default Tabs;