<template>
  <div id='setting'>
    <h1>{{drawname}}</h1>
    <h2>設定</h2>

    <div>
      <table>
        <thead>
          <th>項目</th>
          <th>設定</th>
        </thead>
        <tbody>
          <tr>
            <td>ドロー名</td>
            <td><input v-model='drawInfo.name'></td>
          </tr>
          <tr>
            <td>ランキング表示</td>
            <td>
              <select v-model='rankBorder'>
                <option v-for='n of playerNum' :key='n'>{{n}}</option>
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
      drawname: '',
      docInfo: {},
      drawInfo: {},
      playerInfo: {},
      playerNum: 0,
      rankBorder: 0,
    };
  },

  async created() {
    const cid = this.$route.params.cid;
    const did = this.$route.params.did;
    this.docInfo = await getDocInfo(cid, did);

    this.rankBorder = this.docInfo.config.rankBorder;
    this.drawInfo = this.docInfo.drawInfo;
    this.drawname = this.drawInfo.name;
    this.playerInfo = this.docInfo.playerInfo;
    this.playerNum = Number(this.playerInfo.num);
  },

  methods: {
    onClickSet() {
      const cid = this.$route.params.cid;
      const did = this.$route.params.did;
      // Firebaseのドキュメント情報を更新する
      this.drawInfo.name = this.drawname;
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
@import '../css/style-table.css';

#setting {
  text-align: center;

  .draw-delete {
    margin: 100px 0 0 0;
    
    button {
      color: red;
    }
  }
}
</style>
