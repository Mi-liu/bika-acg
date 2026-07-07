export interface AppVersionInfo {
  version: string
  commit: string
  buildTime: string
}

export const currentVersionInfo = __APP_VERSION_INFO__

export async function logAppVersion() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}version.json`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`version.json request failed: ${response.status}`)
    }

    const versionJson = await response.json() as AppVersionInfo

    console.info('[version]', {
      currentVersion: currentVersionInfo.version,
      currentCommit: currentVersionInfo.commit,
      currentBuildTime: currentVersionInfo.buildTime,
      versionJsonVersion: versionJson.version,
      versionJsonCommit: versionJson.commit,
      versionJsonBuildTime: versionJson.buildTime,
    })
  }
  catch (error) {
    console.warn('[version] failed to load version.json', {
      currentVersion: currentVersionInfo.version,
      currentCommit: currentVersionInfo.commit,
      currentBuildTime: currentVersionInfo.buildTime,
      error,
    })
  }
}
