<template>
  <div id='player'>
    <h1>{{drawName}}</h1>
    <h2>参加者</h2>

    <div class='button-area'>
      <template v-if='mode === "view"'>
        <button type='button' id='button1' @click='onClickEdit'>
          名前を変更する
        </button>
      </template>
      <template v-else>
        <button type='button' id='button1' @click='onClickEditComplete'>
          名前変更を終了する
        </button>
      </template>
    </div>

    <table class='player-list'>
      <thead>
        <th class='player-no'>番号</th>
        <th class='player-name'>名前</th>
        <!--
        <th class='player-status'>参加状況</th>
        -->
      </thead>
      <tbody>
        <tr v-for='(player, index) in playerInfo.players' :key='player.id'>
          <td>{{index + 1}}</td>
          <template v-if='mode === "view"'>
            <td>{{player.name}}</td>
          </template>
          <template v-else>
            <td>
              <input
                type='text'
                v-model='playerInfo.players[index].name'
              >
            </td>
          </template>
          <!--
          <td>{{player.status}}</td>
          -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getDrawName, getPlayerInfo, updatePlayerInfo } from '@/services/firebaseService';

export default {
  data() {
    return {
      drawName: '',
      playerInfo: {},
      playersClone: {},
      mode: 'view',
    };
  },

  async created() {
    const cid = this.$route.params.cid;
    const did = this.$route.params.did;
    this.drawName = await getDrawName(cid, did);

    // プレイヤー情報を取得
    this.playerInfo = await getPlayerInfo(cid, did);
  },

  methods: {
    onClickEdit() {
      // 更新モードに切り替え
      this.mode = 'edit';
      // プレイヤー情報のオブジェクト配列をコピー
      this.playersClone = this.playerInfo.players.map((obj) => Object.assign({}, obj));
    },
    onClickEditComplete() {
      // 表示モードに切り替え
      this.mode = 'view';

      // プレイヤー名が空欄の場合はデフォルトの名前にする
      this.playerInfo.players.forEach((element, i) => {
        if (element.name === '') {
          element.name = i + 1 + '番';
        }
      });

      // プレイヤー情報に変更がある場合はFirebaseのドキュメントを更新する
      if(JSON.stringify(this.playerInfo.players) !== JSON.stringify(this.playersClone)) {
        const cid = this.$route.params.cid;
        const did = this.$route.params.did;
        updatePlayerInfo(cid, did, this.playerInfo);
      }
    },
  },
};
</script>

<style lang='scss'>
@import '../css/style-table.css';

#player {
  text-align: center;
}

.player-no {
  width: 20%;
}

.player-name {
  width: 50%;
}

.player-status {
  width: 30%;
}

.button-area {
  margin: 20px 0px;
}
</style>
