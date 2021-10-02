/*mjxgui v0.1.0-beta.1 | (C) Hrushikesh Vaidya | MIT License*/
class Expression{constructor(t=0){this.components=[],this.nestingDepth=t}add(t,a=this.components.length){this.components.splice(a,0,t)}remove(t=this.components.length-1){this.components.splice(t,1)}toLatex(){let t="";for(let a of this.components)t+=a.toLatex()+" ";return t}}class Block{constructor(t){this.children=[],this.parent=t}toLatex(){if(0===this.children.length)return"";let t="";for(let a of this.children)t+="string"==typeof a?a+" ":a.toLatex()+" ";return t}addChild(t,a=this.children.length){this.children.splice(a,0,t)}removeChild(t=this.children.length-1){this.children.splice(t,1)}}class Component{constructor(t=[],a=null){this.blocks=t,this.parent=a}toLatex(){return""}addBlock(t,a){this.blocks.splice(a,0,t)}removeBlock(t){this.blocks.splice(t,1)}isEmpty(){for(let t of this.blocks)if(t.children.length)return!1;return!0}}class OneBlockComponent extends Component{constructor(t){let a=new Block;super([a],t),a.parent=this}}class TwoBlockComponent extends Component{constructor(t){let a=new Block,e=new Block;super([a,e],t),a.parent=this,e.parent=this}}class ThreeBlockComponent extends Component{constructor(t){let a=new Block,e=new Block,s=new Block;super([a,e,s],t),a.parent=this,e.parent=this,s.parent=this}}class TemplateThreeBlockComponent extends ThreeBlockComponent{constructor(t,a){super(t),this.latexData=a}toLatex(){return`\\${this.latexData}_{${this.blocks[0].toLatex()}}^{${this.blocks[1].toLatex()}}{${this.blocks[2].toLatex()}}`}}class TrigonometricTwoBlockComponent extends TwoBlockComponent{constructor(t,a){super(t),this.latexData=a}toLatex(){return`\\${this.latexData}^{${this.blocks[0].toLatex()}}{${this.blocks[1].toLatex()}}`}}class TextComponent extends Component{constructor(t){let a=new Block;super([a],t),a.parent=this}toLatex(){return this.blocks[0].toLatex()}}class MJXGUISymbol extends Component{constructor(t,a){super([],t),this.latexData=a}toLatex(){return this.latexData}}class FrameBox extends OneBlockComponent{toLatex(){return`\\boxed{${this.blocks[0].toLatex()}}`}}class Limit extends TwoBlockComponent{toLatex(){return`\\lim_{${this.blocks[0].toLatex()}}{${this.blocks[1].toLatex()}}`}}class Fraction extends TwoBlockComponent{toLatex(){return`\\frac{${this.blocks[0].toLatex()}}{${this.blocks[1].toLatex()}}`}}class Subscript extends TwoBlockComponent{toLatex(){return`{${this.blocks[0].toLatex()}}_{${this.blocks[1].toLatex()}}`}}class Superscript extends TwoBlockComponent{toLatex(){return`{${this.blocks[0].toLatex()}}^{${this.blocks[1].toLatex()}}`}}class SubSupRight extends ThreeBlockComponent{toLatex(){return`{${this.blocks[0].toLatex()}}_{${this.blocks[1].toLatex()}}^{${this.blocks[2].toLatex()}}`}}class Sqrt extends OneBlockComponent{toLatex(){return`\\sqrt{${this.blocks[0].toLatex()}}`}}class NthRoot extends TwoBlockComponent{toLatex(){return`\\sqrt[${this.blocks[0].toLatex()}]{${this.blocks[1].toLatex()}}`}}const characters=new Set;for(let t of"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*(){};:'\"/?.,<>-=_+`~")characters.add(t);class Cursor{constructor(t,a){this.expression=t,this.block=null,this.component=null,this.child=-.5,this.position=-.5,this.latex="",this.display=a}addText(t){if(null===this.block){const a=new TextComponent(this.block);a.blocks[0].addChild(t),this.expression.add(a,Math.ceil(this.position)),this.child=-.5,this.position++}else{const a=new TextComponent(this.block);a.blocks[0].addChild(t),this.block.addChild(a,Math.ceil(this.child)),this.child++}}addComponent(t){null===this.block?(this.expression.add(t,Math.ceil(this.position)),this.position=Math.ceil(this.position),t instanceof MJXGUISymbol||t instanceof TextComponent?(this.block=null,this.component=null,this.position+=.5):(this.block=t.blocks[0],this.component=t),this.child=-.5):(this.block.addChild(t,Math.ceil(this.child)),t instanceof MJXGUISymbol||t instanceof TextComponent?this.child+=1:(this.component=t,this.block=t.blocks[0],this.child=-.5))}removeComponent(){if(null===this.block){let t=this.expression.components[Math.floor(this.position)];(t instanceof TextComponent||t instanceof MJXGUISymbol)&&(this.position=Math.floor(this.position),this.component=t,this.block=t.blocks[0],this.child=-.5,this.removeComponent())}else if(null===this.component.parent){for(let t=0;t<this.expression.components.length;t++)if(this.expression.components[t]===this.component){this.expression.remove(t);break}this.position-=.5,this.component=null,this.block=null,this.child=-.5}else{let t=this.component.parent;for(let a=0;a<t.children.length;a++)if(t.children[a]===this.component){t.removeChild(a),this.child=a-.5;break}this.block=t,this.component=t.parent}}keyPress(t){if(characters.has(t.key))this.addText(t.key);else if("ArrowLeft"===t.key)this.seekLeft();else if("ArrowRight"===t.key)this.seekRight();else if("Backspace"===t.key)this.backspace();else if(" "===t.key){let t=new MJXGUISymbol(this.block,"\\:\\:");this.addComponent(t),this.updateDisplay()}}seekRight(){let t=this.expression.components.length-.5;if(!(this.position>=t))if(null===this.block)this.position+=.5,this.expression.components[this.position]instanceof TextComponent||this.expression.components[this.position]instanceof MJXGUISymbol?(this.position+=.5,this.child=-.5,this.block=null,this.component=null):(this.component=this.expression.components[this.position],this.block=this.component.blocks[0],this.child=-.5);else if(this.child===this.block.children.length-.5){let t=this.component.blocks.indexOf(this.block);t===this.component.blocks.length-1?null===this.component.parent?(this.component=null,this.block=null,this.child=-.5,this.position+=.5):(this.block=this.component.parent,this.child=this.block.children.indexOf(this.component)+.5,this.component=this.block.parent):(this.block=this.component.blocks[t+1],this.child=-.5)}else{let t=this.block.children[Math.ceil(this.child)];t instanceof TextComponent||t instanceof MJXGUISymbol?this.child++:(this.component=t,this.block=this.component.blocks[0],this.child=-.5)}}seekLeft(){if(!(this.position<=-.5))if(null===this.block)this.position-=.5,this.expression.components[this.position]instanceof TextComponent||this.expression.components[this.position]instanceof MJXGUISymbol?(this.position-=.5,this.child=-.5,this.block=null,this.component=null):(this.component=this.expression.components[this.position],this.block=this.component.blocks[this.component.blocks.length-1],this.child=this.block.children.length-.5);else if(-.5===this.child){let t=this.component.blocks.indexOf(this.block);0===t?null===this.component.parent?(this.component=null,this.block=null,this.child=-.5,this.position-=.5):(this.block=this.component.parent,this.child=this.block.children.indexOf(this.component)-.5,this.component=this.block.parent):(this.block=this.component.blocks[t-1],this.child=this.block.children.length-.5)}else{let t=this.block.children[Math.floor(this.child)];t instanceof TextComponent||t instanceof MJXGUISymbol?this.child--:(this.component=t,this.block=this.component.blocks[this.component.blocks.length-1],this.child=this.block.children.length-.5)}}backspace(){if(0!==this.expression.components.length&&-.5!==this.position)if(null===this.block){let t=this.expression.components[Math.floor(this.position)];t instanceof TextComponent||t instanceof MJXGUISymbol?this.removeComponent():(this.component=t,this.block=this.component.blocks[this.component.blocks.length-1],this.child=this.block.children.length-.5,this.position=Math.floor(this.position))}else if(this.component.isEmpty())this.removeComponent();else if(this.child<=-.5){const t=this.component.blocks.indexOf(this.block);if(0===t)return;this.block=this.component.blocks[t-1],this.child=this.block.children.length-.5}else this.block.removeChild(Math.floor(this.child)),this.child--}toLatex(){let t=this.expression.toLatex();return this.latex=t,t}toDisplayLatex(){let t=new TextComponent(this.block);t.blocks[0].addChild("|");let a=new FrameBox(this.block);if(null===this.block)this.expression.add(t,Math.ceil(this.position));else{let e=this.component.blocks.indexOf(this.block);this.component.removeBlock(e),this.component.addBlock(a,e),a.blocks[0]=this.block,this.block.addChild(t,Math.ceil(this.child))}let e=this.toLatex();if(null===this.block)this.expression.remove(Math.ceil(this.position));else{let t=this.component.blocks.indexOf(a);this.component.removeBlock(t),this.component.addBlock(this.block,t),this.block.removeChild(Math.ceil(this.child))}return e}updateDisplay(){(this.display instanceof String||"string"==typeof this.display)&&(this.display=document.getElementById(this.display)),MathJax.typesetClear([this.display]),this.display.innerHTML="$$"+this.toDisplayLatex()+"$$",MathJax.typesetPromise([this.display]).then(()=>{})}}const symbolLatexMap={alpha:"\\alpha",beta:"\\beta",gamma:"\\gamma",delta:"\\delta",epsilon:"\\epsilon",zeta:"\\zeta",eta:"\\eta",theta:"\\theta",iota:"\\iota",kappa:"\\kappa",lambda:"\\lambda",mu:"\\mu",nu:"\\nu",xi:"\\xi",omicron:"\\omicron",pi:"\\pi",rho:"\\rho",sigma:"\\sigma",tau:"\\tau",upsilon:"\\upsilon",phi:"\\phi",chi:"\\chi",psi:"\\psi",omega:"\\omega",Alpha:"A",Beta:"B",Gamma:"\\Gamma",Delta:"\\Delta",Epsilon:"E",Zeta:"Z",Eta:"H",Theta:"\\Theta",Iota:"I",Kappa:"K",Lambda:"\\Lambda",Mu:"M",Nu:"N",Xi:"\\Xi",Omicron:"O",Pi:"\\Pi",Rho:"P",Sigma:"\\Sigma",Tau:"T",Upsilon:"\\Upsilon",Phi:"\\Phi",Chi:"X",Psi:"\\Psi",Omega:"\\Omega",times:"\\times",div:"\\div",centerdot:"\\cdot",plusmn:"\\pm",mnplus:"\\mp",starf:"\\star",bigcup:"\\bigcup",bigcap:"\\bigcap",cup:"\\cup",cap:"\\cap",lt:"\\lt",gt:"\\gt",leq:"\\leq",GreaterEqual:"\\geq",equals:"=",approx:"\\approx",NotEqual:"\\ne",sub:"\\subset",sup:"\\supset",sube:"\\subseteq",supe:"\\supseteq",nsub:"\\not\\subset",nsup:"\\not\\supset",nsube:"\\not\\subseteq",nsupe:"\\not\\supseteq",propto:"\\propto",parallel:"\\parallel",npar:"\\nparallel",asympeq:"\\asymp",isin:"\\in",notin:"\\notin",exist:"\\exists",nexist:"\\nexists",perp:"\\perp",Leftarrow:"\\Leftarrow",Rightarrow:"\\Rightarrow",Leftrightarrow:"\\iff",angle:"\\angle",angmsd:"\\measuredangle",rightarrow:"\\to",leftarrow:"\\gets",leftrightarrow:"\\leftrightarrow",longrightarrow:"\\longrightarrow",longleftarrow:"\\longleftarrow",longleftrightarrow:"\\longleftrightarrow",uparrow:"\\uparrow",downarrow:"\\downarrow",updownarrow:"\\updownarrow",PartialD:"\\partial",hbar:"\\hbar",real:"\\Re",nabla:"\\nabla",infin:"\\infty"},functionComponentMap={lim:Limit,sqrt:Sqrt,nsqrt:NthRoot,sub:Subscript,sup:Superscript,subsup:SubSupRight,frac:Fraction};class MJXGUI{constructor(t,a,e){this.elements=t,this.mathDelimiter=a,this.successCallback=e,this.eqnHistory=[],this.expression=new Expression,this.cursor=new Cursor(this.expression,"_mjxgui_editor_display"),(this.elements instanceof String||"string"==typeof this.elements)&&(this.elements=document.querySelectorAll(this.elements)),this.constructUI(),this.elements.forEach(t=>{t.addEventListener("click",()=>{this.editorWindow.style.display="block",this.editorWindow.dataset.visible="true"})}),document.addEventListener("keydown",t=>{"false"!==this.editorWindow.dataset.visible&&(MathJax.typesetClear([this.eqnDisplay]),this.cursor.keyPress(t),this.eqnDisplay.innerHTML=this.mathDelimiter+this.cursor.toDisplayLatex()+this.mathDelimiter,MathJax.typesetPromise([this.eqnDisplay]).then(()=>{}))});const s=this.editorWindow.querySelectorAll(".mjxgui-operator, .mjxgui-greek-letter"),i=this.editorWindow.querySelectorAll(".mjxgui-function");s.forEach(t=>{t.addEventListener("click",()=>{if(t.dataset.latexData in symbolLatexMap){let a=new MJXGUISymbol(this.cursor.block,symbolLatexMap[t.dataset.latexData]);this.cursor.addComponent(a),this.cursor.updateDisplay()}})}),i.forEach(t=>{t.addEventListener("click",()=>{let a;"null"!==t.dataset.templateType?"three"===t.dataset.templateType?a=new TemplateThreeBlockComponent(this.cursor.block,t.dataset.latexData):"trigonometric"===t.dataset.templateType&&(a=new TrigonometricTwoBlockComponent(this.cursor.block,t.dataset.latexData)):a=new functionComponentMap[t.dataset.functionId](this.cursor.block),this.cursor.addComponent(a),this.cursor.updateDisplay()})})}constructUI(){const t=document.createElement("style");document.head.appendChild(t),t.appendChild(document.createTextNode("#mjxgui_editor_window{display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background-color:#f0f0f0;border:2px solid #000;border-radius:6px;box-shadow:0 0 20px rgba(0,0,0,.3);padding:20px;min-width:280px;max-width:600px}#_mjxgui_tab_container_container{display:flex;flex-flow:row wrap}.mjxgui_tab_container{padding:5px;font-family:monospace;font-size:1.1rem;border-radius:6px;background-color:#f0f0f0;transition:background-color ease .25s;cursor:pointer;user-select:none;margin:0 10px}.mjxgui_tab_container:hover{background-color:#dcdcdc}#mjxgui_editor_controls{display:flex;flex-flow:row wrap;justify-content:space-between}#_mjxgui_editor_display{padding:10px;margin:10px;border:1px solid #000;border-radius:6px}.mjxgui_tab{padding:10px;margin-top:10px;display:none;align-items:stretch;flex-flow:row wrap}.mjxgui_tab .mjxgui-btn{background-color:#f0f0f0;transition:background-color ease .25s;cursor:pointer;margin:2px;min-width:25px;text-align:center}.mjxgui-btn:hover{background-color:#dcdcdc}.mjxgui_button_container,.mjxgui_clear_save_buttons{display:flex;flex-flow:row wrap;font-family:monospace;font-size:1.1rem;align-items:center;justify-content:center}.mjxgui_button_container{margin:0 5px;background-color:#f0f0f0;border-radius:6px;transition:background-color ease .25s;cursor:pointer;padding:5px}.mjxgui_button_container:hover{background-color:#dcdcdc}"));const a=document.createElement("div");a.id="mjxgui_editor_window",a.dataset.visible="false",a.innerHTML=`<div id="mjxgui_editor_controls"><div style="cursor: pointer;"> <svg xmlns="http://www.w3.org/2000/svg" class="mjxgui_close_button_svg" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <line x1="18" y1="6" x2="6" y2="18" /> <line x1="6" y1="6" x2="18" y2="18" /> </svg></div><div class="mjxgui_clear_save_buttons"> <span class="mjxgui_button_container" id="mjxgui_clear_equation"> <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <line x1="4" y1="7" x2="20" y2="7" /> <line x1="10" y1="11" x2="10" y2="17" /> <line x1="14" y1="11" x2="14" y2="17" /> <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /> <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /> </svg> <span>Clear Eqn</span> </span> <span class="mjxgui_button_container" id="mjxgui_save_equation"> <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-check" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <path d="M5 12l5 5l10 -10" /> </svg> <span>Done</span> </span></div></div><div id="_mjxgui_tab_container_container"><div class="mjxgui_tab_container" data-tab="1">Greek Letters</div><div class="mjxgui_tab_container" data-tab="2">Operators & Symbols</div><div class="mjxgui_tab_container" data-tab="3">Functions</div></div><div class="mjxgui_tab" style="display: flex;" data-tab="1"> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Alpha">&Alpha;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Beta">&Beta;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Gamma">&Gamma;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Delta">&Delta;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Epsilon">&Epsilon;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Zeta">&Zeta;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Eta">&Eta;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Theta">&Theta;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Iota">&Iota;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Kappa">&Kappa;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Lambda">&Lambda;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Mu">&Mu;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Nu">&Nu;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Xi">&Xi;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Omicron">&Omicron;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Pi">&Pi;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Rho">&Rho;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Sigma">&Sigma;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Tau">&Tau;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Upsilon">&Upsilon;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Phi">&Phi;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Chi">&Chi;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Psi">&Psi;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="Omega">&Omega;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="alpha">&alpha;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="beta">&beta;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="gamma">&gamma;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="delta">&delta;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="epsilon">&epsilon;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="zeta">&zeta;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="eta">&eta;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="theta">&theta;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="iota">&iota;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="kappa">&kappa;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="lambda">&lambda;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="mu">&mu;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="nu">&nu;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="xi">&xi;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="omicron">&omicron;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="pi">&pi;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="rho">&rho;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="sigma">&sigma;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="tau">&tau;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="upsilon">&upsilon;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="phi">&phi;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="chi">&chi;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="psi">&psi;</span> <span class="mjxgui-btn mjxgui-greek-letter" data-latex-data="omega">&omega;</span></div><div class="mjxgui_tab" data-tab="2"> <span class="mjxgui-btn mjxgui-operator" data-latex-data="times">&times;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="div">&div;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="centerdot">&centerdot;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="plusmn">&plusmn;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="lt">&lt;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="gt">&gt;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="leq">&leq;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="GreaterEqual">&GreaterEqual;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="equals">&equals;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="approx">&approx;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="NotEqual">&NotEqual;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="mnplus">&mnplus;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="starf">&starf;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="bigcup">&bigcup;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="bigcap">&bigcap;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="cup">&cup;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="cap">&cap;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="sub">&sub;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="sup">&sup;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="sube">&sube;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="supe">&supe;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="nsub">&nsub;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="nsup">&nsup;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="nsube">&nsube;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="nsupe">&nsupe;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="propto">&propto;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="parallel">&parallel;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="npar">&npar;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="asympeq">&asympeq;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="isin">&isin;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="notin">&notin;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="exist">&exist;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="nexist">&nexist;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="perp">&perp;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="Leftarrow">&Leftarrow;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="Rightarrow">&Rightarrow;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="Leftrightarrow">&Leftrightarrow;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="angle">&angle;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="angmsd">&angmsd;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="rightarrow">&rightarrow;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="leftarrow">&leftarrow;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="leftrightarrow">&leftrightarrow;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="longrightarrow">&longrightarrow;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="longleftarrow">&longleftarrow;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="longleftrightarrow">&longleftrightarrow;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="uparrow">&uparrow;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="downarrow">&downarrow;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="updownarrow">&updownarrow;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="PartialD">&PartialD;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="hbar">&hbar;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="real">&real;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="nabla">&nabla;</span> <span class="mjxgui-btn mjxgui-operator" data-latex-data="infin">&infin;</span></div><div class="mjxgui_tab" data-tab="3"> <span class="mjxgui-btn mjxgui-function" data-template-type="three" data-latex-data="sum">&Sigma;</span> <span class="mjxgui-btn mjxgui-function" data-template-type="three" data-latex-data="int">&int;</span> <span class="mjxgui-btn mjxgui-function" data-template-type="three" data-latex-data="iint">$ \\iint{} $</span> <span class="mjxgui-btn mjxgui-function" data-template-type="three" data-latex-data="iiint">&iiint;</span> <span class="mjxgui-btn mjxgui-function" data-template-type="three" data-latex-data="oint">&oint;</span> <span class="mjxgui-btn mjxgui-function" data-template-type="three" data-latex-data="prod">&Pi;</span> <span class="mjxgui-btn mjxgui-function" data-template-type="three" data-latex-data="coprod">&coprod;</span> <span class="mjxgui-btn mjxgui-function" data-template-type="three" data-latex-data="bigcup">&bigcup;</span> <span class="mjxgui-btn mjxgui-function" data-template-type="three" data-latex-data="bigcap">&bigcap;</span> <span class="mjxgui-btn mjxgui-function" data-template-type="three" data-latex-data="bigvee">&bigvee;</span> <span class="mjxgui-btn mjxgui-function" data-template-type="three" data-latex-data="bigwedge">&bigwedge;</span> <span class="mjxgui-btn mjxgui-function" data-template-type="null" data-function-id="lim">$ \\lim $</span> <span class="mjxgui-btn mjxgui-function" data-template-type="null" data-function-id="sqrt">$ \\sqrt{\\Box} $</span> <span class="mjxgui-btn mjxgui-function" data-template-type="null" data-function-id="nsqrt">$ \\sqrt[n]{\\Box} $</span> <span class="mjxgui-btn mjxgui-function" data-template-type="null" data-function-id="sub">$ {\\Box}_{\\Box} $</span> <span class="mjxgui-btn mjxgui-function" data-template-type="null" data-function-id="sup">$ {\\Box}^{\\Box} $</span> <span class="mjxgui-btn mjxgui-function" data-template-type="null" data-function-id="subsup">$ {\\Box}^{\\Box}_{\\Box} $</span> <span class="mjxgui-btn mjxgui-function" data-template-type="null" data-function-id="frac">$ \\frac{\\Box}{\\Box} $</span> <span class="mjxgui-btn mjxgui-function" data-template-type="trigonometric" data-latex-data="sin">$ \\sin{} $</span> <span class="mjxgui-btn mjxgui-function" data-template-type="trigonometric" data-latex-data="cos">$ \\cos{} $</span> <span class="mjxgui-btn mjxgui-function" data-template-type="trigonometric" data-latex-data="tan">$ \\tan{} $</span> <span class="mjxgui-btn mjxgui-function" data-template-type="trigonometric" data-latex-data="csc">$ \\csc{} $</span> <span class="mjxgui-btn mjxgui-function" data-template-type="trigonometric" data-latex-data="sec">$ \\sec{} $</span> <span class="mjxgui-btn mjxgui-function" data-template-type="trigonometric" data-latex-data="cot">$ \\cot{} $</span> <span class="mjxgui-btn mjxgui-function" data-template-type="trigonometric" data-latex-data="arcsin">$ \\arcsin{} $</span> <span class="mjxgui-btn mjxgui-function" data-template-type="trigonometric" data-latex-data="arccos">$ \\arccos{} $</span> <span class="mjxgui-btn mjxgui-function" data-template-type="trigonometric" data-latex-data="arctan">$ \\arctan{} $</span></div><div id="_mjxgui_editor_display">${this.mathDelimiter} | ${this.mathDelimiter}</div>`,this.editorWindow=a,this.eqnDisplay=a.querySelector("#_mjxgui_editor_display");const e=a.querySelectorAll(".mjxgui_tab_container"),s=a.querySelectorAll(".mjxgui_tab");e.forEach(t=>{t.addEventListener("click",function(){s.forEach(a=>{a.dataset.tab===t.dataset.tab?a.style.display="flex":a.removeAttribute("style")})})}),a.querySelector(".mjxgui_close_button_svg").addEventListener("click",function(){a.removeAttribute("style"),a.dataset.visible="false"}),a.querySelector("#mjxgui_clear_equation").addEventListener("click",()=>{this.clearEquation()}),a.querySelector("#mjxgui_save_equation").addEventListener("click",()=>{this.cursor.toLatex()&&this.successCallback(),a.removeAttribute("style"),a.dataset.visible="false",this.clearEquation()}),document.body.appendChild(a)}clearEquation(){this.eqnHistory.push(this.expression),this.expression=new Expression,this.cursor.expression=this.expression,this.cursor.block=null,this.cursor.component=null,this.cursor.child=-.5,this.cursor.position=-.5,this.cursor.latex="",this.cursor.updateDisplay()}}