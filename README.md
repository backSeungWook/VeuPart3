# Todo List 프로젝트 환경구성
<a href="https://github.com/HeropCode/Vue-Todo-app">Todo List 예제 프로젝트</a>   
개발용 의존성 모듈 설치  
패키지의 개발 시 사용될 의존성 모듈을 지정합니다.(배포 시 포함되지 않습니다)

## Webpack 설치 및 설정
<개발용 의존성 모듈>  
webpack은 웹팩(Webpack)의 핵심 패키지이며,
webpack-cli는 터미널에서 웹팩 명령(Commands)를 실행할 수 있게 해주는 도구입니다.
```
$ npm i -D webpack webpack-cli
```
개발용으로 실시간 Reload 서버를 실행하기 위해 webpack-dev-server를 설치합니다.
```
$ npm i -D webpack-dev-server
```
```js
//package.json
"scripts": {
    "dev":"webpack-dev-server --mode development",
}
```
```js
//dev-server 설정
//webpack.config.js
plugins:[/*...*/],
  devServer:{
   open:false,//true: 브라우저에서 바로 실행
   hot:true//수정 된 값들이 바로바로 수정. 기본값:true
  }
```
webpack-merge는 웹팩 Config 객체를 병합(merge)하기 위해 설치합니다.
웹팩을 개발용(dev)과 배포용(build)으로 구분해 실행할 수 있습니다.
```
$ npm i -D webpack-merge
```
```js
//webpack.config.js
const merge = require('webpack-merge')
plugins:[/*...*/],
devtool:'eval'//webpack이 돌아갈 때 빌드 시간이 줄어듬(개발용으로 적합)
devtool:'cheap-module-source-map'//배포 에 적합.(디버깅 X 빌드 시간이 늘어남.)
```
webpack.config.js 파일을 생성합니다.
자세한 설정 내용은 완성된 파일(`webpack.config.js`)을 참고하세요.

webpack 실행 방법
```
npx webpack --mode production
```
## loader 설치 및 설정
vue 로더 설치
```
npm install -D vue-loader vue-template-compiler
```

js,css style 로더 설치
```
npm i -D babel-loader vue-style-loader css-loader
```
### Babel 설치 및 설정
바벨(Babel)은 ES6 이상의 코드를 ES5 이하 버전으로 변환하기 위해 사용합니다.
- @babel/core: 바벨이 실제 동작하는 모듈입니다.
- @babel/preset-env: 바벨의 지원 스펙을 지정합니다.
- babel-loader: 웹팩(Webpack) 지원을 위해 사용합니다.
```
$ npm i -D @babel/core @babel/preset-env babel-loader
```
`.babelrc` 파일을 생성하고 다음 옵션을 추가합니다.
```js
{
  "presets": ["@babel/preset-env"]
}
```


```js
//webpack.config.js

const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  module: {
    rules: [
      // Vue loader 설정
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      //Js loader 설정
      {
        test: /\.js$/,
        exclude: /node_modules/,//node_modules안에 있는 js는 로더 하지 않음
        loader: 'babel-loader'
      },
      //css / style loader 설정
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    // make sure to include the plugin!
    new VueLoaderPlugin()
  ]
}
```

## @babel/polyfill
구형 및 일부 브라우저에서 지원하지 않는 기능들을 지원할 수 있도록 @babel/polyfill을 의존성 모듈로 설치합니다.(-D(--save-dev)가 없어야 합니다!)
구형 브라우저를 지원하지 않을 경우 설치 하지 않아도 댐.(구형 브라우저 지원 하기 때문에 프로젝트가 무거워 질 수 있음.)
```
$ npm i @babel/polyfill
```
설치 후 webpack.config.js에 다음과 같이 설정합니다.
```js
// ...
require('@babel/polyfill')

 entry: {
    app: [
      '@babel/polyfill',
      path.join(__dirname, 'main.js')
    ]
  }

```

## Vue 설치 및 최상위 컴포넌트 설정
```
npm i vue
```
최상위 컴포넌트 설정
```js
 render(createElement){
    return createElement(App)
  }
  == 밑에는 화살표 함수
  render: h =>h(App)
```
웹팩에서 .vue 파일을 해석할 수 있도록 다음 모듈들을 설치
- vue-template-compiler
- vue-loader
- vue-style-loader
- css-loader

## HTML or Favicon 설정

최초 실행될 index.html을 사용하기 위해 html-webpack-plugin을 설치
```
$ npm i -D html-webpack-plugin
```
```js
//webpack.config.js 추가
const HtmlWebpackPlugin = require('html-webpack-plugin')

 plugins:[
   //...
    new HtmlWebpackPlugin({
      template: path.join(__dirname,'index.html')
    })
  ]
```
Favicon 설정
```
npm i -D copy-webpack-plugin
```
```js
const CopyPlugin = require('copy-webpack-plugin')

 plugins:[
   //...
    new CopyPlugin([
      {
        from:'assets/',
        to:''
      }
    ])
 ]
```

## claen-webpack-plugin 설정

clean-webpack-plugin를 사용해 빌드(build)시 발생할 수 있는 충돌을 최소화하기 위해 output.path에 설정된 디렉터리 내 기존 모든 파일 삭제합니다.
```
$ npm i -D clean-webpack-plugin
```
```js

const {CleanWebpackPlugin} = require('clean-webpack-plugin')
plugins:[
   //...
  new CleanWebpackPlugin()
 ]
```

## SCSS(전처리) or Autoprefixer(후처리) 설치
전처리 CSS 설치
```
npm i -D sass-loader@^7 node-sass@^4
```
```js
module:{
  rules: [
  //....
    {
      test:/\.scss$/,
      use:[
        'vue-style-loader',
        'css-loader',
        'sass-loader'
      ]
    }
  ]
}
```
후처리 CSS 설치
```
npm i -D autoprefixer postcss-loader
```
postcss.config.js 파일 생성.
```js
//postcss.config.js
module.exports = {
  plugins:[
    require('autoprefixer')
  ]
}
```
```js
//webpack.config.js
{
  test: /\.css$/,
  use: [
    'vue-style-loader',
    'css-loader',
    'postcss-loader'// 추가 순서 중요
  ]
},
{
  test:/\.scss$/,
  use:[
    'vue-style-loader',
    'css-loader',
    'postcss-loader',// 추가 순서 중요
    'sass-loader'
  ]
}
```
```js
//package.json
"browserslist":[
    "last 2 versions",
    "Chrome >= 59"
  ]
```
## ~~ESLint~~
~~코드 품질과 코딩 스타일 문제를 식별하기 위한 정적 코드 분석 도구  
6버전의 호환성 모듈(Peer Dependency) 이슈로 5버전을 설치~~

## Vetur 확장 프로그램 설치
 Vue에 대한 자동완성 및 디버깅 등등 지원
 

# Todo-List 프로젝트 라이브러리
## LowDB or Lodash 설치
```
npm i lodash lowdb
```
lodash API : https://lodash.com/
## ~~crypto-random-string~~
~~자동적으로 중복되지 않음 문자열 생성
옵션으로 { length:10} : 10개의 문자열로 생성  
https://github.com/sindresorhus/crypto-random-string~~
```
npm i crypto-random-string
```

* webpack 5버전에서는 에러 발생하여 적용 못시킴...
```js
//const crypto = require("crypto");
//console.log(crypto.randomBytes(20).toString('hex'))
```

## Moment.js or Day.js
Day.js는 Moment.js의 경량화 버전.
```
npm i dayjs
```

## 양식요소의 구조가 똑같을 경우 v-if로 표시 여부 할 때 
기존 양식요소들이 포커스 되거나 사라진 요소의 함수가 실행 될 수가 있음  
그럴 때는 key라는 키워드를 사용하여 고유의 값을 지정 해주어야 함.

## ref
```js
//해당 요소의 참조값 지정
<input ref="참조값" type='text'>
//해당 스크립트에서 요소 참조값 가져올 때 
this.$refs.참조값
```
## Vue.nextTick
다음 DOM 업데이트 사이클 이후 실행 하는 콜백을 연기
즉. 화면에 렌더링 후 함수 실행.
```js
this.$nextTick(() =>{
  this.$refs.titleInput.focus()
})
```

## Vue.delete
객체의 속성을 삭제, 객체가 반응형이면 뷰 업데이트를 발생
```js
this.$delete(target,Index)
```