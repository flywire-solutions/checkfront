module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? '/checkfront/'
      : '/',
    outputDir: 'docs'
  }