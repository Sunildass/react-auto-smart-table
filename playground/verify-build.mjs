import { build } from 'vite';

async function verifyBuild() {
  try {
    await build({
      root: process.cwd(),
      logLevel: 'info',
    });
    console.log('SUCCESS_APP_BUILD');
  } catch (e) {
    console.error('FAILED_APP_BUILD', e);
    process.exit(1);
  }
}

verifyBuild();
