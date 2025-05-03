import { Client, TextChannel, Message } from 'discord.js';
import { uid } from 'uid';
import { addLog, triggerWorkflow, placeholderLoading, addDebugLog } from '../helpers';
import state from '../state';

export default async function (client: Client) {
  client.on('messageCreate', async (message: Message) => {
    try {
      if (message.author.bot || message.author.system) return;
      const userRoles = message.member?.roles.cache.map((role) => role.id);
      const clientId = client.user?.id;
      const botMention = message.mentions.users.some((user) => user.id === clientId);
      message.content = message.content.replace(/<@!?\d+>/g, '').trim();

      const channelId = message.channelId;
      const triggers = state.channels[channelId] || state.channels['all'] || [];

      addDebugLog('Available triggers for channel:', {
        channelId,
        triggers: triggers.map((t) => ({
          webhookId: t.webhookId,
          type: t.type,
          debug: t.debug,
        })),
      });

      for (const trigger of triggers) {
        addDebugLog('Processing trigger:', {
          webhookId: trigger.webhookId,
          type: trigger.type,
          debug: trigger.debug,
        });

        if (trigger.debug) {
          addDebugLog('Received Discord message:', {
            content: message.content,
            author: message.author.tag,
            channelId: message.channelId,
            triggerType: trigger.type,
          });
        }

        if (trigger.type === 'message') {
          if (trigger.roleIds.length) {
            const hasRole = trigger.roleIds.some((role) => userRoles?.includes(role));
            if (!hasRole) return;
          }
          if (trigger.botMention && !botMention) return;
          const escapedTriggerValue = (trigger.value ?? '')
            .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            .replace(/-/g, '\\x2d');
          let regStr = `^${escapedTriggerValue}$`;
          if (trigger.pattern === 'start') regStr = `^${escapedTriggerValue}`;
          else if (trigger.pattern === 'end') regStr = `${escapedTriggerValue}$`;
          else if (trigger.pattern === 'contain') regStr = `${escapedTriggerValue}`;
          else if (trigger.pattern === 'regex') regStr = `${trigger.value}`;
          const reg = new RegExp(regStr, trigger.caseSensitive ? '' : 'i');
          if (reg.test(message.content)) {
            addLog(`triggerWorkflow ${trigger.webhookId}`, client);
            const placeholderMatchingId = trigger.placeholder ? uid() : '';
            const isEnabled = await triggerWorkflow(
              trigger.webhookId,
              message,
              placeholderMatchingId,
              state.baseUrl,
            ).catch((e) => e);
            if (isEnabled && trigger.placeholder) {
              const channel = client.channels.cache.get(message.channelId);
              const placeholder = await (channel as TextChannel)
                .send(trigger.placeholder)
                .catch((e: any) => addLog(`${e}`, client));
              if (placeholder)
                placeholderLoading(placeholder, placeholderMatchingId, trigger.placeholder);
            }
          }
        }
      }
    } catch (e) {
      addLog(`${e}`, client);
    }
  });
}
