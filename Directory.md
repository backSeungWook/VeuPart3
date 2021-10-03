# Directory
```
root  
  |_assets : favicon 및 이미지
  |_components : TodoApp 하위 컴포넌트 파일들
    |_TodoCreator.vue : TodoApp에서 데이터 추가하는 부분
    |_TodoItem.vue : TtodoApp 데이터 리스트
  |_dist : 배포 할 파일들
  |_node_modules : 노드 모듈들
    |_모듈...
      |_...
    |_..
  |_router : Vue router index.js
    |_index.js
  |_scss
    |__style.scss
  |_store : Vuex 관련 파일들 index ,todoApp ,coreConcepts
    |_index.js : 독립적인 네임스페이스들 연결
    |_todoApp.js : TodoApp.vue에 대한 store 설정
  |_views : HTML 화면 및 스크립트 하위 Vue 파일들
    |_About.vue : About 
    |_Home.vue : main index
    |_TodoApp.vue : TodoAPP
  |_.babelrc
  |_.gitignore : git에 등록 시 예외 파일들 목록
  |_App.vue : 서버에서 진입시 제일 먼저 최상위 컴포넌트.
  |_index.html
  |_main.js : 서버에서 제일 먼저 진입하는 js(여기에서 최상위Vue 등록)
  |_package-lock.json
  |_package.json
  |_postcss.config.js : postcss 설정 
  |_webpack.config.js : Webpack 설정(진입점, 결과물 등 관련)
```