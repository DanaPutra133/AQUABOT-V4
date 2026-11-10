import { createCanvas, loadImage } from '@napi-rs/canvas'

// ==========================================================================
// DATABASE 100 MAKANAN & MINUMAN ISEKAI/DUNIA NYATA (FITUR HEAL)
// ==========================================================================
const FOOD_DATABASE = [
    // Rank E (Penyembuhan Ringan 10 - 35 HP | RP 5.000 - 25.000)
    { id: 1, name: 'Roti Gandum Kering', heal: 10, cost: 5000 },
    { id: 2, name: 'Apel Hutan Segar', heal: 12, cost: 6000 },
    { id: 3, name: 'Air Kelapa Hawa', heal: 15, cost: 7500 },
    { id: 4, name: 'Daging Serigala Panggang', heal: 18, cost: 9000 },
    { id: 5, name: 'Sup Sayur Pemula', heal: 20, cost: 10000 },
    { id: 6, name: 'Susu Sapi Desa', heal: 22, cost: 11000 },
    { id: 7, name: 'Keal Jamur Hutan', heal: 24, cost: 12000 },
    { id: 8, name: 'Nasi Onigiri Jamur', heal: 25, cost: 13000 },
    { id: 9, name: 'Jagung Bakar Mentega', heal: 28, cost: 14000 },
    { id: 10, name: 'Ikan Bakar Sungai', heal: 30, cost: 15000 },
    { id: 11, name: 'Roti Keju Desa', heal: 32, cost: 16000 },
    { id: 12, name: 'Telur Rebus Ayam Hutan', heal: 33, cost: 17000 },
    { id: 13, name: 'Kue Berries Hutan', heal: 34, cost: 18000 },
    { id: 14, name: 'Jus Apel Hijau', heal: 35, cost: 20000 },
    { id: 15, name: 'Sate Daging Kelinci', heal: 38, cost: 22000 },
    { id: 16, name: 'Roti Bawang Gurih', heal: 40, cost: 25000 },

    // Rank D (Penyembuhan Menengah 45 - 80 HP | RP 30.000 - 75.000)
    { id: 17, name: 'Daging Boar Panggang Spesi', heal: 45, cost: 30000 },
    { id: 18, name: 'Ramen Shoyu Kedai Desa', heal: 50, cost: 35000 },
    { id: 19, name: 'Sup Daging Babi Hutan', heal: 52, cost: 38000 },
    { id: 20, name: 'Katsu Don Super', heal: 55, cost: 40000 },
    { id: 21, name: 'Steak Ayam BBQ', heal: 58, cost: 42000 },
    { id: 22, name: 'Puding Cokelat Sihir', heal: 60, cost: 45000 },
    { id: 23, name: 'Jus Jeruk Mana', heal: 62, cost: 48000 },
    { id: 24, name: 'Pancake Sirup Maple', heal: 65, cost: 50000 },
    { id: 25, name: 'Dango Kedai Manis', heal: 68, cost: 52000 },
    { id: 26, name: 'Takoyaki Gurita Laut', heal: 70, cost: 55000 },
    { id: 27, name: 'Bento Pahlawan Pemula', heal: 72, cost: 58000 },
    { id: 28, name: 'Sup Ayam Rempah Rahasia', heal: 75, cost: 60000 },
    { id: 29, name: 'Omurice Telur Lembut', heal: 78, cost: 65000 },
    { id: 30, name: 'Pizza Keju Mozzarella', heal: 80, cost: 70000 },
    { id: 31, name: 'Burger Daging Lembu Extra', heal: 85, cost: 75000 },

    // Rank C (Penyembuhan Tinggi 90 - 150 HP | RP 85.000 - 180.000)
    { id: 32, name: 'Daging Minotaur Asap', heal: 90, cost: 85000 },
    { id: 33, name: 'Sup Medusa Beracun (Netral)', heal: 95, cost: 90000 },
    { id: 34, name: 'Sashimi Ikan Laut Dalam', heal: 100, cost: 100000 },
    { id: 35, name: 'Steak Sapi A5 Isekai', heal: 105, cost: 110000 },
    { id: 36, name: 'Kari Daging Monster B-Rank', heal: 110, cost: 120000 },
    { id: 37, name: 'Ramen Tonkotsu Spesial', heal: 125, cost: 125000 },
    { id: 38, name: 'Puding Buah Elven', heal: 120, cost: 130000 },
    { id: 39, name: 'Salad Bunga Kebijaksanaan', heal: 125, cost: 135000 },
    { id: 40, name: 'Sup Kepiting Raksasa Laut', heal: 130, cost: 140000 },
    { id: 41, name: 'Daging Gryphon Panggang', heal: 135, cost: 145000 },
    { id: 42, name: 'Kue Tart Cokelat Royale', heal: 140, cost: 150000 },
    { id: 43, name: 'Teh Hijau Peri Elf', heal: 145, cost: 160000 },
    { id: 44, name: 'Nasi Goreng Daging Dragon', heal: 150, cost: 170000 },
    { id: 45, name: 'Daging Manticore Pedas', heal: 155, cost: 180000 },

    // Rank B (Penyembuhan Besar 165 - 240 HP | RP 200.000 - 450.000)
    { id: 46, name: 'Daging Behemoth Rebus', heal: 165, cost: 200000 },
    { id: 47, name: 'Sup Ekstrak Hydra', heal: 170, cost: 220000 },
    { id: 48, name: 'Sirloin Steak Mammoth', heal: 175, cost: 240000 },
    { id: 49, name: 'Salad Akar Yggdrasil', heal: 180, cost: 260000 },
    { id: 50, name: 'Wine Anggur Kerajaan Elven', heal: 185, cost: 280000 },
    { id: 51, name: 'Daging Salamander Pedas', heal: 190, cost: 300000 },
    { id: 52, name: 'Roti Suci Ksatria Templar', heal: 195, cost: 320000 },
    { id: 53, name: 'Nectar Madu Ratu Tawon', heal: 200, cost: 350000 },
    { id: 54, name: 'Sup Ekor Chimera', heal: 205, cost: 370000 },
    { id: 55, name: 'Ramen Daging Kraken', heal: 210, cost: 390000 },
    { id: 56, name: 'Kebab Daging Gargoyle', heal: 215, cost: 400000 },
    { id: 57, name: 'Kue Bulan Bintang Kuno', heal: 220, cost: 420000 },
    { id: 58, name: 'Sate Daging Sphinx', heal: 230, cost: 440000 },
    { id: 59, name: 'Es Krim Salju Abadi', heal: 240, cost: 450000 },

    // Rank A (Penyembuhan Master 250 - 380 HP | RP 500.000 - 1.200.000)
    { id: 60, name: 'Sup Telur Phoenix Emas', heal: 250, cost: 500000 },
    { id: 61, name: 'Daging Naga Es Frost Dragon', heal: 260, cost: 550000 },
    { id: 62, name: 'Steak Daging Black Naga', heal: 270, cost: 600000 },
    { id: 63, name: 'Minuman Ambrosia Para Dewa', heal: 280, cost: 650000 },
    { id: 64, name: 'Buah Khuldi Surga Isekai', heal: 290, cost: 700000 },
    { id: 65, name: 'Sup Jantung Leviathan', heal: 300, cost: 750000 },
    { id: 66, name: 'Sashimi Cumi-Cumi Abyssal', heal: 310, cost: 800000 },
    { id: 67, name: 'Daging Archdemon Panggang', heal: 320, cost: 850000 },
    { id: 68, name: 'Kue Tart Berries Surgawi', heal: 330, cost: 900000 },
    { id: 69, name: 'Jus Apel Emas Keabadian', heal: 340, cost: 950000 },
    { id: 70, name: 'Sup Sumsum Golem Obsidian', heal: 350, cost: 1000000 },
    { id: 71, name: 'Roti Suci Malaikat Jatuh', heal: 360, cost: 1100000 },
    { id: 72, name: 'Wine Darah Vampire Dracula', heal: 380, cost: 1200000 },

    // Rank S (Penyembuhan Mythic 400 - 650 HP | RP 1.500.000 - 4.000.000)
    { id: 73, name: 'Daging Titan Kronos Asap', heal: 400, cost: 1500000 },
    { id: 74, name: 'Sup Otak Chaos Behemoth', heal: 420, cost: 1700000 },
    { id: 75, name: 'Steak Daging Demon Belial', heal: 440, cost: 1900000 },
    { id: 76, name: 'Ramuan Elixir Kehidupan', heal: 460, cost: 2100000 },
    { id: 77, name: 'Nasi Olahan Serangga Void', heal: 480, cost: 2300000 },
    { id: 78, name: 'Sashimi Sisik Jormungandr', heal: 500, cost: 2500000 },
    { id: 79, name: 'Daging Kraken Purba BBQ', heal: 520, cost: 2800000 },
    { id: 80, name: 'Sup Bunga Teratai Abadi', heal: 540, cost: 3000000 },
    { id: 81, name: 'Puding Jiwa Kegelapan', heal: 560, cost: 3200000 },
    { id: 82, name: 'Kue Bulan Astral Cosmos', heal: 580, cost: 3500000 },
    { id: 83, name: 'Es Krim Kristal Jiwa Elven', heal: 600, cost: 3800000 },
    { id: 84, name: 'Steak Daging Hydra 9 Kepala', heal: 650, cost: 4000000 },

    // Rank SS (Penyembuhan Supreme 700 - Full HP Instant | RP 5.000.000 - 20.000.000)
    { id: 85, name: 'Daging Raja Naga Bahamut', heal: 700, cost: 5000000 },
    { id: 86, name: 'Sup Darah Raja Iblis Lucifer', heal: 750, cost: 6000000 },
    { id: 87, name: 'Steak Daging Primordial Leviathan', heal: 800, cost: 7000000 },
    { id: 88, name: 'Santapan Mahakarya Dewa Ares', heal: 850, cost: 8000000 },
    { id: 89, name: 'Buah Pohon Kehidupan Edens', heal: 900, cost: 9000000 },
    { id: 90, name: 'Sup Hati Raja Kegelapan Void', heal: 950, cost: 10000000 },
    { id: 91, name: 'Elixir Keabadian Azathoth', heal: 1000, cost: 11000000 },
    { id: 92, name: 'Nectar Murni Bintang Kejora', heal: 1100, cost: 12000000 },
    { id: 93, name: 'Roti Suci Sang Pencipta Dimensi', heal: 1200, cost: 13000000 },
    { id: 94, name: 'Kari Daging Dewa Perang', heal: 1300, cost: 14000000 },
    { id: 95, name: 'Pancake Sirup Bintang Jatuh', heal: 1400, cost: 15000000 },
    { id: 96, name: 'Daging Raja Binatang Kosmik', heal: 1500, cost: 16000000 },
    { id: 97, name: 'Teh Murni Air Surgawi Olympus', heal: 1600, cost: 17000000 },
    { id: 98, name: 'Sashimi Naga Primordial Void', heal: 1800, cost: 18000000 },
    { id: 99, name: 'Santapan Perjamuan Terakhir Isekai', heal: 2000, cost: 19000000 },
    { id: 100, name: '✨ MAKANAN PARA DEWA DEWI (FULL HEAL INSTANT) ✨', heal: 999999, cost: 20000000 }
]

// 50 ANIME CEWEK & 50 ANIME COWOK DATABASE
const ANIME_FEMALE_PARTNERS = [
    'Asuna Yuuki (SAO)', 'Emilia (Re:Zero)', 'Rem (Re:Zero)', 'Zero Two (Darling in the Franxx)', 
    'Mikasa Ackerman (AoT)', 'Kaguya Shinomiya (Kaguya-sama)', 'Chizuru Mizuhara (Rent-a-Girlfriend)',
    'Marin Kitagawa (My Dress-Up Darling)', 'Yor Forger (Spy x Family)', 'Nezuko Kamado (Demon Slayer)',
    'Hinata Hyuga (Naruto)', 'Sakura Haruno (Naruto)', 'Tsunade (Naruto)', 'Nami (One Piece)', 
    'Nico Robin (One Piece)', 'Boa Hancock (One Piece)', 'Miku Nakano (Gotoubun)', 'Nino Nakano (Gotoubun)', 
    'Itsuki Nakano (Gotoubun)', 'Ichika Nakano (Gotoubun)', 'Yotsuba Nakano (Gotoubun)', 'Rias Gremory (High School DxD)',
    'Akeno Himejima (High School DxD)', 'Kurumi Tokisaki (Date A Live)', 'Tohru (Dragon Maid)',
    'Aqua (Konosuba)', 'Megumin (Konosuba)', 'Darkness (Konosuba)', 'Mai Sakurajima (Bunny Girl Senpai)', 
    'Nobara Kugisaki (Jujutsu Kaisen)', 'Maki Zenin (Jujutsu Kaisen)', 'Power (Chainsaw Man)', 'Makima (Chainsaw Man)',
    'Reze (Chainsaw Man)', 'Violet Evergarden', 'Frieren (Beyond Journey\'s End)', 'Fern (Frieren)',
    'Sylphiette (Mushoku Tensei)', 'Roxy Migurdia (Mushoku Tensei)', 'Eris Boreas Greyrat (Mushoku Tensei)',
    'C.C. (Code Geass)', 'Kallen Stadtfeld (Code Geass)', 'Saber / Artoria (Fate)', 'Rin Tohsaka (Fate)',
    'Taiga Aisaka (Toradora)', 'Holo (Spice and Wolf)', 'Mitsuri Kanroji (Demon Slayer)', 'Shinobu Kocho (Demon Slayer)',
    'Yorichi Zero (Demon Slayer)', 'Shoko Ieiri (Jujutsu Kaisen)'
]

const ANIME_MALE_PARTNERS = [
    'Gojo Satoru (Jujutsu Kaisen)', 'Nanami Kento (Jujutsu Kaisen)', 'Toji Fushiguro (Jujutsu Kaisen)',
    'Megumi Fushiguro (Jujutsu Kaisen)', 'Yuji Itadori (Jujutsu Kaisen)', 'Yuta Okkotsu (Jujutsu Kaisen)',
    'Levi Ackerman (AoT)', 'Eren Yeager (AoT)', 'Armin Arlert (AoT)', 'Naruto Uzumaki (Naruto)',
    'Sasuke Uchiha (Naruto)', 'Kakashi Hatake (Naruto)', 'Itachi Uchiha (Naruto)', 'Minato Namikaze (Naruto)',
    'Monkey D. Luffy (One Piece)', 'Roronoa Zoro (One Piece)', 'Vinsmoke Sanji (One Piece)', 'Trafalgar Law (One Piece)',
    'Portgas D. Ace (One Piece)', 'Saitama (One Punch Man)', 'Genos (One Punch Man)', 'Denji (Chainsaw Man)',
    'Aki Hayakawa (Chainsaw Man)', 'Loid Forger (Spy x Family)', 'Tanjiro Kamado (Demon Slayer)',
    'Giyu Tomioka (Demon Slayer)', 'Kyojuro Rengoku (Demon Slayer)', 'Muichiro Tokito (Demon Slayer)',
    'Sung Jinwoo (Solo Leveling)', 'Rudeus Greyrat (Mushoku Tensei)', 'Subaru Natsuki (Re:Zero)',
    'Kazuma Satou (Konosuba)', 'Light Yagami (Death Note)', 'L Lawliet (Death Note)', 'Edward Elric (FMA)',
    'Killua Zoldyck (Hunter x Hunter)', 'Kurapika (Hunter x Hunter)', 'Hisoka Morow (Hunter x Hunter)',
    'Spike Spiegel (Cowboy Bebop)', 'Isagi Yoichi (Blue Lock)', 'Rin Itoshi (Blue Lock)', 'Nagi Seishiro (Blue Lock)',
    'Bachira Meguru (Blue Lock)', 'Hinata Shoyo (Haikyuu!!)', 'Kageyama Tobio (Haikyuu!!)', 'Gintoki Sakata (Gintama)',
    'Kuroko Tetsuya (Kuroko no Basket)', 'Aomine Daiki (Kuroko no Basket)', 'Mob / Shigeo (Mob Psycho 100)', 'Howl Pendragon (Howl\'s Moving Castle)'
]

const ANIME_FRIENDS = [...ANIME_MALE_PARTNERS, ...ANIME_FEMALE_PARTNERS]

// 50 BOSS DATABASE
const BOSS_DATABASE = {
    E: [
        { id: 1, name: 'Goblin Scout', powerReq: 25, damage: 25, rewardExp: 80, rewardMoney: 30000 },
        { id: 2, name: 'Wild Boar King', powerReq: 30, damage: 30, rewardExp: 100, rewardMoney: 40000 },
        { id: 3, name: 'Slime Emperor', powerReq: 35, damage: 35, rewardExp: 120, rewardMoney: 50000 },
        { id: 4, name: 'Cave Spider Queen', powerReq: 40, damage: 40, rewardExp: 140, rewardMoney: 60000 },
        { id: 5, name: 'Giant Rat Overlord', powerReq: 45, damage: 45, rewardExp: 160, rewardMoney: 70000 },
        { id: 6, name: 'Skeleton Archer Captain', powerReq: 50, damage: 50, rewardExp: 180, rewardMoney: 80000 },
        { id: 7, name: 'Forest Wolf Packleader', powerReq: 55, damage: 55, rewardExp: 200, rewardMoney: 90000 },
        { id: 8, name: 'Bandit Chief', powerReq: 60, damage: 60, rewardExp: 220, rewardMoney: 100000 },
        { id: 9, name: 'Zombie Goliath', powerReq: 65, damage: 65, rewardExp: 250, rewardMoney: 120000 },
        { id: 10, name: 'Bronze Golem', powerReq: 70, damage: 70, rewardExp: 300, rewardMoney: 150000 }
    ],
    D: [
        { id: 11, name: 'Minotaur Berserker', powerReq: 80, damage: 90, rewardExp: 350, rewardMoney: 200000 },
        { id: 12, name: 'Poisonous Basilisk', powerReq: 90, damage: 100, rewardExp: 400, rewardMoney: 250000 },
        { id: 13, name: 'Gargoyle Sentinel', powerReq: 100, damage: 110, rewardExp: 450, rewardMoney: 300000 },
        { id: 14, name: 'Harpy Matriarch', powerReq: 110, damage: 120, rewardExp: 500, rewardMoney: 350000 },
        { id: 15, name: 'Shadow Panther', powerReq: 120, damage: 130, rewardExp: 550, rewardMoney: 400000 },
        { id: 16, name: 'Manticore of Despair', powerReq: 130, damage: 140, rewardExp: 600, rewardMoney: 450000 },
        { id: 17, name: 'Fire Elemental Lord', powerReq: 140, damage: 150, rewardExp: 650, rewardMoney: 500000 },
        { id: 18, name: 'Frost Troll Chieftain', powerReq: 150, damage: 160, rewardExp: 700, rewardMoney: 550000 },
        { id: 19, name: 'Undead Knight Commander', powerReq: 160, damage: 170, rewardExp: 800, rewardMoney: 600000 }
    ],
    C: [
        { id: 20, name: 'Cyclops Crusher', powerReq: 180, damage: 200, rewardExp: 900, rewardMoney: 750000 },
        { id: 21, name: 'Chimera Beast', powerReq: 200, damage: 220, rewardExp: 1000, rewardMoney: 900000 },
        { id: 22, name: 'Gorgon Medusa', powerReq: 220, damage: 240, rewardExp: 1100, rewardMoney: 1100000 },
        { id: 23, name: 'Wyvern Sentinel', powerReq: 240, damage: 260, rewardExp: 1200, rewardMoney: 1300000 },
        { id: 24, name: 'Stone Drake', powerReq: 260, damage: 280, rewardExp: 1300, rewardMoney: 1500000 },
        { id: 25, name: 'Lich Necromancer', powerReq: 280, damage: 300, rewardExp: 1400, rewardMoney: 1800000 },
        { id: 26, name: 'Death Knight General', powerReq: 300, damage: 320, rewardExp: 1500, rewardMoney: 2000000 },
        { id: 27, name: 'Deep Sea Serpent', powerReq: 320, damage: 340, rewardExp: 1700, rewardMoney: 2300000 }
    ],
    B: [
        { id: 28, name: 'Abyss Hydra (3 Heads)', powerReq: 350, damage: 400, rewardExp: 2000, rewardMoney: 3000000 },
        { id: 29, name: 'Fire Salamander King', powerReq: 380, damage: 430, rewardExp: 2200, rewardMoney: 3500000 },
        { id: 30, name: 'Behemoth Destroyer', powerReq: 410, damage: 460, rewardExp: 2500, rewardMoney: 4000000 },
        { id: 31, name: 'Ancient Sphinx Guardian', powerReq: 440, damage: 490, rewardExp: 2800, rewardMoney: 4500000 },
        { id: 32, name: 'Storm Griffon King', powerReq: 470, damage: 520, rewardExp: 3100, rewardMoney: 5000000 },
        { id: 33, name: 'Obsidian Golem Titan', powerReq: 500, damage: 550, rewardExp: 3500, rewardMoney: 6000000 },
        { id: 34, name: 'Vampire Overlord Dracula', powerReq: 540, damage: 600, rewardExp: 4000, rewardMoney: 7500000 }
    ],
    A: [
        { id: 35, name: 'Infernal Phoenix', powerReq: 600, damage: 700, rewardExp: 5000, rewardMoney: 10000000 },
        { id: 36, name: 'Frost Ancient Dragon', powerReq: 650, damage: 750, rewardExp: 5500, rewardMoney: 12000000 },
        { id: 37, name: 'Black Dragon Nidhogg', powerReq: 700, damage: 800, rewardExp: 6000, rewardMoney: 15000000 },
        { id: 38, name: 'Archdemon of Wrath', powerReq: 750, damage: 850, rewardExp: 6800, rewardMoney: 18000000 },
        { id: 39, name: 'Fallen Angel Lucifer Jr.', powerReq: 800, damage: 900, rewardExp: 7500, rewardMoney: 22000000 },
        { id: 40, name: 'Abyssal Leviathan', powerReq: 850, damage: 950, rewardExp: 8500, rewardMoney: 27000000 }
    ],
    S: [
        { id: 41, name: 'Titan of Ruin Kronos', powerReq: 950, damage: 1100, rewardExp: 10000, rewardMoney: 35000000 },
        { id: 42, name: 'Chaos Behemoth', powerReq: 1050, damage: 1250, rewardExp: 12000, rewardMoney: 45000000 },
        { id: 43, name: 'Demon Lord Belial', powerReq: 1150, damage: 1400, rewardExp: 15000, rewardMoney: 60000000 },
        { id: 44, name: 'Void Archmage Azathoth', powerReq: 1250, damage: 1600, rewardExp: 18000, rewardMoney: 80000000 },
        { id: 45, name: 'World Serpent Jormungandr', powerReq: 1400, damage: 1800, rewardExp: 22000, rewardMoney: 100000000 }
    ],
    SS: [
        { id: 46, name: 'Dragon God Bahamut', powerReq: 1600, damage: 2200, rewardExp: 30000, rewardMoney: 150000000 },
        { id: 47, name: 'Dark Sovereign Lucifer', powerReq: 1800, damage: 2600, rewardExp: 40000, rewardMoney: 250000000 },
        { id: 48, name: 'Primordial Chaos Leviathan', powerReq: 2100, damage: 3000, rewardExp: 55000, rewardMoney: 400000000 },
        { id: 49, name: 'God of War Ares', powerReq: 2500, damage: 3500, rewardExp: 75000, rewardMoney: 600000000 },
        { id: 50, name: 'THE DARK LORD OF THE VOID', powerReq: 3000, damage: 5000, rewardExp: 100000, rewardMoney: 1000000000 }
    ]
}

// METADATA BOT KHUSUS UNTUK FITUR RPG LIFE
let handler = async (m, { conn, usedPrefix }) => {
    let helpTxt = `
📜 *[ RPG LIFE SIMULATOR MENU ]* 📜

Buka petualangan Isekai-mu dengan mengetik kata kunci di bawah (bisa tanpa prefix):

🌀 *AKSI UTAMA:*
• *${usedPrefix}reinkarnasi* / *reinkarnasi*
  _(Mulai kehidupan baru sebagai petualang Rank E)_

💳 *STATUS, MAKAN & PROFIL:*
• *${usedPrefix}profile* / *profile* / *status*
  _(Tampilkan Kartu Status Adventurer Canvas Maskot Harimau/Tier)_
• *${usedPrefix}makan* / *makan* / *heal* / *restauran*
  _(Pulihkan HP-mu dengan 100 hidangan kuliner Isekai)_
• *${usedPrefix}setprofile* / *setprofile <url/gambar>*
  _(Pasang Foto Profil Kustom Bebas)_
• *${usedPrefix}quest* / *quest* / *misi*
  _(Kerjakan quest harian berjenjang - Cooldown: 1 Menit)_
• *${usedPrefix}latihan* / *latihan* / *train*
  _(Tingkatkan atribut STR, AGI, INT, & Max HP - Cooldown: 1 Menit)_

🤝 *SOSIAL, RELASI & PEMBATALAN:*
• *${usedPrefix}teman* / *teman* (atau *teman @user*)
  _(Pilih teman party dari daftar bernomor atau tag user)_
• *${usedPrefix}keluarteman* / *keluarteman*
  _(Keluarkan teman dari party-mu)_
• *${usedPrefix}pasangan* / *pasangan* (atau *pasangan @user*)
  _(Pilih Waifu/Husbando anime bernomor atau tag user)_
• *${usedPrefix}putus* / *putus*
  _(Putuskan hubungan dengan pasanganmu saat ini)_

⚔️ *PERTARUNGAN BOSS:*
• *${usedPrefix}boss* / *boss* / *dungeon*
  _(Tantang 50 Boss Battles bertingkat - Cooldown: 1 Menit)_
`.trim()

    return conn.reply(m.chat, helpTxt, m)
}

// ==========================================================================
// BEFORE HANDLER (LOGIKA TEKS TANPA PREFIX & PROSES INPUT NOMOR)
// ==========================================================================
handler.before = async function (m) {
    try {
        if (!m.text && !m.quoted && !m.mtype?.includes('image')) return
        let txt = (m.text || '').trim()
        let lowerTxt = txt.toLowerCase()

        let user = global.db.data.users[m.sender]
        if (!user) return

        user.rpgLife = user.rpgLife || initRpgLifeData()
        let rpg = user.rpgLife

        // HELPER 1: KONVERSI JID DARI TAG/REPLY
        const getCleanUserName = async (jid) => {
            if (!jid) return 'Petualang'
            if (jid === m.sender && m.name) return m.name.trim()
            try {
                let fetchedName = await this.getName(jid)
                if (fetchedName && !fetchedName.startsWith('+') && !fetchedName.includes('@') && !fetchedName.match(/^\d+$/)) {
                    return fetchedName.trim()
                }
            } catch {}

            let uData = global.db.data.users[jid]
            if (uData && uData.name) {
                return uData.name.replace(/^@/, '').trim()
            }
            return 'Petualang'
        }

        // HELPER 2: MEMBERSIHKAN DATA NOMOR TERPANJANG
        const formatSavedName = async (val) => {
            if (!val || val === 'Belum ada') return 'Belum ada'
            let cleanVal = String(val).replace(/^@\+?/, '').trim()

            if (/^\d+$/.test(cleanVal) || cleanVal.includes('@s.whatsapp.net')) {
                let jid = cleanVal.includes('@') ? cleanVal : `${cleanVal}@s.whatsapp.net`
                let realName = await getCleanUserName(jid)
                return realName
            }
            return val
        }

        // 1. REINKARNASI
        if (['reinkarnasi', 'start', 'mulai'].includes(lowerTxt)) {
            if (rpg.isReincarnated) {
                return this.reply(m.chat, `🌀 Kamu sudah bereinkarnasi sebagai pahlawan Rank *[ ${rpg.rank} ]*! Ketik *profile* di chat untuk mengecek statusmu.`, m)
            }
            user.rpgLife = initRpgLifeData(true)
            let startMsg = `
✨ *[ PROSES REINKARNASI BERHASIL ]* ✨

Kamu lahir kembali di dunia RPG sebagai *Pemula Rank E*.
Selesaikan 50 Boss Battles dari Rank E sampai Rank SS!

💡 *Ketik langsung kata kunci di bawah:*
• *profile* - Kartu Status Visual Canvas Maskot Tier
• *makan* - Pulihkan HP dengan 100 Kuliner Isekai
• *setprofile* - Pasang Foto Profil Bebas
• *quest* - Misi harian (Cooldown 1 Min)
• *latihan* - Tingkatkan stats (Cooldown 1 Min)
• *teman* - Pilih teman party / tag user
• *pasangan* - Lamar cewek/cowok anime / tag user
• *putus* - Putus hubungan pasangan
• *boss* - Tantang 50 Boss Battle (Cooldown 1 Min)
• *.isekai* - Lihat Menu Bantuan
`.trim()
            return this.reply(m.chat, startMsg, m)
        }

        if (!rpg.isReincarnated) return

        // 2. FITUR PUTUS HUBUNGAN PASANGAN
        if (['putus', 'divorce', 'cerai'].includes(lowerTxt)) {
            delete rpg.awaitingInput
            if (!rpg.partner || rpg.partner === 'Belum ada') {
                return this.reply(m.chat, '💔 Kamu sedang jomblo dan tidak memiliki pasangan untuk diputuskan!', m)
            }
            let oldPartner = await formatSavedName(rpg.partner)
            rpg.partner = null
            return this.reply(m.chat, `💔 *[ HUBUNGAN BERAKHIR ]*\n\nKamu telah resmi memutuskan hubungan dengan *${oldPartner}*. Sekarang kamu kembali jomblo!`, m)
        }

        // 3. FITUR KELUARKAN TEMAN PARTY
        if (['keluarteman', 'remfriend', 'hapusteman'].includes(lowerTxt)) {
            if (rpg.friends.length === 0) {
                return this.reply(m.chat, '👥 Kamu belum memiliki teman party apapun!', m)
            }
            rpg.awaitingInput = 'keluar_teman'
            let menu = `👥 *[ DAFTAR TEMAN PARTY-MU ]* 👥\n_Balas dengan NOMOR TEMAN yang ingin dikeluarkan:_\n\n`
            for (let i = 0; i < rpg.friends.length; i++) {
                let cleanF = await formatSavedName(rpg.friends[i])
                menu += `*${i + 1}.* ${cleanF}\n`
            }
            return this.reply(m.chat, menu.trim(), m)
        }

        let targetJid = m.mentionedJid?.[0] || (m.quoted ? m.quoted.sender : null)

        // 4. PASANGAN DENGAN TAG / MENTION USER
        if ((lowerTxt.startsWith('pasangan') || lowerTxt.startsWith('lamar')) && targetJid) {
            delete rpg.awaitingInput
            if (rpg.partner && rpg.partner !== 'Belum ada') {
                let currentPartner = await formatSavedName(rpg.partner)
                return this.reply(m.chat, `💕 Kamu sudah memiliki pasangan: *${currentPartner}*! Ketik *putus* terlebih dahulu untuk mengakhiri hubungan.`, m)
            }

            let targetName = await getCleanUserName(targetJid)
            rpg.partner = targetName
            return this.reply(m.chat, `💖 *[ PERNIKAHAN PASANGAN ]*\n\nSelamat! Kamu resmi menikah dan berpasangan dengan *${targetName}*!`, m, { mentions: [targetJid] })
        }

        // 5. TEMAN DENGAN TAG / MENTION USER
        if ((lowerTxt.startsWith('teman') || lowerTxt.startsWith('friend')) && targetJid) {
            delete rpg.awaitingInput
            let targetName = await getCleanUserName(targetJid)

            if (rpg.friends.includes(targetName)) {
                return this.reply(m.chat, `🤝 *${targetName}* sudah ada di dalam party-mu!`, m, { mentions: [targetJid] })
            }
            rpg.friends.push(targetName)
            return this.reply(m.chat, `🎉 *[ REKRUT TEMAN PARTY ]*\n\nKamu merekrut *${targetName}* ke dalam party bertualangmu!`, m, { mentions: [targetJid] })
        }

        // 6. SET PROFILE PICTURE KUSTOM
        if (lowerTxt.startsWith('setprofile') || lowerTxt.startsWith('setfoto') || lowerTxt.startsWith('setpp')) {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''

            if (/image/.test(mime)) {
                let imgBuffer = await q.download()
                if (imgBuffer) {
                    rpg.customAvatar = `data:${mime};base64,${imgBuffer.toString('base64')}`
                    return this.reply(m.chat, '🖼️ *[ FOTO PROFIL DIPERBARUI ]*\n\nFoto profil kustom RPG kamu berhasil dipasang! Ketik *profile* untuk melihat hasilnya.', m)
                }
            } else {
                let url = txt.split(/\s+/)[1]
                if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                    rpg.customAvatar = url
                    return this.reply(m.chat, '🖼️ *[ FOTO PROFIL DIPERBARUI ]*\n\nFoto profil kustom dari URL berhasil dipasang! Ketik *profile* untuk melihat hasilnya.', m)
                } else {
                    return this.reply(m.chat, '⚠️ Kirim/reply gambar dengan caption *setprofile* atau ketik *setprofile https://link-gambar.com/foto.jpg*', m)
                }
            }
        }

        // 7. NAVIGASI SELEKSI ANGKA TERBALAS
        if (rpg.awaitingInput) {
            let choice = parseInt(lowerTxt)
            if (!isNaN(choice)) {
                if (rpg.awaitingInput === 'makan') {
                    let food = FOOD_DATABASE.find(f => f.id === choice)
                    if (!food) {
                        return this.reply(m.chat, '⚠️ Nomor hidangan tidak ditemukan! Balas dengan angka (1 - 100).', m)
                    }

                    if (rpg.stats.hp >= rpg.stats.maxHp) {
                        delete rpg.awaitingInput
                        return this.reply(m.chat, `❤️ *HP-mu sudah penuh (${rpg.stats.hp}/${rpg.stats.maxHp})!* Kamu tidak perlu makan saat ini.`, m)
                    }

                    let currentMoney = user.money || 0
                    if (currentMoney < food.cost) {
                        return this.reply(m.chat, `💸 Uangmu tidak cukup! Harga *${food.name}* adalah *RP ${food.cost.toLocaleString('id-ID')}*, sedangkan saldo uangmu *RP ${currentMoney.toLocaleString('id-ID')}*.`, m)
                    }

                    delete rpg.awaitingInput
                    user.money -= food.cost
                    let oldHp = rpg.stats.hp
                    rpg.stats.hp = Math.min(rpg.stats.maxHp, rpg.stats.hp + food.heal)
                    let restored = rpg.stats.hp - oldHp

                    let eatMsg = `
🍖 *[ PERJAMUAN KULINER ISEKAI ]* 🍖

Kamu memakan **${food.name}**!
• Biaya: *-RP ${food.cost.toLocaleString('id-ID')} Money*
• HP Pulih: *+${restored} HP*
• Status HP Saat Ini: ❤️ *${rpg.stats.hp} / ${rpg.stats.maxHp}*
`.trim()
                    return this.reply(m.chat, eatMsg, m)
                }
                else if (rpg.awaitingInput === 'boss') {
                    let cooldown = 60000 
                    let timeDiff = Date.now() - (rpg.lastBoss || 0)

                    if (timeDiff < cooldown) {
                        delete rpg.awaitingInput
                        let remaining = Math.ceil((cooldown - timeDiff) / 1000)
                        return this.reply(m.chat, `⏳ Nafasmu masih terengah-engah dari pertarungan sebelumnya! Istirahat *${remaining} detik* lagi sebelum menantang Boss!`, m)
                    }

                    delete rpg.awaitingInput
                    return await executeBossFight(this, m, user, rpg, choice)
                } 
                else if (rpg.awaitingInput === 'pasangan_gender') {
                    if (choice === 1) {
                        rpg.awaitingInput = 'pasangan_cewek'
                        let menu = `👩 *[ PILIH CHAR ANIME CEWEK ]* 👩\n_Balas dengan NOMOR PILIHANMU (1-50):_\n\n`
                        ANIME_FEMALE_PARTNERS.forEach((n, idx) => menu += `*${idx + 1}.* ${n}\n`)
                        return this.reply(m.chat, menu.trim(), m)
                    } else if (choice === 2) {
                        rpg.awaitingInput = 'pasangan_cowok'
                        let menu = `👨 *[ PILIH CHAR ANIME COWOK ]* 👨\n_Balas dengan NOMOR PILIHANMU (1-50):_\n\n`
                        ANIME_MALE_PARTNERS.forEach((n, idx) => menu += `*${idx + 1}.* ${n}\n`)
                        return this.reply(m.chat, menu.trim(), m)
                    }
                } 
                else if (rpg.awaitingInput === 'pasangan_cewek') {
                    if (choice >= 1 && choice <= ANIME_FEMALE_PARTNERS.length) {
                        delete rpg.awaitingInput
                        let selected = ANIME_FEMALE_PARTNERS[choice - 1]
                        rpg.partner = selected
                        return this.reply(m.chat, `💖 *[ PERNIKAHAN ANIME ]*\n\nSelamat! Kamu resmi berpasangan dengan *${selected}*!`, m)
                    }
                } 
                else if (rpg.awaitingInput === 'pasangan_cowok') {
                    if (choice >= 1 && choice <= ANIME_MALE_PARTNERS.length) {
                        delete rpg.awaitingInput
                        let selected = ANIME_MALE_PARTNERS[choice - 1]
                        rpg.partner = selected
                        return this.reply(m.chat, `💖 *[ PERNIKAHAN ANIME ]*\n\nSelamat! Kamu resmi berpasangan dengan *${selected}*!`, m)
                    }
                }
                else if (rpg.awaitingInput === 'pilih_teman') {
                    if (choice >= 1 && choice <= ANIME_FRIENDS.length) {
                        delete rpg.awaitingInput
                        let selected = ANIME_FRIENDS[choice - 1]
                        if (rpg.friends.includes(selected)) {
                            return this.reply(m.chat, `🤝 *${selected}* sudah ada di dalam party-mu!`, m)
                        }
                        rpg.friends.push(selected)
                        return this.reply(m.chat, `🎉 *[ REKRUT TEMAN PARTY ]*\n\nKamu merekrut *${selected}* ke dalam party bertualangmu!`, m)
                    }
                }
                else if (rpg.awaitingInput === 'keluar_teman') {
                    if (choice >= 1 && choice <= rpg.friends.length) {
                        delete rpg.awaitingInput
                        let removed = rpg.friends.splice(choice - 1, 1)[0]
                        let cleanedRemoved = await formatSavedName(removed)
                        return this.reply(m.chat, `👋 *[ TEMAN DIKELUARKAN ]*\n\n*${cleanedRemoved}* telah dikeluarkan dari party bertualangmu.`, m)
                    }
                }
            }
        }

        // 8. FITUR MAKAN
        if (['makan', 'heal', 'restauran', 'dapur', 'makanan'].includes(lowerTxt)) {
            rpg.awaitingInput = 'makan'
            let foodListMsg = `🍱 *[ RESTAURAN KULINER ISEKAI - 100 HIDANGAN ]* 🍱\n`
            foodListMsg += `❤️ *HP-Mu Saat Ini:* ${rpg.stats.hp} / ${rpg.stats.maxHp}\n`
            foodListMsg += `_Balas pesan ini dengan mengetik *NOMOR MAKANAN (1 - 100)* yang ingin kamu makan!_\n\n`

            FOOD_DATABASE.forEach((f) => {
                foodListMsg += `*${f.id}. ${f.name}*\n`
                foodListMsg += `   ◦ Efek: *+${f.heal >= 999999 ? 'FULL' : f.heal} HP* | Biaya: *RP ${f.cost.toLocaleString('id-ID')}*\n`
            })

            return this.reply(m.chat, foodListMsg.trim(), m)
        }

        // 9. MENU TEMAN ANIME
        if (lowerTxt.startsWith('teman') || lowerTxt.startsWith('friend')) {
            rpg.awaitingInput = 'pilih_teman'
            let menu = `👥 *[ PILIH TEMAN ANIME UNTUK PARTY ]* 👥\n_Balas pesan ini dengan NOMOR (1 - ${ANIME_FRIENDS.length}) atau ketik *teman @user*:_\n\n`
            ANIME_FRIENDS.forEach((f, idx) => menu += `*${idx + 1}.* ${f}\n`)
            return this.reply(m.chat, menu.trim(), m)
        }

        // 10. MENU PASANGAN ANIME
        if (lowerTxt.startsWith('pasangan') || lowerTxt.startsWith('lamar')) {
            if (rpg.partner && rpg.partner !== 'Belum ada') {
                let currentPartner = await formatSavedName(rpg.partner)
                return this.reply(m.chat, `💕 Kamu sudah memiliki pasangan: *${currentPartner}*! Ketik *putus* terlebih dahulu untuk mengakhiri hubungan.`, m)
            }
            rpg.awaitingInput = 'pasangan_gender'
            let partnerMenu = `💖 *[ PILIH PASANGAN ANIME KUSTOM ]* 💖\n\n`
            partnerMenu += `1. 👩 *50 Karakter Anime Perempuan (Waifu)*\n`
            partnerMenu += `2. 👨 *50 Karakter Anime Laki-laki (Husbando)*\n\n`
            partnerMenu += `_Balas pesan ini dengan angka *1* atau *2*, atau ketik *pasangan @user* untuk melamar teman chat!_`

            return this.reply(m.chat, partnerMenu.trim(), m)
        }

        // 11. QUEST HARIAN
        if (['quest', 'misi'].includes(lowerTxt)) {
            let cooldown = 60000 
            let timeDiff = Date.now() - rpg.lastQuest

            if (timeDiff < cooldown) {
                let remaining = Math.ceil((cooldown - timeDiff) / 1000)
                return this.reply(m.chat, `⏳ Papan serikat sedang memperbarui quest. Tunggu *${remaining} detik* lagi!`, m)
            }

            let qData = getQuestByRank(rpg.rank)
            rpg.exp += qData.expReward
            user.money = (user.money || 0) + qData.moneyReward
            rpg.questCompleted += 1
            rpg.lastQuest = Date.now()

            let levelUpMsg = checkLevelAndRankUp(rpg)
            let qMsg = `📜 *[ QUEST RANK ${rpg.rank} SELESAI ]*\n\n🎯 *Misi:* ${qData.title}\n🎁 *Reward:* +${qData.expReward} EXP & +RP ${qData.moneyReward.toLocaleString('id-ID')} Money${levelUpMsg}`
            return this.reply(m.chat, qMsg, m)
        }

        // 12. PROFIL / STATUS CANVAS
        if (['profile', 'profil', 'status', 'me'].includes(lowerTxt)) {
            let userName = await getCleanUserName(m.sender)
            let cardBuffer = await renderRpgStatusCard(rpg, userName)

            let cleanPartner = rpg.partner ? await formatSavedName(rpg.partner) : 'Belum ada'

            let cleanFriendsList = []
            for (let f of rpg.friends) {
                cleanFriendsList.push(await formatSavedName(f))
            }

            let caption = `👤 *[ KARTU STATUS ADVENTURER ]* 👤\n`
            caption += `• Pemilik: *${userName}*\n`
            caption += `• Rank: *[ ${rpg.rank} ]* | Level: *${rpg.level}*\n`
            caption += `• HP: ❤️ *${rpg.stats.hp} / ${rpg.stats.maxHp}*\n`
            caption += `• Pasangan: 💕 *${cleanPartner}*\n`
            caption += `• Teman Party: 👥 *${cleanFriendsList.length > 0 ? cleanFriendsList.join(', ') : 'Belum ada'}*`

            return await this.sendMessage(m.chat, { image: cardBuffer, caption, mentions: [m.sender] }, { quoted: m })
        }

        // 13. LATIHAN STATS
        if (['latihan', 'train'].includes(lowerTxt)) {
            let cooldown = 60000 
            let timeDiff = Date.now() - rpg.lastTrain

            if (timeDiff < cooldown) {
                let remaining = Math.ceil((cooldown - timeDiff) / 1000)
                return this.reply(m.chat, `⏳ Ototmu masih lelah! Istirahat *${remaining} detik* lagi.`, m)
            }

            let strGain = Math.floor(Math.random() * 3) + 1
            let agiGain = Math.floor(Math.random() * 3) + 1
            let intGain = Math.floor(Math.random() * 3) + 1
            let hpGain = 15

            rpg.stats.str += strGain
            rpg.stats.agi += agiGain
            rpg.stats.int += intGain
            rpg.stats.maxHp += hpGain
            rpg.stats.hp = rpg.stats.maxHp
            rpg.lastTrain = Date.now()

            let trainMsg = `🏋️‍♂️ *[ LATIHAN SELESAI ]*\n\n• STR: *+${strGain}* (Total: ${rpg.stats.str})\n• AGI: *+${agiGain}* (Total: ${rpg.stats.agi})\n• INT: *+${intGain}* (Total: ${rpg.stats.int})\n• Max HP: *+${hpGain}* (Total: ${rpg.stats.maxHp})`
            return this.reply(m.chat, trainMsg, m)
        }

        // 14. MENU BOSS BATTLES
        if (['boss', 'dungeon'].includes(lowerTxt)) {
            let cooldown = 60000 
            let timeDiff = Date.now() - (rpg.lastBoss || 0)

            if (timeDiff < cooldown) {
                let remaining = Math.ceil((cooldown - timeDiff) / 1000)
                return this.reply(m.chat, `⏳ Nafasmu masih terengah-engah dari pertarungan sebelumnya! Istirahat *${remaining} detik* lagi sebelum menantang Boss!`, m)
            }

            let rankBosses = BOSS_DATABASE[rpg.rank] || BOSS_DATABASE['E']
            rpg.awaitingInput = 'boss'

            let bossListMsg = `⚔️ *[ 50 BOSS BATTLES - RANK ${rpg.rank} ]* ⚔️\n`
            bossListMsg += `_Balas pesan ini dengan mengetik *NOMOR BOSS* yang ingin dilawan!_\n\n`

            rankBosses.forEach((b) => {
                bossListMsg += `*${b.id}. ${b.name}*\n`
                bossListMsg += `   ◦ Req Power: *${b.powerReq}* | Boss Damage: *-${b.damage} HP*\n`
                bossListMsg += `   ◦ Hadiah: *+${b.rewardExp} EXP* & *+RP ${b.rewardMoney.toLocaleString('id-ID')}*\n\n`
            })

            bossListMsg += `💡 *Total Power-Mu Saat Ini:* ${rpg.stats.str + rpg.stats.agi + rpg.stats.int} (STR + AGI + INT)`
            return this.reply(m.chat, bossListMsg.trim(), m)
        }

    } catch (err) {
        console.error('Error pada before handler rpglife:', err)
    }
}

handler.help = ['isekai', 'rpghelp', 'rpgmenu', 'quest', 'misi', 'makan', 'heal', 'restauran', 'boss', 'dungeon']
handler.tags = ['rpg', 'game']
handler.command = /^(isekai|rpghelp|rpgmenu|quest|misi|makan|heal|restauran|boss|dungeon)$/i
handler.register = true

export default handler

// ==========================================================================
// LOGIKA PERTARUNGAN BOSS
// ==========================================================================
async function executeBossFight(conn, m, user, rpg, bossId) {
    let targetBoss = null
    for (let rankKey in BOSS_DATABASE) {
        let found = BOSS_DATABASE[rankKey].find(b => b.id === bossId)
        if (found) {
            targetBoss = found
            break
        }
    }

    if (!targetBoss) {
        return conn.reply(m.chat, '⚠️ Nomor boss yang kamu pilih tidak ditemukan!', m)
    }

    rpg.lastBoss = Date.now()
    let userTotalPower = rpg.stats.str + rpg.stats.agi + rpg.stats.int

    if (userTotalPower >= targetBoss.powerReq) {
        let expGained = targetBoss.rewardExp
        let moneyGained = targetBoss.rewardMoney

        rpg.exp += expGained
        user.money = (user.money || 0) + moneyGained

        let levelUpMsg = checkLevelAndRankUp(rpg)

        let winMsg = `
⚔️ *[ KEMENANGAN EPIK VS ${targetBoss.name.toUpperCase()} ]* ⚔️

💥 Dengan kombinasi statistik STR/AGI/INT sebesar *${userTotalPower}*, kamu membinasakan **${targetBoss.name}**!

🎁 *HADIAH PERTEMPURAN:*
• EXP: *+${expGained}*
• Money: *+RP ${moneyGained.toLocaleString('id-ID')} Money*
${levelUpMsg}
`.trim()
        return conn.reply(m.chat, winMsg, m)

    } else {
        let bossDamage = targetBoss.damage
        rpg.stats.hp -= bossDamage

        if (rpg.stats.hp <= 0) {
            rpg.stats.hp = 1
            return conn.reply(m.chat, `☠️ *[ KEKALAHAN CRITICAL! ]*\n\nSerangan Dahsyat **${targetBoss.name}** memberikan damage sebesar *-${bossDamage} HP*!\nKamu tergeletak pingsan dengan HP kritis *(1 HP)*. Ketik *makan* untuk memulihkan HP-mu!`, m)
        } else {
            return conn.reply(m.chat, `💥 *[ TERDESAK KALAH! ]*\n\nPower-mu (${userTotalPower}) kurang dari Power Boss (${targetBoss.powerReq}).\n**${targetBoss.name}** menebasmu dengan damage *-${bossDamage} HP*! Sisa HP-mu: *${rpg.stats.hp}/${rpg.stats.maxHp}*. Ketik *makan* untuk menyembuhkan luka!`, m)
        }
    }
}

// ==========================================================================
// RENDERING KARTU STATUS CANVAS (BINGKAI HARIMAU & MASKOT ANIMAL PER TIER)
// ==========================================================================
async function renderRpgStatusCard(rpg, name) {
    const canvas = createCanvas(800, 500)
    const ctx = canvas.getContext('2d')
    const rank = (rpg.rank || 'E').toUpperCase()

    // 1. TIER THEMES & MASCOT CONFIGURATION
    const TIER_CONFIG = {
        E: { bgStart: '#1C1917', bgEnd: '#0C0A09', primary: '#A8A29E', accent: '#78716C', title: '#D6D3D1', hpColor: '#EF4444', mascot: '🐺 WOLF' },
        D: { bgStart: '#0F172A', bgEnd: '#020617', primary: '#94A3B8', accent: '#38BDF8', title: '#E2E8F0', hpColor: '#F87171', mascot: '🐂 BULL' },
        C: { bgStart: '#2A1800', bgEnd: '#050300', primary: '#FACC15', accent: '#F59E0B', title: '#FEF08A', hpColor: '#F43F5E', mascot: '🐯 TIGER' },
        B: { bgStart: '#042F2E', bgEnd: '#021817', primary: '#2DD4BF', accent: '#06B6D4', title: '#CCFBF1', hpColor: '#FB7185', mascot: '🐍 HYDRA' },
        A: { bgStart: '#450A0A', bgEnd: '#0F0202', primary: '#F87171', accent: '#EF4444', title: '#FECACA', hpColor: '#DC2626', mascot: '🐉 DRAGON' },
        S: { bgStart: '#2E1065', bgEnd: '#090314', primary: '#C084FC', accent: '#A855F7', title: '#E9D5FF', hpColor: '#EC4899', mascot: '👁️ VOID' },
        SS: { bgStart: '#090D16', bgEnd: '#1E1B4B', primary: '#38BDF8', accent: '#F43F5E', title: '#FFFFFF', hpColor: '#10B981', mascot: '👑 GOD' }
    }

    const style = TIER_CONFIG[rank] || TIER_CONFIG.E

    // 2. BACKGROUND GRADIENT DYNAMIC
    const bgGrad = ctx.createLinearGradient(0, 0, 800, 500)
    bgGrad.addColorStop(0, style.bgStart)
    bgGrad.addColorStop(1, style.bgEnd)
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, 800, 500)

    // EFEK WATERMARK MASKOT DI BACKGROUND
    ctx.save()
    ctx.globalAlpha = 0.08
    ctx.fillStyle = style.primary
    ctx.font = '900 160px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(rank, 770, 320)
    ctx.restore()

    // 3. DRAW DYNAMIC TIER BINGKAI CANVAS + HARIMAU/MASKOT
    drawTierFrameWithMascot(ctx, rank, style)

    // 4. TITLE CARD
    ctx.fillStyle = style.title
    ctx.font = 'bold 22px sans-serif'
    ctx.fillText(`🛡️ ADVENTURER CARD • [ ${style.mascot} TIER ${rank} ]`, 40, 52)

    // 5. AVATAR CONTAINER & BINGKAI FOTO PROFIL
    ctx.fillStyle = '#0F172A'
    ctx.fillRect(40, 80, 150, 150)

    if (rpg.customAvatar) {
        try {
            let avatarImg = await loadImage(rpg.customAvatar)
            ctx.drawImage(avatarImg, 40, 80, 150, 150)
        } catch {
            ctx.fillStyle = style.primary
            ctx.font = 'bold 65px sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText(rank, 115, 175)
        }
    } else {
        ctx.fillStyle = style.primary
        ctx.font = 'bold 65px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(rank, 115, 175)
    }

    // Border Avatar Frame Dynamic
    ctx.lineWidth = 4
    ctx.strokeStyle = style.primary
    ctx.strokeRect(40, 80, 150, 150)

    // 6. INFORMASI NAMA & PROGRESS
    ctx.textAlign = 'left'
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText(name.toUpperCase(), 220, 110)

    ctx.fillStyle = style.primary
    ctx.font = '16px sans-serif'
    ctx.fillText(`LEVEL ${rpg.level}  |  EXP: ${rpg.exp} / ${rpg.level * 100}`, 220, 140)

    // HP BAR
    ctx.fillStyle = '#1E293B'
    ctx.fillRect(220, 160, 530, 24)
    let hpWidth = Math.max(0, Math.min(530, Math.floor((rpg.stats.hp / rpg.stats.maxHp) * 530)))
    ctx.fillStyle = style.hpColor
    ctx.fillRect(220, 160, hpWidth, 24)

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 12px sans-serif'
    ctx.fillText(`HP: ${rpg.stats.hp} / ${rpg.stats.maxHp}`, 230, 177)

    // 7. ATTRIBUTE CONTAINER
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)'
    ctx.fillRect(40, 260, 710, 120)
    ctx.strokeStyle = style.accent
    ctx.lineWidth = 2
    ctx.strokeRect(40, 260, 710, 120)

    ctx.fillStyle = style.title
    ctx.font = 'bold 18px sans-serif'
    ctx.fillText('CHARACTER ATTRIBUTES', 60, 295)

    ctx.fillStyle = '#F87171'
    ctx.font = 'bold 16px sans-serif'
    ctx.fillText(`STR (Kekuatan): ${rpg.stats.str}`, 60, 340)

    ctx.fillStyle = '#34D399'
    ctx.fillText(`AGI (Kelincahan): ${rpg.stats.agi}`, 300, 340)

    ctx.fillStyle = '#60A5FA'
    ctx.fillText(`INT (Kecerdasan): ${rpg.stats.int}`, 540, 340)

    ctx.fillStyle = '#9CA3AF'
    ctx.font = '14px sans-serif'
    ctx.fillText(`💕 Partner: ${rpg.partner || 'None'}  |  👥 Party Members: ${rpg.friends.length} Person`, 40, 440)

    return await canvas.encode('png')
}

// ==========================================================================
// ENGINE LUKIS BINGKAI & LOGO MASKOT VECTOR PER TIER
// ==========================================================================
function drawTierFrameWithMascot(ctx, rank, style) {
    if (rank === 'E') {
        ctx.lineWidth = 6
        ctx.strokeStyle = '#78716C'
        ctx.strokeRect(8, 8, 784, 484)
        drawWolfMascot(ctx, 720, 15, style.primary)
    }
    else if (rank === 'D') {
        ctx.lineWidth = 6
        ctx.strokeStyle = '#94A3B8'
        ctx.strokeRect(8, 8, 784, 484)
        ctx.lineWidth = 2
        ctx.strokeStyle = '#38BDF8'
        ctx.strokeRect(14, 14, 772, 472)
        drawBullMascot(ctx, 720, 15, style.primary)
    }
    else if (rank === 'C') {
        ctx.lineWidth = 8
        ctx.strokeStyle = '#FACC15'
        ctx.strokeRect(6, 6, 788, 488)

        ctx.lineWidth = 2
        ctx.strokeStyle = '#FEF08A'
        ctx.strokeRect(14, 14, 772, 472)

        drawTigerClawStrokes(ctx, 30, 430, '#F59E0B')
        drawTigerMascot(ctx, 715, 12, '#FACC15')
    }
    else if (rank === 'B') {
        ctx.lineWidth = 8
        ctx.strokeStyle = '#14B8A6'
        ctx.strokeRect(6, 6, 788, 488)

        ctx.lineWidth = 2
        ctx.strokeStyle = '#5EEAD4'
        ctx.strokeRect(14, 14, 772, 472)
        drawHydraMascot(ctx, 715, 12, '#2DD4BF')
    }
    else if (rank === 'A') {
        ctx.lineWidth = 10
        ctx.strokeStyle = '#DC2626'
        ctx.strokeRect(5, 5, 790, 490)

        ctx.lineWidth = 3
        ctx.strokeStyle = '#FCA5A5'
        ctx.strokeRect(15, 15, 770, 470)

        drawDragonMascot(ctx, 710, 10, '#F87171')
    }
    else if (rank === 'S') {
        ctx.lineWidth = 10
        ctx.strokeStyle = '#7E22CE'
        ctx.strokeRect(5, 5, 790, 490)

        ctx.lineWidth = 3
        ctx.strokeStyle = '#C084FC'
        ctx.strokeRect(15, 15, 770, 470)
        drawVoidEyeMascot(ctx, 710, 10, '#A855F7')
    }
    else if (rank === 'SS') {
        const frameGrad = ctx.createLinearGradient(0, 0, 800, 500)
        frameGrad.addColorStop(0, '#F59E0B')
        frameGrad.addColorStop(0.33, '#38BDF8')
        frameGrad.addColorStop(0.66, '#EC4899')
        frameGrad.addColorStop(1, '#10B981')

        ctx.lineWidth = 12
        ctx.strokeStyle = frameGrad
        ctx.strokeRect(5, 5, 790, 490)

        ctx.lineWidth = 2
        ctx.strokeStyle = '#FFFFFF'
        ctx.strokeRect(16, 16, 768, 468)

        drawGodCrownMascot(ctx, 705, 8, '#F59E0B')
    }
}

// VEKTOR MASKOT HARIMAU (TIER C)
function drawTigerMascot(ctx, x, y, color) {
    ctx.save()
    ctx.translate(x, y)
    ctx.fillStyle = color
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2

    // Telinga Harimau
    ctx.beginPath(); ctx.moveTo(10, 10); ctx.lineTo(25, 0); ctx.lineTo(30, 20); ctx.fill(); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(50, 20); ctx.lineTo(55, 0); ctx.lineTo(70, 10); ctx.fill(); ctx.stroke()

    // Kepala Utama
    ctx.beginPath()
    ctx.arc(40, 35, 28, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Loreng Harimau (Stripes)
    ctx.fillStyle = '#000000'
    ctx.beginPath(); ctx.moveTo(35, 12); ctx.lineTo(45, 12); ctx.lineTo(40, 24); ctx.fill()
    ctx.beginPath(); ctx.moveTo(20, 25); ctx.lineTo(28, 28); ctx.lineTo(22, 34); ctx.fill()
    ctx.beginPath(); ctx.moveTo(60, 25); ctx.lineTo(52, 28); ctx.lineTo(58, 34); ctx.fill()

    // Mata Menyala
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath(); ctx.arc(28, 32, 5, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(52, 32, 5, 0, Math.PI * 2); ctx.fill()

    ctx.restore()
}

// CAKAR HARIMAU
function drawTigerClawStrokes(ctx, x, y, color) {
    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(x, y); ctx.lineTo(x + 25, y - 40)
    ctx.moveTo(x + 10, y); ctx.lineTo(x + 35, y - 40)
    ctx.moveTo(x + 20, y); ctx.lineTo(x + 45, y - 40)
    ctx.stroke()
    ctx.restore()
}

// Vektor Serigala (Tier E)
function drawWolfMascot(ctx, x, y, color) {
    ctx.save()
    ctx.translate(x, y)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(30, 5); ctx.lineTo(5, 45); ctx.lineTo(30, 35); ctx.lineTo(55, 45); ctx.closePath()
    ctx.fill()
    ctx.restore()
}

// Vektor Banteng (Tier D)
function drawBullMascot(ctx, x, y, color) {
    ctx.save()
    ctx.translate(x, y)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(10, 5); ctx.lineTo(25, 20); ctx.lineTo(40, 5); ctx.lineTo(55, 20); ctx.lineTo(35, 45); ctx.closePath()
    ctx.fill()
    ctx.restore()
}

// Vektor Hydra (Tier B)
function drawHydraMascot(ctx, x, y, color) {
    ctx.save()
    ctx.translate(x, y)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(35, 25, 20, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
}

// Vektor Naga (Tier A)
function drawDragonMascot(ctx, x, y, color) {
    ctx.save()
    ctx.translate(x, y)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(35, 5); ctx.lineTo(10, 45); ctx.lineTo(35, 30); ctx.lineTo(60, 45); ctx.closePath()
    ctx.fill()
    ctx.restore()
}

// Vektor Void Eye (Tier S)
function drawVoidEyeMascot(ctx, x, y, color) {
    ctx.save()
    ctx.translate(x, y)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(35, 25, 18, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(35, 25, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
}

// Vektor Mahkota Dewa (Tier SS)
function drawGodCrownMascot(ctx, x, y, color) {
    ctx.save()
    ctx.translate(x, y)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(10, 40); ctx.lineTo(10, 10); ctx.lineTo(25, 25); ctx.lineTo(40, 5); ctx.lineTo(55, 25); ctx.lineTo(70, 10); ctx.lineTo(70, 40); ctx.closePath()
    ctx.fill()
    ctx.restore()
}

// --- HELPER DATA & SYSTEM ---
function initRpgLifeData(isReincarnated = false) {
    return {
        isReincarnated,
        rank: 'E',
        level: 1,
        exp: 0,
        stats: { str: 10, agi: 10, int: 10, hp: 100, maxHp: 100 },
        questCompleted: 0,
        friends: [],
        partner: null,
        customAvatar: null,
        awaitingInput: null,
        lastTrain: 0,
        lastQuest: 0,
        lastBoss: 0
    }
}

function getQuestByRank(rank) {
    const QUESTS = {
        E: { title: 'Membasmi Slime Hijau', expReward: 50, moneyReward: 20000 },
        D: { title: 'Berburu Serigala Hutan', expReward: 120, moneyReward: 50000 },
        C: { title: 'Mengawal Karavan Pedagang', expReward: 250, moneyReward: 120000 },
        B: { title: 'Eksplorasi Reruntuhan Kuno', expReward: 500, moneyReward: 300000 },
        A: { title: 'Menaklukkan Wyvern Terbang', expReward: 1000, moneyReward: 800000 },
        S: { title: 'Pembersihan Sarang Behemoth', expReward: 2500, moneyReward: 2500000 },
        SS: { title: 'Patroli Gerbang Dimensi', expReward: 5000, moneyReward: 10000000 }
    }
    return QUESTS[rank] || QUESTS['E']
}

function checkLevelAndRankUp(rpg) {
    let msg = ''
    let expNeeded = rpg.level * 100

    if (rpg.exp >= expNeeded) {
        rpg.level += 1
        rpg.exp -= expNeeded
        rpg.stats.str += 5
        rpg.stats.agi += 5
        rpg.stats.int += 5
        rpg.stats.maxHp += 20
        rpg.stats.hp = rpg.stats.maxHp
        msg += `\n🎉 *LEVEL UP! Sekarang kamu Level ${rpg.level}!*`
    }

    if (rpg.level >= 50 && rpg.rank === 'S') { rpg.rank = 'SS'; msg += `\n🌟 *RANK UP TO SS!*` }
    else if (rpg.level >= 35 && rpg.rank === 'A') { rpg.rank = 'S'; msg += `\n🌟 *RANK UP TO S!*` }
    else if (rpg.level >= 25 && rpg.rank === 'B') { rpg.rank = 'A'; msg += `\n🌟 *RANK UP TO A!*` }
    else if (rpg.level >= 15 && rpg.rank === 'C') { rpg.rank = 'B'; msg += `\n🌟 *RANK UP TO B!*` }
    else if (rpg.level >= 10 && rpg.rank === 'D') { rpg.rank = 'C'; msg += `\n🌟 *RANK UP TO C!*` }
    else if (rpg.level >= 5 && rpg.rank === 'E') { rpg.rank = 'D'; msg += `\n🌟 *RANK UP TO D!*` }

    return msg
}