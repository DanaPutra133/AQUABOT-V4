const { readdirSync, rmSync } = require('fs');
let handler = async function all(m) {
    let setting = global.db.data.settings[this.user.jid]
    if (setting.cleartmp) {
        if (new Date() * 1 - setting.lastcleartmp > 600000) {
            const tmp = ['./tmp'];
            const filenames = [];
          
            tmp.forEach(dirname => {
              readdirSync(dirname).forEach(file => {
                filenames.push(join(dirname, file));
              });
            });
          
            const deletedFiles = [];
          
            filenames.forEach(file => {
              const stats = statSync(file);
          
              if (stats.isDirectory()) {
                console.log(`Skipping directory: ${file}`);
              } else {
                unlinkSync(file);
                deletedFiles.push(file);
              }
            });
          
            conn.reply(m.chat, 'Success!', m);
          
            if (deletedFiles.length > 0) {
              console.log('Deleted files:', deletedFiles);
              conn.reply(m.chat, `Deleted files:\n${deletedFiles.join('\n')}`, m);
            }
          
            if (deletedFiles.length == 0) {
              conn.reply(m.chat, 'tidak ada file yang tersisa di tmp', m);
            }
            setting.lastcleartmp = new Date() * 1
        }
    } return !trueMatcher
}

module.exports = handler