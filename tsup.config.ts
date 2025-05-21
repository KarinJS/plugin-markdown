import { defineConfig } from 'tsup'
import type { Options } from 'tsup'

/**
 * @description `tsup` configuration options
 */
export const options: Options = {
  entry: ['src/*.ts', 'src/apps/*.ts', '!src/app.ts'], // 入口文件
  format: ['esm'], // 输出格式
  target: 'node18', // 目标环境
  splitting: true, // 是否拆分文件 启用哦 不然会强制打包的~
  sourcemap: false, // 是否生成 sourcemap
  clean: true, // 是否清理输出目录
  dts: true,
  external: [
    'node-karin',
    '@karinjs/md-html'
  ],
  shims: true,
}

export default defineConfig(options)
