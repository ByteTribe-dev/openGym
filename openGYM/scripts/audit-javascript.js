const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const failures = []

function walk(directory) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', '.git', 'assets'].includes(item.name)) continue
    const absolute = path.join(directory, item.name)
    if (item.isDirectory()) walk(absolute)
    else if (absolute === __filename) continue
    else if (/\.(ts|tsx)$/.test(item.name) || item.name === 'tsconfig.json') failures.push(`TypeScript artifact: ${path.relative(root, absolute)}`)
    else if (/\.(js|jsx)$/.test(item.name) && !item.name.includes('.test.')) {
      const source = fs.readFileSync(absolute, 'utf8')
      for (const token of ['react-dom', 'react-router', '@capacitor/', 'import.meta.glob', 'localStorage', 'document.']) {
        if (source.includes(token)) failures.push(`Browser dependency ${JSON.stringify(token)}: ${path.relative(root, absolute)}`)
      }
    }
  }
}

walk(root)
if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else console.log('JavaScript/native boundary audit passed.')
