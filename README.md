![sus-analyzer-Logo](https://raw.githubusercontent.com/mizucoffee/sus-analyzer/master/sus-analyzer.png)

<h2 align="center">SeaUrchinScore Analyzer for node</h2>

<p align="center"><a href="https://travis-ci.org/mizucoffee/sus-analyzer"><img src="https://travis-ci.org/mizucoffee/sus-analyzer.svg?branch=master" alt="Build Status" /></a>
<a href="https://coveralls.io/github/mizucoffee/sus-analyzer?branch=develop"><img src="https://coveralls.io/repos/github/mizucoffee/sus-analyzer/badge.svg?branch=develop" alt="Coverage Status" /></a>
<a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="code style: prettier" /></a>
<a href="https://codeclimate.com/github/mizucoffee/sus-analyzer/maintainability"><img src="https://api.codeclimate.com/v1/badges/fc596d01b6038852e18d/maintainability" alt="Maintainability" /></a>
<br>
<a href="https://mizucoffee.github.io/sus-analyzer/"><img src="https://img.shields.io/badge/docs-sus_analyzer-orange.svg" alt="Documents" /></a>
<a href="https://www.npmjs.com/package/sus-analyzer"><img src="https://img.shields.io/npm/v/sus-analyzer.svg" alt="npm" /></a>
<a href="https://npmcharts.com/compare/sus-analyzer?minimal=true"><img src="https://img.shields.io/npm/dt/sus-analyzer.svg" alt="npm downloads" /></a>
<img src="https://img.shields.io/badge/sus-v2.17.0-blue.svg" alt="sus:v2.17.0" />
<a href="https://kawakawaritsuki.mit-license.org/"><img src="http://img.shields.io/badge/license-MIT-blue.svg?style=flat" alt="MIT License" /></a></p>

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

[The MIT License](http://kawakawaritsuki.mit-license.org) (c) [@mizucoffee](https://github.com/mizucoffee)
