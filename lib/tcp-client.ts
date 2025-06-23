import TcpSocket from 'react-native-tcp-socket';

interface Request {
  model: string;
  prompt: string;
  lora?: string;
}

interface Response {
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
    return new Promise((resolve, reject) => {
      this.socket.write(JSON.stringify(request) + '\n');
      this.socket.once('data', (data: Buffer) => {
        try {
          resolve(JSON.parse(data.toString()));
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  disconnect(): void {
    this.socket.end();
  }
}

export async function sendPrompt(model: string, prompt: string, lora?: string): Promise<string> {
  const client = new TcpClient();
  try {
    // Use a mock server or cloud-hosted TCP server for testing
    await client.connect('127.0.0.1', 8080); // Replace with cloud server later
    const response = await client.send({ model, prompt, lora });
    client.disconnect();
    if (response.error) throw new Error(response.error);
    return response.output || '';
  } catch (error) {
    throw new Error(`TCP Error: ${error.message}`);
  }
      }
