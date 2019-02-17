import React, { Fragment, useState } from 'react';

const ExpendableLabel = ({ defaultExpended, label, children }) => {
  const [isExpended, setIsExpended] = useState(defaultExpended);
  const toggleExpend = () => setIsExpended(!isExpended);
  return (
    <Fragment>
      <label style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{label}</span>
        <small
          onClick={toggleExpend}
          style={{
            fontWeight: 'normal',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          {isExpended ? 'Hide' : 'Expend'}
        </small>
      </label>
      {isExpended && children}
    </Fragment>
  );
};

export default ExpendableLabel;
