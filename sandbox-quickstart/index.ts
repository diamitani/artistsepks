import dotenv from 'dotenv';
import { Sandbox } from '@vercel/sandbox';

dotenv.config({ path: '.env.local' });

const sandbox = await Sandbox.getOrCreate({
  name: "my-sandbox-438763",
  persistent: true,
  networkPolicy: 'deny-all',
});

await sandbox.update({ networkPolicy: 'deny-all' });

try {
  await sandbox.writeFiles([
    {
      path: '/vercel/generated.mjs',
      content: "console.log('Hello from generated code')",
    },
  ]);

  const result = await sandbox.runCommand('node', [
    '/vercel/generated.mjs',
  ]);

  console.log(await result.stdout());

  if (result.exitCode !== 0) {
    console.error(await result.stderr());
  }
} finally {
  await sandbox.stop();
}
