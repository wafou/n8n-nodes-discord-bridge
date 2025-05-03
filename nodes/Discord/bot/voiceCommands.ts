import { Client, VoiceBasedChannel } from 'discord.js';
import {
  joinVoiceChannel,
  entersState,
  VoiceConnectionStatus,
  EndBehaviorType,
  AudioReceiveStream,
} from '@discordjs/voice';
import { pipeline } from 'stream';
import { createWriteStream } from 'fs';
import { addLog } from './helpers';
import { Readable } from 'stream';

interface IVoiceCommand {
  channelId: string;
  userId: string;
  duration: number;
  outputPath: string;
}

class VoiceManager {
  private connections: Map<string, any> = new Map();
  private recordings: Map<string, AudioReceiveStream> = new Map();
  private client: Client | null = null;

  setClient(client: Client) {
    this.client = client;
  }

  async joinChannel(channel: VoiceBasedChannel): Promise<void> {
    if (this.connections.has(channel.id)) {
      return;
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
      this.connections.set(channel.id, connection);
    } catch (error) {
      connection.destroy();
      throw error;
    }
  }

  async leaveChannel(channelId: string): Promise<void> {
    const connection = this.connections.get(channelId);
    if (connection) {
      connection.destroy();
      this.connections.delete(channelId);
    }
  }

  async executeCommand(command: IVoiceCommand): Promise<void> {
    const connection = this.connections.get(command.channelId);
    if (!connection) {
      throw new Error('Not connected to voice channel');
    }

    const audioStream = connection.receiver.subscribe(command.userId, {
      end: {
        behavior: EndBehaviorType.Manual,
      },
    });

    this.recordings.set(command.channelId, audioStream);

    const outputStream = createWriteStream(command.outputPath);
    pipeline(
      audioStream as unknown as Readable,
      outputStream as unknown as NodeJS.WritableStream,
      (err: Error | null) => {
        if (err) {
          addLog(`Error in pipeline: ${err}`, this.client!);
        }
      },
    );

    // Arrêter l'enregistrement après la durée spécifiée
    setTimeout(() => {
      this.stopRecording(command.channelId);
    }, command.duration * 1000);
  }

  async stopRecording(channelId: string): Promise<void> {
    const recording = this.recordings.get(channelId);
    if (recording) {
      recording.destroy();
      this.recordings.delete(channelId);
    }
  }
}

export const voiceManager = new VoiceManager();
