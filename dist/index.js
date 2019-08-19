var ZKeyWebappLayer = (function (exports, Vue) {
    'use strict';

    Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    (function (LayerType) {
        LayerType[LayerType["BottomToCenter"] = 0] = "BottomToCenter";
        LayerType[LayerType["Right"] = 1] = "Right";
        LayerType[LayerType["Custom"] = 3] = "Custom";
        LayerType[LayerType["Page"] = 4] = "Page";
    })(exports.LayerType || (exports.LayerType = {}));

    var script = {
        data: function () {
            return {
                show: false,
                maskShow: false,
                isTransitionLeave: false,
                transitionLeaveFunc: []
            };
        },
        computed: {
            modal: function () {
                return this.zkLayer;
            },
            compt: function () {
                if (this.modal.options.templateComponent) {
                    return this.modal.options.templateComponent;
                }
                else {
                    return this.modal.component;
                }
            },
            contentAnimation: function () {
                if (this.modal.options.type == exports.LayerType.BottomToCenter) {
                    return 'zk-modal-b-c';
                }
                else if (this.modal.options.type == exports.LayerType.Right) {
                    return 'zk-modal-r';
                }
                return '';
            },
            listeners: function () {
                return Object.assign({}, this.$listeners, this.modal.listeners);
            },
            contentCSS: function () {
                var css = {
                    'zk-modal-content': this.modal.options.type != exports.LayerType.Custom,
                    'zk-modal-center': this.modal.options.type == exports.LayerType.BottomToCenter,
                    'zk-modal-right': this.modal.options.type == exports.LayerType.Right
                };
                return css;
            }
        },
        created: function () {
        },
        methods: {
            excuteShow: function (next) {
                if (this.modal.options.hasMask)
                    this.maskShow = true;
                this.show = true;
                next();
            },
            excuteHide: function (next) {
                this.maskShow = false;
                this.show = false;
                this.addTransitionLeaveListener(function () { return next(); });
            },
            clickMask: function () {
                if (this.modal.options.maskClose) {
                    this.hide();
                }
            },
            onTransitionLeave: function () {
                this.transitionLeaveFunc.forEach(function (element) {
                    element();
                });
            },
            addTransitionLeaveListener: function (func) {
                if (this.isTransitionLeave) {
                    func();
                }
                else {
                    this.transitionLeaveFunc.push(func);
                }
            }
        },
        layerShow: function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.excuteShow(function () { return resolve(); });
            });
        },
        beforeLayerHide: function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.excuteHide(function () { return resolve(); });
            });
        }
    };

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css = "\n.zk-modal-warp {\n        left: 0;\n        top: 0;\n        width: 100%;\n        height: 0;\n        position: absoult;\n}\n.zk-modal-warp .zk-mask {\n        width: 100%;\n        height: 100%;\n        position: absolute;\n        left: 0;\n        top: 0;\n        background-color: #000000;\n        opacity: 0.5;\n        z-index: 0;\n        /* display: none; */\n}\n.zk-modal-warp .zk-modal-content {\n        background-color: #ffffff;\n        /* background-color: rebeccapurple; */\n        position: fixed;\n}\n.zk-modal-warp .zk-modal-center {\n        width: 800px;\n        height: 400px;\n        -webkit-transform: translate(-50%, -50%);\n            -ms-transform: translate(-50%, -50%);\n                transform: translate(-50%, -50%);\n        left: 50%;\n        top: 50%;\n}\n.zk-modal-warp .zk-modal-right {\n        width: 50%;\n        height: 100%;\n        right: 0;\n        top: 0;\n}\n/* 从底部弹出动画 */\n.zk-modal-warp .zk-modal-b-c-enter,\n    .zk-modal-warp .zk-modal-b-c-leave-to {\n        -webkit-transform: translate(-50%, 0);\n            -ms-transform: translate(-50%, 0);\n                transform: translate(-50%, 0);\n        left: 50%;\n        top: 100%;\n}\n.zk-modal-warp .zk-modal-b-c-enter-active,\n    .zk-modal-warp .zk-modal-b-c-leave-active {\n        -webkit-transition: all 0.7s ease-in-out;\n        transition: all 0.7s ease-in-out;\n}\n/* 从右侧弹出动画 */\n.zk-modal-warp .zk-modal-r-enter,\n    .zk-modal-warp .zk-modal-r-leave-to {\n        right: -100%;\n        top: 0;\n}\n.zk-modal-warp .zk-modal-r-enter-active,\n    .zk-modal-warp .zk-modal-r-leave-active {\n        -webkit-transition: all 0.5s ease-in-out;\n        transition: all 0.5s ease-in-out;\n}\n/* 遮罩层动画 */\n.zk-modal-warp .zk-mask-enter,\n    .zk-modal-warp .zk-mask-leave-to {\n        opacity: 0;\n}\n.zk-modal-warp .zk-mask-enter-active,\n    .zk-modal-warp .zk-mask-leave-active {\n        -webkit-transition: opacity 0.5s ease-in-out;\n        transition: opacity 0.5s ease-in-out;\n}\n.zkmodal-mask {\n    width: 100%;\n    height: 100%;\n    position: fixed;\n    left: 0;\n    top: 0;\n    background-color: #000000;\n    opacity: 0.5;\n    z-index: 0;\n    display: none;\n}\n";
    styleInject(css);

    function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
    /* server only */
    , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
      } // Vue.extend constructor export interop.


      var options = typeof script === 'function' ? script.options : script; // render functions

      if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true; // functional template

        if (isFunctionalTemplate) {
          options.functional = true;
        }
      } // scopedId


      if (scopeId) {
        options._scopeId = scopeId;
      }

      var hook;

      if (moduleIdentifier) {
        // server build
        hook = function hook(context) {
          // 2.3 injection
          context = context || // cached call
          this.$vnode && this.$vnode.ssrContext || // stateful
          this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
          // 2.2 with runInNewContext: true

          if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
            context = __VUE_SSR_CONTEXT__;
          } // inject component styles


          if (style) {
            style.call(this, createInjectorSSR(context));
          } // register component module identifier for async chunk inference


          if (context && context._registeredComponents) {
            context._registeredComponents.add(moduleIdentifier);
          }
        }; // used by ssr in case component is cached and beforeCreate
        // never gets called


        options._ssrRegister = hook;
      } else if (style) {
        hook = shadowMode ? function () {
          style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
        } : function (context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook) {
        if (options.functional) {
          // register for functional component in vue file
          var originalRender = options.render;

          options.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context);
          };
        } else {
          // inject component registration as beforeCreate hook
          var existing = options.beforeCreate;
          options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }

      return script;
    }

    var normalizeComponent_1 = normalizeComponent;

    /* script */
    const __vue_script__ = script;
    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        { staticClass: "zk-modal-warp" },
        [
          _c(
            "transition",
            {
              attrs: { name: _vm.contentAnimation },
              on: { "after-leave": _vm.onTransitionLeave }
            },
            [
              _vm.modal.options.templateComponent
                ? _c(
                    _vm.compt,
                    _vm._g(
                      {
                        directives: [
                          {
                            name: "show",
                            rawName: "v-show",
                            value: _vm.show,
                            expression: "show"
                          }
                        ],
                        tag: "div",
                        class: _vm.contentCSS,
                        style: { "z-index": _vm.modal.zIndex },
                        attrs: { "zk-layer": _vm.zkLayer, "is-template": "true" }
                      },
                      _vm.modal.listeners
                    )
                  )
                : _vm._e(),
              _vm._v(" "),
              !_vm.modal.options.templateComponent && _vm.compt
                ? _c(
                    _vm.compt,
                    _vm._g(
                      _vm._b(
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: _vm.show,
                              expression: "show"
                            }
                          ],
                          tag: "div",
                          class: _vm.contentCSS,
                          style: { "z-index": _vm.modal.zIndex },
                          attrs: { "zk-layer": _vm.zkLayer }
                        },
                        "div",
                        _vm.modal.params,
                        false
                      ),
                      _vm.listeners
                    )
                  )
                : _vm._e()
            ],
            1
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__ = [];
    __vue_render__._withStripped = true;

      /* style */
      const __vue_inject_styles__ = undefined;
      /* scoped */
      const __vue_scope_id__ = undefined;
      /* module identifier */
      const __vue_module_identifier__ = undefined;
      /* functional template */
      const __vue_is_functional_template__ = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var ModalWarp = normalizeComponent_1(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        undefined,
        undefined
      );

    var script$1 = Vue.extend({});

    var css$1 = "\n.page-template {\n    width: 800px;\n    height: 450px;\n    position: fixed;\n    left: 0;\n    top: 0;\n}\n.page-template [actual-component]{\n        width: 100%;\n        height: 100%;\n}\n";
    styleInject(css$1);

    /* script */
    const __vue_script__$1 = script$1;
    /* template */
    var __vue_render__$1 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        { staticClass: "page-template" },
        [
          _c("actual-component", {
            attrs: { modal: _vm.zkLayer, frameborder: "0" }
          })
        ],
        1
      )
    };
    var __vue_staticRenderFns__$1 = [];
    __vue_render__$1._withStripped = true;

      /* style */
      const __vue_inject_styles__$1 = undefined;
      /* scoped */
      const __vue_scope_id__$1 = undefined;
      /* module identifier */
      const __vue_module_identifier__$1 = undefined;
      /* functional template */
      const __vue_is_functional_template__$1 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var PageTemplate = normalizeComponent_1(
        { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
        __vue_inject_styles__$1,
        __vue_script__$1,
        __vue_scope_id__$1,
        __vue_is_functional_template__$1,
        __vue_module_identifier__$1,
        undefined,
        undefined
      );

    var ModalStatus;
    (function (ModalStatus) {
        ModalStatus[ModalStatus["WaitShow"] = 0] = "WaitShow";
        ModalStatus[ModalStatus["Showing"] = 1] = "Showing";
        ModalStatus[ModalStatus["WaitHide"] = 2] = "WaitHide";
        ModalStatus[ModalStatus["Hideing"] = 3] = "Hideing";
    })(ModalStatus || (ModalStatus = {}));
    var ActualComponentOpt = Vue.extend({
        name: 'ActualComponent',
        functional: true,
        render: function (h, context) {
            var modal = context.props.modal;
            if (!context.data.props)
                context.data.props = {};
            context.data.props = Object.assign(context.data.props, modal.params);
            context.data.props.zkLayer = modal;
            context.data.on = Object.assign({}, context.data.on, modal.listeners);
            context.data.attrs['actual-component'] = true;
            var tag;
            if (typeof modal.component == 'string') {
                tag = 'iframe';
                context.data.attrs['src'] = modal.component;
            }
            else {
                tag = modal.component;
            }
            return h(tag, context.data, context.children);
        },
        props: {
            modal: {
                type: Object,
                required: true
            }
        }
    });
    var ActualComponent = ActualComponentOpt;
    var modalState = Vue.observable({
        zkLayers: []
    });
    var ZkLayer = Vue.extend({
        name: 'ZkLayer',
        functional: true,
        render: function (h, ctx) {
            var zkLayers = modalState.zkLayers;
            var arr = [
                h('div', {
                    'class': 'zkmodal-mask'
                })
            ];
            zkLayers.forEach(function (item) {
                arr.push(h(ModalWarp, {
                    props: {
                        'zk-layer': item
                    },
                    key: item.code,
                    attrs: {
                        'is-modal-warp': true
                    }
                }));
            });
            return h('div', arr);
        }
    });
    var Layer = (function () {
        function Layer(component, options) {
            this.params = {};
            this.listeners = {};
            this.waitDestroy = false;
            this.readingFuncs = [];
            this._status = ModalStatus.WaitShow;
            this.code = Layer.getCode();
            this.component = component;
            if (!options)
                options = {};
            options = Object.assign(Layer.getDefaultConfig(), options);
            this.options = options;
            this._createComponent();
        }
        Layer.prototype.reusing = function (component, options) {
            this.waitDestroy = false;
            if (!options)
                options = {};
            var opt = Object.assign(Layer.getDefaultConfig(), options);
            var opt1 = this.options;
            Object.keys(opt).forEach(function (key) {
                if (key != 'templateComponent') {
                    opt1[key] = opt[key];
                }
            });
            this.component = component;
            if (typeof this.component == 'string') {
                this.setReadyed();
            }
            this.listeners = {};
        };
        Layer.prototype._createComponent = function () {
            modalState.zkLayers.push(this);
        };
        Layer.prototype.show = function (params) {
            return __awaiter(this, void 0, Promise, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this._status != ModalStatus.WaitShow)
                                return [2];
                            this._status = ModalStatus.Showing;
                            this.params = params;
                            this.zIndex = Layer.getZIndex();
                            return [4, this.ready()];
                        case 1:
                            _a.sent();
                            return [4, this.touchHook('layerShow')];
                        case 2:
                            _a.sent();
                            if (this.options.hasMask) {
                                Mask.getInstance().show(this);
                            }
                            this._status = ModalStatus.WaitHide;
                            return [2, this];
                    }
                });
            });
        };
        Layer.prototype.hide = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this._status != ModalStatus.WaitHide)
                                return [2];
                            this.readyed = false;
                            return [4, this.touchHook('beforeLayerHide')];
                        case 1:
                            _a.sent();
                            this.component = null;
                            this._status = ModalStatus.WaitShow;
                            this.waitDestroy = true;
                            Mask.getInstance().hide(this);
                            return [2];
                    }
                });
            });
        };
        Layer.prototype.touchHook = function (name) {
            return __awaiter(this, void 0, void 0, function () {
                var cOpt, tOpt, mOpt;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cOpt = this._componentInstance ? this._componentInstance.$options : null;
                            tOpt = this._templateInstance ? this._templateInstance.$options : null;
                            mOpt = this._modalWarpInstance ? this._modalWarpInstance.$options : null;
                            if (!(name == 'layerShow')) return [3, 8];
                            if (!(cOpt && cOpt.layerShow)) return [3, 2];
                            return [4, cOpt.layerShow.apply(this._componentInstance)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            if (!(tOpt && tOpt.layerShow)) return [3, 4];
                            return [4, tOpt.layerShow.apply(this._templateInstance)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            if (!(mOpt && mOpt.layerShow)) return [3, 6];
                            return [4, mOpt.layerShow.apply(this._modalWarpInstance)];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6: return [4, this.touchHook('layerShowed')];
                        case 7:
                            _a.sent();
                            return [3, 28];
                        case 8:
                            if (!(name == 'beforeLayerShow')) return [3, 15];
                            if (!(cOpt && cOpt.beforeLayerShow)) return [3, 10];
                            return [4, cOpt.beforeLayerShow.apply(this._componentInstance)];
                        case 9:
                            _a.sent();
                            _a.label = 10;
                        case 10:
                            if (!(tOpt && tOpt.beforeLayerShow)) return [3, 12];
                            return [4, tOpt.beforeLayerShow.apply(this._templateInstance)];
                        case 11:
                            _a.sent();
                            _a.label = 12;
                        case 12:
                            if (!(mOpt && mOpt.beforeLayerShow)) return [3, 14];
                            return [4, mOpt.beforeLayerShow.apply(this._modalWarpInstance)];
                        case 13:
                            _a.sent();
                            _a.label = 14;
                        case 14: return [3, 28];
                        case 15:
                            if (!(name == 'beforeLayerHide')) return [3, 22];
                            if (!(cOpt && cOpt.beforeLayerHide)) return [3, 17];
                            return [4, cOpt.beforeLayerHide.apply(this._componentInstance)];
                        case 16:
                            _a.sent();
                            _a.label = 17;
                        case 17:
                            if (!(tOpt && tOpt.beforeLayerHide)) return [3, 19];
                            return [4, tOpt.beforeLayerHide.apply(this._templateInstance)];
                        case 18:
                            _a.sent();
                            _a.label = 19;
                        case 19:
                            if (!(mOpt && mOpt.beforeLayerHide)) return [3, 21];
                            return [4, mOpt.beforeLayerHide.apply(this._modalWarpInstance)];
                        case 20:
                            _a.sent();
                            _a.label = 21;
                        case 21: return [3, 28];
                        case 22:
                            if (!(name == 'layerShowed')) return [3, 28];
                            if (!(cOpt && cOpt.layerShowed)) return [3, 24];
                            return [4, cOpt.layerShowed.apply(this._componentInstance)];
                        case 23:
                            _a.sent();
                            _a.label = 24;
                        case 24:
                            if (!(tOpt && tOpt.layerShowed)) return [3, 26];
                            return [4, tOpt.layerShowed.apply(this._templateInstance)];
                        case 25:
                            _a.sent();
                            _a.label = 26;
                        case 26:
                            if (!(mOpt && mOpt.layerShowed)) return [3, 28];
                            return [4, mOpt.layerShowed.apply(this._modalWarpInstance)];
                        case 27:
                            _a.sent();
                            _a.label = 28;
                        case 28: return [2];
                    }
                });
            });
        };
        Layer.prototype.destroy = function () {
            var array = modalState.zkLayers;
            for (var index = array.length - 1; index > -1; index--) {
                var element = array[index];
                if (element == this) {
                    array.splice(index, 1);
                    break;
                }
            }
        };
        Layer.prototype.on = function (eventName, callback) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var func = function (val) {
                    resolve(val);
                    callback && callback(val);
                };
                if (_this.listeners.hasOwnProperty(eventName)) {
                    if (typeof _this.listeners[eventName] == 'function') {
                        _this.listeners[eventName] = [];
                    }
                    _this.listeners[eventName].push(func);
                }
                else {
                    _this.listeners[eventName] = func;
                }
            });
        };
        Layer.install = function (_Vue, options) {
            if (options && options.routes) {
                this.routes = options.routes;
            }
            _Vue.component('ZkLayer', ZkLayer);
            _Vue.component('ActualComponent', ActualComponent);
            _Vue.mixin({
                props: {
                    zkLayer: Object
                },
                mounted: function () {
                    if (!this.zkLayer)
                        return;
                },
                created: function () {
                    if (!this.zkLayer)
                        return;
                    if (this.$attrs['is-template']) {
                        this.zkLayer._templateInstance = this;
                        if (typeof this.zkLayer.component == 'string') {
                            this.zkLayer.setReadyed();
                        }
                    }
                    else if (this.$attrs['is-modal-warp']) {
                        this.zkLayer._modalWarpInstance = this;
                    }
                    else {
                        this.zkLayer._componentInstance = this;
                        this.zkLayer.setReadyed();
                    }
                },
                methods: {
                    hide: function () {
                        this.zkLayer && this.zkLayer.hide();
                    }
                }
            });
        };
        Layer.create = function (component, params, options) {
            if (typeof component == 'string') {
                if (component.indexOf('/') == 0) {
                    options.templateComponent = PageTemplate;
                    var hasCompt = false;
                    for (var _i = 0, _a = Layer.routes; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (item.path == component) {
                            component = item.component;
                            hasCompt = true;
                            break;
                        }
                    }
                    if (!hasCompt) {
                        if (Layer.routes) {
                            throw Error('未设置路由来源！请在注册时设置路由配置如：Vue.use(Layer,{routes})');
                        }
                        else {
                            throw Error('未在路由中查找到相应组件,请检查页面路由配置！');
                        }
                    }
                }
                else if (component.indexOf('http') == 0) {
                    options.templateComponent = PageTemplate;
                }
            }
            var modal;
            for (var _b = 0, _c = modalState.zkLayers; _b < _c.length; _b++) {
                var item = _c[_b];
                if (item.waitDestroy) {
                    if (options && options.templateComponent) {
                        if (item.options.templateComponent == options.templateComponent) {
                            modal = item;
                            break;
                        }
                    }
                    else {
                        if (!item.options.templateComponent) {
                            modal = item;
                            break;
                        }
                    }
                }
            }
            if (!modal) {
                modal = new this(component, options);
            }
            else {
                modal.reusing(component, options);
            }
            if (modal.options.autoShow) {
                modal.show(params);
            }
            return modal;
        };
        Layer.getCode = function () {
            this.code = this.code + 1;
            return this.code;
        };
        Layer.getZIndex = function () {
            this.zIndex = this.zIndex + 2;
            return this.zIndex;
        };
        Layer.getDefaultConfig = function () {
            return {
                autoShow: true,
                type: exports.LayerType.BottomToCenter,
                hasMask: true,
                maskClose: true
            };
        };
        Layer.prototype.ready = function (func) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (_this.readyed) {
                    func && func();
                    resolve();
                }
                else {
                    _this.readingFuncs.push(function () {
                        func && func();
                        resolve();
                    });
                }
            });
        };
        Layer.prototype.setReadyed = function () {
            this.readyed = true;
            this.readingFuncs.forEach(function (func) { return func(); });
            this.readingFuncs = [];
        };
        Layer.code = 0;
        Layer.zIndex = 0;
        return Layer;
    }());
    var Mask = (function () {
        function Mask() {
            this.dom = document.querySelector('.zkmodal-mask');
        }
        Mask.prototype.show = function (modal) {
            this.dom.style.zIndex = '' + (modal.zIndex - 1);
            this.dom.style.display = 'block';
            this.dom.onclick = function () {
                modal.hide();
            };
        };
        Mask.prototype.hide = function (modal) {
            if (!modal.options.maskClose)
                return;
            var topNeedMaskModal;
            modalState.zkLayers.forEach(function (item) {
                if (modal != item && !item.waitDestroy && item.options.hasMask) {
                    if (!topNeedMaskModal) {
                        topNeedMaskModal = item;
                    }
                    else {
                        if (topNeedMaskModal.zIndex < item.zIndex) {
                            topNeedMaskModal = item;
                        }
                    }
                }
            });
            if (topNeedMaskModal) {
                this.dom.style.zIndex = '' + (topNeedMaskModal.zIndex - 1);
                this.dom.onclick = function () {
                    topNeedMaskModal.hide();
                };
            }
            else {
                this.dom.style.display = 'none';
            }
        };
        Mask.getInstance = function () {
            if (!this._instance)
                this._instance = new Mask();
            return this._instance;
        };
        return Mask;
    }());

    exports.ActualComponent = ActualComponent;
    exports.Layer = Layer;

    return exports;

}({}, Vue));
