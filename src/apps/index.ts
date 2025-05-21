import fs from 'node:fs'
import path from 'node:path'
import axios from 'node-karin/axios'
import { format } from 'node:util'
import { config } from '@/utils'
import { karin, segment } from 'node-karin'
import { markdown } from '@karinjs/md-html'
import { karinPathHtml } from 'node-karin/root'
import { dir } from '@/dir'

const reg = /^(#)?(md|markdown)/

export const markdownPlugin = karin.command(reg, async (e) => {
  let msg = e.msg.replace(reg, '').trim()
  if (!msg) {
    await e.reply('\n请输入内容', { at: true })
    return
  }

  const cfg = config()
  /** 是否需要前缀# */
  if (cfg.prefix && !e.msg.startsWith('#')) {
    return
  }

  /** 如果输入的是文件路径 必须要在permission为 master、admin 下使用 */
  if (fs.existsSync(msg)) {
    if (!cfg.render.local) {
      return await e.reply('\n不允许渲染本地文件', { at: true })
    }

    if (cfg.render.localPermission && !(e.isMaster || e.isAdmin)) {
      await e.reply('\n权限不足，渲染本地文件需要管理员权限', { at: true })
      return
    }
  }

  if (msg.startsWith('http')) {
    if (!cfg.render.network) {
      return await e.reply('\n不允许渲染网络文件', { at: true })
    }

    if (cfg.render.networkPermission && !(e.isMaster || e.isAdmin)) {
      return await e.reply('\n权限不足，渲染网络文件需要管理员权限', { at: true })
    }

    try {
      const { data } = await axios.get(msg)
      msg = data
    } catch (error) {
      msg = `渲染错误：\n\`\`\`js\n${format(error)}\n\`\`\``
    }
  }

  if (cfg.permission !== 'all') {
    if (cfg.permission === 'master') {
      if (!e.isMaster) return
    } else if (cfg.permission === 'admin') {
      if (!e.isMaster && !e.isAdmin) return
    } else if (cfg.permission === 'group.owner' && e.isGroup) {
      if (!e.isMaster && !e.isAdmin && e.sender.role !== 'owner') return
    } else if (cfg.permission === 'group.admin' && e.isGroup) {
      if (!e.isMaster && !e.isAdmin && e.sender.role !== 'owner' && e.sender.role !== 'admin') return
    } else if (cfg.permission === 'guild.owner' && e.isGuild) {
      if (!e.isMaster && !e.isAdmin && e.sender.role !== 'owner') return
    } else if (cfg.permission === 'guild.admin' && e.isGuild) {
      if (!e.isMaster && !e.isAdmin && e.sender.role !== 'owner' && e.sender.role !== 'admin') return
    }
  }

  const html = markdown(msg, { katex: cfg.markedKatex })
  const tempDir = path.join(karinPathHtml, dir.pkg.name)
  const htmlFile = path.join(tempDir, `${Date.now()}.html`)
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }
  fs.writeFileSync(htmlFile, html)

  const img = await karin.render({
    file: htmlFile,
    pageGotoParams: {
      waitUntil: cfg.waitUntil || 'networkidle2',
    },
    setViewport: {
      width: 980,
      deviceScaleFactor: cfg.deviceScaleFactor || 3,
    },
  })

  await e.reply(segment.image(`base64://${img}`), { reply: true })
  fs.unlinkSync(htmlFile)
}, { name: 'markdown', permission: 'all', priority: 100 })
