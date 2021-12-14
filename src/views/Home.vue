<template>
  <div id="home">
    <div id="homelogo">
      DrawRecoへようこそ！
    </div>
    <p>
      DrawRecoは以下ができる<br>
      Webサービスです
      <ul>
        <li>試合の組み合わせ作成<br>(DRAW creation)</li>
        <li>試合結果の記録<br>(score RECOrd)</li>
      </ul>
    </p>
    <p>
      登録不要、かつ無料で利用できます
    </p>

    <div>
      <div>
        <router-link :to="{ name: 'CreateDraw', params: {cid: 0} }">新規ドロー作成する</router-link>
      </div>
    </div>
  </div>
</template>

<style lang='scss'>
#home {
  font-size: 1.3rem;
}

#homelogo {
  margin: 50px 0;
  font-size: 2rem;
}

#home ul {
  padding: 0;
}

#home ul li {
  list-style-position: inside;
}
</style>
