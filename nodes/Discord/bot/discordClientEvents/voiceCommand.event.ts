import { Client, Message } from 'discord.js';
import { addLog, triggerWorkflow } from '../helpers';
import { voiceManager } from '../voiceCommands';
import state from '../state';
import { uid } from 'uid';
import path from 'path';
import fs from 'fs';

export default async function (client: Client) {
  voiceManager.setClient(client);

  client.on('messageCreate', async (message: Message) => {
    try {
      if (message.author.bot || message.author.system) return;

      const triggers = Object.values(state.triggers).filter(
        (trigger) => trigger.type === 'voiceCommand' && trigger.active,
      );

      for (const trigger of triggers) {
        if (trigger.pattern && trigger.value) {
          const content = message.content.toLowerCase();
          const value = trigger.value.toLowerCase();

          let shouldTrigger = false;
          switch (trigger.pattern) {
            case 'equal':
              shouldTrigger = content === value;
              break;
            case 'start':
              shouldTrigger = content.startsWith(value);
              break;
            case 'contain':
              shouldTrigger = content.includes(value);
              break;
            case 'end':
              shouldTrigger = content.endsWith(value);
              break;
            case 'regex':
              try {
                const regex = new RegExp(value);
                shouldTrigger = regex.test(content);
              } catch (e) {
                continue;
              }
              break;
          }

          if (shouldTrigger) {
            const member = message.member;
            if (!member) continue;

            const voiceChannel = member.voice.channel;
            if (!voiceChannel) {
              await message.reply(
                'Vous devez être dans un canal vocal pour utiliser cette commande.',
              );
              continue;
            }

            // Créer un dossier temporaire pour les enregistrements s'il n'existe pas
            const tempDir = path.join(process.cwd(), 'temp');
            if (!fs.existsSync(tempDir)) {
              fs.mkdirSync(tempDir);
            }

            const outputPath = path.join(tempDir, `${uid()}.mp3`);
            const duration = 30; // Durée d'enregistrement en secondes

            try {
              await voiceManager.joinChannel(voiceChannel);
              await voiceManager.executeCommand({
                channelId: voiceChannel.id,
                userId: message.author.id,
                duration,
                outputPath,
              });

              // Déclencher le workflow
              const placeholderMatchingId = trigger.placeholder ? uid() : '';
              await triggerWorkflow(
                trigger.webhookId,
                message,
                placeholderMatchingId,
                state.baseUrl,
                message.author,
                message.channelId,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
              );

              await message.reply(`Enregistrement démarré pour ${duration} secondes.`);
            } catch (error) {
              addLog(`Error in voice command: ${error}`, client);
              await message.reply("Une erreur est survenue lors de l'enregistrement.");
            }
          }
        }
      }
    } catch (e) {
      addLog(`${e}`, client);
    }
  });
}
