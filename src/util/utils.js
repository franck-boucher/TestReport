const Store = window.require('electron-store');

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

export const parseJSON = jsonString => {
  return JSON.parse(jsonString);
};

export const parseFile = fileContent => {
  return parseJSON(fileContent);
};

export const isFileJson = fileName => {
  const ext = fileName.split('.').pop();
  return ext === 'json' || ext === 'JSON';
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
