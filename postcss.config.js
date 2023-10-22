module.exports = {
    plugins: [
      require('postcss-preset-env')({ 
        stage: 1,
        minimumVendorImplementations: 3,
        browserslist: [
          'cover 99.5%'
        ]
      })
    ]
}