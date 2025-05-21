# @karinjs/plugin-markdown

Karin 的 Markdown 渲染插件，支持将 Markdown 文本渲染为图片并发送。

## 安装

### 方式一：插件市场安装（推荐）

通过 Karin 的插件市场直接安装本插件。

### 方式二：手动安装

```bash
pnpm add @karinjs/plugin-markdown -w
```

## 配置

请在 WebUI 中查看并配置插件参数。

## 使用方法

发送以下格式的消息即可触发插件：

```
#md 你的Markdown内容
```

或

```
#markdown 你的Markdown内容
```

也可以直接使用：

```
md 你的Markdown内容
```

```
markdown 你的Markdown内容
```

### 示例

```
#md # 标题
这是一段**粗体**文字，这是*斜体*文字。

- 列表项1
- 列表项2

> 这是一段引用
```

渲染网络文件：
```
#md https://raw.githubusercontent.com/markedjs/marked/master/README.md
```

渲染本地文件：
```
#md ./README.md
```

## 特性

- 支持标准 Markdown 语法
- 支持 KaTeX 数学公式渲染
- 可配置渲染参数
- 支持权限控制
- 支持渲染网络文件
- 支持渲染本地文件

## 权限设置

插件支持多种权限控制模式，可在配置中设置。
