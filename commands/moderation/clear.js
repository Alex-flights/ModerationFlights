module.exports = {
    name: "clear",
    aliases: ["purge", "nuke"],
    category: "moderation",
    description: "Clears the chat",
    run: async (client, message, args) => {
        if (message.deletable) {
            message.delete();
        }

        // Member doesn't have permission
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply(":pick: :airplane: You can't delete messages without permission :airplane: :pick:").then(m => m.delete(5000));
        }

        // Check if args[0] is a number
        if (isNaN(args[0]) || parseInt(args[0]) <- 0) {
            return message.reply(":pick: :airplane: Yeah.... That's not a number? I also can't delete 0 msgs anyway fool. :airplane: :pick:").then(m => m.delete(5000));
        }

        // Maybe the bot can't delete msgs
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.reply(":pick: :airplane: Sowwy........ I can't delete messages without permission :airplane: :pick:").then(m => m.delete(5000));
        }

        let deleteAmount;

        if (parseInt(args[0]) > 100) {
            deleteAmount = 100;
        } else {
            deleteAmount = parseInt(args[0]);
        }

        message.channel.bulkDelete(deleteAmount, true)
            .then(deleted => message.channel.send(`I deleted \` ${deleted.size}\` messages`))
            .catch(err => message.reply(`:pick: :airplane: Something went wrong... :airplane: :pick:`));
    }
}