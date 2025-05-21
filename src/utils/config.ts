import fs from 'node:fs'
import { dir } from '@/dir'
import { watch, requireFileSync, type Permission } from 'node-karin'

export interface Config {
  /** 是否需要前缀# */
  prefix: boolean
  render: {
    /** 是否允许渲染本地文件 */
    local: boolean
    /** 是否允许渲染网络文件 */
    network: boolean
    /** 渲染本地文件是否需要管理员权限 */
    localPermission: boolean
    /** 渲染网络文件是否需要管理员权限 */
    networkPermission: boolean
  }
  /** 权限配置 "master" | "admin" | "group.owner" | "group.admin" | "all" | "guild.owner" | "guild.admin" */
  permission: Permission
  /** 像素比 越高越清晰 但是会减缓渲染速度 */
  deviceScaleFactor: number
  /** 页面加载状态 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2'
   * load: 页面完全加载
   * domcontentloaded: DOMContentLoaded 事件触发 如果纯静态可以使用
   * networkidle0: 500ms内没有网络连接
   * networkidle2: 500ms内网络连接数小于2
   */
  waitUntil: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2'
  /** markedKatex配置 详情查看https://katex.org/docs/options.html */
  markedKatex: {
    /** 输出格式 html | mathml | htmlAndMathml */
    output: 'html' | 'mathml' | 'htmlAndMathml'
    /** 是否在错误时抛出异常 */
    throwOnError: boolean
  }
}

let configCache: Config

/**
 * @description 获取默认配置
 */
const getDefConfig = (): Config => {
  return {
    prefix: true,
    render: {
      local: true,
      network: true,
      localPermission: true,
      networkPermission: true,
    },
    permission: 'all',
    deviceScaleFactor: 3,
    waitUntil: 'networkidle2',
    markedKatex: {
      output: 'htmlAndMathml',
      throwOnError: false,
    },
  }
}

/**
 * @description 监听配置文件
 */
setTimeout(() => {
  watch<Config>(dir.ConfigDir + '/config.json', (_, now) => {
    configCache = { ...getDefConfig(), ...now }
  })
}, 2000)

/**
 * @description 配置文件
 */
export const config = (): Config => {
  if (configCache) return configCache

  const cfgPath = `${dir.ConfigDir}/config.json`
  const defData = getDefConfig()
  /** 如果配置文件不存在 则创建配置 */
  if (!fs.existsSync(cfgPath)) {
    fs.writeFileSync(cfgPath, JSON.stringify(defData, null, 2))
  }

  const cfg = requireFileSync(cfgPath)
  configCache = { ...defData, ...cfg }
  return configCache
}

export const writeConfig = (cfg: Config) => {
  const cfgPath = `${dir.ConfigDir}/config.json`
  fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2))
}
