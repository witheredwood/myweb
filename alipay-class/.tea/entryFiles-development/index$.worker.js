/**! __CODEPLACEHOLDER_START__ */ /*[PositionForHostEntryCodeBegin]*/ /**! __CODEPLACEHOLDER_END__ */
if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');
require('./importScripts$');

      function getUserAgentInPlatformWeb() {
        return typeof navigator !== 'undefined' ? navigator.swuserAgent || navigator.userAgent || '' : '';
      }
      if(getUserAgentInPlatformWeb() && (getUserAgentInPlatformWeb().indexOf('LyraVM') > 0 || getUserAgentInPlatformWeb().indexOf('AlipayIDE') > 0) ) {
        var AFAppX = self.AFAppX.getAppContext ? self.AFAppX.getAppContext().AFAppX : self.AFAppX;
      } else {
        importScripts('https://appx/af-appx.worker.min.js');
        var AFAppX = self.AFAppX;
      }
      self.getCurrentPages = AFAppX.getCurrentPages;
      self.getApp = AFAppX.getApp;
      self.Page = AFAppX.Page;
      self.App = AFAppX.App;
      self.my = AFAppX.bridge || AFAppX.abridge;
      self.abridge = self.my;
      self.Component = AFAppX.WorkerComponent || function(){};
      self.$global = AFAppX.$global;
      self.requirePlugin = AFAppX.requirePlugin;
    

if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}



function success() {
require('../../client/app');
require('../../client/node_modules/mini-ali-ui/es/container/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../client/node_modules/mini-ali-ui/es/flex/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../client/node_modules/mini-ali-ui/es/flex/flex-item/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../client/node_modules/mini-ali-ui/es/badge/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../client/node_modules/mini-ali-ui/es/am-icon/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../client/node_modules/mini-ali-ui/es/tabs/index?hash=4a98b35daa3eee1b62960d4d5bbcbf254cbf11e3');
require('../../client/node_modules/mini-ali-ui/es/tabs/tab-content/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../client/components/appHeader/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../client/node_modules/mini-antui/es/list/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../client/node_modules/mini-antui/es/list/list-item/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../client/components/appPageFooter/appPageFooter?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../client/node_modules/mini-ali-ui/es/avatar/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../client/node_modules/mini-ali-ui/es/loading/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../client/node_modules/mini-ali-ui/es/list/index?hash=e1617a0257fb9de746f60d50b03404ad924976c9');
require('../../client/node_modules/mini-ali-ui/es/list/auto-size-img/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../client/node_modules/mini-ali-ui/es/list/list-item/index?hash=a5465b8c889360e3f854461d3ac41cf414aec633');
require('../../client/node_modules/mini-ali-ui/es/footer/index?hash=5a0c180d5ccf7c9d483dd4817cdab5489824013c');
require('../../client/node_modules/mini-ali-ui/es/title/index?hash=5a0c180d5ccf7c9d483dd4817cdab5489824013c');
require('../../client/pages/index/index?hash=95167176f0b33a95bf7bdba2ab261976e062f6db');
require('../../client/pages/my/my?hash=4461742b37659bff7ca1852651fb6a4c158878a0');
require('../../client/pages/detail/detail?hash=68c6b6627f7060e5afa7953e53d8cd0277914621');
require('../../client/pages/study/study?hash=4bb0443f43e698f130d675ac0c9cd03f1ce7059f');
require('../../client/pages/login/login?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}