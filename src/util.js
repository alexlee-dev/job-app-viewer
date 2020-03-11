import boxen from 'boxen'
import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import Table from 'cli-table'

import { readFile, stat } from 'fs'
import { join } from 'path'

/**
 * Blank style applied to Boxen.
 */
const blankBoxenStyle = {
  borderStyle: {
    topLeft: ' ',
    topRight: ' ',
    bottomLeft: ' ',
    bottomRight: ' ',
    horizontal: ' ',
    vertical: ' '
  },
  float: 'center',
  padding: { top: 0, bottom: 0, right: 1, left: 1 }
}

/**
 * Default style applied to Boxen.
 */
const defaultBoxenStyle = {
  borderColor: 'magentaBright',
  borderStyle: 'round',
  float: 'center',
  padding: { top: 0, bottom: 0, right: 1, left: 1 }
}

const statusColors = {
  Accepted: chalk.greenBright,
  Applied: chalk.yellowBright,
  Rejected: chalk.redBright
}

/**
 * Uses Figlet to transform your text to ASCII.
 * @param {String} txt Text to be figlet-itized.
 * @param {Object} options Options object.
 * @returns {Promise} Resolves with text.
 */
const figletPromise = (txt, options = {}) =>
  new Promise((resolve, reject) =>
    figlet.text(txt, options, (error, result) => {
      if (error) {
        return reject(error)
      }

      return resolve(result)
    })
  )

const read = path =>
  new Promise((resolve, reject) => {
    try {
      readFile(path, (err, data) => {
        if (err) {
          return reject(err)
        }

        resolve(JSON.parse(data.toString()))
      })
    } catch (e) {
      reject(e)
    }
  })

const createTable = jobs =>
  new Promise((resolve, reject) => {
    try {
      const table = new Table({ head: ['id', 'Company', 'Title', 'Type', 'Status'] })

      jobs.forEach(job => {
        const status = statusColors[job.status] ? statusColors[job.status](job.status) : chalk.yellowBright(job.status)

        table.push([`${job.id}`, `${job.company}`, `${job.title}`, `${job.type}`, status])
      })

      resolve(table)
    } catch (e) {
      reject(e)
    }
  })

const displayJobs = () =>
  new Promise(async (resolve, reject) => {
    try {
      const { jobs } = await read(join(__dirname, '../jobs.json'))
      const table = await createTable(jobs)

      console.log(boxen(table.toString(), blankBoxenStyle))
      resolve()
    } catch (e) {
      reject(e)
    }
  })

const displayTitle = () =>
  new Promise(async (resolve, reject) => {
    try {
      const text = await figletPromise('Job Applications', { font: 'slant' })

      clear()
      console.log(boxen(chalk.blueBright(text), defaultBoxenStyle))
      resolve()
    } catch (e) {
      reject(e)
    }
  })

module.exports = {
  displayJobs,
  displayTitle
}
