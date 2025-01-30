let anggota = ["kokona", "nariu", "mika", "nagisa", "mika", "nagisa", "mika", "nagisa", "mika", "nagisa", "mika", "nagisa" ]; //isi nama tim kamu
let tim = 7; // ini di atur aja biar tim nya cuma 2, kalau ada 8 anggota berarti 8:2 = 4, di isi angka 4
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
}
function groupMembersRandom(totalMembers, teamSize) {
    let output = [];
    let shuffledMembers = shuffleArray([...totalMembers]);

    for (let i = 0; i < shuffledMembers.length; i += teamSize) {
        output.push(shuffledMembers.slice(i, i + teamSize).join(", "));
    }
    return output.map((group, index) => `Tim ${index + 1}: ${group}`).join("\n");
}
let handler = async (m, { conn }) => {
    let hasilTim = groupMembersRandom(anggota, tim);
    conn.reply(m.chat, `*Pembagian Tim Acak:*\n\n${hasilTim}`);
};
handler.help = ['au'];
handler.tags = ['tools'];
handler.command = ['array'];
module.exports = handler;