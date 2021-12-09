<template>
  <div id='draw'>
    <h1>{{drawInfo.name}}</h1>
    <h2>ドロー</h2>

    <template v-if='mno !== -1'>
      <div class='ongame-draws'>
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
            <tr v-for='(name, index) in courtInfo.names' :key='index'>
              <template v-if='courtInfo.num !== 1'>
                <td>{{courtInfo.names[index]}}</td>
              </template>
              <td @click='onClickMatch(mno)'>{{mno}}</td>
              <td @click='onClickMatch(mno)'>{{onGamePlayers[index][0]}} ・ {{onGamePlayers[index][1]}}</td>
              <td @click='onClickMatch(mno)'>{{onGamePlayers[index][2]}} ・ {{onGamePlayers[index][3]}}</td>
              <td @click='onClickGameSet' class='gameset'>
                <button>試合<br>終了</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class='next-draws'>
        <h3>NEXT</h3>
        <table>
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
      </div>
    </template>

    <template v-else>
      <div class='all-game-completed'>
        全試合終了
      </div>
    </template>
  </div>
</template>

<script>
import { getDocInfo } from '@/services/firebaseService';

const GS_ONGAME = 1;

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
        const currentDraw = this.drawInfo.draws.find((v) => v.status === GS_ONGAME);
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
    onClickGameSet() {
      this.$router.push({name: 'Match', params: {cid: this.cid, did: this.did, mno: this.mno, isGameSet: true} });
    },
    onClickMatch(mno) {
      this.$router.push({name: 'Match', params: {cid: this.cid, did: this.did, mno} });
    },
  },
};
</script>

<style lang='scss'>
@import '../css/style-table.css';

#draw {
  text-align: center;
  font-size: 12px;
}

.gameset {
  background-color: #FFFFFF00;
  border-style: none none none solid;

  button {
    margin: 5px 0;
    line-height: 110%;
  }
}

.next-draws {
  margin: 30px auto;
}

.all-game-completed {
  font-size: 20px;
}
</style>
