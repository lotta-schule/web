(self.webpackChunk_lotta_schule_storybook_hubert=self.webpackChunk_lotta_schule_storybook_hubert||[]).push([[901],{"./src/buttons/LoadingButton.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,ErrorAction:()=>ErrorAction,SuccessAction:()=>SuccessAction,WithIcon:()=>WithIcon,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../../node_modules/react/index.js"),_storybook_jest__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("../../node_modules/@storybook/jest/dist/index.mjs"),_storybook_testing_library__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../../node_modules/@storybook/testing-library/dist/index.mjs"),_lotta_schule_hubert__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("../hubert/dist/index.js");function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg),value=info.value}catch(error){return void reject(error)}info.done?resolve(value):Promise.resolve(value).then(_next,_throw)}function _async_to_generator(fn){return function(){var self=this,args=arguments;return new Promise((function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}_next(void 0)}))}}function _ts_generator(thisArg,body){var f,y,t,g,_={label:0,sent:function(){if(1&t[0])throw t[1];return t[1]},trys:[],ops:[]};return g={next:verb(0),throw:verb(1),return:verb(2)},"function"==typeof Symbol&&(g[Symbol.iterator]=function(){return this}),g;function verb(n){return function(v){return function step(op){if(f)throw new TypeError("Generator is already executing.");for(;_;)try{if(f=1,y&&(t=2&op[0]?y.return:op[0]?y.throw||((t=y.return)&&t.call(y),0):y.next)&&!(t=t.call(y,op[1])).done)return t;switch(y=0,t&&(op=[2&op[0],t.value]),op[0]){case 0:case 1:t=op;break;case 4:return _.label++,{value:op[1],done:!1};case 5:_.label++,y=op[1],op=[0];continue;case 7:op=_.ops.pop(),_.trys.pop();continue;default:if(!(t=_.trys,(t=t.length>0&&t[t.length-1])||6!==op[0]&&2!==op[0])){_=0;continue}if(3===op[0]&&(!t||op[1]>t[0]&&op[1]<t[3])){_.label=op[1];break}if(6===op[0]&&_.label<t[1]){_.label=t[1],t=op;break}if(t&&_.label<t[2]){_.label=t[2],_.ops.push(op);break}t[2]&&_.ops.pop(),_.trys.pop();continue}op=body.call(thisArg,_)}catch(e){op=[6,e],y=0}finally{f=t=0}if(5&op[0])throw op[1];return{value:op[0]?op[1]:void 0,done:!0}}([n,v])}}}const __WEBPACK_DEFAULT_EXPORT__={title:"Buttons/LoadingButton",component:_lotta_schule_hubert__WEBPACK_IMPORTED_MODULE_2__.lV,argTypes:{}};var _ref,Default={args:{state:"loading",label:"save"}},WithIcon={args:{icon:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_lotta_schule_hubert__WEBPACK_IMPORTED_MODULE_2__.UJ,null),label:"save"}},SuccessAction={args:{label:"let me succeed",icon:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_lotta_schule_hubert__WEBPACK_IMPORTED_MODULE_2__.UJ,null),onAction:_async_to_generator((function(){return _ts_generator(this,(function(_state){switch(_state.label){case 0:return[4,new Promise((function(resolve){return setTimeout(resolve,500)}))];case 1:return _state.sent(),[2]}}))}))},play:(_ref=_async_to_generator((function(param){var canvasElement,screen,_;return _ts_generator(this,(function(_state){switch(_state.label){case 0:return canvasElement=param.canvasElement,screen=(0,_storybook_testing_library__WEBPACK_IMPORTED_MODULE_1__.ux)(canvasElement),_=_storybook_testing_library__WEBPACK_IMPORTED_MODULE_1__.rC.click,[4,screen.findByRole("button",{name:/let me succeed/i})];case 1:return _.apply(_storybook_testing_library__WEBPACK_IMPORTED_MODULE_1__.rC,[_state.sent()]),[4,(0,_storybook_testing_library__WEBPACK_IMPORTED_MODULE_1__.fm)((function(){(0,_storybook_jest__WEBPACK_IMPORTED_MODULE_3__.E)(screen.queryByRole("progressbar")).toBeVisible()}))];case 2:return _state.sent(),[4,(0,_storybook_testing_library__WEBPACK_IMPORTED_MODULE_1__.fm)((function(){(0,_storybook_jest__WEBPACK_IMPORTED_MODULE_3__.E)(screen.queryByRole("progressbar")).toBeNull(),(0,_storybook_jest__WEBPACK_IMPORTED_MODULE_3__.E)(screen.getByTestId("SuccessIcon")).toBeVisible()}))];case 3:return _state.sent(),[2]}}))})),function(_){return _ref.apply(this,arguments)})},ErrorAction={args:{label:"let me fail",icon:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_lotta_schule_hubert__WEBPACK_IMPORTED_MODULE_2__.UJ,null),onAction:_async_to_generator((function(){return _ts_generator(this,(function(_state){switch(_state.label){case 0:return[4,new Promise((function(resolve){return setTimeout(resolve,500)}))];case 1:throw _state.sent(),new Error("I failed")}}))}))},play:function(){var _ref=_async_to_generator((function(param){var canvasElement,screen,_;return _ts_generator(this,(function(_state){switch(_state.label){case 0:return canvasElement=param.canvasElement,screen=(0,_storybook_testing_library__WEBPACK_IMPORTED_MODULE_1__.ux)(canvasElement),_=_storybook_testing_library__WEBPACK_IMPORTED_MODULE_1__.rC.click,[4,screen.findByRole("button",{name:/let me fail/i})];case 1:return _.apply(_storybook_testing_library__WEBPACK_IMPORTED_MODULE_1__.rC,[_state.sent()]),[4,(0,_storybook_testing_library__WEBPACK_IMPORTED_MODULE_1__.fm)((function(){(0,_storybook_jest__WEBPACK_IMPORTED_MODULE_3__.E)(screen.queryByRole("progressbar")).toBeVisible()}))];case 2:return _state.sent(),[4,(0,_storybook_testing_library__WEBPACK_IMPORTED_MODULE_1__.fm)((function(){(0,_storybook_jest__WEBPACK_IMPORTED_MODULE_3__.E)(screen.queryByRole("progressbar")).toBeNull(),(0,_storybook_jest__WEBPACK_IMPORTED_MODULE_3__.E)(screen.getByTestId("ErrorIcon")).toBeVisible()}))];case 3:return _state.sent(),[2]}}))}));return function(_){return _ref.apply(this,arguments)}}()};Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"{\n  args: {\n    state: 'loading',\n    label: 'save'\n  }\n}",...Default.parameters?.docs?.source}}},WithIcon.parameters={...WithIcon.parameters,docs:{...WithIcon.parameters?.docs,source:{originalSource:"{\n  args: {\n    icon: <KeyboardArrowLeft />,\n    label: 'save'\n  }\n}",...WithIcon.parameters?.docs?.source}}},SuccessAction.parameters={...SuccessAction.parameters,docs:{...SuccessAction.parameters?.docs,source:{originalSource:"{\n  args: {\n    label: 'let me succeed',\n    icon: <KeyboardArrowLeft />,\n    onAction: async () => {\n      await new Promise(resolve => setTimeout(resolve, 500));\n    }\n  },\n  play: async ({\n    canvasElement\n  }) => {\n    const screen = within(canvasElement);\n    fireEvent.click(await screen.findByRole('button', {\n      name: /let me succeed/i\n    }));\n    await waitFor(() => {\n      expect(screen.queryByRole('progressbar')).toBeVisible();\n    });\n    await waitFor(() => {\n      expect(screen.queryByRole('progressbar')).toBeNull();\n      expect(screen.getByTestId('SuccessIcon')).toBeVisible();\n    });\n  }\n}",...SuccessAction.parameters?.docs?.source}}},ErrorAction.parameters={...ErrorAction.parameters,docs:{...ErrorAction.parameters?.docs,source:{originalSource:"{\n  args: {\n    label: 'let me fail',\n    icon: <KeyboardArrowLeft />,\n    onAction: async () => {\n      await new Promise(resolve => setTimeout(resolve, 500));\n      throw new Error('I failed');\n    }\n  },\n  play: async ({\n    canvasElement\n  }) => {\n    const screen = within(canvasElement);\n    fireEvent.click(await screen.findByRole('button', {\n      name: /let me fail/i\n    }));\n    await waitFor(() => {\n      expect(screen.queryByRole('progressbar')).toBeVisible();\n    });\n    await waitFor(() => {\n      expect(screen.queryByRole('progressbar')).toBeNull();\n      expect(screen.getByTestId('ErrorIcon')).toBeVisible();\n    });\n  }\n}",...ErrorAction.parameters?.docs?.source}}};const __namedExportsOrder=["Default","WithIcon","SuccessAction","ErrorAction"]},"?c95a":()=>{}}]);