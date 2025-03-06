/* GLON. Copyright © 2022-2025 Greg Abbott (UK)
https://gregabbott.pages.dev
Version: 2025_0306 */
// 3 separate sections below, in 1 file for easy install.
if(window['glon']==undefined){window['glon']={}}
/* =============================================================
                  glon.parse_string
PART: STRING TO TYPES PARSER
Project: GLON
BY + COPYRIGHT: 2023-2025 GREG ABBOTT UK
Features of glon.to_js that use this section:
parse_types, parse_dates and the type_block.
*/
(()=>{
	function chain(x,...l){return l.reduce((a,c)=>c(a),x)}
	// ────────────────────────────────
	//string to date
	const date_formats={
		//each accepted format has a unique length,
		//good for immediate yes no check
		//local
		'10':`0000-00-00`,
		'16':`0000-00-00T00:00`,
		'19':`0000-00-00T00:00:00`,
		'23':`0000-00-00T00:00:00.000`,
		// iso
		'17':`0000-00-00T00:00Z`,
		'20':`0000-00-00T00:00:00Z`,
		'24':`0000-00-00T00:00:00.000Z`,
		// offset (* === ['+','-'])
		'25':`0000-00-00T00:00:00*00:00`,
		'29':`0000-00-00T00:00:00.000*00:00`
		}
	const string_matches_accepted_date_format=string=>{
		if(!typeof string ==='string')return false
		string=string.trim()
		let length = string.length,
			format_to_test=date_formats[length],
			unaccepted_format=format_to_test===undefined
		if(unaccepted_format)return false
		let form = new RegExp(`^${format_to_test
			//create capture group per unit (blocks of zeroes)
			.replace(/(0+)/g,'($1)')
			// escape for regex:
			.replace('.','\\.')
			.replace('*','(\\+|-)')
			.replaceAll('0','\\d')}$`)
		//end if string doesn't match format with same length
		if(!form.test(string)){return false}
		//get parts
		let [a,y,M,d,h='00',m='00',s='00',...z] = string.match(form)
		//loose check:
		return(
			parseInt(M)>12||
			M==='00'||
			parseInt(d)>31||
			d==='00'||
			parseInt(h)>23||
			parseInt(m)>59||
			parseInt(s)>59
		)?false:true
	}
	function fill_blanks_in_validated_date_string(s){
		return [10,16,19].includes(s.length)
		?s+date_formats[23].substring(s.length)
		:[17,20].includes(s.length)?s.replace('Z','.000Z')
		:s.length===25?s.substring(0, 19)+'.000'+s.substring(19)
		:s // already full
	}
	function is_date(x){return x instanceof Date}
	function is_number(x){return !Number.isNaN(x)}
	function if_valid_date_keep_else_false(d){
		return is_date(d)&&is_number?d:false}
	function string_to_date(x){return new Date(x)}
	function date_looking_string_to_date_OR_false(s){return chain(
		s,
		fill_blanks_in_validated_date_string,
    //trace(x)=>{console.log(x);return x},
		string_to_date,
		if_valid_date_keep_else_false
	)}
const	parse_string_to_date=x=>{
  // In case you wonder why:
  // input `2002-04-22`
  // returns `2002-04-21T23:00:00.000Z`:
  // inputs without stated timezone parse as local timezone
  // the output shows the ISO value (note the 'Z') UTC timezone
		if(
			typeof x==='string'&&
			string_matches_accepted_date_format(x.trim())
		){
			return date_looking_string_to_date_OR_false(x.trim())||x
		}
		return x//already converted to type OR not date-like
	}
	function eager_parse_string_to_date(xt){
    let rv = {
      errors:[],
      result:xt
    }
		let error_txt = `Can't convert this value to a date: \n"${xt}"`
		if(typeof xt !== 'string'){
			rv.errors.push(error_txt)
			return rv
		}
		// is string:
		let trimmed=xt.trim()
		if(trimmed==''){
			//no data to make date with
			rv.errors.push(error_txt)
			return rv
		}
		function string_only_contains_digits(x){
			return typeof x==='string'&&/^\d+$/.test(x)
		}
		//allow year only
		if(xt.length==4&&string_only_contains_digits(xt)){
			xt=xt+'-01-01T00:00:00.000Z'
		}
		let date = parse_string_to_date(xt)
		if(
			//changed
			date!==xt){
        rv.result = date
				return rv
		}
		rv.errors.push(error_txt)
		return rv
	}
	//end date section
	// ────────────────────────────────
	//string_to_number
	const are_all_separators_in_number_valid_if_any=s=>{
		/* s == a number-looking string
		with any negative sign already stripped
		to reduce checks needed
		*/
		let number_has_separators=s=>s.includes('_')||s.includes(','),
		number_starts_with_separator=s=>['_',','].includes(s[0]),
    number_ends_with_separator=s=>['_',','].includes(s[s.length-1]),
    number_has_mixed_separators=s=>s.includes('_')&&s.includes(','),
    number_has_touching_separators=s=>{return [
		//negative sign already stripped from s
		//no need to check if separator touching negative symbol
		',,',
		',.',
		',_',
		'.,',
		'..',
		'._',
		'_,',
		'_.',
		'__',
	].some(x=>s.includes(x))}
		if(number_has_separators(s)===false)return true
		if(
			number_starts_with_separator(s)||
			number_ends_with_separator(s)||
			number_has_mixed_separators(s)||
			number_has_touching_separators(s)
		){
			return false
		}
		return true
	}
	const string_looks_like_big_int=s=>{
		let integer = (s.indexOf('.')!==-1
			?s.substring(0,s.indexOf('.'))
			:s)//left of decimal
			.replaceAll('_', '')
			.replaceAll(',', '')
			.replaceAll('-','')
		//max safe and min safe same but one is negative
		let max_safe_integer_length=16
		if (integer.length > max_safe_integer_length){
			return true
		}
		let possibly_big_int = 
			integer.length === max_safe_integer_length && 
			integer[0] === "9"//Currently string
		if (possibly_big_int) {
			//don't string compare
			// '9' is bigger string than '20039471238'
			return parseInt(integer) > Number.MAX_SAFE_INTEGER
			//MAX==='9007199254740991'
			//anything bigger gets set to //9007199254740992
		}
		return false
	}
	const string_matches_number_requirements=s=>{
		if (typeof s !== 'string') return 'not string'
		//convert to positive for simpler testing
		s = s.trim().replace(/^-/,'')
    if(s.length===0)return false//if string ==='-'
		//leave strings with leading zeroes as strings.
		//don't count zero before a decimal as a leading zero.
		if(/^0+(\d)/.test(s))return false
		// Any leading zeroes (007) form part of the input data.
		// '007' would convert to number 7, losings data '00'
		// The input would already equal 7 if user meant 7
		// User may type 7 for 7 and 007 for '007'. etc.
		let has_any_non_number_characters = !/^[\d,_\.]*$/.test(s)
		if(has_any_non_number_characters){
			return false
			// Allowed [0-9,'_',',' (separators),'.'(decimals)]
			// Already stripped any allowed leading dash (e.g. -1)
			// Any remaining dash disallowed.
		}
		if(
			// has_more_than_one_decimal_point
			(s.match(/\./g)?.length||0)>1||
			are_all_separators_in_number_valid_if_any(s)===false||
			string_looks_like_big_int(s)
		) {return false}
		return true//passes all tests
	}
	const parse_validated_string_to_number=x=>{
			//string content valid number
			//strip_number_separators->convert to number type
		return parseFloat(x.replace(/_|,/g,''))		
	}
	function eager_parse_string_to_number(input,type_wish){
		//if user specifies a specific key's value should hold a number
		//reduce strictness of what looks like a number
		//xt === trimmed string
    let rv = {errors:[],result:input}
		let error_txt = `Can't convert input to type "${type_wish}". `+
    'Returned orig value: '+input
		if(typeof input !== `string`){
			rv.errors.push(error_txt)
			return rv
		}
		let xt = input.trim()
		if(xt.startsWith('0')){
			xt=xt.replace(/^0+/,'')
			//if input has leading zeroes remove
			//normally user wants to keep them (007 !== 7)
			//in this instance user confirmed they want a number
		}
		if(string_matches_number_requirements(xt)===true){
			let n= parse_validated_string_to_number(xt)
			if(type_wish=='integer'&&!Number.isInteger(n)){
				//parses to number but not whole
				rv.errors.push(
        error_txt+' '+
        `The user specifically wants an integer. They provided:\n`+
        `"${input}"\n`+
        `Converting this to a whole number would discard user data.\n`+
        `The converter will return the data as given to preserve it.\n`+
        `The type converters aim to correct data types not alter input.`
				)
				return rv
			}
      rv.result = n
			return rv
		}
		rv.errors.push(error_txt)
		return rv
	}
	//end number section
	//────────────────────────────────
	// General parsing
	const parse_string_to_probable_js_type=x=>{
		let xt=x.trim()
		//GLON TYPES to JS
		let is=glon_type=>glon_type===xt
		return xt===''?x//no data to work with
		:xt=='.'?x//<- keep as string.matches no type below&&!number
		:is(`true`)?true
		:is(`false`)?false
		//these next JavaScript types have no JSON equivalent
		//when convert to JSON, revert to GLON input string
		:is(`NaN`)?NaN
		:is(`infinity`)?Infinity
		:is(`+infinity`)?Number.POSITIVE_INFINITY
		:is(`-infinity`)?Number.NEGATIVE_INFINITY
		:is(`null`)?null
		:string_matches_number_requirements(xt)===true
			?parse_validated_string_to_number(xt)
			:x//string
	}
	function to_likely_type({parse_types=true,parse_dates=true}){
		return string=>{
			let x = string
			if(parse_types){x= parse_string_to_probable_js_type(x)}
			if(parse_dates){x=parse_string_to_date(x)}
			return x
		}
	}
  window['glon'].parse_string={
    to_likely_type,
    to_number_eager:eager_parse_string_to_number,
    to_date_eager:eager_parse_string_to_date
    //TODO parse_number…
  }
  return 
})();
// =============================================================
//                       glon.to_
// Glon to OTHER format
//if(window['glon']===undefined){window['glon']={}}
(function (){
let g_parsing_type_block=false
const to_js_setup={}
let errors=[]//resets each time glon.to_js called
const glon_type={
	"infinity":'infinity',
	"infinity_positive":'+infinity',
	"infinity_negative":'-infinity',
	"true":'true',
	"false":'false',
	"nan":'NaN',
	"null":'null',
}
const separator= ": "
const normal_separator=`: `//if value same line
const escaped_normal_separator='\\: '
const equals_separator=` = `
const escaped_equals_separator=' \\= '
const unit_separator=String.fromCharCode(31)
const muted_escaped_normal_separator= ':'+unit_separator
const bullet_normal='- '//match normal
const ERROR_IN_LEVEL={}//Usage example: if(rv==ERROR_IN_LEVEL){}
const inline_js_comment=/\/\*(.*?)\*\//g
const inline_html_comment=/<!--(.*?)-->/g
const rest_of_line_js_comment=/\/\/ (.*)$/g
//^ "Slash slash SPACE" allows https://... in content
function stringify(j){return JSON.stringify(j,null,'\t')}
function log(x){console.log(x);return x}
function mute_escaped_normal_separator(x){
	return x.replaceAll(
		escaped_normal_separator,
		muted_escaped_normal_separator
	)
}
function unmute_escaped_normal_separator(x){
	return x.replaceAll(
		muted_escaped_normal_separator,
		escaped_normal_separator
	)
}
function get_type(o){
	return (
		o===null?'null'
		:typeof o==='undefined'?'undefined'
		:o?.constructor?.name
	)
}
function chain(x, ...l) {return l.reduce((a,c)=>c(a),x)}
function when(k,fn){return function(d){return k?fn(d):d}}
function whitespace_to_words(x){
	return [
			[/ +/g,'space'],
			[/\t+/g,'tab']
	]
	.reduce( function to_words(s,[find,name]){
		return s.replace(
				find,
				function (x){
					return`${x.length} ${name}${x.length===1?'':'s'}, `
				}
		)
	},x)
	.trim()
	.replace(/,$/,'')
}
function log_type_wish_flaw(line,type_wish){
	//log that value won't parse to type defined in type block
	errors.push(
    `Can't convert line to data type "${type_wish}". `+
    `Line value "${line}"`
  )
}
function eager_convert_to_string (value){
	if(['Object','Array'].includes(value?.constructor?.name)){
		return JSON.stringify(value)
	}
	return value.toString()
}
const was_not_json = {}
function parse_if_json (s){
    if(typeof s!==`string`)return was_not_json 
    try {
        return JSON.parse(s)
    } catch(e){
        return was_not_json
    }
}
function eager_convert_to_object (value){
  //user explicitly wants an object
    let parsed_json = parse_if_json(value)
    let error_message=`Can't parse value to map: "${value}"`
    if(//value parses as valid json Object
        parsed_json!==was_not_json&&
        parsed_json?.constructor?.name=='Object'
    ){
        return parsed_json
    }
    if(
        //user may have given 'dumb map' e.g.: `a:1,b:2,c:3`
        typeof value==`string`&&
        value.includes(':')
        //may only hold one value, no commas
    ){
        let parts = value.split(',')
        let all_parts_have_separator=
            parts.every(part=>part.includes(':'))
        if(!all_parts_have_separator){
            //not a dumb map
            errors.push(error_message)
            return value
        }
        return parts.reduce((ob,kv)=>{
            let [k,...v]=kv.split(':')
            ob[k.trim()]=v.join(':')
            return ob
        },{})
    }
    errors.push(error_message)
    return value
    //accepts 'dumb map':eager_convert_to_object(`a:1,b:2`)
    //accepts json:eager_convert_to_object(`{"a":"val","b":2}`)
}
function eager_convert_to_array(value){
	//console.log(value,value?.constructor?.name)
	let parsed_json = parse_if_json(value)
	if(
		//value parses as valid json array already
			parsed_json!==was_not_json&&
			parsed_json?.constructor?.name=="Array"
	){
		return parsed_json
	}
	// if item starts a sub object of key value pairs
	if(value?.constructor?.name==='Object'){
    //swap from {a:1,b:2} to [["a",1],["b",2]]
		return Object.entries(value)
	}
  // Comma separated list a,b,c =>["a","b","c"]
	if(value?.constructor?.name==='String'){
		return value.includes(',')
			?value.split(',')
			:[value]
	}
	return [value]
}
function eager_convert_to_boolean(value){
  //user explicitly wants a boolean from the input
	if(typeof value === 'string'){
		let clean_value = value.toLowerCase().trim()
		if(['1','yes','true'].includes(clean_value)){
			return true
		}
		if(['0','no','false','undefined','null','']
      .includes(clean_value)){
			return false
		}
	}
	errors.push(`Can't parse value to a boolean: ${value}`)
	return value
}
function eager_convert_to_date(value){
	if(window['glon']?.parse_string===undefined){
    //Console.error on purpose as it relates to user setup
    //(reserve use of errors array for errors related to data)
		console.error(
      `Include "glon.parse_string" function `+
      `to attempt converting value eagerly to date: ${value}`
    )
		return value
	}
	let rv = window['glon'].parse_string.to_date_eager(value)
  if(rv.errors.length>0){
    rv.errors.forEach(error=>{
      errors.push(error)
    })
  }
  //console.log(rv)
  return rv.result
}
function eager_convert_to_number(value,type_wish){
	if(window['glon']?.parse_string===undefined){
    //Console.error on purpose. This error relates to user setup
    //(reserve use of errors array for errors related to data)
		console.error(
    `Include "glon.parse_string" function `+
    `to attempt converting value eagerly to number: ${value}`)
		return value
	}
	//next function returns {errors:[],result}
	let rv = window['glon'].parse_string.to_number_eager(
		value,
		type_wish//'float'
	)	
  if(rv.errors.length>0){
    rv.errors.forEach(error=>{
      errors.push(error)
    })
  }
  return rv.result
}
function try_to_make_wanted_data_type_if_not_already(type_wish){
	if(!type_wish||type_wish=='any'){
		//user has no preference
		//so return a function that passes the value unchanged
		return value=>value
	}
	//user wants to data to match specific type
	return (value)=>{
		const type_is=value?.constructor?.name
	 if(
		//value type already matches wanted type
		{
			'String':	type_wish==='string',
			'Object':	type_wish==='map',
			'Array':	 type_wish==='array',
			'Boolean': type_wish==='boolean',
			'Number':	['integer','float'].includes(type_wish),
			'Date':		type_wish==='date'
		}[type_is]){
			// leave it
			return value
		}
	//this function knows the specific type a user wants
	//which lets it convert values to types it may not otherwise
	let fn = {
	string:eager_convert_to_string,
	map:eager_convert_to_object,
	array:eager_convert_to_array,
	boolean:eager_convert_to_boolean,
	date:eager_convert_to_date,
	integer:eager_convert_to_number,
	float:eager_convert_to_number,
	number:eager_convert_to_number,
	}[type_wish]
	const rv =fn(value,type_wish)
	if(rv===undefined){
		log_type_wish_flaw(value,type_wish)
		return value
	}
	return rv
}}
function empty_a_map(the_map){
	the_map.forEach((v,k)=>{the_map.delete(k)})
	return the_map
}
const digit_key_prefix='f94e7b23-b331-4190-aa05-8d45be21b22c'
const digit_keys_to_restore=new Map()
function handle_digit_only_key(ob){return (key)=>{
	const is_digit_only_string=
		typeof key === 'string'&&
		/^\d+$/.test(key)
	if(!is_digit_only_string)return key
	//!digit only
	/*this adds a UNIQUE prefix to each digit-only key name,
	before the parser adds the property to a JS object.
	the prefix prevents Javascript reordering the property
	(it moves digit only properties before all other keys)
	the prefix gets removed from JS later when js_to_json runs
	this way GLON input order persists in JSON output.
	*/
	const prefixed_key=
		//unique prefix, in case same key appears elsewhere in doc
		digit_keys_to_restore.size+
		//a key would not likely start with this
		digit_key_prefix+
		//original key 
    //(removing unique prefix later reverts key to original)
		key
	digit_keys_to_restore.set(
		prefixed_key,
		//function to remove temporary prefix from digit only key:
		()=>{
			//remove_prefixes_added_to_digit_only_keys_if_applicable
				//kept them so that JSON could output in same order
				//now done that, revert keys in JS ob
				//store value to original key
				ob[key]=ob[prefixed_key]
				//delete prefixed
				delete ob[prefixed_key]
			}
	)
	return prefixed_key
}}
function if_string_and_user_wants__parse_to_most_likely(type_wish,keep_as_string){
	return value=>{
//Type block instruction over-rules any 'keep_as_string' comment
//The Fn called before this, attempts to parse to any wanted type
let user_wanted_to_specific_type_for_value=
  //they wanted a specific type:
  type_wish !==undefined
  && type_wish!=='any'
let is_string=typeof value ==='string'
if(user_wanted_to_specific_type_for_value){
  let it_worked=
  //they wanted a string and it is a string
  (is_string&&type_wish=='string')
  ||
  //they wanted something else and it is no longer a string
  (type_wish!=='string'&&!is_string)
  if(it_worked){
    return value
  }
}
  // If here, either:
  // User had no type preference
  // value could not convert to the type user wanted
  // A 'keep_as_string' comment over-rules any parse instruction:
    //  e.g. 'parse_types'/'parse_dates'
    // for the line it appears on
  if(keep_as_string&&is_string){
    return value
  }
  //If here, line had:
    // no specific type wish
    // no instruction to specifically keep as string
  let user_wants_to_parse_to_most_likely_type =
    is_string
    &&
    (
      //user wants to parse strings in some way
      to_js_setup.parse_types||//likeliest type
      to_js_setup.parse_dates//a date
    )
  if(!user_wants_to_parse_to_most_likely_type){
    //Preserve value
      return value
  }
  let user_needs_to_set_up_parser=window['glon']?.parse_string==undefined
  if(user_needs_to_set_up_parser){
    let wanted_types = []
    if(to_js_setup.parse_types)wanted_types.push('types')
    if(to_js_setup.parse_dates)wanted_types.push('dates')
      //Console.error on purpose as it relates to user setup
      //(reserve errors array for errors related to data)
      console.error(
        `Include "glon.parse_string" function`+
        `to attempt converting value to likely `+
        wanted_types.join(' and ')+`. `+
        `(as per the configured preference)`
      )
      return value // can't convert as parser not setup
  }
  //Convert per user's config
	return window['glon'].parse_string.to_likely_type({
		parse_types:to_js_setup.parse_types,
		parse_dates:to_js_setup.parse_dates,
	})(value)
  }
}
function pre_process_value_if_string(x){
	return typeof x !=='string'?x
	:chain(
		x,
		unmute_escaped_normal_separator,
    //don't call remove_escapes on value
    //If value contains '\:' leave it.
    //user doesn't need to escape it string matching separator
    //in value area for any reason
    //so must have wanted it as part of the value
		when(
			to_js_setup.trim_strings,
			s=>s.trim()
		)
	)
}
function allow_any_user_fn_to_edit_value({
	key_processed,
	key_comments,
	value_comments,
  type_wish
}){return value=>{
  if(g_parsing_type_block){
    //send no type block data to any user hook function
    return value
  }
	return [
		//if user wants to use OR change value with their own fn
			typeof to_js_setup !== "undefined" &&
			typeof to_js_setup?.value_hook === 'function'
			?//call it and store any return value
			to_js_setup.value_hook({
				value,
				value_comments,
				key:key_processed,
				key_comments,
        type_wish
			})
				//if value belongs to key, give key to user too
				//so they can do `if(key===x){v=…}` etc.
			:undefined,
			value
	].find(x=>x!==undefined)	
}}
function process_value({
	value,
	value_comments,
	/*if applicable:*/
  keep_as_string,
  key_processed,
	key_comments,
	type_wish,
}){
	//pre-process
	return chain(
		value,
		pre_process_value_if_string,
		try_to_make_wanted_data_type_if_not_already(type_wish),
		if_string_and_user_wants__parse_to_most_likely(type_wish,keep_as_string),
		//value data type may have changed to applicable one
		allow_any_user_fn_to_edit_value({
			key_processed,key_comments,value_comments,type_wish
		})
	)
}
function remove_escapes(x){
	return unmute_escaped_normal_separator(x) //GLON to JS
	.replaceAll(escaped_normal_separator,normal_separator)
	.replaceAll(escaped_equals_separator,equals_separator)
}
function process_key(line){
	return chain(
		line.key.stripped,
		remove_escapes,
		when(
			to_js_setup.trim_keys,
			x=>x.trim()
		),
		function run_user_key_hook_if_any(semi_processed_key){
      if(g_parsing_type_block){
        //sends no type block data to any user hook function
        return semi_processed_key
      }
			return [
				//user supplied a key_hook function
				typeof to_js_setup.key_hook==='function'
				//send the key to user function and collect any result
				?to_js_setup.key_hook({
					key:semi_processed_key,
					comments:line.key.comments
				})
				//no user function
				:undefined,
				semi_processed_key
			]
			//if user_fn returned a string, use it as new key
			//else return initial key
			.find(x=>typeof x==='string')
		},
		when(
			to_js_setup.to_json,
			/*if key was already a digit only key
			or the user changed it to one,
			and the user wants JSON output,
			prefix the key with a temporary string
			to let property order in JSON match original input
			*/
			handle_digit_only_key(line)
		)
	)
}
function js_to_json(js){
	//TODO: find the first indented string in the data_block
  //get the string value equivalent to one indent
  //uses this string to make output indent style match user input
  //IF config didn't specify something specific
	return JSON.stringify(
		js,
		function js_types_to_glon_types(k,v){
			if(k.includes(digit_key_prefix)){
				//call FN to remove the prefix from key in the JS data
				digit_keys_to_restore.get(k)()
			}
			return Number.isNaN(v)?glon_type.nan
			:v===Infinity?glon_type.infinity//covers positive infinity
			:v===Number.NEGATIVE_INFINITY?glon_type.infinity_negative
			:v
		},
		to_js_setup.indentation_string||' '
	)
	.replace(new RegExp('\\d+'+digit_key_prefix,'g'),'')
}
// ════════════════════════════════
function get_any_sign(s){
	let end_trimmed=s.trimEnd()
	let last_visible=end_trimmed.at(-1)||""
	let has_a_sign = ['-','+','"'].includes(last_visible)
	let sign = has_a_sign?last_visible:false
	//text_before_sign same if line lacks a sign
	return sign
}
function process_as_map(lines,separator_type=": ",quote_sign) {
	let o = {}
	for(let line of lines){
    if(//tool has not pre-processed line already
    //(as it pre-processes lines that start sub-objects earlier)
    line.preprocessed===undefined){
      //extract comments, get: key,value,sign,starts_sub_object
		pre_process_map_line(line)
    }
		line.key.processed = process_key(line)
    //to avoid overwriting: get_closest_available_key_in(o)
		//VAL
    line.keep_as_string=should_keep_as_string(line,quote_sign)
		o[line.key.processed] = process_value({
			value: line.starts_sub_object
				? process_level(line,line.sign)
				:line.value.stripped,
			key_comments:line.key.comments,
			key_processed:line.key.processed,
      keep_as_string:line.keep_as_string,
			type_wish: (line.key.processed!==undefined&&
			typeof to_js_setup!=='undefined')
			?to_js_setup?.key_data_types?.[line.key.processed]
			:false,
			value_comments: line.value.comments
		}
		)
		if(o[line.key.processed]==ERROR_IN_LEVEL){
			o=ERROR_IN_LEVEL
			break
		}
	}
	return o 
}
function pre_process_map_line(line){
  //line.key = {} already setup (in get separator index step)
  line.key.comments=[]
  line.value={
    comments:[]
  }
  line.comments.forEach(comment=>{
    //console.log({comment,sep_start:line.separator.start})
      if(comment.end_index<=line.separator.start){
          line.key.comments.push(comment.text)
      }
      else {
          line.value.comments.push(comment.text)
      }
  })
  line.key.raw= line.after_bullet_with_comments_blanked
    .substring(0,line.separator.start)
    .replaceAll(unit_separator,'')
  line.value.raw = line.after_bullet_with_comments_blanked
    .substring(line.separator.end)
    .replaceAll(unit_separator,'')
  line.value.stripped =  line.after_bullet_with_comments_stripped
    .substring(line.comment_free_separator_position.end) 
  line.starts_sub_object=line?.kids?.length>0
  line.sign=line.starts_sub_object
    ?get_any_sign(line.value.stripped)
    :false
  line.value.stripped = line.sign
    ?line.value.stripped.trimEnd().slice(0,-1)
    :line.value.stripped
  line.has_text_but_should_not=
    line.starts_sub_object&&
    line.value.stripped.trim()!==''
  line.preprocessed=true
  //^ parent lines (ones that start sub objects)
  // call pre_process_map_line before to other lines
    //settings this flag saves running it twice on parent lines
return line
}
function pre_process_array_line(line){
	//process array item value and store  
  line.value={
    raw:line.after_bullet,//_with_comments_stripped
    stripped:line.after_bullet_with_comments_stripped,
    comments:line.comments.map(comment=>comment?.text)
  }  
  // at this point, line.value.stripped may contain a Sign: '+'
  line.starts_sub_object=line?.kids?.length>0
  line.sign=line.starts_sub_object
    ?get_any_sign(line.value.stripped)
    :false
  line.value.stripped = line.sign
    ?line.value.stripped.trimEnd().slice(0,-1)
    :line.value.stripped
  line.has_text_but_should_not = 
			line.value.stripped.trim()!==''&&
			line.starts_sub_object
    line.preprocessed=true
      return line
}
function should_keep_as_string(line,quote_sign){
  //parent starting the object this line belongs to had sign `"`
return quote_sign=='"'||
    //last comment on line / end of line comment == `// "`:
  line.value.comments?.at(-1)?.trim()=='"'
}
function process_as_array(lines,quote_sign) {//XXX
	//know it isn't a map
	let o = []
	for (let line of lines){
    if(//tool has not pre-processed line already
      //(as it pre-processes lines that start sub-objects earlier)
      line.preprocessed===undefined){
        //set up value,sign,starts_sub_object
        pre_process_array_line(line)
      }
		line.keep_as_string=should_keep_as_string(line,quote_sign)
		if(line.has_text_but_should_not){
			errors.push(
        `An array may hold text or start a sub object, not both:\n`+
        `"${line.after_bullet}"`
      )
			o= ERROR_IN_LEVEL
			break
		}
		o.push(
			process_value({
				value: 
					line.starts_sub_object?
						/*process child map/array and store it*/
						process_level(line,line.sign) 
					:/*line has no kids is simple value*/
					line.value.stripped,
				value_comments: line.value.comments,
        keep_as_string:line.keep_as_string
			})
		)
	}
	return o
}
function join_per_sign(a,sign){
  //console.log({a,sign})
	const joiner = {
		"-":'\n',
		"+":' '
	}[sign]
	let ac = ''
	function recurse(a,indents){
		a.forEach(function (line){
			if(
				//line has kids
				line?.kids?.length>0
			){
				//collect their content
				recurse(line.kids,indents+1)
			}
			else if(
				//line has content
				line.after_bullet.trim().length!==0
				||
				//or joining with newlines
				joiner=='\n'
			) {
				ac+=
				//only add a joiner string for items after the first
				(ac.length==0?``:joiner)+
				//indent according to level of line
				'\t'.repeat(indents)+
				//add content of line
				line.after_bullet
			}
		})
	}
	recurse(a.kids,0)
	return ac
}
function process_level(a,sign) {
	//array comes in
	if(sign&&sign!=='"'){
		//console.log(sign,a)
		return join_per_sign(a,sign) 
	}
	function is_map_like (a){
		if(!a.kids_could_form_a_map){
			return false
		}
		//check that lines which start sub-objects,
      //when stripped of comments and any signs,
      //end with a separator
		const last_i=a.length-1
		//I.E every string item at this level has separator
		return a.kids.every(function(line_in_level,i){
			if(
				//line has kids
				line_in_level?.kids?.length>0
			){
        //extract comments, and get key,value,sign,starts_sub_object
        pre_process_map_line(line_in_level)
				if(
          line_in_level.has_text_but_should_not
				){
          //as line has: text, kids,
          // and a separator (somewhere) other than the end
          //(trimmed or not)
            errors.push(`map item line starts sub object `+
              `so must end with a separator "${separator}".\n`+
              `LINE: "${line_in_level.after_bullet}"`)
            return false
        }
        else {
          //allow
          return true
        }
			}
			//if here, line in level has no kids 
      //and because 'a.kids_could_form_a_map'
      //line in level has separator somewhere
			return true
		}) 
	}
	//console.log({a,is_map_like:is_map_like(a)})
	return is_map_like(a)
		?process_as_map(a.kids,a.separator_type,sign)
		:process_as_array(a.kids,sign)
}
function truncate(max=32) {
	return s=>s.length>max?s.substring(0,max)+"…":s
}
function indented_text_to_nested_array_of_objects(a_block) {
	let lines = [] //array of 1 object per line
	let one_indent = "unknown"
	let line_number = -1
	let errors = new Set()
	let most_recent_line_at_level = {
		"-1":
			//root
			[],
	}
	const line_matcher = /([ |\t]*)(.+)(\r\n|\r|\n|$)/g
	for (
    const [line, leading_space, after_whitespace, line_end]
    of a_block.matchAll(line_matcher)
  ) {
    // const is_last_line_in_block = line_end == ''
		line_number++
		//if full line (from line start) commented out
		if (trimmed_line_equals_one_full_line_comment(line.trim())){
			continue //skip line
		}
		const current_line = {}
		lines.push(current_line) //to access this as 'previous'
		//determine value of one indent for block
		if (one_indent == `unknown` && leading_space !== "") {
			one_indent = leading_space
		}
		//count indents and any remaining whitespace
		current_line.indent_count = 0
		const remaining_leading_space =
			one_indent === "unknown"
				? ""
				: leading_space.replaceAll(one_indent, () => {
						current_line.indent_count++
						return ""
				  }).length > 0
		if (remaining_leading_space) {
			errors.add(
				`The first indented line in the block `+
        `set the block's value for one indent to: ` +
					`"${whitespace_to_words(one_indent)}". ` +
					`This line's indent doesn't match. ` +
					`It equals "${whitespace_to_words(leading_space)}":\n`+
				after_whitespace
			)
			break	//block is invalid so stop evaluating further
		}
		//check if over-indented
		const previous_line = lines[line_number - 1]
		const previous_line_exists = previous_line !== undefined
		const current_indented_over_one_level_more_than_previous =
			one_indent !== "unknown" &&
			previous_line_exists &&
			current_line.indent_count - previous_line.indent_count > 1
		if (current_indented_over_one_level_more_than_previous) {
			errors.add(`line in list over indented: ${line}`)
			break //block is invalid so stop evaluating further
		}
		const lacks_bullet = !/^[-] /.test(after_whitespace)//!/^[-+] /.
		if (lacks_bullet) {
			errors.add(
				`All lines in a GLON data block start with a bullet: ` +
				`"${bullet_normal}" `+
        //`(or optionally "${bullet_plus}" if line starts a sub object) ` +
				`This line lacks a bullet: "${truncate(32)(after_whitespace)}"`
			)
			break //block is invalid so stop evaluating further
		}
		//BUILD NESTED OBJECT
		let parent_level=current_line.indent_count - 1
		const parent = most_recent_line_at_level[parent_level]
		parent.kids ??= []
		parent.kids.push(current_line)
		most_recent_line_at_level[current_line.indent_count] = current_line
		current_line.after_bullet = 
      mute_escaped_normal_separator(after_whitespace.substring(2))
		current_line.bullet = after_whitespace.substring(0, 2)
		let current_line_is_first_in_a_level=parent.kids.length==1
    suppress_inline_comments(current_line)
		if(current_line_is_first_in_a_level){
			determine_separator_type_for_level_else_confirm_array(
        current_line,parent
      )
		}
    let could_be_a_map_item = parent.kids_could_form_a_map!==false
    if(could_be_a_map_item){
      get_line_separator_index_else_confirm_level_is_array(current_line,parent)
    }
    //If a line above this line exists,
    // ensure the line above has an allowed bullet type
		let prev_line_did_not_start_new_level=
			previous_line_exists &&
			current_line.indent_count-previous_line.indent_count!== 1
		if(
			prev_line_did_not_start_new_level&&
			previous_line.bullet!==bullet_normal
		){
			//wrong bullet for non parent line
			errors.add(
				`this line doesn't start a sub objects `+
        `so must have a normal bullet "${bullet_normal}":` + 
				previous_line.after_bullet
			)
			break
		}
		/* This setup allows processing a parent line on discovery
		let prev_line_did_start_new_level=
			previous_line_exists &&
			current_line.indent_count-previous_line.indent_count== 1
		if(prev_line_did_start_new_level){
      //previous line == a parent line (it starts a sub object)
      //only will know at this point if definitely array
      //as to determine map requires checking all parent siblings
			process_parent_line(previous_line)
		}*/
	}
	return {
		nested:most_recent_line_at_level["-1"],
		block_errors:errors
	}
}
function find_separator_position(seeking_style){
  //seeking_style == colon_separator`: `||equals_separator` = `
return s => {//s==a string with comments suppressed or stripped
	let start_index = s.indexOf(seeking_style) 
	let mid_line_lacks_separator = start_index == -1
	if (mid_line_lacks_separator) {
		if (
			//line ENDS in trimmed separator (e.g. `a:` == {a:''})
			s.endsWith(seeking_style.trimEnd())
		) {
			//accept a separator that ends the line
			return {
				//separator position
				start: s.length - seeking_style.trimEnd().length,
				end: s.length,//separator last thing in string
				type: seeking_style
			}
		}
		return false
	}
	return start_index == -1
		? false
		: {
				start: start_index,
				end: start_index + seeking_style.length,
				type: seeking_style,
			}
}
}
function find_separator_type(s){ 
	//s == string with comments suppressed
	let normal_separator_data=
		find_separator_position(normal_separator)(s)
	let equals_separator_data=
		find_separator_position(equals_separator)(s)
	let lacks_separator=
		normal_separator_data==false&&
		equals_separator_data==false
	if(lacks_separator){
    return false
  }
	let only_has_normal_separator=
		normal_separator_data!==false&&
		equals_separator_data===false
	if(only_has_normal_separator){
		return normal_separator_data
	}
	let only_has_equals_separator=
		normal_separator_data===false&&
		equals_separator_data!==false
	if(only_has_equals_separator){
		return equals_separator_data
	}
	let has_both_types=
		equals_separator_data!==false&&
		normal_separator_data!==false
	if(has_both_types){
		let earliest = Math.min(...[
			equals_separator_data.start,
			normal_separator_data.start
		])
		return earliest==equals_separator_data.start
			?equals_separator_data
			:normal_separator_data
	}
}
function determine_separator_type_for_level_else_confirm_array(line,parent){
  //console.log(line)
	line.separator= chain(
    line.after_bullet_with_comments_blanked,
    find_separator_type
  )
	//line.separator==separator type found?{start,end,type}:false
	parent.kids_could_form_a_map=line.separator!==false
		//^false immediately IF line 0 in level lacked a separator
		//^any later line, that lacks a separator, in the same level
    //^may set this to false
	//look for separator type for level
	if(parent.kids_could_form_a_map){
		parent.separator_type=line.separator.type
	}
}
function get_line_separator_index_else_confirm_level_is_array(line,parent){
	//console.log({line,parent})
  //separator data already found, separately, for line 1 in level
  //but not for later lines:
  if(line.separator===undefined){  
      //get position of separator
        //relative to line with comments still in it
        //to know if comments land before or after it (for map item)
      line.separator= chain(
        line.after_bullet_with_comments_blanked,
        find_separator_position(parent.separator_type)
      )
  }
  if(line.separator===false){
		parent.kids_could_form_a_map=false
    return
	}
  if(
    //line has a separator
    line.separator!==false
  ){
    //get:
    line.comment_free_separator_position= chain(
      line.after_bullet_with_comments_stripped,
      find_separator_position(parent.separator_type)
    )
    //setup
    line.key = {} 
    line.key.stripped = line.after_bullet_with_comments_stripped
      .substring(0,
        line.comment_free_separator_position.start
      )
    //NOTE: line.key.stripped reflects untrimmed key
    //in current implementation.
    //if key includes spaces, which the tool may trim later,
    //at this point they contribute to the key's length
    if(
      //need to check if key is short enough
      to_js_setup.max_key_length>0
    ){
      line.key_too_long = 
        line.key.stripped.length>
        to_js_setup.max_key_length
      /**
      console.log({
        untrimmed_key,
        untrimmed_key_length:untrimmed_key.length,
        line 
      })
      /**/
      if(line.key_too_long){
        parent.kids_could_form_a_map=false
        return
      }
    }
  }
}
function suppress_inline_comments(line){
//adds these properties to line object:
  // {comments,with_comments_blanked,with_comments_stripped}
//reason for FN: line comments could contain separator string
//but a separator string only occurs outside of comments
//need to ignore comment content
//A `<!-- comment: has separator -->key: val <!-- comment->`
//Z `                               key: val               `
//any separator outside of comment stays in same position
var substitute_control_character=String.fromCharCode(26)
line.comments=[]
function get_blank_string_same_length (all,comment,start_index) {
    comment = comment.trim()
    if(comment!=='')line.comments.push({
        text:comment,
        //start_index,
        end_index:start_index+all.length
    })
    //Have to use something other than unit_separator
      //As unit_separator control character
      //designated for use as temporary placeholder 
        //for escaped separators
      //SUBSTITUTE:
    return substitute_control_character.repeat(all.length)
}
line.after_bullet_with_comments_blanked= [
  inline_js_comment,
  inline_html_comment,
  rest_of_line_js_comment
]//patterns
.reduce(
  (a,comment)=>a.replace(comment,get_blank_string_same_length)
  ,line.after_bullet
)
  line.after_bullet_with_comments_stripped=
    line.after_bullet_with_comments_blanked
    .replaceAll(substitute_control_character,'')
return line
}
function glon_to_js_if_valid_else_return_input(block) {
	/*expect block (string) to hold one possible glon block
	touching lines of content, that start with dash space
	may start or end with bank lines
	*/
	const {block_errors,nested} = 
    indented_text_to_nested_array_of_objects(block)
	let has_errors=block_errors.size>0
	if(has_errors){
		errors.push(...block_errors)
		return block
	}
	let all_lines_are_comments = nested==undefined
	if(all_lines_are_comments){
		return block //return original data
	}
	let parsed = process_level(nested)
	let parsed_successfully=parsed!==ERROR_IN_LEVEL
	if(parsed_successfully){
		return parsed//GLON converted to JS
	}
	return block
}
function reduce_an_iterable ({fn,seed,then}) {
	return function (iterator) {
		//reduce for iterator but Eager, NOT lazy
		let current,
			accumulator = seed,
			control = {stop:false},
			i = 0
		while ((
				current = iterator.next(),
				!current.done &&
				!control.stop//allow early break from reducer
		)) {
			accumulator = fn(
				accumulator,
				current.value,
				i++,//increment index and send incremented to fn
				control
			) 
		}
		//when processed all items,
    //can give data returned to RELATED FN
		return typeof then==='function'?then(accumulator):accumulator
	}
}
function trimmed_line_equals_one_html_comment(trimmed){
return trimmed.startsWith('<!--')&&
		//string ends with first and only close tag
		trimmed.indexOf('-->')==trimmed.length-3
}
function trimmed_line_equals_one_js_comment(trimmed){
		return trimmed.startsWith('/*')&&
			//string ends with first and only close tag
			trimmed.indexOf('*/')==trimmed.length-2
}
function trimmed_line_equals_one_js_slash_comment(trimmed){
		return trimmed.startsWith('//')
}
function trimmed_line_equals_one_full_line_comment(trimmed_line){
return[
trimmed_line_equals_one_html_comment,
trimmed_line_equals_one_js_comment,
trimmed_line_equals_one_js_slash_comment]
.some(p=>p(trimmed_line))
}
function get_first_content_line__ignore_comment_lines(s){
	let line_matcher=/([ \t]*)(.+)(\r\n|\r|\n|$)/g
			// leading_whitespace,after_whitespace,line_end
	let first_non_full_line_comment=''
	for(const [line,leading_whitespace,after_whitespace,line_end] 
		of s.matchAll(line_matcher)){
		 //console.log(after_whitespace)
			if(!trimmed_line_equals_one_full_line_comment(after_whitespace)){
				first_non_full_line_comment=line
					break
			}
	}
	return first_non_full_line_comment
}
function process_a_block(blocks,[,block],i,control){
	//toDo:
		//if(blocks.data.length===max_blocks_wanted){}//stop early
	const possible_key_data_types_block=
		//not got key_data_types_block yet
		blocks.key_data_types===undefined&&
		//not got any data block yet
		blocks.data.length === 0 &&
		//this block looks like key_data_types_block
		//start|bullet|space|equals|anySpace|newline|indent|Bullet
		/^[-|+] =[ |\t]*\n(\s+|\t)[-|+] /.test(block)
	const possible_data_block=
		!possible_key_data_types_block&&
		//must allow that first lines may be full_line_comments:
		/^- /.test(get_first_content_line__ignore_comment_lines(block))
    ///^[-|+] / <-- bullet_plus
    //^ no leading space and first char bullet
	//process and add to list of all blocks
  if(possible_key_data_types_block){
    blocks.all.push(
      block_to_key_data_types_block_else_return_input(block)
    )
  }
  else if (possible_data_block){
    blocks.all.push(
        glon_to_js_if_valid_else_return_input(block)
    )
  }
  else{
    blocks.all.push(block)
  }
	//add to applicable list
	if(/*fn didn't change block*/
		/*newly stored*/blocks.all.at(-1)===/*original*/block){
		//is other block
		blocks.other.push(block)
	}
	else{
		if(possible_key_data_types_block){
			//for returning to user
			blocks.key_data_types =blocks.all.at(-1)
			//for parser functions to reference
			to_js_setup.key_data_types=blocks.all.at(-1)
		}
    //GLON block
		else blocks.data.push(blocks.all.at(-1))
	}
	return blocks
}
function block_to_key_data_types_block_else_return_input(block) {
  //set a flag for a later function to refer to
    //it stops the parser sending type_block data to user hooks:
  g_parsing_type_block=true
	const rv=chain(
		block
		//turn first line into regular array parent line…
		//`- =\n` → `- \n`
		.replace(/^[-|+] =[ |\t]*/,'- '),
		//log,
		glon_to_js_if_valid_else_return_input
	)[0]
	g_parsing_type_block=false//finished with flag
	//if 0===string
    //the block didn't parse as valid GLON
  let failed_to_parse=rv?.constructor?.name!=='Object'
	if(failed_to_parse)return block
	//0== {}
    //the block parsed as a valid GLON
    //glon_to_js returned a {keyName:typeWanted} object
    //all values should represent possible data types
  // All possible input values
	const data_types=[
		[`string`,'"',"'"],
		[`boolean`,'?'],
		[`float`,'.','number'],
		[`integer`,'0'],
		[`date`,'/'],
		[`array`,`,`,'list'],
		[`map`,':'],
		[`any`,'*']
	].reduce(
		function (a,x){
			x.forEach(function(z){a[z]=x[0]})
			return a
		},
		{}
	)
	let valid_key_data_types_block = true
	//convert any shorthand alias for a type to its full name
		//e.g. convert `"` or `'` to 'string'
	let key_data_types_block = Object.entries(rv).reduce((a,[k,v])=>{
		if(valid_key_data_types_block===false){
			//a prior value prevented this block from validating
        //as a key_data_types_block
			return a//stop collecting
		}
		if(typeof v!=='string'){
			valid_key_data_types_block= false//value must be string
			return a
		}
		a[k]=data_types[v.trim().toLowerCase()]
		if(a[k]===undefined){
			valid_key_data_types_block=false
			errors.push(v+' is not a data type')
			return a
		}
		return a
	},{})
	return valid_key_data_types_block
		?key_data_types_block
		:block/*initial*/
}
function extract_and_parse_blocks(text){
	return chain(
		text, 
		function make_new_line_style_consistent(x) {
			return x
			.replaceAll('\r\n','\n')
			.replaceAll('\r','\n')
		},
		function x(x){
			return x		
			//remove any empty whitespace only lines at top
			.replace(/^\n\s*\n/,'')
			//get 1 block at a time
      //(i.e. consecutive lines of content)
			.matchAll(/([^\n][^]*?)(\n[ \t]*\n+|\n[ \t]*$|$)+/g)
			//Max Blocks of any kind
      //…take()
		},
		reduce_an_iterable({
			seed:{
				//blocksObject
				all: [], //see things, processed in original order
				//key_data_types Ob gets created IF one found, 
				data: [],
				other: [],
				errors//access to global
			},
			fn:process_a_block,
			//then:function(o){return o}
		})
	)
}
function glon_to_js_fn(user_glon_to_js_config={}){
		//reset 'to_js_setup' object
		// (each time glon_to_js_fn gets called)
	const defaults=[
		//[property_name,default_value,property_type]
		[`indentation_string`, '  ', 'String'  ],
		[`trim_strings`,       false,'Boolean' ],
		[`trim_keys`,          false,'Boolean' ],
		[`parse_types`,        false,'Boolean' ],
		[`parse_dates`,        false,'Boolean' ],
		[`to_json`,            false,'Boolean' ],
		[`value_hook`,         false,'Function'],
		[`key_hook`,           false,'Function'],
		[`log`,                true, 'Boolean' ],
    [`max_key_length`,     0,'Number'  ],
		//glon text may hold key=data_type block
		//it goes here later:user does not supply it
		[`key_data_types`,     {},    `Object` ]
	]
	function apply_user_config_or_defaults_collect_errors(
		a,[property_name,default_value,accepted_data_type]
		){
		//collect all errors here, not just first
			//let errors_found_in_user_config=a.length>0
			//if(errors_found_in_user_config){return a}
		const received_value=user_glon_to_js_config[property_name]
		const received_data_type=received_value?.constructor?.name
		const received_value_invalid = 
			received_value!==undefined&&
			received_value!==false&&
			received_data_type!==accepted_data_type
		if(received_value_invalid){
			a.push(
				`Config object gives a ${received_data_type} to "${property_name}". `+
				`The "${property_name}" property accepts a ${accepted_data_type}, or the boolean false. `+
				`Omit the property from the config object to use its default value: ${default_value}`
			)
			return a
		}
		to_js_setup[property_name]=received_value??default_value
		return a
	}
	let bad_glon_to_js_config= defaults.reduce(
		apply_user_config_or_defaults_collect_errors,[]
	)
	if(bad_glon_to_js_config.length>0){
    //Console.error on purpose. It relates to user setup not glon data
		console.error(bad_glon_to_js_config)
		return bad_glon_to_js_config
	}
	return configured_glon_to_js_fn
	function configured_glon_to_js_fn(text){
		if(text===null){
			// ask for text until given
			return configured_glon_to_js_fn
		}
		errors.length=[]//clear previous
		empty_a_map(digit_keys_to_restore)//clear previous
		const blocks = extract_and_parse_blocks(text)
		//make object to populate then return
		const rv = {
			js: blocks.data,//data block as JS 
			.../*if*/to_js_setup.log && /*add*/{logs: errors},
			...to_js_setup.to_json&& {json:js_to_json(blocks.data)}
		}
		return rv
	}
}
window['glon'].extract=extract_and_parse_blocks//For testing only.
window['glon'].to_js=glon_to_js_fn
})();
/* =============================================================
                        glon.from_
                    (glon_from_other)
By + Copyright: © 2022-2025 Greg Abbott (UK)
https://gregabbott.pages.dev*/
(()=>{
	//global to namespace
	let one_indent=''
	//same across glon files
	const bullet_normal='- ',
	normal_separator=`: `,//if value same line
	escaped_normal_separator='\\: ',
	equals_separator=` = `,
	escaped_equals_separator=' \\= ',
	multi_line_sign='-'
	function js_value_to_glon(v){
    return new Map([
	//key == JS value (primitive / constant)
	//value == GLON string equivalent
	[true,`true`],
	[false,`false`],
	[null,'null'],
	[NaN,'NaN'],
	[Infinity,`infinity`],
	[Number.POSITIVE_INFINITY,'+infinity'],
	[Number.NEGATIVE_INFINITY,'-infinity']
	]).get(v)||v
}
function escape_separators(x){return x //JS to GLON
	.replaceAll(normal_separator,escaped_normal_separator)
	.replaceAll(equals_separator,escaped_equals_separator)
}
	function is_string(v){return typeof v === 'string'}
	function is_multi_line_string(x){
		return typeof x==='string'&&/\r\n|\r|\n/.test(x)
	}
	function is_object(x){return x?.constructor?.name==="Object"}
	function is_array(x){return x?.constructor?.name==="Array"}
	function is_object_or_array(x){
		return ['Object','Array'].includes(x?.constructor?.name)
	}
	function get_leading_space(x){
    return x.match(/^[ \t]+/)?.[0]||''//trimStartArea
	}
const js_to_glon={}
js_to_glon.add_any_keep_as_type_comment=v=>{
	if(
		//value of string looks exactly like a type in GLON
		is_string(v) &&
		v!==''&&
		(
			['true','false','null'].includes(v)||
			//string_matches_number_requirements(v)===true
			//dumber option:
			//parseFloat.toString looks exactly te same as input
			parseFloat(v).toString()===v
		)
	){
		//GLON would treat it as type (when parser on)
		//make line different to signify 'don't parse to type'
		return '// "' // keep_as_string
	}
	return ''
}
js_to_glon.multi_line_string=(v,depth)=>{
	const fix_returns=x=>x.replaceAll("\r\n",'\n').replaceAll("\r",'\n'),
	split_at_newline=s=>fix_returns(s).split('\n')
	let tabs =0
	return split_at_newline(v)
		.map(line=>{
			tabs =
			depth+1+
			//put any tabs that start the line before the bullet
			(get_leading_space(line).match(/\t/g)?.length||0)
			return js_to_glon.get_n_indents(tabs)+
			`${bullet_normal}${line.trimStart()}`
		})
		.join("\n")
	+'\n'
}
js_to_glon.get_n_indents=n=>one_indent.repeat(n)
js_to_glon.object=(depth)=>x=>{
	return Object.entries(x)
	.reduce((a,[k,v])=>{
		k=escape_separators(k)
		const line_start = bullet => 
		js_to_glon.get_n_indents(depth)+bullet+k+normal_separator
		if(is_object_or_array(v)){ 
			a += line_start(bullet_normal)+'\n'+
			//children
			js_to_glon[is_object(v)?'object':'array'](depth+1)(v)
		}
		else if(is_multi_line_string(v)){
			a+= line_start(bullet_normal)+multi_line_sign+`\n`+
				js_to_glon.multi_line_string(v,depth)
		}
		else{
			a+=line_start(bullet_normal)+
				js_value_to_glon(v)+
				js_to_glon.add_any_keep_as_type_comment(v)+'\n'
		}
		return a
	},
	'')
}
js_to_glon.array=(depth)=>x=>{
	return x
	.map((v, i) => {
		const indents=js_to_glon.get_n_indents(depth)
		if(is_object_or_array(v)){
			//parent
			return indents+bullet_normal+`\n` + 
			//children
			js_to_glon[is_object(v)?'object':'array'](depth+1)(v)
		}
		else if(is_multi_line_string(v)){
			return indents+bullet_normal+multi_line_sign+`\n`+
			js_to_glon.multi_line_string(v,depth)
		}
		else{
			//if first item in an array
			if(i==0){
				/*escape separators, to ensure one item has none
				this keeps the array an array in GLON
				GLON treats lines as map if all have separator*/
				if(is_string(v))v=escape_separators(v)
			}
			return indents+
			bullet_normal+
			js_value_to_glon(v)+
			js_to_glon.add_any_keep_as_type_comment(v)
		}
	})
	.join(`\n`)+`\n`
}
js_to_glon.main=({indentation_string='\t'}={})=>{
	let initial_item = true,
	configured = (js,depth=0)=>{
		if(js===undefined){return configured}
		//pass configured to action so it can call itself
		if (initial_item&&is_array(js)){
			if(!js.every(is_object_or_array)){
				js=[js]
			}
			/*
			GLON to JS outputs one array top level array.
			it represents the document.
			each object in it represents a data_block
			Get JSON input to have this same structure
			this enables back and forth conversions to match
			separate data_blocks with blank lines
			*/
			initial_item=false // processed initial item
			return js
			.reduce((a,el)=>a+=configured(el,depth)+'\n','\n')
			.trim()
		}
		const chain=(x,...l)=>l.reduce((a,c)=>c(a),x),
		fix_returns=x=>x.replaceAll("\r\n",'\n').replaceAll("\r",'\n'),
		strip_blank_lines=x=>fix_returns(x).replace(/\n+\s*\n+/g,'\n')
		return chain(
			js,
			js_to_glon[is_object(js)?'object':'array'](depth),
			strip_blank_lines
		)
	}
	return configured// ready to receive js
}
const json_to_glon=({
	indentation_string
}={})=>{
	const get_indentation_string_from_json=json=>{
		const rv = '\t',// default
		first_return = json.indexOf('\n')
		if(first_return==-1)return rv
		const second_return_i = json.indexOf('\n',first_return+1)
		if(second_return_i==-1)return rv
		//then get any leading space
		let one_indent=get_leading_space(
			//get first line that may be indented
		json.substring(first_return+1,second_return_i)
		)
		return one_indent||rv
	},
	json_to_js_replacer=(k,v)=>{
		return v==='NaN'?NaN
		:v==='infinity'?Infinity
		:v
	},
	fn=json=>{
		if(json==undefined)return fn // until receive input
		try{ 
			// this try catch block make live editor useable
			// ignores JSON.parse logs while input incomplete
			//Set global:
				one_indent=
					indentation_string||
					get_indentation_string_from_json(json)
			return js_to_glon.main({
				indentation_string:one_indent
			})(JSON.parse(json,json_to_js_replacer))
		}
		catch(e) { return e.message	}
	}
	return fn
}
window['glon'].from_json=json_to_glon
window['glon'].from_js=js_to_glon.main
})();