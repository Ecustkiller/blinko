<img src="https://cdn.jsdelivr.net/gh/codexu/note-gen@dev/app-icon.png" width="128" height="128" />

# NoteGen

![](https://github.com/codexu/note-gen/actions/workflows/release.yml/badge.svg?branch=release)
![](https://img.shields.io/github/v/release/codexu/note-gen)
![](https://img.shields.io/badge/version-alpha-orange)
![](https://img.shields.io/github/downloads/codexu/note-gen/total)
![](https://img.shields.io/github/commit-activity/m/codexu/note-gen)

English | [简体中文](README.ZH.md)

NoteGen is a cross-platform AI note-taking application focused on `recording` and `writing`, developed based on `Tauri`.

| Recording | Writing |
| ---- | ---- |
| ![](https://github.com/user-attachments/assets/4c605f4b-f675-467b-90e1-e039c1812d7b) | ![](https://github.com/user-attachments/assets/f0b2754a-e8cc-4661-a07f-0114a2a09d38) |

## Features

> [!IMPORTANT]
> NoteGen is still in the development stage and has many limitations and defects.

The core philosophy of NoteGen is to combine recording, writing, and AI, with all three complementing each other. The recording function helps users quickly capture and organize fragmented knowledge. The organization function is the bridge connecting recording and writing, which can organize continuously recorded content into a readable note, assisting users in completing the creation process from scratch. If the AI-organized results cannot meet your requirements, you can use the writing function to refine it yourself.

### Recording

Recording methods supported:

1. 🖥️ Screenshot recording, through which users can quickly capture and record fragmented knowledge, especially in situations where text copying is not possible.
2. 📄 Text recording, which allows copying text or manually inputting brief content as a record.
3. 🖼️ Illustration recording, which can be automatically inserted into appropriate positions when generating notes.
4. 📇 File recording, which recognizes content from PDF, md, html, txt, and other files for text recording.
5. 🔗 Link recording (to be implemented), using web crawlers for page content recognition and recording.
6. 📷 Photo recording (to be implemented), similar to illustration recording, calling the camera to record, suitable for future mobile use.

Auxiliary recording:

- 🏷️ Custom tags for better categorization and differentiation of different recording scenarios.
- 🤖 AI conversation, by default associated with records under the current tag, and you can also manually associate it with any article in your writing.
- 📋 Clipboard recognition, which automatically recognizes images or text in the clipboard after you copy them.
- 💾 Organization, when you have completed a series of records, you can try to let AI help you organize them into an article.

### Writing

- 🗂 File manager, supporting management of files and folders in local and Github repositories, with unlimited directory levels.
- 📝 Support for WYSIWYG, instant rendering, and split-screen preview modes.
- 📅 Version control, if you enable synchronization, you can trace back to historically uploaded records in the history.
- 🤖 AI assistance, supporting Q&A, continuation, optimization, simplification, translation, and other functions, and you can insert records into any position of the article at any time.
- 🏞️ Image hosting, directly copy and paste images into the Markdown editor, which will automatically upload the image to the image hosting service and convert it to a Markdown image link.
- 🛠️ HTML and Markdown conversion, copying content from browsers will automatically convert it to Markdown format.

### Auxiliary

- 📦 Large model support, with multiple built-in large model configurations, supporting customization and easy switching.
- 👁️ OCR, which can assist in recognizing text in images.
- 🏗️ Organization templates, which can be customized for AI to organize different types of content.
- 🔎 Global search, for quickly searching and jumping to specified content.
- 🌃 Image hosting management, for convenient management of image hosting repository content.
- 💎 Themes and appearance, supporting dark theme, and appearance settings for Markdown, code, etc.

## How to Use?

### Download

Currently supports Mac, Windows, Linux, and thanks to Tauri2's cross-platform capabilities, it will support iOS and Android in the future.

[Download NoteGen (alpha)](https://github.com/codexu/note-gen/releases)

### Getting Started Guide

If you are not familiar with NoteGen, you can read the user documentation, which includes a quick start guide:

[NoteGen User Documentation](https://codexu.github.io/note-gen-help/)

### AI Model Integration

Currently supports custom model configuration, with built-in support for ChatGPT, ChatAnyWhere, Ollama, LM Studio, Doubao, Tongyi Qianwen, Kimi, DeepSeek, and all models using the OpenAI protocol. Support for other protocols will be gradually added in the future.

> Local models may currently experience 403 errors, waiting for a solution from http-plugin. This issue does not occur in the development environment.

[Discussion Topic - About Model Integration](https://github.com/codexu/note-gen/discussions/26)

### Synchronization and Image Hosting

NoteGen supports offline storage, with all notes stored in Markdown format. To ensure the security of your notes, you can choose to synchronize them to a private Github repository. After configuring synchronization, Github image hosting functionality is also supported. Independent configuration for other image hosting services will be supported in the future.

## Contribute

NoteGen is implemented using the following technology stack:

- [Tauri 2](https://v2.tauri.app/)
- [Next.js 15](https://nextjs.org/)
- [shadcn-ui](https://ui.shadcn.com/)

Participate in contributions:

- [Update Plan](https://github.com/codexu/note-gen/issues/46)
- [Submit Bug or Improvement Suggestions](https://github.com/codexu/note-gen/issues)
- [Discussions](https://github.com/codexu/note-gen/discussions)

If you are learning Tauri, you can follow my series [《Tauri Open Source Diary》](https://juejin.cn/column/7451402575066546211).
