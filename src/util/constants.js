import { Map, List } from 'immutable';

export const Environments = ['DEV', 'RCT', 'PROD'];

export const TestStatuses = ['PENDING', 'OK', 'KO'];

export const EmptyScenario = Map({
  testStatus: TestStatuses[0],
  title: '',
  description: '',
  inputParameters: '',
  expectedResult: '',
  defects: '',
  comments: ''
});

export const EmptyUserStory = Map({
  userStory: '',
  environment: 'RCT',
  type: 'Manual functional testing',
  author: '',
  tools: List(['Postman']),
  comments: '',
  asumptions: '',
  startTestingDate: new Date(),
  endTestingDate: new Date(),
  scenarios: List([])
});

export const DialogConfig = {
  properties: ['openFile'],
  filters: [
    { name: 'CSV Files', extensions: ['csv', 'CSV'] },
    { name: 'All Files', extensions: ['*'] }
  ]
};

export const EmptyCSV = List([
  List(['', '', '', '', '', '', '', '']),
  List(['', 'User story:', '', '', '', '', '', '']),
  List(['', 'Environment:', '', '', '', '', '', '']),
  List(['', 'Type:', '', '', '', '', '', '']),
  List(['', 'Author:', '', '', '', '', '', '']),
  List(['', 'Tools:', '', '', '', '', '', '']),
  List(['', 'General comment:', '', '', '', '', '', '']),
  List(['', 'Asumptions: ', '', '', '', '', '', '']),
  List(['', 'Start testing date:', '', '', '', '', '', '']),
  List(['', 'End testing date', '', '', '', '', '', '']),
  List(['', '', '', '', '', '', '', '']),
  List([
    '',
    'Test status',
    'Scenario title',
    'Scenario description',
    'Input parameters',
    'Expected result',
    'Defects',
    'Comments'
  ])
]);
