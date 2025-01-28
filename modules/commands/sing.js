const fs = require('fs');
const ytdl = require('@distube/ytdl-core');
const moment = require("moment-timezone");
const Youtube = require('youtube-search-api');
const { createReadStream, unlinkSync, statSync } = require("fs-extra");

async function downloadMusicFromYoutube(link, path) {
  var timestart = Date.now();
  if (!link) return 'Thiếu link';
  return new Promise((resolve, reject) => {
    ytdl(link, {
      filter: format =>
        format.quality == 'tiny' && format.audioBitrate == 128 && format.hasAudio == true
    }).pipe(fs.createWriteStream(path))
      .on("close", async () => {
        try {
          var data = await ytdl.getInfo(link);
          var result = {
            title: data.videoDetails.title,
            dur: Number(data.videoDetails.lengthSeconds),
            viewCount: data.videoDetails.viewCount,
            likes: data.videoDetails.likes,
            uploadDate: data.videoDetails.uploadDate,
            sub: data.videoDetails.author.subscriber_count,
            author: data.videoDetails.author.name,
            timestart: timestart
          };
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
  });
}

module.exports.config = {
  name: "sing",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "D-Jukie",
  description: "Phát nhạc thông qua link YouTube hoặc từ khoá tìm kiếm",
  commandCategory: "Tìm kiếm",
  usages: "[searchMusic]",
  cooldowns: 0,
};

module.exports.convertHMS = function (value) {
  const sec = parseInt(value, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - (hours * 3600)) / 60);
  let seconds = sec - (hours * 3600) - (minutes * 60);
  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  return (hours != '00' ? hours + ':' : '') + minutes + ':' + seconds;
};

module.exports.run = async function ({ api, event, args }) {
  const timeNow = moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss');
  if (args.length == 0 || !args) {
    return api.sendMessage("Phần tìm kiếm không được để trống!", event.threadID);
  }

  const keywordSearch = args.join(" ");
  const path = `${__dirname}/cache/sing-${event.senderID}.mp3`;

  if (fs.existsSync(path)) {
    unlinkSync(path);
  }

  if (args.join(" ").indexOf("https://") === 0) {
    try {
      const data = await downloadMusicFromYoutube(args.join(" "), path);

      const fileSize = statSync(path).size;
      const maxFileSize = 25 * 1024 * 1024; // 25MB
      if (fileSize > maxFileSize) {
        return api.sendMessage("⚠️ Bài hát quá dài, vui lòng chọn bài khác!", event.threadID, () => unlinkSync(path));
      }

      const inputTime = data.uploadDate;
      const convertedTime = moment(inputTime).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");

      api.sendMessage({
        body: `🎬 Title: ${data.title} (${this.convertHMS(data.dur)})\n📆 Ngày tải lên: ${convertedTime}\n🔍 Tên kênh: ${data.author} (${data.sub})\n🌐 Lượt xem: ${data.viewCount}\n⏳ Thời gian xử lý: ${Math.floor((Date.now() - data.timestart) / 1000)} giây\n⏰ Time: ${timeNow}`
      }, event.threadID, () => {
        api.sendMessage({
          attachment: createReadStream(path)
        }, event.threadID, () => unlinkSync(path));
      });
    } catch (e) {
      console.log(e);
    }
  } else {
    try {
      const link = [];
      let msg = "", num = 0;
      const data = (await Youtube.GetListByKeyword(keywordSearch, false, 12)).items;

      for (const value of data) {
        link.push(value.id);
        const channel = value.channelTitle;
        num++;
        msg += `${num}. - ${value.title}\n⏰ Time: ${value.length.simpleText}\n🌐 Tên Kênh: ${channel}\n\n`;
      }

      const body = `📝 Có ${link.length} kết quả trùng với từ khóa tìm kiếm của bạn\n\n${msg}\nVui lòng chọn số bài hát bạn muốn tải!`;
      api.sendMessage(body, event.threadID, (error, info) => {
        global.client.handleReply.push({
          type: "reply",
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          link
        });
      });
    } catch (e) {
      console.log(e);
    }
  }
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  const timeNow = moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss');
  const path = `${__dirname}/cache/sing-${event.senderID}.mp3`;

  // Kiểm tra quyền chọn bài hát
  if (event.senderID !== handleReply.author) {
    return api.sendMessage("⛔ Bạn không phải người yêu cầu lệnh này!", event.threadID);
  }

  try {
    // Gỡ tin nhắn lựa chọn
    api.unsendMessage(handleReply.messageID);

    const data = await downloadMusicFromYoutube("https://www.youtube.com/watch?v=" + handleReply.link[event.body - 1], path);

    const fileSize = statSync(path).size;
    const maxFileSize = 25 * 1024 * 1024; // 25MB
    if (fileSize > maxFileSize) {
      return api.sendMessage("⚠️ Bài hát quá dài, vui lòng chọn bài khác!", event.threadID, () => unlinkSync(path));
    }

    const inputTime = data.uploadDate;
    const convertedTime = moment(inputTime).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");

    api.sendMessage({
      body: `🎬 Title: ${data.title} (${this.convertHMS(data.dur)})\n📆 Ngày tải lên: ${convertedTime}\n🔍 Tên kênh: ${data.author} (${data.sub})\n🌐 Lượt xem: ${data.viewCount}\n⏳ Thời gian xử lý: ${Math.floor((Date.now() - data.timestart) / 1000)} giây\n⏰ Time: ${timeNow}`
    }, event.threadID, () => {
      api.sendMessage({
        attachment: createReadStream(path)
      }, event.threadID, () => unlinkSync(path));
    });
  } catch (e) {
    console.log(e);
  }
};
