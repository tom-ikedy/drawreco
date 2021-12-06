<template>
  <div id='match'>
    <h1>{{drawInfo.name}}</h1>
    <h2>No{{this.$route.params.mno}} 試合結果入力</h2>
    <div class='match-status'>
      <button
        id='game-status-0'
        :class="[ activeButton === 0 ? 'active' : 'nonactive' ]"
        @click='onClickGameStatus'
      >
        試合開始前
      </button>
      <button
        id='game-status-1'
        :class="[ activeButton === 1 ? 'active' : 'nonactive' ]"
        @click='onClickGameStatus'
      >
        試合中
      </button>
      <button
        id='game-status-2'
        :class="[ activeButton === 2 ? 'active' : 'nonactive' ]"
        @click='onClickGameStatus'
      >
        試合終了
      </button>
    </div>
    <div class='match-info'>
      {{playerNames[0]}} ・ {{playerNames[1]}}
      <span class='score'>
        <input
          type='number'
          :min=scoreMin
          :max=scoreMax
          class='score-input'
          v-model='score[0]'
        >
      </span>
        －  
      <span class='score'>
        <input
          type='number'
          :min=scoreMin
          :max=scoreMax
          class='score-input'
          v-model='score[1]'
        >
      </span>
      {{playerNames[2]}} ・ {{playerNames[3]}}
    </div>
    <div class='button-area'>
      <button
        type='button'
        id='button1'
        @click='onClickInput'
      >
        入力する
      </button>
      <button
        type='button'
        id='button1'
        @click='onClickCancel'
      >
        キャンセル
      </button>
    </div>
  </div>
</template>

<script>
import { getDocInfo, updateDrawInfo } from '@/services/firebaseService';

export default {
  data() {
    return {
      drawInfo: {},
      playerNames: [],
      scoreMin: 0,
      scoreMax: 8,
      score: [0, 0],
      activeButton: 0,
    };
  },

  async created() {
    const cid = this.$route.params.cid;
    const did = this.$route.params.did;
    const mno = this.$route.params.mno;
    const docInfo = await getDocInfo(cid, did);
    const playerInfo = docInfo.playerInfo;

    this.drawInfo = docInfo.drawInfo;
    this.score = [...this.drawInfo.draws[mno - 1].score];

    const pIndex = this.drawInfo.draws[mno - 1].players;

    this.playerNames[0] = playerInfo.players[pIndex[0]].name;
    this.playerNames[1] = playerInfo.players[pIndex[1]].name;
    this.playerNames[2] = playerInfo.players[pIndex[2]].name;
    this.playerNames[3] = playerInfo.players[pIndex[3]].name;
    this.activeButton = this.drawInfo.draws[mno - 1].status;
  },

  methods: {
    onClickGameStatus(e) {
      this.activeButton = Number(e.currentTarget.id.slice(-1));
    },
    onClickInput() {
      const cid = this.$route.params.cid;
      const did = this.$route.params.did;
      const mno = this.$route.params.mno;

      this.drawInfo.draws[mno - 1].score[0] = Number(this.score[0]);
      this.drawInfo.draws[mno - 1].score[1] = Number(this.score[1]);

      if ( (this.activeButton === 2)
        && (this.activeButton !== this.drawInfo.draws[mno - 1].status) ) {
        // 試合終了に設定された時
        for (let i=0; i<this.drawInfo.draws.length; i++) {
          if (this.drawInfo.draws[i].status === 0) {
            // 試合開始前の場合、試合開始に設定する
            this.drawInfo.draws[i].status = 1;
            this.drawInfo.draws[i].court = this.drawInfo.draws[mno - 1].court;
            break;
          }
        }
      }
      this.drawInfo.draws[mno - 1].status = Number(this.activeButton);

      updateDrawInfo(cid, did, this.drawInfo);

      // 前のページに戻る
      this.$router.go(-1);
    },
    onClickCancel() {
      // 前のページに戻る
      this.$router.go(-1);
    },
  },
};
</script>

<style>
#match {
  text-align: center;
}

.match-info {
  margin: 10px auto;
}

.score-input {
  width: 25px;
}

.active {
  font-weight: bold;
  background-color: #8eff8e;
}
</style>
