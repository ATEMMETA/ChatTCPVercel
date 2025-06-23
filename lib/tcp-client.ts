// lib/tcp-client.ts
import TcpSocket from 'react-native-tcp-socket';
import { deflate, inflate } from 'zlib';
import { promisify } from 'util';
import { infer } from './engine/llama-adapter';
import { Platform } from 'react-native';

const deflateAsync = promisify(deflate);
const inflateAsync = promisify(inflate);

export interface Request {
  model: string;
  prompt: string;
  lora?: string;
}

export interface Response {
  output?: string;
  error?: string;
}

export class TcpClient {
  private socket: any;

  async connect(host: string, port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = TcpSocket.createConnection({ host, port }, () => resolve());
      this.socket.on('error', (err: Error) => reject(err));
    });
  }

  async send(request: Request): Promise<Response> {
    return new Promise(async (resolve, reject) => {
      try {
        const compressed = await deflateAsync(Buffer.from(JSON.stringify(request)));
        this.socket.write(compressed);
        this.socket.once('data', async (data: Buffer) => {
          try {
            const decompressed = await inflateAsync(data);
            resolve(JSON.parse(decompressed.toString()));
          } catch (error) {
            reject(error);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.socket.end();
  }
}

export async function sendPrompt(model: string, prompt: string, lora?: string): Promise<string> {
  if (Platform.OS === 'web') {
    const response = await infer(model, prompt, lora);
    const request: Request = { model, prompt, lora };
    const compressed = await deflateAsync(Buffer.from(JSON.stringify(request)));
    console.log(`Original size: ${JSON.stringify(request).length}, Compressed size: ${compressed.length}`);
    return response;
  }
  // Native TCP logic
  const client = new TcpClient();
  try {
    await client.connect('192.168.49.2', 8080); // Mock host/port
    const response = await client.send({ model, prompt, lora });
    client.disconnect();
    if (response.error) throw new Error(response.error);
    return response.output || '';
  } catch (error) {
    client.disconnect();
    throw error;
  }
}
