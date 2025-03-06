function enable_tab_key(el){
  //V 2024_1106 Greg Abbott
  const get_key_code = e => e.keyCode || e.charCode || e.which,
  indent_nearest_line = (el, e) => {
    e.preventDefault()
    const start = el.selectionStart,
      line_start = el.value.lastIndexOf('\n', start - 1) + 1
    el.value = el.value.slice(0, line_start) + '\t' + el.value.slice(line_start)
    el.selectionStart = el.selectionEnd = start + 1
  },
  outdent_nearest_line = (el, e) => {
    e.preventDefault()
    const start = el.selectionStart,
      line_start = el.value.lastIndexOf('\n', start - 1) + 1
    if (el.value.slice(line_start, line_start + 1) === '\t') {
      el.value = el.value.slice(0, line_start) + el.value.slice(line_start + 1)
      el.selectionStart = el.selectionEnd = start - 1
    }
  },
  insert_str_at_position = (el, e, str) => {
    const { selectionStart: start, selectionEnd: end, scrollTop } = el
    e.preventDefault()
    el.value = el.value.slice(0, start) + str + el.value.slice(end)
    el.selectionStart = el.selectionEnd = start + str.length
    el.scrollTop = scrollTop
  }
  function unindent_nearest_tab_on_left(o, e) {
    let { selectionStart: s, selectionEnd: eS, scrollTop: sT, value } = o
    let before = value.slice(0, s), after = value.slice(eS)
    if (before.endsWith('\t')) before = before.slice(0, -1), s--
    else if (/\n[ \t]*$/.test(before)) {
      let match = before.match(/\n[ \t]*$/)
      before = before.slice(0, match.index + 1)
      s -= match[0].length - 1
    }
    o.value = before + after
    o.setSelectionRange(s, s)
    o.scrollTop = sT
    e.preventDefault()
  }
  const indent_logic = e => {
    const el = e.target
    const code = get_key_code(e)
    const cmd = e.metaKey
    const shift = e.shiftKey
    const cmd_left_bracket=cmd&&code === 219 //CMD[
    const cmd_right_bracket=cmd&&code === 221//CMD]
    const tab_only= code === 9&&!shift //TAB
    const shift_tab = code === 9&&shift//ShiftTab
    if (cmd_left_bracket)outdent_nearest_line(el, e)
    else if(cmd_right_bracket)indent_nearest_line(el, e)
    else if (tab_only) insert_str_at_position(el, e, '\t')
    else if(shift_tab) unindent_nearest_tab_on_left(el, e) 
  }
  el.addEventListener('keydown', indent_logic)
}