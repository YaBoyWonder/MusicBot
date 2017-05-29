'use strict';
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const client = new Discord.Client();
const auth = require('./settings/config.json');
client.login(settings.token).then(() => console.log('logged')).catch(console.error);
const connections = new Map();

client.on('message', msg => {
  if (!msg.guild) return;
   if (msg.content.startsWith('m.join')) {
     const channel = msg.guild.channels.get(msg.content.split(' ')[1]) || msg.member.voiceChannel;
       if (channel && channel.type === 'voice') {
       channel.join().then(conn => {
        conn.player.on('error', (...e) => console.log('player', ...e));
       if (!connections.has(msg.guild.id)) connections.set(msg.guild.id, { conn, queue: [] });
       msg.reply('ok!');
      });
      } else { mg.reply('Specify a voice channel!')};
  
    } else if (msg.content.startsWith('m.play')) {
    if (connections.has(msg.guild.id)) {
        const connData = connections.get(msg.guild.id);
        const queue = connData.queue;
        const url = msg.content.split(' ').slice(1).join(' ')
            .replace(/</g, '')
            .replace(/>/g, '');
       queue.push({ url, m });
      if (queue.length > 1) {
         msg.reply(`OK, your song is going to play after ${queue.length - 1} songs`);
        return;
      }
       doQueue(connData);
    }
  }
});

 function doQueue(connData) {
  const conn = connData.conn;
   const queue = connData.queue;
  const item = queue[0];
   if (!item) return;
    const stream = ytdl(item.url, { filter: 'audioonly' }, { passes: 3 });
   const dispatcher = conn.playStream(stream);
  stream.on('info', info => {
     item.m.reply(`OK, playing right now **${info.title}**`);
  });
  dispatcher.on('end', () => {
     queue.shift();
     doQueue(connData);
   });
 dispatcher.on('error', (...e) => console.log('dispatcher', ...e));
}
