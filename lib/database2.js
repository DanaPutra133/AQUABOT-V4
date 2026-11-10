import path from 'path'
import _fs from 'fs'
const { promises: fs } = _fs

const FLUSH_INTERVAL_MS = 5000

const defaultUsers = {}
const defaultGroups = {}
const defaultSettings = { selfMode: false }
const defaultStats = {}
const defaultSewa = { enabled: false, groups: {} }
const defaultAutoai = {}
const defaultAutoaiPersonas = {}
const defaultAutoaiGlobal = { enabled: false }

class Database {
    constructor(dbPath) {
        this.dbPath = dbPath ? path.resolve(dbPath) : path.resolve('./src/database')
        this.stores = {}
        this.filePaths = {}
        this.dirty = {
            users: false,
            groups: false,
            settings: false,
            stats: false,
            sewa: false,
            owner: false,
            partner: false,
            autoai: false,
            autoai_personas: false,
            autoai_global: false
        }
        this.db = {
            data: {
                users: {},
                groups: {},
                settings: {},
                stats: {},
                sewa: { enabled: false, groups: {} },
                autoai: {},
                autoai_personas: {},
                autoai_global: { enabled: false }
            }
        }
        this.ready = false
        this.flushTimer = null
        this.logger = console
        this.ensureDir()
    }

    ensureDir() {
        if (!_fs.existsSync(this.dbPath)) {
            _fs.mkdirSync(this.dbPath, { recursive: true })
        }
    }

    migrateFromOldPath() {
        const oldPath = path.join(process.cwd(), 'src', 'database')
        if (oldPath === this.dbPath) return
        if (!_fs.existsSync(oldPath)) return

        const oldFiles = _fs.readdirSync(oldPath).filter(f => f.endsWith('.json'))
        if (oldFiles.length === 0) return

        const newFiles = _fs.existsSync(this.dbPath)
            ? _fs.readdirSync(this.dbPath).filter(f => f.endsWith('.json'))
            : []
        if (newFiles.length > 0) return

        this.logger.log(`[Database] Migrasi ${oldFiles.length} file dari src/database/ → ${path.relative(process.cwd(), this.dbPath)}/`)
        this.ensureDir()

        for (const file of oldFiles) {
            const src = path.join(oldPath, file)
            const dest = path.join(this.dbPath, file)
            try {
                _fs.copyFileSync(src, dest)
            } catch (e) {
                this.logger.error(`[Database] Gagal migrasi ${file}:`, e.message)
            }
        }
        this.logger.log('[Database] Migrasi path selesai')
    }

    async init() {
        try {
            const { LowSync } = await import('lowdb')
            const { JSONFileSync } = await import('lowdb/node')

            this.migrateFromOldPath()
            await this.migrateFromSingleFile()

            const fileMap = {
                users: { file: 'users.json', defaults: defaultUsers },
                groups: { file: 'groups.json', defaults: defaultGroups },
                settings: { file: 'settings.json', defaults: defaultSettings },
                stats: { file: 'stats.json', defaults: defaultStats },
                sewa: { file: 'sewa.json', defaults: defaultSewa },
                premium: { file: 'premium.json', defaults: [] },
                owner: { file: 'owner.json', defaults: [] },
                partner: { file: 'partner.json', defaults: [] },
                autoai: { file: 'autoai.json', defaults: defaultAutoai },
                autoai_personas: { file: 'autoai_personas.json', defaults: defaultAutoaiPersonas },
                autoai_global: { file: 'autoai_global.json', defaults: defaultAutoaiGlobal }
            }

            for (const [key, { file, defaults }] of Object.entries(fileMap)) {
                const filePath = path.join(this.dbPath, file)
                this.filePaths[key] = filePath
                this.validateJsonFile(filePath, defaults, file)
                const adapter = new JSONFileSync(filePath)
                const store = new LowSync(adapter, defaults)
                store.read()
                if (!store.data) store.data = defaults
                if (Array.isArray(defaults)) {
                    if (!Array.isArray(store.data)) store.data = defaults
                } else {
                    store.data = { ...defaults, ...store.data }
                }

                store.write()
                this.stores[key] = store
            }

            this.db.data = {
                users: this.stores.users.data,
                groups: this.stores.groups.data,
                settings: this.stores.settings.data,
                stats: this.stores.stats.data,
                sewa: this.stores.sewa.data,
                premium: this.stores.premium.data,
                owner: this.stores.owner.data,
                partner: this.stores.partner.data,
                autoai: this.stores.autoai.data,
                autoai_personas: this.stores.autoai_personas.data,
                autoai_global: this.stores.autoai_global.data
            }

            this.db.write = () => this.flushAll()
            this.db.read = () => this.readAll()

            this.startFlushTimer()
            this.registerShutdownHooks()

            this.ready = true
            this.logger.log('[Database] Multi-file database siap (debounced write setiap 5s)')
            return this
        } catch (error) {
            this.logger.error('[Database] Gagal inisialisasi:', error.message)
            this.db = {
                data: {
                    users: {},
                    groups: {},
                    settings: { selfMode: false },
                    stats: {},
                    sewa: { enabled: false, groups: {} },
                    autoai: {},
                    autoai_personas: {},
                    autoai_global: { enabled: false }
                },
                write: () => {},
                read: () => {}
            }
            this.ready = true
            return this
        }
    }

    startFlushTimer() {
        if (this.flushTimer) clearInterval(this.flushTimer)
        this.flushTimer = setInterval(() => this.flushDirty(), FLUSH_INTERVAL_MS)
        if (this.flushTimer.unref) this.flushTimer.unref()
    }

    registerShutdownHooks() {
        const flush = () => {
            try { this.flushAll() } catch {}
        }
        process.on('exit', flush)
        process.on('beforeExit', flush)

        if (!process._filyxShutdownRegistered) {
            process._filyxShutdownRegistered = true
            process.on('SIGTERM', () => { try { this.flushAll() } catch {} process.exit(0) })
            process.on('SIGINT', () => { try { this.flushAll() } catch {} process.exit(0) })
        }
    }

    markDirty(key) {
        this.dirty[key] = true
    }

    flushDirty() {
        for (const key of Object.keys(this.dirty)) {
            if (this.dirty[key] && this.stores[key] && !this._writing?.[key]) {
                this._writing = this._writing || {}
                this._writing[key] = true
                const data = this.stores[key].data
                const filePath = this.filePaths[key]

                _fs.writeFile(filePath, JSON.stringify(data), (err) => {
                    this._writing[key] = false
                    if (err) {
                        this.logger.error(`[Database] Gagal flush ${key}:`, err.message)
                        return
                    }
                    this.dirty[key] = false
                })
            }
        }
    }

    flushAll() {
        for (const [key, store] of Object.entries(this.stores)) {
            try {
                store.write()
                this.dirty[key] = false
            } catch {}
        }
    }

    readAll() {
        for (const store of Object.values(this.stores)) {
            try { store.read() } catch {}
        }
    }

    validateJsonFile(filePath, defaults, fileName) {
        if (_fs.existsSync(filePath)) {
            const content = _fs.readFileSync(filePath, 'utf-8').trim()
            if (!content || content === '' || content === '{}') {
                _fs.writeFileSync(filePath, JSON.stringify(defaults, null, 2), 'utf-8')
            } else {
                try {
                    JSON.parse(content)
                } catch {
                    const backup = path.join(this.dbPath, `${fileName}.corrupted.${Date.now()}.bak`)
                    _fs.copyFileSync(filePath, backup)
                    _fs.writeFileSync(filePath, JSON.stringify(defaults, null, 2), 'utf-8')
                    this.logger.log(`[Database] ${fileName} rusak, backup disimpan: ${backup}`)
                }
            }
        } else {
            _fs.writeFileSync(filePath, JSON.stringify(defaults, null, 2), 'utf-8')
        }
    }

    async migrateFromSingleFile() {
        const oldFile = path.join(this.dbPath, 'energis.json')
        if (!_fs.existsSync(oldFile)) return

        try {
            const content = _fs.readFileSync(oldFile, 'utf-8').trim()
            if (!content) return
            const data = JSON.parse(content)

            const files = {
                'users.json': data.users || {},
                'groups.json': data.groups || {},
                'settings.json': data.settings || { selfMode: false },
                'stats.json': data.stats || {},
                'sewa.json': data.sewa || { enabled: false, groups: {} }
            }

            for (const [file, fileData] of Object.entries(files)) {
                const target = path.join(this.dbPath, file)
                if (!_fs.existsSync(target)) {
                    _fs.writeFileSync(target, JSON.stringify(fileData, null, 2), 'utf-8')
                }
            }

            const backupPath = path.join(this.dbPath, `energis.json.migrated.${Date.now()}.bak`)
            _fs.renameSync(oldFile, backupPath)
            this.logger.log(`[Database] Migrasi dari energis.json selesai, backup: ${path.basename(backupPath)}`)
        } catch (e) {
            this.logger.error(`[Database] Gagal migrasi energis.json: ${e.message}`)
        }
    }

    async save() {
        try {
            this.flushAll()
            return true
        } catch (error) {
            this.logger.error('[Database] Gagal menyimpan:', error.message)
            return false
        }
    }

    getUser(jid) {
        if (!jid) return null
        const cleanJid = String(jid).replace(/@.+/g, '').split(':')[0]
        if (cleanJid.length > 15 || cleanJid.startsWith('120')) return null
        return this.db.data.users[cleanJid] || null
    }

    setUser(jid, data = {}) {
        if (!jid) return null
        const cleanJid = String(jid).replace(/@.+/g, '').split(':')[0]
        if (cleanJid.length > 15 || cleanJid.startsWith('120')) return null
        const existing = this.db.data.users[cleanJid] || {}

        const existingBalance = existing.balance !== undefined ? existing.balance : 0
        if (existing.balance !== undefined) delete existing.balance

        this.db.data.users[cleanJid] = {
            ...existing,
            jid: cleanJid,
            name: data.name || existing.name || 'Unknown',
            number: cleanJid,
            energi: data.energi ?? existing.energi ?? 25,
            isPremium: data.isPremium ?? existing.isPremium ?? false,
            isBanned: data.isBanned ?? existing.isBanned ?? false,
            exp: data.exp ?? existing.exp ?? 0,
            level: data.level ?? existing.level ?? 1,
            koin: data.koin ?? existing.koin ?? existingBalance,
            unlockedFeatures: data.unlockedFeatures ?? existing.unlockedFeatures ?? [],
            registeredAt: existing.registeredAt || new Date().toISOString(),
            lastSeen: new Date().toISOString(),
            cooldowns: data.cooldowns ?? existing.cooldowns ?? {},
            clanId: data.clanId ?? existing.clanId ?? null,
            isRegistered: data.isRegistered ?? existing.isRegistered ?? false,
            regName: data.regName ?? existing.regName ?? null,
            regAge: data.regAge ?? existing.regAge ?? null,
            regGender: data.regGender ?? existing.regGender ?? null,
            rpg: { ...(existing.rpg || {}), ...(data.rpg || {}) },
            inventory: { ...(existing.inventory || {}), ...(data.inventory || {}) },
            ...data,
            access: data.access || existing.access || []
        }

        this.markDirty('users')
        return this.db.data.users[cleanJid]
    }

    deleteUser(jid) {
        if (!jid) return false
        const cleanJid = String(jid).replace(/@.+/g, '').split(':')[0]
        if (this.db.data.users[cleanJid]) {
            delete this.db.data.users[cleanJid]
            this.markDirty('users')
            return true
        }
        return false
    }

    getAllUsers() {
        return this.db.data.users || {}
    }

    getUserCount() {
        return Object.keys(this.db.data.users || {}).length
    }

    updateEnergi(jid, amount) {
        const user = this.getUser(jid) || this.setUser(jid)
        if (!user) return 0
        if (user.energi === -1) return -1
        user.energi = Math.max(0, (user.energi || 0) + amount)
        this.setUser(jid, user)
        return user.energi
    }

    updateKoin(jid, amount) {
        const user = this.getUser(jid) || this.setUser(jid)
        if (!user) return 0
        const MAX_KOIN = 9000000000000
        user.koin = Math.max(0, Math.min(MAX_KOIN, (user.koin || 0) + amount))
        this.setUser(jid, user)
        return user.koin
    }

    updateExp(jid, amount) {
        const user = this.getUser(jid) || this.setUser(jid)
        if (!user) return 0
        const MAX_EXP = 9000000000
        user.exp = Math.max(0, Math.min(MAX_EXP, (user.exp || 0) + amount))
        this.setUser(jid, user)
        return user.exp
    }

    getTopUsers(field, limit = 10) {
        const users = Object.values(this.db.data.users || {})
        return users
            .filter(u => (u[field] || 0) > 0)
            .sort((a, b) => (b[field] || 0) - (a[field] || 0))
            .slice(0, limit)
    }

    checkCooldown(jid, command, seconds) {
        let user = this.getUser(jid)
        if (!user) {
            this.setUser(jid)
            user = this.getUser(jid)
        }
        if (!user) return false
        if (!user.cooldowns || typeof user.cooldowns !== 'object') {
            user.cooldowns = {}
            this.setUser(jid, { cooldowns: {} })
        }
        const now = Date.now()
        const cooldownEnd = user.cooldowns[command] || 0
        if (now < cooldownEnd) {
            return Math.ceil((cooldownEnd - now) / 1000)
        }
        return false
    }

    setCooldown(jid, command, seconds) {
        let user = this.getUser(jid)
        if (!user) user = this.setUser(jid, { cooldowns: {} })
        if (!user) return
        if (!user.cooldowns || typeof user.cooldowns !== 'object') user.cooldowns = {}
        user.cooldowns[command] = Date.now() + (seconds * 1000)
        this.setUser(jid, { cooldowns: user.cooldowns })
    }

    getGroup(jid) {
        if (!jid) return null
        return this.db.data.groups[jid] || null
    }

    setGroup(jid, data = {}) {
        if (!jid) return null
        const existing = this.db.data.groups[jid] || {}

        this.db.data.groups[jid] = {
            ...existing,
            jid,
            name: data.name || existing.name || 'Unknown Group',
            welcome: data.welcome ?? existing.welcome ?? false,
            leave: data.leave ?? existing.leave ?? false,
            goodbye: data.goodbye ?? existing.goodbye ?? false,
            antilink: data.antilink ?? existing.antilink ?? false,
            antitoxic: data.antitoxic ?? existing.antitoxic ?? false,
            mute: data.mute ?? existing.mute ?? false,
            warnings: data.warnings ?? existing.warnings ?? [],
            welcomeMsg: data.welcomeMsg ?? existing.welcomeMsg,
            goodbyeMsg: data.goodbyeMsg ?? existing.goodbyeMsg,
            intro: data.intro ?? existing.intro,
            chat: existing.chat ?? {},
            ...data
        }

        this.markDirty('groups')
        return this.db.data.groups[jid]
    }

    getAllGroups() {
        return this.db.data.groups || {}
    }

    setting(key, value = undefined) {
        if (value !== undefined) {
            this.db.data.settings[key] = value
            this.markDirty('settings')
        }
        return this.db.data.settings[key]
    }

    getSettings() {
        return this.db.data.settings || {}
    }

    incrementStat(key, increment = 1) {
        if (!this.db.data.stats[key]) this.db.data.stats[key] = 0
        this.db.data.stats[key] += increment
        this.markDirty('stats')
        return this.db.data.stats[key]
    }

    getStats(key) {
        if (key) return this.db.data.stats[key] || 0
        return this.db.data.stats || {}
    }

    resetAllEnergi(defaultEnergi = 25, premiumEnergi = -1) {
        let count = 0
        for (const jid of Object.keys(this.db.data.users)) {
            const user = this.db.data.users[jid]
            user.energi = user.isPremium ? premiumEnergi : defaultEnergi
            count++
        }
        this.markDirty('users')
        return count
    }

    backup() {
        this.flushAll()
        const backupDir = path.join(this.dbPath, 'backups')
        if (!_fs.existsSync(backupDir)) _fs.mkdirSync(backupDir, { recursive: true })

        const ts = new Date().toISOString().replace(/[:.]/g, '-')
        const combined = {
            users: this.db.data.users,
            groups: this.db.data.groups,
            settings: this.db.data.settings,
            stats: this.db.data.stats,
            sewa: this.db.data.sewa,
            premium: this.db.data.premium,
            owner: this.db.data.owner,
            autoai: this.db.data.autoai,
            autoai_personas: this.db.data.autoai_personas,
            autoai_global: this.db.data.autoai_global
        }
        const backupPath = path.join(backupDir, `backup-${ts}.json`)
        _fs.writeFileSync(backupPath, JSON.stringify(combined, null, 2), 'utf-8')
        return backupPath
    }

    get users() { return this.db.data.users }
    get groups() { return this.db.data.groups }
    get settings() { return this.db.data.settings }
    get stats() { return this.db.data.stats }
    get sewa() { return this.db.data.sewa }
    get premium() { return this.db.data.premium }
    get owner() { return this.db.data.owner }
    get partner() { return this.db.data.partner }

    get data() { return this.db.data }
    set data(val) { this.db.data = val }
}

let dbInstance = null

async function initDatabase(dbPath) {
    if (!dbInstance) {
        dbInstance = new Database(dbPath)
        await dbInstance.init()
    }
    return dbInstance
}

function getDatabase() {
    if (!dbInstance) {
        dbInstance = new Database()
    }
    return dbInstance
}

export default Database
export { Database, initDatabase, getDatabase }