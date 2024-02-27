[Greg's List Object Notation](https://glon.pages.dev). The list based data format.

# About
GLON is a data format that builds on the traditional bullet point list. You can use GLON to make data ready to process and clear to read. GLON supports arrays, maps, strings and more, but doesn't define types with brackets, braces or quotes. It doesn't use or reserve these characters at all. GLON keeps all characters free to use for any purpose. Because of this, GLON plays well with other plain text formats and their features, like [[wiki links]], #hashTags, and [external]\(links).

GLON can stand on its own, in a .glon file, or form part of another plain text document. As GLON looks more like text than code, functions as a list, and suits proportional and monospace fonts, it can blend in wherever you put it. When you want to process any data written in GLON, the GLON parser can find it and convert it to JavaScript or JSON straight away.

# GLON Examples
<details open><summary>Blocks Without Indents</summary>

A block of GLON without indented items looks like a normal list. The example below suggests a few use cases for GLON.
```markdown
- Text files with some data
- Document front matter
- Personal Knowledge Management
- Wikis and cross-linked files
- Data files with some text
- Metadata and sidecar files
- Notes and object oriented notes
- Records
- Outlines
```
</details>

<details open ><summary>Blocks With Indents</summary>
A block of GLON with indented items looks like an outline. The example below gives some initial details about different parts of GLON.

```markdown
- The GLON parser can convert:
  - From GLON to JavaScript.
  - From GLON to JSON.
  - From JavaScript to GLON.
  - From JSON to GLON.
  - You can try it live at https://glon.pages.dev/
- Objects:
  - GLON has two main object types: arrays and maps.
  - Maps:
    - Maps hold named items as key value pairs.
    - These convert to JavaScript or JSON objects.
  - Arrays:
    - Arrays hold unnamed items in insertion order.
    - These convert to JavaScript or JSON arrays.
  - Both: Both maps and arrays can contain sub-objects.
- Indents:
  - You can indent GLON with **tabs OR spaces**. 
  - The first indent in a block sets the block's indent value.
- Strings and keys: 
  - Strings and keys require no quotes.
  - "Quotes around a string or key form part of its content."
  -      Strings and keys may start or end with whitespace.    
  - The parser can strip or keep whitespace surrounding content.
  - Strings and keys may stay empty:
  - 
  - Whitespace may populate strings and keys:
  -             
  - The parser can leave or trim whitespace strings and keys.
  - Strings and keys may contain any characters.
- String and key options: 
  - Wikilinks:
    - [[Wikilinks AS keys]]: [[Wikilinks AS values]]
    - [[Wikilinks]] IN [[keys]]: [[Wikilinks]] IN [[values]]
    - Options: 
      - The parser has two wikilink bracket options.
      - It can keep or strip them from keys.
      - It can strip them if a value equals one wikilink.
  - Hash Tags: 
    - #tagsInKeys: #tagInValues
  - Markdown:
    - Bold:
      - **Bold Keys**: For Presentation.
      - **Bold** in Keys: For emphasis.
      - Note: The parser can keep or strip bold from keys.
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
    - The parser has a "parse_type" option.
    - Set it to false to keep all values as strings.
    - Set it to true to convert values to types they match.
    - Some output target formats don't support some value types.
    - The parser converts any unsupported types back to strings.
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
    - Dates: 
      - Local: 2023-08-01
      - Offset: 2001-02-03T04:05:06+03:00
      - ISO: 2022-08-21T12:10:00Z
      - And more: See the GLON site.
    - Not a Number: NaN
    - Infinity: infinity
  - Specified Types: 
    - Each document may include a Type Block.
    - A Type Block sets value types for specific keys.
    - The parser checks any map items with these keys.
    - It accepts an item's value if it matches the wanted type.
    - Otherwise, it converts an item's value to the wanted type.
    - If it can't convert the value, it logs a message.
    - See the Type Block section at the GLON site for more.
- Hooks: 
  - You can configure the parser with custom functions.
  - The parser sends relevant data to these functions as it runs.
  - Your functions may act on and replace the data they receive.
  - The parser has three hooks so you can target specific data.
  - "string_hook" can process string values.
  - "key_hook" can process map item names.
  - "when_key" can process map item values, based on their name.
  - For more information, see the hook sections at the GLON site.
- Comments: 
  - Handling Comments: 
    - The parser strips all comments from all data blocks.
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
    - It tell the parser to join these lines with newlines.
  - Single line from many: +
    - The parent line above ends with a plus sign.
    - It tell the parser to join each line with a space.
```
</details>

# GLON to JSON
With all options turned on, the parser converts the example GLON above into the JSON below.

<details>
<summary>Converted result</summary>

```json
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
      "You can try it live at https://glon.pages.dev/"
    ],
    "Objects": {
      "GLON has two main object types": "arrays and maps.",
      "Maps": [
        "Maps hold named items as key value pairs.",
        "These convert to JavaScript or JSON objects."
      ],
      "Arrays": [
        "Arrays hold unnamed items in insertion order.",
        "These convert to JavaScript or JSON arrays."
      ],
      "Both": "Both maps and arrays can contain sub-objects."
    },
    "Indents": [
      "You can indent GLON with **tabs OR spaces**.",
      "The first indent in a block sets the block's indent value."
    ],
    "Strings and keys": [
      "Strings and keys require no quotes.",
      "\"Quotes around a string or key form part of its content.\"",
      "Strings and keys may start or end with whitespace.",
      "The parser can strip or keep whitespace surrounding content.",
      "Strings and keys may stay empty:",
      "",
      "Whitespace may populate strings and keys:",
      "",
      "The parser can leave or trim whitespace strings and keys.",
      "Strings and keys may contain any characters."
    ],
    "String and key options": {
      "Wikilinks": {
        "Wikilinks AS keys": "Wikilinks AS values",
        "Wikilinks IN keys": "[[Wikilinks]] IN [[values]]",
        "Options": [
          "The parser has two wikilink bracket options.",
          "It can keep or strip them from keys.",
          "It can strip them if a value equals one wikilink."
        ]
      },
      "Hash Tags": {
        "#tagsInKeys": "#tagInValues"
      },
      "Markdown": {
        "Bold": {
          "Bold Keys": "For Presentation.",
          "Bold in Keys": "For emphasis.",
          "Note": "The parser can keep or strip bold from keys."
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
        "The parser has a \"parse_type\" option.",
        "Set it to false to keep all values as strings.",
        "Set it to true to convert values to types they match.",
        "Some output target formats don't support some value types.",
        "The parser converts any unsupported types back to strings."
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
          "Local": "2023-07-31T23:00:00.000Z",
          "Offset": "2001-02-03T01:05:06.000Z",
          "ISO": "2022-08-21T12:10:00.000Z",
          "And more": "See the GLON site."
        },
        "Not a Number": "NaN",
        "Infinity": "infinity"
      },
      "Specified Types": [
        "Each document may include a Type Block.",
        "A Type Block sets value types for specific keys.",
        "The parser checks any map items with these keys.",
        "It accepts an item's value if it matches the wanted type.",
        "Otherwise, it converts an item's value to the wanted type.",
        "If it can't convert the value, it logs a message.",
        "See the Type Block section at the GLON site for more."
      ]
    },
    "Hooks": [
      "You can configure the parser with custom functions.",
      "The parser sends relevant data to these functions as it runs.",
      "Your functions may act on and replace the data they receive.",
      "The parser has three hooks so you can target specific data.",
      "\"string_hook\" can process string values.",
      "\"key_hook\" can process map item names.",
      "\"when_key\" can process map item values, based on their name.",
      "For more information, see the hook sections at the GLON site."
    ],
    "Comments": {
      "Handling Comments": [
        "The parser strips all comments from all data blocks."
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
          "content content",
          "Only the presence of both tags forms an inline comment.",
          "Either tag on its own remains part of a line's content."
        ],
        "End of Line Comments": [
          "You can add an end of line comment after a line's value.",
          "They start with two slashes followed by a space.",
          "They run until the line stops."
        ]
      },
      "HTML Style Comments": [
        "Some environments support HTML comments and no other kind.",
        "In these environments, you can use HTML comments instead."
      ]
    },
    "Signs": {
      "Multi-line string": "The parent line above ends with a minus sign.\nIt tell the parser to join these lines with newlines.",
      "Single line from many": "The parent line above ends with a plus sign. It tell the parser to join each line with a space."
    }
  }
]
```
</details>

# More
Visit [the GLON website](https://glon.pages.dev/) for more details and examples about GLON, the GLON parser, and all features of both.

# Support
You can support GLON at <a href=https://www.buymeacoffee.com/gregabbott>Buy Me A Coffee</a> and <a href=https://ko-fi.com/gregabbott>Ko-fi</a>.
