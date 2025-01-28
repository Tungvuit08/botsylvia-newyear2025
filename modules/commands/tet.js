module.exports.config = {
	name: "tet",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "RST",
	description: "Đếm ngược tới Tết Âm dương",
	commandCategory: "Tiện ích",
	cooldowns: 5
}

    const moment = require("moment-timezone");
        const ngay = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
        const gio = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
  if (thu == 'Sunday') thu = '𝐶ℎ𝑢̉ 𝑁ℎ𝑎̣̂𝑡'
  if (thu == 'Monday') thu = '𝑇ℎ𝑢̛́ 𝐻𝑎𝑖 '
  if (thu == 'Tuesday') thu = '𝑇ℎ𝑢̛́ 𝐵𝑎'
  if (thu == 'Wednesday') thu = '𝑇ℎ𝑢̛́ 𝑇𝑢̛'
  if (thu == "Thursday") thu = '𝑇ℎ𝑢̛́ 𝑁𝑎̆𝑚'
  if (thu == 'Friday') thu = '𝑇ℎ𝑢̛́ 𝑆𝑎́𝑢'
  if (thu == 'Saturday') thu = '𝑇ℎ𝑢̛́ 𝐵𝑎̉𝑦'

module.exports.run = function ({ event, api }) {
    const t = Date.parse("january 29, 2025 00:00:00") - Date.parse(new Date());
    const seconds = Math.floor( (t/1000) % 60 );
    const minutes = Math.floor( (t/1000/60) % 60 );
    const hours = Math.floor( (t/(1000*60*60)) % 24 );
    const days = Math.floor( t/(1000*60*60*24) );

module.exports.run = function ({ event, api }) {
    const ti = Date.parse("january 1, 2025 00:00:00") - Date.parse(new Date());
    const s = Math.floor( (ti/1000) % 60 );
    const mi = Math.floor( (ti/1000/60) % 60 );
    const ho = Math.floor( (ti/(1000*60*60)) % 24 );
    const da = Math.floor( ti/(1000*60*60*24) );

    return api.sendMessage(`╭───────────⭓\n│📅「Thời gian còn lại cho │Tết Dương lịch」\n│» ${da} ngày ${ho} tiếng ${mi} phút │${s} giây «\n├────────⭔\n│📅 「Thời gian còn lại cho │Tết Âm lịch」\n│» ${days} ngày ${hours} tiếng ${minutes} phút │${seconds} giây «\n├────────⭔\n│HIện tại: ${thu} │${ngay}\n│${gio}\n╰───────────⭓`, event.threadID, event.messageID);
}
}