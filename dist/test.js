(function (Vue) {
    'use strict';

    Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

    var LayerType;
    (function (LayerType) {
        LayerType[LayerType["BottomToCenter"] = 0] = "BottomToCenter";
        LayerType[LayerType["Right"] = 1] = "Right";
        LayerType[LayerType["Custom"] = 3] = "Custom";
    })(LayerType || (LayerType = {}));

    var script = {
        data() {
            return {
                show: false,
                maskShow: false,
                isTransitionLeave: false,
                transitionLeaveFunc: []
            };
        },
        computed: {
            modal() {
                return this.zkLayer;
            },
            compt() {
                if (this.modal.options.templateComponent) {
                    return this.modal.options.templateComponent;
                }
                else {
                    return this.modal.component;
                }
            },
            contentAnimation() {
                if (this.modal.options.type == LayerType.BottomToCenter) {
                    return 'zk-modal-b-c';
                }
                else if (this.modal.options.type == LayerType.Right) {
                    return 'zk-modal-r';
                }
                return '';
            },
            listeners() {
                return Object.assign({}, this.$listeners, this.modal.listeners);
            },
            contentCSS() {
                let css = {
                    'zk-modal-content': this.modal.options.type != LayerType.Custom,
                    'zk-modal-center': this.modal.options.type == LayerType.BottomToCenter,
                    'zk-modal-right': this.modal.options.type == LayerType.Right
                };
                return css;
            }
        },
        created() {
        },
        methods: {
            excuteShow(next) {
                if (this.modal.options.hasMask)
                    this.maskShow = true;
                this.show = true;
                next();
            },
            excuteHide(next) {
                this.maskShow = false;
                this.show = false;
                this.addTransitionLeaveListener(() => next());
            },
            clickMask() {
                if (this.modal.options.maskClose) {
                    this.hide();
                }
            },
            onTransitionLeave() {
                this.transitionLeaveFunc.forEach(element => {
                    element();
                });
            },
            addTransitionLeaveListener(func) {
                if (this.isTransitionLeave) {
                    func();
                }
                else {
                    this.transitionLeaveFunc.push(func);
                }
            }
        },
        layerShow() {
            return new Promise((resolve, reject) => {
                this.excuteShow(() => resolve());
            });
        },
        beforeLayerHide() {
            return new Promise((resolve, reject) => {
                this.excuteHide(() => resolve());
            });
        }
    };

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
        ModalStatus[ModalStatus["WaitDestroy"] = 0] = "WaitDestroy";
        ModalStatus[ModalStatus["Readying"] = 1] = "Readying";
        ModalStatus[ModalStatus["WaitShow"] = 2] = "WaitShow";
        ModalStatus[ModalStatus["Showing"] = 3] = "Showing";
        ModalStatus[ModalStatus["WaitHide"] = 4] = "WaitHide";
        ModalStatus[ModalStatus["Hideing"] = 5] = "Hideing";
    })(ModalStatus || (ModalStatus = {}));
    const ActualComponentOpt = Vue.extend({
        name: 'ActualComponent',
        functional: true,
        render: function (h, context) {
            let modal = context.props.modal;
            if (!context.data.props)
                context.data.props = {};
            context.data.props = Object.assign(context.data.props, modal.params);
            context.data.props.zkLayer = modal;
            context.data.on = Object.assign({}, context.data.on, modal.listeners);
            context.data.attrs['actual-component'] = true;
            let tag;
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
    const ActualComponent = ActualComponentOpt;
    const modalState = Vue.observable({
        zkLayers: []
    });
    const ZkLayer = Vue.extend({
        name: 'ZkLayer',
        functional: true,
        render: function (h, ctx) {
            let zkLayers = modalState.zkLayers;
            let arr = [
                h('div', {
                    attrs: {
                        id: 'zk-layer-mask'
                    }
                })
            ];
            zkLayers.forEach(item => {
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
    class Layer {
        constructor(component, options) {
            this.params = {};
            this.listeners = {};
            this.readingFuncs = [];
            this.status = ModalStatus.Readying;
            this.code = Layer.getCode();
            this.component = component;
            if (!options)
                options = {};
            options = Object.assign(Layer.getDefaultConfig(), options);
            this.options = options;
            this._createComponent();
        }
        reusing(component, options) {
            this.status = ModalStatus.Readying;
            if (!options)
                options = {};
            let opt = Object.assign(Layer.getDefaultConfig(), options);
            const opt1 = this.options;
            Object.keys(opt).forEach((key) => {
                if (key != 'templateComponent') {
                    opt1[key] = opt[key];
                }
            });
            this.component = component;
            if (typeof this.component == 'string') {
                this.setReadyed();
            }
            this.listeners = {};
        }
        _createComponent() {
            modalState.zkLayers.push(this);
        }
        async show(params) {
            if (this.status == ModalStatus.Showing)
                return;
            this.status = ModalStatus.Showing;
            this.params = params;
            this.zIndex = Layer.getZIndex();
            if (this.options.hasMask) {
                Mask.getInstance().show(this);
            }
            await this.ready();
            try {
                await this.touchHook('layerShow');
            }
            catch (error) {
                Mask.getInstance().hide(this);
                this.status = ModalStatus.WaitShow;
                throw error;
            }
            this.status = ModalStatus.WaitHide;
            return this;
        }
        async hide() {
            if (this.status != ModalStatus.WaitHide)
                return;
            this.status = ModalStatus.Hideing;
            Mask.getInstance().hide(this);
            await this.touchHook('beforeLayerHide');
            this.component = null;
            this.status = ModalStatus.WaitDestroy;
        }
        async touchHook(name) {
            const cOpt = this._componentInstance ? this._componentInstance.$options : null;
            const tOpt = this._templateInstance ? this._templateInstance.$options : null;
            const mOpt = this._modalWarpInstance ? this._modalWarpInstance.$options : null;
            if (name == 'layerShow') {
                if (cOpt && cOpt.layerShow) {
                    await cOpt.layerShow.apply(this._componentInstance);
                }
                if (tOpt && tOpt.layerShow) {
                    await tOpt.layerShow.apply(this._templateInstance);
                }
                if (mOpt && mOpt.layerShow) {
                    await mOpt.layerShow.apply(this._modalWarpInstance);
                }
                await this.touchHook('layerShowed');
            }
            else if (name == 'beforeLayerShow') {
                if (cOpt && cOpt.beforeLayerShow) {
                    await cOpt.beforeLayerShow.apply(this._componentInstance);
                }
                if (tOpt && tOpt.beforeLayerShow) {
                    await tOpt.beforeLayerShow.apply(this._templateInstance);
                }
                if (mOpt && mOpt.beforeLayerShow) {
                    await mOpt.beforeLayerShow.apply(this._modalWarpInstance);
                }
            }
            else if (name == 'beforeLayerHide') {
                if (cOpt && cOpt.beforeLayerHide) {
                    await cOpt.beforeLayerHide.apply(this._componentInstance);
                }
                if (tOpt && tOpt.beforeLayerHide) {
                    await tOpt.beforeLayerHide.apply(this._templateInstance);
                }
                if (mOpt && mOpt.beforeLayerHide) {
                    await mOpt.beforeLayerHide.apply(this._modalWarpInstance);
                }
            }
            else if (name == 'layerShowed') {
                if (cOpt && cOpt.layerShowed) {
                    await cOpt.layerShowed.apply(this._componentInstance);
                }
                if (tOpt && tOpt.layerShowed) {
                    await tOpt.layerShowed.apply(this._templateInstance);
                }
                if (mOpt && mOpt.layerShowed) {
                    await mOpt.layerShowed.apply(this._modalWarpInstance);
                }
            }
        }
        destroy() {
            let array = modalState.zkLayers;
            for (let index = array.length - 1; index > -1; index--) {
                const element = array[index];
                if (element == this) {
                    array.splice(index, 1);
                    break;
                }
            }
        }
        on(eventName, callback) {
            return new Promise((resolve, reject) => {
                let func = function (val) {
                    resolve(val);
                    callback && callback(val);
                };
                if (this.listeners.hasOwnProperty(eventName)) {
                    if (typeof this.listeners[eventName] == 'function') {
                        this.listeners[eventName] = [];
                    }
                    this.listeners[eventName].push(func);
                }
                else {
                    this.listeners[eventName] = func;
                }
            });
        }
        static install(_Vue, options) {
            if (options && options.routes) {
                this.routes = options.routes;
            }
            _Vue.component('ZkLayer', ZkLayer);
            _Vue.component('ActualComponent', ActualComponent);
            _Vue.mixin({
                props: {
                    zkLayer: Object
                },
                mounted() {
                    if (!this.zkLayer)
                        return;
                },
                created() {
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
                    hide() {
                        this.zkLayer && this.zkLayer.hide();
                    }
                }
            });
        }
        static create(component, params, options) {
            if (typeof component == 'string') {
                if (component.indexOf('/') == 0) {
                    if (!options.templateComponent)
                        options.templateComponent = PageTemplate;
                    let hasCompt = false;
                    for (const item of Layer.routes) {
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
                else if (component.indexOf('http://') == 0 || component.indexOf('https://') == 0) {
                    if (!options.templateComponent)
                        options.templateComponent = PageTemplate;
                }
            }
            let modal;
            for (const item of modalState.zkLayers) {
                if (item.status == ModalStatus.WaitDestroy) {
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
        }
        static getCode() {
            this.code = this.code + 1;
            return this.code;
        }
        static getZIndex() {
            this.zIndex = this.zIndex + 2;
            return this.zIndex;
        }
        static getDefaultConfig() {
            return {
                autoShow: true,
                type: LayerType.BottomToCenter,
                hasMask: true,
                maskClose: true,
                defaultFrame: 1
            };
        }
        ready(func) {
            return new Promise((resolve, reject) => {
                if (this.status != ModalStatus.WaitDestroy && this.status != ModalStatus.Readying) {
                    func && func();
                    resolve();
                }
                else {
                    this.readingFuncs.push(() => {
                        func && func();
                        resolve();
                    });
                }
            });
        }
        setReadyed() {
            this.status = ModalStatus.WaitShow;
            this.readingFuncs.forEach(func => func());
            this.readingFuncs = [];
        }
    }
    Layer.code = 0;
    Layer.zIndex = 0;
    class Mask {
        constructor() {
            this.dom = document.querySelector('#zk-layer-mask');
        }
        show(modal) {
            this.dom.style.zIndex = '' + (modal.zIndex - 1);
            this.dom.className = 'zk-layer-mask zk-layer-mask-show';
            this.dom.style.display = 'block';
            if (modal.options.maskClose) {
                this.dom.onclick = () => {
                    modal.hide();
                };
            }
        }
        hide(modal) {
            let topNeedMaskModal;
            let zkLayers = modalState.zkLayers;
            zkLayers.forEach(item => {
                if (modal != item && item.status == ModalStatus.WaitHide && item.options.hasMask) {
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
                if (modal.options.maskClose) {
                    this.dom.onclick = () => {
                        topNeedMaskModal.hide();
                    };
                }
            }
            else {
                this.dom.className = 'zk-layer-mask zk-layer-mask-hide';
                setTimeout(() => {
                    this.dom.style.display = 'none';
                }, 900);
            }
        }
        static getInstance() {
            if (!this._instance)
                this._instance = new Mask();
            return this._instance;
        }
    }

    var script$2 = Vue.extend({
        props: {
            a4: String,
            func: Function
        },
        created() {
        },
        data() {
            return {
                test: '参数12'
            };
        },
        methods: {
            testFunc() {
                this.$emit('event1', '123123');
                Layer.create(TestComponents, {
                    a4: '底部弹出1',
                    func: function (param) {
                        console.log(param);
                    }
                }, { type: 1 });
            }
        }
    });

    /* script */
    const __vue_script__$2 = script$2;

    /* template */
    var __vue_render__$2 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "a",
        {
          staticStyle: { width: "100px", display: "block" },
          on: { click: _vm.testFunc }
        },
        [_vm._v("asdfasdf组件12," + _vm._s(_vm.test) + "," + _vm._s(_vm.a4))]
      )
    };
    var __vue_staticRenderFns__$2 = [];
    __vue_render__$2._withStripped = true;

      /* style */
      const __vue_inject_styles__$2 = undefined;
      /* scoped */
      const __vue_scope_id__$2 = undefined;
      /* module identifier */
      const __vue_module_identifier__$2 = undefined;
      /* functional template */
      const __vue_is_functional_template__$2 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var TestComponents = normalizeComponent_1(
        { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
        __vue_inject_styles__$2,
        __vue_script__$2,
        __vue_scope_id__$2,
        __vue_is_functional_template__$2,
        __vue_module_identifier__$2,
        undefined,
        undefined
      );

    var script$3 = Vue.extend({
        components: {
            ActualComponent
        },
        created() {
            console.log('this.zkLayer.options', this.zkLayer.options);
            console.log('this.zkLayer.params', this.zkLayer.params);
        },
        data() {
            return {
                dialogVisible: true
            };
        },
        methods: {
            close() {
                this.dialogVisible = false;
                this.hide();
            },
            handleClose(done) {
                this.$confirm('确认关闭？').then(_ => {
                    done();
                    this.dialogVisible = false;
                    this.hide();
                }).catch(_ => {
                    console.log(_);
                });
            },
            eventt1() {
                console.log('模板组件收到业务组件通知-');
            }
        },
        beforeLayerHide() {
            console.log('触发:弹窗隐藏前钩子');
        },
        layerShowed() {
            console.log('触发:弹窗显示后钩子');
            this.dialogVisible = true;
        }
    });

    /* script */
    const __vue_script__$3 = script$3;

    /* template */
    var __vue_render__$3 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "el-dialog",
        {
          attrs: {
            title: "提示",
            visible: _vm.dialogVisible,
            width: "30%",
            "before-close": _vm.handleClose
          },
          on: {
            "update:visible": function($event) {
              _vm.dialogVisible = $event;
            }
          }
        },
        [
          _c("actual-component", {
            attrs: { modal: _vm.zkLayer },
            on: { eventt1: _vm.eventt1, hide: _vm.close }
          }),
          _vm._v(" "),
          _c(
            "span",
            {
              staticClass: "dialog-footer",
              attrs: { slot: "footer" },
              slot: "footer"
            },
            [
              _c("el-button", { on: { click: _vm.close } }, [_vm._v("取 消")]),
              _vm._v(" "),
              _c("el-button", { attrs: { type: "primary" } }, [_vm._v("确 定")])
            ],
            1
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$3 = [];
    __vue_render__$3._withStripped = true;

      /* style */
      const __vue_inject_styles__$3 = undefined;
      /* scoped */
      const __vue_scope_id__$3 = undefined;
      /* module identifier */
      const __vue_module_identifier__$3 = undefined;
      /* functional template */
      const __vue_is_functional_template__$3 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var TemplateCompt = normalizeComponent_1(
        { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
        __vue_inject_styles__$3,
        __vue_script__$3,
        __vue_scope_id__$3,
        __vue_is_functional_template__$3,
        __vue_module_identifier__$3,
        undefined,
        undefined
      );

    var script$4 = Vue.extend({
        props: {
            a4: {
                type: String
            }
        },
        created() {
            console.log('this.a4:', this.a4);
            console.log(this.zkLayer);
        },
        methods: {
            testFunc() {
                console.log('业务组价发出通知');
                this.$emit('eventt', '发送给调用层通知');
                this.$emit('eventt1', '发送给模板组件通知');
            },
            hideFunc() {
                this.$emit('hide', '通知模板组件隐藏');
            }
        }
    });

    /* script */
    const __vue_script__$4 = script$4;
    /* template */
    var __vue_render__$4 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", [
        _c("div", [
          _c("div", [_vm._v("这是一段详细信息")]),
          _vm._v(" "),
          _c("button", { on: { click: _vm.testFunc } }, [
            _vm._v("发送消息给模板组件")
          ]),
          _vm._v(" "),
          _c("button", { on: { click: _vm.hideFunc } }, [_vm._v("隐藏")]),
          _vm._v(" "),
          _c("div", [
            _vm._v("\n            传入参数: "),
            _c("span", {
              staticClass: "sub-text",
              domProps: { textContent: _vm._s(_vm.a4) }
            })
          ])
        ])
      ])
    };
    var __vue_staticRenderFns__$4 = [];
    __vue_render__$4._withStripped = true;

      /* style */
      const __vue_inject_styles__$4 = undefined;
      /* scoped */
      const __vue_scope_id__$4 = undefined;
      /* module identifier */
      const __vue_module_identifier__$4 = undefined;
      /* functional template */
      const __vue_is_functional_template__$4 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var BusinessCompt = normalizeComponent_1(
        { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
        __vue_inject_styles__$4,
        __vue_script__$4,
        __vue_scope_id__$4,
        __vue_is_functional_template__$4,
        __vue_module_identifier__$4,
        undefined,
        undefined
      );

    var script$5 = {
        data() {
            return {
                msg: 123123
            };
        },
        methods: {
            bottomToCenter() {
                Layer.create(TestComponents, {
                    a4: '底部弹出',
                    func: function (param) {
                        console.log(param);
                    }
                });
            },
            right() {
                Layer.create(TestComponents, {
                    a4: '右侧弹出',
                    func: function (param) {
                        console.log(param);
                    }
                }, {
                    type: LayerType.Right
                });
            },
            customPopup() {
                let layer = Layer.create(BusinessCompt, {
                    a4: '的卡就是看大家'
                }, {
                    type: LayerType.Custom,
                    hasMask: false,
                    templateComponent: TemplateCompt
                });
                layer.on('custom-event', val => {
                    console.log(val);
                });
                layer.on('custom-event', val => {
                    console.log(val);
                });
            },
            customPopup1() {
                Layer.create(BusinessCompt, {
                    a4: '的卡就是看大家1'
                }, {
                    type: LayerType.Custom,
                    hasMask: false,
                    templateComponent: TemplateCompt
                }).on('custom-event', val => {
                    console.log(val);
                });
            },
            testPagePopup() {
                console.log(123);
                Layer.create('/bar', {
                    a4: '的卡就是看大家123'
                }, {
                    type: LayerType.BottomToCenter,
                }).on('custom-event', val => {
                    console.log(val);
                });
            },
            testPagePopup2() {
                console.log(123);
                Layer.create('https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login', {
                    a4: '的卡就是看大家1'
                }, {
                    type: LayerType.BottomToCenter,
                }).on('custom-event', val => {
                    console.log(val);
                });
            },
            alert1() {
                this.$alert('asdasd');
            }
        }
    };

    /* script */
    const __vue_script__$5 = script$5;

    /* template */
    var __vue_render__$5 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        [
          _c("div", { staticClass: "aa" }, [_vm._v("测试")]),
          _vm._v(" "),
          _c("div", { domProps: { textContent: _vm._s(_vm.msg) } }),
          _vm._v(" "),
          _c("input", { attrs: { type: "checkbox", name: "111", id: "" } }),
          _vm._v(" "),
          _c("input", {
            attrs: { type: "button", value: "底部弹出" },
            on: { click: _vm.bottomToCenter }
          }),
          _vm._v(" "),
          _c("input", {
            attrs: { type: "button", value: "右侧弹出" },
            on: { click: _vm.right }
          }),
          _vm._v(" "),
          _c("input", {
            attrs: { type: "button", value: "自定义弹出" },
            on: { click: _vm.customPopup }
          }),
          _vm._v(" "),
          _c("input", {
            attrs: { type: "button", value: "自定义弹出1" },
            on: { click: _vm.customPopup1 }
          }),
          _vm._v(" "),
          _c("input", {
            attrs: { type: "button", value: "弹出alert" },
            on: { click: _vm.alert1 }
          }),
          _vm._v(" "),
          _c("input", {
            attrs: { type: "button", value: "测试弹出单页页面组件" },
            on: { click: _vm.testPagePopup }
          }),
          _vm._v(" "),
          _c("input", {
            attrs: { type: "button", value: "测试弹出多页组件" },
            on: { click: _vm.testPagePopup2 }
          }),
          _vm._v(" "),
          _c("zk-layer")
        ],
        1
      )
    };
    var __vue_staticRenderFns__$5 = [];
    __vue_render__$5._withStripped = true;

      /* style */
      const __vue_inject_styles__$5 = undefined;
      /* scoped */
      const __vue_scope_id__$5 = undefined;
      /* module identifier */
      const __vue_module_identifier__$5 = undefined;
      /* functional template */
      const __vue_is_functional_template__$5 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var App = normalizeComponent_1(
        { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
        __vue_inject_styles__$5,
        __vue_script__$5,
        __vue_scope_id__$5,
        __vue_is_functional_template__$5,
        __vue_module_identifier__$5,
        undefined,
        undefined
      );

    const routes = [
        { 
            path: '/foo', 
            component: TestComponents 
        },
        { 
            path: '/bar', 
            component: (resolve)=>{
                resolve(TestComponents);
            }
        }
    ];
    Vue.use(Layer, { routes });
    new Vue(App).$mount('#app');

    // function aa(){
    //     this.$layer.alert();
    //     this.$layer.createModal('组件','参数','选项').on('事件名称',()=>{

    //     });
    //     this.createModal
    //     this.$app.alert('内容',()=>{
    //         Modal.create()
    //     });
        // this.app.open('组件','参数','选项').on('事件名称',()=>{

        // });
        // Modal.create(components,{

        // })
    // this.app.alert()
    // }

}(Vue));
