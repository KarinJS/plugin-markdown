import { dir } from './dir'
import lodash from 'node-karin/lodash'
import { components, defineConfig } from 'node-karin'
import { Config, config, writeConfig } from '@/utils/config'

export default defineConfig({
  info: {
    id: dir.pkg.name,
    name: 'markdown渲染',
    version: dir.pkg.version,
    description: dir.pkg.description,
    author: [
      {
        name: dir.pkg.author,
        avatar: 'https://github.com/sj817.png'
      }
    ]
  },
  /** 动态渲染的组件 */
  components: () => {
    const cfg = config()
    const list = [
      components.divider.horizontal('divider-markdown', {
        description: 'Markdown 配置',
        // transparent: 发蓝色
      }),
      components.input.create('deviceScaleFactor', {
        color: 'success',
        label: '像素比',
        description: '像素比 越高越清晰 但是会减缓渲染速度',
        defaultValue: cfg.deviceScaleFactor + ''
      }),
      components.divider.horizontal('divider-1', {
        transparent: false
      }),
      components.switch.create('prefix', {
        color: 'success',
        label: '前缀设置',
        description: '是否需要前缀触发插件',
        defaultSelected: cfg.prefix
      }),
      components.divider.horizontal('divider-1', {
        description: '',
        transparent: false
      }),
      components.switch.create('render:local', {
        color: 'success',
        label: '本地渲染',
        description: '是否允许渲染本地文件',
        defaultSelected: cfg.render.local
      }),
      components.switch.create('render:network', {
        color: 'success',
        label: '网络渲染',
        description: '是否允许渲染网络文件',
        defaultSelected: cfg.render.network
      }),
      components.switch.create('render:localPermission', {
        color: 'success',
        label: '本地文件权限',
        description: '是否需要管理员权限渲染本地文件',
        defaultSelected: cfg.render.localPermission
      }),
      components.switch.create('render:networkPermission', {
        color: 'success',
        label: '网络文件权限',
        description: '是否需要管理员权限渲染网络文件',
        defaultSelected: cfg.render.networkPermission
      }),
      components.divider.horizontal('divider-permission', {
        description: '权限设置',
        transparent: false
      }),
      components.radio.group('permission', {
        color: 'success',
        label: '权限设置',
        description: '设置后只有拥有对应权限的群员才能触发插件',
        defaultValue: cfg.permission,
        radio: [
          components.radio.create('all', {
            label: '全部',
            value: 'all'
          }),
          components.radio.create('master', {
            label: '主人',
            value: 'master'
          }),
          components.radio.create('admin', {
            label: '管理员',
            value: 'admin'
          }),
          components.radio.create('group.owner', {
            label: '群主',
            value: 'group.owner'
          }),
          components.radio.create('group.admin', {
            label: '群管理员',
            value: 'group.admin'
          }),
          components.radio.create('guild.owner', {
            label: '频道主',
            value: 'guild.owner'
          }),
          components.radio.create('guild.admin', {
            label: '频道超管',
            value: 'guild.admin'
          }),
        ]
      }),
      components.divider.horizontal('divider-katex', {
        description: 'KaTeX 配置',
        transparent: false
      }),
      components.radio.group('markedKatex:output', {
        color: 'success',
        label: '输出格式',
        defaultValue: cfg.markedKatex.output,
        radio: [
          components.radio.create('html', {
            label: 'html',
            value: 'html'
          }),
          components.radio.create('mathml', {
            label: 'mathml',
            value: 'mathml'
          }),
          components.radio.create('htmlAndMathml', {
            label: 'htmlAndMathml',
            value: 'htmlAndMathml'
          }),
        ]
      }),
      components.switch.create('markedKatex:throwOnError', {
        color: 'success',
        label: '错误抛出',
        description: '是否在错误时抛出异常',
        defaultSelected: cfg.markedKatex.throwOnError
      })
    ]

    return list
  },

  /** 前端点击保存之后调用的方法 */
  save: (data: any) => {
    const newData: Config = {
      prefix: data.prefix || false,
      deviceScaleFactor: Number(data.deviceScaleFactor) || 3,
      render: {
        local: data['render:local'] ?? false,
        network: data['render:network'] ?? false,
        localPermission: data['render:localPermission'] ?? false,
        networkPermission: data['render:networkPermission'] ?? false,
      },
      permission: data.permission || 'all',
      waitUntil: data.waitUntil || 'networkidle2',
      markedKatex: {
        output: data['markedKatex:output'] || 'html',
        throwOnError: data['markedKatex:throwOnError'] ?? false,
      },
    }

    /** 对比是否需要更新 */
    const oldConfig = config()
    if (lodash.isEqual(oldConfig, newData)) {
      return {
        success: false,
        message: '配置未更新，无需保存'
      }
    }

    writeConfig(newData)
    return {
      success: true,
      message: '保存成功'
    }
  }
})
