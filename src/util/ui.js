import React from 'react';

export const InputField = ({ title, ...props }) => (
  <div className="field">
    <label>{title}</label>
    <input placeholder="First Name" {...props} />
  </div>
)