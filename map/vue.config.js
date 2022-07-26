const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
})

module.exports = {
  outputDir:'docs',
  publicPath:process.env.NODE_ENV === "production"?"/Vue_Google_Map":"/"
}
