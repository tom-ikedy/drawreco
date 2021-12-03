<template>
  <div id='draw'>
    <h1>{{drawInfo.drawName}}</h1>
    <h2>ドロー</h2>

    <h3>試合中</h3>
    <table>
      <thead>
        <template v-if='courtInfo.num !== 1'>
          <th>コート</th>
        </template>
        <th>組み合わせ</th>
      </thead>
      <tbody>
        <tr v-for='(name, index) in courtInfo.names' :key='index'>
          <template v-if='courtInfo.num !== 1'>
            <td>{{courtInfo.names[index]}}</td>
          </template>
          <td>
            {{current[index][0]}} / {{current[index][1]}}
              －  
            {{current[index][2]}} / {{current[index][3]}}
          </td>
          <td class='gameset'>
            <button>試合終了</button>
          </td>
        </tr>
      </tbody>
    </table>

    <h3>NEXT</h3>
    <table class='draws'>
      <thead>
        <th>ターン</th>
        <th>組み合わせ</th>
      </thead>
      <tbody>
        <tr v-for='(draws, index) in drawInfo.draws' :key='index'>
          <template v-if='draws.status === ""'>
            <td>{{draws.turn}}</td>
            <td>
              {{playerNames[draws.players[0]]}} / {{playerNames[draws.players[1]]}}
                －  
              {{playerNames[draws.players[2]]}} / {{playerNames[draws.players[3]]}}
            </td>
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
      current: [],
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

    this.updateCurrent();
  },

  methods: {
    updateCurrent() {
      for (let i=0; i<this.courtInfo.num; i++) {
        const currentDraw = this.drawInfo.draws.find((v) => v.status === "試合中");
        this.current[i] = [
          this.playerNames[currentDraw.players[0]],
          this.playerNames[currentDraw.players[1]],
          this.playerNames[currentDraw.players[2]],
          this.playerNames[currentDraw.players[3]],
        ];
      }
    },
  },
};
</script>

<style>
table {
  border-collapse: collapse;
  table-layout: fixed;
}

caption {
  font-size: 20px;
  font-weight: bold;
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
