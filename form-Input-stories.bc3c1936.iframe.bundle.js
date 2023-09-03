(self.webpackChunk_lotta_schule_storybook_hubert=self.webpackChunk_lotta_schule_storybook_hubert||[]).push([[1725],{"./src/form/Input.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,Inline:()=>Inline,Multiline:()=>Multiline,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _storybook_testing_library__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../../node_modules/@storybook/testing-library/dist/index.mjs"),_storybook_jest__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("../../node_modules/@storybook/jest/dist/index.mjs"),_lotta_schule_hubert__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../hubert/dist/index.js");function cov_2hubcxog6d(){var path="/Users/arinaldoni/development/lotta/lotta/packages/storybook-hubert/src/form/Input.stories.tsx",global=new Function("return this")(),gcv="__coverage__",coverage=global[gcv]||(global[gcv]={});coverage[path]&&"f93ac5788d6c495b26b30d191bf31c441041a54d"===coverage[path].hash||(coverage[path]={path:"/Users/arinaldoni/development/lotta/lotta/packages/storybook-hubert/src/form/Input.stories.tsx",statementMap:{0:{start:{line:9,column:23},end:{line:24,column:1}},1:{start:{line:16,column:22},end:{line:18,column:6}},2:{start:{line:19,column:19},end:{line:19,column:40}},3:{start:{line:20,column:4},end:{line:20,column:55}},4:{start:{line:21,column:4},end:{line:21,column:44}},5:{start:{line:22,column:4},end:{line:22,column:67}},6:{start:{line:25,column:22},end:{line:30,column:1}},7:{start:{line:31,column:25},end:{line:47,column:1}},8:{start:{line:39,column:22},end:{line:41,column:6}},9:{start:{line:42,column:19},end:{line:42,column:40}},10:{start:{line:43,column:4},end:{line:43,column:55}},11:{start:{line:44,column:4},end:{line:44,column:58}},12:{start:{line:45,column:4},end:{line:45,column:81}},13:{start:{line:48,column:0},end:{line:57,column:2}},14:{start:{line:58,column:0},end:{line:67,column:2}},15:{start:{line:68,column:0},end:{line:77,column:2}},16:{start:{line:78,column:35},end:{line:78,column:69}}},fnMap:{0:{name:"(anonymous_0)",decl:{start:{line:13,column:8},end:{line:13,column:9}},loc:{start:{line:15,column:8},end:{line:23,column:3}},line:15},1:{name:"(anonymous_1)",decl:{start:{line:36,column:8},end:{line:36,column:9}},loc:{start:{line:38,column:8},end:{line:46,column:3}},line:38}},branchMap:{},s:{0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:0,16:0},f:{0:0,1:0},b:{},inputSourceMap:{version:3,names:[],sources:[],sourcesContent:["import { StoryObj, Meta } from '@storybook/react';\nimport { userEvent, within } from '@storybook/testing-library';\nimport { expect } from '@storybook/jest';\nimport { Input } from '@lotta-schule/hubert';\nexport default ({\n  title: 'Form/Input',\n  component: Input,\n  argTypes: {}\n} as Meta<typeof Input>);\nexport const Default: StoryObj<typeof Input> = {\n  args: {\n    placeholder: 'Please type something interesting ...'\n  },\n  play: async ({\n    canvasElement\n  }) => {\n    const fireEvent = userEvent.setup({\n      delay: 100\n    });\n    const canvas = within(canvasElement);\n    await fireEvent.click(canvas.getByRole('textbox'));\n    await fireEvent.keyboard('sample text');\n    expect(canvas.getByRole('textbox')).toHaveValue('sample text');\n  }\n};\nexport const Inline: StoryObj<typeof Input> = {\n  args: {\n    ...Default.args,\n    inline: true\n  }\n};\nexport const Multiline: StoryObj<typeof Input> = {\n  args: ({\n    ...Default.args,\n    multiline: true\n  } as any),\n  play: async ({\n    canvasElement\n  }) => {\n    const fireEvent = userEvent.setup({\n      delay: 100\n    });\n    const canvas = within(canvasElement);\n    await fireEvent.click(canvas.getByRole('textbox'));\n    await fireEvent.keyboard('sample text\\nwith newline');\n    expect(canvas.getByRole('textbox')).toHaveValue('sample text\\nwith newline');\n  }\n};\nDefault.parameters = {\n  ...Default.parameters,\n  docs: {\n    ...Default.parameters?.docs,\n    source: {\n      originalSource: \"{\\n  args: {\\n    placeholder: 'Please type something interesting ...'\\n  },\\n  play: async ({\\n    canvasElement\\n  }) => {\\n    const fireEvent = userEvent.setup({\\n      delay: 100\\n    });\\n    const canvas = within(canvasElement);\\n    await fireEvent.click(canvas.getByRole('textbox'));\\n    await fireEvent.keyboard('sample text');\\n    expect(canvas.getByRole('textbox')).toHaveValue('sample text');\\n  }\\n}\",\n      ...Default.parameters?.docs?.source\n    }\n  }\n};\nInline.parameters = {\n  ...Inline.parameters,\n  docs: {\n    ...Inline.parameters?.docs,\n    source: {\n      originalSource: \"{\\n  args: {\\n    ...Default.args,\\n    inline: true\\n  }\\n}\",\n      ...Inline.parameters?.docs?.source\n    }\n  }\n};\nMultiline.parameters = {\n  ...Multiline.parameters,\n  docs: {\n    ...Multiline.parameters?.docs,\n    source: {\n      originalSource: \"{\\n  args: ({\\n    ...Default.args,\\n    multiline: true\\n  } as any),\\n  play: async ({\\n    canvasElement\\n  }) => {\\n    const fireEvent = userEvent.setup({\\n      delay: 100\\n    });\\n    const canvas = within(canvasElement);\\n    await fireEvent.click(canvas.getByRole('textbox'));\\n    await fireEvent.keyboard('sample text\\\\nwith newline');\\n    expect(canvas.getByRole('textbox')).toHaveValue('sample text\\\\nwith newline');\\n  }\\n}\",\n      ...Multiline.parameters?.docs?.source\n    }\n  }\n};"],mappings:""},_coverageSchema:"1a1c01bbd47fc00a2c39e90264f33305004495a9",hash:"f93ac5788d6c495b26b30d191bf31c441041a54d"});var actualCoverage=coverage[path];return cov_2hubcxog6d=function(){return actualCoverage},actualCoverage}cov_2hubcxog6d();const __WEBPACK_DEFAULT_EXPORT__={title:"Form/Input",component:_lotta_schule_hubert__WEBPACK_IMPORTED_MODULE_1__.II,argTypes:{}},Default=(cov_2hubcxog6d().s[0]++,{args:{placeholder:"Please type something interesting ..."},play:async({canvasElement})=>{cov_2hubcxog6d().f[0]++;const fireEvent=(cov_2hubcxog6d().s[1]++,_storybook_testing_library__WEBPACK_IMPORTED_MODULE_0__.mV.setup({delay:100})),canvas=(cov_2hubcxog6d().s[2]++,(0,_storybook_testing_library__WEBPACK_IMPORTED_MODULE_0__.uh)(canvasElement));cov_2hubcxog6d().s[3]++,await fireEvent.click(canvas.getByRole("textbox")),cov_2hubcxog6d().s[4]++,await fireEvent.keyboard("sample text"),cov_2hubcxog6d().s[5]++,(0,_storybook_jest__WEBPACK_IMPORTED_MODULE_2__.l)(canvas.getByRole("textbox")).toHaveValue("sample text")}}),Inline=(cov_2hubcxog6d().s[6]++,{args:{...Default.args,inline:!0}}),Multiline=(cov_2hubcxog6d().s[7]++,{args:{...Default.args,multiline:!0},play:async({canvasElement})=>{cov_2hubcxog6d().f[1]++;const fireEvent=(cov_2hubcxog6d().s[8]++,_storybook_testing_library__WEBPACK_IMPORTED_MODULE_0__.mV.setup({delay:100})),canvas=(cov_2hubcxog6d().s[9]++,(0,_storybook_testing_library__WEBPACK_IMPORTED_MODULE_0__.uh)(canvasElement));cov_2hubcxog6d().s[10]++,await fireEvent.click(canvas.getByRole("textbox")),cov_2hubcxog6d().s[11]++,await fireEvent.keyboard("sample text\nwith newline"),cov_2hubcxog6d().s[12]++,(0,_storybook_jest__WEBPACK_IMPORTED_MODULE_2__.l)(canvas.getByRole("textbox")).toHaveValue("sample text\nwith newline")}});cov_2hubcxog6d().s[13]++,Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"{\n  args: {\n    placeholder: 'Please type something interesting ...'\n  },\n  play: async ({\n    canvasElement\n  }) => {\n    const fireEvent = userEvent.setup({\n      delay: 100\n    });\n    const canvas = within(canvasElement);\n    await fireEvent.click(canvas.getByRole('textbox'));\n    await fireEvent.keyboard('sample text');\n    expect(canvas.getByRole('textbox')).toHaveValue('sample text');\n  }\n}",...Default.parameters?.docs?.source}}},cov_2hubcxog6d().s[14]++,Inline.parameters={...Inline.parameters,docs:{...Inline.parameters?.docs,source:{originalSource:"{\n  args: {\n    ...Default.args,\n    inline: true\n  }\n}",...Inline.parameters?.docs?.source}}},cov_2hubcxog6d().s[15]++,Multiline.parameters={...Multiline.parameters,docs:{...Multiline.parameters?.docs,source:{originalSource:"{\n  args: ({\n    ...Default.args,\n    multiline: true\n  } as any),\n  play: async ({\n    canvasElement\n  }) => {\n    const fireEvent = userEvent.setup({\n      delay: 100\n    });\n    const canvas = within(canvasElement);\n    await fireEvent.click(canvas.getByRole('textbox'));\n    await fireEvent.keyboard('sample text\\nwith newline');\n    expect(canvas.getByRole('textbox')).toHaveValue('sample text\\nwith newline');\n  }\n}",...Multiline.parameters?.docs?.source}}};const __namedExportsOrder=(cov_2hubcxog6d().s[16]++,["Default","Inline","Multiline"])},"?c95a":()=>{}}]);