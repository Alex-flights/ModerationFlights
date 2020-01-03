const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promtMessage } = require("../../functions.js");

module.exports = {
    name: "kick",
    category: "moderation",
    description: "Kicks the Member",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "logs") || message.channel;

        if (message.deletable) message.delete();

        // No Args
        if (!args[0]) {
            return message.reply(":pick: :airplane: Please provide a person to kick! You destroyed the plane... :airplane: :pick:")
                .then(m => m.delete(5000));
        }

        // No Reason
        if (!args[1]) {
            return message.reply(":pick: :airplane: Please provide a reason to kick! You destroyed the plane... :airplane: :pick:")
                .then(m => m.delete(5000));
        }

        // No Author permissions
        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return message.reply(":pick: :airplane: You don't have permission to do it buddy please contant staff, because you will destroy the plane! :airplane: :pick:")
                .then(m => m.delete(5000));
        }

        // No bot permission
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
            return message.reply(":pick: :airplane: A plane doesnt have perm **KICK_MEMBERS** Please give it to the bot and try again! :airplane: :pick:")
                .then(m => m.delete(5000));
        }

        const toKick = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No member found
        if (!toKick) {
            return message.reply(":pick: :airplane: Couldn't find that member, try again! :airplane: :pick:")
                .then(m => m.delete(5000));
        }

        // Can't kick yourself
        if (message.author.id === toKick.id) {
            return message.reply(":pick: :airplane: You can't kick yourself silly. But you can destroy the flight like that. :airplane: :pick:")
                .then(m => m.delete(5000));
        }
        // Kickable
        if (!toKick.kickable) {
            return message.reply(":pick: :airplane: I can't kick that person due to role hierarchy, i suppose. :airplane: :pick:")
                .then(m => m.delete(5000));
        }

        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toKick.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**> Kicked Member:** ${toKick} (${toKick.id})
            **> Kicked By:** ${message.author} (${message.author.id})
            **> Reason:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor("This verification becomes invalid after 30s!:")
            .setDescription(`Do you want to kick ${toKick}?`);

        message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promtMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {
                msg.delete();

                toKick.kick(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`Err....... Someting wen't wrong?`)
                    });

                logChannel.send(embed);
        } else if (emoji === "❌") {
            msg.delete();

            message.reply("Kick canceled...")
                .then(m => m.delete(5000));
        }
        })
    }
}