import { MessageReaction, User, PartialMessageReaction, PartialUser, Message } from 'discord.js';
import state from '../state';
import { triggerWorkflow } from '../helpers';

interface ITrigger {
  type: string;
  channelIds?: string[];
  roleIds?: string[];
  pattern?: string;
  value?: string;
  webhookId: string;
  debug?: boolean;
}

export const handleReactionAdd = async (
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
) => {
  if (user.bot || !reaction.message.guild) return;

  const message = reaction.message;
  const channel = message.channel;

  // Vérifier si le channel est dans la liste des channels à surveiller
  const triggers = Object.values(state.triggers).filter(
    (trigger: ITrigger) =>
      trigger.type === 'reaction' &&
      (!trigger.channelIds?.length || trigger.channelIds.includes(channel.id)),
  );

  for (const trigger of triggers) {
    // Vérifier le rôle de l'utilisateur
    if (trigger.roleIds?.length && !user.bot) {
      const member = await message.guild?.members.fetch(user.id);
      if (!member || !member.roles.cache.some((role) => trigger.roleIds?.includes(role.id))) {
        continue;
      }
    }

    // Vérifier le contenu du message si un filtre est défini
    if (trigger.pattern && trigger.value && message.content) {
      const content = message.content.toLowerCase();
      const value = trigger.value.toLowerCase();

      switch (trigger.pattern) {
        case 'equal':
          if (content !== value) continue;
          break;
        case 'start':
          if (!content.startsWith(value)) continue;
          break;
        case 'contain':
          if (!content.includes(value)) continue;
          break;
        case 'end':
          if (!content.endsWith(value)) continue;
          break;
        case 'regex':
          try {
            const regex = new RegExp(value);
            if (!regex.test(content)) continue;
          } catch (e) {
            continue;
          }
          break;
      }
    }

    // Envoyer l'événement au webhook
    const fullUser = await user.fetch();
    const fullReaction = await reaction.fetch();
    await triggerWorkflow(
      trigger.webhookId,
      message as Message,
      '',
      state.baseUrl,
      fullUser,
      channel.id,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      (await message.guild?.members.fetch(user.id))?.roles.cache.map((role) => role.id) || [],
      fullReaction.emoji.name || fullReaction.emoji.toString(),
      'add',
    );
  }
};

export const handleReactionRemove = async (
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
) => {
  if (user.bot || !reaction.message.guild) return;

  const message = reaction.message;
  const channel = message.channel;

  // Vérifier si le channel est dans la liste des channels à surveiller
  const triggers = Object.values(state.triggers).filter(
    (trigger: ITrigger) =>
      trigger.type === 'reaction' &&
      (!trigger.channelIds?.length || trigger.channelIds.includes(channel.id)),
  );

  for (const trigger of triggers) {
    // Vérifier le rôle de l'utilisateur
    if (trigger.roleIds?.length && !user.bot) {
      const member = await message.guild?.members.fetch(user.id);
      if (!member || !member.roles.cache.some((role) => trigger.roleIds?.includes(role.id))) {
        continue;
      }
    }

    // Vérifier le contenu du message si un filtre est défini
    if (trigger.pattern && trigger.value && message.content) {
      const content = message.content.toLowerCase();
      const value = trigger.value.toLowerCase();

      switch (trigger.pattern) {
        case 'equal':
          if (content !== value) continue;
          break;
        case 'start':
          if (!content.startsWith(value)) continue;
          break;
        case 'contain':
          if (!content.includes(value)) continue;
          break;
        case 'end':
          if (!content.endsWith(value)) continue;
          break;
        case 'regex':
          try {
            const regex = new RegExp(value);
            if (!regex.test(content)) continue;
          } catch (e) {
            continue;
          }
          break;
      }
    }

    // Envoyer l'événement au webhook
    const fullUser = await user.fetch();
    const fullReaction = await reaction.fetch();
    await triggerWorkflow(
      trigger.webhookId,
      message as Message,
      '',
      state.baseUrl,
      fullUser,
      channel.id,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      (await message.guild?.members.fetch(user.id))?.roles.cache.map((role) => role.id) || [],
      fullReaction.emoji.name || fullReaction.emoji.toString(),
      'remove',
    );
  }
};
