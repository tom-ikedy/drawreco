<template>
  <div class='create-draw'>
    <h1>ドロー作成</h1>

    <div class='create-draw-input'>
      <div class='item'>名前</div>
      <div>
        <input
          type='text'
          id='drawName'
          v-model='drawName'
        >
      </div>
    </div>

    <!--
    <div class='create-draw-input'>
      <div class='item'>試合形式</div>
      <div>
        <form id='gameEvent'>
          <label><input type='radio' name='gameEvent' value='singles'>シングルス</label>
          <label><input type='radio' name='gameEvent' value='doubles' checked>ダブルス</label>
        </form>
      </div>
    </div>
    -->

    <div class='create-draw-input'>
      <div class='item'>コート数</div>
      <div class='item2'>
        <input
          type='number'
          :min=courtNumMin
          :max=courtNumMax
          id='courtNum'
          v-model='courtNum' 
        >面
      </div>
    </div>

    <div class='create-draw-input'>
      <div class='item'>人数</div>
      <div>
        <input
          type='number'
          :min=playerNumMin
          :max=playerNumMax
          id='playerNum'
          v-model='playerNum' 
        >人
      </div>
    </div>

    <button type='button' @click='onClickCreate'>
      作成する
    </button>
  </div>
</template>

<script>
import { createDraw } from '@/services/firebaseService';

export default {
  data() {
    return {
      drawName: '',
      courtNum: 1,
      courtNumMin: 1,
      courtNumMax: 5,
      playerNum: 4,
      playerNumMin: 4,
      playerNumMax: 30,
      gameEvent: '',
    };
  },

  created() {
    const today = new Date();
    const month = today.getMonth() + 1;
    this.drawName = today.getFullYear() + '/' + month + '/' + today.getDate() + ' ドロー1';
  },

  methods: {
    async onClickCreate() {
      const cid = 0;
      /*
      // ラジオボタンで選択されている値を取得
      const gameEventRadio = document.getElementById('gameEvent');
      this.gameEvent = gameEventRadio.elements['gameEvent'].value;
      console.log(this.gameEvent);
      */
      /* TODO：試合種別とコート数とプレイヤー数の値チェック */
      /* TODO：firebaseからゲストCID取得 */
      const did = await createDraw(cid, this.drawName, this.courtNum, this.playerNum);
      this.$router.push({ name: 'Draw', params: {cid, did} });
    },
  },
};
</script>

<style>
.create-draw {
  text-align: center;

  button {
    margin: 10px auto;
  }
}

.create-draw-input {
  /* flexbox */
  display: flex;
  justify-content: center;

  /* box */
  margin: 10px 0px 10px 0px;
}

.item {
  /* box */
  width: 80px;
}
</style>
