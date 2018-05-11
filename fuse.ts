import { spawn } from 'child_process';
import { FuseBox, WebIndexPlugin } from 'fuse-box';

const fuse = FuseBox.init({
  homeDir: 'src/',
  output: 'dist/$name.js',
  plugins: [WebIndexPlugin({ bundles: ['renderer/app'] })],
  sourceMaps: true,
});

fuse
  .bundle('main/app')
  .target('electron')
  .instructions(' > [main/index.ts]')
  .watch();

fuse.dev({ port: 7979 });

fuse
  .bundle('renderer/app')
  .target('browser@es6')
  .instructions('> renderer/index.ts')
  .hmr()
  .watch();

fuse.run().then(() => {
  // startup electron
  spawn('node', [`${__dirname}/node_modules/electron/cli.js`, __dirname], {
    stdio: 'inherit',
  }).on('exit', code => {
    // tslint:disable-next-line:no-console
    console.log(`electron process exited with code ${code}`);
    process.exit(code);
  });
});
