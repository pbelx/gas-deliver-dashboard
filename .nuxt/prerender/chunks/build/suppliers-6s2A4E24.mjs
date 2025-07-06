import { defineComponent, ref, computed, withCtx, createTextVNode, createVNode, unref, toDisplayString, createBlock, createCommentVNode, openBlock, useSSRContext } from 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/vue/index.mjs';
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle } from 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/vue/server-renderer/index.mjs';
import { u as useSuppliersStore } from './suppliers-CqKtBit9.mjs';
import { V as VContainer, f as VRow, g as VCol, w as VBtn, k as VAlert, i as VCard, m as VCardText, v as VTextField, z as VSelect, I as VDataTable, D as VChip, x as VDialog, l as VCardTitle, s as VForm, F as VTextarea, G as VCardActions, H as VSpacer } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/pinia/dist/pinia.prod.cjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "suppliers",
  __ssrInlineRender: true,
  setup(__props) {
    const suppliersStore = useSuppliersStore();
    const headers = [
      { title: "Name", key: "name" },
      { title: "Contact", key: "contact", sortable: false },
      { title: "Address", key: "address", sortable: false },
      { title: "Status", key: "isActive", width: "120px" },
      { title: "Cylinders", key: "cylindersCount", width: "100px" },
      { title: "Actions", key: "actions", sortable: false, width: "150px" }
    ];
    const searchQuery = ref("");
    const statusFilter = ref("");
    const showDialog = ref(false);
    const showDeleteDialog = ref(false);
    const showViewDialog = ref(false);
    const isEditing = ref(false);
    const formValid = ref(false);
    const formData = ref({
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      latitude: void 0,
      longitude: void 0
    });
    const supplierToDelete = ref(null);
    const rules = {
      required: (value) => !!value || "Required.",
      email: (value) => !value || /.+@.+\..+/.test(value) || "Invalid email format."
    };
    const filteredSuppliers = computed(() => {
      let filtered = suppliersStore.suppliers;
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
          (supplier) => {
            var _a;
            return supplier.name.toLowerCase().includes(query) || supplier.contactPerson.toLowerCase().includes(query) || supplier.phone.includes(query) || ((_a = supplier.email) == null ? void 0 : _a.toLowerCase().includes(query));
          }
        );
      }
      if (statusFilter.value !== "") {
        const isActive = statusFilter.value === "active";
        filtered = filtered.filter((supplier) => supplier.isActive === isActive);
      }
      return filtered;
    });
    const statusOptions = [
      { value: "active", title: "Active" },
      { value: "inactive", title: "Inactive" }
    ];
    const openCreateDialog = () => {
      isEditing.value = false;
      formData.value = {
        name: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        latitude: void 0,
        longitude: void 0
      };
      showDialog.value = true;
    };
    const editSupplier = (supplier) => {
      isEditing.value = true;
      formData.value = {
        name: supplier.name,
        contactPerson: supplier.contactPerson,
        phone: supplier.phone,
        email: supplier.email || "",
        address: supplier.address,
        latitude: supplier.latitude,
        longitude: supplier.longitude
      };
      suppliersStore.selectedSupplier = supplier;
      showDialog.value = true;
      showViewDialog.value = false;
    };
    const viewSupplier = (supplier) => {
      suppliersStore.selectedSupplier = supplier;
      showViewDialog.value = true;
    };
    const confirmDelete = (supplier) => {
      supplierToDelete.value = supplier;
      showDeleteDialog.value = true;
    };
    const deleteSupplier = async () => {
      if (!supplierToDelete.value) return;
      console.log("Delete supplier:", supplierToDelete.value);
      showDeleteDialog.value = false;
      supplierToDelete.value = null;
    };
    const saveSupplier = async () => {
      if (!formValid.value) return;
      try {
        if (isEditing.value && suppliersStore.selectedSupplier) {
          console.log("Update supplier:", formData.value);
        } else {
          await suppliersStore.createSupplier(formData.value);
        }
        closeDialog();
      } catch (error) {
        console.error("Error saving supplier:", error);
      }
    };
    const closeDialog = () => {
      showDialog.value = false;
      suppliersStore.clearSelectedSupplier();
      formData.value = {
        name: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        latitude: void 0,
        longitude: void 0
      };
    };
    const refreshData = async () => {
      await suppliersStore.fetchSuppliers();
    };
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
                        _push4(`<div class="d-flex justify-space-between align-center mb-4" data-v-3e9847a8${_scopeId3}><div data-v-3e9847a8${_scopeId3}><h1 class="text-h4" data-v-3e9847a8${_scopeId3}>Suppliers</h1><p class="text-subtitle-1 text-grey" data-v-3e9847a8${_scopeId3}>Manage your gas cylinder suppliers</p></div>`);
                        _push4(ssrRenderComponent(VBtn, {
                          color: "primary",
                          size: "large",
                          onClick: openCreateDialog,
                          "prepend-icon": "mdi-plus"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Add Supplier `);
                            } else {
                              return [
                                createTextVNode(" Add Supplier ")
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
                              createVNode("h1", { class: "text-h4" }, "Suppliers"),
                              createVNode("p", { class: "text-subtitle-1 text-grey" }, "Manage your gas cylinder suppliers")
                            ]),
                            createVNode(VBtn, {
                              color: "primary",
                              size: "large",
                              onClick: openCreateDialog,
                              "prepend-icon": "mdi-plus"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Add Supplier ")
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
                            createVNode("h1", { class: "text-h4" }, "Suppliers"),
                            createVNode("p", { class: "text-subtitle-1 text-grey" }, "Manage your gas cylinder suppliers")
                          ]),
                          createVNode(VBtn, {
                            color: "primary",
                            size: "large",
                            onClick: openCreateDialog,
                            "prepend-icon": "mdi-plus"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Add Supplier ")
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
            if (unref(suppliersStore).error) {
              _push2(ssrRenderComponent(VAlert, {
                type: "error",
                dismissible: "",
                class: "mb-4",
                "onClick:close": unref(suppliersStore).clearError
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(suppliersStore).error)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(suppliersStore).error), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(VRow, { class: "mb-6" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCol, {
                    cols: "12",
                    sm: "6",
                    md: "4"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCard, { class: "text-center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCardText, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="text-h5 primary--text" data-v-3e9847a8${_scopeId5}>${ssrInterpolate(unref(suppliersStore).suppliers.length)}</div><div class="text-subtitle-1" data-v-3e9847a8${_scopeId5}>Total Suppliers</div>`);
                                  } else {
                                    return [
                                      createVNode("div", { class: "text-h5 primary--text" }, toDisplayString(unref(suppliersStore).suppliers.length), 1),
                                      createVNode("div", { class: "text-subtitle-1" }, "Total Suppliers")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCardText, null, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "text-h5 primary--text" }, toDisplayString(unref(suppliersStore).suppliers.length), 1),
                                    createVNode("div", { class: "text-subtitle-1" }, "Total Suppliers")
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
                                  createVNode("div", { class: "text-h5 primary--text" }, toDisplayString(unref(suppliersStore).suppliers.length), 1),
                                  createVNode("div", { class: "text-subtitle-1" }, "Total Suppliers")
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
                    md: "4"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCard, { class: "text-center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCardText, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="text-h5 success--text" data-v-3e9847a8${_scopeId5}>${ssrInterpolate(unref(suppliersStore).activeSuppliers.length)}</div><div class="text-subtitle-1" data-v-3e9847a8${_scopeId5}>Active Suppliers</div>`);
                                  } else {
                                    return [
                                      createVNode("div", { class: "text-h5 success--text" }, toDisplayString(unref(suppliersStore).activeSuppliers.length), 1),
                                      createVNode("div", { class: "text-subtitle-1" }, "Active Suppliers")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCardText, null, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "text-h5 success--text" }, toDisplayString(unref(suppliersStore).activeSuppliers.length), 1),
                                    createVNode("div", { class: "text-subtitle-1" }, "Active Suppliers")
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
                                  createVNode("div", { class: "text-h5 success--text" }, toDisplayString(unref(suppliersStore).activeSuppliers.length), 1),
                                  createVNode("div", { class: "text-subtitle-1" }, "Active Suppliers")
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
                    md: "4"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCard, { class: "text-center" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VCardText, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<div class="text-h5 info--text" data-v-3e9847a8${_scopeId5}>${ssrInterpolate(unref(suppliersStore).suppliers.length - unref(suppliersStore).activeSuppliers.length)}</div><div class="text-subtitle-1" data-v-3e9847a8${_scopeId5}>Inactive Suppliers</div>`);
                                  } else {
                                    return [
                                      createVNode("div", { class: "text-h5 info--text" }, toDisplayString(unref(suppliersStore).suppliers.length - unref(suppliersStore).activeSuppliers.length), 1),
                                      createVNode("div", { class: "text-subtitle-1" }, "Inactive Suppliers")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VCardText, null, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "text-h5 info--text" }, toDisplayString(unref(suppliersStore).suppliers.length - unref(suppliersStore).activeSuppliers.length), 1),
                                    createVNode("div", { class: "text-subtitle-1" }, "Inactive Suppliers")
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
                                  createVNode("div", { class: "text-h5 info--text" }, toDisplayString(unref(suppliersStore).suppliers.length - unref(suppliersStore).activeSuppliers.length), 1),
                                  createVNode("div", { class: "text-subtitle-1" }, "Inactive Suppliers")
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
                      md: "4"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCard, { class: "text-center" }, {
                          default: withCtx(() => [
                            createVNode(VCardText, null, {
                              default: withCtx(() => [
                                createVNode("div", { class: "text-h5 primary--text" }, toDisplayString(unref(suppliersStore).suppliers.length), 1),
                                createVNode("div", { class: "text-subtitle-1" }, "Total Suppliers")
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
                      md: "4"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCard, { class: "text-center" }, {
                          default: withCtx(() => [
                            createVNode(VCardText, null, {
                              default: withCtx(() => [
                                createVNode("div", { class: "text-h5 success--text" }, toDisplayString(unref(suppliersStore).activeSuppliers.length), 1),
                                createVNode("div", { class: "text-subtitle-1" }, "Active Suppliers")
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
                      md: "4"
                    }, {
                      default: withCtx(() => [
                        createVNode(VCard, { class: "text-center" }, {
                          default: withCtx(() => [
                            createVNode(VCardText, null, {
                              default: withCtx(() => [
                                createVNode("div", { class: "text-h5 info--text" }, toDisplayString(unref(suppliersStore).suppliers.length - unref(suppliersStore).activeSuppliers.length), 1),
                                createVNode("div", { class: "text-subtitle-1" }, "Inactive Suppliers")
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
                                md: "6"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VTextField, {
                                      modelValue: searchQuery.value,
                                      "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                      label: "Search suppliers...",
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
                                        label: "Search suppliers...",
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
                                      modelValue: statusFilter.value,
                                      "onUpdate:modelValue": ($event) => statusFilter.value = $event,
                                      items: statusOptions,
                                      label: "Status",
                                      clearable: "",
                                      dense: "",
                                      outlined: ""
                                    }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VSelect, {
                                        modelValue: statusFilter.value,
                                        "onUpdate:modelValue": ($event) => statusFilter.value = $event,
                                        items: statusOptions,
                                        label: "Status",
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
                                    _push6(ssrRenderComponent(VBtn, {
                                      color: "primary",
                                      block: "",
                                      onClick: refreshData,
                                      loading: unref(suppliersStore).loading
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
                                        loading: unref(suppliersStore).loading
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
                                  md: "6"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VTextField, {
                                      modelValue: searchQuery.value,
                                      "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                      label: "Search suppliers...",
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
                                      modelValue: statusFilter.value,
                                      "onUpdate:modelValue": ($event) => statusFilter.value = $event,
                                      items: statusOptions,
                                      label: "Status",
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
                                    createVNode(VBtn, {
                                      color: "primary",
                                      block: "",
                                      onClick: refreshData,
                                      loading: unref(suppliersStore).loading
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
                                md: "6"
                              }, {
                                default: withCtx(() => [
                                  createVNode(VTextField, {
                                    modelValue: searchQuery.value,
                                    "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                    label: "Search suppliers...",
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
                                    modelValue: statusFilter.value,
                                    "onUpdate:modelValue": ($event) => statusFilter.value = $event,
                                    items: statusOptions,
                                    label: "Status",
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
                                  createVNode(VBtn, {
                                    color: "primary",
                                    block: "",
                                    onClick: refreshData,
                                    loading: unref(suppliersStore).loading
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
                              md: "6"
                            }, {
                              default: withCtx(() => [
                                createVNode(VTextField, {
                                  modelValue: searchQuery.value,
                                  "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                  label: "Search suppliers...",
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
                                  modelValue: statusFilter.value,
                                  "onUpdate:modelValue": ($event) => statusFilter.value = $event,
                                  items: statusOptions,
                                  label: "Status",
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
                                createVNode(VBtn, {
                                  color: "primary",
                                  block: "",
                                  onClick: refreshData,
                                  loading: unref(suppliersStore).loading
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
                    items: filteredSuppliers.value,
                    loading: unref(suppliersStore).loading,
                    "item-key": "id",
                    class: "elevation-1",
                    "items-per-page": 10
                  }, {
                    "item.name": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div data-v-3e9847a8${_scopeId3}><div class="font-weight-medium" data-v-3e9847a8${_scopeId3}>${ssrInterpolate(item.name)}</div><div class="text-caption text-grey" data-v-3e9847a8${_scopeId3}>${ssrInterpolate(item.contactPerson)}</div></div>`);
                      } else {
                        return [
                          createVNode("div", null, [
                            createVNode("div", { class: "font-weight-medium" }, toDisplayString(item.name), 1),
                            createVNode("div", { class: "text-caption text-grey" }, toDisplayString(item.contactPerson), 1)
                          ])
                        ];
                      }
                    }),
                    "item.contact": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div data-v-3e9847a8${_scopeId3}><div data-v-3e9847a8${_scopeId3}>${ssrInterpolate(item.phone)}</div><div class="text-caption text-grey" data-v-3e9847a8${_scopeId3}>${ssrInterpolate(item.email || "No email")}</div></div>`);
                      } else {
                        return [
                          createVNode("div", null, [
                            createVNode("div", null, toDisplayString(item.phone), 1),
                            createVNode("div", { class: "text-caption text-grey" }, toDisplayString(item.email || "No email"), 1)
                          ])
                        ];
                      }
                    }),
                    "item.address": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="text-truncate" style="${ssrRenderStyle({ "max-width": "200px" })}" data-v-3e9847a8${_scopeId3}>${ssrInterpolate(item.address)}</div>`);
                      } else {
                        return [
                          createVNode("div", {
                            class: "text-truncate",
                            style: { "max-width": "200px" }
                          }, toDisplayString(item.address), 1)
                        ];
                      }
                    }),
                    "item.isActive": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VChip, {
                          color: item.isActive ? "success" : "error",
                          size: "small",
                          class: "ma-1"
                        }, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(item.isActive ? "Active" : "Inactive")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(item.isActive ? "Active" : "Inactive"), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VChip, {
                            color: item.isActive ? "success" : "error",
                            size: "small",
                            class: "ma-1"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(item.isActive ? "Active" : "Inactive"), 1)
                            ]),
                            _: 2
                          }, 1032, ["color"])
                        ];
                      }
                    }),
                    "item.cylindersCount": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      var _a, _b;
                      if (_push4) {
                        _push4(`${ssrInterpolate(((_a = item.gasCylinders) == null ? void 0 : _a.length) || 0)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(((_b = item.gasCylinders) == null ? void 0 : _b.length) || 0), 1)
                        ];
                      }
                    }),
                    "item.actions": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="d-flex gap-1" data-v-3e9847a8${_scopeId3}>`);
                        _push4(ssrRenderComponent(VBtn, {
                          icon: "mdi-eye",
                          size: "small",
                          variant: "text",
                          onClick: ($event) => viewSupplier(item)
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VBtn, {
                          icon: "mdi-pencil",
                          size: "small",
                          variant: "text",
                          onClick: ($event) => editSupplier(item)
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
                              onClick: ($event) => viewSupplier(item)
                            }, null, 8, ["onClick"]),
                            createVNode(VBtn, {
                              icon: "mdi-pencil",
                              size: "small",
                              variant: "text",
                              onClick: ($event) => editSupplier(item)
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
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VDataTable, {
                      headers,
                      items: filteredSuppliers.value,
                      loading: unref(suppliersStore).loading,
                      "item-key": "id",
                      class: "elevation-1",
                      "items-per-page": 10
                    }, {
                      "item.name": withCtx(({ item }) => [
                        createVNode("div", null, [
                          createVNode("div", { class: "font-weight-medium" }, toDisplayString(item.name), 1),
                          createVNode("div", { class: "text-caption text-grey" }, toDisplayString(item.contactPerson), 1)
                        ])
                      ]),
                      "item.contact": withCtx(({ item }) => [
                        createVNode("div", null, [
                          createVNode("div", null, toDisplayString(item.phone), 1),
                          createVNode("div", { class: "text-caption text-grey" }, toDisplayString(item.email || "No email"), 1)
                        ])
                      ]),
                      "item.address": withCtx(({ item }) => [
                        createVNode("div", {
                          class: "text-truncate",
                          style: { "max-width": "200px" }
                        }, toDisplayString(item.address), 1)
                      ]),
                      "item.isActive": withCtx(({ item }) => [
                        createVNode(VChip, {
                          color: item.isActive ? "success" : "error",
                          size: "small",
                          class: "ma-1"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(item.isActive ? "Active" : "Inactive"), 1)
                          ]),
                          _: 2
                        }, 1032, ["color"])
                      ]),
                      "item.cylindersCount": withCtx(({ item }) => {
                        var _a;
                        return [
                          createTextVNode(toDisplayString(((_a = item.gasCylinders) == null ? void 0 : _a.length) || 0), 1)
                        ];
                      }),
                      "item.actions": withCtx(({ item }) => [
                        createVNode("div", { class: "d-flex gap-1" }, [
                          createVNode(VBtn, {
                            icon: "mdi-eye",
                            size: "small",
                            variant: "text",
                            onClick: ($event) => viewSupplier(item)
                          }, null, 8, ["onClick"]),
                          createVNode(VBtn, {
                            icon: "mdi-pencil",
                            size: "small",
                            variant: "text",
                            onClick: ($event) => editSupplier(item)
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
                      _: 1
                    }, 8, ["items", "loading"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VDialog, {
              modelValue: showDialog.value,
              "onUpdate:modelValue": ($event) => showDialog.value = $event,
              "max-width": "600px",
              persistent: ""
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCard, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCardTitle, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<span class="text-h5" data-v-3e9847a8${_scopeId4}>${ssrInterpolate(isEditing.value ? "Edit" : "Add")} Supplier</span>`);
                            } else {
                              return [
                                createVNode("span", { class: "text-h5" }, toDisplayString(isEditing.value ? "Edit" : "Add") + " Supplier", 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCardText, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VForm, {
                                ref: "supplierForm",
                                modelValue: formValid.value,
                                "onUpdate:modelValue": ($event) => formValid.value = $event
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VRow, null, {
                                      default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VTextField, {
                                                  modelValue: formData.value.name,
                                                  "onUpdate:modelValue": ($event) => formData.value.name = $event,
                                                  label: "Company Name*",
                                                  rules: [rules.required],
                                                  outlined: ""
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VTextField, {
                                                    modelValue: formData.value.name,
                                                    "onUpdate:modelValue": ($event) => formData.value.name = $event,
                                                    label: "Company Name*",
                                                    rules: [rules.required],
                                                    outlined: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VTextField, {
                                                  modelValue: formData.value.contactPerson,
                                                  "onUpdate:modelValue": ($event) => formData.value.contactPerson = $event,
                                                  label: "Contact Person*",
                                                  rules: [rules.required],
                                                  outlined: ""
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VTextField, {
                                                    modelValue: formData.value.contactPerson,
                                                    "onUpdate:modelValue": ($event) => formData.value.contactPerson = $event,
                                                    label: "Contact Person*",
                                                    rules: [rules.required],
                                                    outlined: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VTextField, {
                                                  modelValue: formData.value.phone,
                                                  "onUpdate:modelValue": ($event) => formData.value.phone = $event,
                                                  label: "Phone Number*",
                                                  rules: [rules.required],
                                                  outlined: ""
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VTextField, {
                                                    modelValue: formData.value.phone,
                                                    "onUpdate:modelValue": ($event) => formData.value.phone = $event,
                                                    label: "Phone Number*",
                                                    rules: [rules.required],
                                                    outlined: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VTextField, {
                                                  modelValue: formData.value.email,
                                                  "onUpdate:modelValue": ($event) => formData.value.email = $event,
                                                  label: "Email",
                                                  rules: [rules.email],
                                                  outlined: ""
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VTextField, {
                                                    modelValue: formData.value.email,
                                                    "onUpdate:modelValue": ($event) => formData.value.email = $event,
                                                    label: "Email",
                                                    rules: [rules.email],
                                                    outlined: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VCol, { cols: "12" }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VTextarea, {
                                                  modelValue: formData.value.address,
                                                  "onUpdate:modelValue": ($event) => formData.value.address = $event,
                                                  label: "Address*",
                                                  rules: [rules.required],
                                                  outlined: "",
                                                  rows: "3"
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VTextarea, {
                                                    modelValue: formData.value.address,
                                                    "onUpdate:modelValue": ($event) => formData.value.address = $event,
                                                    label: "Address*",
                                                    rules: [rules.required],
                                                    outlined: "",
                                                    rows: "3"
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VTextField, {
                                                  modelValue: formData.value.latitude,
                                                  "onUpdate:modelValue": ($event) => formData.value.latitude = $event,
                                                  modelModifiers: { number: true },
                                                  label: "Latitude",
                                                  type: "number",
                                                  step: "any",
                                                  outlined: ""
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VTextField, {
                                                    modelValue: formData.value.latitude,
                                                    "onUpdate:modelValue": ($event) => formData.value.latitude = $event,
                                                    modelModifiers: { number: true },
                                                    label: "Latitude",
                                                    type: "number",
                                                    step: "any",
                                                    outlined: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                          _push7(ssrRenderComponent(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(ssrRenderComponent(VTextField, {
                                                  modelValue: formData.value.longitude,
                                                  "onUpdate:modelValue": ($event) => formData.value.longitude = $event,
                                                  modelModifiers: { number: true },
                                                  label: "Longitude",
                                                  type: "number",
                                                  step: "any",
                                                  outlined: ""
                                                }, null, _parent8, _scopeId7));
                                              } else {
                                                return [
                                                  createVNode(VTextField, {
                                                    modelValue: formData.value.longitude,
                                                    "onUpdate:modelValue": ($event) => formData.value.longitude = $event,
                                                    modelModifiers: { number: true },
                                                    label: "Longitude",
                                                    type: "number",
                                                    step: "any",
                                                    outlined: ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ];
                                              }
                                            }),
                                            _: 1
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "6"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VTextField, {
                                                  modelValue: formData.value.name,
                                                  "onUpdate:modelValue": ($event) => formData.value.name = $event,
                                                  label: "Company Name*",
                                                  rules: [rules.required],
                                                  outlined: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "6"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VTextField, {
                                                  modelValue: formData.value.contactPerson,
                                                  "onUpdate:modelValue": ($event) => formData.value.contactPerson = $event,
                                                  label: "Contact Person*",
                                                  rules: [rules.required],
                                                  outlined: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "6"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VTextField, {
                                                  modelValue: formData.value.phone,
                                                  "onUpdate:modelValue": ($event) => formData.value.phone = $event,
                                                  label: "Phone Number*",
                                                  rules: [rules.required],
                                                  outlined: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "6"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VTextField, {
                                                  modelValue: formData.value.email,
                                                  "onUpdate:modelValue": ($event) => formData.value.email = $event,
                                                  label: "Email",
                                                  rules: [rules.email],
                                                  outlined: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, { cols: "12" }, {
                                              default: withCtx(() => [
                                                createVNode(VTextarea, {
                                                  modelValue: formData.value.address,
                                                  "onUpdate:modelValue": ($event) => formData.value.address = $event,
                                                  label: "Address*",
                                                  rules: [rules.required],
                                                  outlined: "",
                                                  rows: "3"
                                                }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "6"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VTextField, {
                                                  modelValue: formData.value.latitude,
                                                  "onUpdate:modelValue": ($event) => formData.value.latitude = $event,
                                                  modelModifiers: { number: true },
                                                  label: "Latitude",
                                                  type: "number",
                                                  step: "any",
                                                  outlined: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(VCol, {
                                              cols: "12",
                                              md: "6"
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(VTextField, {
                                                  modelValue: formData.value.longitude,
                                                  "onUpdate:modelValue": ($event) => formData.value.longitude = $event,
                                                  modelModifiers: { number: true },
                                                  label: "Longitude",
                                                  type: "number",
                                                  step: "any",
                                                  outlined: ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 1
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VRow, null, {
                                        default: withCtx(() => [
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VTextField, {
                                                modelValue: formData.value.name,
                                                "onUpdate:modelValue": ($event) => formData.value.name = $event,
                                                label: "Company Name*",
                                                rules: [rules.required],
                                                outlined: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VTextField, {
                                                modelValue: formData.value.contactPerson,
                                                "onUpdate:modelValue": ($event) => formData.value.contactPerson = $event,
                                                label: "Contact Person*",
                                                rules: [rules.required],
                                                outlined: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VTextField, {
                                                modelValue: formData.value.phone,
                                                "onUpdate:modelValue": ($event) => formData.value.phone = $event,
                                                label: "Phone Number*",
                                                rules: [rules.required],
                                                outlined: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VTextField, {
                                                modelValue: formData.value.email,
                                                "onUpdate:modelValue": ($event) => formData.value.email = $event,
                                                label: "Email",
                                                rules: [rules.email],
                                                outlined: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCol, { cols: "12" }, {
                                            default: withCtx(() => [
                                              createVNode(VTextarea, {
                                                modelValue: formData.value.address,
                                                "onUpdate:modelValue": ($event) => formData.value.address = $event,
                                                label: "Address*",
                                                rules: [rules.required],
                                                outlined: "",
                                                rows: "3"
                                              }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VTextField, {
                                                modelValue: formData.value.latitude,
                                                "onUpdate:modelValue": ($event) => formData.value.latitude = $event,
                                                modelModifiers: { number: true },
                                                label: "Latitude",
                                                type: "number",
                                                step: "any",
                                                outlined: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(VCol, {
                                            cols: "12",
                                            md: "6"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VTextField, {
                                                modelValue: formData.value.longitude,
                                                "onUpdate:modelValue": ($event) => formData.value.longitude = $event,
                                                modelModifiers: { number: true },
                                                label: "Longitude",
                                                type: "number",
                                                step: "any",
                                                outlined: ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VForm, {
                                  ref: "supplierForm",
                                  modelValue: formValid.value,
                                  "onUpdate:modelValue": ($event) => formValid.value = $event
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VRow, null, {
                                      default: withCtx(() => [
                                        createVNode(VCol, {
                                          cols: "12",
                                          md: "6"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VTextField, {
                                              modelValue: formData.value.name,
                                              "onUpdate:modelValue": ($event) => formData.value.name = $event,
                                              label: "Company Name*",
                                              rules: [rules.required],
                                              outlined: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, {
                                          cols: "12",
                                          md: "6"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VTextField, {
                                              modelValue: formData.value.contactPerson,
                                              "onUpdate:modelValue": ($event) => formData.value.contactPerson = $event,
                                              label: "Contact Person*",
                                              rules: [rules.required],
                                              outlined: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, {
                                          cols: "12",
                                          md: "6"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VTextField, {
                                              modelValue: formData.value.phone,
                                              "onUpdate:modelValue": ($event) => formData.value.phone = $event,
                                              label: "Phone Number*",
                                              rules: [rules.required],
                                              outlined: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, {
                                          cols: "12",
                                          md: "6"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VTextField, {
                                              modelValue: formData.value.email,
                                              "onUpdate:modelValue": ($event) => formData.value.email = $event,
                                              label: "Email",
                                              rules: [rules.email],
                                              outlined: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, { cols: "12" }, {
                                          default: withCtx(() => [
                                            createVNode(VTextarea, {
                                              modelValue: formData.value.address,
                                              "onUpdate:modelValue": ($event) => formData.value.address = $event,
                                              label: "Address*",
                                              rules: [rules.required],
                                              outlined: "",
                                              rows: "3"
                                            }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, {
                                          cols: "12",
                                          md: "6"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VTextField, {
                                              modelValue: formData.value.latitude,
                                              "onUpdate:modelValue": ($event) => formData.value.latitude = $event,
                                              modelModifiers: { number: true },
                                              label: "Latitude",
                                              type: "number",
                                              step: "any",
                                              outlined: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, {
                                          cols: "12",
                                          md: "6"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VTextField, {
                                              modelValue: formData.value.longitude,
                                              "onUpdate:modelValue": ($event) => formData.value.longitude = $event,
                                              modelModifiers: { number: true },
                                              label: "Longitude",
                                              type: "number",
                                              step: "any",
                                              outlined: ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                }, 8, ["modelValue", "onUpdate:modelValue"])
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
                                onClick: closeDialog
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Cancel`);
                                  } else {
                                    return [
                                      createTextVNode("Cancel")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VBtn, {
                                color: "primary",
                                onClick: saveSupplier,
                                loading: unref(suppliersStore).loading,
                                disabled: !formValid.value
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(isEditing.value ? "Update" : "Create")}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(isEditing.value ? "Update" : "Create"), 1)
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
                                  onClick: closeDialog
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Cancel")
                                  ]),
                                  _: 1
                                }),
                                createVNode(VBtn, {
                                  color: "primary",
                                  onClick: saveSupplier,
                                  loading: unref(suppliersStore).loading,
                                  disabled: !formValid.value
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(isEditing.value ? "Update" : "Create"), 1)
                                  ]),
                                  _: 1
                                }, 8, ["loading", "disabled"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VCardTitle, null, {
                            default: withCtx(() => [
                              createVNode("span", { class: "text-h5" }, toDisplayString(isEditing.value ? "Edit" : "Add") + " Supplier", 1)
                            ]),
                            _: 1
                          }),
                          createVNode(VCardText, null, {
                            default: withCtx(() => [
                              createVNode(VForm, {
                                ref: "supplierForm",
                                modelValue: formValid.value,
                                "onUpdate:modelValue": ($event) => formValid.value = $event
                              }, {
                                default: withCtx(() => [
                                  createVNode(VRow, null, {
                                    default: withCtx(() => [
                                      createVNode(VCol, {
                                        cols: "12",
                                        md: "6"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VTextField, {
                                            modelValue: formData.value.name,
                                            "onUpdate:modelValue": ($event) => formData.value.name = $event,
                                            label: "Company Name*",
                                            rules: [rules.required],
                                            outlined: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, {
                                        cols: "12",
                                        md: "6"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VTextField, {
                                            modelValue: formData.value.contactPerson,
                                            "onUpdate:modelValue": ($event) => formData.value.contactPerson = $event,
                                            label: "Contact Person*",
                                            rules: [rules.required],
                                            outlined: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, {
                                        cols: "12",
                                        md: "6"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VTextField, {
                                            modelValue: formData.value.phone,
                                            "onUpdate:modelValue": ($event) => formData.value.phone = $event,
                                            label: "Phone Number*",
                                            rules: [rules.required],
                                            outlined: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, {
                                        cols: "12",
                                        md: "6"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VTextField, {
                                            modelValue: formData.value.email,
                                            "onUpdate:modelValue": ($event) => formData.value.email = $event,
                                            label: "Email",
                                            rules: [rules.email],
                                            outlined: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, { cols: "12" }, {
                                        default: withCtx(() => [
                                          createVNode(VTextarea, {
                                            modelValue: formData.value.address,
                                            "onUpdate:modelValue": ($event) => formData.value.address = $event,
                                            label: "Address*",
                                            rules: [rules.required],
                                            outlined: "",
                                            rows: "3"
                                          }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, {
                                        cols: "12",
                                        md: "6"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VTextField, {
                                            modelValue: formData.value.latitude,
                                            "onUpdate:modelValue": ($event) => formData.value.latitude = $event,
                                            modelModifiers: { number: true },
                                            label: "Latitude",
                                            type: "number",
                                            step: "any",
                                            outlined: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, {
                                        cols: "12",
                                        md: "6"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VTextField, {
                                            modelValue: formData.value.longitude,
                                            "onUpdate:modelValue": ($event) => formData.value.longitude = $event,
                                            modelModifiers: { number: true },
                                            label: "Longitude",
                                            type: "number",
                                            step: "any",
                                            outlined: ""
                                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            _: 1
                          }),
                          createVNode(VCardActions, null, {
                            default: withCtx(() => [
                              createVNode(VSpacer),
                              createVNode(VBtn, {
                                text: "",
                                onClick: closeDialog
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Cancel")
                                ]),
                                _: 1
                              }),
                              createVNode(VBtn, {
                                color: "primary",
                                onClick: saveSupplier,
                                loading: unref(suppliersStore).loading,
                                disabled: !formValid.value
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(isEditing.value ? "Update" : "Create"), 1)
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VCard, null, {
                      default: withCtx(() => [
                        createVNode(VCardTitle, null, {
                          default: withCtx(() => [
                            createVNode("span", { class: "text-h5" }, toDisplayString(isEditing.value ? "Edit" : "Add") + " Supplier", 1)
                          ]),
                          _: 1
                        }),
                        createVNode(VCardText, null, {
                          default: withCtx(() => [
                            createVNode(VForm, {
                              ref: "supplierForm",
                              modelValue: formValid.value,
                              "onUpdate:modelValue": ($event) => formValid.value = $event
                            }, {
                              default: withCtx(() => [
                                createVNode(VRow, null, {
                                  default: withCtx(() => [
                                    createVNode(VCol, {
                                      cols: "12",
                                      md: "6"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VTextField, {
                                          modelValue: formData.value.name,
                                          "onUpdate:modelValue": ($event) => formData.value.name = $event,
                                          label: "Company Name*",
                                          rules: [rules.required],
                                          outlined: ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, {
                                      cols: "12",
                                      md: "6"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VTextField, {
                                          modelValue: formData.value.contactPerson,
                                          "onUpdate:modelValue": ($event) => formData.value.contactPerson = $event,
                                          label: "Contact Person*",
                                          rules: [rules.required],
                                          outlined: ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, {
                                      cols: "12",
                                      md: "6"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VTextField, {
                                          modelValue: formData.value.phone,
                                          "onUpdate:modelValue": ($event) => formData.value.phone = $event,
                                          label: "Phone Number*",
                                          rules: [rules.required],
                                          outlined: ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, {
                                      cols: "12",
                                      md: "6"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VTextField, {
                                          modelValue: formData.value.email,
                                          "onUpdate:modelValue": ($event) => formData.value.email = $event,
                                          label: "Email",
                                          rules: [rules.email],
                                          outlined: ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, { cols: "12" }, {
                                      default: withCtx(() => [
                                        createVNode(VTextarea, {
                                          modelValue: formData.value.address,
                                          "onUpdate:modelValue": ($event) => formData.value.address = $event,
                                          label: "Address*",
                                          rules: [rules.required],
                                          outlined: "",
                                          rows: "3"
                                        }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, {
                                      cols: "12",
                                      md: "6"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VTextField, {
                                          modelValue: formData.value.latitude,
                                          "onUpdate:modelValue": ($event) => formData.value.latitude = $event,
                                          modelModifiers: { number: true },
                                          label: "Latitude",
                                          type: "number",
                                          step: "any",
                                          outlined: ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, {
                                      cols: "12",
                                      md: "6"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VTextField, {
                                          modelValue: formData.value.longitude,
                                          "onUpdate:modelValue": ($event) => formData.value.longitude = $event,
                                          modelModifiers: { number: true },
                                          label: "Longitude",
                                          type: "number",
                                          step: "any",
                                          outlined: ""
                                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          _: 1
                        }),
                        createVNode(VCardActions, null, {
                          default: withCtx(() => [
                            createVNode(VSpacer),
                            createVNode(VBtn, {
                              text: "",
                              onClick: closeDialog
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Cancel")
                              ]),
                              _: 1
                            }),
                            createVNode(VBtn, {
                              color: "primary",
                              onClick: saveSupplier,
                              loading: unref(suppliersStore).loading,
                              disabled: !formValid.value
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(isEditing.value ? "Update" : "Create"), 1)
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
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VDialog, {
              modelValue: showDeleteDialog.value,
              "onUpdate:modelValue": ($event) => showDeleteDialog.value = $event,
              "max-width": "400px"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCard, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VCardTitle, { class: "text-h5" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Confirm Delete`);
                            } else {
                              return [
                                createTextVNode("Confirm Delete")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VCardText, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            var _a, _b;
                            if (_push5) {
                              _push5(` Are you sure you want to delete &quot;${ssrInterpolate((_a = supplierToDelete.value) == null ? void 0 : _a.name)}&quot;? This action cannot be undone. `);
                            } else {
                              return [
                                createTextVNode(' Are you sure you want to delete "' + toDisplayString((_b = supplierToDelete.value) == null ? void 0 : _b.name) + '"? This action cannot be undone. ', 1)
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
                                onClick: ($event) => showDeleteDialog.value = false
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Cancel`);
                                  } else {
                                    return [
                                      createTextVNode("Cancel")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(VBtn, {
                                color: "error",
                                onClick: deleteSupplier,
                                loading: unref(suppliersStore).loading
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` Delete `);
                                  } else {
                                    return [
                                      createTextVNode(" Delete ")
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
                                  onClick: ($event) => showDeleteDialog.value = false
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Cancel")
                                  ]),
                                  _: 1
                                }, 8, ["onClick"]),
                                createVNode(VBtn, {
                                  color: "error",
                                  onClick: deleteSupplier,
                                  loading: unref(suppliersStore).loading
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Delete ")
                                  ]),
                                  _: 1
                                }, 8, ["loading"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VCardTitle, { class: "text-h5" }, {
                            default: withCtx(() => [
                              createTextVNode("Confirm Delete")
                            ]),
                            _: 1
                          }),
                          createVNode(VCardText, null, {
                            default: withCtx(() => {
                              var _a;
                              return [
                                createTextVNode(' Are you sure you want to delete "' + toDisplayString((_a = supplierToDelete.value) == null ? void 0 : _a.name) + '"? This action cannot be undone. ', 1)
                              ];
                            }),
                            _: 1
                          }),
                          createVNode(VCardActions, null, {
                            default: withCtx(() => [
                              createVNode(VSpacer),
                              createVNode(VBtn, {
                                text: "",
                                onClick: ($event) => showDeleteDialog.value = false
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Cancel")
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode(VBtn, {
                                color: "error",
                                onClick: deleteSupplier,
                                loading: unref(suppliersStore).loading
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Delete ")
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
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VCard, null, {
                      default: withCtx(() => [
                        createVNode(VCardTitle, { class: "text-h5" }, {
                          default: withCtx(() => [
                            createTextVNode("Confirm Delete")
                          ]),
                          _: 1
                        }),
                        createVNode(VCardText, null, {
                          default: withCtx(() => {
                            var _a;
                            return [
                              createTextVNode(' Are you sure you want to delete "' + toDisplayString((_a = supplierToDelete.value) == null ? void 0 : _a.name) + '"? This action cannot be undone. ', 1)
                            ];
                          }),
                          _: 1
                        }),
                        createVNode(VCardActions, null, {
                          default: withCtx(() => [
                            createVNode(VSpacer),
                            createVNode(VBtn, {
                              text: "",
                              onClick: ($event) => showDeleteDialog.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Cancel")
                              ]),
                              _: 1
                            }, 8, ["onClick"]),
                            createVNode(VBtn, {
                              color: "error",
                              onClick: deleteSupplier,
                              loading: unref(suppliersStore).loading
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" Delete ")
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
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(VDialog, {
              modelValue: showViewDialog.value,
              "onUpdate:modelValue": ($event) => showViewDialog.value = $event,
              "max-width": "500px"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (unref(suppliersStore).selectedSupplier) {
                    _push3(ssrRenderComponent(VCard, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VCardTitle, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<span class="text-h5" data-v-3e9847a8${_scopeId4}>${ssrInterpolate(unref(suppliersStore).selectedSupplier.name)}</span>`);
                              } else {
                                return [
                                  createVNode("span", { class: "text-h5" }, toDisplayString(unref(suppliersStore).selectedSupplier.name), 1)
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
                                      _push6(ssrRenderComponent(VCol, { cols: "6" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<strong data-v-3e9847a8${_scopeId6}>Contact Person:</strong> ${ssrInterpolate(unref(suppliersStore).selectedSupplier.contactPerson)}`);
                                          } else {
                                            return [
                                              createVNode("strong", null, "Contact Person:"),
                                              createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.contactPerson), 1)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(VCol, { cols: "6" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<strong data-v-3e9847a8${_scopeId6}>Phone:</strong> ${ssrInterpolate(unref(suppliersStore).selectedSupplier.phone)}`);
                                          } else {
                                            return [
                                              createVNode("strong", null, "Phone:"),
                                              createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.phone), 1)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(VCol, { cols: "12" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<strong data-v-3e9847a8${_scopeId6}>Email:</strong> ${ssrInterpolate(unref(suppliersStore).selectedSupplier.email || "N/A")}`);
                                          } else {
                                            return [
                                              createVNode("strong", null, "Email:"),
                                              createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.email || "N/A"), 1)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(VCol, { cols: "12" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<strong data-v-3e9847a8${_scopeId6}>Address:</strong> ${ssrInterpolate(unref(suppliersStore).selectedSupplier.address)}`);
                                          } else {
                                            return [
                                              createVNode("strong", null, "Address:"),
                                              createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.address), 1)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      if (unref(suppliersStore).selectedSupplier.latitude) {
                                        _push6(ssrRenderComponent(VCol, { cols: "6" }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`<strong data-v-3e9847a8${_scopeId6}>Latitude:</strong> ${ssrInterpolate(unref(suppliersStore).selectedSupplier.latitude)}`);
                                            } else {
                                              return [
                                                createVNode("strong", null, "Latitude:"),
                                                createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.latitude), 1)
                                              ];
                                            }
                                          }),
                                          _: 1
                                        }, _parent6, _scopeId5));
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                      if (unref(suppliersStore).selectedSupplier.longitude) {
                                        _push6(ssrRenderComponent(VCol, { cols: "6" }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`<strong data-v-3e9847a8${_scopeId6}>Longitude:</strong> ${ssrInterpolate(unref(suppliersStore).selectedSupplier.longitude)}`);
                                            } else {
                                              return [
                                                createVNode("strong", null, "Longitude:"),
                                                createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.longitude), 1)
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
                                            _push7(`<strong data-v-3e9847a8${_scopeId6}>Status:</strong>`);
                                            _push7(ssrRenderComponent(VChip, {
                                              color: unref(suppliersStore).selectedSupplier.isActive ? "success" : "error",
                                              size: "small"
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(unref(suppliersStore).selectedSupplier.isActive ? "Active" : "Inactive")}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(unref(suppliersStore).selectedSupplier.isActive ? "Active" : "Inactive"), 1)
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode("strong", null, "Status:"),
                                              createVNode(VChip, {
                                                color: unref(suppliersStore).selectedSupplier.isActive ? "success" : "error",
                                                size: "small"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(unref(suppliersStore).selectedSupplier.isActive ? "Active" : "Inactive"), 1)
                                                ]),
                                                _: 1
                                              }, 8, ["color"])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(VCol, { cols: "6" }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          var _a, _b;
                                          if (_push7) {
                                            _push7(`<strong data-v-3e9847a8${_scopeId6}>Gas Cylinders:</strong> ${ssrInterpolate(((_a = unref(suppliersStore).selectedSupplier.gasCylinders) == null ? void 0 : _a.length) || 0)}`);
                                          } else {
                                            return [
                                              createVNode("strong", null, "Gas Cylinders:"),
                                              createTextVNode(" " + toDisplayString(((_b = unref(suppliersStore).selectedSupplier.gasCylinders) == null ? void 0 : _b.length) || 0), 1)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(VCol, { cols: "6" }, {
                                          default: withCtx(() => [
                                            createVNode("strong", null, "Contact Person:"),
                                            createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.contactPerson), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, { cols: "6" }, {
                                          default: withCtx(() => [
                                            createVNode("strong", null, "Phone:"),
                                            createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.phone), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, { cols: "12" }, {
                                          default: withCtx(() => [
                                            createVNode("strong", null, "Email:"),
                                            createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.email || "N/A"), 1)
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, { cols: "12" }, {
                                          default: withCtx(() => [
                                            createVNode("strong", null, "Address:"),
                                            createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.address), 1)
                                          ]),
                                          _: 1
                                        }),
                                        unref(suppliersStore).selectedSupplier.latitude ? (openBlock(), createBlock(VCol, {
                                          key: 0,
                                          cols: "6"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("strong", null, "Latitude:"),
                                            createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.latitude), 1)
                                          ]),
                                          _: 1
                                        })) : createCommentVNode("", true),
                                        unref(suppliersStore).selectedSupplier.longitude ? (openBlock(), createBlock(VCol, {
                                          key: 1,
                                          cols: "6"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("strong", null, "Longitude:"),
                                            createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.longitude), 1)
                                          ]),
                                          _: 1
                                        })) : createCommentVNode("", true),
                                        createVNode(VCol, { cols: "6" }, {
                                          default: withCtx(() => [
                                            createVNode("strong", null, "Status:"),
                                            createVNode(VChip, {
                                              color: unref(suppliersStore).selectedSupplier.isActive ? "success" : "error",
                                              size: "small"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(unref(suppliersStore).selectedSupplier.isActive ? "Active" : "Inactive"), 1)
                                              ]),
                                              _: 1
                                            }, 8, ["color"])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, { cols: "6" }, {
                                          default: withCtx(() => {
                                            var _a;
                                            return [
                                              createVNode("strong", null, "Gas Cylinders:"),
                                              createTextVNode(" " + toDisplayString(((_a = unref(suppliersStore).selectedSupplier.gasCylinders) == null ? void 0 : _a.length) || 0), 1)
                                            ];
                                          }),
                                          _: 1
                                        })
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VRow, null, {
                                    default: withCtx(() => [
                                      createVNode(VCol, { cols: "6" }, {
                                        default: withCtx(() => [
                                          createVNode("strong", null, "Contact Person:"),
                                          createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.contactPerson), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, { cols: "6" }, {
                                        default: withCtx(() => [
                                          createVNode("strong", null, "Phone:"),
                                          createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.phone), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, { cols: "12" }, {
                                        default: withCtx(() => [
                                          createVNode("strong", null, "Email:"),
                                          createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.email || "N/A"), 1)
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, { cols: "12" }, {
                                        default: withCtx(() => [
                                          createVNode("strong", null, "Address:"),
                                          createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.address), 1)
                                        ]),
                                        _: 1
                                      }),
                                      unref(suppliersStore).selectedSupplier.latitude ? (openBlock(), createBlock(VCol, {
                                        key: 0,
                                        cols: "6"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("strong", null, "Latitude:"),
                                          createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.latitude), 1)
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true),
                                      unref(suppliersStore).selectedSupplier.longitude ? (openBlock(), createBlock(VCol, {
                                        key: 1,
                                        cols: "6"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("strong", null, "Longitude:"),
                                          createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.longitude), 1)
                                        ]),
                                        _: 1
                                      })) : createCommentVNode("", true),
                                      createVNode(VCol, { cols: "6" }, {
                                        default: withCtx(() => [
                                          createVNode("strong", null, "Status:"),
                                          createVNode(VChip, {
                                            color: unref(suppliersStore).selectedSupplier.isActive ? "success" : "error",
                                            size: "small"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(unref(suppliersStore).selectedSupplier.isActive ? "Active" : "Inactive"), 1)
                                            ]),
                                            _: 1
                                          }, 8, ["color"])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, { cols: "6" }, {
                                        default: withCtx(() => {
                                          var _a;
                                          return [
                                            createVNode("strong", null, "Gas Cylinders:"),
                                            createTextVNode(" " + toDisplayString(((_a = unref(suppliersStore).selectedSupplier.gasCylinders) == null ? void 0 : _a.length) || 0), 1)
                                          ];
                                        }),
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
                                  onClick: ($event) => editSupplier(unref(suppliersStore).selectedSupplier)
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
                                    onClick: ($event) => editSupplier(unref(suppliersStore).selectedSupplier)
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
                                createVNode("span", { class: "text-h5" }, toDisplayString(unref(suppliersStore).selectedSupplier.name), 1)
                              ]),
                              _: 1
                            }),
                            createVNode(VCardText, null, {
                              default: withCtx(() => [
                                createVNode(VRow, null, {
                                  default: withCtx(() => [
                                    createVNode(VCol, { cols: "6" }, {
                                      default: withCtx(() => [
                                        createVNode("strong", null, "Contact Person:"),
                                        createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.contactPerson), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, { cols: "6" }, {
                                      default: withCtx(() => [
                                        createVNode("strong", null, "Phone:"),
                                        createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.phone), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, { cols: "12" }, {
                                      default: withCtx(() => [
                                        createVNode("strong", null, "Email:"),
                                        createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.email || "N/A"), 1)
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, { cols: "12" }, {
                                      default: withCtx(() => [
                                        createVNode("strong", null, "Address:"),
                                        createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.address), 1)
                                      ]),
                                      _: 1
                                    }),
                                    unref(suppliersStore).selectedSupplier.latitude ? (openBlock(), createBlock(VCol, {
                                      key: 0,
                                      cols: "6"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("strong", null, "Latitude:"),
                                        createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.latitude), 1)
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true),
                                    unref(suppliersStore).selectedSupplier.longitude ? (openBlock(), createBlock(VCol, {
                                      key: 1,
                                      cols: "6"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("strong", null, "Longitude:"),
                                        createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.longitude), 1)
                                      ]),
                                      _: 1
                                    })) : createCommentVNode("", true),
                                    createVNode(VCol, { cols: "6" }, {
                                      default: withCtx(() => [
                                        createVNode("strong", null, "Status:"),
                                        createVNode(VChip, {
                                          color: unref(suppliersStore).selectedSupplier.isActive ? "success" : "error",
                                          size: "small"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(unref(suppliersStore).selectedSupplier.isActive ? "Active" : "Inactive"), 1)
                                          ]),
                                          _: 1
                                        }, 8, ["color"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, { cols: "6" }, {
                                      default: withCtx(() => {
                                        var _a;
                                        return [
                                          createVNode("strong", null, "Gas Cylinders:"),
                                          createTextVNode(" " + toDisplayString(((_a = unref(suppliersStore).selectedSupplier.gasCylinders) == null ? void 0 : _a.length) || 0), 1)
                                        ];
                                      }),
                                      _: 1
                                    })
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
                                  onClick: ($event) => editSupplier(unref(suppliersStore).selectedSupplier)
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
                    unref(suppliersStore).selectedSupplier ? (openBlock(), createBlock(VCard, { key: 0 }, {
                      default: withCtx(() => [
                        createVNode(VCardTitle, null, {
                          default: withCtx(() => [
                            createVNode("span", { class: "text-h5" }, toDisplayString(unref(suppliersStore).selectedSupplier.name), 1)
                          ]),
                          _: 1
                        }),
                        createVNode(VCardText, null, {
                          default: withCtx(() => [
                            createVNode(VRow, null, {
                              default: withCtx(() => [
                                createVNode(VCol, { cols: "6" }, {
                                  default: withCtx(() => [
                                    createVNode("strong", null, "Contact Person:"),
                                    createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.contactPerson), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, { cols: "6" }, {
                                  default: withCtx(() => [
                                    createVNode("strong", null, "Phone:"),
                                    createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.phone), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, { cols: "12" }, {
                                  default: withCtx(() => [
                                    createVNode("strong", null, "Email:"),
                                    createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.email || "N/A"), 1)
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, { cols: "12" }, {
                                  default: withCtx(() => [
                                    createVNode("strong", null, "Address:"),
                                    createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.address), 1)
                                  ]),
                                  _: 1
                                }),
                                unref(suppliersStore).selectedSupplier.latitude ? (openBlock(), createBlock(VCol, {
                                  key: 0,
                                  cols: "6"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("strong", null, "Latitude:"),
                                    createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.latitude), 1)
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                unref(suppliersStore).selectedSupplier.longitude ? (openBlock(), createBlock(VCol, {
                                  key: 1,
                                  cols: "6"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("strong", null, "Longitude:"),
                                    createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.longitude), 1)
                                  ]),
                                  _: 1
                                })) : createCommentVNode("", true),
                                createVNode(VCol, { cols: "6" }, {
                                  default: withCtx(() => [
                                    createVNode("strong", null, "Status:"),
                                    createVNode(VChip, {
                                      color: unref(suppliersStore).selectedSupplier.isActive ? "success" : "error",
                                      size: "small"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(unref(suppliersStore).selectedSupplier.isActive ? "Active" : "Inactive"), 1)
                                      ]),
                                      _: 1
                                    }, 8, ["color"])
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, { cols: "6" }, {
                                  default: withCtx(() => {
                                    var _a;
                                    return [
                                      createVNode("strong", null, "Gas Cylinders:"),
                                      createTextVNode(" " + toDisplayString(((_a = unref(suppliersStore).selectedSupplier.gasCylinders) == null ? void 0 : _a.length) || 0), 1)
                                    ];
                                  }),
                                  _: 1
                                })
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
                              onClick: ($event) => editSupplier(unref(suppliersStore).selectedSupplier)
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
                          createVNode("h1", { class: "text-h4" }, "Suppliers"),
                          createVNode("p", { class: "text-subtitle-1 text-grey" }, "Manage your gas cylinder suppliers")
                        ]),
                        createVNode(VBtn, {
                          color: "primary",
                          size: "large",
                          onClick: openCreateDialog,
                          "prepend-icon": "mdi-plus"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Add Supplier ")
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
              unref(suppliersStore).error ? (openBlock(), createBlock(VAlert, {
                key: 0,
                type: "error",
                dismissible: "",
                class: "mb-4",
                "onClick:close": unref(suppliersStore).clearError
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(suppliersStore).error), 1)
                ]),
                _: 1
              }, 8, ["onClick:close"])) : createCommentVNode("", true),
              createVNode(VRow, { class: "mb-6" }, {
                default: withCtx(() => [
                  createVNode(VCol, {
                    cols: "12",
                    sm: "6",
                    md: "4"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, { class: "text-center" }, {
                        default: withCtx(() => [
                          createVNode(VCardText, null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "text-h5 primary--text" }, toDisplayString(unref(suppliersStore).suppliers.length), 1),
                              createVNode("div", { class: "text-subtitle-1" }, "Total Suppliers")
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
                    md: "4"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, { class: "text-center" }, {
                        default: withCtx(() => [
                          createVNode(VCardText, null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "text-h5 success--text" }, toDisplayString(unref(suppliersStore).activeSuppliers.length), 1),
                              createVNode("div", { class: "text-subtitle-1" }, "Active Suppliers")
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
                    md: "4"
                  }, {
                    default: withCtx(() => [
                      createVNode(VCard, { class: "text-center" }, {
                        default: withCtx(() => [
                          createVNode(VCardText, null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "text-h5 info--text" }, toDisplayString(unref(suppliersStore).suppliers.length - unref(suppliersStore).activeSuppliers.length), 1),
                              createVNode("div", { class: "text-subtitle-1" }, "Inactive Suppliers")
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
                            md: "6"
                          }, {
                            default: withCtx(() => [
                              createVNode(VTextField, {
                                modelValue: searchQuery.value,
                                "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                                label: "Search suppliers...",
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
                                modelValue: statusFilter.value,
                                "onUpdate:modelValue": ($event) => statusFilter.value = $event,
                                items: statusOptions,
                                label: "Status",
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
                              createVNode(VBtn, {
                                color: "primary",
                                block: "",
                                onClick: refreshData,
                                loading: unref(suppliersStore).loading
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
                    items: filteredSuppliers.value,
                    loading: unref(suppliersStore).loading,
                    "item-key": "id",
                    class: "elevation-1",
                    "items-per-page": 10
                  }, {
                    "item.name": withCtx(({ item }) => [
                      createVNode("div", null, [
                        createVNode("div", { class: "font-weight-medium" }, toDisplayString(item.name), 1),
                        createVNode("div", { class: "text-caption text-grey" }, toDisplayString(item.contactPerson), 1)
                      ])
                    ]),
                    "item.contact": withCtx(({ item }) => [
                      createVNode("div", null, [
                        createVNode("div", null, toDisplayString(item.phone), 1),
                        createVNode("div", { class: "text-caption text-grey" }, toDisplayString(item.email || "No email"), 1)
                      ])
                    ]),
                    "item.address": withCtx(({ item }) => [
                      createVNode("div", {
                        class: "text-truncate",
                        style: { "max-width": "200px" }
                      }, toDisplayString(item.address), 1)
                    ]),
                    "item.isActive": withCtx(({ item }) => [
                      createVNode(VChip, {
                        color: item.isActive ? "success" : "error",
                        size: "small",
                        class: "ma-1"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.isActive ? "Active" : "Inactive"), 1)
                        ]),
                        _: 2
                      }, 1032, ["color"])
                    ]),
                    "item.cylindersCount": withCtx(({ item }) => {
                      var _a;
                      return [
                        createTextVNode(toDisplayString(((_a = item.gasCylinders) == null ? void 0 : _a.length) || 0), 1)
                      ];
                    }),
                    "item.actions": withCtx(({ item }) => [
                      createVNode("div", { class: "d-flex gap-1" }, [
                        createVNode(VBtn, {
                          icon: "mdi-eye",
                          size: "small",
                          variant: "text",
                          onClick: ($event) => viewSupplier(item)
                        }, null, 8, ["onClick"]),
                        createVNode(VBtn, {
                          icon: "mdi-pencil",
                          size: "small",
                          variant: "text",
                          onClick: ($event) => editSupplier(item)
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
                    _: 1
                  }, 8, ["items", "loading"])
                ]),
                _: 1
              }),
              createVNode(VDialog, {
                modelValue: showDialog.value,
                "onUpdate:modelValue": ($event) => showDialog.value = $event,
                "max-width": "600px",
                persistent: ""
              }, {
                default: withCtx(() => [
                  createVNode(VCard, null, {
                    default: withCtx(() => [
                      createVNode(VCardTitle, null, {
                        default: withCtx(() => [
                          createVNode("span", { class: "text-h5" }, toDisplayString(isEditing.value ? "Edit" : "Add") + " Supplier", 1)
                        ]),
                        _: 1
                      }),
                      createVNode(VCardText, null, {
                        default: withCtx(() => [
                          createVNode(VForm, {
                            ref: "supplierForm",
                            modelValue: formValid.value,
                            "onUpdate:modelValue": ($event) => formValid.value = $event
                          }, {
                            default: withCtx(() => [
                              createVNode(VRow, null, {
                                default: withCtx(() => [
                                  createVNode(VCol, {
                                    cols: "12",
                                    md: "6"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VTextField, {
                                        modelValue: formData.value.name,
                                        "onUpdate:modelValue": ($event) => formData.value.name = $event,
                                        label: "Company Name*",
                                        rules: [rules.required],
                                        outlined: ""
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCol, {
                                    cols: "12",
                                    md: "6"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VTextField, {
                                        modelValue: formData.value.contactPerson,
                                        "onUpdate:modelValue": ($event) => formData.value.contactPerson = $event,
                                        label: "Contact Person*",
                                        rules: [rules.required],
                                        outlined: ""
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCol, {
                                    cols: "12",
                                    md: "6"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VTextField, {
                                        modelValue: formData.value.phone,
                                        "onUpdate:modelValue": ($event) => formData.value.phone = $event,
                                        label: "Phone Number*",
                                        rules: [rules.required],
                                        outlined: ""
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCol, {
                                    cols: "12",
                                    md: "6"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VTextField, {
                                        modelValue: formData.value.email,
                                        "onUpdate:modelValue": ($event) => formData.value.email = $event,
                                        label: "Email",
                                        rules: [rules.email],
                                        outlined: ""
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCol, { cols: "12" }, {
                                    default: withCtx(() => [
                                      createVNode(VTextarea, {
                                        modelValue: formData.value.address,
                                        "onUpdate:modelValue": ($event) => formData.value.address = $event,
                                        label: "Address*",
                                        rules: [rules.required],
                                        outlined: "",
                                        rows: "3"
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "rules"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCol, {
                                    cols: "12",
                                    md: "6"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VTextField, {
                                        modelValue: formData.value.latitude,
                                        "onUpdate:modelValue": ($event) => formData.value.latitude = $event,
                                        modelModifiers: { number: true },
                                        label: "Latitude",
                                        type: "number",
                                        step: "any",
                                        outlined: ""
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(VCol, {
                                    cols: "12",
                                    md: "6"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VTextField, {
                                        modelValue: formData.value.longitude,
                                        "onUpdate:modelValue": ($event) => formData.value.longitude = $event,
                                        modelModifiers: { number: true },
                                        label: "Longitude",
                                        type: "number",
                                        step: "any",
                                        outlined: ""
                                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        _: 1
                      }),
                      createVNode(VCardActions, null, {
                        default: withCtx(() => [
                          createVNode(VSpacer),
                          createVNode(VBtn, {
                            text: "",
                            onClick: closeDialog
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }),
                          createVNode(VBtn, {
                            color: "primary",
                            onClick: saveSupplier,
                            loading: unref(suppliersStore).loading,
                            disabled: !formValid.value
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(isEditing.value ? "Update" : "Create"), 1)
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
              }, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(VDialog, {
                modelValue: showDeleteDialog.value,
                "onUpdate:modelValue": ($event) => showDeleteDialog.value = $event,
                "max-width": "400px"
              }, {
                default: withCtx(() => [
                  createVNode(VCard, null, {
                    default: withCtx(() => [
                      createVNode(VCardTitle, { class: "text-h5" }, {
                        default: withCtx(() => [
                          createTextVNode("Confirm Delete")
                        ]),
                        _: 1
                      }),
                      createVNode(VCardText, null, {
                        default: withCtx(() => {
                          var _a;
                          return [
                            createTextVNode(' Are you sure you want to delete "' + toDisplayString((_a = supplierToDelete.value) == null ? void 0 : _a.name) + '"? This action cannot be undone. ', 1)
                          ];
                        }),
                        _: 1
                      }),
                      createVNode(VCardActions, null, {
                        default: withCtx(() => [
                          createVNode(VSpacer),
                          createVNode(VBtn, {
                            text: "",
                            onClick: ($event) => showDeleteDialog.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(VBtn, {
                            color: "error",
                            onClick: deleteSupplier,
                            loading: unref(suppliersStore).loading
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Delete ")
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
              }, 8, ["modelValue", "onUpdate:modelValue"]),
              createVNode(VDialog, {
                modelValue: showViewDialog.value,
                "onUpdate:modelValue": ($event) => showViewDialog.value = $event,
                "max-width": "500px"
              }, {
                default: withCtx(() => [
                  unref(suppliersStore).selectedSupplier ? (openBlock(), createBlock(VCard, { key: 0 }, {
                    default: withCtx(() => [
                      createVNode(VCardTitle, null, {
                        default: withCtx(() => [
                          createVNode("span", { class: "text-h5" }, toDisplayString(unref(suppliersStore).selectedSupplier.name), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(VCardText, null, {
                        default: withCtx(() => [
                          createVNode(VRow, null, {
                            default: withCtx(() => [
                              createVNode(VCol, { cols: "6" }, {
                                default: withCtx(() => [
                                  createVNode("strong", null, "Contact Person:"),
                                  createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.contactPerson), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(VCol, { cols: "6" }, {
                                default: withCtx(() => [
                                  createVNode("strong", null, "Phone:"),
                                  createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.phone), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(VCol, { cols: "12" }, {
                                default: withCtx(() => [
                                  createVNode("strong", null, "Email:"),
                                  createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.email || "N/A"), 1)
                                ]),
                                _: 1
                              }),
                              createVNode(VCol, { cols: "12" }, {
                                default: withCtx(() => [
                                  createVNode("strong", null, "Address:"),
                                  createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.address), 1)
                                ]),
                                _: 1
                              }),
                              unref(suppliersStore).selectedSupplier.latitude ? (openBlock(), createBlock(VCol, {
                                key: 0,
                                cols: "6"
                              }, {
                                default: withCtx(() => [
                                  createVNode("strong", null, "Latitude:"),
                                  createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.latitude), 1)
                                ]),
                                _: 1
                              })) : createCommentVNode("", true),
                              unref(suppliersStore).selectedSupplier.longitude ? (openBlock(), createBlock(VCol, {
                                key: 1,
                                cols: "6"
                              }, {
                                default: withCtx(() => [
                                  createVNode("strong", null, "Longitude:"),
                                  createTextVNode(" " + toDisplayString(unref(suppliersStore).selectedSupplier.longitude), 1)
                                ]),
                                _: 1
                              })) : createCommentVNode("", true),
                              createVNode(VCol, { cols: "6" }, {
                                default: withCtx(() => [
                                  createVNode("strong", null, "Status:"),
                                  createVNode(VChip, {
                                    color: unref(suppliersStore).selectedSupplier.isActive ? "success" : "error",
                                    size: "small"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(unref(suppliersStore).selectedSupplier.isActive ? "Active" : "Inactive"), 1)
                                    ]),
                                    _: 1
                                  }, 8, ["color"])
                                ]),
                                _: 1
                              }),
                              createVNode(VCol, { cols: "6" }, {
                                default: withCtx(() => {
                                  var _a;
                                  return [
                                    createVNode("strong", null, "Gas Cylinders:"),
                                    createTextVNode(" " + toDisplayString(((_a = unref(suppliersStore).selectedSupplier.gasCylinders) == null ? void 0 : _a.length) || 0), 1)
                                  ];
                                }),
                                _: 1
                              })
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
                            onClick: ($event) => editSupplier(unref(suppliersStore).selectedSupplier)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/suppliers.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const suppliers = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3e9847a8"]]);

export { suppliers as default };
//# sourceMappingURL=suppliers-6s2A4E24.mjs.map
