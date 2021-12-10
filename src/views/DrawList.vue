<template>
  <div id="draw-list">
    <h1>ゲスト</h1>
    <h2>ドロー一覧</h2>

    <table>
      <thead>
        <th>作成日時</th>
        <th>名前</th>
        <th>コート数</th>
        <th>人数</th>
      </thead>
      <tbody>
        <tr v-for='(draw, index) in drawAll' :key='index' @click='onClickDraw(draw.did)'>
          <td>{{draw.dateStr}}</td>
          <td>{{draw.data.drawInfo.name}}</td>
          <td>{{draw.data.courtInfo.num}}面</td>
          <td>{{draw.data.playerInfo.num}}人</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getDrawAll } from '@/services/DrawRecoLib.js';

export default {
  data() {
    return {
      cid: '',
      circleInfo: {},
      drawAll: {},
    };
  },

  async created() {
    this.cid = this.$route.params.cid;
    this.drawAll = await getDrawAll(this.$route.params.cid);

    // 日付表示およびソート用に日付文字列を作成する
    this.drawAll.forEach((element) => {
      this.createDateString(element);
    });

    // 日付文字列でソートする
    this.drawAll.sort(function(a,b) {
      return (Number(a.dateForSort) > Number(b.dateForSort)) ? -1: 1;
    });
  },

  methods: {
    toDoubleDigits(num) {
      // 数値を文字列に変換する。1桁の場合は0埋めする。
      let numStr = String(num);
      if (numStr.length === 1) {
        numStr = '0' + numStr;
      }
      return numStr;
    },
    createDateString(draw) {
      // Timestampから日付文字列を生成する
      const week = ['日', '月', '火', '水', '木', '金', '土'];
      const date = draw.data.date.toDate();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayOfWeek = week[date.getDay()];
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      draw.dateStr = year + '/' + month + '/' + day + '(' + dayOfWeek + ')' + ' '
                      + this.toDoubleDigits(hours) + ':' + this.toDoubleDigits(minutes) + ':' + this.toDoubleDigits(seconds);
      draw.dateForSort = year + this.toDoubleDigits(month) + this.toDoubleDigits(day)
                          + this.toDoubleDigits(hours) + this.toDoubleDigits(minutes) + this.toDoubleDigits(seconds);
    },
    onClickDraw(did) {
      this.$router.push({ name: 'Draw', params: { cid: this.cid, did} });
    },
  },
};
</script>

<style lang='scss'>
@import '../css/style-table.css';

#draw-list {
  text-align: center;
}
</style>
