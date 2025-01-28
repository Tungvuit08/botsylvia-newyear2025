const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "join",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "Mirai Team",
  description: "Thông báo bot hoặc người vào nhóm",
  dependencies: {
    "fs-extra": ""
  }
};

module.exports.run = async function({ api, event, Threads }) {
  const { join } = global.nodemodule["path"];
  const { threadID } = event;
  const data = (await Threads.getData(event.threadID)).data || {};
  const checkban = data.banOut || [];
  
  if (checkban.includes(checkban[0])) return;
  else if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    api.changeNickname(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? "𝙼𝚊𝚛𝚒𝚜 <3" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
    const messageID = await api.sendMessage(
      `Kết nối thành công với bot ${(!global.config.BOTNAME) ? "𝙼𝚊𝚛𝚒𝚜 <3" : global.config.BOTNAME} của ${global.config.AMDIN_NAME}, vui lòng sử dụng ${global.config.PREFIX}menu để xem toàn bộ lệnh của bot <3`,
      threadID
    );

    // Thu hồi tin nhắn sau 10 giây
    setTimeout(() => {
      api.unsendMessage(messageID.messageID);
    }, 20000); // 10000ms = 10s

  } else {
    try {
      const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
      let { threadName, participantIDs } = await api.getThreadInfo(threadID);

      const threadData = global.data.threadData.get(parseInt(threadID)) || {};
      const cachePath = path.join(__dirname, "cache", "joinGif");
      const pathGif = path.join(cachePath, `chao.gif`);

      var mentions = [], nameArray = [], memLength = [], i = 0;

      for (id in event.logMessageData.addedParticipants) {
        const userName = event.logMessageData.addedParticipants[id].fullName;
        nameArray.push(userName);
        mentions.push({ tag: userName, id });
        memLength.push(participantIDs.length - i++);
      }
      memLength.sort((a, b) => a - b);

      const defaultMsg = "Chào mừng {name} đã đến với {threadName}.\n{type} là thành viên thứ {soThanhVien} của nhóm\nNhớ tương tác đầy đủ nhé";
      let msg = threadData.customJoin || defaultMsg;
      msg = msg
        .replace(/\{name}/g, nameArray.join(', '))
        .replace(/\{type}/g, (memLength.length > 1) ? 'các bạn' : 'bạn')
        .replace(/\{soThanhVien}/g, memLength.join(', '))
        .replace(/\{threadName}/g, threadName);

      if (!existsSync(cachePath)) mkdirSync(cachePath, { recursive: true });

      let formPush;
      if (existsSync(pathGif)) {
        formPush = { body: msg, attachment: createReadStream(pathGif), mentions };
      } else {
        formPush = { body: msg, mentions };
      }

      const sentMessage = await api.sendMessage({body:msg,attachment: global.gojodev.splice(0, 1)
                              },  threadID);

      // Thu hồi tin nhắn sau 10 giây
      setTimeout(() => {
        api.unsendMessage(sentMessage.messageID);
      }, 10000); // 10000ms = 10s

    } catch (e) {
      return console.log(e);
    }
  }
};