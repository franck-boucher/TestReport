import React, { Component, Fragment } from 'react';

class ExpendableLabel extends Component {
  state = {
    isExpended: this.props.defaultExpended
  };
  toggleExpend = () => {
    this.setState({ isExpended: !this.state.isExpended });
  };
  render() {
    const { label, children } = this.props;
    const { isExpended } = this.state;
    return (
      <Fragment>
        <label style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{label}</span>
          <small
            onClick={this.toggleExpend}
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
  }
}

export default ExpendableLabel;
