import React, { useState } from 'react';
import { Icon, Segment, Label } from 'semantic-ui-react'

import { colorPassed } from '../util/utils';

export const InputField = ({ title, ...props }) => (
  <div className="field">
    <label>{title}</label>
    <input {...props} />
  </div>
);

export const TabIcon = (props) => (
  <Icon {...props} size='large' color='grey' style={{ marginLeft: '0.5em', fontSize: '1.2em', cursor: 'pointer' }} />
)

export const ExpendableSegment = ({ label, children }) => {

  const [isOpen, setOpen] = useState(true);
  const toggleOpen = () => setOpen(!isOpen);
  const paddingBottom = isOpen ? '1.5em' : '1.85em';
  return (
    <Segment raised style={{ paddingBottom, marginBottom: '1.25em' }}>
      <Label attached='top' size='large'>{label}</Label>
      {isOpen && children}
      <Label attached='bottom' onClick={toggleOpen} style={{ cursor: 'pointer', textAlign: 'center', paddingTop: '0.2em', paddingBottom: '0.1em' }}>
        <Icon name={`angle ${isOpen ? 'up' : 'down'}`} />
      </Label>
    </Segment>
  );
};

export const PercentPassedLabel = ({ percent = 0 }) => (
  <Label basic size='large' color={colorPassed(percent)} style={{ height: '38px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {percent} %
  </Label>
);