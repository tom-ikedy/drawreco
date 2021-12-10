<template>
  <div id='ranking'>
    <h1>{{drawInfo.name}}</h1>
    <h2>ランキング</h2>

    <table class='result'>
      <thead>
        <th>順位</th>
        <th>名前</th>
        <th>成績</th>
        <th>勝率</th>
      </thead>
      <tbody>
        <tr v-for='(rank, index) in rankInfo' :key='index'>
          <td>{{rank.rank}}</td>
          <td>{{rank.name}}</td>
          <td>{{rank.win}} 勝 {{rank.lose}} 敗 {{rank.tie}} 分</td>
          <td>{{rank.rate}} %</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getDocInfo } from '@/services/firebaseService';

const GAMESET = 2;
const P1WIN = 1;
const P2WIN = 2;

export default {
  data() {
    return {
      drawInfo: {},
      rankInfo: [],
    };
  },

  methods: {
    formatRankInfoArray(playerInfo) {
      const rankInfoFormat = {
        name: '',
        win : 0,
        lose: 0,
        tie : 0,
        rate: 0,
        rank: 0,
      };
      // 全プレイヤー名を取得する
      playerInfo.players.forEach((element, i) => {
        rankInfoFormat.name = element.name;
        this.rankInfo[i] = {...rankInfoFormat};
      });
    },

    countWinLoseTie(drawInfo) {
      // ドロー情報から勝/負/分を集計する。
      drawInfo.draws.forEach((element) => {
        if (element.status === GAMESET) {
          // 試合終了の場合に結果をチェック、集計する
          if (element.result === P1WIN) {
            // P1の勝ち
            this.rankInfo[ element.players[0] ].win++;
            this.rankInfo[ element.players[1] ].win++;
            this.rankInfo[ element.players[2] ].lose++;
            this.rankInfo[ element.players[3] ].lose++;
          }
          else if (element.result === P2WIN) {
            // P2の勝ち
            this.rankInfo[ element.players[0] ].lose++;
            this.rankInfo[ element.players[1] ].lose++;
            this.rankInfo[ element.players[2] ].win++;
            this.rankInfo[ element.players[3] ].win++;
          }
          else {
            // 引き分け
            this.rankInfo[ element.players[0] ].tie++;
            this.rankInfo[ element.players[1] ].tie++;
            this.rankInfo[ element.players[2] ].tie++;
            this.rankInfo[ element.players[3] ].tie++;
          }
        }
      });
    },
  },

  async created() {
    const cid = this.$route.params.cid;
    const did = this.$route.params.did;
    const docInfo = await getDocInfo(cid, did);

    this.drawInfo = docInfo.drawInfo;

    this.formatRankInfoArray(docInfo.playerInfo);

    this.countWinLoseTie(this.drawInfo);

    // 勝率を計算する
    this.rankInfo.forEach((element) => {
      let rate = 0;
      const gameNum = element.win + element.lose + element.tie;
      if (gameNum !== 0) {
        rate = element.win * 100 / gameNum;
      }
      element.rate = Math.floor(rate * 10) / 10;
      element.rate = element.rate.toFixed(1);
    });

    // 勝率順にソートする
    this.rankInfo.sort(function(a, b) {
      return (Number(a.rate) > Number(b.rate)) ? -1 : 1;
    });

    // ランクを設定する
    this.rankInfo.forEach((element, i, rankInfo) => {
      element.rank = i + 1;
      // 同率順位の有無をチェック
      if ((i>=1) && (element.rate === rankInfo[i-1].rate)) {
        element.rank = rankInfo[i-1].rank;
      }
    });

    // ボーダー以上のランクだけを抽出する
    this.rankInfo = this.rankInfo.filter(rankInfo => rankInfo.rank <= docInfo.config.rankBorder);
  },
};
</script>

<style lang='scss'>
@import '../css/style-table.css';

#ranking {
  text-align: center;
}
</style>
