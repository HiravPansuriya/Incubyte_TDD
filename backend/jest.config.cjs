module.exports = {
  testEnvironment: 'node',
  reporters: [
    "default",
    ["jest-html-reporter", {
      "pageTitle": "Car Dealership API Test Report",
      "outputPath": "./test-report.html",
      "includeFailureMsg": true
    }]
  ]
};