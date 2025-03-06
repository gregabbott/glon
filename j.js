// By + Copyright 2022-2025 Greg Abbott (UK) v2024-09-25
const el={}
function get_by_id(x){return document.getElementById(x)}
function chain(seed,...fns){return fns.reduce((a,f)=>f(a),seed)}
const glon_textarea = get_by_id('glon_textarea')
const json_textarea = get_by_id('json_textarea')
let to_js_settings_fields=[
	...get_by_id('to_js_settings_fields')
	.getElementsByTagName('input')
]
const arrow_key_codes={
	'37':'left',
	'38':'up',
	'39':'right',
	'40':'down',
}
function get_key_code(e){return e.keyCode || e.charCode || e.which}
function strip_wiki_key_brackets(x){
  return x.replace(/\[\[([^\]]*?)\]\]*/g,'$1')
}
function strip_markdown_bold(x){
  return x.replace(/\*\*(.*?)\*\*/g, '$1')
}
function strip_wiki_value_brackets(s){
	//starts `[[` and ends `]]`, does not end ]]]
	if(/^\[\[.*?[^\]]\]\]$/.test(s)){
		let mod =s.replace('[[','').replace(']]','')
		return (mod.includes('[[')||mod.includes(']]'))?s:mod
	}
    return s
}
function convert_to_js(){
  let errors_box = document.getElementById('logs_textarea')
  let log_count_el = document.getElementById('log_count')
	//Let frontend toggle hooks
	let should_strip_key_bold=
		get_by_id('strip_key_bold').checked
	let should_strip_wiki_key_brackets=
		get_by_id('strip_wiki_key_brackets').checked
	let should_strip_wiki_value_brackets=
		get_by_id('strip_wiki_value_brackets').checked
    let log_errors_checkbox=get_by_id('log_errors')
	const should_log_errors=log_errors_checkbox.checked
  reset_logs()
	const rv = chain(
		glon_textarea.value,
		glon.to_js(to_js_settings_fields.reduce(
			(a,x)=>{
				a[x.id]=x.checked
				return a
			},
			{
        //log:should_log_errors,
       max_key_length: 60,
				to_json:true,
				value_hook:({value,key,key_comments,value_comments,type_wish})=>{
					/*if(key==="Local"){
          console.log({value,key,key_comments,value_comments,type_wish})
          }*/
          /*
					if(key_comments?.length>0||value_comments?.length>0){
						console.log(
							`value hook received`,
							{key,value,key_comments,value_comments}
						)
					}
					*/
					//example:
					if(key==`swatches`&&typeof value=='string'){
						return value.split(',').map(x=>x.trim())
					}
					if(should_strip_wiki_value_brackets){
						return strip_wiki_value_brackets(value)
					}
				},
				key_hook: ({key,comments}) => {
					/*
					if(comments.length>0){
						console.log(`key hook received`,{key,comments})
					}
					*/
					//EXAMPLE KEY HOOK
					//EG of acting on a key that meets specific conditions
					if(key.toLowerCase().includes('key hook demo')){
						return key
						.toLowerCase()
						.replace(/\[\[([^\]]*)\]\]/g, '$1')
						.replace(/\*\*([^\*]*)\*\*/g, '$1')
						.trim()
						.replaceAll(' ','_')
					}
					//example of processing keys more with user functions
					let rv=key
					if(should_strip_key_bold){
						rv=strip_markdown_bold(rv)
					}
					if(should_strip_wiki_key_brackets){
						rv=strip_wiki_key_brackets(rv)
					}
					return rv
				}
			}
		))
	)
	//Log JavaScript Object
	//console.log(rv.js)
  function reset_logs(){
    if(errors_box){
    errors_box.value=''
    }
    if(log_count_el){
    log_count_el.innerText=''
    }
  }
  //log_errors_checkbox.onchange=()=>{}
  let errors_box_holder=document.getElementById(`logs_textarea_holder`)
  if(should_log_errors){
		reset_logs()
    if(errors_box){
      if(rv.logs?.length>0){
        errors_box.value=rv.logs.join('\n')
        log_count_el.innerText=`(${rv.logs.length})`
        //errors_box_holder.open=true
      }
      else {
       // errors_box_holder.hidden=true
      }
    }
    else{
      //log normal
      //remove previous
      console.clear()
      //log new
      if(rv.logs?.length>0){
        console.log(rv.logs.length==1?rv.logs[0]:rv.logs)
      }
    }
  }
	json_textarea.value=rv.json
}
glon_textarea.onchange=e=>{
	convert_to_js()
}
glon_textarea.onkeyup=e=>{
	const pressed_arrow=e&&arrow_key_codes[get_key_code(e)]
	if(pressed_arrow)return
	convert_to_js()
}
//external script:
	enable_tab_key(json_textarea)
	enable_tab_key(glon_textarea)
json_textarea.onkeyup=()=>{
	glon_textarea.value = glon.from_json()(json_textarea.value)
}
to_js_settings_fields.forEach(el=>el.onchange=convert_to_js)
get_by_id('show_glon_text_area').checked=true
get_by_id('show_json_text_area').checked=true
function download_text_file({ name, data,ext }) {
  const blob = new Blob([data], { type: 
      ext=='json'?'application/json': 'text/plain' });
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${name}.${ext}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
function get_stamp() {
  return new Date().toISOString().replace(/[^\d]/g, '').replace(/(\d{4})/g, "$1_").substring(0, 14)
}
let button_to_save_glon = 
  document.getElementById('button_to_save_glon')
  let button_to_save_json = 
  document.getElementById('button_to_save_json')
  button_to_save_glon.onclick = () => {
      download_text_file({
        name: get_stamp() + ` glon`,
        ext:'txt',
        data: document.getElementById('glon_textarea').value
      })
    }
    button_to_save_json.onclick = () => {
      download_text_file({
        name: get_stamp() + ` json`,
        ext:'json',
        data: document.getElementById('json_textarea').value
      })
    }
function copy(string,el){
     navigator.clipboard.writeText(string)
      .then(() => {
        button_notice('Copied!')
      })
      .catch(err => {
        button_notice('Failed')
      });
      function button_notice(s){
        let init = el.innerText
        el.innerText=s
        setTimeout(()=>{
          el.innerText=init
        },1000)
      }
}
document.getElementById('button_to_copy_glon').onclick=e=>{copy(
  document.getElementById('glon_textarea').value,
  e.target)
}
document.getElementById('button_to_copy_json').onclick=e=>{copy(
  document.getElementById('json_textarea').value,
  e.target)
}