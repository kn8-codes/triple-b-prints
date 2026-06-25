import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const source = '/Users/kn8/projects/triple-b-prints/static/favicon.svg';
const svg = await readFile(source);

const outputs = [
  { size: 16, path: '/Users/kn8/projects/triple-b-prints/static/favicon-16.png' },
  { size: 32, path: '/Users/kn8/projects/triple-b-prints/static/favicon-32.png' },
  { size: 180, path: '/Users/kn8/projects/triple-b-prints/static/apple-touch-icon.png' },
  { size: 512, path: '/Users/kn8/projects/triple-b-prints/static/favicon-512.png' }
];

for (const output of outputs) {
  await sharp(svg, { density: 384 })
    .resize(output.size, output.size, { fit: 'contain' })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(output.path);
  console.log(`${output.path} ${output.size}x${output.size}`);
}
