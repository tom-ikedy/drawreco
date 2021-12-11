<template>
  <div id='app'>
    <div id='header'>
      <div id='logo'>
        <router-link to='/'>DrawReco</router-link>
      </div>

      <div id='menu-button'>
        <div :class="[ menuOpen === true ? 'nav-open' : 'nav-close' ]" @click='onClickMenu'>
          <span></span><span></span><span></span>
        </div>
      </div>

      <div id='menu-list'>
        <nav id='g-nav' :class="[ menuOpen === true ? 'nav-open' : 'nav-close' ]">
          <div id='g-nav-list'>

            <!-- HOME画面で表示するメニュー -->
            <template v-if='(this.$route.params.cid === undefined)'>
              <ul class='g-nav-item'>
                <li><router-link :to="{ name: 'CreateDraw', params: {cid: 0} }">新規ドロー作成</router-link></li>
                <li><router-link :to="{ name: 'DrawList', params: {cid: 0} }">ドロー一覧</router-link></li>
              </ul>
              <!--
              <li><router-link to='/login'>ログイン</router-link></li>
              <li><router-link to='/RegUser'>ユーザー登録</router-link></li>
              -->
            </template>

            <!-- HOME画面以外で表示するメニュー -->
            <template v-else>
              <ul class='g-nav-item'>
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
              </ul>
            </template>

          </div>
        </nav>
      </div>

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
  data() {
    return {
      menuOpen: false,
    };
  },

  methods: {
    onClickMenu() {
      this.menuOpen = !this.menuOpen;
    }
  },

  watch: {
    '$route': function() {
      this.menuOpen = false;
    }
  },

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
body {
  margin: 0;
}

h1, h2, h3, h4 {
  border-width: 2px;
  border-style: none none ridge none;
  border-color: yellowgreen;
}

h1 { margin: 3% 5%; }
h2 { margin: 3% 10%; }
h3 { margin: 3% 15%; }

#app {
  text-align: center;

  background-image: url(img/background-image.png);
  background-repeat: repeat;
  background-position: center 35px;
  background-size: contain;
  background-color: #FFF;
}

#header {
  position: fixed;
  top: 0;
  width: 100%;
  border-bottom: solid 1px green;

  background-image: url(img/background-image.png);
  background-repeat: repeat-y;
  background-position: center;
  background-size: cover;
  background-color: #FFFFFF;
}

#footer {
  margin: 50px 0 0 0;
}

#version,#copyright {
  text-align: right;
  font-size: 12px;
}

#logo {
  font-size: 32px;
  font-weight: bold;
  padding: 5px;
}

#logo a {
  color: forestgreen;
}


/* ナビゲーションメニューリスト */
#menu-list .g-nav-item li {
  background-color: greenyellow;
  border: solid 1px green;
  border-radius: 10px;
  text-align: center;
}

.g-nav-item {
  display: flex;
}

.g-nav-item li {
  list-style: none;
}

@media (min-width: 450px) {
  #header {
    height: 100px;
  }

  #header-space {
    top: 0;
    height: 100px;
  }

  #logo {
    padding: 0;
  }

  #menu-list .g-nav-item {
    flex-flow: row nowrap;
    justify-content: center;
    overflow: auto;
    margin: 0;
    padding: 0;
  }

  #menu-list .g-nav-item li {
    margin: 0 10px;
    padding: 10px;
    width: 125px;
    flex-shrink: 0;
  }
}

@media (max-width: 450px) {
  #header {
    height: 60px;
  }

  #header-space {
    top: 0;
    height: 55px;
  }

  /* ナビゲーションメニューボタン */
  /* ボタン外側 */
  #menu-button div {
    position: fixed;
    z-index: 999;
    background: #999;
    cursor: pointer;
    top: 5px;
    right: 5px;
    width: 50px;
    height: 50px;
    border-radius: 10px;
  }

  /* ボタン内側 */
  #menu-button span {
    display: inline-block;
    transition: all .6s;
    position: absolute;
    left: 14px;
    height: 2px;
    border-radius: 5px;
    background: #FFF;
    width: 45%;
  }

    /* ボタン内側の白線3本＋文字 */
  #menu-button span:nth-of-type(1) { top:13px; }
  #menu-button span:nth-of-type(2) { top:19px; }
  #menu-button span:nth-of-type(3) { top:25px; }
  #menu-button span:nth-of-type(3)::after {
    /* .nav-open/.nav-close共通 */
    position: absolute;
    color: #fff;
    font-size: 0.6rem;
  }

  /* MENU閉じている時 */
  #menu-button .nav-close span:nth-of-type(3)::after {
    content:"MENU";/*3つ目の要素のafterにMenu表示を指定*/
    top:7px;
    left:-3px;
  }

  /* MENU開いている時 */
  #menu-button .nav-open span:nth-of-type(1) {
    top: 14px;
    left: 18px;
    transform: translateY(6px) rotate(-405deg);
    width: 30%;
  }
  #menu-button .nav-open span:nth-of-type(2) {
    opacity: 0;
  }
  #menu-button .nav-open span:nth-of-type(3){
    top: 26px;
    left: 18px;
    transform: translateY(-6px) rotate(405deg);
    width: 30%;
  }
  #menu-button .nav-open span:nth-of-type(3)::after {
    content:"CLOSE";/*3つ目の要素のafterにClose表示を指定*/
    transform: translateY(0) rotate(-45deg);
    top:7px;
    left:2px;
  }

  /* ナビゲーションメニューリスト */
  #menu-list #g-nav {
    border-width: 1px;
    border-style: none none none solid;
    border-color: green;
  }

  #menu-list .g-nav-item {
    flex-flow: column nowrap;
    padding: 0 0 0 10px;
  }

  #menu-list .g-nav-item li {
    margin: 10px 0;
    padding: 10px;
    width: 35%;
  }

  #menu-list nav {
    position: fixed;
    z-index: 990;
    top: 0;
    width: 60%;
    height: 100vh;
    background-color: #EEE;
    transition: all 0.6s;
    text-align: left;
  }

  /* MENUを閉じている時は右側の枠外に移動する */
  #menu-list .nav-close { right: -120%; }
  /* MENUを開いている時は枠内に移動する */
  #menu-list .nav-open { right: 0; }

  /* メニューアイテムのスクロールが必要な時の設定 */
  #g-nav-list {
    position: fixed;
    z-index: 990;
    width: 100%;
    height: 100vh;
    overflow: auto;
    margin: 10px;
  }
}
</style>
