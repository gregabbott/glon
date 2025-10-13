# GLON: The list based data format.

Greg's List Object Notation uses bullet point lists as the basis for an easy to read and write plain text data format called GLON. GLON supports the same data types as JSON, allows comments in keys and values, and works as a valid Markdown list. GLON's minimal syntax defines maps without braces, arrays without brackets, and strings without quotes. GLON keeps all characters free to use in values and keys so plays well with features of other plain text formats, from [[wikilinks]] and #hashTags to \*\*bold** and \[external](links). GLON understands keys and values separated with colons or equals, and handles lines indented with tabs or spaces.

[Visit the GLON website](https://gregabbott.pages.dev/glon) (or at [GitHub](https://gregabbott.github.io/glon)) for documentation with live examples, and a playground that runs the GLON software. Written in vanilla JavaScript with no dependencies, The GLON software works as a configurable two way GLON to JSON converter. Its options include choosing whether to parse types or to keep everything as strings. The GLON to JSON convertor also comes with hooks for custom functions. These functions can act on the data they receive, and optionally return different data to use instead.

You can support GLON at [Buy Me a Coffee](https://www.buymeacoffee.com/gregabbott) and [Ko-fi](https://ko-fi.com/gregabbott).

To see how GLON relates other data serialization formats, visit the [GLON compare page](https://gregabbott.pages.dev/glon/compare).

# Example
<details open ><summary>GLON looks like this</summary>

```markdown
- Blocks:
  - The GLON parser splits a document into Blocks.
  - One or more empty lines separates Blocks in a document.
  - Data Blocks hold GLON. Other Blocks hold anything else.
  - This section looks at Data Blocks.
- Collection types:
  - Each Data Block forms one of GLON's main collection types:
  - Maps:
    - Maps hold named items as key value pairs.
    - These convert to JavaScript or JSON objects.
  - Arrays:
    - Arrays hold unnamed items in insertion order.
    - These convert to JavaScript or JSON arrays.
  - Both: Maps and arrays can hold further maps and arrays.
- Indents:
  - The first indent in a block sets the block's indent value.
  - GLON supports lines indented with **tabs OR spaces**. 
- Strings: 
  - Strings require no quotes.
  - "Quotes around a string or key form part of its content."
  -      Strings may start or end with whitespace.    
  - glon.to_js can keep or trim whitespace surrounding strings.
  - Strings may stay empty:
  - 
  - Whitespace may populate strings:
  -             
  - Strings may contain any characters. 🙂
  - All GLON map items have strings for keys.
- Key Value Separators: // For map items
  - First: The first line per level sets the separator style.
  - Normal separators: // For standard presentation
    - a: 1
    - b: 2
  - Equals separators: // For faster typing
    - a = 1
    - b = 2
- Compatibility: 
  - Wikilinks:
    - [[Wikilinks AS keys]]: [[Wikilinks AS values]]
    - [[Wikilinks]] IN [[keys]]: [[Wikilinks]] IN [[values]]
  - Hash Tags: 
    - #tagsInKeys: #tagInValues
  - Markdown:
    - Bold:
      - **Bold Keys**: **Bold values**.
      - **Bold** in Keys: **Bold** in values.
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
    - HTML: <a href="https://glon.pages.dev">GLON</a>
- Types:
  - Parsed Types: 
    - glon.to_js has a "parse_types" option.
    - Set it to false to keep all values as strings.
    - Set it to true to convert values to types they match.
    - Some output target formats don't support some data types.
    - The software converts unsupported data types to strings.
    - For example, the to_json option converts dates to strings.
  - Supported Types:
    - Numbers:
      - Positive: 1024
      - Comma separators: 1,024 // Accepts and strips
      - Underscore separators: 1_024 // Accepts and strips
      - Negative: -1
      - Decimal: 3.14
    - Booleans: 
      - true
      - false
    - Null: null
    - Dates: // See the dates section for more.
      - Local: 2024-10-01
      - Offset: 2001-02-03T04:05:06+03:00
      - ISO: 2022-08-21T12:10:00Z
    - Not a Number: NaN
    - Infinity: infinity
  - Specified Types: 
    - Each document may include a Type Block.
    - A Type Block sets value types for specific keys.
    - glon.to_js checks any map items with these keys.
    - It accepts an item's value if it matches the wanted type.
    - Otherwise, it converts an item's value to the wanted type.
    - If it can't convert the value, it logs a message.
    - See the Type Block section for more.
- Hooks: 
  - You can configure glon.to_js with custom functions.
  - The parser sends relevant data to these functions as it runs.
  - Your functions may act on and replace the data they receive.
  - The parser has two hooks so you can target specific data.
  - "value_hook" can process values.
  - "key_hook" can process map item names.
  - See the Hook sections for more.
- Comments: 
  - Handling Comments: 
    - glon.to_js strips all comments from all data blocks.
  - Comment Types:
    - Full Line Comments: 
      - Full line comments start with two forward slashes.
      //- To turn a line into a comment, add "//" to its start.
      - You can indent full line comments as needed.
    - Inline Comments: 
      - A line can hold any number of inline comments.
      - Inline comments sit between a pair of tags.
      - The left tag equals slash asterisk: "/*".
      - The right tag equals asterisk slash: "*/".
      - You can place inline comments anywhere in a line.
      - /*before*/ content /*between*/ content /*and after it.*/
      - Only the presence of both tags forms an inline comment.
      - Either tag on its own remains part of a line's content.
    - End of Line Comments:
      - You can add an end of line comment after a line's value.
      - They start with two slashes followed by a space.
      - They run until the line stops. // An example comment.
  - HTML Style Comments: <!-- HTML comments look like this -->
    - Some environments support HTML comments and no other kind.
    - In these environments, you can use HTML comments instead.
- Signs:
  - Multi-line string: -
    - The parent line above ends with a minus sign.
    - It tells glon.to_js to join these lines with newlines.
  - Single line from many: +
    - The parent line above ends with a plus sign.
    - It tells glon.to_js to join each line with a space.
  - Force strings: "
    - The parent line above ends with a quotes sign.
    - It tells glon.to_js to make this item an array of strings.
    - This helps when your data looks more like another type.
    - 123
    - true
    - null
    - 2024-10-01
```
</details>

# GLON to JSON
With all options turned on, the software converts the example GLON above into the JSON below.

<details>
<summary>Converted result</summary>

```json
[
  {
    "Blocks": [
      "The GLON parser splits a document into Blocks.",
      "One or more empty lines separates Blocks in a document.",
      "Data Blocks hold GLON. Other Blocks hold anything else.",
      "This section looks at Data Blocks."
    ],
    "Collection types": {
      "Each Data Block forms one of GLON's main collection types": "",
      "Maps": [
        "Maps hold named items as key value pairs.",
        "These convert to JavaScript or JSON objects."
      ],
      "Arrays": [
        "Arrays hold unnamed items in insertion order.",
        "These convert to JavaScript or JSON arrays."
      ],
      "Both": "Maps and arrays can hold further maps and arrays."
    },
    "Indents": [
      "The first indent in a block sets the block's indent value.",
      "GLON supports lines indented with **tabs OR spaces**. "
    ],
    "Strings": [
      "Strings require no quotes.",
      "\"Quotes around a string or key form part of its content.\"",
      "     Strings may start or end with whitespace.    ",
      "glon.to_js can keep or trim whitespace surrounding strings.",
      "Strings may stay empty:",
      "",
      "Whitespace may populate strings:",
      "            ",
      "Strings may contain any characters. 🙂",
      "All GLON map items have strings for keys."
    ],
    "Key Value Separators": {
      "First": "The first line per level sets the separator style.",
      "Normal separators": {
        "a": 1,
        "b": 2
      },
      "Equals separators": {
        "a": 1,
        "b": 2
      }
    },
    "Compatibility": {
      "Wikilinks": {
        "[[Wikilinks AS keys]]": "[[Wikilinks AS values]]",
        "[[Wikilinks]] IN [[keys]]": "[[Wikilinks]] IN [[values]]"
      },
      "Hash Tags": {
        "#tagsInKeys": "#tagInValues"
      },
      "Markdown": {
        "Bold": {
          "**Bold Keys**": "**Bold values**.",
          "**Bold** in Keys": "**Bold** in values."
        },
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
        "HTML": "<a href=\"https://glon.pages.dev\">GLON</a>"
      }
    },
    "Types": {
      "Parsed Types": [
        "glon.to_js has a \"parse_types\" option.",
        "Set it to false to keep all values as strings.",
        "Set it to true to convert values to types they match.",
        "Some output target formats don't support some data types.",
        "The software converts unsupported data types to strings.",
        "For example, the to_json option converts dates to strings."
      ],
      "Supported Types": {
        "Numbers": {
          "Positive": 1024,
          "Comma separators": 1024,
          "Underscore separators": 1024,
          "Negative": -1,
          "Decimal": 3.14
        },
        "Booleans": [
          true,
          false
        ],
        "Null": null,
        "Dates": {
          "Local": "2024-09-30T23:00:00.000Z",
          "Offset": "2001-02-03T01:05:06.000Z",
          "ISO": "2022-08-21T12:10:00.000Z"
        },
        "Not a Number": "NaN",
        "Infinity": "infinity"
      },
      "Specified Types": [
        "Each document may include a Type Block.",
        "A Type Block sets value types for specific keys.",
        "glon.to_js checks any map items with these keys.",
        "It accepts an item's value if it matches the wanted type.",
        "Otherwise, it converts an item's value to the wanted type.",
        "If it can't convert the value, it logs a message.",
        "See the Type Block section for more."
      ]
    },
    "Hooks": [
      "You can configure glon.to_js with custom functions.",
      "The parser sends relevant data to these functions as it runs.",
      "Your functions may act on and replace the data they receive.",
      "The parser has two hooks so you can target specific data.",
      "\"value_hook\" can process values.",
      "\"key_hook\" can process map item names.",
      "See the Hook sections for more."
    ],
    "Comments": {
      "Handling Comments": [
        "glon.to_js strips all comments from all data blocks."
      ],
      "Comment Types": {
        "Full Line Comments": [
          "Full line comments start with two forward slashes.",
          "You can indent full line comments as needed."
        ],
        "Inline Comments": [
          "A line can hold any number of inline comments.",
          "Inline comments sit between a pair of tags.",
          "The left tag equals slash asterisk: \"/*\".",
          "The right tag equals asterisk slash: \"*/\".",
          "You can place inline comments anywhere in a line.",
          " content  content ",
          "Only the presence of both tags forms an inline comment.",
          "Either tag on its own remains part of a line's content."
        ],
        "End of Line Comments": [
          "You can add an end of line comment after a line's value.",
          "They start with two slashes followed by a space.",
          "They run until the line stops. "
        ]
      },
      "HTML Style Comments": [
        "Some environments support HTML comments and no other kind.",
        "In these environments, you can use HTML comments instead."
      ]
    },
    "Signs": {
      "Multi-line string": "The parent line above ends with a minus sign.\nIt tells glon.to_js to join these lines with newlines.",
      "Single line from many": "The parent line above ends with a plus sign. It tells glon.to_js to join each line with a space.",
      "Force strings": [
        "The parent line above ends with a quotes sign.",
        "It tells glon.to_js to make this item an array of strings.",
        "This helps when your data looks more like another type.",
        "123",
        "true",
        "null",
        "2024-10-01"
      ]
    }
  }
]
```
</details>
