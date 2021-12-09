<template>
  <div id='result'>
    <h1>{{drawInfo.name}}</h1>
    <h2>試合結果</h2>

    <table class='result'>
      <thead>
        <th>No</th>
        <th colspan='3'>スコア</th>
      </thead>
      <tbody>
        <tr
          v-for='(draws, index) in drawInfo.draws' :key='index'
          :id='"match-number-" + draws.mno' @click='onClickChangeScore'
        >
          <template v-if='draws.status === 2'>
            <td>{{draws.mno}}</td>
            <td>{{playerNames[draws.players[0]]}} ・ {{playerNames[draws.players[1]]}}</td>
            <td>{{draws.score[0]}} － {{draws.score[1]}}</td>
            <td>{{playerNames[draws.players[2]]}} ・ {{playerNames[draws.players[3]]}}</td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getDocInfo } from '@/services/firebaseService';

export default {
  data() {
    return {
      drawInfo: {},
      courtInfo: {},
      playerNames: [],
      onGamePlayers: [],
    };
  },

  async created() {
    const cid = this.$route.params.cid;
    const did = this.$route.params.did;
    const docInfo = await getDocInfo(cid, did);
    const playerInfo = docInfo.playerInfo;

    this.courtInfo = docInfo.courtInfo;
    this.drawInfo = docInfo.drawInfo;

    for (let i=0; i<playerInfo.num; i++) {
      this.playerNames[i] = playerInfo.players[i].name;
    }
  },

  methods: {
    onClickChangeScore(e) {
      const cid = this.$route.params.cid;
      const did = this.$route.params.did;
      const mno = e.currentTarget.id.slice(-1);
      this.$router.push({ name: 'Match', params: {cid, did, mno} });
    }
  },
};
</script>

<style lang='scss'>
@import '../css/style-table.css';

#result {
  text-align: center;
  font-size: 12px;
}
</style>
