import { app } from 'electron'
import path from 'path'
import fs from 'fs/promises'

class ConfigRepository {
  constructor() {
    this.configPath = path.join(app.getPath('userData'), 'config.json')
  }

  async read() {
    try {
      const data = await fs.readFile(this.configPath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      if (error.code === 'ENOENT') {
        return {}
      }
      console.error('Failed to read config file:', error.message)
      return {}
    }
  }

  async write(configData) {
    try {
      const existing = await this.read()
      const merged = { ...existing, ...configData }
      await fs.writeFile(this.configPath, JSON.stringify(merged, null, 2), 'utf-8')
    } catch (error) {
      console.error('Failed to write config file:', error.message)
      throw error
    }
  }
}

export const configRepository = new ConfigRepository()
