const esbuild = require('esbuild');
const fs = require('fs');

const isWatch = process.argv.includes('--watch');

async function build() {
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  fs.mkdirSync('dist');

  // 1. Build main thread code
  const mainCtx = await esbuild.context({
    entryPoints: ['src/code.ts'],
    bundle: true,
    outfile: 'dist/code.js',
    target: 'es2017',
    minify: !isWatch,
  });

  // 2. Build UI script into memory
  const uiResult = await esbuild.build({
    entryPoints: ['src/ui.ts'],
    bundle: true,
    write: false,
    target: 'es2017',
    minify: !isWatch,
    loader: {
      '.css': 'text', // Resolves "import './ui.css'" into a raw CSS string variable
    },
  });

  const uiJsContent = uiResult.outputFiles[0].text;

  // 3. Read HTML and inline the compiled script string directly
  let htmlContent = fs.readFileSync('src/ui.html', 'utf8').trim();

  // Strip external script tag if present and inject inlined bundle before </body>
  htmlContent = htmlContent.replace('<script src="ui.js"></script>', '');
  htmlContent = htmlContent.replace('</body>', `<script>\n${uiJsContent}\n</script>\n</body>`);

  fs.writeFileSync('dist/ui.html', htmlContent);

  if (isWatch) {
    await mainCtx.watch();
    console.log('Watching for changes...');
  } else {
    await mainCtx.rebuild();
    await mainCtx.dispose();
    console.log('Build complete.');
  }
}

build();