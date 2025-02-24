<img src="https://cdn.jsdelivr.net/gh/codexu/note-gen@dev/app-icon.png" width="128" height="128" />

# NoteGen

![](https://github.com/codexu/note-gen/actions/workflows/release.yml/badge.svg?branch=release)
![](https://img.shields.io/github/v/release/codexu/note-gen)
![](https://img.shields.io/badge/version-alpha-orange)
![](https://img.shields.io/github/downloads/codexu/note-gen/total)
![](https://img.shields.io/github/commit-activity/m/codexu/note-gen)

NoteGen 是一款专注于`记录`和`写作`的跨端 AI 笔记应用，基于 `Tauri` 开发。

| 记录 | 写作 |
| ---- | ---- |
| ![](https://github.com/user-attachments/assets/4c605f4b-f675-467b-90e1-e039c1812d7b) | ![](https://github.com/user-attachments/assets/f0b2754a-e8cc-4661-a07f-0114a2a09d38) |

## 快速开始

> [!IMPORTANT]
> NoteGen 目前还处于开发阶段，还存在着许多的不足和缺陷。

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

## 特性

NoteGen 的核心理念是将记录、写作和 AI 结合使用，三者相辅相成。

它提供了强大的记录功能，帮助用户快速捕捉和整理碎片化知识。整理功能是连接记录和写作的桥梁，可将持续记录的内容整理成一篇可读的笔记，辅助用户完成从零到一的创作过程。

写作工具内置 Markdown 编辑器，支持列表大纲、数学公式、图表、流程图、甘特图、时序图、五线谱等功能。

AI 在记录中扮演了机器人的角色，你可以与它进行对话，问它与你记录有关的任何问题，也可以将它输出的内容作为记录保存下来。在写作中，AI 将扮演写作助手的角色，可以直接将输出的内容插入到编辑器中。

### 记录

记录方式支持：

1. **截图记录**是 NoteGen 的核心功能。通过截图，用户可以快速捕捉和记录碎片化知识，尤其是在遇到无法进行文本复制的情况下。其原理是通过 OCR 识别图片中的文字，再使用 ChatGPT 进行总结。
2. **文本记录**，可以确保内容的准确性，但是需要将文本复制至软件中，稍微增加了操作的复杂度。
3. **插图记录**，可以在笔记生成时，自动插入到合适的位置，你也可以复制图片，在打开 APP 时会自动识别辅助导入，如果配置了同步功能，将使用图床链接。
4. **文件记录**，识别 PDF、md、html、txt 等文件内容，进行文字记录。
5. 链接记录（待实现），使用爬虫进行页面内容识别与记录。
6. 拍照记录（待实现）功能类似于插图记录，调用相机记录，适合未来移动端。

辅助记录：

- 自定义标签，更好地归类和区分不同的记录场景。
- AI 对话，默认关联当前标签下的记录，你也可以手动去关联写作内的任何文章。
- 剪贴板识别，在你进行图片或文本复制后，会自动识别剪贴板中的图片或文本。

### 整理

整理功能作为记录与写作中间的桥梁。

当你在不断的记录中，积攒了足够的内容，你可以使用整理功能，自动将所有记录整理成一篇可读的笔记，有效节省了手动整理所需的时间。

此功能具备以下几个特点：

- 支持输入个性化的需求。
- 无需关心记录顺序，由 ChatGPT 辅助你整理。
- 支持多种语言。

当你整理出一篇满意的笔记后，你可以将其转换为文章进行写作，它将笔记转换为 `.md` 文件存储于本地，并跳转至写作页面进行后续的完善工作。

### 写作

- 文件管理器，支持本地和 Github 仓库的文件和文件夹的管理，支持无限层级目录。
- 版本控制，如果你开启了同步功能，可以在历史记录中回溯历史上传过的记录。
- AI 辅助，支持问答、续写、优化、精简、翻译等功能，且可以随时将记录插入到文章任何位置。
- 图床，直接复制图片粘贴在 Markdown 编辑器中，将自动将此图片上传至图床，并转换为 Markdown 图片链接。
- HTML、Markdown转换，复制浏览器的内容，将自动转换为 Markdown 格式。

## 贡献

目前使用以下技术栈：

- [Tauri 2](https://v2.tauri.app/)
- [Next.js 15](https://nextjs.org/)
- [shadcn-ui](https://ui.shadcn.com/)

rustc >= 1.82.0

欢迎提交 PR 或 issue。

### Contributors

欢迎加入 NoteGen，让我们一起将它变得更好。

<a href="https://github.com/codexu/note-gen/graphs/contributors">
   <img src="https://contrib.rocks/image?repo=codexu/note-gen" />
</a>

### Star History

[![Star History Chart](https://api.star-history.com/svg?repos=codexu/note-gen&type=Date)](https://star-history.com/#codexu/note-gen&Date)
