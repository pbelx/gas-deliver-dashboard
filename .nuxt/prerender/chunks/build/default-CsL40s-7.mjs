import { e as useAuthStore, M as VApp, N as VNavigationDrawer, K as VList, A as VListItem, P as VListGroup, w as VBtn, Q as VAppBar, R as VAppBarNavIcon, p as VToolbarTitle, H as VSpacer, D as VChip, q as VIcon, S as VMain, V as VContainer, _ as __nuxt_component_0 } from './server.mjs';
import { defineComponent, ref, withCtx, createVNode, mergeProps, createTextVNode, unref, createBlock, createCommentVNode, openBlock, toDisplayString, useSSRContext } from 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/vue/index.mjs';
import { ssrRenderComponent, ssrInterpolate } from 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/vue/server-renderer/index.mjs';
import { useRouter } from 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/vue-router/dist/vue-router.node.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/ofetch/dist/node.mjs';
import '../_/renderer.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/h3/dist/index.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/ufo/dist/index.mjs';
import '../nitro/nitro.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/destr/dist/index.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/hookable/dist/index.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/node-mock-http/dist/index.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/unstorage/dist/index.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/unstorage/drivers/fs.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/unstorage/drivers/lru-cache.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/ohash/dist/index.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/klona/dist/index.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/defu/dist/defu.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/scule/dist/index.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/unctx/dist/index.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/pathe/dist/index.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/unhead/dist/server.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/devalue/index.js';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/unhead/dist/utils.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/unhead/dist/plugins.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/pinia/dist/pinia.prod.cjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const drawer = ref(true);
    const authStore = useAuthStore();
    const router = useRouter();
    const handleLogout = () => {
      authStore.logout();
      router.push("/login");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0;
      _push(ssrRenderComponent(VApp, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VNavigationDrawer, {
              app: "",
              modelValue: drawer.value,
              "onUpdate:modelValue": ($event) => drawer.value = $event
            }, {
              append: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="pa-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(VBtn, {
                    block: "",
                    color: "primary",
                    onClick: handleLogout
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Logout `);
                      } else {
                        return [
                          createTextVNode(" Logout ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "pa-2" }, [
                      createVNode(VBtn, {
                        block: "",
                        color: "primary",
                        onClick: handleLogout
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Logout ")
                        ]),
                        _: 1
                      })
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VList, {
                    nav: "",
                    dense: ""
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VListItem, {
                          "prepend-icon": "mdi-view-dashboard",
                          title: "Dashboard",
                          to: "/"
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VListItem, {
                          "prepend-icon": "mdi-cart",
                          title: "Orders",
                          to: "/orders"
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VListGroup, null, {
                          activator: withCtx(({ props }, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VListItem, mergeProps(props, {
                                "prepend-icon": "mdi-gas-cylinder",
                                title: "Gas Cylinders"
                              }), null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VListItem, mergeProps(props, {
                                  "prepend-icon": "mdi-gas-cylinder",
                                  title: "Gas Cylinders"
                                }), null, 16)
                              ];
                            }
                          }),
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VListItem, {
                                "prepend-icon": "mdi-format-list-bulleted",
                                title: "Manage Cylinders",
                                to: "/gas-cylinders",
                                class: "ml-4"
                              }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VListItem, {
                                "prepend-icon": "mdi-account-group",
                                title: "Suppliers",
                                to: "/suppliers",
                                class: "ml-4"
                              }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VListItem, {
                                  "prepend-icon": "mdi-format-list-bulleted",
                                  title: "Manage Cylinders",
                                  to: "/gas-cylinders",
                                  class: "ml-4"
                                }),
                                createVNode(VListItem, {
                                  "prepend-icon": "mdi-account-group",
                                  title: "Suppliers",
                                  to: "/suppliers",
                                  class: "ml-4"
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VListItem, {
                            "prepend-icon": "mdi-view-dashboard",
                            title: "Dashboard",
                            to: "/"
                          }),
                          createVNode(VListItem, {
                            "prepend-icon": "mdi-cart",
                            title: "Orders",
                            to: "/orders"
                          }),
                          createVNode(VListGroup, null, {
                            activator: withCtx(({ props }) => [
                              createVNode(VListItem, mergeProps(props, {
                                "prepend-icon": "mdi-gas-cylinder",
                                title: "Gas Cylinders"
                              }), null, 16)
                            ]),
                            default: withCtx(() => [
                              createVNode(VListItem, {
                                "prepend-icon": "mdi-format-list-bulleted",
                                title: "Manage Cylinders",
                                to: "/gas-cylinders",
                                class: "ml-4"
                              }),
                              createVNode(VListItem, {
                                "prepend-icon": "mdi-account-group",
                                title: "Suppliers",
                                to: "/suppliers",
                                class: "ml-4"
                              })
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VList, {
                      nav: "",
                      dense: ""
                    }, {
                      default: withCtx(() => [
                        createVNode(VListItem, {
                          "prepend-icon": "mdi-view-dashboard",
                          title: "Dashboard",
                          to: "/"
                        }),
                        createVNode(VListItem, {
                          "prepend-icon": "mdi-cart",
                          title: "Orders",
                          to: "/orders"
                        }),
                        createVNode(VListGroup, null, {
                          activator: withCtx(({ props }) => [
                            createVNode(VListItem, mergeProps(props, {
                              "prepend-icon": "mdi-gas-cylinder",
                              title: "Gas Cylinders"
                            }), null, 16)
                          ]),
                          default: withCtx(() => [
                            createVNode(VListItem, {
                              "prepend-icon": "mdi-format-list-bulleted",
                              title: "Manage Cylinders",
                              to: "/gas-cylinders",
                              class: "ml-4"
                            }),
                            createVNode(VListItem, {
                              "prepend-icon": "mdi-account-group",
                              title: "Suppliers",
                              to: "/suppliers",
                              class: "ml-4"
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VAppBar, { app: "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VAppBarNavIcon, {
                    onClick: ($event) => drawer.value = !drawer.value
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VToolbarTitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Admin Dashboard`);
                      } else {
                        return [
                          createTextVNode("Admin Dashboard")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VSpacer, null, null, _parent3, _scopeId2));
                  if (unref(authStore).user) {
                    _push3(`<span class="mr-5"${_scopeId2}>`);
                    _push3(ssrRenderComponent(VChip, {
                      color: "primary",
                      variant: "outlined",
                      size: "small",
                      class: "mr-2"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VIcon, { start: "" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`mdi-shield-account`);
                              } else {
                                return [
                                  createTextVNode("mdi-shield-account")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(` Admin `);
                        } else {
                          return [
                            createVNode(VIcon, { start: "" }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-shield-account")
                              ]),
                              _: 1
                            }),
                            createTextVNode(" Admin ")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(` Welcome, ${ssrInterpolate(unref(authStore).user.firstName)}</span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode(VAppBarNavIcon, {
                      onClick: ($event) => drawer.value = !drawer.value
                    }, null, 8, ["onClick"]),
                    createVNode(VToolbarTitle, null, {
                      default: withCtx(() => [
                        createTextVNode("Admin Dashboard")
                      ]),
                      _: 1
                    }),
                    createVNode(VSpacer),
                    unref(authStore).user ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "mr-5"
                    }, [
                      createVNode(VChip, {
                        color: "primary",
                        variant: "outlined",
                        size: "small",
                        class: "mr-2"
                      }, {
                        default: withCtx(() => [
                          createVNode(VIcon, { start: "" }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-shield-account")
                            ]),
                            _: 1
                          }),
                          createTextVNode(" Admin ")
                        ]),
                        _: 1
                      }),
                      createTextVNode(" Welcome, " + toDisplayString(unref(authStore).user.firstName), 1)
                    ])) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VMain, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VContainer, { fluid: "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_NuxtPage, null, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_NuxtPage)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VContainer, { fluid: "" }, {
                      default: withCtx(() => [
                        createVNode(_component_NuxtPage)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VNavigationDrawer, {
                app: "",
                modelValue: drawer.value,
                "onUpdate:modelValue": ($event) => drawer.value = $event
              }, {
                append: withCtx(() => [
                  createVNode("div", { class: "pa-2" }, [
                    createVNode(VBtn, {
                      block: "",
                      color: "primary",
                      onClick: handleLogout
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Logout ")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                default: withCtx(() => [
                  createVNode(VList, {
                    nav: "",
                    dense: ""
                  }, {
                    default: withCtx(() => [
                      createVNode(VListItem, {
                        "prepend-icon": "mdi-view-dashboard",
                        title: "Dashboard",
                        to: "/"
                      }),
                      createVNode(VListItem, {
                        "prepend-icon": "mdi-cart",
                        title: "Orders",
                        to: "/orders"
                      }),
                      createVNode(VListGroup, null, {
                        activator: withCtx(({ props }) => [
                          createVNode(VListItem, mergeProps(props, {
                            "prepend-icon": "mdi-gas-cylinder",
                            title: "Gas Cylinders"
                          }), null, 16)
                        ]),
                        default: withCtx(() => [
                          createVNode(VListItem, {
                            "prepend-icon": "mdi-format-list-bulleted",
                            title: "Manage Cylinders",
                            to: "/gas-cylinders",
                            class: "ml-4"
                          }),
                          createVNode(VListItem, {
                            "prepend-icon": "mdi-account-group",
                            title: "Suppliers",
                            to: "/suppliers",
                            class: "ml-4"
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(VAppBar, { app: "" }, {
                default: withCtx(() => [
                  createVNode(VAppBarNavIcon, {
                    onClick: ($event) => drawer.value = !drawer.value
                  }, null, 8, ["onClick"]),
                  createVNode(VToolbarTitle, null, {
                    default: withCtx(() => [
                      createTextVNode("Admin Dashboard")
                    ]),
                    _: 1
                  }),
                  createVNode(VSpacer),
                  unref(authStore).user ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "mr-5"
                  }, [
                    createVNode(VChip, {
                      color: "primary",
                      variant: "outlined",
                      size: "small",
                      class: "mr-2"
                    }, {
                      default: withCtx(() => [
                        createVNode(VIcon, { start: "" }, {
                          default: withCtx(() => [
                            createTextVNode("mdi-shield-account")
                          ]),
                          _: 1
                        }),
                        createTextVNode(" Admin ")
                      ]),
                      _: 1
                    }),
                    createTextVNode(" Welcome, " + toDisplayString(unref(authStore).user.firstName), 1)
                  ])) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createVNode(VMain, null, {
                default: withCtx(() => [
                  createVNode(VContainer, { fluid: "" }, {
                    default: withCtx(() => [
                      createVNode(_component_NuxtPage)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-CsL40s-7.mjs.map
