import { getFirestore, collection, doc, addDoc, getDoc, updateDoc } from "firebase/firestore";
import { createDraws } from '@/services/createDrawService';

/*
 * Create
 */ 

export const createDraw = async (cid, drawName, courtNum, playerNum) => {
  // firestoreのドキュメントにドローを追加する
  const db = getFirestore();
  const colname = 'circle-' + cid;
  const col = collection(db, colname);

  // コート情報を作成
  let courtNames = {};
  for (let i = 0; i<courtNum; i++) {
    const no = i + 1;
    courtNames[i] = no + '番コート';
  }
  const courtInfo = {};
  courtInfo.num = courtNum;
  courtInfo.names = courtNames;

  // ドロー情報を作成
  const drawInfo = {};
  drawInfo.name = drawName;
  drawInfo.status = '試合中';
  // TODO calculate draw number from firestore circle-0 -> info -> drawNum
  drawInfo.no = 0;
  drawInfo.draws = createDraws(playerNum, courtNum);

  // プレイヤー情報を作成
  const playerInfo = {};
  const players = [];
  for (let i = 0; i<playerNum; i++) {
    players[i] = {name: 'ゲスト' + String(i + 1), status: '参加中'};
  }
  playerInfo.num = playerNum;
  playerInfo.players = players;

  // firestoreにドキュメントを追加
  const docRef = await addDoc(col, {
    courtInfo,
    drawInfo,
    playerInfo,
  });

  return docRef.id;
};

/*
 * Get
 */

const getDrawDoc = async (cid, did) => {
  // circle-XコレクションのDrawドキュメントを取得する
  const db = getFirestore();
  const docRef = doc(db, 'circle-' + cid, did);

  return await getDoc(docRef);
};

export const getDrawName = async (cid, did) => {
  // firestoreのドキュメントからドロー名を取得する
  const docSnap = await getDrawDoc(cid, did);
  const { drawInfo } = docSnap.data();

  return drawInfo.name;
};

export const getDrawInfo = async (cid, did) => {
  // firestoreのドキュメントからドロー情報を取得する
  const docSnap = await getDrawDoc(cid, did);
  const { drawInfo } = docSnap.data();

  return drawInfo;
};

export const getPlayerInfo = async (cid, did) => {
  // firebaseのドキュメントからプレイヤー情報を取得する
  const docSnap = await getDrawDoc(cid, did);
  const { playerInfo } = docSnap.data();

  return playerInfo;
};

export const getDocInfo = async (cid, did) => {
  // firebaseのドキュメントの全ての情報を取得する
  const docSnap = await getDrawDoc(cid, did);
  const docInfo = docSnap.data();

  return docInfo;
};

/*
 * Update
 */ 

export const updatePlayerInfo = async (cid, did, playerInfo) => {
  // firebaseのドキュメントのプレイヤー情報を更新する
  const db = getFirestore();
  const docRef = doc(db, 'circle-' + cid, did);

  await updateDoc(docRef, {playerInfo});
};
