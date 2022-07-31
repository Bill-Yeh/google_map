const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/google_map/dist',
})

// module.exports = {
//   outputDir:'docs',
//   publicPath:process.env.NODE_ENV === "production"?"/google_map":"/"
// }
