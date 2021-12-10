<template>
  <div id='app'>
    <div id='header'>
      <div id='logo'>
        <router-link to='/'>DrawReco</router-link>
      </div>
      <nav id='nav'>
        <ul id='nav-menu'>
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
      </nav>
    </div>
    <div id='header-space'></div>
    <router-view/>
    <footer id='footer'>
      <div id='version'>DrawReco Version 0.0.1 (alpha version)</div>
      <!-- <div id='copyright'>© 2021-2022 Tomoya Ikeda All rights reserved.</div> -->
    </footer>
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
h1, h2, h3, h4 {
  border-width: 2px;
  border-style: none none ridge none;
  border-color: yellowgreen;
}

h1 { margin: 3% 5%; }
h2 { margin: 3% 10%; }
h3 { margin: 3% 15%; }

body {
  margin: 0;
}

#app {
  text-align: center;

  background-image: url(img/header.png);
  background-repeat: repeat;
  background-position: center 80px;
  background-size: contain;
  background-color: #FFF;

  #header {
    position: fixed;
    top: 0;
    width: 100%;
    border-bottom: solid 1px green;

    background-image: url(img/header.png);
    background-repeat: repeat-y;
    background-position: center;
    background-size: cover;
    background-color: #FFFFFFFF;

    #logo {
      /* text */
      font-size: 32px;
      font-weight: bold;

      a {
        color: green;
      }
    } /* #logo */

    #nav {
      #nav-menu {
        /* flexbox */
        display: flex;

        /* box */
        margin: 0px;
        padding: 0px 0px 10px 0px;

        li {
          /* box */
          margin: 0px 2px 0px 0px;
          border: 2px ridge green;
          padding: 2px 5px;
          width: 125px;
          background-color: greenyellow;
          flex-shrink: 0;

          /* list */
          list-style: none;

          /* text */
          color: #7F7F7F;
          text-align: center;
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
        } /* a */
      } /* #nav-menu */
    } /* nav */
  } /* #header */

  #header-space {
    top: 0;
    height: 85px;
  }

  #footer {
    margin: 50px 0 0 0;

    #version,#copyright {
      text-align: right;
      font-size: 12px;
    }
  }
}

@media (min-width: 450px) {
  #nav-menu {
    flex-flow: row nowrap;
    justify-content: center;
  }
}

@media (max-width: 450px) {
  #nav {
    flex-flow: row nowrap;
    justify-content: flex-start;
    overflow: auto;
  }
}
</style>
