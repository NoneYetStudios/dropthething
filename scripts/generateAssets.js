/**
 * Asset Generator for Drop The Thing
 * Generates physical files for:
 * 1. 12 Modern SVG Object Artworks (frontend/assets/objects/modern/*.svg)
 * 2. 12 Retro Pixel-Art SVG Object Sprites (frontend/assets/objects/retro/*.svg)
 * 3. Physical WAV Sound Effects (frontend/assets/sounds/*.wav)
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { OBJECTS } = require('../frontend/js/objects');

const baseDir = path.resolve(__dirname, '../frontend/assets');
const modernDir = path.join(baseDir, 'objects/modern');
const retroDir = path.join(baseDir, 'objects/retro');
const soundDir = path.join(baseDir, 'sounds');

for (const dir of [modernDir, retroDir, soundDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

// 1. Write Modern & Retro SVG files for all 12 objects
for (const obj of OBJECTS) {
  fs.writeFileSync(path.join(modernDir, `${obj.id}.svg`), obj.modernSvg.trim() + '\n', 'utf8');
  fs.writeFileSync(path.join(retroDir, `${obj.id}.svg`), obj.retroSvg.trim() + '\n', 'utf8');
}

// 2. Generate 16-bit PCM WAV files for sound effects
function writeWavFile(filename, samples, sampleRate = 22050) {
  const numSamples = samples.length;
  const buffer = Buffer.alloc(44 + numSamples * 2);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  for (let i = 0; i < numSamples; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }

  fs.writeFileSync(path.join(soundDir, filename), buffer);
}

function synthSequence(freqs, durationSec, wave = 'square', sampleRate = 22050) {
  const totalSamples = Math.floor(durationSec * sampleRate);
  const samples = new Float32Array(totalSamples);
  const segLen = Math.floor(totalSamples / freqs.length);

  for (let i = 0; i < totalSamples; i++) {
    const segIdx = Math.min(freqs.length - 1, Math.floor(i / segLen));
    const freq = freqs[segIdx];
    const t = i / sampleRate;
    const env = Math.max(0, 1 - (i % segLen) / segLen) * 0.35;
    const phase = 2 * Math.PI * freq * t;
    let val = 0;
    if (wave === 'square') {
      val = Math.sin(phase) >= 0 ? 1 : -1;
    } else if (wave === 'noise') {
      val = (Math.random() * 2 - 1) * 0.8 + (Math.sin(phase) >= 0 ? 0.2 : -0.2);
    } else {
      val = Math.sin(phase);
    }
    samples[i] = val * env;
  }
  return samples;
}

writeWavFile('drop.wav', synthSequence([680, 560, 440, 320, 220], 0.25, 'square'));
writeWavFile('bounce.wav', synthSequence([240, 380, 520, 680], 0.18, 'square'));
writeWavFile('shatter.wav', synthSequence([1200, 920, 1480, 660, 440], 0.28, 'noise'));
writeWavFile('splatter.wav', synthSequence([320, 180, 260, 140], 0.26, 'noise'));
writeWavFile('explode.wav', synthSequence([160, 110, 80, 55], 0.38, 'noise'));
writeWavFile('click.wav', synthSequence([880], 0.05, 'square'));
writeWavFile('fanfare.wav', synthSequence([523.25, 659.25, 783.99, 1046.5], 0.36, 'square'));

console.log(`✅ Generated ${OBJECTS.length} Modern SVGs, ${OBJECTS.length} Retro Pixel SVGs, and 7 WAV sounds in frontend/assets/`);
