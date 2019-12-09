import { getRemoteConfig, buildConfig } from '../../util/utils'

export const connectToJira = (url, username, password) => {
  const config = buildConfig({ url, username, password });
  const headers = getHeaders(config.authorizationToken);
  return fetch(config.url + '/rest/api/2/myself', { method: 'GET', headers })
    .then(checkStatus)
};

export const getHeaders = authorizationToken => {
  return {
    'Authorization': `Basic ${authorizationToken}`,
    'Content-Type': 'application/json'
  }
};

export const getAttachmentHeaders = authorizationToken => {
  return {
    'Authorization': `Basic ${authorizationToken}`,
    'X-Atlassian-Token': 'no-check',
    'Custom-Headers-Electron': true
  };
};

export const fetchUserstory = (userStoryId) => {
  const { url, authorizationToken } = getRemoteConfig();
  const headers = getHeaders(authorizationToken);
  const builtUrl = url + `/rest/api/2/issue/${userStoryId}?fields=summary,status,attachment`;
  return fetch(builtUrl, { method: 'GET', headers })
    .then(checkStatus)
}

export const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw response;
  }
};

export const uploadUserstory = async (userstory) => {
  const userStoryId = userstory.content.userStory;

  if (userstory.metadata.reportAttachmentId) {
    await deleteAttachment(userstory.metadata.reportAttachmentId)
  } else {
    const response = await getUserstoryAttachments(userStoryId);
    const reportAttachment = findReport(response);
    if (reportAttachment) {
      await deleteAttachment(reportAttachment.id);
    }
  }

  const newAttachments = await postNewAttachmentReport(userstory);
  return newAttachments && newAttachments.length ? newAttachments[0] : null;
};

const getUserstoryAttachments = (userStoryId) => {
  const { url, authorizationToken } = getRemoteConfig();
  const headers = getHeaders(authorizationToken);
  const builtUrl = url + `/rest/api/2/issue/${userStoryId}?fields=attachment`;
  return fetch(builtUrl, { method: 'GET', headers })
    .then(checkStatus)
    .then(response => response.json())
    .catch(err => {
      console.error('Error while loading attachments:');
      console.error(err);
      return null;
    });
};

export const getUserstoryAttachment = (reportContentUrl) => {
  const { authorizationToken } = getRemoteConfig();
  const headers = getHeaders(authorizationToken);
  return fetch(reportContentUrl, { method: 'GET', headers })
    .then(checkStatus)
    .then(response => response.json())
    .catch(err => {
      console.error('Error while loading attachment:');
      console.error(err);
      return null;
    });
};

const postNewAttachmentReport = (userstory) => {
  const userStoryId = userstory.content.userStory;
  const { url, authorizationToken } = getRemoteConfig();
  const headers = getAttachmentHeaders(authorizationToken);
  const builtUrl = url + `/rest/api/2/issue/${userStoryId}/attachments`;

  const file = new File([JSON.stringify(userstory.content)],
    `${userStoryId}.testreport.json`);
  let formData = new FormData()
  formData.append('file', file);

  return fetch(builtUrl, { method: 'POST', headers, body: formData })
    .then(checkStatus)
    .then(response => response.json())
    .catch(err => {
      console.error('Error while uploading new attachment:');
      console.error(err);
      err.text().then(text => console.error(text))
      return null;
    });
};

const deleteAttachment = (attachmentId) => {
  const { url, authorizationToken } = getRemoteConfig();
  const headers = getHeaders(authorizationToken);
  const builtUrl = url + `/rest/api/2/attachment/${attachmentId}`;
  return fetch(builtUrl, { method: 'DELETE', headers })
    .then(checkStatus)
    .catch(err => {
      console.error('Error while deleting attachment:')
      console.error(err);
    });

}

export const findReport = (response) => {
  return response
    ? response.fields.attachment
      .find(att => att.filename === `${response.key}.testreport.json`)
    : null;
}