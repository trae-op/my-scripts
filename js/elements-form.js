(function(w,d,nameObj){var elemSelect;function getCoords(elem,p){var box=elem.getBoundingClientRect(),body=d.body,docEl=d.documentElement,scrollTop=w.pageYOffset||docEl.scrollTop||body.scrollTop,scrollLeft=w.pageXOffset||docEl.scrollLeft||body.scrollLeft,clientTop=docEl.clientTop||body.clientTop||0,clientLeft=docEl.clientLeft||body.clientLeft||0,top=box.top+scrollTop-clientTop,left=box.left+scrollLeft-clientLeft;if(p=='top')return Math.round(top);else if(p=='left')return Math.round(left)}function outputText(e,text){if(e.textContent===undefined)e.innerHTML=text;else e.textContent=text}function nullUndElem(e){return e!==null||e!==undefined}function events(e,ev,anons){if(nullUndElem(e)){if(e.addEventListener)e.addEventListener(ev,anons,false);else e.attachEvent(ev,anons)}}function classElem(e,ev,anons){for(var i=0;i<e.length;i++){if(ev!==undefined&&anons!==undefined&&typeof anons==='function')events(e[i],ev,anons);else if(ev!==undefined&&typeof ev==='function'&&anons===undefined)ev(e[i],i)}}function regVar(p){return new RegExp('(^|\\s)'+p+'(\\s|$)','g')}function addClassName(e,name){if(nullUndElem(e)){if(e.classList!==undefined)e.classList.add(name);else{if(!regVar(name).test(e.className))e.className+=' '+name}}}function remClassName(e,name){if(nullUndElem(e)){if(e.classList!==undefined)e.classList.remove(name);else{if(regVar(name).test(e.className))e.className=e.className.replace(regVar(name),' ')}}}function styleElement(e,v){if(nullUndElem(e)){if(w.getComputedStyle(e)!==undefined)return w.getComputedStyle(e).getPropertyValue(v);else console.log('not getComputedStyle: '+e)}}function showHide(e,n){if(n===1){if(styleElement(e,'display')==='none')e.style.display='block'}if(n===0){if(styleElement(e,'display')==='block')e.style.display='none'}}function activeElemForm(e,obj,i,v){var inp=e.children[0],type=inp.type,j,valEvent=true;elemSelect=inp;switch(type){case'radio':classElem(obj.element,function(e){remClassName(e,obj.classActive)});inp.checked=true;addClassName(e,obj.classActive);break;case'checkbox':if(inp.checked===true){inp.checked=false;remClassName(e,obj.classActive)}else if(inp.checked===false){inp.checked=true;addClassName(e,obj.classActive)}break;case'select-one':if(e.children[1]!==undefined)outputText(d.getElementById('val-sel'+i),e.children[0].value);if(v==undefined){var list='';e.innerHTML+='<div id="val-sel'+i+'" class="value-select">'+e.children[0].value+'</div><ul id="list-select'+i+'" class="list-select"></ul>';for(j=0;j<=e.children[0].length;j++){var lj=e.children[0].options[j];if(lj!==undefined)list+='<li id="list-select'+i+j+'" '+(lj.selected==true&&obj.activeElement?'class="'+(obj.activeElement)+'"':'')+' onmousedown="'+nameObj+'.thisListSelect('+i+','+j+',\''+(lj.text)+'\',\''+(obj.addClassHover||false)+'\',\''+(obj.activeElement||false)+'\');">'+(lj.text)+'</li>'}d.getElementById('list-select'+i).innerHTML=list}else if(v!==undefined&&v===true){var all_list=d.getElementById('list-select'+i);classElem(d.getElementsByClassName('list-select'),function(e){showHide(e,0);all_list.style.zIndex=0});d.body.onmousedown=function(event){if(valEvent===true){valEvent=false;showHide(all_list,0);all_list.style.zIndex=0}};showHide(all_list,1);all_list.style.zIndex=1;var heightAll_list=getCoords(all_list,'top')+parseInt(styleElement(all_list,'height'));if(heightAll_list>window.innerHeight){all_list.style.top='auto';all_list.style.bottom='100%'}else{all_list.style.top='100%';all_list.style.bottom='auto'}}break;default:console.log('not type!')}}w._elementForm={start:function(obj){classElem(obj.element,function(e,i){var inp=e.children[0];if(inp.type=='checkbox'){if(obj.checkbox!==undefined){if(obj.checkbox===true)inp.checked=false;if(obj.checkbox===false)inp.checked=true}}if(inp.type=='radio'){if(obj.radio!==undefined){if(obj.radio===true)inp.checked=false;if(obj.radio===false)inp.checked=true}}activeElemForm(e,obj,i);if(obj.addClassHover!==undefined)addClassName(e,obj.addClassHover);else{e.onclick=function(){activeElemForm(this,obj,i,true)};if(e.children[0].type==='select-one')e.onmousedown=function(event){Event=Event||window.Event;Event.prototype.stopPropagation=Event.prototype.stopPropagation||function(){this.cancelBubble=true}}}})},thisListSelect:function(i,j,val,valueClass,active){elemSelect.options[elemSelect.selectedIndex].value=val;var li=d.getElementById('val-sel'+i);outputText(li,val);var all_list=d.getElementById('list-select'+i);if(active!==false){classElem(all_list.children,function(e){remClassName(e,active)});addClassName(d.getElementById('list-select'+i+j),active)}if(valueClass===false){showHide(all_list,0);all_list.style.zIndex=0}}}})(window,document,'_elementForm');