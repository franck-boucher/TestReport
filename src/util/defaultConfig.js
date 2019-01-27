const defaultConfig = {
  general: {
    language: 'en',
    darkMode: false
  },
  issueTrackingApp: {
    jira: {
      url: '',
      authorizationToken: ''
    }
  },
  emptyUserStory: {
    userStory: '',
    environment: 'RCT',
    type: 'Manual functional testing',
    author: '',
    tools: ['Postman'],
    comments: '',
    asumptions: '',
    startTestingDate: 'TODAY',
    endTestingDate: 'TODAY',
    scenarios: []
  },
  emptyScenario: {
    testStatus: 'PENDING',
    title: '',
    description: '',
    urlParameters: '',
    headers: '',
    expectedResult: '',
    defects: '',
    comments: ''
  }
};

module.exports = defaultConfig;
