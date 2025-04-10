<img src="https://cdn.jsdelivr.net/gh/codexu/note-gen@dev/app-icon.png" width="128" height="128" />

# NoteGen

![](https://github.com/codexu/note-gen/actions/workflows/release.yml/badge.svg?branch=release)
![](https://img.shields.io/github/v/release/codexu/note-gen)
![](https://img.shields.io/badge/version-alpha-orange)
![](https://img.shields.io/github/downloads/codexu/note-gen/total)
![](https://img.shields.io/github/commit-activity/m/codexu/note-gen)

[English](README.EN.md) | 简体中文

NoteGen 是一款专注于`记录`和`写作`的跨端 AI 笔记应用，基于 `Tauri` 开发。

| 记录 | 写作 | 深色模式 |
| ---- | ---- | ---- |
| ![](https://github.com/user-attachments/assets/6b95eb58-e460-4b85-8668-2d3a3b898f2d) | ![](https://github.com/user-attachments/assets/a5d7efdc-c47b-4170-946f-1ac6af5cfd81) | ![](https://github.com/user-attachments/assets/c8931fb1-a3f3-43cd-83ae-991f721cde7a) |

## 特性

> [!IMPORTANT]
> NoteGen 目前还处于开发阶段，还存在着许多的不足和缺陷。

NoteGen 的核心理念是将记录、写作和 AI 结合使用，三者相辅相成。记录功能可以帮助用户快速捕捉和整理碎片化知识。整理功能是连接记录和写作的桥梁，可将持续记录的内容整理成一篇可读的笔记，辅助用户完成从零到一的创作过程，如果 AI 整理的结果无法满足你的要求，那么你可以使用写作功能自行去完善。

### 记录

记录方式支持：

1. 🖥️ 截图记录，通过截图，用户可以快速捕捉和记录碎片化知识，尤其是在遇到无法进行文本复制的情况下。
2. 📄 文本记录，可以复制文本或者手动输入一些简短的内容作为一次记录。
3. 🖼️ 插图记录，可以在笔记生成时，自动插入到合适的位置。
4. 📇 文件记录，识别 PDF、md、html、txt 等文件内容，进行文字记录。
5. 🔗 链接记录（待实现），使用爬虫进行页面内容识别与记录。
6. 📷 拍照记录（待实现）功能类似于插图记录，调用相机记录，适合未来移动端。

辅助记录：

- 🏷️ 自定义标签，更好地归类和区分不同的记录场景。
- 🤖 AI 对话，默认关联当前标签下的记录，你也可以手动去关联写作内的任何文章。
- 🤪 面具，支持自定义 prompt，精准控制你的 AI 助手。
- 📋 剪贴板识别，在你进行图片或文本复制后，会自动识别剪贴板中的图片或文本。
- 💾 整理，当你已经完成了一系列的记录之后，可以尝试让 AI 帮你整理为一篇文章。

### 写作

- 🗂 文件管理器，支持本地和 Github 仓库的文件和文件夹的管理，支持无限层级目录。
- 📝 支持所见即所得、即时渲染、分屏预览三种模式。
- 📅 版本控制，如果你开启了同步功能，可以在历史记录中回溯历史上传过的记录。
- 🤖 AI 辅助，支持问答、续写、优化、精简、翻译等功能，且可以随时将记录插入到文章任何位置。
- 🏞️ 图床，直接复制图片粘贴在 Markdown 编辑器中，将自动将此图片上传至图床，并转换为 Markdown 图片链接。
- 🛠️ HTML、Markdown转换，复制浏览器的内容，将自动转换为 Markdown 格式。

### 辅助

- 📦 大模型支持，内置多种大模型配置，支持自定义，随意切换。
- 👁️ OCR，可以辅助识别图片内的文字。
- 🏗️ 整理模板，可自定义模板，方便 AI 对不同类型的内容进行定制化整理。
- 🔎 全局搜索，可以快速搜索并跳转至指定的内容。
- 🌃 图床管理，可以方便的管理图床仓库的内容。
- 💎 主题与外观，支持深色主题，支持 Markdown、代码等外观设置。

## 如何使用？

### 下载

目前支持 Mac、Windows、Linux，得益于 Tauri2 的跨平台能力，未来将支持 IOS、Android。

[下载 NoteGen (alpha)](https://github.com/codexu/note-gen/releases)

### 入门指南

如果你还不了解 NoteGen，你可以阅读使用文档，其中包含了快速上手指南：

[NoteGen 使用文档](https://codexu.github.io/note-gen-help/)

### AI 模型接入

目前已支持自定义模型配置，内置 ChatGPT、ChatAnyWhere、Ollama、LM Studio、豆包、通义千问、Kimi、DeepSeek，支持所有以 OpenAI 协议的模型，未来将逐步支持其他协议。

> 本地模型目前调用可能存在 403 报错，目前在等待 http-plugin 的解决办法，开发环境中不会出现此问题。

[话题讨论 - 关于模型接入](https://github.com/codexu/note-gen/discussions/26)

### 同步与图床

NoteGen 支持离线存储，所有笔记均以 Markdown 格式存储。为了保证笔记的安全性，你可以选择将其同步到 Github 私有仓库，配置同步后，同时支持了 Github 图床功能，未来还将支持其他图床的独立配置。

## 交流群

欢迎加入 NoteGen 交流群，这里你可以向我提出问题，分享使用心得，或者提出改进建议。也可以以学习 Tauri 为目的，和我一起交流。

扫码加入[交流群](https://github.com/codexu/note-gen/discussions/110)，如果二维码失效，可以加微信 xu461229187 进群。

## Contribute

NoteGen 使用以下技术栈实现：

- [Tauri 2](https://v2.tauri.app/)
- [Next.js 15](https://nextjs.org/)
- [shadcn-ui](https://ui.shadcn.com/)

参与贡献：

- [更新计划](https://github.com/codexu/note-gen/issues/46)
- [提交 Bug 或改进建议](https://github.com/codexu/note-gen/issues)
- [讨论](https://github.com/codexu/note-gen/discussions)
