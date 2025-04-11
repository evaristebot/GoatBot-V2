module.exports = {
  config: {
    name: "paris",
    version: "2.0",
    author: "Evariste",
    role: 0,
    shortDescription: "Parier de l'argent (pile ou face équitable)",
    longDescription: "Tu paries une somme avec 50 % de chance de la doubler.",
    category: "games",
    guide: {
      fr: "{pn} <montant> → Parie un montant avec 50% de chance de gagner"
    }
  },

  onStart: async function ({ message, event, args, usersData }) {
    const uid = event.senderID;
    const montant = parseInt(args[0]);

    if (isNaN(montant) || montant <= 0) {
      return message.reply("❌ | Le montant doit être un nombre positif.");
    }

    const solde = await usersData.get(uid, "money") || 0;

    if (solde < montant) {
      return message.reply(`❌ | Tu n'as pas assez d'argent. Solde actuel : ${solde} $`);
    }

    const chance = Math.random(); // Retourne un nombre entre 0 et 1

    let resultMessage = "";
    if (chance < 0.5) {
      // Gagné
      const nouveauSolde = solde + montant;
      await usersData.set(uid, nouveauSolde, "money");
      resultMessage = `✅ | Tu as gagné ! Tu gagnes ${montant} $.\nTon nouveau solde est de ${nouveauSolde} $.`;
    } else {
      // Perdu
      const nouveauSolde = solde - montant;
      await usersData.set(uid, nouveauSolde, "money");
      resultMessage = `❌ | Tu as perdu ${montant} $.\nTon nouveau solde est de ${nouveauSolde} $.`;
    }

    return message.reply(`🎲 | Chance utilisée : ${(chance * 100).toFixed(2)} %\n${resultMessage}`);
  }
};
