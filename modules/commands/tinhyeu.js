module.exports.config = {
    name: "tinhyeu",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Mod Syn Credit(lụm)",
    description: "Tỏ tình theo cách đáng iu :3 <3",
    commandCategory: "Tình Yêu",
    usages: "totinh @mention",
    cooldowns: 100,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
}

module.exports.run = async function({ api, args, Users, event}) {
    var mention = Object.keys(event.mentions)[0];
    if(!mention) return api.sendMessage("Cần phải tag 1 người bạn muốn tỏ tình", event.threadID);
 let name =  event.mentions[mention];
    var arraytag = [];
        arraytag.push({id: mention, tag: name});
    var a = function (a) { api.sendMessage(a, event.threadID); }
a("Em à!");
setTimeout(() => {a({body: "Chào iem anh đứng đây từ sáng đến tối" + " " + name, mentions: arraytag})}, 3000);
setTimeout(() => {a({body: "Tự dưng anh gặp được em :3" + " " + name, mentions: arraytag})}, 5000);
setTimeout(() => {a({body: "Em đẹp quá, em xinh quá anh muốn được làm quen :3" + " " + name, mentions: arraytag})}, 7000);
setTimeout(() => {a({body: "Anh đã iu ebe từ cái nhìn đầu tiên :<" + " " + name, mentions: arraytag})}, 9000);
setTimeout(() => {a({body: "Vì yêu em, anh bất tử" + " " + name, mentions: arraytag})}, 17000);
setTimeout(() => {a({body: "Anh sẽ gọi em là em bé" + " " + name, mentions: arraytag})}, 20000);
setTimeout(() => {a({body: "Anh sẽ chiều chuộng em bé, cho em bé ăn cho em bé ngủ :3" + " " + name, mentions: arraytag})}, 23000);
setTimeout(() => {a({body: "Anh sẽ hôn lên trán em và bảo rằng anh yêu bae của anh rất nhiều" + " " + name, mentions: arraytag})}, 25000);
setTimeout(() => {a({body: "Anh sẽ làm osin cho công chúa của anh suốt cuộc đời" + " " + name, mentions: arraytag})}, 39000);
setTimeout(() => {a({body: "Chờ anh một chút nhé bae :3, anh nhớ em rồi lấy ảnh em ra ngắm cái" + " " + name, mentions: arraytag})}, 40000);
setTimeout(() => {a({body: "Oce rồi vợ anh vẫn rất xinh tươi :3" + " " + name, mentions: arraytag})}, 65000);
setTimeout(() => {a({body: "Anh yêu em rất nhiều <3" + " " + name, mentions: arraytag})}, 70000);
setTimeout(() => {a("Nói nhiều anh cũng hơi mệt chút xíu rùi")} , 90000);
setTimeout(() => {a({body: "Chốt lại nhẹ nhàng thôi :3" + " " + name, mentions: arraytag})}, 95000);
setTimeout(() => {a({body: "Bae làm người yêu anh nhé <3" + " " + name, mentions: arraytag})}, 105000);
setTimeout(() => {a("=)) anh trap em đấy lewlew ")} , 110000);


  
  }