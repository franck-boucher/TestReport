import React, { Fragment, Component } from 'react';
import { Label, Icon } from 'semantic-ui-react';

class TagsInput extends Component {
  state = {
    inputValue: ''
  };
  handleRef = c => {
    this.inputRef = c;
  };
  focus = () => {
    this.inputRef.focus();
  };
  submitNewTag = event => {
    if (event.key === 'Enter') {
      const { inputValue } = this.state;
      if (inputValue) {
        const { id, tags, handleFieldChange } = this.props;
        tags.push(inputValue);
        handleFieldChange(null, { id, value: tags });
        this.setState({ inputValue: '' });
      }
    }
  };
  removeTag = tag => {
    const { id, tags, handleFieldChange } = this.props;
    if (tags.includes(tag)) {
      tags.splice(tags.indexOf(tag), 1);
      handleFieldChange(null, { id, value: tags });
    }
  };
  updateInput = e => {
    this.setState({ inputValue: e.target.value });
  };
  render() {
    const { inputValue } = this.state;
    const { id, label, tags } = this.props;
    const labelTags = tags.map(tag => (
      <Label key={tag} color="blue" basic className="basic-inverted">
        {tag} <Icon name="close" onClick={() => this.removeTag(tag)} />
      </Label>
    ));
    return (
      <Fragment>
        <label>{label}</label>
        <div
          className="ui multiple search selection dropdown"
          onClick={this.focus}
        >
          {labelTags}
          <input
            id={id}
            className="search"
            style={{ width: 'auto' }}
            value={inputValue}
            ref={this.handleRef}
            onKeyPress={this.submitNewTag}
            onChange={this.updateInput}
          />
        </div>
      </Fragment>
    );
  }
}
export default TagsInput;
