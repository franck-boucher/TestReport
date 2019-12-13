import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { getRemoteConfig, buildConfig, generatePdf, getZip, parseFile } from '../../util/utils'

const JSZip= require('jszip');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

  let responseAttachments = null;
  // Delete existing report
  if (userstory.metadata.reportAttachmentId) {
    await deleteAttachment(userstory.metadata.reportAttachmentId);
  } else {
    responseAttachments = await getUserstoryAttachments(userStoryId);
    const reportAttachment = findReport(responseAttachments);
    if (reportAttachment) {
      await deleteAttachment(reportAttachment.id);
    }
  }

  // Delete existing PDF report
  if (userstory.metadata.reportPdfAttachmentId) {
    await deleteAttachment(userstory.metadata.reportPdfAttachmentId);
  } else {
    if (!responseAttachments) {
      responseAttachments = await getUserstoryAttachments(userStoryId);
    }
    const reportAttachment = findReport(responseAttachments, 'testreport.pdf');
    if (reportAttachment) {
      await deleteAttachment(reportAttachment.id);
    }
  }

  // Upload new report
  const newAttachments = await postNewMainAttachmentReport(userstory);
  const reportAttachmentId = newAttachments && newAttachments.length ? newAttachments[0] : null;

  // Upload new pdf report
  const newPdfAttachments = await postNewPdfAttachmentReport(userstory);
  const reportPdfAttachmentId = newPdfAttachments && newPdfAttachments.length ? newPdfAttachments[0] : null;

  return { reportAttachmentId, reportPdfAttachmentId };
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
    .then(response => response.blob())
    .then(JSZip.loadAsync)
    .then(zip => zip.file("report.json").async("string"))
    .then(reportContent => parseFile(reportContent))
    .catch(err => {
      console.error('Error while loading attachment:');
      console.error(err);
      return null;
    });
};

const postNewMainAttachmentReport = async (userstory) => {
  const userStoryId = userstory.content.userStory;
  const blob = await getZip(userstory);
  const file = new File([blob], `${userStoryId}.testreport`);
  return postNewAttachment(userstory, file);
}

const postNewPdfAttachmentReport = async (userstory) => {
  const userStoryId = userstory.content.userStory;
  const pdf = generatePdf(userstory.content);
  const pdfDocGenerator = pdfMake.createPdf(pdf);
  const blob = await getBlobPdf(pdfDocGenerator);
  const file = new File([blob], `${userStoryId}.testreport.pdf`);
  return postNewAttachment(userstory, file);
};

const getBlobPdf = (pdfDocGenerator) => {
  return new Promise(resolve => pdfDocGenerator.getBlob((blob) => resolve(blob)));
}

const postNewAttachment = (userstory, file) => {
  const userStoryId = userstory.content.userStory;
  const { url, authorizationToken } = getRemoteConfig();
  const headers = getAttachmentHeaders(authorizationToken);
  const builtUrl = url + `/rest/api/2/issue/${userStoryId}/attachments`;

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

export const findReport = (response, ext = 'testreport') => {
  return response
    ? response.fields.attachment
      .find(att => att.filename === `${response.key}.${ext}`)
    : null;
}