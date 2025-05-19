module.exports = {
    testDir: './tests',
    use: {
      baseURL: 'http://localhost:3000',
      browserName: 'chromium',
    },
    webServer: {
      command: 'npm start',
      url: 'http://localhost:3000',
      timeout: 120 * 1000,
      reuseExistingServer: true
    },
  };