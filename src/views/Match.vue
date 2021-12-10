<template>
  <div id='match'>
    <h1>{{drawInfo.name}}</h1>
    <h2>No{{this.$route.params.mno}} 試合結果入力</h2>

    <div class='match-status'>
      <label :class="[ gameStatus === 0 ? 'active' : 'nonactive' ]">
        <input type='radio' name='game-status'
          id='game-status-0' @click='onClickGameStatus'
          :checked="gameStatus === 0">
        試合開始前
      </label>
      <label :class="[ gameStatus === 1 ? 'active' : 'nonactive' ]">
        <input type='radio' name='game-status'
          id='game-status-1' @click='onClickGameStatus'
          :checked="gameStatus === 1">
        試合中
      </label>
      <label :class="[ gameStatus === 2 ? 'active' : 'nonactive' ]">
        <input type='radio' name='game-status'
          id='game-status-2' @click='onClickGameStatus'
          :checked="gameStatus === 2">
        試合終了
      </label>
    </div>

    <div class='match-info'>
      <table>
        <tbody>
          <tr>
            <td>{{playerNames[0]}} ・ {{playerNames[1]}}</td>
            <td>
              <select v-model='score[0]' @change='changeResult'>
                <option v-for='n of 9' :key='n'>{{n-1}}</option>
              </select>
              －
              <select v-model='score[1]' @change='changeResult'>
                <option v-for='n of 9' :key='n'>{{n-1}}</option>
              </select>
            </td>
            <td>{{playerNames[2]}} ・ {{playerNames[3]}}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class='match-result'>
      <template v-if='gameStatus === 2'>
        <template v-if='gameResult === 0'>
          <span>引き分け</span>
        </template>
        <template v-if='gameResult === 1'>
          <span>{{playerNames[0]}} ・ {{playerNames[1]}}の勝ち</span>
        </template>
        <template v-if='gameResult === 2'>
          <span>{{playerNames[2]}} ・ {{playerNames[3]}}の勝ち</span>
        </template>
      </template>
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

const GS_GAMESET = 2;

export default {
  props: {
    isGameSet: {
      type: Boolean,
      default: false,
    },
  },

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
    if (this.isGameSet === true) {
      this.gameStatus = GS_GAMESET;
    }
    else {
      this.gameStatus = this.drawInfo.draws[mno - 1].status;
    }
    this.gameResult = this.drawInfo.draws[mno - 1].result;
    this.changeResult();
  },

  methods: {
    onClickGameStatus(e) {
      this.gameStatus = Number(e.currentTarget.id.slice(-1));
      this.changeResult();
    },

    changeResult() {
      // 試合終了が選択されていた場合に勝敗をチェックする
      if (this.gameStatus === GS_GAMESET) {
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
      }
    },

    async onClickInput() {
      const cid = this.$route.params.cid;
      const did = this.$route.params.did;
      const mno = this.$route.params.mno;

      // 入力されたスコア情報と結果を取得する
      this.drawInfo.draws[mno - 1].score[0] = Number(this.score[0]);
      this.drawInfo.draws[mno - 1].score[1] = Number(this.score[1]);
      if (this.gameStatus === GS_GAMESET) {
        this.changeResult();
        this.drawInfo.draws[mno - 1].result = this.gameResult;
      }

      if ( (this.gameStatus === GS_GAMESET)
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
      await updateDrawInfo(cid, did, this.drawInfo);

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
@import '../css/style-table.css';

#match {
  text-align: center;

  .match-status {
    label {
      font-size: 16px;
    }
    .active {
      font-weight: bold;
      background-color: greenyellow;
    }
  }

  .match-info {
    margin: 10px auto;
  }

  .match-result {
    margin: 20px auto;
    font-size: 16px;

    span {
      background-color: greenyellow;
      padding: 3px;
      border: solid 1px;
    }
  }
}
</style>
