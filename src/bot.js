require('dotenv').config();

const { Client, Message, WebhookClient } = require('discord.js');
const client = new Client({
    partials: ['MESSAGE', 'REACTION']
});

const webhookClient = new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOK_TOKEN
);

const PREFIX = "$";



client.on('ready', () => {
    console.log(`Lets get chatting with @${client.user.username}`)
});

client.on('message', async(message) => {
    //console.log(message.content);
    if (message.author.bot) return;

    if (message.content === 'hello') {
        message.channel.send('hello')
    }
    if (message.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = message.content.trim().substring(PREFIX.length).split(/\s+/);

        if (CMD_NAME === 'kick') {
            if (!message.member.hasPermission('KICK_MEMBERS')) return message.reply('You do not have permissions to execute the Kick Command.');
            if (args.length === 0) return message.reply('Please provide an ID');
            const member = message.guild.members.cache.get(args[0]);

            if (member) {
                member.kick()
                    .then((member) => message.channel.send(`${member} was kicked from channel.`))
                    .catch((err) => message.channel.send('I do not have permissions to kick the user'));
            } else {
                message.channel.send('The member does not exist');
            }
        } else if (CMD_NAME === 'ban') {
            if (!message.member.hasPermission('BAN_MEMBERS')) return message.reply('You do not have permissions to execute the Ban Command.');
            if (args.length === 0) return message.reply('Please provide an ID');
            // message.guild.members.ban(args[0])
            //     .catch((err) => console.log(err));

            try {
                const user = await message.guild.members.ban(args[0]);
                message.channel.send('User was banned from channel.');
            } catch (err) {
                console.log(err);
                message.channel.send('An error occurred, either i dont have permissions or the user was not found.');

            }

        } else if (CMD_NAME === 'announce') {
            console.log(args);
            const msg = args.join(' ');
            console.log(msg);
            webhookClient.send(msg);
        }
    }


});

client.on('messageReactionAdd', (reaction, user) => {
    console.log('Hello');
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);

    if (reaction.message.id === '747692651146510416') {
        switch (name) {
            case '🍎':
                member.roles.add('747695912687763458');
                break;
            case '🍌':
                member.roles.add('747696124445458462');
                break;
            case '🍇':
                member.roles.add('747695909034524763');
                break;
            case '🍑':
                member.roles.add('747696120943214623');
                break;

        }

    }
})
client.on('messageReactionRemove', (reaction, user) => {
    console.log('Hello');
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);

    if (reaction.message.id === '747692651146510416') {
        switch (name) {
            case '🍎':
                member.roles.remove('747695912687763458');
                break;
            case '🍌':
                member.roles.remove('747696124445458462');
                break;
            case '🍇':
                member.roles.remove('747695909034524763');
                break;
            case '🍑':
                member.roles.remove('747696120943214623');
                break;

        }

    }
})

client.login(process.env.DISCORDJS_BOT_TOKEN);