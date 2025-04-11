module.exports = {
  config: {
    name: "argent",
    version: "1.4",
    author: "Evariste",
    role: 0,
    shortDescription: "Voir ou gérer l'argent (admins seulement)",
    longDescription: "Admins peuvent modifier l'argent, les autres peuvent consulter leur solde. Commande spéciale pour afficher le top 100 des plus riches.",
    category: "economy",
    guide: {
      fr: `
{pn} → voir ton solde
{pn} add/set/remove @mention <montant> → modifier pour 1 personne (admin)
{pn} add/set/remove moi <montant> → te modifier toi-même (admin)
{pn} add/set/remove all <montant> → modifier pour tout le groupe (admin)
{pn} top → Affiche le classement des plus riches`
    }
  },

  onStart: async function ({ message, event, args, usersData, threadsData, role }) {
    const senderID = event.senderID;

    // Affichage du classement
    if (args[0] === "top") {
      const allUsers = await usersData.getAll(["money", "name"]);
      const topUsers = allUsers
        .filter(u => typeof u.money === "number")
        .sort((a, b) => b.money - a.money)
        .slice(0, 100);

      if (topUsers.length === 0) return message.reply("Aucune donnée trouvée.");

      const formatted = topUsers.map((user, index) => 
        `${index + 1}. ${user.name || "Utilisateur inconnu"} - ${user.money} $`
      ).join("\n");

      return message.reply(`🏆 Classement des plus riches :\n\n${formatted}`);
    }

    // Voir son propre solde
    if (args.length === 0) {
      const money = await usersData.get(senderID, "money") || 0;
      return message.reply(`Ton solde actuel : ${money} $`);
    }

    const [action, cible, montantStr] = args;
    const montant = parseInt(montantStr);

    if (!["add", "remove", "set"].includes(action) || isNaN(montant)) {
      return message.reply("Utilisation invalide. Exemple : argent add @Nom 100 ou argent add all 100");
    }

    if (role < 1) return message.reply("Tu n'as pas la permission pour cette commande.");

    // Cible = all
    if (cible === "all") {
      const threadID = event.threadID;
      const members = await threadsData.get(threadID, "members");

      for (const uid of members) {
        const current = await usersData.get(uid, "money") || 0;
        let nouveau;
        if (action === "add") nouveau = current + montant;
        if (action === "remove") nouveau = current - montant;
        if (action === "set") nouveau = montant;
        await usersData.set(uid, nouveau, "money");
      }

      return message.reply(`${action} ${montant} $ à tous les membres.`);
    }

    // Cible = moi
    let targetID;
    let name;
    if (cible === "moi") {
      targetID = senderID;
      name = "toi-même";
    } else {
      const mentions = Object.keys(event.mentions || {});
      if (mentions.length === 0) {
        return message.reply("Tu dois mentionner un utilisateur ou utiliser 'moi' ou 'all'.");
      }
      targetID = mentions[0];
      name = event.mentions[targetID].replace("@", "");
    }

    const current = await usersData.get(targetID, "money") || 0;
    let nouveau;
    if (action === "add") nouveau = current + montant;
    if (action === "remove") nouveau = current - montant;
    if (action === "set") nouveau = montant;
    await usersData.set(targetID, nouveau, "money");

    return message.reply(`${action} ${montant} $ à ${name}. Nouveau solde : ${nouveau} $`);
  }
};
