import fs from 'fs'
import path from 'path'

const POSITIONING_FILE = path.join(process.cwd(), 'content', 'positioning.md')

/**
 * The canonical machine-readable statement of what the company is.
 *
 * Homepage and /about copy lives inline in JSX and cannot be extracted, so this
 * file is a deliberate parallel statement rather than a derived one. Keep it to
 * durable claims (mission, product, principles, status) so the two drift slowly.
 * Consumed by /llms.txt and /llms-full.txt.
 */
export function getPositioning() {
  return fs.readFileSync(POSITIONING_FILE, 'utf8').trim()
}
