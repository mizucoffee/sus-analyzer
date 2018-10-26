# sus-analyzer
[![Build Status](https://travis-ci.org/KawakawaRitsuki/sus-analyzer.svg?branch=master)](https://travis-ci.org/KawakawaRitsuki/sus-analyzer)   
SeaUrchinScore Analyzer for node

## How to use

```
const SusAnalyzer = require('sus-analyzer'),
  fs = require('fs')

const sus = fs.readFileSync('example.sus','utf8')
const sus_validate = SusAnalyzer.validate(sus)
const sus_meta = SusAnalyzer.getMeta(sus)

console.log(sus_validate)
console.log(sus_meta)
```

## License
[The MIT License](http://kawakawaritsuki.mit-license.org) (c) [@kawakawaritsuki](https://github.com/kawakawaritsuki)
