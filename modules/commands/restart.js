module.exports.config = {
    name: "rs",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Your Team",
    description: "Khởi động lại bot với đếm ngược.",
    commandCategory: "Admin",
    cooldowns: 0
};

module.exports.run = async ({ event, api }) => {
    const { threadID } = event;
    await api.sendMessage("🖲️", threadID);
    setTimeout(() => process.exit(1), 4000); // Khởi động lại sau 4 giây
};