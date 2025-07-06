import { defineComponent, withCtx, createVNode, unref, createBlock, openBlock, Fragment, renderList, toDisplayString, createTextVNode, createCommentVNode, useSSRContext } from 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/vue/index.mjs';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/vue/server-renderer/index.mjs';
import { defineStore } from 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/pinia/dist/pinia.prod.cjs';
import { V as VContainer, f as VRow, g as VCol, h as VSkeletonLoader, i as VCard, j as VCardItem, k as VAlert, l as VCardTitle, m as VCardText, d as useApiService, e as useAuthStore } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/vue-router/dist/vue-router.node.mjs';

const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    stats: null,
    loading: false,
    error: null
  }),
  actions: {
    async fetchStatistics(startDate, endDate) {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();
      if (!authStore.token) {
        this.error = "Authentication token not found. Please login.";
        this.loading = false;
        return;
      }
      try {
        const [orderStats, overallStats] = await Promise.all([
          apiService.getOrderStatistics(authStore.token, startDate, endDate),
          apiService.getOverallDashboardStats(authStore.token)
        ]);
        this.stats = {
          ...orderStats,
          totalGasCylinders: overallStats.totalGasCylinders,
          totalUsers: overallStats.totalUsers
        };
      } catch (error) {
        this.error = error.message || "Failed to fetch dashboard statistics";
        this.stats = null;
      } finally {
        this.loading = false;
      }
    }
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const dashboardStore = useDashboardStore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VContainer, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VRow, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCol, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<h1 data-v-a7e0f5f2${_scopeId3}>Dashboard</h1><p data-v-a7e0f5f2${_scopeId3}>Welcome to the Admin Dashboard. Here&#39;s a quick overview of your store&#39;s performance.</p>`);
                      } else {
                        return [
                          createVNode("h1", null, "Dashboard"),
                          createVNode("p", null, "Welcome to the Admin Dashboard. Here's a quick overview of your store's performance.")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VCol, null, {
                      default: withCtx(() => [
                        createVNode("h1", null, "Dashboard"),
                        createVNode("p", null, "Welcome to the Admin Dashboard. Here's a quick overview of your store's performance.")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(dashboardStore).loading) {
              _push2(ssrRenderComponent(VRow, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<!--[-->`);
                    ssrRenderList(3, (n) => {
                      _push3(ssrRenderComponent(VCol, {
                        key: n,
                        md: "4"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(VSkeletonLoader, { type: "card" }, null, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(VSkeletonLoader, { type: "card" })
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]-->`);
                  } else {
                    return [
                      (openBlock(), createBlock(Fragment, null, renderList(3, (n) => {
                        return createVNode(VCol, {
                          key: n,
                          md: "4"
                        }, {
                          default: withCtx(() => [
                            createVNode(VSkeletonLoader, { type: "card" })
                          ]),
                          _: 2
                        }, 1024);
                      }), 64))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (!unref(dashboardStore).loading && unref(dashboardStore).stats) {
              _push2(ssrRenderComponent(VRow, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(VCol, {
                      md: "4",
                      sm: "6",
                      cols: "12"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VCard, {
                            class: "mx-auto",
                            elevation: "2"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VCardItem, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div data-v-a7e0f5f2${_scopeId5}><div class="text-overline mb-1" data-v-a7e0f5f2${_scopeId5}>Total Orders</div><div class="text-h6 mb-1" data-v-a7e0f5f2${_scopeId5}>${ssrInterpolate(unref(dashboardStore).stats.totalOrders)}</div><div class="text-caption" data-v-a7e0f5f2${_scopeId5}>All orders placed.</div></div>`);
                                    } else {
                                      return [
                                        createVNode("div", null, [
                                          createVNode("div", { class: "text-overline mb-1" }, "Total Orders"),
                                          createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.totalOrders), 1),
                                          createVNode("div", { class: "text-caption" }, "All orders placed.")
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VCardItem, null, {
                                    default: withCtx(() => [
                                      createVNode("div", null, [
                                        createVNode("div", { class: "text-overline mb-1" }, "Total Orders"),
                                        createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.totalOrders), 1),
                                        createVNode("div", { class: "text-caption" }, "All orders placed.")
                                      ])
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
                            createVNode(VCard, {
                              class: "mx-auto",
                              elevation: "2"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCardItem, null, {
                                  default: withCtx(() => [
                                    createVNode("div", null, [
                                      createVNode("div", { class: "text-overline mb-1" }, "Total Orders"),
                                      createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.totalOrders), 1),
                                      createVNode("div", { class: "text-caption" }, "All orders placed.")
                                    ])
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
                    _push3(ssrRenderComponent(VCol, {
                      md: "4",
                      sm: "6",
                      cols: "12"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VCard, {
                            class: "mx-auto",
                            elevation: "2"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VCardItem, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div data-v-a7e0f5f2${_scopeId5}><div class="text-overline mb-1" data-v-a7e0f5f2${_scopeId5}>Total Gas Cylinders</div><div class="text-h6 mb-1" data-v-a7e0f5f2${_scopeId5}>${ssrInterpolate(unref(dashboardStore).stats.totalGasCylinders)}</div><div class="text-caption" data-v-a7e0f5f2${_scopeId5}>Total number of gas cylinders available.</div></div>`);
                                    } else {
                                      return [
                                        createVNode("div", null, [
                                          createVNode("div", { class: "text-overline mb-1" }, "Total Gas Cylinders"),
                                          createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.totalGasCylinders), 1),
                                          createVNode("div", { class: "text-caption" }, "Total number of gas cylinders available.")
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VCardItem, null, {
                                    default: withCtx(() => [
                                      createVNode("div", null, [
                                        createVNode("div", { class: "text-overline mb-1" }, "Total Gas Cylinders"),
                                        createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.totalGasCylinders), 1),
                                        createVNode("div", { class: "text-caption" }, "Total number of gas cylinders available.")
                                      ])
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
                            createVNode(VCard, {
                              class: "mx-auto",
                              elevation: "2"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCardItem, null, {
                                  default: withCtx(() => [
                                    createVNode("div", null, [
                                      createVNode("div", { class: "text-overline mb-1" }, "Total Gas Cylinders"),
                                      createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.totalGasCylinders), 1),
                                      createVNode("div", { class: "text-caption" }, "Total number of gas cylinders available.")
                                    ])
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
                    _push3(ssrRenderComponent(VCol, {
                      md: "4",
                      sm: "6",
                      cols: "12"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VCard, {
                            class: "mx-auto",
                            elevation: "2"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VCardItem, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div data-v-a7e0f5f2${_scopeId5}><div class="text-overline mb-1" data-v-a7e0f5f2${_scopeId5}>Total Users</div><div class="text-h6 mb-1" data-v-a7e0f5f2${_scopeId5}>${ssrInterpolate(unref(dashboardStore).stats.totalUsers)}</div><div class="text-caption" data-v-a7e0f5f2${_scopeId5}>Total registered users.</div></div>`);
                                    } else {
                                      return [
                                        createVNode("div", null, [
                                          createVNode("div", { class: "text-overline mb-1" }, "Total Users"),
                                          createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.totalUsers), 1),
                                          createVNode("div", { class: "text-caption" }, "Total registered users.")
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VCardItem, null, {
                                    default: withCtx(() => [
                                      createVNode("div", null, [
                                        createVNode("div", { class: "text-overline mb-1" }, "Total Users"),
                                        createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.totalUsers), 1),
                                        createVNode("div", { class: "text-caption" }, "Total registered users.")
                                      ])
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
                            createVNode(VCard, {
                              class: "mx-auto",
                              elevation: "2"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCardItem, null, {
                                  default: withCtx(() => [
                                    createVNode("div", null, [
                                      createVNode("div", { class: "text-overline mb-1" }, "Total Users"),
                                      createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.totalUsers), 1),
                                      createVNode("div", { class: "text-caption" }, "Total registered users.")
                                    ])
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
                    _push3(ssrRenderComponent(VCol, {
                      md: "4",
                      sm: "6",
                      cols: "12"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VCard, {
                            class: "mx-auto",
                            elevation: "2"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VCardItem, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div data-v-a7e0f5f2${_scopeId5}><div class="text-overline mb-1" data-v-a7e0f5f2${_scopeId5}>Total Revenue</div><div class="text-h6 mb-1" data-v-a7e0f5f2${_scopeId5}>$${ssrInterpolate(unref(dashboardStore).stats.totalRevenue.toFixed(2))}</div><div class="text-caption" data-v-a7e0f5f2${_scopeId5}>Sum of all completed order values.</div></div>`);
                                    } else {
                                      return [
                                        createVNode("div", null, [
                                          createVNode("div", { class: "text-overline mb-1" }, "Total Revenue"),
                                          createVNode("div", { class: "text-h6 mb-1" }, "$" + toDisplayString(unref(dashboardStore).stats.totalRevenue.toFixed(2)), 1),
                                          createVNode("div", { class: "text-caption" }, "Sum of all completed order values.")
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VCardItem, null, {
                                    default: withCtx(() => [
                                      createVNode("div", null, [
                                        createVNode("div", { class: "text-overline mb-1" }, "Total Revenue"),
                                        createVNode("div", { class: "text-h6 mb-1" }, "$" + toDisplayString(unref(dashboardStore).stats.totalRevenue.toFixed(2)), 1),
                                        createVNode("div", { class: "text-caption" }, "Sum of all completed order values.")
                                      ])
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
                            createVNode(VCard, {
                              class: "mx-auto",
                              elevation: "2"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCardItem, null, {
                                  default: withCtx(() => [
                                    createVNode("div", null, [
                                      createVNode("div", { class: "text-overline mb-1" }, "Total Revenue"),
                                      createVNode("div", { class: "text-h6 mb-1" }, "$" + toDisplayString(unref(dashboardStore).stats.totalRevenue.toFixed(2)), 1),
                                      createVNode("div", { class: "text-caption" }, "Sum of all completed order values.")
                                    ])
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
                    _push3(ssrRenderComponent(VCol, {
                      md: "4",
                      sm: "6",
                      cols: "12"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VCard, {
                            class: "mx-auto",
                            elevation: "2"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VCardItem, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div data-v-a7e0f5f2${_scopeId5}><div class="text-overline mb-1" data-v-a7e0f5f2${_scopeId5}>Average Order Value</div><div class="text-h6 mb-1" data-v-a7e0f5f2${_scopeId5}>$${ssrInterpolate(unref(dashboardStore).stats.averageOrderValue.toFixed(2))}</div><div class="text-caption" data-v-a7e0f5f2${_scopeId5}>Average value of completed orders.</div></div>`);
                                    } else {
                                      return [
                                        createVNode("div", null, [
                                          createVNode("div", { class: "text-overline mb-1" }, "Average Order Value"),
                                          createVNode("div", { class: "text-h6 mb-1" }, "$" + toDisplayString(unref(dashboardStore).stats.averageOrderValue.toFixed(2)), 1),
                                          createVNode("div", { class: "text-caption" }, "Average value of completed orders.")
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VCardItem, null, {
                                    default: withCtx(() => [
                                      createVNode("div", null, [
                                        createVNode("div", { class: "text-overline mb-1" }, "Average Order Value"),
                                        createVNode("div", { class: "text-h6 mb-1" }, "$" + toDisplayString(unref(dashboardStore).stats.averageOrderValue.toFixed(2)), 1),
                                        createVNode("div", { class: "text-caption" }, "Average value of completed orders.")
                                      ])
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
                            createVNode(VCard, {
                              class: "mx-auto",
                              elevation: "2"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCardItem, null, {
                                  default: withCtx(() => [
                                    createVNode("div", null, [
                                      createVNode("div", { class: "text-overline mb-1" }, "Average Order Value"),
                                      createVNode("div", { class: "text-h6 mb-1" }, "$" + toDisplayString(unref(dashboardStore).stats.averageOrderValue.toFixed(2)), 1),
                                      createVNode("div", { class: "text-caption" }, "Average value of completed orders.")
                                    ])
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
                    _push3(ssrRenderComponent(VCol, {
                      md: "4",
                      sm: "6",
                      cols: "12"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VCard, {
                            class: "mx-auto",
                            elevation: "2"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VCardItem, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div data-v-a7e0f5f2${_scopeId5}><div class="text-overline mb-1" data-v-a7e0f5f2${_scopeId5}>Pending Orders</div><div class="text-h6 mb-1" data-v-a7e0f5f2${_scopeId5}>${ssrInterpolate(unref(dashboardStore).stats.pendingOrders)}</div><div class="text-caption" data-v-a7e0f5f2${_scopeId5}>Orders awaiting processing or confirmation.</div></div>`);
                                    } else {
                                      return [
                                        createVNode("div", null, [
                                          createVNode("div", { class: "text-overline mb-1" }, "Pending Orders"),
                                          createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.pendingOrders), 1),
                                          createVNode("div", { class: "text-caption" }, "Orders awaiting processing or confirmation.")
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VCardItem, null, {
                                    default: withCtx(() => [
                                      createVNode("div", null, [
                                        createVNode("div", { class: "text-overline mb-1" }, "Pending Orders"),
                                        createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.pendingOrders), 1),
                                        createVNode("div", { class: "text-caption" }, "Orders awaiting processing or confirmation.")
                                      ])
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
                            createVNode(VCard, {
                              class: "mx-auto",
                              elevation: "2"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCardItem, null, {
                                  default: withCtx(() => [
                                    createVNode("div", null, [
                                      createVNode("div", { class: "text-overline mb-1" }, "Pending Orders"),
                                      createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.pendingOrders), 1),
                                      createVNode("div", { class: "text-caption" }, "Orders awaiting processing or confirmation.")
                                    ])
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
                    _push3(ssrRenderComponent(VCol, {
                      md: "4",
                      sm: "6",
                      cols: "12"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VCard, {
                            class: "mx-auto",
                            elevation: "2"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VCardItem, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div data-v-a7e0f5f2${_scopeId5}><div class="text-overline mb-1" data-v-a7e0f5f2${_scopeId5}>Completed Orders</div><div class="text-h6 mb-1" data-v-a7e0f5f2${_scopeId5}>${ssrInterpolate(unref(dashboardStore).stats.completedOrders)}</div><div class="text-caption" data-v-a7e0f5f2${_scopeId5}>Successfully delivered orders.</div></div>`);
                                    } else {
                                      return [
                                        createVNode("div", null, [
                                          createVNode("div", { class: "text-overline mb-1" }, "Completed Orders"),
                                          createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.completedOrders), 1),
                                          createVNode("div", { class: "text-caption" }, "Successfully delivered orders.")
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VCardItem, null, {
                                    default: withCtx(() => [
                                      createVNode("div", null, [
                                        createVNode("div", { class: "text-overline mb-1" }, "Completed Orders"),
                                        createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.completedOrders), 1),
                                        createVNode("div", { class: "text-caption" }, "Successfully delivered orders.")
                                      ])
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
                            createVNode(VCard, {
                              class: "mx-auto",
                              elevation: "2"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCardItem, null, {
                                  default: withCtx(() => [
                                    createVNode("div", null, [
                                      createVNode("div", { class: "text-overline mb-1" }, "Completed Orders"),
                                      createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.completedOrders), 1),
                                      createVNode("div", { class: "text-caption" }, "Successfully delivered orders.")
                                    ])
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
                    _push3(ssrRenderComponent(VCol, {
                      md: "4",
                      sm: "6",
                      cols: "12"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VCard, {
                            class: "mx-auto",
                            elevation: "2"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VCardItem, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div data-v-a7e0f5f2${_scopeId5}><div class="text-overline mb-1" data-v-a7e0f5f2${_scopeId5}>Cancelled Orders</div><div class="text-h6 mb-1" data-v-a7e0f5f2${_scopeId5}>${ssrInterpolate(unref(dashboardStore).stats.cancelledOrders)}</div><div class="text-caption" data-v-a7e0f5f2${_scopeId5}>Orders that have been cancelled.</div></div>`);
                                    } else {
                                      return [
                                        createVNode("div", null, [
                                          createVNode("div", { class: "text-overline mb-1" }, "Cancelled Orders"),
                                          createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.cancelledOrders), 1),
                                          createVNode("div", { class: "text-caption" }, "Orders that have been cancelled.")
                                        ])
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VCardItem, null, {
                                    default: withCtx(() => [
                                      createVNode("div", null, [
                                        createVNode("div", { class: "text-overline mb-1" }, "Cancelled Orders"),
                                        createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.cancelledOrders), 1),
                                        createVNode("div", { class: "text-caption" }, "Orders that have been cancelled.")
                                      ])
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
                            createVNode(VCard, {
                              class: "mx-auto",
                              elevation: "2"
                            }, {
                              default: withCtx(() => [
                                createVNode(VCardItem, null, {
                                  default: withCtx(() => [
                                    createVNode("div", null, [
                                      createVNode("div", { class: "text-overline mb-1" }, "Cancelled Orders"),
                                      createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.cancelledOrders), 1),
                                      createVNode("div", { class: "text-caption" }, "Orders that have been cancelled.")
                                    ])
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
                        md: "4",
                        sm: "6",
                        cols: "12"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCard, {
                            class: "mx-auto",
                            elevation: "2"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCardItem, null, {
                                default: withCtx(() => [
                                  createVNode("div", null, [
                                    createVNode("div", { class: "text-overline mb-1" }, "Total Orders"),
                                    createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.totalOrders), 1),
                                    createVNode("div", { class: "text-caption" }, "All orders placed.")
                                  ])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(VCol, {
                        md: "4",
                        sm: "6",
                        cols: "12"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCard, {
                            class: "mx-auto",
                            elevation: "2"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCardItem, null, {
                                default: withCtx(() => [
                                  createVNode("div", null, [
                                    createVNode("div", { class: "text-overline mb-1" }, "Total Gas Cylinders"),
                                    createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.totalGasCylinders), 1),
                                    createVNode("div", { class: "text-caption" }, "Total number of gas cylinders available.")
                                  ])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(VCol, {
                        md: "4",
                        sm: "6",
                        cols: "12"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCard, {
                            class: "mx-auto",
                            elevation: "2"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCardItem, null, {
                                default: withCtx(() => [
                                  createVNode("div", null, [
                                    createVNode("div", { class: "text-overline mb-1" }, "Total Users"),
                                    createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.totalUsers), 1),
                                    createVNode("div", { class: "text-caption" }, "Total registered users.")
                                  ])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(VCol, {
                        md: "4",
                        sm: "6",
                        cols: "12"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCard, {
                            class: "mx-auto",
                            elevation: "2"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCardItem, null, {
                                default: withCtx(() => [
                                  createVNode("div", null, [
                                    createVNode("div", { class: "text-overline mb-1" }, "Total Revenue"),
                                    createVNode("div", { class: "text-h6 mb-1" }, "$" + toDisplayString(unref(dashboardStore).stats.totalRevenue.toFixed(2)), 1),
                                    createVNode("div", { class: "text-caption" }, "Sum of all completed order values.")
                                  ])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(VCol, {
                        md: "4",
                        sm: "6",
                        cols: "12"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCard, {
                            class: "mx-auto",
                            elevation: "2"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCardItem, null, {
                                default: withCtx(() => [
                                  createVNode("div", null, [
                                    createVNode("div", { class: "text-overline mb-1" }, "Average Order Value"),
                                    createVNode("div", { class: "text-h6 mb-1" }, "$" + toDisplayString(unref(dashboardStore).stats.averageOrderValue.toFixed(2)), 1),
                                    createVNode("div", { class: "text-caption" }, "Average value of completed orders.")
                                  ])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(VCol, {
                        md: "4",
                        sm: "6",
                        cols: "12"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCard, {
                            class: "mx-auto",
                            elevation: "2"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCardItem, null, {
                                default: withCtx(() => [
                                  createVNode("div", null, [
                                    createVNode("div", { class: "text-overline mb-1" }, "Pending Orders"),
                                    createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.pendingOrders), 1),
                                    createVNode("div", { class: "text-caption" }, "Orders awaiting processing or confirmation.")
                                  ])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(VCol, {
                        md: "4",
                        sm: "6",
                        cols: "12"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCard, {
                            class: "mx-auto",
                            elevation: "2"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCardItem, null, {
                                default: withCtx(() => [
                                  createVNode("div", null, [
                                    createVNode("div", { class: "text-overline mb-1" }, "Completed Orders"),
                                    createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.completedOrders), 1),
                                    createVNode("div", { class: "text-caption" }, "Successfully delivered orders.")
                                  ])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(VCol, {
                        md: "4",
                        sm: "6",
                        cols: "12"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCard, {
                            class: "mx-auto",
                            elevation: "2"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCardItem, null, {
                                default: withCtx(() => [
                                  createVNode("div", null, [
                                    createVNode("div", { class: "text-overline mb-1" }, "Cancelled Orders"),
                                    createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.cancelledOrders), 1),
                                    createVNode("div", { class: "text-caption" }, "Orders that have been cancelled.")
                                  ])
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
              _push2(`<!---->`);
            }
            if (!unref(dashboardStore).loading && !unref(dashboardStore).stats && !unref(dashboardStore).error) {
              _push2(ssrRenderComponent(VRow, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(VCol, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VAlert, { type: "info" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`No statistics available at the moment.`);
                              } else {
                                return [
                                  createTextVNode("No statistics available at the moment.")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(VAlert, { type: "info" }, {
                              default: withCtx(() => [
                                createTextVNode("No statistics available at the moment.")
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
                      createVNode(VCol, null, {
                        default: withCtx(() => [
                          createVNode(VAlert, { type: "info" }, {
                            default: withCtx(() => [
                              createTextVNode("No statistics available at the moment.")
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
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(VRow, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCol, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCard, {
                          class: "mt-5",
                          elevation: "1"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCardTitle, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Recent Activity`);
                                  } else {
                                    return [
                                      createTextVNode("Recent Activity")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VCardText, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<p class="text-grey" data-v-a7e0f5f2${_scopeId5}>This section can be populated with recent orders or user activities in a future update.</p>`);
                                  } else {
                                    return [
                                      createVNode("p", { class: "text-grey" }, "This section can be populated with recent orders or user activities in a future update.")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCardTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode("Recent Activity")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCardText, null, {
                                  default: withCtx(() => [
                                    createVNode("p", { class: "text-grey" }, "This section can be populated with recent orders or user activities in a future update.")
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
                          createVNode(VCard, {
                            class: "mt-5",
                            elevation: "1"
                          }, {
                            default: withCtx(() => [
                              createVNode(VCardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("Recent Activity")
                                ]),
                                _: 1
                              }),
                              createVNode(VCardText, null, {
                                default: withCtx(() => [
                                  createVNode("p", { class: "text-grey" }, "This section can be populated with recent orders or user activities in a future update.")
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
                    createVNode(VCol, null, {
                      default: withCtx(() => [
                        createVNode(VCard, {
                          class: "mt-5",
                          elevation: "1"
                        }, {
                          default: withCtx(() => [
                            createVNode(VCardTitle, null, {
                              default: withCtx(() => [
                                createTextVNode("Recent Activity")
                              ]),
                              _: 1
                            }),
                            createVNode(VCardText, null, {
                              default: withCtx(() => [
                                createVNode("p", { class: "text-grey" }, "This section can be populated with recent orders or user activities in a future update.")
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
              createVNode(VRow, null, {
                default: withCtx(() => [
                  createVNode(VCol, null, {
                    default: withCtx(() => [
                      createVNode("h1", null, "Dashboard"),
                      createVNode("p", null, "Welcome to the Admin Dashboard. Here's a quick overview of your store's performance.")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              unref(dashboardStore).loading ? (openBlock(), createBlock(VRow, { key: 0 }, {
                default: withCtx(() => [
                  (openBlock(), createBlock(Fragment, null, renderList(3, (n) => {
                    return createVNode(VCol, {
                      key: n,
                      md: "4"
                    }, {
                      default: withCtx(() => [
                        createVNode(VSkeletonLoader, { type: "card" })
                      ]),
                      _: 2
                    }, 1024);
                  }), 64))
                ]),
                _: 1
              })) : createCommentVNode("", true),
              !unref(dashboardStore).loading && unref(dashboardStore).stats ? (openBlock(), createBlock(VRow, { key: 1 }, {
                default: withCtx(() => [
                  createVNode(VCol, {
                    md: "4",
                    sm: "6",
                    cols: "12"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        class: "mx-auto",
                        elevation: "2"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCardItem, null, {
                            default: withCtx(() => [
                              createVNode("div", null, [
                                createVNode("div", { class: "text-overline mb-1" }, "Total Orders"),
                                createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.totalOrders), 1),
                                createVNode("div", { class: "text-caption" }, "All orders placed.")
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(VCol, {
                    md: "4",
                    sm: "6",
                    cols: "12"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        class: "mx-auto",
                        elevation: "2"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCardItem, null, {
                            default: withCtx(() => [
                              createVNode("div", null, [
                                createVNode("div", { class: "text-overline mb-1" }, "Total Gas Cylinders"),
                                createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.totalGasCylinders), 1),
                                createVNode("div", { class: "text-caption" }, "Total number of gas cylinders available.")
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(VCol, {
                    md: "4",
                    sm: "6",
                    cols: "12"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        class: "mx-auto",
                        elevation: "2"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCardItem, null, {
                            default: withCtx(() => [
                              createVNode("div", null, [
                                createVNode("div", { class: "text-overline mb-1" }, "Total Users"),
                                createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.totalUsers), 1),
                                createVNode("div", { class: "text-caption" }, "Total registered users.")
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(VCol, {
                    md: "4",
                    sm: "6",
                    cols: "12"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        class: "mx-auto",
                        elevation: "2"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCardItem, null, {
                            default: withCtx(() => [
                              createVNode("div", null, [
                                createVNode("div", { class: "text-overline mb-1" }, "Total Revenue"),
                                createVNode("div", { class: "text-h6 mb-1" }, "$" + toDisplayString(unref(dashboardStore).stats.totalRevenue.toFixed(2)), 1),
                                createVNode("div", { class: "text-caption" }, "Sum of all completed order values.")
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(VCol, {
                    md: "4",
                    sm: "6",
                    cols: "12"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        class: "mx-auto",
                        elevation: "2"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCardItem, null, {
                            default: withCtx(() => [
                              createVNode("div", null, [
                                createVNode("div", { class: "text-overline mb-1" }, "Average Order Value"),
                                createVNode("div", { class: "text-h6 mb-1" }, "$" + toDisplayString(unref(dashboardStore).stats.averageOrderValue.toFixed(2)), 1),
                                createVNode("div", { class: "text-caption" }, "Average value of completed orders.")
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(VCol, {
                    md: "4",
                    sm: "6",
                    cols: "12"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        class: "mx-auto",
                        elevation: "2"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCardItem, null, {
                            default: withCtx(() => [
                              createVNode("div", null, [
                                createVNode("div", { class: "text-overline mb-1" }, "Pending Orders"),
                                createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.pendingOrders), 1),
                                createVNode("div", { class: "text-caption" }, "Orders awaiting processing or confirmation.")
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(VCol, {
                    md: "4",
                    sm: "6",
                    cols: "12"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        class: "mx-auto",
                        elevation: "2"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCardItem, null, {
                            default: withCtx(() => [
                              createVNode("div", null, [
                                createVNode("div", { class: "text-overline mb-1" }, "Completed Orders"),
                                createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.completedOrders), 1),
                                createVNode("div", { class: "text-caption" }, "Successfully delivered orders.")
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(VCol, {
                    md: "4",
                    sm: "6",
                    cols: "12"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        class: "mx-auto",
                        elevation: "2"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCardItem, null, {
                            default: withCtx(() => [
                              createVNode("div", null, [
                                createVNode("div", { class: "text-overline mb-1" }, "Cancelled Orders"),
                                createVNode("div", { class: "text-h6 mb-1" }, toDisplayString(unref(dashboardStore).stats.cancelledOrders), 1),
                                createVNode("div", { class: "text-caption" }, "Orders that have been cancelled.")
                              ])
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
              })) : createCommentVNode("", true),
              !unref(dashboardStore).loading && !unref(dashboardStore).stats && !unref(dashboardStore).error ? (openBlock(), createBlock(VRow, { key: 2 }, {
                default: withCtx(() => [
                  createVNode(VCol, null, {
                    default: withCtx(() => [
                      createVNode(VAlert, { type: "info" }, {
                        default: withCtx(() => [
                          createTextVNode("No statistics available at the moment.")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })) : createCommentVNode("", true),
              createVNode(VRow, null, {
                default: withCtx(() => [
                  createVNode(VCol, null, {
                    default: withCtx(() => [
                      createVNode(VCard, {
                        class: "mt-5",
                        elevation: "1"
                      }, {
                        default: withCtx(() => [
                          createVNode(VCardTitle, null, {
                            default: withCtx(() => [
                              createTextVNode("Recent Activity")
                            ]),
                            _: 1
                          }),
                          createVNode(VCardText, null, {
                            default: withCtx(() => [
                              createVNode("p", { class: "text-grey" }, "This section can be populated with recent orders or user activities in a future update.")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a7e0f5f2"]]);

export { index as default };
//# sourceMappingURL=index-CUTTsUZz.mjs.map
