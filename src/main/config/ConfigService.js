import { configRepository } from './ConfigRepository'

class ConfigService {
  async getMongoUri() {
    const config = await configRepository.read()
    return config.mongodbUri || null
  }

  async setMongoUri(uri) {
    await configRepository.write({ mongodbUri: uri })
  }

  async clearMongoUri() {
    await configRepository.write({ mongodbUri: undefined })
  }
}

export const configService = new ConfigService()
