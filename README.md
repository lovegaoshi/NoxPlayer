<!--
 * @Author: Ken Wang
 * @Date: 2022-01-26 17:29:40
 * @LastEditTime: 2022-02-02 16:40:05
 * @LastEditors: your name
 * @Description: 
-->
<br>

<p align="center"><a href="https://github.com/kenmingwang/azusa-player"><img width="200" src="https://github.com/kenmingwang/azusa-player/blob/master/public/img/logo2-01.png?raw=true"></a></p>

<p align="center">
  <a href="https://github.com/kenmingwang/azusa-player/blob/master/LICENSE">
    <img src="https://camo.githubusercontent.com/992daabc2aa4463339825f8333233ba330dd08c57068f6faf4bb598ab5a3df2e/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4d49542d627269676874677265656e2e737667" alt="Software License" data-canonical-src="https://img.shields.io/badge/license-MIT-brightgreen.svg" style="max-width: 100%;">
  </a>
  <a href="">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/stars/kenmingwang/azusa-player">
  </a>
  <a href="https://github.com/kenmingwang/azusa-player/releases">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/kenmingwang/azusa-player">
  </a>
  <a href="https://github.com/kenmingwang/azusa-player/actions/workflows/webpack.yml">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/kenmingwang/azusa-player/webpack.yml">
  </a>
  </br>
  <a href="https://chrome.google.com/webstore/detail/%E7%94%B5%E6%A2%93%E6%92%AD%E6%94%BE%E5%99%A8-%E7%AC%AC%E4%B8%89%E6%96%B9bilibili%E9%9F%B3%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8/bdplgemfnbaefommicdebhboajognnhj">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/chrome-web-store/users/bdplgemfnbaefommicdebhboajognnhj?color=blue&label=chrome-user">
  </a>
  <a href="https://microsoftedge.microsoft.com/addons/detail/%E7%94%B5%E6%A2%93%E6%92%AD%E6%94%BE%E5%99%A8%E7%AC%AC%E4%B8%89%E6%96%B9bilibili%E9%9F%B3%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8/bikfgaolchpolficinadmbmkkohkbkdf">
    <img alt="GitHub all releases" src="https://img.shields.io/badge/dynamic/json?label=edge-user&query=%24.activeInstallCount&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fbikfgaolchpolficinadmbmkkohkbkdf">
  </a>
  <a href="https://github.com/kenmingwang/azusa-player/releases">
    <img alt="GitHub all releases" src="https://img.shields.io/github/downloads/kenmingwang/azusa-player/total">
  </a>
</p>
<h3 align="center" style="color:purple"> 诺莺nox威力加强版 Azusa-Player / 电梓播放器</h3>
<h4 align="center" style="color:purple">A 3rd party Bilibili audio player / 一个Bilibili第三方音频播放器</h4>

## Nox威力加强版
Virtuareal link所属虚拟艺人[诺莺Nox](https://space.bilibili.com/529249/channel/seriesdetail?sid=61060)，歌势。从Nox的社交媒体偷来了图换了皮肤。

Nox版会做简易的移动端适配、视频列表订阅、以及对我QoL的功能，其他功能需求请[私信电梓播放器的作者](https://message.bilibili.com/#/whisper/mid1989881)

nox used a modified version of react-jinke-music-player (specified memo on audiolist; added shuffle play track). see my fork.

### [Nox版的功能](https://github.com/lovegaoshi/azusa-player/wiki/nox%E5%A8%81%E5%8A%9B%E5%8A%A0%E5%BC%BA%E7%89%88%E6%96%B0%E5%8A%9F%E8%83%BD#%E7%AE%80%E6%98%93%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%80%82%E9%85%8D)
- BVid/fid搜索栏支持b站合集和视频列表URL搜索
- 皮肤切换
- 根据up主自定义的歌名提取
- 歌单自动更新
- 简易移动端适配

## 项目简介

- 是真正意义上的《电梓播放器》(?): Azusa-Player！
  - 私货默认歌单 [【阿梓】2021 精选翻唱 50 首【纯享】](https://www.bilibili.com/video/BV1wr4y1v7TA)
- 本质上是个 b 站第三方**音频在线播放器**，以浏览器扩展插件形式展现
- 目的是想让视频**轻量化**为音频，方便溜歌/歌单分类/下载等
- 支持单 P/多 P 视频搜索(视情况适配新的合集功能)
  - <del> QA 阶段才发现 b 站把分 P 砍了; ; </del>
- 实现了歌名提取与歌词搜索
  - 歌名提取不准确的话需要手动输歌名
- **切片 man 不易，没有各位切片 man 也不会有这个项目的意义，请大家溜歌同时多点进视频给他们个赞 👍**
- 自用为主要目的，不感兴趣的 feature 大概不会做，有问题可以[b 站私信](https://message.bilibili.com/#/whisper/mid1989881)
  - 但是欢迎提 PR! <del>(虽然代码很烂)</del>

### 截图：

![imgur](https://github.com/kenmingwang/azusa-player/blob/master/public/img/azusa-player2.gif?raw=true)

## 安装

- [Chrome Store](https://chrome.google.com/webstore/detail/%E7%94%B5%E6%A2%93%E6%92%AD%E6%94%BE%E5%99%A8-%E7%AC%AC%E4%B8%89%E6%96%B9bilibili%E9%9F%B3%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8/bdplgemfnbaefommicdebhboajognnhj)
- [Microsoft Store](https://microsoftedge.microsoft.com/addons/detail/%E7%94%B5%E6%A2%93%E6%92%AD%E6%94%BE%E5%99%A8%E7%AC%AC%E4%B8%89%E6%96%B9bilibili%E9%9F%B3%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8/bikfgaolchpolficinadmbmkkohkbkdf)
- 离线安装
  - [下载最新 build 文件](https://github.com/kenmingwang/azusa-player/releases)，解压，Chrome 开启开发者模式，加载解压后的文件夹。

![imgurl](https://github.com/kenmingwang/azusa-player/blob/master/public/img/azusa-player-tutorial.png?raw=true)

## 项目技术栈

- [Chrome Extension](https://developer.chrome.com/docs/extensions/) + [React](https://github.com/facebook/react) + [MUI](https://mui.com/zh/)
- [react-music-player](https://github.com/lijinke666/react-music-player)
- [react-lrc](https://github.com/mebtte/react-lrc)
- [react-chrome-extension-MV3](https://github.com/Sirage-t/react-chrome-extension-MV3)
- 参考了[Listen1](https://github.com/listen1/listen1_chrome_extension)播放器的交互形式

## 项目协议

本项目基于 [MIT License](https://github.com/kenmingwang/azusa-player/blob/master/LICENSE) 许可证发行，以下协议是对于 MIT License 的补充，如有冲突，以以下协议为准。

词语约定：本协议中的“本项目”指 Azusa-Player 项目；“使用者”指签署本协议的使用者；“官方音乐平台”指对本项目内置的包括 QQ 音乐，哔哩哔哩动画等音源，歌词来源的官方平台统称；“版权数据”指包括但不限于图像、音频、名字等在内的他人拥有所属版权的数据。

1. 本项目的数据来源原理是从各官方音乐平台的公开服务器中拉取数据，经过对数据简单地筛选与合并后进行展示，因此本项目不对数据的准确性负责。
2. 使用本项目的过程中可能会产生版权数据，对于这些版权数据，本项目不拥有它们的所有权，为了避免造成侵权，使用者务必在**24 小时**内清除使用本项目的过程中所产生的版权数据。
3. 本项目内的官方音乐平台别名为本项目内对官方音乐平台的一个称呼，不包含恶意，如果官方音乐平台觉得不妥，可联系本项目更改或移除。
4. 本项目内使用的部分包括但不限于字体、图片等资源来源于互联网，如果出现侵权可联系本项目移除。
5. 由于使用本项目产生的包括由于本协议或由于使用或无法使用本项目而引起的任何性质的任何直接、间接、特殊、偶然或结果性损害（包括但不限于因商誉损失、停工、计算机故障或故障引起的损害赔偿，或任何及所有其他商业损害或损失）由使用者负责。
6. 本项目完全免费，且开源发布于 GitHub 面向全世界人用作对技术的学习交流，本项目不对项目内的技术可能存在违反当地法律法规的行为作保证，**禁止在违反当地法律法规的情况下使用本项目**，对于使用者在明知或不知当地法律法规不允许的情况下使用本项目所造成的任何违法违规行为由使用者承担，本项目不承担由此造成的任何直接、间接、特殊、偶然或结果性责任。

若你使用了本项目，将代表你接受以上协议。

音乐视频平台不易，请尊重版权，支持正版。<br>
Contact: kenmingwang1234@gmail.com <br>
Bilibili: [\_Nek7mi](https://space.bilibili.com/1989881)

New-Item -ItemType SymbolicLink -Path "D:\PythonLib\github\azusa-player\Dependencies\react-jinke-music-player" -Target D:\PythonLib\github\react-music-player