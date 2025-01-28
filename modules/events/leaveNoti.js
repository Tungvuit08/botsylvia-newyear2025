module.exports.config = {
    name: "leave",
    eventType: ["log:unsubscribe"],
    version: "1.0.0",
    credits: "Ranz",
    description: "Thông báo Bot hoặc người dùng rời khỏi nhóm",
    dependencies: {}
};

const checkttPath = __dirname + '/../commands/tt/';

module.exports.run = async function ({ api, event, Users, Threads }) {
    if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
    const { existsSync, readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const { threadID } = event;
    const moment = require("moment-timezone");
    const time = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:ss");
    const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
    const iduser = event.logMessageData.leftParticipantFbId;
    const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
    const type = (event.author == event.logMessageData.leftParticipantFbId) ? "Tự rời nhóm" : "Bị quản trị viên đá khỏi nhóm";

    if (existsSync(checkttPath + threadID + '.json')) {
        const threadData = JSON.parse(readFileSync(checkttPath + threadID + '.json'));
        const userData_week_index = threadData.week.findIndex(e => e.id == iduser);
        const userData_day_index = threadData.day.findIndex(e => e.id == iduser);
        const userData_total_index = threadData.total.findIndex(e => e.id == iduser);
        if (userData_total_index != -1) threadData.total.splice(userData_total_index, 1);
        if (userData_week_index != -1) threadData.week.splice(userData_week_index, 1);
        if (userData_day_index != -1) threadData.day.splice(userData_day_index, 1);
        writeFileSync(checkttPath + threadID + '.json', JSON.stringify(threadData, null, 4));
    }

    const msg = (typeof data.customLeave == "undefined")
        ? `🍓Tạm biệt ${name}\n${name} vừa ${type}\n━━━━━━━━━━━━━\n[ {time} ]`
        : data.customLeave;

    const finalMsg = msg
        .replace(/\{name}/g, name)
        .replace(/\{type}/g, type)
        .replace(/\{iduser}/g, iduser)
        .replace(/\{time}/g, time);

    return api.sendMessage({ body: finalMsg,attachment: global.gojodev.splice(0, 1)
                              },  threadID, (error, messageInfo) => {
        if (error) return console.log(error);
        setTimeout(() => {
            api.unsendMessage(messageInfo.messageID);
        }, 10000);
    });
};