const path = require('path') //node.js 에서 제공해줌. 
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const merge = require('webpack-merge')

require('@babel/polyfill')

//__dirname : 현재 파일의 경로


module.exports = (env,opts) => 
{

  const config = 
  {
    resolve:{
      extensions:['.vue','.js'], //생략 할 확장자들
      alias:{
        '~':path.join(__dirname),
        'scss':path.join(__dirname,'./scss')
      }
    },
    //진입점
    entry:{
      app:[
      '@babel/polyfill',
      path.join(__dirname,'main.js')
    ]
      
    },
    //결과물에 대한 설정.
    output:{
      filename:'[name].js', //==> app.js
      path:path.join(__dirname,'dist')
    },
    module:{
      rules: [
        // Vue loader 설정
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        //Js loader 설정
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        //css / style loader 설정
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test:/\.scss$/,
          use:[
            'vue-style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins:[
      
      new HtmlWebpackPlugin({
        template: path.join(__dirname,'index.html')
      }),
      new VueLoaderPlugin(),
      new CopyPlugin([
        {
          from:'assets/',
          to:""
        }
      ]) 
    ]
  }
  //개발용
  if(opts.mode === 'development')
  {
    //merge
    return merge(config,{
      //추가 개발용 옵션
      devtool:'eval',
      devServer:{
        open:false,
         hot:true
       } 
    })
  }
  //배포용
  else //if(opts.mode === 'production')
  {
    //merge
    return merge(config,{
      //추가 배포용 옵션
      devtool:'cheap-module-source-map',
      plugins:[
        new CleanWebpackPlugin()
      ]
    })
  }
}