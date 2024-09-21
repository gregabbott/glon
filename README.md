# GLON. The list based data format.

[GLON](https://glon.pages.dev/) stands for Greg's List Object Notation. GLON is an easy to read and write data format that builds on the traditional bullet point list. It defines maps without braces, arrays without brackets, and strings without quotes. As GLON keeps all characters free for use in values and keys, it plays well with the features of other plain text formats: from [[Wikilinks]] and #hashtags, to \[links]() and **bold**. The GLON software, written in vanilla JavaScript, converts JSON to GLON and GLON to JSON. It handles the basics and has hooks for custom functions. 

Visit [the GLON website](https://glon.pages.dev/) for more about this Markdown compatible format, the GLON software, and all features of both.
The site features documentation with live examples and a two way GLON to JSON converter.

You can support GLON at <a href=https://www.buymeacoffee.com/gregabbott>Buy Me A Coffee</a> and <a href=https://ko-fi.com/gregabbott>Ko-fi</a>.

# Example
<details open ><summary>GLON looks like this</summary>

```markdown
- The GLON software (Vanilla JavaScript) can convert:
  - From GLON to JavaScript and JSON
  - From JSON and JavaScript to GLON.
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
  - In GLON, a block means consecutive lines of visible text.
  - A "GLON block" holds valid GLON, an "Other block" doesn't.
  - One or more empty lines separates blocks.
- Values and Keys: 
  - Strings and keys require no quotes.
  - "Quotes around a string or key form part of its content."
  -      Strings and keys may start or end with whitespace.    
  - glon.to_js can keep or trim whitespace surrounding strings.
  - Strings and keys may stay empty:
  - 
  - Whitespace may populate strings and keys:
  -             
  - glon.to_js can keep or trim whitespace surrounding keys.
  - Strings and keys may contain any characters.
- Separators:
  - First: The first line per level sets the separator type.
  - Normal separators: // For standard presentation
    - a: 1
    - b: 2
  - Equals separators: // For faster typing
    - a = 1
    - b = 2
- String and key options: 
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
    - glon.to_js has a "parse_type" option.
    - Set it to false to keep all values as strings.
    - Set it to true to convert values to types they match.
    - Some output target formats don't support some value types.
    - glon.to_js converts any unsupported types back to strings.
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
      - See the dates section for more.
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
```
</details>

# GLON to JSON
With all options turned on, the software converts the example GLON above into the JSON below.

<details>
<summary>Converted result</summary>

```json
[
  {
    "The GLON software (Vanilla JavaScript) can convert": [
      "From GLON to JavaScript and JSON",
      "From JSON and JavaScript to GLON."
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
      "You can indent GLON with **tabs OR spaces**. ",
      "The first indent in a block sets the block's indent value.",
      "In GLON, a block means consecutive lines of visible text.",
      "A \"GLON block\" holds valid GLON, an \"Other block\" doesn't.",
      "One or more empty lines separates blocks."
    ],
    "Values and Keys": [
      "Strings and keys require no quotes.",
      "\"Quotes around a string or key form part of its content.\"",
      "     Strings and keys may start or end with whitespace.    ",
      "glon.to_js can keep or trim whitespace surrounding strings.",
      "Strings and keys may stay empty:",
      "",
      "Whitespace may populate strings and keys:",
      "            ",
      "glon.to_js can keep or trim whitespace surrounding keys.",
      "Strings and keys may contain any characters."
    ],
    "Separators": {
      "First": "The first line per level sets the separator type.",
      "Normal separators": {
        "a": 1,
        "b": 2
      },
      "Equals separators": {
        "a": 1,
        "b": 2
      }
    },
    "String and key options": {
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
        "glon.to_js has a \"parse_type\" option.",
        "Set it to false to keep all values as strings.",
        "Set it to true to convert values to types they match.",
        "Some output target formats don't support some value types.",
        "glon.to_js converts any unsupported types back to strings."
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
        "Dates": [
          "Local: 2023-08-01",
          "Offset: 2001-02-03T04:05:06+03:00",
          "ISO: 2022-08-21T12:10:00Z",
          "See the dates section for more."
        ],
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
      "Single line from many": "The parent line above ends with a plus sign. It tells glon.to_js to join each line with a space."
    }
  }
]
```
</details>
