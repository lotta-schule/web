(self.webpackChunk_lotta_schule_storybook_hubert=self.webpackChunk_lotta_schule_storybook_hubert||[]).push([[2196],{"./src/form/Checkbox.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _storybook_jest__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("../../node_modules/@storybook/jest/dist/index.mjs"),_storybook_testing_library__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("../../node_modules/@storybook/testing-library/dist/index.mjs"),_lotta_schule_hubert__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("../hubert/dist/index.js");function cov_rp9b0xigb(){var path="/home/runner/work/web/web/packages/storybook-hubert/src/form/Checkbox.stories.tsx",global=new Function("return this")(),gcv="__coverage__",coverageData={path:"/home/runner/work/web/web/packages/storybook-hubert/src/form/Checkbox.stories.tsx",statementMap:{0:{start:{line:12,column:23},end:{line:23,column:1}},1:{start:{line:17,column:19},end:{line:17,column:40}},2:{start:{line:18,column:4},end:{line:18,column:50}},3:{start:{line:19,column:4},end:{line:21,column:7}},4:{start:{line:20,column:6},end:{line:20,column:57}},5:{start:{line:24,column:0},end:{line:33,column:2}},6:{start:{line:34,column:35},end:{line:34,column:46}}},fnMap:{0:{name:"(anonymous_0)",decl:{start:{line:14,column:8},end:{line:14,column:9}},loc:{start:{line:16,column:8},end:{line:22,column:3}},line:16},1:{name:"(anonymous_1)",decl:{start:{line:19,column:18},end:{line:19,column:19}},loc:{start:{line:19,column:24},end:{line:21,column:5}},line:19}},branchMap:{},s:{0:0,1:0,2:0,3:0,4:0,5:0,6:0},f:{0:0,1:0},b:{},inputSourceMap:{version:3,file:void 0,names:[],sourceRoot:void 0,sources:[],sourcesContent:["import { StoryObj, Meta } from '@storybook/react';\nimport { expect } from '@storybook/jest';\nimport { fireEvent, waitFor, within } from '@storybook/testing-library';\nimport { Checkbox } from '@lotta-schule/hubert';\nexport default ({\n  title: 'Form/Checkbox',\n  component: Checkbox,\n  args: {\n    children: 'Yes, I accept all the evil I am forced to',\n    isDisabled: false\n  }\n} as Meta<typeof Checkbox>);\nexport const Default: StoryObj<typeof Checkbox> = {\n  args: {},\n  play: async ({\n    canvasElement\n  }) => {\n    const canvas = within(canvasElement);\n    fireEvent.click(canvas.getByRole('checkbox'));\n    await waitFor(() => {\n      expect(canvas.getByRole('checkbox')).toBeChecked();\n    });\n  }\n};\nDefault.parameters = {\n  ...Default.parameters,\n  docs: {\n    ...Default.parameters?.docs,\n    source: {\n      originalSource: \"{\\n  args: {},\\n  play: async ({\\n    canvasElement\\n  }) => {\\n    const canvas = within(canvasElement);\\n    fireEvent.click(canvas.getByRole('checkbox'));\\n    await waitFor(() => {\\n      expect(canvas.getByRole('checkbox')).toBeChecked();\\n    });\\n  }\\n}\",\n      ...Default.parameters?.docs?.source\n    }\n  }\n};"],mappings:""},_coverageSchema:"1a1c01bbd47fc00a2c39e90264f33305004495a9",hash:"02a89543699dd36ef3bb8a1e23477b425f58942a"},coverage=global[gcv]||(global[gcv]={});coverage[path]&&"02a89543699dd36ef3bb8a1e23477b425f58942a"===coverage[path].hash||(coverage[path]=coverageData);var actualCoverage=coverage[path];return cov_rp9b0xigb=function(){return actualCoverage},actualCoverage}cov_rp9b0xigb();const __WEBPACK_DEFAULT_EXPORT__={title:"Form/Checkbox",component:_lotta_schule_hubert__WEBPACK_IMPORTED_MODULE_1__.XZ,args:{children:"Yes, I accept all the evil I am forced to",isDisabled:!1}},Default=(cov_rp9b0xigb().s[0]++,{args:{},play:async({canvasElement})=>{cov_rp9b0xigb().f[0]++;const canvas=(cov_rp9b0xigb().s[1]++,(0,_storybook_testing_library__WEBPACK_IMPORTED_MODULE_0__.uh)(canvasElement));cov_rp9b0xigb().s[2]++,_storybook_testing_library__WEBPACK_IMPORTED_MODULE_0__.BX.click(canvas.getByRole("checkbox")),cov_rp9b0xigb().s[3]++,await(0,_storybook_testing_library__WEBPACK_IMPORTED_MODULE_0__.X_)((()=>{cov_rp9b0xigb().f[1]++,cov_rp9b0xigb().s[4]++,(0,_storybook_jest__WEBPACK_IMPORTED_MODULE_2__.l)(canvas.getByRole("checkbox")).toBeChecked()}))}});cov_rp9b0xigb().s[5]++,Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"{\n  args: {},\n  play: async ({\n    canvasElement\n  }) => {\n    const canvas = within(canvasElement);\n    fireEvent.click(canvas.getByRole('checkbox'));\n    await waitFor(() => {\n      expect(canvas.getByRole('checkbox')).toBeChecked();\n    });\n  }\n}",...Default.parameters?.docs?.source}}};const __namedExportsOrder=(cov_rp9b0xigb().s[6]++,["Default"])},"?c95a":()=>{}}]);