import fs from 'fs'
import yaml from 'js-yaml'
import https from 'https'
import http from 'http'

const files = fs.readdirSync('projects').filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))

console.log(`Checking ${files.length} project URLs...\n`)

let checked = 0
let reachable = 0
let warnings = 0
let failed = 0

const checkUrl = (url) => {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http

    const req = protocol.get(url, { timeout: 10000 }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log(`  ✓ ${url} is reachable (${res.statusCode})`)
        reachable++
      } else {
        console.log(`  ⚠ ${url} returned ${res.statusCode}`)
        warnings++
      }
      resolve()
    })

    req.on('error', (err) => {
      console.log(`  ✗ ${url} failed: ${err.message}`)
      failed++
      resolve()
    })

    req.on('timeout', () => {
      console.log(`  ✗ ${url} timed out`)
      failed++
      req.destroy()
      resolve()
    })
  })
}

async function checkAllUrls() {
  for (const file of files) {
    const content = fs.readFileSync(`projects/${file}`, 'utf8')
    const data = yaml.load(content)
    const url = data.url

    console.log(`Checking ${url}...`)
    await checkUrl(url)
    checked++
  }

  console.log('\n================================')
  console.log('URL Check Summary')
  console.log('================================')
  console.log(`Total checked: ${checked}`)
  console.log(`✓ Reachable: ${reachable}`)
  console.log(`⚠ Warnings: ${warnings}`)
  console.log(`✗ Failed: ${failed}`)

  if (failed > 0) {
    console.error('\n❌ URL check failed! Some URLs are not reachable.')
    process.exit(1)
  } else if (warnings > 0) {
    console.warn('\n⚠️  Some URLs returned non-200 status codes but are reachable.')
  } else {
    console.log('\n✅ All URLs are reachable!')
  }
}

checkAllUrls()
