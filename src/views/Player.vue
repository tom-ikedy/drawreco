<template>
  <div id='player'>
    <h1>{{drawName}}</h1>
    <h2>参加者一覧</h2>
    <table class='player-list'>
      <thead>
        <th class='player-no'>番号</th>
        <th class='player-name'>名前</th>
        <th class='player-status'>参加状況</th>
      </thead>
      <tbody>
        <tr v-for='(player, index) in playerInfo.players' :key='player.id'>
          <td>{{index + 1}}</td>
          <td>{{player.name}}</td>
          <td>{{player.status}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getDrawName, getPlayerInfo } from '@/services/firebaseService';

export default {
  data() {
    return {
      drawName: '',
      playerInfo: [],
    };
  },

  async created() {
    const cid = this.$route.params.cid;
    const did = this.$route.params.did;
    this.drawName = await getDrawName(cid, did);

    // プレイヤー情報を取得
    this.playerInfo = await getPlayerInfo(cid, did);
  },
};
</script>

<style>
table {
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
  background-color: #E0FFE0;
}
</style>
