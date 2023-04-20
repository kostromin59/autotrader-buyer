import { Client } from 'fnbr';
import { readFile, writeFile } from 'fs/promises';
import { Server } from 'socket.io';

main();

async function main() {
  const fnbrBot = await loginBot();
  const server = new Server();

  server.on('connection', () => {
    console.log('Connected!');
  });

  fnbrBot.on('friend:request', async ({ displayName }) => {
    if (!displayName) return;
    await fnbrBot.removeFriend(displayName);

    server.emit('new-request', displayName);
  });

  server.listen(3123, {
    cors: {
      origin: '*',
    },
  });
}

async function loginBot(): Promise<Client> {
  let auth: Record<string, unknown>;
  try {
    auth = {
      deviceAuth: JSON.parse(String(await readFile('../deviceAuth.json'))),
    };
  } catch (e) {
    auth = {
      authorizationCode: async () =>
        Client.consoleQuestion('Please enter an authorization code: '),
    };
  }
  const client = new Client({ auth });
  client.on('deviceauth:created', (da) =>
    writeFile('../deviceAuth.json', JSON.stringify(da, null, 2))
  );

  await client.login();
  console.log(`Logged in as ${client.user?.displayName}`);

  return client;
}
