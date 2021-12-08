<template>
  <div id='setting'>
    <h1>{{drawInfo.name}}</h1>
    <h2>設定</h2>

    <div>
      <table>
        <thead>
          <th>項目</th>
          <th>設定</th>
        </thead>
        <tbody>
          <tr>
            <td>ランキング表示</td>
            <td>
              <select v-model='rankBorder'>
                <option v-for='(player, index) in playerInfo.players' :key='index'>
                  {{index + 1}}
                </option>
              </select>
              位まで
            </td>
          </tr>
        </tbody>
      </table>

      <div>
        <button @click='onClickSet'>設定</button>
        <button @click='onClickCancel'>キャンセル</button>
      </div>
    </div>

    <div class='draw-delete'>
      <button @click='onClickDeleteDraw'>
        このドローを削除する
      </button>
    </div>
  </div>
</template>

<script>
import { getDocInfo, updateDocInfo } from '@/services/firebaseService';
import { deleteDraw } from '@/services/DrawRecoLib.js';

export default {
  data() {
    return {
      docInfo: {},
      drawInfo: {},
      playerInfo: {},
      rankBorder: 0,
    };
  },

  async created() {
    const cid = this.$route.params.cid;
    const did = this.$route.params.did;
    this.docInfo = await getDocInfo(cid, did);

    this.rankBorder = this.docInfo.config.rankBorder;
    this.drawInfo = this.docInfo.drawInfo;
    this.playerInfo = this.docInfo.playerInfo;
  },

  methods: {
    onClickSet() {
      const cid = this.$route.params.cid;
      const did = this.$route.params.did;
      // Firebaseのドキュメント情報を更新する
      this.docInfo.config.rankBorder = this.rankBorder;
      updateDocInfo(cid, did, this.docInfo);
      // 前のページに戻る
      this.$router.go(-1);
    },
    onClickCancel() {
      // 前のページに戻る
      this.$router.go(-1);
    },
    async onClickDeleteDraw() {
      // 削除するか確認
      const confirmMessage = 'このドローを削除してもよろしいですか？';
      const ans = window.confirm(confirmMessage);

      // ダイアログでOKされた場合に削除する
      if (ans === true) {
        // ドローを削除する
        await deleteDraw(this.$route.params.cid, this.$route.params.did);
        this.$router.push({ name: 'DrawList' });
      }
    },
  }
};
</script>

<style lang='scss'>
#setting {
  text-align: center;

  table {
    margin: 3px auto;
    table-layout: fixed;
  }

  th,td {
    padding: 5px 10px;
  }

  th {
    background-color: #8EFF8E;
  }

  td {
    background-color: #FFFFFF;
  }

  .draw-delete {
    margin: 100px auto;
    
    button {
      color: red;
    }
  }
}
</style>
