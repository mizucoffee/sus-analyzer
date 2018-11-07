# sus-analyzer
[![Build Status](https://travis-ci.org/KawakawaRitsuki/sus-analyzer.svg?branch=master)](https://travis-ci.org/KawakawaRitsuki/sus-analyzer)
[![npm](https://img.shields.io/npm/v/sus-analyzer.svg)](https://www.npmjs.com/package/sus-analyzer)
![sus:v2.17.0](https://img.shields.io/badge/sus-v2.17.0-blue.svg)

SeaUrchinScore Analyzer for node

## Installation

```
$ yarn add sus-analyzer
```

or

```
$ npm i sus-analyzer
```

## How to use

```
const SusAnalyzer = require('sus-analyzer'),
  fs = require('fs')

const sus = fs.readFileSync('example.sus','utf8')
const sus_validate = SusAnalyzer.validate(sus)
const sus_meta = SusAnalyzer.getMeta(sus)
const sus_data = SusAnalyzer.getData(sus)

console.log(sus_validate)
console.log(sus_meta)
console.log(sus_data)
```

## サンプルデータについて
サンプルデータを付属しています。   
譜面データはありませんが、メタ情報を一式揃えてあるのでテスト用にどうぞ。   

> {DIFFICULTY}\_{PREFIX}.sus

というファイル名で構成されています。   
PREFIXが同じsusファイルは同楽曲/同デザイナーになるようにしています。

## License
[The MIT License](http://kawakawaritsuki.mit-license.org) (c) [@kawakawaritsuki](https://github.com/kawakawaritsuki)
