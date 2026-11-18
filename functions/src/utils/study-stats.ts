// 學習統計(揪團排行、讀書夥伴共用):讀 user_daily/{uid} = { "YYYY-MM-DD": {vocab, grammar, quiz} }(daily-log.js,裝置本地日期)。
// 一週 = 台灣時間週一~今天;連續天數 = 從今天(今天還沒讀就從昨天)往回數。
import { db } from "./firestore";

const DAY = 864e5;
export const twDay = (ms: number) => new Date(ms + 8 * 3600e3).toISOString().slice(0, 10);

export function weekDaysTW(now: number): string[] {
  const dow = (new Date(now + 8 * 3600e3).getUTCDay() + 6) % 7;   // 週一=0
  return Array.from({ length: dow + 1 }, (_, i) => twDay(now - (dow - i) * DAY));
}

// last_week = 上週一~上週日合計(讀書小屋排行週一歸零時,顯示「上週冠軍」用;同一份 user_daily,不多讀)
export interface StudyStats { today: number; week: number; days: number; streak: number; last_week: number }

export async function studyStats(uid: string, now: number): Promise<StudyStats> {
  const daily = (await db.doc(`user_daily/${uid}`).get()).data() || {};
  const sumOf = (d: string) => { const x = (daily as any)[d] || {}; return (x.vocab || 0) + (x.grammar || 0) + (x.quiz || 0); };
  const weekDays = weekDaysTW(now);
  const today = sumOf(twDay(now));
  let streak = 0;
  for (let i = today > 0 ? 0 : 1; i < 400; i++) { if (sumOf(twDay(now - i * DAY)) > 0) streak++; else break; }
  const lastMon = now - (weekDays.length + 6) * DAY;
  let lastWeek = 0;
  for (let i = 0; i < 7; i++) lastWeek += sumOf(twDay(lastMon + i * DAY));
  return { today, week: weekDays.reduce((n, d) => n + sumOf(d), 0), days: weekDays.filter(d => sumOf(d) > 0).length, streak, last_week: lastWeek };
}
