import {
  Routes,
  GuildMember,
  PermissionResolvable,
  Interaction,
  Client,
  RESTPostAPIApplicationCommandsJSONBody,
} from 'discord.js';
import { REST } from '@discordjs/rest';

const imports = ['clear', 'test', 'logs'];

const awaitingCommands: Promise<{
  params: Object;
  registerCommand: Function;
  executeCommand: Function;
}>[] = [];

imports.forEach((commandName) => {
  const command = import(`./commands/${commandName}`);
  awaitingCommands.push(command);
});

export const registerCommands = async (
  token: string,
  clientId: string,
  triggerCommands?: RESTPostAPIApplicationCommandsJSONBody[],
) => {
  const commands = await Promise.all(awaitingCommands).catch((e) => e);

  // commands deployment
  const rest = new REST({ version: '10' }).setToken(token);

  const parsedCommands = commands.map((e: any) => {
    return e.default.registerCommand().toJSON();
  });
  if (triggerCommands) parsedCommands.push(...triggerCommands);

  rest
    .put(Routes.applicationCommands(clientId), {
      body: parsedCommands,
    })
    .catch(console.error);

  return commands;
};

export default async function (token: string, clientId: string, client: Client) {
  const commands = await registerCommands(token, clientId);

  // commands execution
  client.on('interactionCreate', async (interaction: Interaction) => {
    try {
      if (!interaction.isChatInputCommand()) return;
      if (!interaction.guildId) {
        interaction.reply({ content: 'Commands work only inside channels' });
        return;
      }

      const member = interaction.member as GuildMember;
      if (!member.permissions.has('ADMINISTRATOR' as PermissionResolvable)) return;

      const { commandName, options } = interaction;

      const i = imports.indexOf(commandName);
      if (i === -1) return;

      const command = commands[i].default;

      const reply = await command
        .executeCommand(options.get('input')?.value, interaction)
        .catch((e: any) => e);
      const botReply = await interaction
        .reply({ content: reply, fetchReply: true })
        .catch((e) => e);

      if (command.params.autoRemove || reply === 'Done!') {
        setTimeout(async () => {
          try {
            await botReply.delete();
          } catch (error) {
            console.log('Could not delete message:', error);
            // Si on ne peut pas supprimer le message, on le modifie pour indiquer que le mode test a été activé/désactivé
            if (commandName === 'test') {
              try {
                await botReply.edit({ content: `✅ ${reply}` });
              } catch (editError) {
                console.log('Could not edit message:', editError);
              }
            }
          }
        }, 2000);
      }
    } catch (e) {
      console.log(e);
    }
  });
}
