<template>
  <div id='app'>
    <div id='header'>
      <div id='logo'>
        <!--
        <img src='TODO'>
        -->
        <router-link to='/'>DrawReco</router-link>
      </div>
      <div id='nav'>
        <ul id='nav-item'>
          <!-- HOME画面で表示するメニュー -->
          <template v-if='(this.$route.params.cid === undefined)'>
            <li><router-link :to="{ name: 'CreateDraw', params: {cid: 0} }">新規ドロー作成</router-link></li>
            <li><router-link :to="{ name: 'DrawList', params: {cid: 0} }">ドロー一覧</router-link></li>
            <!--
            <li><router-link to='/login'>ログイン</router-link></li>
            <li><router-link to='/RegUser'>ユーザー登録</router-link></li>
            -->
          </template>

          <!-- HOME画面以外で表示するメニュー -->
          <template v-else>
            <!-- サークルページ（ゲスト以外）に表示するメニュー -->
            <template v-if='(this.$route.params.cid != 0)'>
              <li><router-link :to="{ name: 'Circle' }">サークルトップ</router-link></li>
            </template>

            <!-- 全員に表示するメニュー -->

              <!-- ドロー表示中のメニュー -->
              <template v-if='this.$route.params.did != undefined'>
                <li><router-link :to="{ name: 'Draw' }">ドロー</router-link></li>
                <li><router-link :to="{ name: 'Player' }">参加者</router-link></li>
                <li><router-link :to="{ name: 'Result' }">試合結果</router-link></li>
                <li><router-link :to="{ name: 'Ranking' }">ランキング</router-link></li>
                <li><router-link :to="{ name: 'Setting' }">設定</router-link></li>
              </template>

              <!-- ドロー表示中以外のメニュー -->
              <template v-else>
                <li><router-link :to="{ name: 'CreateDraw' }">新規ドロー作成</router-link></li>
                <li><router-link :to="{ name: 'DrawList' }">ドロー一覧</router-link></li>
              </template>
          </template>
        </ul>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export default {
  created() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('ログインしました', user.uid);
      } else {
        console.log('ログインしていません');

        signInAnonymously(auth) // 匿名ログインの実行
          .catch((error) => {
            // ログインに失敗したときの処理
            console.error('ログインエラー', error);
          });
      }
    });
  }
};
</script>

<style lang='scss'>
#header {
  text-align: center;

  #logo {
    /* box */
    margin: 3px 0px;
    padding: 0px 10px;
    background-color: #FFFFFF;
  
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
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
  
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

h1, h2, h3, h4 {
  background-color: #EFEFEF;
}
</style>
