# sus-analyzer
[![Build Status](https://travis-ci.org/KawakawaRitsuki/sus-analyzer.svg?branch=master)](https://travis-ci.org/KawakawaRitsuki/sus-analyzer)
SeaUrchinScore Analyzer for node

## How to use

```
const analyzer = require('sus-analyzer')

const sus_meta = analyzer(fs.readFileSync("example.sus", 'utf8')
console.log(sus_meta)
```

## License
[The MIT License](http://kawakawaritsuki.mit-license.org) (c) [@kawakawaritsuki](https://github.com/kawakawaritsuki)
