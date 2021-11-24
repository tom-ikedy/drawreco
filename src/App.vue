<template>
  <div id="app">
    <div id="header">
      <div id="logo">
        <!--
        <img src="TODO">
        -->
        <router-link to="/">DrawReco</router-link>
      </div>
      <div id="nav">
        <ul id="nav-item">
          <li><router-link to="/create-draw">ドロー作成</router-link></li>
          <!--
          <li><router-link to="/login">ログイン</router-link></li>
          <li><router-link to="/RegUser">ユーザー登録</router-link></li>
          -->
        </ul>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#header {
  text-align: left;

  #logo {
    /* box */
    margin: 3px 0px;
    padding: 0px 10px;
    background-color: #EFEFEF;
  
    /* text */
    font-size: 40px;
    font-weight: 900;
    color: green;

    a {
      color: green;
    }
  } /* #logo */

  #nav-item {
    /* flexbox */
    display: inline-flex;
    flex-flow: row wrap;
  
    /* box */
    margin: 0px;
    padding: 0px;

    li {
      /* box */
      margin: 0px 2px 0px 0px;
      border: 2px ridge green;
      padding: 2px 5px;
      width: 120px;
      background-color: #8eff8e;
    
      /* list */
      list-style: none;
    
      /* text */
      color: #7F7F7F;
      text-align: center;
      text-decoration: none;
    } /* li */

    a {
      &:hover {
        /* text */
        font-weight: bold;
      }
      
      &.router-link-exact-active {
        /* text */
        color: #000000;
        font-weight: bold;
      }
    }
  } /* #nav-item */
}
</style>
