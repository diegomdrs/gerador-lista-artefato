const semver = require('semver')
const { StatusCodes } = require('http-status-codes')

module.exports = {

  obterVersaoApp: async () => {

    const packageVersion = require('../package.json').version
    return  { version: packageVersion };
  },

  verificarUltimaVersaoApp: async () => {

    const packageVersion = require('../package.json').version
    const latestVersion = await obterUltimaVersao()
    const respJson = { packageVersion, latestVersion };

    if (semver.valid(packageVersion) && semver.valid(latestVersion)) {
      respJson.outOfDate = semver.ltr(packageVersion, latestVersion)
    }

    return respJson;
  }
}

async function obterUltimaVersao() {

  const options = {
    hostname: 'api.github.com',
    timeout: 1000,
    path: '/repos/diegomdrs/gerador-lista-artefato/releases/latest',
    headers: { 'User-Agent': 'request' }
  };

  return new Promise((resolve, reject) => {

    const req = require('https').request(options, (res) => {
      let json = '';

      res.on('data', chunk => {
        json += chunk;
      });

      res.on('end', function () {
        if (res.statusCode === StatusCodes.OK) {
          const latest = JSON.parse(json)
          resolve(latest.tag_name);
        } else {
          reject(new Error(`Erro ao obter a versão. StatusCode: ${res.statusCode}`));
        }
      });
    });

    req.on('timeout', () => {
      reject(new Error(`Erro ao obter a versão em ${options.timeout / 1000}s`));
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}