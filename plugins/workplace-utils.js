const fs = require('fs');
const path = require('path');

const workplaceDatabaseFilePath = path.join(__dirname, 'workplace-database.json');

const loadWorkplaceDatabase = () => {
    if (fs.existsSync(workplaceDatabaseFilePath)) {
        const data = fs.readFileSync(workplaceDatabaseFilePath);
        return JSON.parse(data);
    }
    return { workplaces: {} };
};

const saveWorkplaceDatabase = (data) => {
    fs.writeFileSync(workplaceDatabaseFilePath, JSON.stringify(data, null, 2));
};

module.exports = {
    loadWorkplaceDatabase,
    saveWorkplaceDatabase
};
