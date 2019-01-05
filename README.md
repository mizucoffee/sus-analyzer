![sus-analyzer-Logo](https://raw.githubusercontent.com/mizucoffee/sus-analyzer/master/sus-analyzer.png)

[![Build Status](https://travis-ci.org/mizucoffee/sus-analyzer.svg?branch=master)](https://travis-ci.org/mizucoffee/sus-analyzer)
[![Coverage Status](https://coveralls.io/repos/github/mizucoffee/sus-analyzer/badge.svg?branch=develop)](https://coveralls.io/github/mizucoffee/sus-analyzer?branch=develop)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Maintainability](https://api.codeclimate.com/v1/badges/fc596d01b6038852e18d/maintainability)](https://codeclimate.com/github/mizucoffee/sus-analyzer/maintainability)
[![Inline docs](http://inch-ci.org/github/mizucoffee/sus-analyzer.svg?branch=master)](http://inch-ci.org/github/mizucoffee/sus-analyzer)
[![Documents](https://img.shields.io/badge/docs-sus_analyzer-orange.svg)](https://mizucoffee.github.io/sus-analyzer/)
[![npm](https://img.shields.io/npm/v/sus-analyzer.svg)](https://www.npmjs.com/package/sus-analyzer)
[![npm downloads](https://img.shields.io/npm/dt/sus-analyzer.svg)](https://npmcharts.com/compare/sus-analyzer?minimal=true)
![sus:v2.17.0](https://img.shields.io/badge/sus-v2.17.0-blue.svg)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://kawakawaritsuki.mit-license.org/)

SeaUrchinScore Analyzer for node

## Installation

```
$ yarn add sus-analyzer
```

or

```
$ npm i sus-analyzer
```

## Usage

### JavaScript

```js
const SusAnalyzer = require('sus-analyzer')
const fs = require('fs')

const sus = fs.readFileSync('example.sus', 'utf8')
const sus_validate = SusAnalyzer.validate(sus)
const sus_meta = SusAnalyzer.getMeta(sus)
const sus_data = SusAnalyzer.getScore(sus)

console.log(sus_validate)
console.log(sus_meta)
console.log(sus_data)
```

### TypeScript

```ts
import * as fs from 'fs'
import * as SusAnalyzer from './dist/index.js'

const sus = fs.readFileSync('example.sus', 'utf8')
const susValidate = SusAnalyzer.validate(sus)
const susMeta = SusAnalyzer.getMeta(sus)
const susData = SusAnalyzer.getScore(sus)

console.log(susValidate)
console.log(susMeta)
console.log(susData)
```

## サンプルデータについて

サンプルデータを付属しています。  
譜面データはありませんが、メタ情報を一式揃えてあるのでテスト用にどうぞ。

> {DIFFICULTY}\_{PREFIX}.sus

というファイル名で構成されています。  
PREFIX が同じ sus ファイルは同楽曲/同デザイナーになるようにしています。

## License

[The MIT License](http://kawakawaritsuki.mit-license.org) (c) [@kawakawaritsuki](https://github.com/kawakawaritsuki)
