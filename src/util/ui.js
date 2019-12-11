import React from 'react';
import { Icon } from 'semantic-ui-react'

export const InputField = ({ title, ...props }) => (
  <div className="field">
    <label>{title}</label>
    <input placeholder="First Name" {...props} />
  </div>
);

export const TabIcon = (props) => (
  <Icon {...props} size='large' color='grey' style={{ marginLeft: '0.5em', fontSize: '1.2em', cursor: 'pointer' }} />
)