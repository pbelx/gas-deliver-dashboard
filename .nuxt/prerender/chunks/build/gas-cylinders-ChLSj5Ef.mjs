import { defineComponent, ref, computed, watch, resolveComponent, withCtx, createTextVNode, createVNode, unref, toDisplayString, createBlock, openBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/vue/index.mjs';
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList } from 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/vue/server-renderer/index.mjs';
import { defineStore } from 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/pinia/dist/pinia.prod.cjs';
import { e as useAuthStore, V as VContainer, f as VRow, g as VCol, w as VBtn, k as VAlert, i as VCard, l as VCardTitle, m as VCardText, v as VTextField, z as VSelect, I as VDataTable, h as VSkeletonLoader, D as VChip, E as VAvatar, L as VImg, q as VIcon, x as VDialog, G as VCardActions, H as VSpacer, d as useApiService } from './server.mjs';
import { u as useSuppliersStore } from './suppliers-CqKtBit9.mjs';
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

const useGasCylindersStore = defineStore("gasCylinders", {
  state: () => ({
    cylinders: [],
    loading: false,
    error: null,
    selectedCylinder: null
  }),
  getters: {
    availableCylinders: (state) => state.cylinders.filter((c) => c.isAvailable),
    cylindersByBrand: (state) => {
      const brands = state.cylinders.reduce((acc, cylinder) => {
        const brand = cylinder.brand || "Unknown";
        if (!acc[brand]) acc[brand] = [];
        acc[brand].push(cylinder);
        return acc;
      }, {});
      return brands;
    },
    lowStockCylinders: (state) => state.cylinders.filter((c) => c.stockQuantity <= 5)
  },
  actions: {
    async fetchCylinders() {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();
      try {
        const cylinders = await apiService.getAllGasCylinders(authStore.token || void 0);
        this.cylinders = cylinders;
      } catch (error) {
        this.error = error.message || "Failed to fetch gas cylinders";
        this.cylinders = [];
      } finally {
        this.loading = false;
      }
    },
    async fetchCylinderById(id) {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();
      try {
        const cylinder = await apiService.getGasCylinderById(id, authStore.token || void 0);
        this.selectedCylinder = cylinder;
        return cylinder;
      } catch (error) {
        this.error = error.message || "Failed to fetch gas cylinder";
        this.selectedCylinder = null;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async createCylinder(cylinderData) {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();
      if (!authStore.token) {
        this.error = "Authentication token not found. Please login.";
        this.loading = false;
        throw new Error(this.error);
      }
      try {
        const apiData = {
          ...cylinderData,
          isAvailable: true,
          // Default for new cylinders
          supplier: { id: cylinderData.supplierId }
          // API expects supplier object
        };
        const newCylinder = await apiService.createGasCylinder(apiData, authStore.token);
        this.cylinders.push(newCylinder);
        return newCylinder;
      } catch (error) {
        this.error = error.message || "Failed to create gas cylinder";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateCylinder(id, cylinderData) {
      var _a;
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();
      if (!authStore.token) {
        this.error = "Authentication token not found. Please login.";
        this.loading = false;
        throw new Error(this.error);
      }
      try {
        const updatedCylinder = await apiService.updateGasCylinder(id, cylinderData, authStore.token);
        const index = this.cylinders.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.cylinders[index] = updatedCylinder;
        }
        if (((_a = this.selectedCylinder) == null ? void 0 : _a.id) === id) {
          this.selectedCylinder = updatedCylinder;
        }
        return updatedCylinder;
      } catch (error) {
        this.error = error.message || "Failed to update gas cylinder";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteCylinder(id) {
      var _a;
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();
      if (!authStore.token) {
        this.error = "Authentication token not found. Please login.";
        this.loading = false;
        throw new Error(this.error);
      }
      try {
        await apiService.deleteGasCylinder(id, authStore.token);
        const index = this.cylinders.findIndex((c) => c.id === id);
        if (index !== -1) {
          this.cylinders.splice(index, 1);
        }
        if (((_a = this.selectedCylinder) == null ? void 0 : _a.id) === id) {
          this.selectedCylinder = null;
        }
        return true;
      } catch (error) {
        this.error = error.message || "Failed to delete gas cylinder";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    clearError() {
      this.error = null;
    },
    clearSelectedCylinder() {
      this.selectedCylinder = null;
    }
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "gas-cylinders",
  __ssrInlineRender: true,
  setup(__props) {
    const cylindersStore = useGasCylindersStore();
    const suppliersStore = useSuppliersStore();
    useAuthStore();
    const debugMode = ref(false);
    const headers = [
      { title: "Image", key: "imageUrl", sortable: false, width: "80px" },
      { title: "Name", key: "name" },
      { title: "Weight", key: "weight", width: "100px" },
      { title: "Price", key: "price", width: "120px" },
      { title: "Stock", key: "stockQuantity", width: "100px" },
      { title: "Available", key: "isAvailable", width: "120px" },
      { title: "Supplier", key: "supplier" },
      { title: "Actions", key: "actions", sortable: false, width: "150px" }
    ];
    const searchQuery = ref("");
    const selectedBrand = ref("");
    const availabilityFilter = ref("");
    const showViewDialog = ref(false);
    const filteredCylinders = computed(() => {
      let filtered = cylindersStore.cylinders || [];
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
          (cylinder) => {
            var _a, _b, _c, _d;
            return ((_a = cylinder.name) == null ? void 0 : _a.toLowerCase().includes(query)) || ((_b = cylinder.brand) == null ? void 0 : _b.toLowerCase().includes(query)) || ((_d = (_c = cylinder.supplier) == null ? void 0 : _c.name) == null ? void 0 : _d.toLowerCase().includes(query));
          }
        );
      }
      if (selectedBrand.value) {
        filtered = filtered.filter((cylinder) => cylinder.brand === selectedBrand.value);
      }
      if (availabilityFilter.value !== "") {
        const isAvailable = availabilityFilter.value === "available";
        filtered = filtered.filter((cylinder) => cylinder.isAvailable === isAvailable);
      }
      return filtered;
    });
    const brandOptions = computed(() => {
      const brands = [...new Set(cylindersStore.cylinders.map((c) => c.brand).filter(Boolean))];
      return brands.map((brand) => ({ value: brand, title: brand }));
    });
    const availabilityOptions = [
      { value: "available", title: "Available" },
      { value: "unavailable", title: "Unavailable" }
    ];
    const formatPrice = (price) => {
      return (price || 0).toLocaleString();
    };
    const getStockColor = (stock) => {
      if (stock <= 5) return "error";
      if (stock <= 10) return "warning";
      return "success";
    };
    const openCreateDialog = () => {
      console.log("Opening create dialog...");
    };
    const editCylinder = (cylinder) => {
      cylindersStore.selectedCylinder = cylinder;
      console.log("Editing cylinder:", cylinder.name);
    };
    const viewCylinder = (cylinder) => {
      cylindersStore.selectedCylinder = cylinder;
      showViewDialog.value = true;
    };
    const confirmDelete = (cylinder) => {
      if (confirm(`Are you sure you want to delete "${cylinder.name}"?`)) {
        console.log("Deleting cylinder:", cylinder.name);
      }
    };
    const refreshData = async () => {
      try {
        await Promise.all([
          cylindersStore.fetchCylinders(),
          suppliersStore.fetchSuppliers()
        ]);
      } catch (error) {
        console.error("Error refreshing data:", error);
      }
    };
    const manualRefresh = async () => {
      console.log("Manual refresh triggered");
      debugMode.value = true;
      await refreshData();
    };
    watch(() => suppliersStore.suppliers.length, (newLength) => {
      if (newLength === 0 && !suppliersStore.loading) {
        suppliersStore.fetchSuppliers();
      }
    });
    watch(() => cylindersStore.cylinders.length, (newLength) => {
      console.log("Cylinders array length changed:", newLength);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_v_simple_table = resolveComponent("v-simple-table");
      _push(ssrRenderComponent(VContainer, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VRow, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCol, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="d-flex justify-space-between align-center mb-4" data-v-bf6f7801${_scopeId3}><div data-v-bf6f7801${_scopeId3}><h1 class="text-h4" data-v-bf6f7801${_scopeId3}>Gas Cylinders</h1><p class="text-subtitle-1 text-grey" data-v-bf6f7801${_scopeId3}>Manage your gas cylinder inventory</p></div>`);
                        _push4(ssrRenderComponent(VBtn, {
                          color: "primary",
                          size: "large",
                          onClick: openCreateDialog,
                          "prepend-icon": "mdi-plus"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Add Cylinder `);
                            } else {
                              return [
                                createTextVNode(" Add Cylinder ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "d-flex justify-space-between align-center mb-4" }, [
                            createVNode("div", null, [
                              createVNode("h1", { class: "text-h4" }, "Gas Cylinders"),
                              createVNode("p", { class: "text-subtitle-1 text-grey" }, "Manage your gas cylinder inventory")
                            ]),
                            createVNode(VBtn, {
                              color: "primary",
                              size: "large",
                              onClick: openCreateDialog,
                              "prepend-icon": "mdi-plus"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Add Cylinder ")
                              ]),
                              _: 1
                            })
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VCol, null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "d-flex justify-space-between align-center mb-4" }, [
                          createVNode("div", null, [
                            createVNode("h1", { class: "text-h4" }, "Gas Cylinders"),
                            createVNode("p", { class: "text-subtitle-1 text-grey" }, "Manage your gas cylinder inventory")
                          ]),
                          createVNode(VBtn, {
                            color: "primary",
                            size: "large",
                            onClick: openCreateDialog,
                            "prepend-icon": "mdi-plus"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Add Cylinder ")
                            ]),
                            _: 1
                          })
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(cylindersStore).error) {
              _push2(ssrRenderComponent(VAlert, {
                type: "error",
                dismissible: "",
                class: "mb-4",
                "onClick:close": unref(cylindersStore).clearError
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(cylindersStore).error)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(cylindersStore).error), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(VCard, {
              class: "mb-4",
              color: "grey-lighten-5"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCardTitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`\u{1F41B} Debug Info`);
                      } else {
                        return [
                          createTextVNode("\u{1F41B} Debug Info")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VCardText, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VRow, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCol, {
                                cols: "12",
                                md: "6"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<strong data-v-bf6f7801${_scopeId5}>Cylinders Store State:</strong><ul data-v-bf6f7801${_scopeId5}><li data-v-bf6f7801${_scopeId5}>Loading: ${ssrInterpolate(unref(cylindersStore).loading)}</li><li data-v-bf6f7801${_scopeId5}>Error: ${ssrInterpolate(unref(cylindersStore).error || "None")}</li><li data-v-bf6f7801${_scopeId5}>Cylinders Count: ${ssrInterpolate(unref(cylindersStore).cylinders.length)}</li><li data-v-bf6f7801${_scopeId5}>Filtered Count: ${ssrInterpolate(filteredCylinders.value.length)}</li></ul>`);
                                  } else {
                                    return [
                                      createVNode("strong", null, "Cylinders Store State:"),
                                      createVNode("ul", null, [
                                        createVNode("li", null, "Loading: " + toDisplayString(unref(cylindersStore).loading), 1),
                                        createVNode("li", null, "Error: " + toDisplayString(unref(cylindersStore).error || "None"), 1),
                                        createVNode("li", null, "Cylinders Count: " + toDisplayString(unref(cylindersStore).cylinders.length), 1),
                                        createVNode("li", null, "Filtered Count: " + toDisplayString(filteredCylinders.value.length), 1)
                                      ])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VCol, {
                                cols: "12",
                                md: "6"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<strong data-v-bf6f7801${_scopeId5}>Sample Data:</strong>`);
                                    if (unref(cylindersStore).cylinders.length > 0) {
                                      _push6(`<pre style="${ssrRenderStyle({ "font-size": "12px", "max-height": "100px", "overflow": "auto" })}" data-v-bf6f7801${_scopeId5}>${ssrInterpolate(JSON.stringify(unref(cylindersStore).cylinders[0], null, 2))}</pre>`);
                                    } else {
                                      _push6(`<span data-v-bf6f7801${_scopeId5}>No cylinders loaded</span>`);
                                    }
                                  } else {
                                    return [
                                      createVNode("strong", null, "Sample Data:"),
                                      unref(cylindersStore).cylinders.length > 0 ? (openBlock(), createBlock("pre", {
                                        key: 0,
                                        style: { "font-size": "12px", "max-height": "100px", "overflow": "auto" }
                                      }, toDisplayString(JSON.stringify(unref(cylindersStore).cylinders[0], null, 2)), 1)) : (openBlock(), createBlock("span", { key: 1 }, "No cylinders loaded"))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCol, {
                                  cols: "12",
                                  md: "6"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("strong", null, "Cylinders Store State:"),
                                    createVNode("ul", null, [
                                      createVNode("li", null, "Loading: " + toDisplayString(unref(cylindersStore).loading), 1),
                                      createVNode("li", null, "Error: " + toDisplayString(unref(cylindersStore).error || "None"), 1),
                                      createVNode("li", null, "Cylinders Count: " + toDisplayString(unref(cylindersStore).cylinders.length), 1),
                                      createVNode("li", null, "Filtered Count: " + toDisplayString(filteredCylinders.value.length), 1)
                                    ])
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, {
                                  cols: "12",
                                  md: "6"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("strong", null, "Sample Data:"),
                                    unref(cylindersStore).cylinders.length > 0 ? (openBlock(), createBlock("pre", {
                                      key: 0,
                                      style: { "font-size": "12px", "max-height": "100px", "overflow": "auto" }
                                    }, toDisplayString(JSON.stringify(unref(cylindersStore).cylinders[0], null, 2)), 1)) : (openBlock(), createBlock("span", { key: 1 }, "No cylinders loaded"))
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VBtn, {
                          onClick: manualRefresh,
                          color: "warning"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Manual Debug Refresh`);
                            } else {
                              return [
                                createTextVNode("Manual Debug Refresh")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VRow, null, {
                            default: withCtx(() => [
                              createVNode(VCol, {
                                cols: "12",
                                md: "6"
                              }, {
                                default: withCtx(() => [
                                  createVNode("strong", null, "Cylinders Store State:"),
                                  createVNode("ul", null, [
                                    createVNode("li", null, "Loading: " + toDisplayString(unref(cylindersStore).loading), 1),
                                    createVNode("li", null, "Error: " + toDisplayString(unref(cylindersStore).error || "None"), 1),
                                    createVNode("li", null, "Cylinders Count: " + toDisplayString(unref(cylindersStore).cylinders.length), 1),
                                    createVNode("li", null, "Filtered Count: " + toDisplayString(filteredCylinders.value.length), 1)
                                  ])
                                ]),
                                _: 1
                              }),
                              createVNode(VCol, {
                                cols: "12",
                                md: "6"
                              }, {
                                default: withCtx(() => [
                                  createVNode("strong", null, "Sample Data:"),
                                  unref(cylindersStore).cylinders.length > 0 ? (openBlock(), createBlock("pre", {
                                    key: 0,
                                    style: { "font-size": "12px", "max-height": "100px", "overflow": "auto" }
                                  }, toDisplayString(JSON.stringify(unref(cylindersStore).cylinders[0], null, 2)), 1)) : (openBlock(), createBlock("span", { key: 1 }, "No cylinders loaded"))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(VBtn, {
                            onClick: manualRefresh,
                            color: "warning"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Manual Debug Refresh")
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
                    createVNode(VCardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode("\u{1F41B} Debug Info")
                      ]),
                      _: 1
                    }),
                    createVNode(VCardText, null, {
                      default: withCtx(() => [
                        createVNode(VRow, null, {
                          default: withCtx(() => [
                            createVNode(VCol, {
                              cols: "12",
                              md: "6"
                            }, {
                              default: withCtx(() => [
                                createVNode("strong", null, "Cylinders Store State:"),
                                createVNode("ul", null, [
                                  createVNode("li", null, "Loading: " + toDisplayString(unref(cylindersStore).loading), 1),
                                  createVNode("li", null, "Error: " + toDisplayString(unref(cylindersStore).error || "None"), 1),
                                  createVNode("li", null, "Cylinders Count: " + toDisplayString(unref(cylindersStore).cylinders.length), 1),
                                  createVNode("li", null, "Filtered Count: " + toDisplayString(filteredCylinders.value.length), 1)
                                ])
                              ]),
                              _: 1
                            }),
                            createVNode(VCol, {
                              cols: "12",
                              md: "6"
                            }, {
                              default: withCtx(() => [
                                createVNode("strong", null, "Sample Data:"),
                                unref(cylindersStore).cylinders.length > 0 ? (openBlock(), createBlock("pre", {
                                  key: 0,
                                  style: { "font-size": "12px", "max-height": "100px", "overflow": "auto" }
                                }, toDisplayString(JSON.stringify(unref(cylindersStore).cylinders[0], null, 2)), 1)) : (openBlock(), createBlock("span", { key: 1 }, "No cylinders loaded"))
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(VBtn, {
                          onClick: manualRefresh,
                          color: "warning"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Manual Debug Refresh")
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
            _push2(ssrRenderComponent(VRow, { class: "mb-6" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCol, {
                    cols: "12",
                    sm: "6",
                    md: "3"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCard, { class: "text-center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCardText, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="text-h5 primary--text" data-v-bf6f7801${_scopeId5}>${ssrInterpolate(unref(cylindersStore).cylinders.length)}</div><div class="text-subtitle-1" data-v-bf6f7801${_scopeId5}>Total Cylinders</div>`);
                                  } else {
                                    return [
                                      createVNode("div", { class: "text-h5 primary--text" }, toDisplayString(unref(cylindersStore).cylinders.length), 1),
                                      createVNode("div", { class: "text-subtitle-1" }, "Total Cylinders")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCardText, null, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "text-h5 primary--text" }, toDisplayString(unref(cylindersStore).cylinders.length), 1),
                                    createVNode("div", { class: "text-subtitle-1" }, "Total Cylinders")
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
                          createVNode(VCard, { class: "text-center" }, {
                            default: withCtx(() => [
                              createVNode(VCardText, null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "text-h5 primary--text" }, toDisplayString(unref(cylindersStore).cylinders.length), 1),
                                  createVNode("div", { class: "text-subtitle-1" }, "Total Cylinders")
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
                    cols: "12",
                    sm: "6",
                    md: "3"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCard, { class: "text-center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCardText, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="text-h5 success--text" data-v-bf6f7801${_scopeId5}>${ssrInterpolate(unref(cylindersStore).availableCylinders.length)}</div><div class="text-subtitle-1" data-v-bf6f7801${_scopeId5}>Available</div>`);
                                  } else {
                                    return [
                                      createVNode("div", { class: "text-h5 success--text" }, toDisplayString(unref(cylindersStore).availableCylinders.length), 1),
                                      createVNode("div", { class: "text-subtitle-1" }, "Available")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCardText, null, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "text-h5 success--text" }, toDisplayString(unref(cylindersStore).availableCylinders.length), 1),
                                    createVNode("div", { class: "text-subtitle-1" }, "Available")
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
                          createVNode(VCard, { class: "text-center" }, {
                            default: withCtx(() => [
                              createVNode(VCardText, null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "text-h5 success--text" }, toDisplayString(unref(cylindersStore).availableCylinders.length), 1),
                                  createVNode("div", { class: "text-subtitle-1" }, "Available")
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
                    cols: "12",
                    sm: "6",
                    md: "3"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCard, { class: "text-center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCardText, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="text-h5 warning--text" data-v-bf6f7801${_scopeId5}>${ssrInterpolate(unref(cylindersStore).lowStockCylinders.length)}</div><div class="text-subtitle-1" data-v-bf6f7801${_scopeId5}>Low Stock</div>`);
                                  } else {
                                    return [
                                      createVNode("div", { class: "text-h5 warning--text" }, toDisplayString(unref(cylindersStore).lowStockCylinders.length), 1),
                                      createVNode("div", { class: "text-subtitle-1" }, "Low Stock")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCardText, null, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "text-h5 warning--text" }, toDisplayString(unref(cylindersStore).lowStockCylinders.length), 1),
                                    createVNode("div", { class: "text-subtitle-1" }, "Low Stock")
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
                          createVNode(VCard, { class: "text-center" }, {
                            default: withCtx(() => [
                              createVNode(VCardText, null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "text-h5 warning--text" }, toDisplayString(unref(cylindersStore).lowStockCylinders.length), 1),
                                  createVNode("div", { class: "text-subtitle-1" }, "Low Stock")
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
                    cols: "12",
                    sm: "6",
                    md: "3"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCard, { class: "text-center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCardText, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="text-h5 info--text" data-v-bf6f7801${_scopeId5}>${ssrInterpolate(Object.keys(unref(cylindersStore).cylindersByBrand).length)}</div><div class="text-subtitle-1" data-v-bf6f7801${_scopeId5}>Brands</div>`);
                                  } else {
                                    return [
                                      createVNode("div", { class: "text-h5 info--text" }, toDisplayString(Object.keys(unref(cylindersStore).cylindersByBrand).length), 1),
                                      createVNode("div", { class: "text-subtitle-1" }, "Brands")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCardText, null, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "text-h5 info--text" }, toDisplayString(Object.keys(unref(cylindersStore).cylindersByBrand).length), 1),
                                    createVNode("div", { class: "text-subtitle-1" }, "Brands")
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
                          createVNode(VCard, { class: "text-center" }, {
                            default: withCtx(() => [
                              createVNode(VCardText, null, {
                                default: withCtx(() => [
                                  createVNode("div", { class: "text-h5 info--text" }, toDisplayString(Object.keys(unref(cylindersStore).cylindersByBrand).length), 1),
                                  createVNode("div", { class: "text-subtitle-1" }, "Brands")
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
                      sm: "6",
                      md: "3"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCard, { class: "text-center" }, {
                          default: withCtx(() => [
                            createVNode(VCardText, null, {
                              default: withCtx(() => [
                                createVNode("div", { class: "text-h5 primary--text" }, toDisplayString(unref(cylindersStore).cylinders.length), 1),
                                createVNode("div", { class: "text-subtitle-1" }, "Total Cylinders")
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
                      cols: "12",
                      sm: "6",
                      md: "3"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCard, { class: "text-center" }, {
                          default: withCtx(() => [
                            createVNode(VCardText, null, {
                              default: withCtx(() => [
                                createVNode("div", { class: "text-h5 success--text" }, toDisplayString(unref(cylindersStore).availableCylinders.length), 1),
                                createVNode("div", { class: "text-subtitle-1" }, "Available")
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
                      cols: "12",
                      sm: "6",
                      md: "3"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCard, { class: "text-center" }, {
                          default: withCtx(() => [
                            createVNode(VCardText, null, {
                              default: withCtx(() => [
                                createVNode("div", { class: "text-h5 warning--text" }, toDisplayString(unref(cylindersStore).lowStockCylinders.length), 1),
                                createVNode("div", { class: "text-subtitle-1" }, "Low Stock")
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
                      cols: "12",
                      sm: "6",
                      md: "3"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCard, { class: "text-center" }, {
                          default: withCtx(() => [
                            createVNode(VCardText, null, {
                              default: withCtx(() => [
                                createVNode("div", { class: "text-h5 info--text" }, toDisplayString(Object.keys(unref(cylindersStore).cylindersByBrand).length), 1),
                                createVNode("div", { class: "text-subtitle-1" }, "Brands")
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
            _push2(ssrRenderComponent(VCard, { class: "mb-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCardText, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VRow, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCol, {
                                cols: "12",
                                md: "4"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VTextField, {
                                      modelValue: searchQuery.value,
                                      "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                      label: "Search cylinders...",
                                      "prepend-inner-icon": "mdi-magnify",
                                      clearable: "",
                                      dense: "",
                                      outlined: ""
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VTextField, {
                                        modelValue: searchQuery.value,
                                        "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                        label: "Search cylinders...",
                                        "prepend-inner-icon": "mdi-magnify",
                                        clearable: "",
                                        dense: "",
                                        outlined: ""
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VCol, {
                                cols: "12",
                                md: "3"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VSelect, {
                                      modelValue: selectedBrand.value,
                                      "onUpdate:modelValue": ($event) => selectedBrand.value = $event,
                                      items: brandOptions.value,
                                      label: "Filter by Brand",
                                      clearable: "",
                                      dense: "",
                                      outlined: ""
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VSelect, {
                                        modelValue: selectedBrand.value,
                                        "onUpdate:modelValue": ($event) => selectedBrand.value = $event,
                                        items: brandOptions.value,
                                        label: "Filter by Brand",
                                        clearable: "",
                                        dense: "",
                                        outlined: ""
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VCol, {
                                cols: "12",
                                md: "3"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VSelect, {
                                      modelValue: availabilityFilter.value,
                                      "onUpdate:modelValue": ($event) => availabilityFilter.value = $event,
                                      items: availabilityOptions,
                                      label: "Availability",
                                      clearable: "",
                                      dense: "",
                                      outlined: ""
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VSelect, {
                                        modelValue: availabilityFilter.value,
                                        "onUpdate:modelValue": ($event) => availabilityFilter.value = $event,
                                        items: availabilityOptions,
                                        label: "Availability",
                                        clearable: "",
                                        dense: "",
                                        outlined: ""
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VCol, {
                                cols: "12",
                                md: "2"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VBtn, {
                                      color: "primary",
                                      block: "",
                                      onClick: refreshData,
                                      loading: unref(cylindersStore).loading
                                    }, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(` Refresh `);
                                        } else {
                                          return [
                                            createTextVNode(" Refresh ")
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VBtn, {
                                        color: "primary",
                                        block: "",
                                        onClick: refreshData,
                                        loading: unref(cylindersStore).loading
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(" Refresh ")
                                        ]),
                                        _: 1
                                      }, 8, ["loading"])
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCol, {
                                  cols: "12",
                                  md: "4"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VTextField, {
                                      modelValue: searchQuery.value,
                                      "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                      label: "Search cylinders...",
                                      "prepend-inner-icon": "mdi-magnify",
                                      clearable: "",
                                      dense: "",
                                      outlined: ""
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, {
                                  cols: "12",
                                  md: "3"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VSelect, {
                                      modelValue: selectedBrand.value,
                                      "onUpdate:modelValue": ($event) => selectedBrand.value = $event,
                                      items: brandOptions.value,
                                      label: "Filter by Brand",
                                      clearable: "",
                                      dense: "",
                                      outlined: ""
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, {
                                  cols: "12",
                                  md: "3"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VSelect, {
                                      modelValue: availabilityFilter.value,
                                      "onUpdate:modelValue": ($event) => availabilityFilter.value = $event,
                                      items: availabilityOptions,
                                      label: "Availability",
                                      clearable: "",
                                      dense: "",
                                      outlined: ""
                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, {
                                  cols: "12",
                                  md: "2"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VBtn, {
                                      color: "primary",
                                      block: "",
                                      onClick: refreshData,
                                      loading: unref(cylindersStore).loading
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" Refresh ")
                                      ]),
                                      _: 1
                                    }, 8, ["loading"])
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
                          createVNode(VRow, null, {
                            default: withCtx(() => [
                              createVNode(VCol, {
                                cols: "12",
                                md: "4"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VTextField, {
                                    modelValue: searchQuery.value,
                                    "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                    label: "Search cylinders...",
                                    "prepend-inner-icon": "mdi-magnify",
                                    clearable: "",
                                    dense: "",
                                    outlined: ""
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              }),
                              createVNode(VCol, {
                                cols: "12",
                                md: "3"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VSelect, {
                                    modelValue: selectedBrand.value,
                                    "onUpdate:modelValue": ($event) => selectedBrand.value = $event,
                                    items: brandOptions.value,
                                    label: "Filter by Brand",
                                    clearable: "",
                                    dense: "",
                                    outlined: ""
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                                ]),
                                _: 1
                              }),
                              createVNode(VCol, {
                                cols: "12",
                                md: "3"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VSelect, {
                                    modelValue: availabilityFilter.value,
                                    "onUpdate:modelValue": ($event) => availabilityFilter.value = $event,
                                    items: availabilityOptions,
                                    label: "Availability",
                                    clearable: "",
                                    dense: "",
                                    outlined: ""
                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                ]),
                                _: 1
                              }),
                              createVNode(VCol, {
                                cols: "12",
                                md: "2"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VBtn, {
                                    color: "primary",
                                    block: "",
                                    onClick: refreshData,
                                    loading: unref(cylindersStore).loading
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Refresh ")
                                    ]),
                                    _: 1
                                  }, 8, ["loading"])
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
                    createVNode(VCardText, null, {
                      default: withCtx(() => [
                        createVNode(VRow, null, {
                          default: withCtx(() => [
                            createVNode(VCol, {
                              cols: "12",
                              md: "4"
                            }, {
                              default: withCtx(() => [
                                createVNode(VTextField, {
                                  modelValue: searchQuery.value,
                                  "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                  label: "Search cylinders...",
                                  "prepend-inner-icon": "mdi-magnify",
                                  clearable: "",
                                  dense: "",
                                  outlined: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(VCol, {
                              cols: "12",
                              md: "3"
                            }, {
                              default: withCtx(() => [
                                createVNode(VSelect, {
                                  modelValue: selectedBrand.value,
                                  "onUpdate:modelValue": ($event) => selectedBrand.value = $event,
                                  items: brandOptions.value,
                                  label: "Filter by Brand",
                                  clearable: "",
                                  dense: "",
                                  outlined: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                              ]),
                              _: 1
                            }),
                            createVNode(VCol, {
                              cols: "12",
                              md: "3"
                            }, {
                              default: withCtx(() => [
                                createVNode(VSelect, {
                                  modelValue: availabilityFilter.value,
                                  "onUpdate:modelValue": ($event) => availabilityFilter.value = $event,
                                  items: availabilityOptions,
                                  label: "Availability",
                                  clearable: "",
                                  dense: "",
                                  outlined: ""
                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                              ]),
                              _: 1
                            }),
                            createVNode(VCol, {
                              cols: "12",
                              md: "2"
                            }, {
                              default: withCtx(() => [
                                createVNode(VBtn, {
                                  color: "primary",
                                  block: "",
                                  onClick: refreshData,
                                  loading: unref(cylindersStore).loading
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Refresh ")
                                  ]),
                                  _: 1
                                }, 8, ["loading"])
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
            _push2(ssrRenderComponent(VCard, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VDataTable, {
                    headers,
                    items: filteredCylinders.value,
                    loading: unref(cylindersStore).loading,
                    "item-value": "id",
                    class: "elevation-1",
                    "items-per-page": 10,
                    "no-data-text": unref(cylindersStore).loading ? "Loading cylinders..." : "No gas cylinders found"
                  }, {
                    "item.imageUrl": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VAvatar, {
                          size: "40",
                          class: "my-2"
                        }, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              if (item.imageUrl) {
                                _push5(ssrRenderComponent(VImg, {
                                  src: item.imageUrl,
                                  alt: item.name
                                }, null, _parent5, _scopeId4));
                              } else {
                                _push5(ssrRenderComponent(VIcon, null, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`mdi-gas-cylinder`);
                                    } else {
                                      return [
                                        createTextVNode("mdi-gas-cylinder")
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              }
                            } else {
                              return [
                                item.imageUrl ? (openBlock(), createBlock(VImg, {
                                  key: 0,
                                  src: item.imageUrl,
                                  alt: item.name
                                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock(VIcon, { key: 1 }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-gas-cylinder")
                                  ]),
                                  _: 1
                                }))
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VAvatar, {
                            size: "40",
                            class: "my-2"
                          }, {
                            default: withCtx(() => [
                              item.imageUrl ? (openBlock(), createBlock(VImg, {
                                key: 0,
                                src: item.imageUrl,
                                alt: item.name
                              }, null, 8, ["src", "alt"])) : (openBlock(), createBlock(VIcon, { key: 1 }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-gas-cylinder")
                                ]),
                                _: 1
                              }))
                            ]),
                            _: 2
                          }, 1024)
                        ];
                      }
                    }),
                    "item.name": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div data-v-bf6f7801${_scopeId3}><div class="font-weight-medium" data-v-bf6f7801${_scopeId3}>${ssrInterpolate(item.name || "Unknown")}</div><div class="text-caption text-grey" data-v-bf6f7801${_scopeId3}>${ssrInterpolate(item.brand || "No brand")}</div></div>`);
                      } else {
                        return [
                          createVNode("div", null, [
                            createVNode("div", { class: "font-weight-medium" }, toDisplayString(item.name || "Unknown"), 1),
                            createVNode("div", { class: "text-caption text-grey" }, toDisplayString(item.brand || "No brand"), 1)
                          ])
                        ];
                      }
                    }),
                    "item.weight": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span data-v-bf6f7801${_scopeId3}>${ssrInterpolate(item.weight || 0)} kg</span>`);
                      } else {
                        return [
                          createVNode("span", null, toDisplayString(item.weight || 0) + " kg", 1)
                        ];
                      }
                    }),
                    "item.price": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span data-v-bf6f7801${_scopeId3}>UGX ${ssrInterpolate(formatPrice(item.price))}</span>`);
                      } else {
                        return [
                          createVNode("span", null, "UGX " + toDisplayString(formatPrice(item.price)), 1)
                        ];
                      }
                    }),
                    "item.stockQuantity": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VChip, {
                          color: getStockColor(item.stockQuantity),
                          size: "small",
                          class: "ma-1"
                        }, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(item.stockQuantity || 0)}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(item.stockQuantity || 0), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VChip, {
                            color: getStockColor(item.stockQuantity),
                            size: "small",
                            class: "ma-1"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(item.stockQuantity || 0), 1)
                            ]),
                            _: 2
                          }, 1032, ["color"])
                        ];
                      }
                    }),
                    "item.isAvailable": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VChip, {
                          color: item.isAvailable ? "success" : "error",
                          size: "small",
                          class: "ma-1"
                        }, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(item.isAvailable ? "Available" : "Unavailable")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(item.isAvailable ? "Available" : "Unavailable"), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VChip, {
                            color: item.isAvailable ? "success" : "error",
                            size: "small",
                            class: "ma-1"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(item.isAvailable ? "Available" : "Unavailable"), 1)
                            ]),
                            _: 2
                          }, 1032, ["color"])
                        ];
                      }
                    }),
                    "item.supplier": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      var _a, _b;
                      if (_push4) {
                        _push4(`<span data-v-bf6f7801${_scopeId3}>${ssrInterpolate(((_a = item.supplier) == null ? void 0 : _a.name) || "No supplier")}</span>`);
                      } else {
                        return [
                          createVNode("span", null, toDisplayString(((_b = item.supplier) == null ? void 0 : _b.name) || "No supplier"), 1)
                        ];
                      }
                    }),
                    "item.actions": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="d-flex gap-1" data-v-bf6f7801${_scopeId3}>`);
                        _push4(ssrRenderComponent(VBtn, {
                          icon: "mdi-eye",
                          size: "small",
                          variant: "text",
                          onClick: ($event) => viewCylinder(item)
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VBtn, {
                          icon: "mdi-pencil",
                          size: "small",
                          variant: "text",
                          onClick: ($event) => editCylinder(item)
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VBtn, {
                          icon: "mdi-delete",
                          size: "small",
                          variant: "text",
                          color: "error",
                          onClick: ($event) => confirmDelete(item)
                        }, null, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "d-flex gap-1" }, [
                            createVNode(VBtn, {
                              icon: "mdi-eye",
                              size: "small",
                              variant: "text",
                              onClick: ($event) => viewCylinder(item)
                            }, null, 8, ["onClick"]),
                            createVNode(VBtn, {
                              icon: "mdi-pencil",
                              size: "small",
                              variant: "text",
                              onClick: ($event) => editCylinder(item)
                            }, null, 8, ["onClick"]),
                            createVNode(VBtn, {
                              icon: "mdi-delete",
                              size: "small",
                              variant: "text",
                              color: "error",
                              onClick: ($event) => confirmDelete(item)
                            }, null, 8, ["onClick"])
                          ])
                        ];
                      }
                    }),
                    loading: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VSkeletonLoader, { type: "table-tbody" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VSkeletonLoader, { type: "table-tbody" })
                        ];
                      }
                    }),
                    "no-data": withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VAlert, {
                          type: "info",
                          class: "ma-4"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(unref(cylindersStore).loading ? "Loading gas cylinders..." : 'No gas cylinders found. Click "Add Cylinder" to get started.')}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(unref(cylindersStore).loading ? "Loading gas cylinders..." : 'No gas cylinders found. Click "Add Cylinder" to get started.'), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VAlert, {
                            type: "info",
                            class: "ma-4"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(cylindersStore).loading ? "Loading gas cylinders..." : 'No gas cylinders found. Click "Add Cylinder" to get started.'), 1)
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
                    createVNode(VDataTable, {
                      headers,
                      items: filteredCylinders.value,
                      loading: unref(cylindersStore).loading,
                      "item-value": "id",
                      class: "elevation-1",
                      "items-per-page": 10,
                      "no-data-text": unref(cylindersStore).loading ? "Loading cylinders..." : "No gas cylinders found"
                    }, {
                      "item.imageUrl": withCtx(({ item }) => [
                        createVNode(VAvatar, {
                          size: "40",
                          class: "my-2"
                        }, {
                          default: withCtx(() => [
                            item.imageUrl ? (openBlock(), createBlock(VImg, {
                              key: 0,
                              src: item.imageUrl,
                              alt: item.name
                            }, null, 8, ["src", "alt"])) : (openBlock(), createBlock(VIcon, { key: 1 }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-gas-cylinder")
                              ]),
                              _: 1
                            }))
                          ]),
                          _: 2
                        }, 1024)
                      ]),
                      "item.name": withCtx(({ item }) => [
                        createVNode("div", null, [
                          createVNode("div", { class: "font-weight-medium" }, toDisplayString(item.name || "Unknown"), 1),
                          createVNode("div", { class: "text-caption text-grey" }, toDisplayString(item.brand || "No brand"), 1)
                        ])
                      ]),
                      "item.weight": withCtx(({ item }) => [
                        createVNode("span", null, toDisplayString(item.weight || 0) + " kg", 1)
                      ]),
                      "item.price": withCtx(({ item }) => [
                        createVNode("span", null, "UGX " + toDisplayString(formatPrice(item.price)), 1)
                      ]),
                      "item.stockQuantity": withCtx(({ item }) => [
                        createVNode(VChip, {
                          color: getStockColor(item.stockQuantity),
                          size: "small",
                          class: "ma-1"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(item.stockQuantity || 0), 1)
                          ]),
                          _: 2
                        }, 1032, ["color"])
                      ]),
                      "item.isAvailable": withCtx(({ item }) => [
                        createVNode(VChip, {
                          color: item.isAvailable ? "success" : "error",
                          size: "small",
                          class: "ma-1"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(item.isAvailable ? "Available" : "Unavailable"), 1)
                          ]),
                          _: 2
                        }, 1032, ["color"])
                      ]),
                      "item.supplier": withCtx(({ item }) => {
                        var _a;
                        return [
                          createVNode("span", null, toDisplayString(((_a = item.supplier) == null ? void 0 : _a.name) || "No supplier"), 1)
                        ];
                      }),
                      "item.actions": withCtx(({ item }) => [
                        createVNode("div", { class: "d-flex gap-1" }, [
                          createVNode(VBtn, {
                            icon: "mdi-eye",
                            size: "small",
                            variant: "text",
                            onClick: ($event) => viewCylinder(item)
                          }, null, 8, ["onClick"]),
                          createVNode(VBtn, {
                            icon: "mdi-pencil",
                            size: "small",
                            variant: "text",
                            onClick: ($event) => editCylinder(item)
                          }, null, 8, ["onClick"]),
                          createVNode(VBtn, {
                            icon: "mdi-delete",
                            size: "small",
                            variant: "text",
                            color: "error",
                            onClick: ($event) => confirmDelete(item)
                          }, null, 8, ["onClick"])
                        ])
                      ]),
                      loading: withCtx(() => [
                        createVNode(VSkeletonLoader, { type: "table-tbody" })
                      ]),
                      "no-data": withCtx(() => [
                        createVNode(VAlert, {
                          type: "info",
                          class: "ma-4"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(cylindersStore).loading ? "Loading gas cylinders..." : 'No gas cylinders found. Click "Add Cylinder" to get started.'), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["items", "loading", "no-data-text"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (filteredCylinders.value.length > 0 && debugMode.value) {
              _push2(ssrRenderComponent(VCard, { class: "mt-4" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(VCardTitle, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Fallback Table View`);
                        } else {
                          return [
                            createTextVNode("Fallback Table View")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(VCardText, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_v_simple_table, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<thead data-v-bf6f7801${_scopeId4}><tr data-v-bf6f7801${_scopeId4}><th data-v-bf6f7801${_scopeId4}>Name</th><th data-v-bf6f7801${_scopeId4}>Brand</th><th data-v-bf6f7801${_scopeId4}>Weight</th><th data-v-bf6f7801${_scopeId4}>Price</th><th data-v-bf6f7801${_scopeId4}>Stock</th><th data-v-bf6f7801${_scopeId4}>Supplier</th></tr></thead><tbody data-v-bf6f7801${_scopeId4}><!--[-->`);
                                ssrRenderList(filteredCylinders.value.slice(0, 5), (cylinder) => {
                                  var _a;
                                  _push5(`<tr data-v-bf6f7801${_scopeId4}><td data-v-bf6f7801${_scopeId4}>${ssrInterpolate(cylinder.name)}</td><td data-v-bf6f7801${_scopeId4}>${ssrInterpolate(cylinder.brand || "N/A")}</td><td data-v-bf6f7801${_scopeId4}>${ssrInterpolate(cylinder.weight)} kg</td><td data-v-bf6f7801${_scopeId4}>UGX ${ssrInterpolate(formatPrice(cylinder.price))}</td><td data-v-bf6f7801${_scopeId4}>${ssrInterpolate(cylinder.stockQuantity)}</td><td data-v-bf6f7801${_scopeId4}>${ssrInterpolate(((_a = cylinder.supplier) == null ? void 0 : _a.name) || "N/A")}</td></tr>`);
                                });
                                _push5(`<!--]--></tbody>`);
                              } else {
                                return [
                                  createVNode("thead", null, [
                                    createVNode("tr", null, [
                                      createVNode("th", null, "Name"),
                                      createVNode("th", null, "Brand"),
                                      createVNode("th", null, "Weight"),
                                      createVNode("th", null, "Price"),
                                      createVNode("th", null, "Stock"),
                                      createVNode("th", null, "Supplier")
                                    ])
                                  ]),
                                  createVNode("tbody", null, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(filteredCylinders.value.slice(0, 5), (cylinder) => {
                                      var _a;
                                      return openBlock(), createBlock("tr", {
                                        key: cylinder.id
                                      }, [
                                        createVNode("td", null, toDisplayString(cylinder.name), 1),
                                        createVNode("td", null, toDisplayString(cylinder.brand || "N/A"), 1),
                                        createVNode("td", null, toDisplayString(cylinder.weight) + " kg", 1),
                                        createVNode("td", null, "UGX " + toDisplayString(formatPrice(cylinder.price)), 1),
                                        createVNode("td", null, toDisplayString(cylinder.stockQuantity), 1),
                                        createVNode("td", null, toDisplayString(((_a = cylinder.supplier) == null ? void 0 : _a.name) || "N/A"), 1)
                                      ]);
                                    }), 128))
                                  ])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_v_simple_table, null, {
                              default: withCtx(() => [
                                createVNode("thead", null, [
                                  createVNode("tr", null, [
                                    createVNode("th", null, "Name"),
                                    createVNode("th", null, "Brand"),
                                    createVNode("th", null, "Weight"),
                                    createVNode("th", null, "Price"),
                                    createVNode("th", null, "Stock"),
                                    createVNode("th", null, "Supplier")
                                  ])
                                ]),
                                createVNode("tbody", null, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(filteredCylinders.value.slice(0, 5), (cylinder) => {
                                    var _a;
                                    return openBlock(), createBlock("tr", {
                                      key: cylinder.id
                                    }, [
                                      createVNode("td", null, toDisplayString(cylinder.name), 1),
                                      createVNode("td", null, toDisplayString(cylinder.brand || "N/A"), 1),
                                      createVNode("td", null, toDisplayString(cylinder.weight) + " kg", 1),
                                      createVNode("td", null, "UGX " + toDisplayString(formatPrice(cylinder.price)), 1),
                                      createVNode("td", null, toDisplayString(cylinder.stockQuantity), 1),
                                      createVNode("td", null, toDisplayString(((_a = cylinder.supplier) == null ? void 0 : _a.name) || "N/A"), 1)
                                    ]);
                                  }), 128))
                                ])
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
                      createVNode(VCardTitle, null, {
                        default: withCtx(() => [
                          createTextVNode("Fallback Table View")
                        ]),
                        _: 1
                      }),
                      createVNode(VCardText, null, {
                        default: withCtx(() => [
                          createVNode(_component_v_simple_table, null, {
                            default: withCtx(() => [
                              createVNode("thead", null, [
                                createVNode("tr", null, [
                                  createVNode("th", null, "Name"),
                                  createVNode("th", null, "Brand"),
                                  createVNode("th", null, "Weight"),
                                  createVNode("th", null, "Price"),
                                  createVNode("th", null, "Stock"),
                                  createVNode("th", null, "Supplier")
                                ])
                              ]),
                              createVNode("tbody", null, [
                                (openBlock(true), createBlock(Fragment, null, renderList(filteredCylinders.value.slice(0, 5), (cylinder) => {
                                  var _a;
                                  return openBlock(), createBlock("tr", {
                                    key: cylinder.id
                                  }, [
                                    createVNode("td", null, toDisplayString(cylinder.name), 1),
                                    createVNode("td", null, toDisplayString(cylinder.brand || "N/A"), 1),
                                    createVNode("td", null, toDisplayString(cylinder.weight) + " kg", 1),
                                    createVNode("td", null, "UGX " + toDisplayString(formatPrice(cylinder.price)), 1),
                                    createVNode("td", null, toDisplayString(cylinder.stockQuantity), 1),
                                    createVNode("td", null, toDisplayString(((_a = cylinder.supplier) == null ? void 0 : _a.name) || "N/A"), 1)
                                  ]);
                                }), 128))
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
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(VDialog, {
              modelValue: showViewDialog.value,
              "onUpdate:modelValue": ($event) => showViewDialog.value = $event,
              "max-width": "500px"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(cylindersStore).selectedCylinder) {
                    _push3(ssrRenderComponent(VCard, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VCardTitle, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<span class="text-h5" data-v-bf6f7801${_scopeId4}>${ssrInterpolate(unref(cylindersStore).selectedCylinder.name)}</span>`);
                              } else {
                                return [
                                  createVNode("span", { class: "text-h5" }, toDisplayString(unref(cylindersStore).selectedCylinder.name), 1)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(VCardText, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VRow, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      if (unref(cylindersStore).selectedCylinder.imageUrl) {
                                        _push6(ssrRenderComponent(VCol, { cols: "12" }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(VImg, {
                                                src: unref(cylindersStore).selectedCylinder.imageUrl,
                                                alt: unref(cylindersStore).selectedCylinder.name,
                                                "max-height": "200",
                                                contain: ""
                                              }, null, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(VImg, {
                                                  src: unref(cylindersStore).selectedCylinder.imageUrl,
                                                  alt: unref(cylindersStore).selectedCylinder.name,
                                                  "max-height": "200",
                                                  contain: ""
                                                }, null, 8, ["src", "alt"])
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                      _push6(ssrRenderComponent(VCol, { cols: "6" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<strong data-v-bf6f7801${_scopeId6}>Brand:</strong> ${ssrInterpolate(unref(cylindersStore).selectedCylinder.brand || "N/A")}`);
                                          } else {
                                            return [
                                              createVNode("strong", null, "Brand:"),
                                              createTextVNode(" " + toDisplayString(unref(cylindersStore).selectedCylinder.brand || "N/A"), 1)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(VCol, { cols: "6" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<strong data-v-bf6f7801${_scopeId6}>Weight:</strong> ${ssrInterpolate(unref(cylindersStore).selectedCylinder.weight)} kg `);
                                          } else {
                                            return [
                                              createVNode("strong", null, "Weight:"),
                                              createTextVNode(" " + toDisplayString(unref(cylindersStore).selectedCylinder.weight) + " kg ", 1)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(VCol, { cols: "6" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<strong data-v-bf6f7801${_scopeId6}>Price:</strong> UGX ${ssrInterpolate(formatPrice(unref(cylindersStore).selectedCylinder.price))}`);
                                          } else {
                                            return [
                                              createVNode("strong", null, "Price:"),
                                              createTextVNode(" UGX " + toDisplayString(formatPrice(unref(cylindersStore).selectedCylinder.price)), 1)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(VCol, { cols: "6" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<strong data-v-bf6f7801${_scopeId6}>Stock:</strong> ${ssrInterpolate(unref(cylindersStore).selectedCylinder.stockQuantity)}`);
                                          } else {
                                            return [
                                              createVNode("strong", null, "Stock:"),
                                              createTextVNode(" " + toDisplayString(unref(cylindersStore).selectedCylinder.stockQuantity), 1)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(VCol, { cols: "6" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          var _a, _b;
                                          if (_push7) {
                                            _push7(`<strong data-v-bf6f7801${_scopeId6}>Supplier:</strong> ${ssrInterpolate(((_a = unref(cylindersStore).selectedCylinder.supplier) == null ? void 0 : _a.name) || "N/A")}`);
                                          } else {
                                            return [
                                              createVNode("strong", null, "Supplier:"),
                                              createTextVNode(" " + toDisplayString(((_b = unref(cylindersStore).selectedCylinder.supplier) == null ? void 0 : _b.name) || "N/A"), 1)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(VCol, { cols: "6" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<strong data-v-bf6f7801${_scopeId6}>Status:</strong>`);
                                            _push7(ssrRenderComponent(VChip, {
                                              color: unref(cylindersStore).selectedCylinder.isAvailable ? "success" : "error",
                                              size: "small"
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(unref(cylindersStore).selectedCylinder.isAvailable ? "Available" : "Unavailable")}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(unref(cylindersStore).selectedCylinder.isAvailable ? "Available" : "Unavailable"), 1)
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode("strong", null, "Status:"),
                                              createVNode(VChip, {
                                                color: unref(cylindersStore).selectedCylinder.isAvailable ? "success" : "error",
                                                size: "small"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(unref(cylindersStore).selectedCylinder.isAvailable ? "Available" : "Unavailable"), 1)
                                                ]),
                                                _: 1
                                              }, 8, ["color"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      if (unref(cylindersStore).selectedCylinder.description) {
                                        _push6(ssrRenderComponent(VCol, { cols: "12" }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`<strong data-v-bf6f7801${_scopeId6}>Description:</strong><p class="mt-2" data-v-bf6f7801${_scopeId6}>${ssrInterpolate(unref(cylindersStore).selectedCylinder.description)}</p>`);
                                            } else {
                                              return [
                                                createVNode("strong", null, "Description:"),
                                                createVNode("p", { class: "mt-2" }, toDisplayString(unref(cylindersStore).selectedCylinder.description), 1)
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                    } else {
                                      return [
                                        unref(cylindersStore).selectedCylinder.imageUrl ? (openBlock(), createBlock(VCol, {
                                          key: 0,
                                          cols: "12"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VImg, {
                                              src: unref(cylindersStore).selectedCylinder.imageUrl,
                                              alt: unref(cylindersStore).selectedCylinder.name,
                                              "max-height": "200",
                                              contain: ""
                                            }, null, 8, ["src", "alt"])
                                          ]),
                                          _: 1
                                        })) : createCommentVNode("", true),
                                        createVNode(VCol, { cols: "6" }, {
                                          default: withCtx(() => [
                                            createVNode("strong", null, "Brand:"),
                                            createTextVNode(" " + toDisplayString(unref(cylindersStore).selectedCylinder.brand || "N/A"), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, { cols: "6" }, {
                                          default: withCtx(() => [
                                            createVNode("strong", null, "Weight:"),
                                            createTextVNode(" " + toDisplayString(unref(cylindersStore).selectedCylinder.weight) + " kg ", 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, { cols: "6" }, {
                                          default: withCtx(() => [
                                            createVNode("strong", null, "Price:"),
                                            createTextVNode(" UGX " + toDisplayString(formatPrice(unref(cylindersStore).selectedCylinder.price)), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, { cols: "6" }, {
                                          default: withCtx(() => [
                                            createVNode("strong", null, "Stock:"),
                                            createTextVNode(" " + toDisplayString(unref(cylindersStore).selectedCylinder.stockQuantity), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, { cols: "6" }, {
                                          default: withCtx(() => {
                                            var _a;
                                            return [
                                              createVNode("strong", null, "Supplier:"),
                                              createTextVNode(" " + toDisplayString(((_a = unref(cylindersStore).selectedCylinder.supplier) == null ? void 0 : _a.name) || "N/A"), 1)
                                            ];
                                          }),
                                          _: 1
                                        }),
                                        createVNode(VCol, { cols: "6" }, {
                                          default: withCtx(() => [
                                            createVNode("strong", null, "Status:"),
                                            createVNode(VChip, {
                                              color: unref(cylindersStore).selectedCylinder.isAvailable ? "success" : "error",
                                              size: "small"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(unref(cylindersStore).selectedCylinder.isAvailable ? "Available" : "Unavailable"), 1)
                                              ]),
                                              _: 1
                                            }, 8, ["color"])
                                          ]),
                                          _: 1
                                        }),
                                        unref(cylindersStore).selectedCylinder.description ? (openBlock(), createBlock(VCol, {
                                          key: 1,
                                          cols: "12"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("strong", null, "Description:"),
                                            createVNode("p", { class: "mt-2" }, toDisplayString(unref(cylindersStore).selectedCylinder.description), 1)
                                          ]),
                                          _: 1
                                        })) : createCommentVNode("", true)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VRow, null, {
                                    default: withCtx(() => [
                                      unref(cylindersStore).selectedCylinder.imageUrl ? (openBlock(), createBlock(VCol, {
                                        key: 0,
                                        cols: "12"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VImg, {
                                            src: unref(cylindersStore).selectedCylinder.imageUrl,
                                            alt: unref(cylindersStore).selectedCylinder.name,
                                            "max-height": "200",
                                            contain: ""
                                          }, null, 8, ["src", "alt"])
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true),
                                      createVNode(VCol, { cols: "6" }, {
                                        default: withCtx(() => [
                                          createVNode("strong", null, "Brand:"),
                                          createTextVNode(" " + toDisplayString(unref(cylindersStore).selectedCylinder.brand || "N/A"), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, { cols: "6" }, {
                                        default: withCtx(() => [
                                          createVNode("strong", null, "Weight:"),
                                          createTextVNode(" " + toDisplayString(unref(cylindersStore).selectedCylinder.weight) + " kg ", 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, { cols: "6" }, {
                                        default: withCtx(() => [
                                          createVNode("strong", null, "Price:"),
                                          createTextVNode(" UGX " + toDisplayString(formatPrice(unref(cylindersStore).selectedCylinder.price)), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, { cols: "6" }, {
                                        default: withCtx(() => [
                                          createVNode("strong", null, "Stock:"),
                                          createTextVNode(" " + toDisplayString(unref(cylindersStore).selectedCylinder.stockQuantity), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, { cols: "6" }, {
                                        default: withCtx(() => {
                                          var _a;
                                          return [
                                            createVNode("strong", null, "Supplier:"),
                                            createTextVNode(" " + toDisplayString(((_a = unref(cylindersStore).selectedCylinder.supplier) == null ? void 0 : _a.name) || "N/A"), 1)
                                          ];
                                        }),
                                        _: 1
                                      }),
                                      createVNode(VCol, { cols: "6" }, {
                                        default: withCtx(() => [
                                          createVNode("strong", null, "Status:"),
                                          createVNode(VChip, {
                                            color: unref(cylindersStore).selectedCylinder.isAvailable ? "success" : "error",
                                            size: "small"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(unref(cylindersStore).selectedCylinder.isAvailable ? "Available" : "Unavailable"), 1)
                                            ]),
                                            _: 1
                                          }, 8, ["color"])
                                        ]),
                                        _: 1
                                      }),
                                      unref(cylindersStore).selectedCylinder.description ? (openBlock(), createBlock(VCol, {
                                        key: 1,
                                        cols: "12"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("strong", null, "Description:"),
                                          createVNode("p", { class: "mt-2" }, toDisplayString(unref(cylindersStore).selectedCylinder.description), 1)
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true)
                                    ]),
                                    _: 1
                                  })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(VCardActions, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VSpacer, null, null, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(VBtn, {
                                  text: "",
                                  onClick: ($event) => showViewDialog.value = false
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`Close`);
                                    } else {
                                      return [
                                        createTextVNode("Close")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(VBtn, {
                                  color: "primary",
                                  onClick: ($event) => editCylinder(unref(cylindersStore).selectedCylinder)
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(` Edit `);
                                    } else {
                                      return [
                                        createTextVNode(" Edit ")
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VSpacer),
                                  createVNode(VBtn, {
                                    text: "",
                                    onClick: ($event) => showViewDialog.value = false
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Close")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"]),
                                  createVNode(VBtn, {
                                    color: "primary",
                                    onClick: ($event) => editCylinder(unref(cylindersStore).selectedCylinder)
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Edit ")
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(VCardTitle, null, {
                              default: withCtx(() => [
                                createVNode("span", { class: "text-h5" }, toDisplayString(unref(cylindersStore).selectedCylinder.name), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(VCardText, null, {
                              default: withCtx(() => [
                                createVNode(VRow, null, {
                                  default: withCtx(() => [
                                    unref(cylindersStore).selectedCylinder.imageUrl ? (openBlock(), createBlock(VCol, {
                                      key: 0,
                                      cols: "12"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VImg, {
                                          src: unref(cylindersStore).selectedCylinder.imageUrl,
                                          alt: unref(cylindersStore).selectedCylinder.name,
                                          "max-height": "200",
                                          contain: ""
                                        }, null, 8, ["src", "alt"])
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true),
                                    createVNode(VCol, { cols: "6" }, {
                                      default: withCtx(() => [
                                        createVNode("strong", null, "Brand:"),
                                        createTextVNode(" " + toDisplayString(unref(cylindersStore).selectedCylinder.brand || "N/A"), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, { cols: "6" }, {
                                      default: withCtx(() => [
                                        createVNode("strong", null, "Weight:"),
                                        createTextVNode(" " + toDisplayString(unref(cylindersStore).selectedCylinder.weight) + " kg ", 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, { cols: "6" }, {
                                      default: withCtx(() => [
                                        createVNode("strong", null, "Price:"),
                                        createTextVNode(" UGX " + toDisplayString(formatPrice(unref(cylindersStore).selectedCylinder.price)), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, { cols: "6" }, {
                                      default: withCtx(() => [
                                        createVNode("strong", null, "Stock:"),
                                        createTextVNode(" " + toDisplayString(unref(cylindersStore).selectedCylinder.stockQuantity), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, { cols: "6" }, {
                                      default: withCtx(() => {
                                        var _a;
                                        return [
                                          createVNode("strong", null, "Supplier:"),
                                          createTextVNode(" " + toDisplayString(((_a = unref(cylindersStore).selectedCylinder.supplier) == null ? void 0 : _a.name) || "N/A"), 1)
                                        ];
                                      }),
                                      _: 1
                                    }),
                                    createVNode(VCol, { cols: "6" }, {
                                      default: withCtx(() => [
                                        createVNode("strong", null, "Status:"),
                                        createVNode(VChip, {
                                          color: unref(cylindersStore).selectedCylinder.isAvailable ? "success" : "error",
                                          size: "small"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(unref(cylindersStore).selectedCylinder.isAvailable ? "Available" : "Unavailable"), 1)
                                          ]),
                                          _: 1
                                        }, 8, ["color"])
                                      ]),
                                      _: 1
                                    }),
                                    unref(cylindersStore).selectedCylinder.description ? (openBlock(), createBlock(VCol, {
                                      key: 1,
                                      cols: "12"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("strong", null, "Description:"),
                                        createVNode("p", { class: "mt-2" }, toDisplayString(unref(cylindersStore).selectedCylinder.description), 1)
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true)
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode(VCardActions, null, {
                              default: withCtx(() => [
                                createVNode(VSpacer),
                                createVNode(VBtn, {
                                  text: "",
                                  onClick: ($event) => showViewDialog.value = false
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Close")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"]),
                                createVNode(VBtn, {
                                  color: "primary",
                                  onClick: ($event) => editCylinder(unref(cylindersStore).selectedCylinder)
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Edit ")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    unref(cylindersStore).selectedCylinder ? (openBlock(), createBlock(VCard, { key: 0 }, {
                      default: withCtx(() => [
                        createVNode(VCardTitle, null, {
                          default: withCtx(() => [
                            createVNode("span", { class: "text-h5" }, toDisplayString(unref(cylindersStore).selectedCylinder.name), 1)
                          ]),
                          _: 1
                        }),
                        createVNode(VCardText, null, {
                          default: withCtx(() => [
                            createVNode(VRow, null, {
                              default: withCtx(() => [
                                unref(cylindersStore).selectedCylinder.imageUrl ? (openBlock(), createBlock(VCol, {
                                  key: 0,
                                  cols: "12"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VImg, {
                                      src: unref(cylindersStore).selectedCylinder.imageUrl,
                                      alt: unref(cylindersStore).selectedCylinder.name,
                                      "max-height": "200",
                                      contain: ""
                                    }, null, 8, ["src", "alt"])
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                createVNode(VCol, { cols: "6" }, {
                                  default: withCtx(() => [
                                    createVNode("strong", null, "Brand:"),
                                    createTextVNode(" " + toDisplayString(unref(cylindersStore).selectedCylinder.brand || "N/A"), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, { cols: "6" }, {
                                  default: withCtx(() => [
                                    createVNode("strong", null, "Weight:"),
                                    createTextVNode(" " + toDisplayString(unref(cylindersStore).selectedCylinder.weight) + " kg ", 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, { cols: "6" }, {
                                  default: withCtx(() => [
                                    createVNode("strong", null, "Price:"),
                                    createTextVNode(" UGX " + toDisplayString(formatPrice(unref(cylindersStore).selectedCylinder.price)), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, { cols: "6" }, {
                                  default: withCtx(() => [
                                    createVNode("strong", null, "Stock:"),
                                    createTextVNode(" " + toDisplayString(unref(cylindersStore).selectedCylinder.stockQuantity), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, { cols: "6" }, {
                                  default: withCtx(() => {
                                    var _a;
                                    return [
                                      createVNode("strong", null, "Supplier:"),
                                      createTextVNode(" " + toDisplayString(((_a = unref(cylindersStore).selectedCylinder.supplier) == null ? void 0 : _a.name) || "N/A"), 1)
                                    ];
                                  }),
                                  _: 1
                                }),
                                createVNode(VCol, { cols: "6" }, {
                                  default: withCtx(() => [
                                    createVNode("strong", null, "Status:"),
                                    createVNode(VChip, {
                                      color: unref(cylindersStore).selectedCylinder.isAvailable ? "success" : "error",
                                      size: "small"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(unref(cylindersStore).selectedCylinder.isAvailable ? "Available" : "Unavailable"), 1)
                                      ]),
                                      _: 1
                                    }, 8, ["color"])
                                  ]),
                                  _: 1
                                }),
                                unref(cylindersStore).selectedCylinder.description ? (openBlock(), createBlock(VCol, {
                                  key: 1,
                                  cols: "12"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("strong", null, "Description:"),
                                    createVNode("p", { class: "mt-2" }, toDisplayString(unref(cylindersStore).selectedCylinder.description), 1)
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true)
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(VCardActions, null, {
                          default: withCtx(() => [
                            createVNode(VSpacer),
                            createVNode(VBtn, {
                              text: "",
                              onClick: ($event) => showViewDialog.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Close")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(VBtn, {
                              color: "primary",
                              onClick: ($event) => editCylinder(unref(cylindersStore).selectedCylinder)
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Edit ")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
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
                      createVNode("div", { class: "d-flex justify-space-between align-center mb-4" }, [
                        createVNode("div", null, [
                          createVNode("h1", { class: "text-h4" }, "Gas Cylinders"),
                          createVNode("p", { class: "text-subtitle-1 text-grey" }, "Manage your gas cylinder inventory")
                        ]),
                        createVNode(VBtn, {
                          color: "primary",
                          size: "large",
                          onClick: openCreateDialog,
                          "prepend-icon": "mdi-plus"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Add Cylinder ")
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              unref(cylindersStore).error ? (openBlock(), createBlock(VAlert, {
                key: 0,
                type: "error",
                dismissible: "",
                class: "mb-4",
                "onClick:close": unref(cylindersStore).clearError
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(cylindersStore).error), 1)
                ]),
                _: 1
              }, 8, ["onClick:close"])) : createCommentVNode("", true),
              createVNode(VCard, {
                class: "mb-4",
                color: "grey-lighten-5"
              }, {
                default: withCtx(() => [
                  createVNode(VCardTitle, null, {
                    default: withCtx(() => [
                      createTextVNode("\u{1F41B} Debug Info")
                    ]),
                    _: 1
                  }),
                  createVNode(VCardText, null, {
                    default: withCtx(() => [
                      createVNode(VRow, null, {
                        default: withCtx(() => [
                          createVNode(VCol, {
                            cols: "12",
                            md: "6"
                          }, {
                            default: withCtx(() => [
                              createVNode("strong", null, "Cylinders Store State:"),
                              createVNode("ul", null, [
                                createVNode("li", null, "Loading: " + toDisplayString(unref(cylindersStore).loading), 1),
                                createVNode("li", null, "Error: " + toDisplayString(unref(cylindersStore).error || "None"), 1),
                                createVNode("li", null, "Cylinders Count: " + toDisplayString(unref(cylindersStore).cylinders.length), 1),
                                createVNode("li", null, "Filtered Count: " + toDisplayString(filteredCylinders.value.length), 1)
                              ])
                            ]),
                            _: 1
                          }),
                          createVNode(VCol, {
                            cols: "12",
                            md: "6"
                          }, {
                            default: withCtx(() => [
                              createVNode("strong", null, "Sample Data:"),
                              unref(cylindersStore).cylinders.length > 0 ? (openBlock(), createBlock("pre", {
                                key: 0,
                                style: { "font-size": "12px", "max-height": "100px", "overflow": "auto" }
                              }, toDisplayString(JSON.stringify(unref(cylindersStore).cylinders[0], null, 2)), 1)) : (openBlock(), createBlock("span", { key: 1 }, "No cylinders loaded"))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(VBtn, {
                        onClick: manualRefresh,
                        color: "warning"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Manual Debug Refresh")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(VRow, { class: "mb-6" }, {
                default: withCtx(() => [
                  createVNode(VCol, {
                    cols: "12",
                    sm: "6",
                    md: "3"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, { class: "text-center" }, {
                        default: withCtx(() => [
                          createVNode(VCardText, null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "text-h5 primary--text" }, toDisplayString(unref(cylindersStore).cylinders.length), 1),
                              createVNode("div", { class: "text-subtitle-1" }, "Total Cylinders")
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
                    cols: "12",
                    sm: "6",
                    md: "3"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, { class: "text-center" }, {
                        default: withCtx(() => [
                          createVNode(VCardText, null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "text-h5 success--text" }, toDisplayString(unref(cylindersStore).availableCylinders.length), 1),
                              createVNode("div", { class: "text-subtitle-1" }, "Available")
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
                    cols: "12",
                    sm: "6",
                    md: "3"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, { class: "text-center" }, {
                        default: withCtx(() => [
                          createVNode(VCardText, null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "text-h5 warning--text" }, toDisplayString(unref(cylindersStore).lowStockCylinders.length), 1),
                              createVNode("div", { class: "text-subtitle-1" }, "Low Stock")
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
                    cols: "12",
                    sm: "6",
                    md: "3"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, { class: "text-center" }, {
                        default: withCtx(() => [
                          createVNode(VCardText, null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "text-h5 info--text" }, toDisplayString(Object.keys(unref(cylindersStore).cylindersByBrand).length), 1),
                              createVNode("div", { class: "text-subtitle-1" }, "Brands")
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
              }),
              createVNode(VCard, { class: "mb-4" }, {
                default: withCtx(() => [
                  createVNode(VCardText, null, {
                    default: withCtx(() => [
                      createVNode(VRow, null, {
                        default: withCtx(() => [
                          createVNode(VCol, {
                            cols: "12",
                            md: "4"
                          }, {
                            default: withCtx(() => [
                              createVNode(VTextField, {
                                modelValue: searchQuery.value,
                                "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                label: "Search cylinders...",
                                "prepend-inner-icon": "mdi-magnify",
                                clearable: "",
                                dense: "",
                                outlined: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(VCol, {
                            cols: "12",
                            md: "3"
                          }, {
                            default: withCtx(() => [
                              createVNode(VSelect, {
                                modelValue: selectedBrand.value,
                                "onUpdate:modelValue": ($event) => selectedBrand.value = $event,
                                items: brandOptions.value,
                                label: "Filter by Brand",
                                clearable: "",
                                dense: "",
                                outlined: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "items"])
                            ]),
                            _: 1
                          }),
                          createVNode(VCol, {
                            cols: "12",
                            md: "3"
                          }, {
                            default: withCtx(() => [
                              createVNode(VSelect, {
                                modelValue: availabilityFilter.value,
                                "onUpdate:modelValue": ($event) => availabilityFilter.value = $event,
                                items: availabilityOptions,
                                label: "Availability",
                                clearable: "",
                                dense: "",
                                outlined: ""
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(VCol, {
                            cols: "12",
                            md: "2"
                          }, {
                            default: withCtx(() => [
                              createVNode(VBtn, {
                                color: "primary",
                                block: "",
                                onClick: refreshData,
                                loading: unref(cylindersStore).loading
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Refresh ")
                                ]),
                                _: 1
                              }, 8, ["loading"])
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
              }),
              createVNode(VCard, null, {
                default: withCtx(() => [
                  createVNode(VDataTable, {
                    headers,
                    items: filteredCylinders.value,
                    loading: unref(cylindersStore).loading,
                    "item-value": "id",
                    class: "elevation-1",
                    "items-per-page": 10,
                    "no-data-text": unref(cylindersStore).loading ? "Loading cylinders..." : "No gas cylinders found"
                  }, {
                    "item.imageUrl": withCtx(({ item }) => [
                      createVNode(VAvatar, {
                        size: "40",
                        class: "my-2"
                      }, {
                        default: withCtx(() => [
                          item.imageUrl ? (openBlock(), createBlock(VImg, {
                            key: 0,
                            src: item.imageUrl,
                            alt: item.name
                          }, null, 8, ["src", "alt"])) : (openBlock(), createBlock(VIcon, { key: 1 }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-gas-cylinder")
                            ]),
                            _: 1
                          }))
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    "item.name": withCtx(({ item }) => [
                      createVNode("div", null, [
                        createVNode("div", { class: "font-weight-medium" }, toDisplayString(item.name || "Unknown"), 1),
                        createVNode("div", { class: "text-caption text-grey" }, toDisplayString(item.brand || "No brand"), 1)
                      ])
                    ]),
                    "item.weight": withCtx(({ item }) => [
                      createVNode("span", null, toDisplayString(item.weight || 0) + " kg", 1)
                    ]),
                    "item.price": withCtx(({ item }) => [
                      createVNode("span", null, "UGX " + toDisplayString(formatPrice(item.price)), 1)
                    ]),
                    "item.stockQuantity": withCtx(({ item }) => [
                      createVNode(VChip, {
                        color: getStockColor(item.stockQuantity),
                        size: "small",
                        class: "ma-1"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.stockQuantity || 0), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"])
                    ]),
                    "item.isAvailable": withCtx(({ item }) => [
                      createVNode(VChip, {
                        color: item.isAvailable ? "success" : "error",
                        size: "small",
                        class: "ma-1"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.isAvailable ? "Available" : "Unavailable"), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"])
                    ]),
                    "item.supplier": withCtx(({ item }) => {
                      var _a;
                      return [
                        createVNode("span", null, toDisplayString(((_a = item.supplier) == null ? void 0 : _a.name) || "No supplier"), 1)
                      ];
                    }),
                    "item.actions": withCtx(({ item }) => [
                      createVNode("div", { class: "d-flex gap-1" }, [
                        createVNode(VBtn, {
                          icon: "mdi-eye",
                          size: "small",
                          variant: "text",
                          onClick: ($event) => viewCylinder(item)
                        }, null, 8, ["onClick"]),
                        createVNode(VBtn, {
                          icon: "mdi-pencil",
                          size: "small",
                          variant: "text",
                          onClick: ($event) => editCylinder(item)
                        }, null, 8, ["onClick"]),
                        createVNode(VBtn, {
                          icon: "mdi-delete",
                          size: "small",
                          variant: "text",
                          color: "error",
                          onClick: ($event) => confirmDelete(item)
                        }, null, 8, ["onClick"])
                      ])
                    ]),
                    loading: withCtx(() => [
                      createVNode(VSkeletonLoader, { type: "table-tbody" })
                    ]),
                    "no-data": withCtx(() => [
                      createVNode(VAlert, {
                        type: "info",
                        class: "ma-4"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(cylindersStore).loading ? "Loading gas cylinders..." : 'No gas cylinders found. Click "Add Cylinder" to get started.'), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["items", "loading", "no-data-text"])
                ]),
                _: 1
              }),
              filteredCylinders.value.length > 0 && debugMode.value ? (openBlock(), createBlock(VCard, {
                key: 1,
                class: "mt-4"
              }, {
                default: withCtx(() => [
                  createVNode(VCardTitle, null, {
                    default: withCtx(() => [
                      createTextVNode("Fallback Table View")
                    ]),
                    _: 1
                  }),
                  createVNode(VCardText, null, {
                    default: withCtx(() => [
                      createVNode(_component_v_simple_table, null, {
                        default: withCtx(() => [
                          createVNode("thead", null, [
                            createVNode("tr", null, [
                              createVNode("th", null, "Name"),
                              createVNode("th", null, "Brand"),
                              createVNode("th", null, "Weight"),
                              createVNode("th", null, "Price"),
                              createVNode("th", null, "Stock"),
                              createVNode("th", null, "Supplier")
                            ])
                          ]),
                          createVNode("tbody", null, [
                            (openBlock(true), createBlock(Fragment, null, renderList(filteredCylinders.value.slice(0, 5), (cylinder) => {
                              var _a;
                              return openBlock(), createBlock("tr", {
                                key: cylinder.id
                              }, [
                                createVNode("td", null, toDisplayString(cylinder.name), 1),
                                createVNode("td", null, toDisplayString(cylinder.brand || "N/A"), 1),
                                createVNode("td", null, toDisplayString(cylinder.weight) + " kg", 1),
                                createVNode("td", null, "UGX " + toDisplayString(formatPrice(cylinder.price)), 1),
                                createVNode("td", null, toDisplayString(cylinder.stockQuantity), 1),
                                createVNode("td", null, toDisplayString(((_a = cylinder.supplier) == null ? void 0 : _a.name) || "N/A"), 1)
                              ]);
                            }), 128))
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })) : createCommentVNode("", true),
              createVNode(VDialog, {
                modelValue: showViewDialog.value,
                "onUpdate:modelValue": ($event) => showViewDialog.value = $event,
                "max-width": "500px"
              }, {
                default: withCtx(() => [
                  unref(cylindersStore).selectedCylinder ? (openBlock(), createBlock(VCard, { key: 0 }, {
                    default: withCtx(() => [
                      createVNode(VCardTitle, null, {
                        default: withCtx(() => [
                          createVNode("span", { class: "text-h5" }, toDisplayString(unref(cylindersStore).selectedCylinder.name), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(VCardText, null, {
                        default: withCtx(() => [
                          createVNode(VRow, null, {
                            default: withCtx(() => [
                              unref(cylindersStore).selectedCylinder.imageUrl ? (openBlock(), createBlock(VCol, {
                                key: 0,
                                cols: "12"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VImg, {
                                    src: unref(cylindersStore).selectedCylinder.imageUrl,
                                    alt: unref(cylindersStore).selectedCylinder.name,
                                    "max-height": "200",
                                    contain: ""
                                  }, null, 8, ["src", "alt"])
                                ]),
                                _: 1
                              })) : createCommentVNode("", true),
                              createVNode(VCol, { cols: "6" }, {
                                default: withCtx(() => [
                                  createVNode("strong", null, "Brand:"),
                                  createTextVNode(" " + toDisplayString(unref(cylindersStore).selectedCylinder.brand || "N/A"), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(VCol, { cols: "6" }, {
                                default: withCtx(() => [
                                  createVNode("strong", null, "Weight:"),
                                  createTextVNode(" " + toDisplayString(unref(cylindersStore).selectedCylinder.weight) + " kg ", 1)
                                ]),
                                _: 1
                              }),
                              createVNode(VCol, { cols: "6" }, {
                                default: withCtx(() => [
                                  createVNode("strong", null, "Price:"),
                                  createTextVNode(" UGX " + toDisplayString(formatPrice(unref(cylindersStore).selectedCylinder.price)), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(VCol, { cols: "6" }, {
                                default: withCtx(() => [
                                  createVNode("strong", null, "Stock:"),
                                  createTextVNode(" " + toDisplayString(unref(cylindersStore).selectedCylinder.stockQuantity), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(VCol, { cols: "6" }, {
                                default: withCtx(() => {
                                  var _a;
                                  return [
                                    createVNode("strong", null, "Supplier:"),
                                    createTextVNode(" " + toDisplayString(((_a = unref(cylindersStore).selectedCylinder.supplier) == null ? void 0 : _a.name) || "N/A"), 1)
                                  ];
                                }),
                                _: 1
                              }),
                              createVNode(VCol, { cols: "6" }, {
                                default: withCtx(() => [
                                  createVNode("strong", null, "Status:"),
                                  createVNode(VChip, {
                                    color: unref(cylindersStore).selectedCylinder.isAvailable ? "success" : "error",
                                    size: "small"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(unref(cylindersStore).selectedCylinder.isAvailable ? "Available" : "Unavailable"), 1)
                                    ]),
                                    _: 1
                                  }, 8, ["color"])
                                ]),
                                _: 1
                              }),
                              unref(cylindersStore).selectedCylinder.description ? (openBlock(), createBlock(VCol, {
                                key: 1,
                                cols: "12"
                              }, {
                                default: withCtx(() => [
                                  createVNode("strong", null, "Description:"),
                                  createVNode("p", { class: "mt-2" }, toDisplayString(unref(cylindersStore).selectedCylinder.description), 1)
                                ]),
                                _: 1
                              })) : createCommentVNode("", true)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(VCardActions, null, {
                        default: withCtx(() => [
                          createVNode(VSpacer),
                          createVNode(VBtn, {
                            text: "",
                            onClick: ($event) => showViewDialog.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Close")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(VBtn, {
                            color: "primary",
                            onClick: ($event) => editCylinder(unref(cylindersStore).selectedCylinder)
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Edit ")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ]),
                _: 1
              }, 8, ["modelValue", "onUpdate:modelValue"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/gas-cylinders.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const gasCylinders = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bf6f7801"]]);

export { gasCylinders as default };
//# sourceMappingURL=gas-cylinders-ChLSj5Ef.mjs.map
