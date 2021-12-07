<template>
  <div id='draw'>
    <h1>{{drawInfo.name}}</h1>
    <h2>ドロー</h2>

    <template v-if='mno !== -1'>
      <h3>試合中</h3>

      <table>
        <thead>
          <template v-if='courtInfo.num !== 1'>
            <th>コート</th>
          </template>
          <th>No</th>
          <th colspan='2'>組み合わせ</th>
        </thead>
        <tbody>
          <tr v-for='(name, index) in courtInfo.names' :key='index' @click='onClickMatch(mno)'>
            <template v-if='courtInfo.num !== 1'>
              <td>{{courtInfo.names[index]}}</td>
            </template>
            <td>{{mno}}</td>
            <td>{{onGamePlayers[index][0]}} ・ {{onGamePlayers[index][1]}}</td>
            <td>{{onGamePlayers[index][2]}} ・ {{onGamePlayers[index][3]}}</td>
            <td class='gameset'>
              <button>試合<br>終了</button>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>NEXT</h3>
      <table class='draws'>
        <thead>
          <th>No</th>
          <th colspan='2'>組み合わせ</th>
        </thead>
        <tbody>
          <tr v-for='(draws, index) in drawInfo.draws' :key='index' @click='onClickMatch(draws.mno)'>
            <template v-if='draws.status === 0'>
              <td>{{draws.mno}}</td>
              <td>{{playerNames[draws.players[0]]}} ・ {{playerNames[draws.players[1]]}}
              <td>{{playerNames[draws.players[2]]}} ・ {{playerNames[draws.players[3]]}}</td>
            </template>
          </tr>
        </tbody>
      </table>
    </template>

    <template v-else>
      <div class='game-digested'>
        全試合終了
      </div>
    </template>
  </div>
</template>

<script>
import { getDocInfo } from '@/services/firebaseService';

export default {
  data() {
    return {
      cid: 0,
      did: 0,
      mno: 0,
      drawInfo: {},
      courtInfo: {},
      playerNames: [],
      onGamePlayers: [],
    };
  },

  async created() {
    this.cid = this.$route.params.cid;
    this.did = this.$route.params.did;
    const docInfo = await getDocInfo(this.cid, this.did);
    const playerInfo = docInfo.playerInfo;

    this.courtInfo = docInfo.courtInfo;
    this.drawInfo = docInfo.drawInfo;

    for (let i=0; i<playerInfo.num; i++) {
      this.playerNames[i] = playerInfo.players[i].name;
    }

    this.updateCurrent();
  },

  methods: {
    updateCurrent() {
      for (let i=0; i<this.courtInfo.num; i++) {
        const currentDraw = this.drawInfo.draws.find((v) => v.status === 1);
        if (currentDraw !== undefined) {
          this.onGamePlayers[i] = [
            this.playerNames[currentDraw.players[0]],
            this.playerNames[currentDraw.players[1]],
            this.playerNames[currentDraw.players[2]],
            this.playerNames[currentDraw.players[3]],
          ];
          this.mno = currentDraw.mno;
        }
        else {
          this.onGamePlayers[i] = ['', '', '', ''];
          this.mno = -1;
        }
      }
    },
    onClickMatch(mno) {
      this.$router.push(`/${this.cid}/${this.did}/draw/${mno}`);
    },
  },
};
</script>

<style lang='scss'>
#draw {
  text-align: center;
  font-size: 12px;
}

.game-digested {
  font-size: 20px;
}

a {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

table {
  margin: 3px auto;
  border-collapse: collapse;
  table-layout: fixed;
}

th,td {
  /* box */
  border: 1px solid;
  padding: 5px 10px;
}

th {
  background-color: #8EFF8E;
}

td {
  white-space: pre-wrap;
  background-color: #E0FFE0;
  text-align: center;
}

.gameset {
  background-color: #FFFFFF;
}
</style>
