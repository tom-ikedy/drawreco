<template>
  <div id='match'>
    <h1>{{drawInfo.name}}</h1>
    <h2>No{{this.$route.params.mno}} 試合結果入力</h2>

    <div class='match-status'>
      <button
        id='game-status-0'
        :class="[ gameStatus === 0 ? 'active' : 'nonactive' ]"
        @click='onClickGameStatus'
      >
        試合開始前
      </button>
      <button
        id='game-status-1'
        :class="[ gameStatus === 1 ? 'active' : 'nonactive' ]"
        @click='onClickGameStatus'
      >
        試合中
      </button>
      <button
        id='game-status-2'
        :class="[ gameStatus === 2 ? 'active' : 'nonactive' ]"
        @click='onClickGameStatus'
      >
        試合終了
      </button>
    </div>

    <div class='match-info'>
      <table>
        <tbody>
          <tr>
            <td>{{playerNames[0]}} ・ {{playerNames[1]}}</td>
            <td>
              <select v-model='score[0]' @change='changeScore'>
                <option value='0'>0</option>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
                <option value='6'>6</option>
              </select>
              －
              <select v-model='score[1]' @change='changeScore'>
                <option value='0'>0</option>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
                <option value='6'>6</option>
              </select>
            </td>
            <td>{{playerNames[2]}} ・ {{playerNames[3]}}</td>
          </tr>
          <tr>
            <td>
              <button
                id='game-result-1'
                :class="[ gameResult === 1 ? 'active' : 'nonactive' ]"
                @click='onClickGameResult'
              >
                勝ち
              </button>
              <button
                id='game-result-2'
                :class="[ gameResult === 2 ? 'active' : 'nonactive' ]"
                @click='onClickGameResult'
              >
                負け
              </button>
            </td>
            <td>
              <button
                id='game-result-0'
                :class="[ gameResult === 0 ? 'active' : 'nonactive' ]"
                @click='onClickGameResult'
              >
                引き分け
              </button>
            </td>
              <button
                id='game-result-2'
                :class="[ gameResult === 2 ? 'active' : 'nonactive' ]"
                @click='onClickGameResult'
              >
                勝ち
              </button>
              <button
                id='game-result-1'
                :class="[ gameResult === 1 ? 'active' : 'nonactive' ]"
                @click='onClickGameResult'
              >
                負け
              </button>
            <td></td>
          </tr>
        </tbody>
      </table>
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
      score: [0, 0],
      gameStatus: 0,
      gameResult: 0,
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
    this.gameStatus = this.drawInfo.draws[mno - 1].status;
    this.gameResult = this.drawInfo.draws[mno - 1].result;
  },

  methods: {
    onClickGameStatus(e) {
      this.gameStatus = Number(e.currentTarget.id.slice(-1));
    },

    onClickGameResult(e) {
      this.gameResult = Number(e.currentTarget.id.slice(-1));
    },

    changeScore() {
      // 入力されたスコアで勝敗をチェックする
      if (this.score[0] > this.score[1]) {
        // P1の勝ち
        this.gameResult = 1;
      }
      else if (this.score[0] < this.score[1]) {
        // P2の勝ち
        this.gameResult = 2;
      }
      else {
        // 引き分け
        this.gameResult = 0;
      }
    },

    onClickInput() {
      const cid = this.$route.params.cid;
      const did = this.$route.params.did;
      const mno = this.$route.params.mno;

      // 入力されたスコア情報と結果を取得する
      this.drawInfo.draws[mno - 1].score[0] = Number(this.score[0]);
      this.drawInfo.draws[mno - 1].score[1] = Number(this.score[1]);
      this.changeScore();
      this.drawInfo.draws[mno - 1].result = this.gameResult;

      if ( (this.gameStatus === 2)
        && (this.gameStatus !== this.drawInfo.draws[mno - 1].status) ) {
        // 試合終了に設定された時、次に試合開始となるドローを設定する
        for (let i=0; i<this.drawInfo.draws.length; i++) {
          if (this.drawInfo.draws[i].status === 0) {
            // 試合開始前のドローを検出したので、試合開始に設定する
            this.drawInfo.draws[i].status = 1;
            this.drawInfo.draws[i].court = this.drawInfo.draws[mno - 1].court;
            break;
          }
        }
      }
      this.drawInfo.draws[mno - 1].status = Number(this.gameStatus);

      // Firebaseのドロー情報を更新する
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

<style lang='scss'>
#match {
  text-align: center;

  table {
    margin: 3px auto;
    table-layout: fixed;
  }

  td {
    border: none;
    background-color: #FFFFFF;
  }
}

.match-info {
  margin: 10px auto;
}

.active {
  font-weight: bold;
  background-color: #8eff8e;
}
</style>
