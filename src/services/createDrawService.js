// 乱数表
const drawTable = [
  [ // 4人
    [1,2,3,4],
    [1,3,2,4],
    [1,4,2,3],
    [1,2,3,4],
    [1,3,2,4],
    [1,4,2,3],
    [1,2,3,4],
    [1,3,2,4],
    [1,4,2,3],
  ],
  [ // 5人
    [1,2,3,4],
    [1,5,2,3],
    [1,4,2,5],
    [1,3,4,5],
    [2,4,3,5],
    [1,4,2,3],
    [1,3,2,5],
    [1,2,4,5],
    [1,5,3,4],
    [2,3,4,5],
    [1,3,2,4],
    [1,2,3,5],
    [1,5,2,4],
    [1,4,3,5],
    [2,5,3,4],
  ],
  [ // 6人
    [1,2,3,4],
    [1,3,5,6],
    [2,5,4,6],
    [1,4,2,3],
    [1,5,2,6],
    [3,6,4,5],
    [1,6,2,4],
    [1,2,3,5],
    [3,4,5,6],
    [1,3,2,4],
    [1,5,3,6],
    [2,6,4,5],
    [1,4,2,5],
    [1,6,2,3],
    [3,5,4,6],
  ],
  [ // 7人
    [1,2,3,4],
    [1,5,6,7],
    [2,3,4,5],
    [1,2,6,7],
    [3,4,5,6],
    [1,3,4,7],
    [2,5,6,7],
    [1,2,4,5],
    [1,3,6,7],
    [2,3,4,7],
    [1,2,5,6],
    [3,4,5,6],
    [1,2,3,7],
    [4,5,6,7],
    [1,2,3,4],
    [1,5,6,7],
    [2,3,4,5],
    [1,2,6,7],
    [3,4,5,6],
    [1,3,5,7],
  ],
  [ // 8人
    [1,2,3,4],
    [5,6,7,8],
    [1,2,3,5],
    [4,6,7,8],
    [1,2,5,6],
    [3,4,7,8],
    [1,4,6,7],
    [2,3,5,8],
    [4,5,7,8],
    [1,2,3,6],
    [1,4,5,8],
    [2,3,6,7],
    [1,3,7,8],
    [2,4,5,6],
    [2,3,7,8],
    [1,4,5,6],
    [2,3,4,7],
    [1,5,6,8],
    [1,3,4,5],
    [2,6,7,8],
  ],
];

export const createDraws = (playerNum, courtNum) => {
  let draws = [];
  const pNumIndex = playerNum - 4;
  const drawsNum = drawTable[pNumIndex].length;

  for(let i=0; i<drawsNum; i++) {
    let tmpDraws = {
      mno: -1,
      status: 0,
      court: -1,
      players: [-1, -1, -1, -1],
      result: -1, // 0:引き分け 1:P1の勝ち 2:P2の勝ち
      score: [0, 0],
    };
    tmpDraws.mno = i + 1;
    if (i < courtNum) {
      tmpDraws.status = 1;
      tmpDraws.court = i % courtNum;
    }
    const index = i % drawTable[pNumIndex].length;
    tmpDraws.players[0] = drawTable[pNumIndex][index][0] - 1;
    tmpDraws.players[1] = drawTable[pNumIndex][index][1] - 1;
    tmpDraws.players[2] = drawTable[pNumIndex][index][2] - 1;
    tmpDraws.players[3] = drawTable[pNumIndex][index][3] - 1;

    draws[i] = tmpDraws;
  }

  return draws;
};
