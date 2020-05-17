const {promises: fs} = require('fs');
const path = require('path');
const signale = require('signale');

async function pathExist(path) {
  try {
    await fs.access(path);
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = {
  async onPreBuild({
    constants: {PUBLISH_DIR},
    utils: {cache},
    inputs: {outputFile, cacheDirPath},
  }) {
    const files = await cache.list();

    if (files.length) {
      const cacheManifestDir = path.resolve(PUBLISH_DIR, cacheDirPath);
      const cacheManifestPath = path.join(cacheManifestDir, outputFile);

      if (!(await pathExist(cacheManifestDir))) {
        signale.info(`${cacheManifestDir} isn't there so let's make one.`);
        await fs.mkdir(cacheManifestDir);
      }

      const fileSlug = files
        .map((item) => item.split('/'))
        .map((items) => items[items.length - 2]);

      await fs.writeFile(cacheManifestPath, JSON.stringify(fileSlug, null, 2), 'utf-8');

      signale.success(`Cache manifest saved to ${cacheManifestPath}`);
      signale.info(`Cache file count: ${files.length}`);
    } else {
      signale.log('There is no cache available for now.');
    }
  },
  async onPostBuild({constants: {PUBLISH_DIR}, utils: {cache}, inputs: {screenshotDir}}) {
    const cacheDir = path.normalize(`${PUBLISH_DIR}/${screenshotDir}`);

    if (await cache.save(`${cacheDir}`)) {
      signale.success(`Stored the ${cacheDir} to speed up future builds.`);
    } else {
      signale.log('Nothing found.');
    }
  },
};
