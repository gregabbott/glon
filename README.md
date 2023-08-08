[Greg's List Object Notation](https://glon.pages.dev). The list based data format.

# About
GLON is a data format that builds on the traditional bullet point list. You can use GLON to make data ready to process and clear to read. GLON supports arrays, maps, strings and more, but doesn't define types with brackets, braces or quotes. It doesn't use or reserve these characters at all. GLON keeps all characters free to use for any purpose. Because of this, GLON plays well with other plain text formats and their features, like [[wiki links]], #hashTags, and [external]\(links).

GLON can stand on its own, in a .glon file, or form part of another plain text document. As GLON looks more like text than code, functions as a list, and suits proportional and monospace fonts, it can blend in wherever you put it. When you want to process any data written in GLON, the GLON parser can find it and convert it to JavaScript or JSON straight away.

# GLON Examples
<details><summary>Blocks Without Indents</summary>

A block of GLON without indented items looks like a normal list. The example below suggests a few use cases for GLON.
<pre>
- Text files with some data
- Document front matter
- Personal Knowledge Management
- Wikis and cross-linked files
- Data files with some text
- Metadata and sidecar files
- Notes and object oriented notes
- Records
- Outlines
</pre>
</details>

<details open ><summary>Blocks Without Indents</summary>
A block of GLON with indented items looks like an outline. The example below gives some initial details about different parts of GLON.
<pre>
- The GLON parser can convert:
	- From GLON to JavaScript.
	- From GLON to JSON.
	- From JavaScript to GLON.
	- From JSON to GLON.
	- You can try it live at [the GLON site](https://glon.pages.dev/).
- Objects:
	- GLON has two main object types: arrays and maps.
	- Maps hold named items as key value pairs. These convert to JavaScript or JSON objects.
	- Arrays hold unnamed items in insertion order. These convert to JavaScript or JSON arrays.
	- Both types can hold sub-objects of either kind.
- Strings and keys: 
	- "If you surround a key or string with quotes, the quotes form part of the key or string value."
	-     Strings and keys may start or end with whitespace which the parser can keep or strip.    
	- Strings and keys may stay empty:
	- 
	- Strings and keys may contain whitespace only, which the parser can keep or strip:
	- 	    	    
- Indents: You can indent GLON with **tabs OR spaces**. The whitespace that indents the first indented line in a block sets the value of one indent for the rest of the block.
- Types:
	- Parsing Types: The parser can keep all values as strings or convert them to types they match. When an output format doesn't support a type, the parser converts values of that type back to strings.
	- Supported Types:
		- Numbers:
			- Positive: 1,024 // Accepts and strips optional underscores or commas. separators
			- Negative: -1
			- Decimal: 3.14
		- Booleans: 
			- true
			- false
		- Null: null
		- Dates: 2023-08-01 // See [the GLON site](https://glon.pages.dev/) for more.
		- Not a Number: NaN
		- Infinity: infinity
	- Specific Types: You can include a Type Block in a document to tell the parser what type of value certain keys should hold. When the parser encounters these keys, it will convert their values to these types, or log a message if it finds any problem with the data. See the "Type Block" section at [the GLON site](https://glon.pages.dev/) for more.
- Hooks: You can supply the parser with custom functions that can act on or change data as it runs. See the "string_hook", "key_hook", and "when_key" sections at [the GLON site](https://glon.pages.dev/) for more. 
- Comments: 
	- Handling Comments: The parser strips any comments it finds then processes the data that remains.
	- Comment Types:
		- Full Line Comments: To create a full line comment, make its first visible characters two forward slashes.
		- Inline Comments: You can place inline comments anywhere after a line's bullet point. They start with a slash asterisk /* make a comment */ and end with an asterisk slash.
		- End of Line Comments: You can follow any value with a comment that runs until the line stops. End of line comments start with two slashes followed by one space. // End of line comment.
	- HTML Style Comments: You can use HTML style comments for the above purposes in environments and formats that support no other kind. &lt;!-- HTML Comment --&gt;
- Contents: 
	- Wikilinks:
		- [[Wikilinks AS keys]]: [[Wikilinks AS values]]
		- [[Wikilinks]] IN [[keys]]: [[Wikilinks]] IN [[values]]
		- Options: 
			- The parser can keep or strip wikilink brackets from keys.
			- It has a separate option to strip wikilink brackets from values that hold exactly one wikilink.
	- Hash Tags: 
		- #tagsInKeys: #tagInValues
	- Markdown:
		- **Bold Keys**: The parser can keep or strip bold from keys.
		- Links:
			- [Links as Keys](): [Links as values]()
			- [Links]() in [Keys](): [Links]() in [values]()
	- Snippets:
		- JavaScript: function add_one (n) { return n + 1 }
		- JSON: 
			- [ 1, 2, 4 ]
			- { "a": 1, "b": 2, "c": 3 }
		- CSS: * { padding: 0; }
		- RegEx: (\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)
		- HTML: &lt;a href="https://glon.pages.dev"&gt;GLON&lt;/a&gt;
- Signs:
	- Multi-line string: -
		- The parent line above ends with a minus sign.
		- It tell the parser to join these lines with newlines.
	- Single line from many: +
		- The parent line above ends with a plus sign.
		- It tell the parser to join each line with a space.
</pre>
</details>

# GLON to JSON
With all options turned on, the parser converts the example GLON above into the JSON below.

<details>
<summary>Converted result</summary>
<pre>
[
	[
		"Text files with some data",
		"Document front matter",
		"Personal Knowledge Management",
		"Wikis and cross-linked files",
		"Data files with some text",
		"Metadata and sidecar files",
		"Notes and object oriented notes",
		"Records",
		"Outlines"
	],
	{
		"The GLON parser can convert": [
			"From GLON to JavaScript.",
			"From GLON to JSON.",
			"From JavaScript to GLON.",
			"From JSON to GLON.",
			"You can try it live at [the GLON site](https://glon.pages.dev/)."
		],
		"Objects": [
			"GLON has two main object types: arrays and maps.",
			"Maps hold named items as key value pairs. These convert to JavaScript or JSON objects.",
			"Arrays hold unnamed items in insertion order. These convert to JavaScript or JSON arrays.",
			"Both types can hold sub-objects of either kind."
		],
		"Strings and keys": [
			"\"If you surround a key or string with quotes, the quotes form part of the key or string value.\"",
			"Strings and keys may start or end with whitespace which the parser can keep or strip.",
			"Strings and keys may stay empty:",
			"",
			"Strings and keys may contain whitespace only, which the parser can keep or strip:",
			""
		],
		"Indents": "You can indent GLON with **tabs OR spaces**. The whitespace that indents the first indented line in a block sets the value of one indent for the rest of the block.",
		"Types": {
			"Parsing Types": "The parser can keep all values as strings or convert them to types they match. When an output format doesn't support a type, the parser converts values of that type back to strings.",
			"Supported Types": {
				"Numbers": {
					"Positive": 1024,
					"Negative": -1,
					"Decimal": 3.14
				},
				"Booleans": [
					true,
					false
				],
				"Null": null,
				"Dates": "2023-07-31T23:00:00.000Z",
				"Not a Number": "NaN",
				"Infinity": "infinity"
			},
			"Specific Types": "You can include a Type Block in a document to tell the parser what type of value certain keys should hold. When the parser encounters these keys, it will convert their values to these types, or log a message if it finds any problem with the data. See the \"Type Block\" section at [the GLON site](https://glon.pages.dev/) for more."
		},
		"Hooks": "You can supply the parser with custom functions that can act on or change data as it runs. See the \"string_hook\", \"key_hook\", and \"when_key\" sections at [the GLON site](https://glon.pages.dev/) for more.",
		"Comments": {
			"Handling Comments": "The parser strips any comments it finds then processes the data that remains.",
			"Comment Types": {
				"Full Line Comments": "To create a full line comment, make its first visible characters two forward slashes.",
				"Inline Comments": "You can place inline comments anywhere after a line's bullet point. They start with a slash asterisk and end with an asterisk slash.",
				"End of Line Comments": "You can follow any value with a comment that runs until the line stops. End of line comments start with two slashes followed by one space."
			},
			"HTML Style Comments": "You can use HTML style comments for the above purposes in environments and formats that support no other kind."
		},
		"Contents": {
			"Wikilinks": {
				"Wikilinks AS keys": "Wikilinks AS values",
				"Wikilinks IN keys": "[[Wikilinks]] IN [[values]]",
				"Options": [
					"The parser can keep or strip wikilink brackets from keys.",
					"It has a separate option to strip wikilink brackets from values that hold exactly one wikilink."
				]
			},
			"Hash Tags": {
				"#tagsInKeys": "#tagInValues"
			},
			"Markdown": {
				"Bold Keys": "The parser can keep or strip bold from keys.",
				"Links": {
					"[Links as Keys]()": "[Links as values]()",
					"[Links]() in [Keys]()": "[Links]() in [values]()"
				}
			},
			"Snippets": {
				"JavaScript": "function add_one (n) { return n + 1 }",
				"JSON": [
					"[ 1, 2, 4 ]",
					"{ \"a\": 1, \"b\": 2, \"c\": 3 }"
				],
				"CSS": "* { padding: 0; }",
				"RegEx": "(\\d{4})-(\\d\\d)-(\\d\\d)T(\\d\\d):(\\d\\d)",
				"HTML": "&lt;a href=\"https://glon.pages.dev\"/&gt;GLON&lt;/a&gt;"
			}
		},
		"Signs": {
			"Multi-line string": "The parent line above ends with a minus sign.\nIt tell the parser to join these lines with newlines.",
			"Single line from many": "The parent line above ends with a plus sign. It tell the parser to join each line with a space."
		}
	}
]
</pre></details>

# More
Visit [the GLON website](https://glon.pages.dev/) for more details and examples about GLON, the GLON parser, and all features of both.

# Support
You can support GLON at <a href=https://www.buymeacoffee.com/gregabbott>Buy Me A Coffee</a> and <a href=https://ko-fi.com/gregabbott>Ko-fi</a>.
