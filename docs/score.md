## Functions

<dl>
<dt><a href="#getBPMs">getBPMs(validLine, measure, [basebpm])</a> ⇒ <code>Array.&lt;number&gt;</code></dt>
<dd><p>小節あたりのBPMを配列に変換する関数</p>
</dd>
<dt><a href="#getBEATs">getBEATs(validLine, measure)</a> ⇒ <code>Array.&lt;number&gt;</code></dt>
<dd><p>小節あたりの拍数を配列に変換する関数</p>
</dd>
<dt><a href="#getNotes">getNotes(validLine, tpb, beats)</a> ⇒ <code>Array.&lt;ISusMeta&gt;</code></dt>
<dd><p>sus有効行からノーツオブジェクトに変換する関数</p>
</dd>
<dt><a href="#getLongLane">getLongLane(notes, laneType)</a> ⇒ <code>Array.&lt;Array.&lt;ISusNotes&gt;&gt;</code></dt>
<dd><p>ノーツからロングオブジェクトに変換する関数</p>
</dd>
<dt><a href="#getScore">getScore(sus, [tickPerBeat])</a> ⇒ <code>ISusScore</code></dt>
<dd><p>susを解析する関数</p>
</dd>
</dl>

<a name="getBPMs"></a>

## getBPMs(validLine, measure, [basebpm]) ⇒ <code>Array.&lt;number&gt;</code>
小節あたりのBPMを配列に変換する関数

**Kind**: global function  
**Returns**: <code>Array.&lt;number&gt;</code> - BPMs[<小節番号>] = 小節のBPM  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| validLine | <code>Array.&lt;string&gt;</code> |  | sus有効行配列 |
| measure | <code>number</code> |  | 譜面小節数 |
| [basebpm] | <code>number</code> | <code>120</code> | 譜面BASEBPM |

<a name="getBEATs"></a>

## getBEATs(validLine, measure) ⇒ <code>Array.&lt;number&gt;</code>
小節あたりの拍数を配列に変換する関数

**Kind**: global function  
**Returns**: <code>Array.&lt;number&gt;</code> - BEATs[<小節番号>] = 小節の拍数  

| Param | Type | Description |
| --- | --- | --- |
| validLine | <code>Array.&lt;string&gt;</code> | sus有効行配列 |
| measure | <code>number</code> | 譜面小節数 |

<a name="getNotes"></a>

## getNotes(validLine, tpb, beats) ⇒ <code>Array.&lt;ISusMeta&gt;</code>
sus有効行からノーツオブジェクトに変換する関数

**Kind**: global function  
**Returns**: <code>Array.&lt;ISusMeta&gt;</code> - BEATs[<小節番号>] = 小節の拍数  

| Param | Type | Description |
| --- | --- | --- |
| validLine | <code>Array.&lt;string&gt;</code> | sus有効行配列 |
| tpb | <code>number</code> | Tick辺りの拍数 |
| beats | <code>Array.&lt;number&gt;</code> | 拍数の配列 |

<a name="getLongLane"></a>

## getLongLane(notes, laneType) ⇒ <code>Array.&lt;Array.&lt;ISusNotes&gt;&gt;</code>
ノーツからロングオブジェクトに変換する関数

**Kind**: global function  
**Returns**: <code>Array.&lt;Array.&lt;ISusNotes&gt;&gt;</code> - ロングオブジェクトの配列  

| Param | Type | Description |
| --- | --- | --- |
| notes | <code>Array.&lt;ISusNotes&gt;</code> | ノーツ配列 |
| laneType | <code>number</code> | ロング種別 |

<a name="getScore"></a>

## getScore(sus, [tickPerBeat]) ⇒ <code>ISusScore</code>
susを解析する関数

**Kind**: global function  
**Returns**: <code>ISusScore</code> - 譜面  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| sus | <code>String</code> |  | sus文字列 |
| [tickPerBeat] | <code>Number</code> | <code>192</code> | TickPerBeat |

