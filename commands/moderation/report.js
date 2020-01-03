const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "report",
    category: "moderation",
    description: "Reports a Member",
    usage: "<mention | id>",
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        let rMember = message.mentions.members.first() || message.guild.get(args[0]);

        if (!rMember)
            return message.reply(":pick: :airplane: Oops i couldn't find that person. Did the airplane fall down? :airplane: :pick:").then(m => m.delete(5000));

            if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
                return message.reply(":pick: :airplane: Can't report that member. Did the plane fall? :airplane: :pick:").then(m => m.delete(5000));

            if (!args[1])
                return message.channel.send(":pick: :airplane: Please provide a reason for the report. Do not troll in here! :airplane: :pick:").then(m => m.delete(5000));

                const channel = message.guild.channels.find(c => c.name === "📏report");

            if (!channel)
                return message.channel.send(":pick: :airplane: I could not find a \`#📏report\` Channel. Did the plane go away? Or did it go down? :airplane: :pick:").then(m => m.delete(5000));

            const embed = new RichEmbed()
                .setColor("#ff0000")
                .setTimestamp()
                .setFooter(message.guild.name, message.guild.iconURL)
                .setAuthor("Reported Member", rMember.user.displayAvatarURL)
                .setDescription(stripIndents`**> Member:** ${rMember} (${rMember.id})
                **> Reported By:** ${message.member} (${message.member.id})
                **Reported In:**  ${message.channel}
                **> Reason:** ${args.slice(1).join(" ")}`)

            return channel.send(embed);
    }
}