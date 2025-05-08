import Ipc from 'node-ipc';
import { Client, RESTPostAPIApplicationCommandsJSONBody } from 'discord.js';
import { addLog, addDebugLog } from '../helpers';
import state from '../state';
import { registerCommands } from '../commands';

export default async function (ipc: typeof Ipc, client: Client) {
  let timeout: null | NodeJS.Timeout = null;

  ipc.server.on('trigger', (data: any) => {
    try {
      addLog(`trigger ${data.webhookId} update`, client);
      addDebugLog('Trigger data received:', data);
      state.triggers[data.webhookId] = data;
      state.channels = {};
      state.baseUrl = data.baseUrl;
      const commandsParam: RESTPostAPIApplicationCommandsJSONBody[] = [];

      Object.keys(state.triggers).forEach((webhookId) => {
        const parameters = state.triggers[webhookId];
        // if no chanellIds are specified, listen to all channels using the 'all' key
        if (!parameters.channelIds || !parameters.channelIds.length)
          parameters.channelIds = ['all'];
        parameters.channelIds.forEach((channelId) => {
          if (!state.channels[channelId] && parameters.active)
            state.channels[channelId] = [parameters];
          else {
            if (parameters.active) state.channels[channelId].push(parameters);
            else delete state.channels[channelId];
          }
        });

        // push trigger command to list
        if (parameters.type === 'command' && parameters.active) {
          commandsParam.push({
            name: parameters.name || 'command',
            description: parameters.description || 'Custom command',
            options: [],
          });
        }
      });

      // build & register commands
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (data.credentials?.token && client.user?.id) {
          registerCommands(data.credentials.token, client.user.id, commandsParam);
        }
      }, 1000);
    } catch (e) {
      addLog(`${e}`, client);
    }
  });
}
