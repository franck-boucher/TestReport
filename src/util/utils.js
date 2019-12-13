import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DialogConfig, DialogPdfConfig } from './constants'

const Store = window.require('electron-store');
const { dialog } = window.require('electron').remote;
const fs = window.require('fs');
const JSZip= require('jszip');
const FileSaver = require('file-saver');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generateUuid = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

export const iconStatus = status => {
  if (status === 'OK') return 'check';
  else if (status === 'KO') return 'delete';
  else return 'wait';
};

export const colorStatus = status => {
  if (status === 'OK') return 'green';
  else if (status === 'KO') return 'red';
  else return 'yellow';
};

export const colorPassed = percent => {
  if (percent === 100) return 'green';
  return 'red';
};

export const cloneScenario = scenario => {
  const store = new Store();
  const newScenario = { ...scenario };
  newScenario.uuid = generateUuid();
  newScenario.title = 'Copy of ' + newScenario.title;
  newScenario.testStatus = store.get('emptyScenario').testStatus;
  return newScenario;
};

export const generateJSON = userStory => {
  return JSON.stringify(userStory, null, 4);
};

export const parseFile = fileContent => {
  return JSON.parse(fileContent);
};

export const isFileJson = fileName => {
  const ext = fileName.split('.').pop();
  return ext === 'json' || ext === 'JSON';
};

export const buildAuthToken = (username, password) => {
  return btoa(`${username}:${password}`)
};

export const buildConfig = ({ url, username, password }) => {
  return {
    url,
    authorizationToken: buildAuthToken(username, password)
  };
};

export const updateRemoteConfig = ({ url, authorizationToken }) => {
  const store = new Store();
  const issueTrackingApp = store.get('issueTrackingApp');
  issueTrackingApp.jira.url = url;
  issueTrackingApp.jira.authorizationToken = authorizationToken;
  store.set('issueTrackingApp', issueTrackingApp);
};

export const getRemoteConfig = () => {
  const store = new Store();
  return store.get('issueTrackingApp').jira;
};

export const getPercentPassed = userStory => {
  const { scenarios } = userStory;
  const totalScenarios = scenarios.length;
  if (totalScenarios === 0) return 0;
  const totalPassed = scenarios.filter(el => el.testStatus === 'OK').length;
  return Math.round((totalPassed / totalScenarios) * 100);
};

export const getPdfColorForPercent = percent => {
  if (percent >= 100) return '#3CB371';
  else if (percent <= 0) return '#ed2c2c';
  else return '#ffae1a';
};

export const getPdfColorScenario = status => {
  if (status === 'OK') return '#9bddb9';
  else if (status === 'KO') return '#f58686';
  else return '#ffd17c';
};

export const openDialog = (onSuccess, callback) => {
  dialog.showOpenDialog(DialogConfig, filePaths => {
    callback();
    if (filePaths.length) {
      const filePath = filePaths[0];
      fs.readFile(filePath, (err, data) => {
        if (err) console.error('Error while trying to read archive from file system');
        JSZip.loadAsync(data)
          .then(zip => zip.file('report.json')
            .async('string')
            .then(content => onSuccess(content))
          );
      });
    } else {
      console.error(
        'Error while trying to select file path from file system'
      );
    }
  });
}

export const saveAsDialog = (userStory, callback) => {
  dialog.showSaveDialog(DialogConfig, filePath => {
    callback();
    if (filePath) {
      fs.writeFile(filePath, generateJSON(userStory.content), () => { });
    } else {
      console.error(
        'Error while trying to select file path from file system'
      );
    }
  });
};

export const saveAsZip = (userStory, callback) =>{
  callback();
  getZip(userStory)
    .then(content => FileSaver.saveAs(content,`${userStory.content.userStory}.testreport`));
};

export const getZip = (userStory) => {
  let zip = new JSZip();
  zip.file('report.json', generateJSON(userStory.content));
  zip.file('metadata.json', generateJSON(userStory.metadata));
  return zip.generateAsync({type:"blob"});
}

export const savePdfAsDialog = (userStory, callback) => {
  dialog.showSaveDialog(DialogPdfConfig, filePath => {
    callback();
    if (filePath) {
      const pdf = generatePdf(userStory.content);
      const pdfDocGenerator = pdfMake.createPdf(pdf);
      let pdfDoc = pdfDocGenerator.getStream();
      pdfDoc.pipe(fs.createWriteStream(filePath));
      pdfDoc.end();
    } else {
      console.error(
        'Error while trying to select file path from file system'
      );
    }
  });
};

export const generatePdfScenarioElement = scenario => {
  return {
    style: 'margins',
    table: {
      widths: ['*'],
      body: [
        [
          {
            fillColor: getPdfColorScenario(scenario.testStatus),
            border: [false],
            text: scenario.title
          }
        ]
      ]
    }
  };
};

export const generatePdf = userStory => {
  const percentPassed = getPercentPassed(userStory);
  const pdf = {
    pageMargins: [0, 60],
    content: [
      {
        text: userStory.userStory,
        style: ['header', 'center']
      },
      {
        text: 'Test report',
        style: 'center'
      },
      '\n\n\n',
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                style: ['percent', 'margins'],
                fillColor: getPdfColorForPercent(percentPassed),
                border: [false],
                text: `${percentPassed}%`
              }
            ]
          ]
        }
      },
      '\n\n',
      {
        style: 'margins',
        text: [
          { text: 'Type: ', bold: true },
          userStory.type,
          '\n',
          { text: 'Author: ', bold: true },
          userStory.author,
          '\n',
          { text: 'Env: ', bold: true },
          userStory.environment,
          '\n',
          { text: 'Tools: ', bold: true },
          userStory.tools.join(', '),
          ...(userStory.comments && [
            '\n',
            '\n',
            { text: 'General comments: ', bold: true },
            '\n',
            userStory.comments
          ]),
          ...(userStory.asumptions && [
            '\n',
            '\n',
            { text: 'Assumptions: ', bold: true },
            '\n',
            userStory.asumptions
          ])
        ]
      },
      '\n\n',
      {
        canvas: [
          { type: 'line', x1: 40, y1: 5, x2: 595 - 40, y2: 5, lineWidth: 1 }
        ]
      },
      '\n\n'
    ],
    styles: {
      header: {
        fontSize: 24,
        bold: true
      },
      center: {
        alignment: 'center'
      },
      percent: {
        fontSize: 38,
        italics: true,
        alignment: 'right'
      },
      margins: {
        margin: [40, 0]
      }
    }
  };
  userStory.scenarios.forEach(el => {
    pdf.content.push(generatePdfScenarioElement(el));
    pdf.content.push('\n');
  });
  return pdf;
};
