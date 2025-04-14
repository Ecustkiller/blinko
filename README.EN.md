<img src="https://cdn.jsdelivr.net/gh/codexu/note-gen@dev/app-icon.png" width="128" height="128" />

# NoteGen

![](https://github.com/codexu/note-gen/actions/workflows/release.yml/badge.svg?branch=release)
![](https://img.shields.io/github/v/release/codexu/note-gen)
![](https://img.shields.io/badge/version-alpha-orange)
![](https://img.shields.io/github/downloads/codexu/note-gen/total)
![](https://img.shields.io/github/commit-activity/m/codexu/note-gen)

English | [简体中文](README.md)

NoteGen is a cross-platform AI note-taking application focused on `recording` and `writing`, developed based on `Tauri`.

The core philosophy is to combine recording, writing, and AI, with all three complementing each other. The recording function helps users quickly capture and organize fragmented knowledge. The organization function is the bridge connecting recording and writing, which can organize continuously recorded content into a readable note, assisting users in completing the creation process from scratch. If the AI-organized results cannot meet your requirements, you can use the writing function to refine it yourself.

## Screenshots

Writing:

![432097489-6b95eb58-e460-4b85-8668-2d3a3b898f2d.png](https://s2.loli.net/2025/04/14/NxhiWjMZT7RtusS.png)

Recording:

![432097246-a5d7efdc-c47b-4170-946f-1ac6af5cfd81.png](https://s2.loli.net/2025/04/14/R4YzblokDp7xKat.png)

Dark Mode:

![432098306-c8931fb1-a3f3-43cd-83ae-991f721cde7a.png](https://s2.loli.net/2025/04/14/9JhgTie2X4tZLdz.png)

## Recording

Supported recording methods:

1. 🖥️ Screenshot recording: Users can quickly capture and record fragmented knowledge through screenshots, especially in situations where text cannot be copied.
2. 📄 Text recording: You can copy text or manually input brief content as a record.
3. 🖼️ Illustration recording: Can be automatically inserted into appropriate positions when generating notes.
4. 📇 File recording: Recognize content from PDF, MD, HTML, TXT, and other file types for text recording.
5. 🔗 Link recording (coming soon): Use web crawlers to identify and record page content.
6. 📷 Photo recording (coming soon): Similar to illustration recording, it uses the camera to record, suitable for future mobile use.

Assistive recording features:

- 🏷️ Custom tags: Better categorize and distinguish different recording scenarios.
- 🤖 AI conversation: By default, it associates with records under the current tag, but you can also manually associate with any article in your writing section.
- 🤪 Personas: Support custom prompts to precisely control your AI assistant.
- 📋 Clipboard recognition: Automatically recognizes images or text in your clipboard after copying.
- 💾 Organization: When you've completed a series of records, you can have AI organize them into an article.

## Writing

- 🗂 File manager: Supports file and folder management for both local and GitHub repositories, with unlimited directory hierarchy.
- 📝 Supports WYSIWYG, instant rendering, and split-screen preview modes.
- 📅 Version control: If you enable the sync feature, you can trace back to previously uploaded records in the history.
- 🤖 AI assistance: Supports Q&A, continuation, optimization, simplification, translation, and other functions, and you can insert records into any position in your article at any time.
- 🏞️ Image hosting: Directly copy and paste images into the Markdown editor, which will automatically upload the image to the image host and convert it to a Markdown image link.
- 🛠️ HTML to Markdown conversion: Browser content copied will be automatically converted to Markdown format.

## Auxiliary Functions

- 📦 Large model support: Built-in configurations for various large models, with customization support and easy switching.
- 👁️ OCR: Helps recognize text within images.
- 🏗️ Organization templates: Customizable templates for AI to perform tailored organization of different content types.
- 🔎 Global search: Quickly search and jump to specific content.
- 🌃 Image hosting management: Easily manage content in your image hosting repository.
- 💎 Themes and appearance: Supports dark theme and appearance settings for Markdown, code, etc.

## How to Use?

### Download

Currently supports Mac, Windows, and Linux. Thanks to Tauri2's cross-platform capabilities, it will support iOS and Android in the future.

[Download NoteGen (alpha)](https://github.com/codexu/note-gen/releases)

### AI Model Integration

NoteGen does not provide any services itself and requires manual configuration. It supports ChatGPT, Ollama, LM Studio, DeepSeek, and other large models by default, and also supports custom configuration of other providers' large models.

### Sync and Image Hosting

NoteGen supports offline storage, with all notes stored in Markdown format. To ensure the security of your notes, you can choose to sync them to a private GitHub repository. After configuring synchronization, it also supports GitHub image hosting functionality. In the future, it will support independent configuration of other image hosting services.

## Community

Welcome to join the NoteGen community group, where you can ask questions, share usage experiences, or suggest improvements. You can also join to learn about Tauri and discuss it with me.

Scan the QR code to join the [discussion group](https://github.com/codexu/note-gen/discussions/110). If the QR code expires, you can add WeChat xu461229187 to join the group.

## Contribute

NoteGen is implemented using the following technology stack:

- [Tauri 2](https://v2.tauri.app/)
- [Next.js 15](https://nextjs.org/)
- [shadcn-ui](https://ui.shadcn.com/)

How to contribute:

- [Update plans](https://github.com/codexu/note-gen/issues/46)
- [Submit bugs or improvement suggestions](https://github.com/codexu/note-gen/issues)
- [Discussions](https://github.com/codexu/note-gen/discussions)
