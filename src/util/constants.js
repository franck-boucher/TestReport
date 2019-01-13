export const Environments = ['DEV', 'RCT', 'PROD'];

export const TestStatuses = ['PENDING', 'OK', 'KO'];

export const EmptyScenario = {
  testStatus: TestStatuses[0],
  title: '',
  description: '',
  inputParameters: '',
  expectedResult: '',
  defects: '',
  comments: ''
};

export const EmptyUserStory = {
  userStory: '',
  environment: 'RCT',
  type: 'Manual functional testing',
  author: '',
  tools: ['Postman'],
  comments: '',
  asumptions: '',
  startTestingDate: new Date(),
  endTestingDate: new Date(),
  scenarios: []
};

export const DialogConfig = {
  properties: ['openFile'],
  filters: [
    { name: 'CSV Files', extensions: ['csv', 'CSV'] },
    { name: 'All Files', extensions: ['*'] }
  ]
};

export const EmptyCSV = [
  ['', '', '', '', '', '', '', ''],
  ['', 'User story:', '', '', '', '', '', ''],
  ['', 'Environment:', '', '', '', '', '', ''],
  ['', 'Type:', '', '', '', '', '', ''],
  ['', 'Author:', '', '', '', '', '', ''],
  ['', 'Tools:', '', '', '', '', '', ''],
  ['', 'General comment:', '', '', '', '', '', ''],
  ['', 'Asumptions: ', '', '', '', '', '', ''],
  ['', 'Start testing date:', '', '', '', '', '', ''],
  ['', 'End testing date', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  [
    '',
    'Test status',
    'Scenario title',
    'Scenario description',
    'Input parameters',
    'Expected result',
    'Defects',
    'Comments'
  ]
];
