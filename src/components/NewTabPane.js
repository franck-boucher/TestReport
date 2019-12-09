import React, { Fragment, useState, useEffect } from 'react';
import { Button } from 'semantic-ui-react';

import OpenRemoteUs from './OpenRemoteUs'
import ConnectToJira from './jira/ConnectToJira'
import { getRemoteConfig } from '../util/utils'

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

const NewTabPane = ({ createReport, openReport, onClickNew, onClickOpen }) => {

  const [remoteUrl, setRemoteUrl] = useState('');
  const [remoteToken, setRemoteToken] = useState('');

  useEffect(() => updateRemote(getRemoteConfig()), []);

  const updateRemote = ({ url, authorizationToken }) => {
    setRemoteUrl(url);
    setRemoteToken(authorizationToken);
  }

  return (
    <Fragment>

      <div style={paneStyle}>

        {(!remoteUrl && !remoteToken) ? (
          <ConnectToJira updateRemote={updateRemote} />
        ) : (
            <OpenRemoteUs createReport={createReport} openReport={openReport} />
          )}

        <hr style={{ width: '20em', marginBottom: '1.5em' }} />

        <Button onClick={onClickNew} size='small' compact style={buttonStyle}>New local UserStory</Button>
        <Button onClick={onClickOpen} size='small' compact style={buttonStyle}>Open local UserStory</Button>
      </div>

    </Fragment>
  );
};

export default NewTabPane;