---
title: 媒体
date: 2026-08-13 12:00:00
---

这里演示视频与音乐播放器的嵌入方式。

## 音乐播放器

单曲示例（使用公共示例音频，可替换为你自己的 mp3 链接）：

{% aplayer "示例歌曲" "SoundHelix" "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" %}

如果你有自己的 mp3 文件，把它放到 `source/music/` 目录，然后用下面的格式：

{% aplayer "歌曲标题" "歌手" "/music/你的文件.mp3" %}

## 视频播放器

在线视频示例：

{% video https://www.w3schools.com/html/mov_bbb.mp4 %}

本地视频：把 mp4 放到 `source/videos/` 目录，然后用下面的格式：

{% video /videos/你的文件.mp4 %}
