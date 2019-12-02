import React from 'react';
import { Button } from 'semantic-ui-react';

const paneStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center'
}

const buttonStyle = {
  marginBottom: '1em'
}

const NewTabPane = ({ onClickNew, onClickOpen }) => (
  <div style={paneStyle}>
    <Button disabled primary size='big' style={{ marginBottom: '1.5em' }}>Connect with Jira</Button>
    <hr style={{ width: '20em', marginBottom: '1.5em' }} />
    <Button onClick={onClickNew} size='small' compact style={buttonStyle}>New local UserStory</Button>
    <Button onClick={onClickOpen} size='small' compact style={buttonStyle}>Open local UserStory</Button>
  </div>
)

export default NewTabPane;