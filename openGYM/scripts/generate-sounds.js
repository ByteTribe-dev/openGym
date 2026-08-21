const fs = require('node:fs')
const path = require('node:path')

const sampleRate = 22050
const directory = path.resolve(__dirname, '..', 'assets', 'sounds')

function wav(name, notes) {
  const gap = 0.045
  const samples = []
  for (const [frequency, duration] of notes) {
    const count = Math.round(duration * sampleRate)
    for (let i = 0; i < count; i++) {
      const envelope = Math.min(1, i / 160) * Math.min(1, (count - i) / 600)
      samples.push(Math.round(Math.sin(i / sampleRate * Math.PI * 2 * frequency) * envelope * 12000))
    }
    for (let i = 0; i < gap * sampleRate; i++) samples.push(0)
  }
  const buffer = Buffer.alloc(44 + samples.length * 2)
  buffer.write('RIFF', 0); buffer.writeUInt32LE(buffer.length - 8, 4); buffer.write('WAVE', 8)
  buffer.write('fmt ', 12); buffer.writeUInt32LE(16, 16); buffer.writeUInt16LE(1, 20)
  buffer.writeUInt16LE(1, 22); buffer.writeUInt32LE(sampleRate, 24); buffer.writeUInt32LE(sampleRate * 2, 28)
  buffer.writeUInt16LE(2, 32); buffer.writeUInt16LE(16, 34); buffer.write('data', 36); buffer.writeUInt32LE(samples.length * 2, 40)
  samples.forEach((sample, index) => buffer.writeInt16LE(sample, 44 + index * 2))
  fs.writeFileSync(path.join(directory, name), buffer)
}

fs.mkdirSync(directory, { recursive: true })
wav('set-complete.wav', [[660, 0.08]])
wav('timer-complete.wav', [[880, 0.11], [1100, 0.13]])
wav('workout-complete.wav', [[660, 0.09], [880, 0.09], [1100, 0.18]])
