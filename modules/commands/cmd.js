module.exports.config = {
    name: "cmd",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Mirai Team",
    description: "Quản lý/Kiểm soát toàn bộ module của bot",
    commandCategory: "Admin",
    usages: "[load/unload/loadAll/unloadAll/info] [tên module]",
    cooldowns: 5,
    prefix: false
};

const loadCommand = function ({ moduleList, threadID, messageID }) {
    const { writeFileSync } = require('fs-extra');
    const { mainPath, api } = global.client;
    const logger = require(mainPath + '/utils/log');
    const errorList = [];
    delete require.cache[require.resolve(process.cwd()+'/config.json')];
    const configValue = require(process.cwd()+'/config.json');

    for (const nameModule of moduleList) {
        if (!nameModule) {
            errorList.push('- Module name is empty');
            continue;
        }

        try {
            const dirModule = __dirname + '/' + nameModule + '.js';
            delete require.cache[require.resolve(dirModule)];
            const command = require(dirModule);
            global.client.commands.delete(nameModule);

            if (!command.config || !command.run || !command.config.commandCategory) 
                throw new Error('Module không đúng định dạng!');

            global.client['eventRegistered'] = global.client['eventRegistered'].filter(info => info !== command.config.name);
            
            if (command.config.envConfig && typeof command.config.envConfig === 'object') {
                for (const [key, value] of Object.entries(command.config.envConfig)) {
                    if (!global.configModule[command.config.name]) 
                        global.configModule[command.config.name] = {};
                    if (!configValue[command.config.name]) 
                        configValue[command.config.name] = {};
                    
                    global.configModule[command.config.name][key] = configValue[command.config.name][key] || value || '';
                    configValue[command.config.name][key] = configValue[command.config.name][key] || value || '';
                }
                logger.loader('✅ Loaded config ' + command.config.name);
            }

            if (command.onLoad) {
                command.onLoad({ configValue });
            }

            if (command.handleEvent) global.client.eventRegistered.push(command.config.name);

            if (global.config.commandDisabled.includes(nameModule + '.js') || configValue.commandDisabled.includes(nameModule + '.js')) {
                configValue.commandDisabled.splice(configValue.commandDisabled.indexOf(nameModule + '.js'), 1);
                global.config.commandDisabled.splice(global.config.commandDisabled.indexOf(nameModule + '.js'), 1);
            }
            
            global.client.commands.set(command.config.name, command);
            logger.loader('✅ Loaded command ' + command.config.name + '!');
        } catch (error) {
            errorList.push(`- ${nameModule} reason: ${error.message} at ${error.stack}`);
        }
    }

    if (errorList.length !== 0) {
        api.sendMessage('Những module đã xảy ra sự cố khi đang load: ' + errorList.join(' '), threadID, messageID);
    }
    api.sendMessage('✅ Loaded ' + (moduleList.length - errorList.length) + ' module(s)', threadID, messageID);
    writeFileSync(process.cwd()+'/config.json', JSON.stringify(configValue, null, 4), 'utf8');
};

const unloadModule = function ({ moduleList, threadID, messageID }) {
    const { writeFileSync } = require("fs-extra");
    const { mainPath, api } = global.client;
    const logger = require(mainPath + "/utils/log").loader;
    delete require.cache[require.resolve(process.cwd()+'/config.json')];
    const configValue = require(process.cwd()+'/config.json');

    for (const nameModule of moduleList) {
        if (!nameModule) {
            continue;
        }

        global.client.commands.delete(nameModule);
        global.client.eventRegistered = global.client.eventRegistered.filter(item => item !== nameModule);
        configValue["commandDisabled"].push(`${nameModule}.js`);
        global.config["commandDisabled"].push(`${nameModule}.js`);
        logger(`Unloaded command ${nameModule}!`);
    }

    writeFileSync(process.cwd()+'/config.json', JSON.stringify(configValue, null, 4), 'utf8');
    return api.sendMessage(`🔰 Unloaded ${moduleList.length} module(s)`, threadID, messageID);
};

module.exports.run = function ({ event, args, api }) {
    const { readdirSync } = require("fs-extra");
    const { threadID, messageID } = event;

    const command = args[0];
    const moduleList = args.slice(1).map(module => module.trim()).filter(Boolean);

    switch (command) {
        case "load":
            if (moduleList.length === 0) return api.sendMessage("Tên module không được để trống!", threadID, messageID);
            return loadCommand({ moduleList, threadID, messageID });
        case "unload":
            if (moduleList.length === 0) return api.sendMessage("Tên module không được để trống!", threadID, messageID);
            return unloadModule({ moduleList, threadID, messageID });
        case "loadall":
            const loadAllModules = readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example'));
            const loadModules = loadAllModules.map(item => item.replace(/\.js/g, ""));
            return loadCommand({ moduleList: loadModules, threadID, messageID });
        case "unloadall":
            const unloadAllModules = readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example') && !file.includes("command"));
            const unloadModules = unloadAllModules.map(item => item.replace(/\.js/g, ""));
            return unloadModule({ moduleList: unloadModules, threadID, messageID });
        case "info": {
            const commandName = moduleList.join("") || "";
            const commandInfo = global.client.commands.get(commandName);

            if (!commandInfo) return api.sendMessage("Module bạn nhập không tồn tại!", threadID, messageID);

            const { name, version, hasPermssion, credits, cooldowns, dependencies } = commandInfo.config;

            return api.sendMessage(
                "=== " + name.toUpperCase() + " ===\n" +
                "- Được code bởi: " + credits + "\n" +
                "- Phiên bản: " + version + "\n" +
                "- Yêu cầu quyền hạn: " + ((hasPermssion === 0) ? "Người dùng" : (hasPermssion === 1) ? "Quản trị viên" : "Người vận hành bot") + "\n" +
                "- Thời gian chờ: " + cooldowns + " giây(s)\n" +
                `- Các package yêu cầu: ${(Object.keys(dependencies || {})).join(", ") || "Không có"}`,
                threadID, messageID
            );
        }
        default: {
            return global.utils.throwError(this.config.name, threadID, messageID);
        }
    }
};