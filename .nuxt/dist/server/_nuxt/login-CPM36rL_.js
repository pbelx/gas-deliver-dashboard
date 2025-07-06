import { defineComponent, ref, mergeProps, withCtx, createTextVNode, createVNode, unref, toDisplayString, createBlock, createCommentVNode, openBlock, withModifiers, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { useRouter } from "vue-router";
import { e as useAuthStore, V as VContainer, f as VRow, g as VCol, i as VCard, o as VToolbar, p as VToolbarTitle, m as VCardText, q as VIcon, s as VForm, v as VTextField, k as VAlert, w as VBtn } from "../server.mjs";
import "/home/pope/zcode/hfmg/4/fullgass/dash/node_modules/hookable/dist/index.mjs";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "ofetch";
import "#internal/nuxt/paths";
import "/home/pope/zcode/hfmg/4/fullgass/dash/node_modules/unctx/dist/index.mjs";
import "/home/pope/zcode/hfmg/4/fullgass/dash/node_modules/h3/dist/index.mjs";
import "pinia";
import "/home/pope/zcode/hfmg/4/fullgass/dash/node_modules/defu/dist/defu.mjs";
import "/home/pope/zcode/hfmg/4/fullgass/dash/node_modules/radix3/dist/index.mjs";
import "/home/pope/zcode/hfmg/4/fullgass/dash/node_modules/ufo/dist/index.mjs";
import "/home/pope/zcode/hfmg/4/fullgass/dash/node_modules/klona/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const email = ref("");
    const password = ref("");
    const authStore = useAuthStore();
    const router = useRouter();
    const rules = {
      required: (value) => !!value || "Required.",
      email: (value) => /.+@.+\..+/.test(value) || "E-mail must be valid."
    };
    const handleLogin = async () => {
      if (!email.value || !password.value) {
        authStore.$patch({ error: "Email and password are required." });
        return;
      }
      const success = await authStore.login({
        email: email.value,
        password: password.value
      });
      if (success) {
        router.push("/");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VContainer, mergeProps({
        fluid: "",
        "fill-height": ""
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VRow, {
              align: "center",
              justify: "center"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCol, {
                    cols: "12",
                    sm: "8",
                    md: "4"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCard, { class: "elevation-12 mt-4" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VToolbar, {
                                color: "primary",
                                dark: "",
                                flat: ""
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VToolbarTitle, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Admin Login`);
                                        } else {
                                          return [
                                            createTextVNode("Admin Login")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VToolbarTitle, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Admin Login")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VCardText, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="text-center mb-4" data-v-70ffc46c${_scopeId5}>`);
                                    _push6(ssrRenderComponent(VIcon, {
                                      size: "48",
                                      color: "primary"
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`mdi-shield-account`);
                                        } else {
                                          return [
                                            createTextVNode("mdi-shield-account")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                    _push6(`<p class="text-body-2 mt-2 text-medium-emphasis" data-v-70ffc46c${_scopeId5}> Admin access only. Please enter your admin credentials. </p></div>`);
                                    _push6(ssrRenderComponent(VForm, { onSubmit: handleLogin }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VTextField, {
                                            label: "Email",
                                            modelValue: email.value,
                                            "onUpdate:modelValue": ($event) => email.value = $event,
                                            "prepend-icon": "mdi-account",
                                            type: "email",
                                            rules: [rules.required, rules.email],
                                            required: ""
                                          }, null, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VTextField, {
                                            label: "Password",
                                            modelValue: password.value,
                                            "onUpdate:modelValue": ($event) => password.value = $event,
                                            "prepend-icon": "mdi-lock",
                                            type: "password",
                                            rules: [rules.required],
                                            required: ""
                                          }, null, _parent7, _scopeId6));
                                          if (unref(authStore).error) {
                                            _push7(ssrRenderComponent(VAlert, {
                                              type: "error",
                                              dense: "",
                                              class: "mt-3 mb-3"
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(unref(authStore).error)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(unref(authStore).error), 1)
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            _push7(`<!---->`);
                                          }
                                          _push7(ssrRenderComponent(VBtn, {
                                            type: "submit",
                                            color: "primary",
                                            block: "",
                                            loading: unref(authStore).loading,
                                            disabled: unref(authStore).loading
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(` Login as Admin `);
                                              } else {
                                                return [
                                                  createTextVNode(" Login as Admin ")
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VTextField, {
                                              label: "Email",
                                              modelValue: email.value,
                                              "onUpdate:modelValue": ($event) => email.value = $event,
                                              "prepend-icon": "mdi-account",
                                              type: "email",
                                              rules: [rules.required, rules.email],
                                              required: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                            createVNode(VTextField, {
                                              label: "Password",
                                              modelValue: password.value,
                                              "onUpdate:modelValue": ($event) => password.value = $event,
                                              "prepend-icon": "mdi-lock",
                                              type: "password",
                                              rules: [rules.required],
                                              required: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                            unref(authStore).error ? (openBlock(), createBlock(VAlert, {
                                              key: 0,
                                              type: "error",
                                              dense: "",
                                              class: "mt-3 mb-3"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(unref(authStore).error), 1)
                                              ]),
                                              _: 1
                                            })) : createCommentVNode("", true),
                                            createVNode(VBtn, {
                                              type: "submit",
                                              color: "primary",
                                              block: "",
                                              loading: unref(authStore).loading,
                                              disabled: unref(authStore).loading
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(" Login as Admin ")
                                              ]),
                                              _: 1
                                            }, 8, ["loading", "disabled"])
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode("div", { class: "text-center mb-4" }, [
                                        createVNode(VIcon, {
                                          size: "48",
                                          color: "primary"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-shield-account")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("p", { class: "text-body-2 mt-2 text-medium-emphasis" }, " Admin access only. Please enter your admin credentials. ")
                                      ]),
                                      createVNode(VForm, {
                                        onSubmit: withModifiers(handleLogin, ["prevent"])
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VTextField, {
                                            label: "Email",
                                            modelValue: email.value,
                                            "onUpdate:modelValue": ($event) => email.value = $event,
                                            "prepend-icon": "mdi-account",
                                            type: "email",
                                            rules: [rules.required, rules.email],
                                            required: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                          createVNode(VTextField, {
                                            label: "Password",
                                            modelValue: password.value,
                                            "onUpdate:modelValue": ($event) => password.value = $event,
                                            "prepend-icon": "mdi-lock",
                                            type: "password",
                                            rules: [rules.required],
                                            required: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                          unref(authStore).error ? (openBlock(), createBlock(VAlert, {
                                            key: 0,
                                            type: "error",
                                            dense: "",
                                            class: "mt-3 mb-3"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(unref(authStore).error), 1)
                                            ]),
                                            _: 1
                                          })) : createCommentVNode("", true),
                                          createVNode(VBtn, {
                                            type: "submit",
                                            color: "primary",
                                            block: "",
                                            loading: unref(authStore).loading,
                                            disabled: unref(authStore).loading
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Login as Admin ")
                                            ]),
                                            _: 1
                                          }, 8, ["loading", "disabled"])
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VToolbar, {
                                  color: "primary",
                                  dark: "",
                                  flat: ""
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VToolbarTitle, null, {
                                      default: withCtx(() => [
                                        createTextVNode("Admin Login")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCardText, null, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "text-center mb-4" }, [
                                      createVNode(VIcon, {
                                        size: "48",
                                        color: "primary"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-shield-account")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("p", { class: "text-body-2 mt-2 text-medium-emphasis" }, " Admin access only. Please enter your admin credentials. ")
                                    ]),
                                    createVNode(VForm, {
                                      onSubmit: withModifiers(handleLogin, ["prevent"])
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VTextField, {
                                          label: "Email",
                                          modelValue: email.value,
                                          "onUpdate:modelValue": ($event) => email.value = $event,
                                          "prepend-icon": "mdi-account",
                                          type: "email",
                                          rules: [rules.required, rules.email],
                                          required: ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                        createVNode(VTextField, {
                                          label: "Password",
                                          modelValue: password.value,
                                          "onUpdate:modelValue": ($event) => password.value = $event,
                                          "prepend-icon": "mdi-lock",
                                          type: "password",
                                          rules: [rules.required],
                                          required: ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                        unref(authStore).error ? (openBlock(), createBlock(VAlert, {
                                          key: 0,
                                          type: "error",
                                          dense: "",
                                          class: "mt-3 mb-3"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(unref(authStore).error), 1)
                                          ]),
                                          _: 1
                                        })) : createCommentVNode("", true),
                                        createVNode(VBtn, {
                                          type: "submit",
                                          color: "primary",
                                          block: "",
                                          loading: unref(authStore).loading,
                                          disabled: unref(authStore).loading
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(" Login as Admin ")
                                          ]),
                                          _: 1
                                        }, 8, ["loading", "disabled"])
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
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VCard, { class: "elevation-12 mt-4" }, {
                            default: withCtx(() => [
                              createVNode(VToolbar, {
                                color: "primary",
                                dark: "",
                                flat: ""
                              }, {
                                default: withCtx(() => [
                                  createVNode(VToolbarTitle, null, {
                                    default: withCtx(() => [
                                      createTextVNode("Admin Login")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode(VCardText, null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "text-center mb-4" }, [
                                    createVNode(VIcon, {
                                      size: "48",
                                      color: "primary"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-shield-account")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("p", { class: "text-body-2 mt-2 text-medium-emphasis" }, " Admin access only. Please enter your admin credentials. ")
                                  ]),
                                  createVNode(VForm, {
                                    onSubmit: withModifiers(handleLogin, ["prevent"])
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VTextField, {
                                        label: "Email",
                                        modelValue: email.value,
                                        "onUpdate:modelValue": ($event) => email.value = $event,
                                        "prepend-icon": "mdi-account",
                                        type: "email",
                                        rules: [rules.required, rules.email],
                                        required: ""
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                      createVNode(VTextField, {
                                        label: "Password",
                                        modelValue: password.value,
                                        "onUpdate:modelValue": ($event) => password.value = $event,
                                        "prepend-icon": "mdi-lock",
                                        type: "password",
                                        rules: [rules.required],
                                        required: ""
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                      unref(authStore).error ? (openBlock(), createBlock(VAlert, {
                                        key: 0,
                                        type: "error",
                                        dense: "",
                                        class: "mt-3 mb-3"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(unref(authStore).error), 1)
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true),
                                      createVNode(VBtn, {
                                        type: "submit",
                                        color: "primary",
                                        block: "",
                                        loading: unref(authStore).loading,
                                        disabled: unref(authStore).loading
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Login as Admin ")
                                        ]),
                                        _: 1
                                      }, 8, ["loading", "disabled"])
                                    ]),
                                    _: 1
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VCol, {
                      cols: "12",
                      sm: "8",
                      md: "4"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCard, { class: "elevation-12 mt-4" }, {
                          default: withCtx(() => [
                            createVNode(VToolbar, {
                              color: "primary",
                              dark: "",
                              flat: ""
                            }, {
                              default: withCtx(() => [
                                createVNode(VToolbarTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("Admin Login")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(VCardText, null, {
                              default: withCtx(() => [
                                createVNode("div", { class: "text-center mb-4" }, [
                                  createVNode(VIcon, {
                                    size: "48",
                                    color: "primary"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-shield-account")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("p", { class: "text-body-2 mt-2 text-medium-emphasis" }, " Admin access only. Please enter your admin credentials. ")
                                ]),
                                createVNode(VForm, {
                                  onSubmit: withModifiers(handleLogin, ["prevent"])
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VTextField, {
                                      label: "Email",
                                      modelValue: email.value,
                                      "onUpdate:modelValue": ($event) => email.value = $event,
                                      "prepend-icon": "mdi-account",
                                      type: "email",
                                      rules: [rules.required, rules.email],
                                      required: ""
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                    createVNode(VTextField, {
                                      label: "Password",
                                      modelValue: password.value,
                                      "onUpdate:modelValue": ($event) => password.value = $event,
                                      "prepend-icon": "mdi-lock",
                                      type: "password",
                                      rules: [rules.required],
                                      required: ""
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                    unref(authStore).error ? (openBlock(), createBlock(VAlert, {
                                      key: 0,
                                      type: "error",
                                      dense: "",
                                      class: "mt-3 mb-3"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(unref(authStore).error), 1)
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true),
                                    createVNode(VBtn, {
                                      type: "submit",
                                      color: "primary",
                                      block: "",
                                      loading: unref(authStore).loading,
                                      disabled: unref(authStore).loading
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Login as Admin ")
                                      ]),
                                      _: 1
                                    }, 8, ["loading", "disabled"])
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
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
          } else {
            return [
              createVNode(VRow, {
                align: "center",
                justify: "center"
              }, {
                default: withCtx(() => [
                  createVNode(VCol, {
                    cols: "12",
                    sm: "8",
                    md: "4"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, { class: "elevation-12 mt-4" }, {
                        default: withCtx(() => [
                          createVNode(VToolbar, {
                            color: "primary",
                            dark: "",
                            flat: ""
                          }, {
                            default: withCtx(() => [
                              createVNode(VToolbarTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("Admin Login")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(VCardText, null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "text-center mb-4" }, [
                                createVNode(VIcon, {
                                  size: "48",
                                  color: "primary"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-shield-account")
                                  ]),
                                  _: 1
                                }),
                                createVNode("p", { class: "text-body-2 mt-2 text-medium-emphasis" }, " Admin access only. Please enter your admin credentials. ")
                              ]),
                              createVNode(VForm, {
                                onSubmit: withModifiers(handleLogin, ["prevent"])
                              }, {
                                default: withCtx(() => [
                                  createVNode(VTextField, {
                                    label: "Email",
                                    modelValue: email.value,
                                    "onUpdate:modelValue": ($event) => email.value = $event,
                                    "prepend-icon": "mdi-account",
                                    type: "email",
                                    rules: [rules.required, rules.email],
                                    required: ""
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                  createVNode(VTextField, {
                                    label: "Password",
                                    modelValue: password.value,
                                    "onUpdate:modelValue": ($event) => password.value = $event,
                                    "prepend-icon": "mdi-lock",
                                    type: "password",
                                    rules: [rules.required],
                                    required: ""
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"]),
                                  unref(authStore).error ? (openBlock(), createBlock(VAlert, {
                                    key: 0,
                                    type: "error",
                                    dense: "",
                                    class: "mt-3 mb-3"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(unref(authStore).error), 1)
                                    ]),
                                    _: 1
                                  })) : createCommentVNode("", true),
                                  createVNode(VBtn, {
                                    type: "submit",
                                    color: "primary",
                                    block: "",
                                    loading: unref(authStore).loading,
                                    disabled: unref(authStore).loading
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Login as Admin ")
                                    ]),
                                    _: 1
                                  }, 8, ["loading", "disabled"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
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
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-70ffc46c"]]);
export {
  login as default
};
//# sourceMappingURL=login-CPM36rL_.js.map
