import { defineComponent, ref, computed, watch, mergeProps, withCtx, createTextVNode, createVNode, toDisplayString, unref, useSSRContext, createBlock, createCommentVNode, openBlock, Fragment, renderList } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { defineStore } from "pinia";
import { d as useApiService, e as useAuthStore, x as VDialog, i as VCard, l as VCardTitle, q as VIcon, y as VDivider, m as VCardText, k as VAlert, z as VSelect, A as VListItem, B as VListItemTitle, C as VListItemSubtitle, D as VChip, E as VAvatar, v as VTextField, F as VTextarea, G as VCardActions, H as VSpacer, w as VBtn, O as OrderStatus, V as VContainer, f as VRow, g as VCol, I as VDataTable, h as VSkeletonLoader, J as VMenu, K as VList } from "../server.mjs";
import { useRouter } from "vue-router";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "ofetch";
import "#internal/nuxt/paths";
import "/home/pope/zcode/hfmg/4/fullgass/dash/node_modules/hookable/dist/index.mjs";
import "/home/pope/zcode/hfmg/4/fullgass/dash/node_modules/unctx/dist/index.mjs";
import "/home/pope/zcode/hfmg/4/fullgass/dash/node_modules/h3/dist/index.mjs";
import "/home/pope/zcode/hfmg/4/fullgass/dash/node_modules/defu/dist/defu.mjs";
import "/home/pope/zcode/hfmg/4/fullgass/dash/node_modules/radix3/dist/index.mjs";
import "/home/pope/zcode/hfmg/4/fullgass/dash/node_modules/ufo/dist/index.mjs";
import "/home/pope/zcode/hfmg/4/fullgass/dash/node_modules/klona/dist/index.mjs";
const useOrdersStore = defineStore("orders", {
  state: () => ({
    orders: [],
    pagination: null,
    loading: false,
    error: null,
    availableDrivers: [],
    loadingDrivers: false,
    driverError: null,
    assigningDriver: false,
    lastAssignedOrder: null
  }),
  getters: {
    hasOrders(state) {
      return state.orders.length > 0;
    },
    isLoading(state) {
      return state.loading;
    },
    hasError(state) {
      return !!state.error;
    },
    getPagination(state) {
      return state.pagination;
    },
    getAvailableDrivers(state) {
      return state.availableDrivers;
    },
    // New getters for driver assignment
    unassignedOrders(state) {
      return state.orders.filter(
        (order) => !order.driver && (order.status === "pending" || order.status === "confirmed")
      );
    },
    assignedOrders(state) {
      return state.orders.filter((order) => order.driver);
    },
    ordersByStatus: (state) => (status) => {
      return state.orders.filter((order) => order.status === status);
    },
    availableDriversCount(state) {
      return state.availableDrivers.filter((driver) => driver.isActive).length;
    },
    driverById: (state) => (driverId) => {
      return state.availableDrivers.find((driver) => driver.id === driverId);
    }
  },
  actions: {
    async fetchOrders(params) {
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
        const response = await apiService.getAllOrders(authStore.token, params);
        this.orders = response.data;
        this.pagination = response.pagination;
      } catch (error) {
        this.error = error.message || "Failed to fetch orders";
        this.orders = [];
        this.pagination = null;
      } finally {
        this.loading = false;
      }
    },
    // Example action to change page, can be expanded with more query params
    async changeOrdersPage(page) {
      if (this.pagination) {
        await this.fetchOrders({ page, limit: this.pagination.limit });
      }
    },
    async fetchAvailableDrivers() {
      this.loadingDrivers = true;
      this.driverError = null;
      const apiService = useApiService();
      const authStore = useAuthStore();
      if (!authStore.token) {
        this.driverError = "Authentication token not found. Please login.";
        this.loadingDrivers = false;
        return;
      }
      try {
        const response = await apiService.getAllDrivers(authStore.token, { isActive: true });
        this.availableDrivers = response.map((driver) => ({
          ...driver,
          displayName: `${driver.firstName} ${driver.lastName}`
        }));
      } catch (error) {
        this.driverError = error.message || "Failed to load available drivers";
      } finally {
        this.loadingDrivers = false;
      }
    },
    async assignDriverToOrder(orderId, driverId, payload) {
      this.assigningDriver = true;
      this.driverError = null;
      const apiService = useApiService();
      const authStore = useAuthStore();
      if (!authStore.token) {
        this.driverError = "Authentication token not found. Please login.";
        this.assigningDriver = false;
        throw new Error("Authentication token not found.");
      }
      try {
        const response = await apiService.assignDriverToOrder(orderId, driverId, authStore.token, payload);
        const updatedOrder = response.order;
        this.lastAssignedOrder = updatedOrder;
        const index = this.orders.findIndex((order) => order.id === updatedOrder.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        return updatedOrder;
      } catch (error) {
        this.driverError = error.message || "Failed to assign driver";
        throw error;
      } finally {
        this.assigningDriver = false;
      }
    },
    async updateOrderStatus(orderId, status) {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();
      if (!authStore.token) {
        this.error = "Authentication token not found. Please login.";
        this.loading = false;
        throw new Error("Authentication token not found.");
      }
      try {
        const updatedOrder = await apiService.updateOrder(orderId, { status }, authStore.token);
        const index = this.orders.findIndex((order) => order.id === updatedOrder.id);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
        return updatedOrder;
      } catch (error) {
        this.error = error.message || "Failed to update order status";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteOrder(orderId) {
      this.loading = true;
      this.error = null;
      const apiService = useApiService();
      const authStore = useAuthStore();
      if (!authStore.token) {
        this.error = "Authentication token not found. Please login.";
        this.loading = false;
        throw new Error("Authentication token not found.");
      }
      try {
        await apiService.deleteOrder(orderId, authStore.token);
        this.orders = this.orders.filter((order) => order.id !== orderId);
      } catch (error) {
        this.error = error.message || "Failed to delete order";
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "DriverAssignDialog",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
    order: {}
  },
  emits: ["update:modelValue", "driver-assigned"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const ordersStore = useOrdersStore();
    const selectedDriverId = ref(null);
    const estimatedDeliveryTime = ref("");
    const assignmentNotes = ref("");
    const dialog = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value)
    });
    watch(() => props.modelValue, (newValue) => {
      if (newValue) {
        ordersStore.fetchAvailableDrivers();
        resetForm();
      }
    });
    const assignDriver = async () => {
      if (!selectedDriverId.value || !props.order) return;
      try {
        const updatedOrder = await ordersStore.assignDriverToOrder(
          props.order.id,
          selectedDriverId.value,
          {
            estimatedDeliveryTime: estimatedDeliveryTime.value || void 0,
            specialInstructions: assignmentNotes.value || void 0
          }
        );
        emit("driver-assigned", updatedOrder);
        closeDialog();
      } catch (error) {
        console.error("Error assigning driver:", error);
      }
    };
    const closeDialog = () => {
      dialog.value = false;
    };
    const resetForm = () => {
      selectedDriverId.value = null;
      estimatedDeliveryTime.value = "";
      assignmentNotes.value = "";
    };
    const formatAmount = (amount) => {
      const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
      return new Intl.NumberFormat("en-UG", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(numAmount);
    };
    const getDriverStatusColor = (driver) => {
      return driver.isActive ? "success" : "error";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VDialog, mergeProps({
        modelValue: dialog.value,
        "onUpdate:modelValue": ($event) => dialog.value = $event,
        "max-width": "600px",
        persistent: ""
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VCard, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCardTitle, { class: "text-h5" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      var _a, _b;
                      if (_push4) {
                        _push4(ssrRenderComponent(VIcon, { left: "" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`mdi-account-plus`);
                            } else {
                              return [
                                createTextVNode("mdi-account-plus")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(` Assign Driver to Order #${ssrInterpolate((_a = _ctx.order) == null ? void 0 : _a.orderNumber)}`);
                      } else {
                        return [
                          createVNode(VIcon, { left: "" }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-account-plus")
                            ]),
                            _: 1
                          }),
                          createTextVNode(" Assign Driver to Order #" + toDisplayString((_b = _ctx.order) == null ? void 0 : _b.orderNumber), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VDivider, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VCardText, { class: "pt-4" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VAlert, {
                          type: "info",
                          class: "mb-4",
                          variant: "tonal"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
                            if (_push5) {
                              _push5(`<div class="d-flex align-center" data-v-8769e502${_scopeId4}><div data-v-8769e502${_scopeId4}><strong data-v-8769e502${_scopeId4}>Customer:</strong> ${ssrInterpolate((_b = (_a = _ctx.order) == null ? void 0 : _a.customer) == null ? void 0 : _b.firstName)} ${ssrInterpolate((_d = (_c = _ctx.order) == null ? void 0 : _c.customer) == null ? void 0 : _d.lastName)}<br data-v-8769e502${_scopeId4}><strong data-v-8769e502${_scopeId4}>Delivery Address:</strong> ${ssrInterpolate((_e = _ctx.order) == null ? void 0 : _e.deliveryAddress)}<br data-v-8769e502${_scopeId4}><strong data-v-8769e502${_scopeId4}>Total Amount:</strong> UGX ${ssrInterpolate(formatAmount(((_f = _ctx.order) == null ? void 0 : _f.totalAmount) ?? 0))}</div></div>`);
                            } else {
                              return [
                                createVNode("div", { class: "d-flex align-center" }, [
                                  createVNode("div", null, [
                                    createVNode("strong", null, "Customer:"),
                                    createTextVNode(" " + toDisplayString((_h = (_g = _ctx.order) == null ? void 0 : _g.customer) == null ? void 0 : _h.firstName) + " " + toDisplayString((_j = (_i = _ctx.order) == null ? void 0 : _i.customer) == null ? void 0 : _j.lastName), 1),
                                    createVNode("br"),
                                    createVNode("strong", null, "Delivery Address:"),
                                    createTextVNode(" " + toDisplayString((_k = _ctx.order) == null ? void 0 : _k.deliveryAddress), 1),
                                    createVNode("br"),
                                    createVNode("strong", null, "Total Amount:"),
                                    createTextVNode(" UGX " + toDisplayString(formatAmount(((_l = _ctx.order) == null ? void 0 : _l.totalAmount) ?? 0)), 1)
                                  ])
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VSelect, {
                          modelValue: selectedDriverId.value,
                          "onUpdate:modelValue": ($event) => selectedDriverId.value = $event,
                          items: unref(ordersStore).availableDrivers,
                          "item-title": "displayName",
                          "item-value": "id",
                          label: "Select Available Driver",
                          loading: unref(ordersStore).loadingDrivers,
                          "error-messages": unref(ordersStore).driverError,
                          required: "",
                          clearable: "",
                          hint: "Choose a driver to assign this order to",
                          "persistent-hint": ""
                        }, {
                          item: withCtx(({ props: props2, item }, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VListItem, props2, {
                                prepend: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VAvatar, {
                                      size: "40",
                                      color: getDriverStatusColor(item.raw)
                                    }, {
                                      default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(ssrRenderComponent(VIcon, { color: "white" }, {
                                            default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`mdi-account`);
                                              } else {
                                                return [
                                                  createTextVNode("mdi-account")
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent7, _scopeId6));
                                        } else {
                                          return [
                                            createVNode(VIcon, { color: "white" }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-account")
                                              ]),
                                              _: 1
                                            })
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VAvatar, {
                                        size: "40",
                                        color: getDriverStatusColor(item.raw)
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VIcon, { color: "white" }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-account")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 2
                                      }, 1032, ["color"])
                                    ];
                                  }
                                }),
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VListItemTitle, null, {
                                      default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`${ssrInterpolate(item.raw.firstName)} ${ssrInterpolate(item.raw.lastName)}`);
                                        } else {
                                          return [
                                            createTextVNode(toDisplayString(item.raw.firstName) + " " + toDisplayString(item.raw.lastName), 1)
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent6, _scopeId5));
                                    _push6(ssrRenderComponent(VListItemSubtitle, null, {
                                      default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                        var _a, _b;
                                        if (_push7) {
                                          _push7(`<div data-v-8769e502${_scopeId6}>`);
                                          _push7(ssrRenderComponent(VIcon, {
                                            size: "small",
                                            class: "mr-1"
                                          }, {
                                            default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`mdi-phone`);
                                              } else {
                                                return [
                                                  createTextVNode("mdi-phone")
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent7, _scopeId6));
                                          _push7(` ${ssrInterpolate(item.raw.phone)}</div><div class="mt-1" data-v-8769e502${_scopeId6}>`);
                                          _push7(ssrRenderComponent(VChip, {
                                            color: getDriverStatusColor(item.raw),
                                            size: "x-small",
                                            class: "mr-2"
                                          }, {
                                            default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                              if (_push8) {
                                                _push8(`${ssrInterpolate(item.raw.isActive ? "Active" : "Inactive")}`);
                                              } else {
                                                return [
                                                  createTextVNode(toDisplayString(item.raw.isActive ? "Active" : "Inactive"), 1)
                                                ];
                                              }
                                            }),
                                            _: 2
                                          }, _parent7, _scopeId6));
                                          _push7(`<span class="text-caption" data-v-8769e502${_scopeId6}> Active Orders: ${ssrInterpolate(((_a = item.raw.stats) == null ? void 0 : _a.activeOrdersCount) || 0)}</span></div>`);
                                        } else {
                                          return [
                                            createVNode("div", null, [
                                              createVNode(VIcon, {
                                                size: "small",
                                                class: "mr-1"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-phone")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" " + toDisplayString(item.raw.phone), 1)
                                            ]),
                                            createVNode("div", { class: "mt-1" }, [
                                              createVNode(VChip, {
                                                color: getDriverStatusColor(item.raw),
                                                size: "x-small",
                                                class: "mr-2"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(item.raw.isActive ? "Active" : "Inactive"), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"]),
                                              createVNode("span", { class: "text-caption" }, " Active Orders: " + toDisplayString(((_b = item.raw.stats) == null ? void 0 : _b.activeOrdersCount) || 0), 1)
                                            ])
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VListItemTitle, null, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(item.raw.firstName) + " " + toDisplayString(item.raw.lastName), 1)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(VListItemSubtitle, null, {
                                        default: withCtx(() => {
                                          var _a;
                                          return [
                                            createVNode("div", null, [
                                              createVNode(VIcon, {
                                                size: "small",
                                                class: "mr-1"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-phone")
                                                ]),
                                                _: 1
                                              }),
                                              createTextVNode(" " + toDisplayString(item.raw.phone), 1)
                                            ]),
                                            createVNode("div", { class: "mt-1" }, [
                                              createVNode(VChip, {
                                                color: getDriverStatusColor(item.raw),
                                                size: "x-small",
                                                class: "mr-2"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(item.raw.isActive ? "Active" : "Inactive"), 1)
                                                ]),
                                                _: 2
                                              }, 1032, ["color"]),
                                              createVNode("span", { class: "text-caption" }, " Active Orders: " + toDisplayString(((_a = item.raw.stats) == null ? void 0 : _a.activeOrdersCount) || 0), 1)
                                            ])
                                          ];
                                        }),
                                        _: 2
                                      }, 1024)
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VListItem, props2, {
                                  prepend: withCtx(() => [
                                    createVNode(VAvatar, {
                                      size: "40",
                                      color: getDriverStatusColor(item.raw)
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(VIcon, { color: "white" }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-account")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 2
                                    }, 1032, ["color"])
                                  ]),
                                  default: withCtx(() => [
                                    createVNode(VListItemTitle, null, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(item.raw.firstName) + " " + toDisplayString(item.raw.lastName), 1)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(VListItemSubtitle, null, {
                                      default: withCtx(() => {
                                        var _a;
                                        return [
                                          createVNode("div", null, [
                                            createVNode(VIcon, {
                                              size: "small",
                                              class: "mr-1"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("mdi-phone")
                                              ]),
                                              _: 1
                                            }),
                                            createTextVNode(" " + toDisplayString(item.raw.phone), 1)
                                          ]),
                                          createVNode("div", { class: "mt-1" }, [
                                            createVNode(VChip, {
                                              color: getDriverStatusColor(item.raw),
                                              size: "x-small",
                                              class: "mr-2"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(item.raw.isActive ? "Active" : "Inactive"), 1)
                                              ]),
                                              _: 2
                                            }, 1032, ["color"]),
                                            createVNode("span", { class: "text-caption" }, " Active Orders: " + toDisplayString(((_a = item.raw.stats) == null ? void 0 : _a.activeOrdersCount) || 0), 1)
                                          ])
                                        ];
                                      }),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1040)
                              ];
                            }
                          }),
                          "no-data": withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="text-center pa-4" data-v-8769e502${_scopeId4}>`);
                              _push5(ssrRenderComponent(VIcon, {
                                size: "48",
                                color: "grey"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`mdi-account-off`);
                                  } else {
                                    return [
                                      createTextVNode("mdi-account-off")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`<div class="text-body-2 mt-2" data-v-8769e502${_scopeId4}>No available drivers found</div></div>`);
                            } else {
                              return [
                                createVNode("div", { class: "text-center pa-4" }, [
                                  createVNode(VIcon, {
                                    size: "48",
                                    color: "grey"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-account-off")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("div", { class: "text-body-2 mt-2" }, "No available drivers found")
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VTextField, {
                          modelValue: estimatedDeliveryTime.value,
                          "onUpdate:modelValue": ($event) => estimatedDeliveryTime.value = $event,
                          label: "Estimated Delivery Time (Optional)",
                          type: "datetime-local",
                          hint: "Set an estimated delivery time for the customer",
                          "persistent-hint": "",
                          class: "mt-4"
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VTextarea, {
                          modelValue: assignmentNotes.value,
                          "onUpdate:modelValue": ($event) => assignmentNotes.value = $event,
                          label: "Assignment Notes (Optional)",
                          placeholder: "Any special instructions for the driver...",
                          rows: "3",
                          class: "mt-4"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VAlert, {
                            type: "info",
                            class: "mb-4",
                            variant: "tonal"
                          }, {
                            default: withCtx(() => {
                              var _a, _b, _c, _d, _e, _f;
                              return [
                                createVNode("div", { class: "d-flex align-center" }, [
                                  createVNode("div", null, [
                                    createVNode("strong", null, "Customer:"),
                                    createTextVNode(" " + toDisplayString((_b = (_a = _ctx.order) == null ? void 0 : _a.customer) == null ? void 0 : _b.firstName) + " " + toDisplayString((_d = (_c = _ctx.order) == null ? void 0 : _c.customer) == null ? void 0 : _d.lastName), 1),
                                    createVNode("br"),
                                    createVNode("strong", null, "Delivery Address:"),
                                    createTextVNode(" " + toDisplayString((_e = _ctx.order) == null ? void 0 : _e.deliveryAddress), 1),
                                    createVNode("br"),
                                    createVNode("strong", null, "Total Amount:"),
                                    createTextVNode(" UGX " + toDisplayString(formatAmount(((_f = _ctx.order) == null ? void 0 : _f.totalAmount) ?? 0)), 1)
                                  ])
                                ])
                              ];
                            }),
                            _: 1
                          }),
                          createVNode(VSelect, {
                            modelValue: selectedDriverId.value,
                            "onUpdate:modelValue": ($event) => selectedDriverId.value = $event,
                            items: unref(ordersStore).availableDrivers,
                            "item-title": "displayName",
                            "item-value": "id",
                            label: "Select Available Driver",
                            loading: unref(ordersStore).loadingDrivers,
                            "error-messages": unref(ordersStore).driverError,
                            required: "",
                            clearable: "",
                            hint: "Choose a driver to assign this order to",
                            "persistent-hint": ""
                          }, {
                            item: withCtx(({ props: props2, item }) => [
                              createVNode(VListItem, props2, {
                                prepend: withCtx(() => [
                                  createVNode(VAvatar, {
                                    size: "40",
                                    color: getDriverStatusColor(item.raw)
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VIcon, { color: "white" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-account")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 2
                                  }, 1032, ["color"])
                                ]),
                                default: withCtx(() => [
                                  createVNode(VListItemTitle, null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(item.raw.firstName) + " " + toDisplayString(item.raw.lastName), 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(VListItemSubtitle, null, {
                                    default: withCtx(() => {
                                      var _a;
                                      return [
                                        createVNode("div", null, [
                                          createVNode(VIcon, {
                                            size: "small",
                                            class: "mr-1"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-phone")
                                            ]),
                                            _: 1
                                          }),
                                          createTextVNode(" " + toDisplayString(item.raw.phone), 1)
                                        ]),
                                        createVNode("div", { class: "mt-1" }, [
                                          createVNode(VChip, {
                                            color: getDriverStatusColor(item.raw),
                                            size: "x-small",
                                            class: "mr-2"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(item.raw.isActive ? "Active" : "Inactive"), 1)
                                            ]),
                                            _: 2
                                          }, 1032, ["color"]),
                                          createVNode("span", { class: "text-caption" }, " Active Orders: " + toDisplayString(((_a = item.raw.stats) == null ? void 0 : _a.activeOrdersCount) || 0), 1)
                                        ])
                                      ];
                                    }),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1040)
                            ]),
                            "no-data": withCtx(() => [
                              createVNode("div", { class: "text-center pa-4" }, [
                                createVNode(VIcon, {
                                  size: "48",
                                  color: "grey"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-account-off")
                                  ]),
                                  _: 1
                                }),
                                createVNode("div", { class: "text-body-2 mt-2" }, "No available drivers found")
                              ])
                            ]),
                            _: 1
                          }, 8, ["modelValue", "onUpdate:modelValue", "items", "loading", "error-messages"]),
                          createVNode(VTextField, {
                            modelValue: estimatedDeliveryTime.value,
                            "onUpdate:modelValue": ($event) => estimatedDeliveryTime.value = $event,
                            label: "Estimated Delivery Time (Optional)",
                            type: "datetime-local",
                            hint: "Set an estimated delivery time for the customer",
                            "persistent-hint": "",
                            class: "mt-4"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode(VTextarea, {
                            modelValue: assignmentNotes.value,
                            "onUpdate:modelValue": ($event) => assignmentNotes.value = $event,
                            label: "Assignment Notes (Optional)",
                            placeholder: "Any special instructions for the driver...",
                            rows: "3",
                            class: "mt-4"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VDivider, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VCardActions, { class: "pa-4" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VSpacer, null, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VBtn, {
                          onClick: closeDialog,
                          disabled: unref(ordersStore).assigningDriver
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Cancel `);
                            } else {
                              return [
                                createTextVNode(" Cancel ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VBtn, {
                          color: "primary",
                          onClick: assignDriver,
                          loading: unref(ordersStore).assigningDriver,
                          disabled: !selectedDriverId.value || unref(ordersStore).loadingDrivers
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VIcon, { left: "" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`mdi-check`);
                                  } else {
                                    return [
                                      createTextVNode("mdi-check")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(` Assign Driver `);
                            } else {
                              return [
                                createVNode(VIcon, { left: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-check")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Assign Driver ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VSpacer),
                          createVNode(VBtn, {
                            onClick: closeDialog,
                            disabled: unref(ordersStore).assigningDriver
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Cancel ")
                            ]),
                            _: 1
                          }, 8, ["disabled"]),
                          createVNode(VBtn, {
                            color: "primary",
                            onClick: assignDriver,
                            loading: unref(ordersStore).assigningDriver,
                            disabled: !selectedDriverId.value || unref(ordersStore).loadingDrivers
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, { left: "" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-check")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" Assign Driver ")
                            ]),
                            _: 1
                          }, 8, ["loading", "disabled"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VCardTitle, { class: "text-h5" }, {
                      default: withCtx(() => {
                        var _a;
                        return [
                          createVNode(VIcon, { left: "" }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-account-plus")
                            ]),
                            _: 1
                          }),
                          createTextVNode(" Assign Driver to Order #" + toDisplayString((_a = _ctx.order) == null ? void 0 : _a.orderNumber), 1)
                        ];
                      }),
                      _: 1
                    }),
                    createVNode(VDivider),
                    createVNode(VCardText, { class: "pt-4" }, {
                      default: withCtx(() => [
                        createVNode(VAlert, {
                          type: "info",
                          class: "mb-4",
                          variant: "tonal"
                        }, {
                          default: withCtx(() => {
                            var _a, _b, _c, _d, _e, _f;
                            return [
                              createVNode("div", { class: "d-flex align-center" }, [
                                createVNode("div", null, [
                                  createVNode("strong", null, "Customer:"),
                                  createTextVNode(" " + toDisplayString((_b = (_a = _ctx.order) == null ? void 0 : _a.customer) == null ? void 0 : _b.firstName) + " " + toDisplayString((_d = (_c = _ctx.order) == null ? void 0 : _c.customer) == null ? void 0 : _d.lastName), 1),
                                  createVNode("br"),
                                  createVNode("strong", null, "Delivery Address:"),
                                  createTextVNode(" " + toDisplayString((_e = _ctx.order) == null ? void 0 : _e.deliveryAddress), 1),
                                  createVNode("br"),
                                  createVNode("strong", null, "Total Amount:"),
                                  createTextVNode(" UGX " + toDisplayString(formatAmount(((_f = _ctx.order) == null ? void 0 : _f.totalAmount) ?? 0)), 1)
                                ])
                              ])
                            ];
                          }),
                          _: 1
                        }),
                        createVNode(VSelect, {
                          modelValue: selectedDriverId.value,
                          "onUpdate:modelValue": ($event) => selectedDriverId.value = $event,
                          items: unref(ordersStore).availableDrivers,
                          "item-title": "displayName",
                          "item-value": "id",
                          label: "Select Available Driver",
                          loading: unref(ordersStore).loadingDrivers,
                          "error-messages": unref(ordersStore).driverError,
                          required: "",
                          clearable: "",
                          hint: "Choose a driver to assign this order to",
                          "persistent-hint": ""
                        }, {
                          item: withCtx(({ props: props2, item }) => [
                            createVNode(VListItem, props2, {
                              prepend: withCtx(() => [
                                createVNode(VAvatar, {
                                  size: "40",
                                  color: getDriverStatusColor(item.raw)
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VIcon, { color: "white" }, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-account")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 2
                                }, 1032, ["color"])
                              ]),
                              default: withCtx(() => [
                                createVNode(VListItemTitle, null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(item.raw.firstName) + " " + toDisplayString(item.raw.lastName), 1)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(VListItemSubtitle, null, {
                                  default: withCtx(() => {
                                    var _a;
                                    return [
                                      createVNode("div", null, [
                                        createVNode(VIcon, {
                                          size: "small",
                                          class: "mr-1"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-phone")
                                          ]),
                                          _: 1
                                        }),
                                        createTextVNode(" " + toDisplayString(item.raw.phone), 1)
                                      ]),
                                      createVNode("div", { class: "mt-1" }, [
                                        createVNode(VChip, {
                                          color: getDriverStatusColor(item.raw),
                                          size: "x-small",
                                          class: "mr-2"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(item.raw.isActive ? "Active" : "Inactive"), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["color"]),
                                        createVNode("span", { class: "text-caption" }, " Active Orders: " + toDisplayString(((_a = item.raw.stats) == null ? void 0 : _a.activeOrdersCount) || 0), 1)
                                      ])
                                    ];
                                  }),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1040)
                          ]),
                          "no-data": withCtx(() => [
                            createVNode("div", { class: "text-center pa-4" }, [
                              createVNode(VIcon, {
                                size: "48",
                                color: "grey"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-account-off")
                                ]),
                                _: 1
                              }),
                              createVNode("div", { class: "text-body-2 mt-2" }, "No available drivers found")
                            ])
                          ]),
                          _: 1
                        }, 8, ["modelValue", "onUpdate:modelValue", "items", "loading", "error-messages"]),
                        createVNode(VTextField, {
                          modelValue: estimatedDeliveryTime.value,
                          "onUpdate:modelValue": ($event) => estimatedDeliveryTime.value = $event,
                          label: "Estimated Delivery Time (Optional)",
                          type: "datetime-local",
                          hint: "Set an estimated delivery time for the customer",
                          "persistent-hint": "",
                          class: "mt-4"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(VTextarea, {
                          modelValue: assignmentNotes.value,
                          "onUpdate:modelValue": ($event) => assignmentNotes.value = $event,
                          label: "Assignment Notes (Optional)",
                          placeholder: "Any special instructions for the driver...",
                          rows: "3",
                          class: "mt-4"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(VDivider),
                    createVNode(VCardActions, { class: "pa-4" }, {
                      default: withCtx(() => [
                        createVNode(VSpacer),
                        createVNode(VBtn, {
                          onClick: closeDialog,
                          disabled: unref(ordersStore).assigningDriver
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Cancel ")
                          ]),
                          _: 1
                        }, 8, ["disabled"]),
                        createVNode(VBtn, {
                          color: "primary",
                          onClick: assignDriver,
                          loading: unref(ordersStore).assigningDriver,
                          disabled: !selectedDriverId.value || unref(ordersStore).loadingDrivers
                        }, {
                          default: withCtx(() => [
                            createVNode(VIcon, { left: "" }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-check")
                              ]),
                              _: 1
                            }),
                            createTextVNode(" Assign Driver ")
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
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VCard, null, {
                default: withCtx(() => [
                  createVNode(VCardTitle, { class: "text-h5" }, {
                    default: withCtx(() => {
                      var _a;
                      return [
                        createVNode(VIcon, { left: "" }, {
                          default: withCtx(() => [
                            createTextVNode("mdi-account-plus")
                          ]),
                          _: 1
                        }),
                        createTextVNode(" Assign Driver to Order #" + toDisplayString((_a = _ctx.order) == null ? void 0 : _a.orderNumber), 1)
                      ];
                    }),
                    _: 1
                  }),
                  createVNode(VDivider),
                  createVNode(VCardText, { class: "pt-4" }, {
                    default: withCtx(() => [
                      createVNode(VAlert, {
                        type: "info",
                        class: "mb-4",
                        variant: "tonal"
                      }, {
                        default: withCtx(() => {
                          var _a, _b, _c, _d, _e, _f;
                          return [
                            createVNode("div", { class: "d-flex align-center" }, [
                              createVNode("div", null, [
                                createVNode("strong", null, "Customer:"),
                                createTextVNode(" " + toDisplayString((_b = (_a = _ctx.order) == null ? void 0 : _a.customer) == null ? void 0 : _b.firstName) + " " + toDisplayString((_d = (_c = _ctx.order) == null ? void 0 : _c.customer) == null ? void 0 : _d.lastName), 1),
                                createVNode("br"),
                                createVNode("strong", null, "Delivery Address:"),
                                createTextVNode(" " + toDisplayString((_e = _ctx.order) == null ? void 0 : _e.deliveryAddress), 1),
                                createVNode("br"),
                                createVNode("strong", null, "Total Amount:"),
                                createTextVNode(" UGX " + toDisplayString(formatAmount(((_f = _ctx.order) == null ? void 0 : _f.totalAmount) ?? 0)), 1)
                              ])
                            ])
                          ];
                        }),
                        _: 1
                      }),
                      createVNode(VSelect, {
                        modelValue: selectedDriverId.value,
                        "onUpdate:modelValue": ($event) => selectedDriverId.value = $event,
                        items: unref(ordersStore).availableDrivers,
                        "item-title": "displayName",
                        "item-value": "id",
                        label: "Select Available Driver",
                        loading: unref(ordersStore).loadingDrivers,
                        "error-messages": unref(ordersStore).driverError,
                        required: "",
                        clearable: "",
                        hint: "Choose a driver to assign this order to",
                        "persistent-hint": ""
                      }, {
                        item: withCtx(({ props: props2, item }) => [
                          createVNode(VListItem, props2, {
                            prepend: withCtx(() => [
                              createVNode(VAvatar, {
                                size: "40",
                                color: getDriverStatusColor(item.raw)
                              }, {
                                default: withCtx(() => [
                                  createVNode(VIcon, { color: "white" }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-account")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 2
                              }, 1032, ["color"])
                            ]),
                            default: withCtx(() => [
                              createVNode(VListItemTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(item.raw.firstName) + " " + toDisplayString(item.raw.lastName), 1)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(VListItemSubtitle, null, {
                                default: withCtx(() => {
                                  var _a;
                                  return [
                                    createVNode("div", null, [
                                      createVNode(VIcon, {
                                        size: "small",
                                        class: "mr-1"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-phone")
                                        ]),
                                        _: 1
                                      }),
                                      createTextVNode(" " + toDisplayString(item.raw.phone), 1)
                                    ]),
                                    createVNode("div", { class: "mt-1" }, [
                                      createVNode(VChip, {
                                        color: getDriverStatusColor(item.raw),
                                        size: "x-small",
                                        class: "mr-2"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(item.raw.isActive ? "Active" : "Inactive"), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["color"]),
                                      createVNode("span", { class: "text-caption" }, " Active Orders: " + toDisplayString(((_a = item.raw.stats) == null ? void 0 : _a.activeOrdersCount) || 0), 1)
                                    ])
                                  ];
                                }),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1040)
                        ]),
                        "no-data": withCtx(() => [
                          createVNode("div", { class: "text-center pa-4" }, [
                            createVNode(VIcon, {
                              size: "48",
                              color: "grey"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-account-off")
                              ]),
                              _: 1
                            }),
                            createVNode("div", { class: "text-body-2 mt-2" }, "No available drivers found")
                          ])
                        ]),
                        _: 1
                      }, 8, ["modelValue", "onUpdate:modelValue", "items", "loading", "error-messages"]),
                      createVNode(VTextField, {
                        modelValue: estimatedDeliveryTime.value,
                        "onUpdate:modelValue": ($event) => estimatedDeliveryTime.value = $event,
                        label: "Estimated Delivery Time (Optional)",
                        type: "datetime-local",
                        hint: "Set an estimated delivery time for the customer",
                        "persistent-hint": "",
                        class: "mt-4"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode(VTextarea, {
                        modelValue: assignmentNotes.value,
                        "onUpdate:modelValue": ($event) => assignmentNotes.value = $event,
                        label: "Assignment Notes (Optional)",
                        placeholder: "Any special instructions for the driver...",
                        rows: "3",
                        class: "mt-4"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(VDivider),
                  createVNode(VCardActions, { class: "pa-4" }, {
                    default: withCtx(() => [
                      createVNode(VSpacer),
                      createVNode(VBtn, {
                        onClick: closeDialog,
                        disabled: unref(ordersStore).assigningDriver
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Cancel ")
                        ]),
                        _: 1
                      }, 8, ["disabled"]),
                      createVNode(VBtn, {
                        color: "primary",
                        onClick: assignDriver,
                        loading: unref(ordersStore).assigningDriver,
                        disabled: !selectedDriverId.value || unref(ordersStore).loadingDrivers
                      }, {
                        default: withCtx(() => [
                          createVNode(VIcon, { left: "" }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-check")
                            ]),
                            _: 1
                          }),
                          createTextVNode(" Assign Driver ")
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
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DriverAssignDialog.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const DriverAssignDialog = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-8769e502"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "OrderStatusDialog",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
    order: {}
  },
  emits: ["update:modelValue", "status-updated"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const ordersStore = useOrdersStore();
    const selectedStatus = ref(null);
    const statusNotes = ref("");
    const statusError = ref([]);
    const dialog = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value)
    });
    const statusOptions = [
      { title: "Confirmed", value: OrderStatus.CONFIRMED },
      { title: "Assigned", value: OrderStatus.ASSIGNED },
      { title: "In Transit", value: OrderStatus.IN_TRANSIT },
      { title: "Delivered", value: OrderStatus.DELIVERED },
      { title: "Cancelled", value: OrderStatus.CANCELLED }
    ];
    watch(() => props.modelValue, (newValue) => {
      if (newValue) {
        resetForm();
        if (props.order) {
          selectedStatus.value = props.order.status;
        }
      }
    });
    const updateStatus = async () => {
      if (!selectedStatus.value || !props.order) return;
      statusError.value = [];
      try {
        const updatedOrder = await ordersStore.updateOrderStatus(props.order.id, selectedStatus.value);
        emit("status-updated", updatedOrder);
        closeDialog();
      } catch (error) {
        console.error("Error updating status:", error);
        statusError.value = [error.message || "Failed to update status"];
      }
    };
    const closeDialog = () => {
      dialog.value = false;
    };
    const resetForm = () => {
      selectedStatus.value = null;
      statusNotes.value = "";
      statusError.value = [];
    };
    const getStatusColor = (status) => {
      const colors = {
        [OrderStatus.PENDING]: "orange",
        [OrderStatus.CONFIRMED]: "blue",
        [OrderStatus.ASSIGNED]: "purple",
        [OrderStatus.IN_TRANSIT]: "cyan",
        [OrderStatus.DELIVERED]: "green",
        [OrderStatus.CANCELLED]: "red"
      };
      return status ? colors[status] || "grey" : "grey";
    };
    const formatStatus = (status) => {
      if (!status) return "N/A";
      return status.split("_").map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      ).join(" ");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VDialog, mergeProps({
        modelValue: dialog.value,
        "onUpdate:modelValue": ($event) => dialog.value = $event,
        "max-width": "600px",
        persistent: ""
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VCard, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(VCardTitle, { class: "text-h5" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      var _a, _b;
                      if (_push4) {
                        _push4(ssrRenderComponent(VIcon, { left: "" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`mdi-update`);
                            } else {
                              return [
                                createTextVNode("mdi-update")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(` Update Order #${ssrInterpolate((_a = _ctx.order) == null ? void 0 : _a.orderNumber)} Status `);
                      } else {
                        return [
                          createVNode(VIcon, { left: "" }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-update")
                            ]),
                            _: 1
                          }),
                          createTextVNode(" Update Order #" + toDisplayString((_b = _ctx.order) == null ? void 0 : _b.orderNumber) + " Status ", 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VDivider, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VCardText, { class: "pt-4" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VAlert, {
                          type: "info",
                          class: "mb-4",
                          variant: "tonal"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
                            if (_push5) {
                              _push5(`<div class="d-flex align-center" data-v-a9a88702${_scopeId4}><div data-v-a9a88702${_scopeId4}><strong data-v-a9a88702${_scopeId4}>Current Status:</strong> `);
                              _push5(ssrRenderComponent(VChip, {
                                color: getStatusColor((_a = _ctx.order) == null ? void 0 : _a.status),
                                size: "small"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  var _a2, _b2;
                                  if (_push6) {
                                    _push6(`${ssrInterpolate(formatStatus((_a2 = _ctx.order) == null ? void 0 : _a2.status))}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString(formatStatus((_b2 = _ctx.order) == null ? void 0 : _b2.status)), 1)
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`<br data-v-a9a88702${_scopeId4}><strong data-v-a9a88702${_scopeId4}>Customer:</strong> ${ssrInterpolate((_c = (_b = _ctx.order) == null ? void 0 : _b.customer) == null ? void 0 : _c.firstName)} ${ssrInterpolate((_e = (_d = _ctx.order) == null ? void 0 : _d.customer) == null ? void 0 : _e.lastName)}<br data-v-a9a88702${_scopeId4}><strong data-v-a9a88702${_scopeId4}>Delivery Address:</strong> ${ssrInterpolate((_f = _ctx.order) == null ? void 0 : _f.deliveryAddress)}</div></div>`);
                            } else {
                              return [
                                createVNode("div", { class: "d-flex align-center" }, [
                                  createVNode("div", null, [
                                    createVNode("strong", null, "Current Status:"),
                                    createTextVNode(),
                                    createVNode(VChip, {
                                      color: getStatusColor((_g = _ctx.order) == null ? void 0 : _g.status),
                                      size: "small"
                                    }, {
                                      default: withCtx(() => {
                                        var _a2;
                                        return [
                                          createTextVNode(toDisplayString(formatStatus((_a2 = _ctx.order) == null ? void 0 : _a2.status)), 1)
                                        ];
                                      }),
                                      _: 1
                                    }, 8, ["color"]),
                                    createVNode("br"),
                                    createVNode("strong", null, "Customer:"),
                                    createTextVNode(" " + toDisplayString((_i = (_h = _ctx.order) == null ? void 0 : _h.customer) == null ? void 0 : _i.firstName) + " " + toDisplayString((_k = (_j = _ctx.order) == null ? void 0 : _j.customer) == null ? void 0 : _k.lastName), 1),
                                    createVNode("br"),
                                    createVNode("strong", null, "Delivery Address:"),
                                    createTextVNode(" " + toDisplayString((_l = _ctx.order) == null ? void 0 : _l.deliveryAddress), 1)
                                  ])
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VSelect, {
                          modelValue: selectedStatus.value,
                          "onUpdate:modelValue": ($event) => selectedStatus.value = $event,
                          items: statusOptions,
                          "item-title": "title",
                          "item-value": "value",
                          label: "Select New Status",
                          "error-messages": statusError.value,
                          required: "",
                          clearable: "",
                          hint: "Choose the new status for this order",
                          "persistent-hint": ""
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VTextarea, {
                          modelValue: statusNotes.value,
                          "onUpdate:modelValue": ($event) => statusNotes.value = $event,
                          label: "Status Notes (Optional)",
                          placeholder: "Any relevant notes for this status update...",
                          rows: "3",
                          class: "mt-4"
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VAlert, {
                            type: "info",
                            class: "mb-4",
                            variant: "tonal"
                          }, {
                            default: withCtx(() => {
                              var _a, _b, _c, _d, _e, _f;
                              return [
                                createVNode("div", { class: "d-flex align-center" }, [
                                  createVNode("div", null, [
                                    createVNode("strong", null, "Current Status:"),
                                    createTextVNode(),
                                    createVNode(VChip, {
                                      color: getStatusColor((_a = _ctx.order) == null ? void 0 : _a.status),
                                      size: "small"
                                    }, {
                                      default: withCtx(() => {
                                        var _a2;
                                        return [
                                          createTextVNode(toDisplayString(formatStatus((_a2 = _ctx.order) == null ? void 0 : _a2.status)), 1)
                                        ];
                                      }),
                                      _: 1
                                    }, 8, ["color"]),
                                    createVNode("br"),
                                    createVNode("strong", null, "Customer:"),
                                    createTextVNode(" " + toDisplayString((_c = (_b = _ctx.order) == null ? void 0 : _b.customer) == null ? void 0 : _c.firstName) + " " + toDisplayString((_e = (_d = _ctx.order) == null ? void 0 : _d.customer) == null ? void 0 : _e.lastName), 1),
                                    createVNode("br"),
                                    createVNode("strong", null, "Delivery Address:"),
                                    createTextVNode(" " + toDisplayString((_f = _ctx.order) == null ? void 0 : _f.deliveryAddress), 1)
                                  ])
                                ])
                              ];
                            }),
                            _: 1
                          }),
                          createVNode(VSelect, {
                            modelValue: selectedStatus.value,
                            "onUpdate:modelValue": ($event) => selectedStatus.value = $event,
                            items: statusOptions,
                            "item-title": "title",
                            "item-value": "value",
                            label: "Select New Status",
                            "error-messages": statusError.value,
                            required: "",
                            clearable: "",
                            hint: "Choose the new status for this order",
                            "persistent-hint": ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "error-messages"]),
                          createVNode(VTextarea, {
                            modelValue: statusNotes.value,
                            "onUpdate:modelValue": ($event) => statusNotes.value = $event,
                            label: "Status Notes (Optional)",
                            placeholder: "Any relevant notes for this status update...",
                            rows: "3",
                            class: "mt-4"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VDivider, null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VCardActions, { class: "pa-4" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VSpacer, null, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VBtn, {
                          onClick: closeDialog,
                          disabled: unref(ordersStore).loading
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Cancel `);
                            } else {
                              return [
                                createTextVNode(" Cancel ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VBtn, {
                          color: "primary",
                          onClick: updateStatus,
                          loading: unref(ordersStore).loading,
                          disabled: !selectedStatus.value
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VIcon, { left: "" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`mdi-check`);
                                  } else {
                                    return [
                                      createTextVNode("mdi-check")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(` Update Status `);
                            } else {
                              return [
                                createVNode(VIcon, { left: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-check")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Update Status ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VSpacer),
                          createVNode(VBtn, {
                            onClick: closeDialog,
                            disabled: unref(ordersStore).loading
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Cancel ")
                            ]),
                            _: 1
                          }, 8, ["disabled"]),
                          createVNode(VBtn, {
                            color: "primary",
                            onClick: updateStatus,
                            loading: unref(ordersStore).loading,
                            disabled: !selectedStatus.value
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, { left: "" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-check")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" Update Status ")
                            ]),
                            _: 1
                          }, 8, ["loading", "disabled"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VCardTitle, { class: "text-h5" }, {
                      default: withCtx(() => {
                        var _a;
                        return [
                          createVNode(VIcon, { left: "" }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-update")
                            ]),
                            _: 1
                          }),
                          createTextVNode(" Update Order #" + toDisplayString((_a = _ctx.order) == null ? void 0 : _a.orderNumber) + " Status ", 1)
                        ];
                      }),
                      _: 1
                    }),
                    createVNode(VDivider),
                    createVNode(VCardText, { class: "pt-4" }, {
                      default: withCtx(() => [
                        createVNode(VAlert, {
                          type: "info",
                          class: "mb-4",
                          variant: "tonal"
                        }, {
                          default: withCtx(() => {
                            var _a, _b, _c, _d, _e, _f;
                            return [
                              createVNode("div", { class: "d-flex align-center" }, [
                                createVNode("div", null, [
                                  createVNode("strong", null, "Current Status:"),
                                  createTextVNode(),
                                  createVNode(VChip, {
                                    color: getStatusColor((_a = _ctx.order) == null ? void 0 : _a.status),
                                    size: "small"
                                  }, {
                                    default: withCtx(() => {
                                      var _a2;
                                      return [
                                        createTextVNode(toDisplayString(formatStatus((_a2 = _ctx.order) == null ? void 0 : _a2.status)), 1)
                                      ];
                                    }),
                                    _: 1
                                  }, 8, ["color"]),
                                  createVNode("br"),
                                  createVNode("strong", null, "Customer:"),
                                  createTextVNode(" " + toDisplayString((_c = (_b = _ctx.order) == null ? void 0 : _b.customer) == null ? void 0 : _c.firstName) + " " + toDisplayString((_e = (_d = _ctx.order) == null ? void 0 : _d.customer) == null ? void 0 : _e.lastName), 1),
                                  createVNode("br"),
                                  createVNode("strong", null, "Delivery Address:"),
                                  createTextVNode(" " + toDisplayString((_f = _ctx.order) == null ? void 0 : _f.deliveryAddress), 1)
                                ])
                              ])
                            ];
                          }),
                          _: 1
                        }),
                        createVNode(VSelect, {
                          modelValue: selectedStatus.value,
                          "onUpdate:modelValue": ($event) => selectedStatus.value = $event,
                          items: statusOptions,
                          "item-title": "title",
                          "item-value": "value",
                          label: "Select New Status",
                          "error-messages": statusError.value,
                          required: "",
                          clearable: "",
                          hint: "Choose the new status for this order",
                          "persistent-hint": ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "error-messages"]),
                        createVNode(VTextarea, {
                          modelValue: statusNotes.value,
                          "onUpdate:modelValue": ($event) => statusNotes.value = $event,
                          label: "Status Notes (Optional)",
                          placeholder: "Any relevant notes for this status update...",
                          rows: "3",
                          class: "mt-4"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"])
                      ]),
                      _: 1
                    }),
                    createVNode(VDivider),
                    createVNode(VCardActions, { class: "pa-4" }, {
                      default: withCtx(() => [
                        createVNode(VSpacer),
                        createVNode(VBtn, {
                          onClick: closeDialog,
                          disabled: unref(ordersStore).loading
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Cancel ")
                          ]),
                          _: 1
                        }, 8, ["disabled"]),
                        createVNode(VBtn, {
                          color: "primary",
                          onClick: updateStatus,
                          loading: unref(ordersStore).loading,
                          disabled: !selectedStatus.value
                        }, {
                          default: withCtx(() => [
                            createVNode(VIcon, { left: "" }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-check")
                              ]),
                              _: 1
                            }),
                            createTextVNode(" Update Status ")
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
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VCard, null, {
                default: withCtx(() => [
                  createVNode(VCardTitle, { class: "text-h5" }, {
                    default: withCtx(() => {
                      var _a;
                      return [
                        createVNode(VIcon, { left: "" }, {
                          default: withCtx(() => [
                            createTextVNode("mdi-update")
                          ]),
                          _: 1
                        }),
                        createTextVNode(" Update Order #" + toDisplayString((_a = _ctx.order) == null ? void 0 : _a.orderNumber) + " Status ", 1)
                      ];
                    }),
                    _: 1
                  }),
                  createVNode(VDivider),
                  createVNode(VCardText, { class: "pt-4" }, {
                    default: withCtx(() => [
                      createVNode(VAlert, {
                        type: "info",
                        class: "mb-4",
                        variant: "tonal"
                      }, {
                        default: withCtx(() => {
                          var _a, _b, _c, _d, _e, _f;
                          return [
                            createVNode("div", { class: "d-flex align-center" }, [
                              createVNode("div", null, [
                                createVNode("strong", null, "Current Status:"),
                                createTextVNode(),
                                createVNode(VChip, {
                                  color: getStatusColor((_a = _ctx.order) == null ? void 0 : _a.status),
                                  size: "small"
                                }, {
                                  default: withCtx(() => {
                                    var _a2;
                                    return [
                                      createTextVNode(toDisplayString(formatStatus((_a2 = _ctx.order) == null ? void 0 : _a2.status)), 1)
                                    ];
                                  }),
                                  _: 1
                                }, 8, ["color"]),
                                createVNode("br"),
                                createVNode("strong", null, "Customer:"),
                                createTextVNode(" " + toDisplayString((_c = (_b = _ctx.order) == null ? void 0 : _b.customer) == null ? void 0 : _c.firstName) + " " + toDisplayString((_e = (_d = _ctx.order) == null ? void 0 : _d.customer) == null ? void 0 : _e.lastName), 1),
                                createVNode("br"),
                                createVNode("strong", null, "Delivery Address:"),
                                createTextVNode(" " + toDisplayString((_f = _ctx.order) == null ? void 0 : _f.deliveryAddress), 1)
                              ])
                            ])
                          ];
                        }),
                        _: 1
                      }),
                      createVNode(VSelect, {
                        modelValue: selectedStatus.value,
                        "onUpdate:modelValue": ($event) => selectedStatus.value = $event,
                        items: statusOptions,
                        "item-title": "title",
                        "item-value": "value",
                        label: "Select New Status",
                        "error-messages": statusError.value,
                        required: "",
                        clearable: "",
                        hint: "Choose the new status for this order",
                        "persistent-hint": ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "error-messages"]),
                      createVNode(VTextarea, {
                        modelValue: statusNotes.value,
                        "onUpdate:modelValue": ($event) => statusNotes.value = $event,
                        label: "Status Notes (Optional)",
                        placeholder: "Any relevant notes for this status update...",
                        rows: "3",
                        class: "mt-4"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    _: 1
                  }),
                  createVNode(VDivider),
                  createVNode(VCardActions, { class: "pa-4" }, {
                    default: withCtx(() => [
                      createVNode(VSpacer),
                      createVNode(VBtn, {
                        onClick: closeDialog,
                        disabled: unref(ordersStore).loading
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Cancel ")
                        ]),
                        _: 1
                      }, 8, ["disabled"]),
                      createVNode(VBtn, {
                        color: "primary",
                        onClick: updateStatus,
                        loading: unref(ordersStore).loading,
                        disabled: !selectedStatus.value
                      }, {
                        default: withCtx(() => [
                          createVNode(VIcon, { left: "" }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-check")
                            ]),
                            _: 1
                          }),
                          createTextVNode(" Update Status ")
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
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/OrderStatusDialog.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const OrderStatusDialog = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-a9a88702"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "orders",
  __ssrInlineRender: true,
  setup(__props) {
    const ordersStore = useOrdersStore();
    useRouter();
    const showDriverAssignDialog = ref(false);
    const showStatusDialog = ref(false);
    const showOrderDetailsDialog = ref(false);
    const selectedOrder = ref(null);
    const successMessage = ref("");
    const statusFilter = ref(null);
    const cancellingOrderId = ref(null);
    const deletingOrderId = ref(null);
    const headers = ref([
      { title: "Order #", key: "orderNumber", sortable: true, width: "120px" },
      { title: "Customer", key: "customer", sortable: false, width: "200px" },
      { title: "Driver", key: "driver", sortable: false, width: "180px" },
      { title: "Date", key: "createdAt", sortable: true, width: "150px" },
      { title: "Total (UGX)", key: "totalAmount", sortable: true, width: "120px" },
      { title: "Status", key: "status", sortable: true, width: "120px" },
      { title: "Actions", key: "actions", sortable: false, align: "end", width: "300px" }
    ]);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const statusOptions = [
      { title: "All Statuses", value: null },
      { title: "Pending", value: "pending" },
      { title: "Confirmed", value: "confirmed" },
      { title: "Assigned", value: "assigned" },
      { title: "In Transit", value: "in_transit" },
      { title: "Delivered", value: "delivered" },
      { title: "Cancelled", value: "cancelled" }
    ];
    const loadOrders = async () => {
      const params = {
        page: currentPage.value,
        limit: itemsPerPage.value,
        ...statusFilter.value && { status: statusFilter.value }
      };
      await ordersStore.fetchOrders(params);
    };
    const updatePage = async (page) => {
      currentPage.value = page;
      await loadOrders();
    };
    const updateItemsPerPage = async (limit) => {
      itemsPerPage.value = limit;
      currentPage.value = 1;
      await loadOrders();
    };
    const applyFilters = async () => {
      currentPage.value = 1;
      await loadOrders();
    };
    const canAssignDriver = (order) => {
      return (order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED) && !order.driver;
    };
    const openDriverAssignDialog = (order) => {
      selectedOrder.value = order;
      showDriverAssignDialog.value = true;
    };
    const onDriverAssigned = async (updatedOrder) => {
      successMessage.value = `Driver successfully assigned to Order #${updatedOrder.orderNumber}`;
      await loadOrders();
    };
    const canUpdateStatus = (order) => {
      return order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED;
    };
    const openStatusUpdateDialog = (order) => {
      selectedOrder.value = order;
      showStatusDialog.value = true;
    };
    const onStatusUpdated = async (updatedOrder) => {
      successMessage.value = `Order #${updatedOrder.orderNumber} status updated to ${updatedOrder.status}`;
      await loadOrders();
    };
    const cancelOrder = async (order) => {
      if (!confirm(`Are you sure you want to cancel Order #${order.orderNumber}?`)) return;
      cancellingOrderId.value = order.id;
      try {
        await ordersStore.updateOrderStatus(order.id, OrderStatus.CANCELLED);
        successMessage.value = `Order #${order.orderNumber} has been cancelled`;
        await loadOrders();
      } catch (error) {
        console.error("Error cancelling order:", error);
        ordersStore.error = error.message || "Failed to cancel order";
      } finally {
        cancellingOrderId.value = null;
      }
    };
    const deleteOrder = async (order) => {
      if (!confirm(`Are you sure you want to permanently delete Order #${order.orderNumber}? This action cannot be undone.`)) return;
      deletingOrderId.value = order.id;
      try {
        await ordersStore.deleteOrder(order.id);
        successMessage.value = `Order #${order.orderNumber} has been deleted`;
        await loadOrders();
      } catch (error) {
        console.error("Error deleting order:", error);
        ordersStore.error = error.message || "Failed to delete order";
      } finally {
        deletingOrderId.value = null;
      }
    };
    const viewOrderDetails = (order) => {
      selectedOrder.value = order;
      showOrderDetailsDialog.value = true;
    };
    const formatAmount = (amount) => {
      const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
      return new Intl.NumberFormat("en-UG", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(numAmount);
    };
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-UG", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    };
    const formatTime = (dateString) => {
      return new Date(dateString).toLocaleTimeString("en-UG", {
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    const getStatusColor = (status) => {
      const colors = {
        pending: "orange",
        confirmed: "blue",
        assigned: "purple",
        in_transit: "cyan",
        delivered: "green",
        cancelled: "red"
      };
      return colors[status] || "grey";
    };
    const formatStatus = (status) => {
      return status.split("_").map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      ).join(" ");
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
                        _push4(`<h1 data-v-4c7e7d37${_scopeId3}>Orders Management</h1>`);
                      } else {
                        return [
                          createVNode("h1", null, "Orders Management")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VCol, null, {
                      default: withCtx(() => [
                        createVNode("h1", null, "Orders Management")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (unref(ordersStore).error) {
              _push2(ssrRenderComponent(VAlert, {
                type: "error",
                dense: "",
                class: "mb-4"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(ordersStore).error)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(ordersStore).error), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (successMessage.value) {
              _push2(ssrRenderComponent(VAlert, {
                type: "success",
                dense: "",
                class: "mb-4",
                dismissible: "",
                "onClick:close": ($event) => successMessage.value = ""
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(successMessage.value)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(successMessage.value), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(VCard, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a, _b;
                if (_push3) {
                  _push3(ssrRenderComponent(VCardTitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` All Orders `);
                        _push4(ssrRenderComponent(VSpacer, null, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VSelect, {
                          modelValue: statusFilter.value,
                          "onUpdate:modelValue": [($event) => statusFilter.value = $event, applyFilters],
                          items: statusOptions,
                          label: "Filter by Status",
                          clearable: "",
                          variant: "outlined",
                          density: "compact",
                          style: { "max-width": "200px" },
                          class: "mr-4"
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VBtn, {
                          color: "primary",
                          onClick: loadOrders,
                          loading: unref(ordersStore).loading
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VIcon, { left: "" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`mdi-refresh`);
                                  } else {
                                    return [
                                      createTextVNode("mdi-refresh")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(` Refresh `);
                            } else {
                              return [
                                createVNode(VIcon, { left: "" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-refresh")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Refresh ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createTextVNode(" All Orders "),
                          createVNode(VSpacer),
                          createVNode(VSelect, {
                            modelValue: statusFilter.value,
                            "onUpdate:modelValue": [($event) => statusFilter.value = $event, applyFilters],
                            items: statusOptions,
                            label: "Filter by Status",
                            clearable: "",
                            variant: "outlined",
                            density: "compact",
                            style: { "max-width": "200px" },
                            class: "mr-4"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                          createVNode(VBtn, {
                            color: "primary",
                            onClick: loadOrders,
                            loading: unref(ordersStore).loading
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, { left: "" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-refresh")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" Refresh ")
                            ]),
                            _: 1
                          }, 8, ["loading"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(VDataTable, {
                    headers: headers.value,
                    items: unref(ordersStore).orders || [],
                    loading: unref(ordersStore).loading,
                    "item-value": "id",
                    class: "elevation-1",
                    "server-items-length": ((_a = unref(ordersStore).pagination) == null ? void 0 : _a.total) || 0,
                    page: currentPage.value,
                    "items-per-page": itemsPerPage.value,
                    "onUpdate:page": updatePage,
                    "onUpdate:itemsPerPage": updateItemsPerPage
                  }, {
                    "item.customer": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      var _a2, _b2, _c, _d, _e, _f;
                      if (_push4) {
                        _push4(`<div class="d-flex align-center" data-v-4c7e7d37${_scopeId3}>`);
                        _push4(ssrRenderComponent(VAvatar, {
                          size: "32",
                          class: "mr-3"
                        }, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VIcon, null, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`mdi-account-circle`);
                                  } else {
                                    return [
                                      createTextVNode("mdi-account-circle")
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VIcon, null, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-account-circle")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                        _push4(`<div data-v-4c7e7d37${_scopeId3}><div class="font-weight-medium" data-v-4c7e7d37${_scopeId3}>${ssrInterpolate(((_a2 = item.customer) == null ? void 0 : _a2.firstName) || "N/A")} ${ssrInterpolate(((_b2 = item.customer) == null ? void 0 : _b2.lastName) || "")}</div><div class="text-caption text-grey" data-v-4c7e7d37${_scopeId3}>${ssrInterpolate(((_c = item.customer) == null ? void 0 : _c.phone) || "No phone")}</div></div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "d-flex align-center" }, [
                            createVNode(VAvatar, {
                              size: "32",
                              class: "mr-3"
                            }, {
                              default: withCtx(() => [
                                createVNode(VIcon, null, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-account-circle")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode("div", null, [
                              createVNode("div", { class: "font-weight-medium" }, toDisplayString(((_d = item.customer) == null ? void 0 : _d.firstName) || "N/A") + " " + toDisplayString(((_e = item.customer) == null ? void 0 : _e.lastName) || ""), 1),
                              createVNode("div", { class: "text-caption text-grey" }, toDisplayString(((_f = item.customer) == null ? void 0 : _f.phone) || "No phone"), 1)
                            ])
                          ])
                        ];
                      }
                    }),
                    "item.totalAmount": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="font-weight-medium" data-v-4c7e7d37${_scopeId3}> UGX ${ssrInterpolate(formatAmount(item.totalAmount))}</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "font-weight-medium" }, " UGX " + toDisplayString(formatAmount(item.totalAmount)), 1)
                        ];
                      }
                    }),
                    "item.status": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(VChip, {
                          color: getStatusColor(item.status),
                          size: "small",
                          class: "font-weight-medium"
                        }, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(formatStatus(item.status))}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(formatStatus(item.status)), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(VChip, {
                            color: getStatusColor(item.status),
                            size: "small",
                            class: "font-weight-medium"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(formatStatus(item.status)), 1)
                            ]),
                            _: 2
                          }, 1032, ["color"])
                        ];
                      }
                    }),
                    "item.driver": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (item.driver) {
                          _push4(`<div class="d-flex align-center" data-v-4c7e7d37${_scopeId3}>`);
                          _push4(ssrRenderComponent(VAvatar, {
                            size: "24",
                            color: "primary",
                            class: "mr-2"
                          }, {
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VIcon, {
                                  size: "16",
                                  color: "white"
                                }, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`mdi-account`);
                                    } else {
                                      return [
                                        createTextVNode("mdi-account")
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VIcon, {
                                    size: "16",
                                    color: "white"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-account")
                                    ]),
                                    _: 1
                                  })
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(`<div data-v-4c7e7d37${_scopeId3}><div class="text-body-2 font-weight-medium" data-v-4c7e7d37${_scopeId3}>${ssrInterpolate(item.driver.firstName)} ${ssrInterpolate(item.driver.lastName)}</div><div class="text-caption text-grey" data-v-4c7e7d37${_scopeId3}>${ssrInterpolate(item.driver.phone)}</div></div></div>`);
                        } else {
                          _push4(`<div class="text-caption text-grey" data-v-4c7e7d37${_scopeId3}> No driver assigned </div>`);
                        }
                      } else {
                        return [
                          item.driver ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "d-flex align-center"
                          }, [
                            createVNode(VAvatar, {
                              size: "24",
                              color: "primary",
                              class: "mr-2"
                            }, {
                              default: withCtx(() => [
                                createVNode(VIcon, {
                                  size: "16",
                                  color: "white"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-account")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode("div", null, [
                              createVNode("div", { class: "text-body-2 font-weight-medium" }, toDisplayString(item.driver.firstName) + " " + toDisplayString(item.driver.lastName), 1),
                              createVNode("div", { class: "text-caption text-grey" }, toDisplayString(item.driver.phone), 1)
                            ])
                          ])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "text-caption text-grey"
                          }, " No driver assigned "))
                        ];
                      }
                    }),
                    "item.createdAt": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div data-v-4c7e7d37${_scopeId3}><div class="text-body-2" data-v-4c7e7d37${_scopeId3}>${ssrInterpolate(formatDate(item.createdAt))}</div><div class="text-caption text-grey" data-v-4c7e7d37${_scopeId3}>${ssrInterpolate(formatTime(item.createdAt))}</div></div>`);
                      } else {
                        return [
                          createVNode("div", null, [
                            createVNode("div", { class: "text-body-2" }, toDisplayString(formatDate(item.createdAt)), 1),
                            createVNode("div", { class: "text-caption text-grey" }, toDisplayString(formatTime(item.createdAt)), 1)
                          ])
                        ];
                      }
                    }),
                    "item.actions": withCtx(({ item }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="d-flex gap-1" data-v-4c7e7d37${_scopeId3}>`);
                        if (canAssignDriver(item)) {
                          _push4(ssrRenderComponent(VBtn, {
                            onClick: ($event) => openDriverAssignDialog(item),
                            size: "small",
                            color: "primary",
                            variant: "outlined",
                            loading: unref(ordersStore).assigningDriver
                          }, {
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VIcon, {
                                  size: "16",
                                  class: "mr-1"
                                }, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`mdi-account-plus`);
                                    } else {
                                      return [
                                        createTextVNode("mdi-account-plus")
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(` Assign Driver `);
                              } else {
                                return [
                                  createVNode(VIcon, {
                                    size: "16",
                                    class: "mr-1"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-account-plus")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Assign Driver ")
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        if (canUpdateStatus(item)) {
                          _push4(ssrRenderComponent(VBtn, {
                            onClick: ($event) => openStatusUpdateDialog(item),
                            size: "small",
                            color: "secondary",
                            variant: "outlined"
                          }, {
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(VIcon, {
                                  size: "16",
                                  class: "mr-1"
                                }, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`mdi-update`);
                                    } else {
                                      return [
                                        createTextVNode("mdi-update")
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(` Update Status `);
                              } else {
                                return [
                                  createVNode(VIcon, {
                                    size: "16",
                                    class: "mr-1"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-update")
                                    ]),
                                    _: 1
                                  }),
                                  createTextVNode(" Update Status ")
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(ssrRenderComponent(VBtn, {
                          onClick: ($event) => viewOrderDetails(item),
                          size: "small",
                          color: "info",
                          variant: "text"
                        }, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VIcon, { size: "16" }, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`mdi-eye`);
                                  } else {
                                    return [
                                      createTextVNode("mdi-eye")
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VIcon, { size: "16" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-eye")
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(VMenu, null, {
                          activator: withCtx(({ props }, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VBtn, mergeProps(props, {
                                size: "small",
                                variant: "text",
                                icon: ""
                              }), {
                                default: withCtx((_3, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(VIcon, null, {
                                      default: withCtx((_4, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`mdi-dots-vertical`);
                                        } else {
                                          return [
                                            createTextVNode("mdi-dots-vertical")
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(VIcon, null, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-dots-vertical")
                                        ]),
                                        _: 1
                                      })
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VBtn, mergeProps(props, {
                                  size: "small",
                                  variant: "text",
                                  icon: ""
                                }), {
                                  default: withCtx(() => [
                                    createVNode(VIcon, null, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-dots-vertical")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 2
                                }, 1040)
                              ];
                            }
                          }),
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(VList, { density: "compact" }, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    if (item.status === "pending" || item.status === "confirmed") {
                                      _push6(ssrRenderComponent(VListItem, {
                                        onClick: ($event) => cancelOrder(item),
                                        disabled: cancellingOrderId.value === item.id
                                      }, {
                                        prepend: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VIcon, { color: "error" }, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`mdi-cancel`);
                                                } else {
                                                  return [
                                                    createTextVNode("mdi-cancel")
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(VIcon, { color: "error" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-cancel")
                                                ]),
                                                _: 1
                                              })
                                            ];
                                          }
                                        }),
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VListItemTitle, null, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`Cancel Order`);
                                                } else {
                                                  return [
                                                    createTextVNode("Cancel Order")
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Cancel Order")
                                                ]),
                                                _: 1
                                              })
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                    if (item.status === "cancelled") {
                                      _push6(ssrRenderComponent(VListItem, {
                                        onClick: ($event) => deleteOrder(item),
                                        disabled: deletingOrderId.value === item.id
                                      }, {
                                        prepend: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VIcon, { color: "error" }, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`mdi-delete`);
                                                } else {
                                                  return [
                                                    createTextVNode("mdi-delete")
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(VIcon, { color: "error" }, {
                                                default: withCtx(() => [
                                                  createTextVNode("mdi-delete")
                                                ]),
                                                _: 1
                                              })
                                            ];
                                          }
                                        }),
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(VListItemTitle, null, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`Delete Order`);
                                                } else {
                                                  return [
                                                    createTextVNode("Delete Order")
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Delete Order")
                                                ]),
                                                _: 1
                                              })
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                  } else {
                                    return [
                                      item.status === "pending" || item.status === "confirmed" ? (openBlock(), createBlock(VListItem, {
                                        key: 0,
                                        onClick: ($event) => cancelOrder(item),
                                        disabled: cancellingOrderId.value === item.id
                                      }, {
                                        prepend: withCtx(() => [
                                          createVNode(VIcon, { color: "error" }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-cancel")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        default: withCtx(() => [
                                          createVNode(VListItemTitle, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Cancel Order")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 2
                                      }, 1032, ["onClick", "disabled"])) : createCommentVNode("", true),
                                      item.status === "cancelled" ? (openBlock(), createBlock(VListItem, {
                                        key: 1,
                                        onClick: ($event) => deleteOrder(item),
                                        disabled: deletingOrderId.value === item.id
                                      }, {
                                        prepend: withCtx(() => [
                                          createVNode(VIcon, { color: "error" }, {
                                            default: withCtx(() => [
                                              createTextVNode("mdi-delete")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        default: withCtx(() => [
                                          createVNode(VListItemTitle, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Delete Order")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 2
                                      }, 1032, ["onClick", "disabled"])) : createCommentVNode("", true)
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(VList, { density: "compact" }, {
                                  default: withCtx(() => [
                                    item.status === "pending" || item.status === "confirmed" ? (openBlock(), createBlock(VListItem, {
                                      key: 0,
                                      onClick: ($event) => cancelOrder(item),
                                      disabled: cancellingOrderId.value === item.id
                                    }, {
                                      prepend: withCtx(() => [
                                        createVNode(VIcon, { color: "error" }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-cancel")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      default: withCtx(() => [
                                        createVNode(VListItemTitle, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Cancel Order")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick", "disabled"])) : createCommentVNode("", true),
                                    item.status === "cancelled" ? (openBlock(), createBlock(VListItem, {
                                      key: 1,
                                      onClick: ($event) => deleteOrder(item),
                                      disabled: deletingOrderId.value === item.id
                                    }, {
                                      prepend: withCtx(() => [
                                        createVNode(VIcon, { color: "error" }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-delete")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      default: withCtx(() => [
                                        createVNode(VListItemTitle, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Delete Order")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick", "disabled"])) : createCommentVNode("", true)
                                  ]),
                                  _: 2
                                }, 1024)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { class: "d-flex gap-1" }, [
                            canAssignDriver(item) ? (openBlock(), createBlock(VBtn, {
                              key: 0,
                              onClick: ($event) => openDriverAssignDialog(item),
                              size: "small",
                              color: "primary",
                              variant: "outlined",
                              loading: unref(ordersStore).assigningDriver
                            }, {
                              default: withCtx(() => [
                                createVNode(VIcon, {
                                  size: "16",
                                  class: "mr-1"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-account-plus")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Assign Driver ")
                              ]),
                              _: 2
                            }, 1032, ["onClick", "loading"])) : createCommentVNode("", true),
                            canUpdateStatus(item) ? (openBlock(), createBlock(VBtn, {
                              key: 1,
                              onClick: ($event) => openStatusUpdateDialog(item),
                              size: "small",
                              color: "secondary",
                              variant: "outlined"
                            }, {
                              default: withCtx(() => [
                                createVNode(VIcon, {
                                  size: "16",
                                  class: "mr-1"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-update")
                                  ]),
                                  _: 1
                                }),
                                createTextVNode(" Update Status ")
                              ]),
                              _: 2
                            }, 1032, ["onClick"])) : createCommentVNode("", true),
                            createVNode(VBtn, {
                              onClick: ($event) => viewOrderDetails(item),
                              size: "small",
                              color: "info",
                              variant: "text"
                            }, {
                              default: withCtx(() => [
                                createVNode(VIcon, { size: "16" }, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-eye")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 2
                            }, 1032, ["onClick"]),
                            createVNode(VMenu, null, {
                              activator: withCtx(({ props }) => [
                                createVNode(VBtn, mergeProps(props, {
                                  size: "small",
                                  variant: "text",
                                  icon: ""
                                }), {
                                  default: withCtx(() => [
                                    createVNode(VIcon, null, {
                                      default: withCtx(() => [
                                        createTextVNode("mdi-dots-vertical")
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 2
                                }, 1040)
                              ]),
                              default: withCtx(() => [
                                createVNode(VList, { density: "compact" }, {
                                  default: withCtx(() => [
                                    item.status === "pending" || item.status === "confirmed" ? (openBlock(), createBlock(VListItem, {
                                      key: 0,
                                      onClick: ($event) => cancelOrder(item),
                                      disabled: cancellingOrderId.value === item.id
                                    }, {
                                      prepend: withCtx(() => [
                                        createVNode(VIcon, { color: "error" }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-cancel")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      default: withCtx(() => [
                                        createVNode(VListItemTitle, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Cancel Order")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick", "disabled"])) : createCommentVNode("", true),
                                    item.status === "cancelled" ? (openBlock(), createBlock(VListItem, {
                                      key: 1,
                                      onClick: ($event) => deleteOrder(item),
                                      disabled: deletingOrderId.value === item.id
                                    }, {
                                      prepend: withCtx(() => [
                                        createVNode(VIcon, { color: "error" }, {
                                          default: withCtx(() => [
                                            createTextVNode("mdi-delete")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      default: withCtx(() => [
                                        createVNode(VListItemTitle, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Delete Order")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick", "disabled"])) : createCommentVNode("", true)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024)
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
                        _push4(`<div class="text-center pa-8" data-v-4c7e7d37${_scopeId3}>`);
                        _push4(ssrRenderComponent(VIcon, {
                          size: "64",
                          color: "grey-lighten-1"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`mdi-package-variant`);
                            } else {
                              return [
                                createTextVNode("mdi-package-variant")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`<div class="text-h6 mt-4 mb-2" data-v-4c7e7d37${_scopeId3}>No orders found</div><div class="text-body-2 text-grey" data-v-4c7e7d37${_scopeId3}>${ssrInterpolate(unref(ordersStore).loading ? "Loading orders..." : "There are no orders matching your current filters.")}</div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "text-center pa-8" }, [
                            createVNode(VIcon, {
                              size: "64",
                              color: "grey-lighten-1"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-package-variant")
                              ]),
                              _: 1
                            }),
                            createVNode("div", { class: "text-h6 mt-4 mb-2" }, "No orders found"),
                            createVNode("div", { class: "text-body-2 text-grey" }, toDisplayString(unref(ordersStore).loading ? "Loading orders..." : "There are no orders matching your current filters."), 1)
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(VCardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode(" All Orders "),
                        createVNode(VSpacer),
                        createVNode(VSelect, {
                          modelValue: statusFilter.value,
                          "onUpdate:modelValue": [($event) => statusFilter.value = $event, applyFilters],
                          items: statusOptions,
                          label: "Filter by Status",
                          clearable: "",
                          variant: "outlined",
                          density: "compact",
                          style: { "max-width": "200px" },
                          class: "mr-4"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(VBtn, {
                          color: "primary",
                          onClick: loadOrders,
                          loading: unref(ordersStore).loading
                        }, {
                          default: withCtx(() => [
                            createVNode(VIcon, { left: "" }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-refresh")
                              ]),
                              _: 1
                            }),
                            createTextVNode(" Refresh ")
                          ]),
                          _: 1
                        }, 8, ["loading"])
                      ]),
                      _: 1
                    }),
                    createVNode(VDataTable, {
                      headers: headers.value,
                      items: unref(ordersStore).orders || [],
                      loading: unref(ordersStore).loading,
                      "item-value": "id",
                      class: "elevation-1",
                      "server-items-length": ((_b = unref(ordersStore).pagination) == null ? void 0 : _b.total) || 0,
                      page: currentPage.value,
                      "items-per-page": itemsPerPage.value,
                      "onUpdate:page": updatePage,
                      "onUpdate:itemsPerPage": updateItemsPerPage
                    }, {
                      "item.customer": withCtx(({ item }) => {
                        var _a2, _b2, _c;
                        return [
                          createVNode("div", { class: "d-flex align-center" }, [
                            createVNode(VAvatar, {
                              size: "32",
                              class: "mr-3"
                            }, {
                              default: withCtx(() => [
                                createVNode(VIcon, null, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-account-circle")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode("div", null, [
                              createVNode("div", { class: "font-weight-medium" }, toDisplayString(((_a2 = item.customer) == null ? void 0 : _a2.firstName) || "N/A") + " " + toDisplayString(((_b2 = item.customer) == null ? void 0 : _b2.lastName) || ""), 1),
                              createVNode("div", { class: "text-caption text-grey" }, toDisplayString(((_c = item.customer) == null ? void 0 : _c.phone) || "No phone"), 1)
                            ])
                          ])
                        ];
                      }),
                      "item.totalAmount": withCtx(({ item }) => [
                        createVNode("div", { class: "font-weight-medium" }, " UGX " + toDisplayString(formatAmount(item.totalAmount)), 1)
                      ]),
                      "item.status": withCtx(({ item }) => [
                        createVNode(VChip, {
                          color: getStatusColor(item.status),
                          size: "small",
                          class: "font-weight-medium"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(formatStatus(item.status)), 1)
                          ]),
                          _: 2
                        }, 1032, ["color"])
                      ]),
                      "item.driver": withCtx(({ item }) => [
                        item.driver ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "d-flex align-center"
                        }, [
                          createVNode(VAvatar, {
                            size: "24",
                            color: "primary",
                            class: "mr-2"
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, {
                                size: "16",
                                color: "white"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-account")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode("div", null, [
                            createVNode("div", { class: "text-body-2 font-weight-medium" }, toDisplayString(item.driver.firstName) + " " + toDisplayString(item.driver.lastName), 1),
                            createVNode("div", { class: "text-caption text-grey" }, toDisplayString(item.driver.phone), 1)
                          ])
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "text-caption text-grey"
                        }, " No driver assigned "))
                      ]),
                      "item.createdAt": withCtx(({ item }) => [
                        createVNode("div", null, [
                          createVNode("div", { class: "text-body-2" }, toDisplayString(formatDate(item.createdAt)), 1),
                          createVNode("div", { class: "text-caption text-grey" }, toDisplayString(formatTime(item.createdAt)), 1)
                        ])
                      ]),
                      "item.actions": withCtx(({ item }) => [
                        createVNode("div", { class: "d-flex gap-1" }, [
                          canAssignDriver(item) ? (openBlock(), createBlock(VBtn, {
                            key: 0,
                            onClick: ($event) => openDriverAssignDialog(item),
                            size: "small",
                            color: "primary",
                            variant: "outlined",
                            loading: unref(ordersStore).assigningDriver
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, {
                                size: "16",
                                class: "mr-1"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-account-plus")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" Assign Driver ")
                            ]),
                            _: 2
                          }, 1032, ["onClick", "loading"])) : createCommentVNode("", true),
                          canUpdateStatus(item) ? (openBlock(), createBlock(VBtn, {
                            key: 1,
                            onClick: ($event) => openStatusUpdateDialog(item),
                            size: "small",
                            color: "secondary",
                            variant: "outlined"
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, {
                                size: "16",
                                class: "mr-1"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-update")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" Update Status ")
                            ]),
                            _: 2
                          }, 1032, ["onClick"])) : createCommentVNode("", true),
                          createVNode(VBtn, {
                            onClick: ($event) => viewOrderDetails(item),
                            size: "small",
                            color: "info",
                            variant: "text"
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, { size: "16" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-eye")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 2
                          }, 1032, ["onClick"]),
                          createVNode(VMenu, null, {
                            activator: withCtx(({ props }) => [
                              createVNode(VBtn, mergeProps(props, {
                                size: "small",
                                variant: "text",
                                icon: ""
                              }), {
                                default: withCtx(() => [
                                  createVNode(VIcon, null, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-dots-vertical")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 2
                              }, 1040)
                            ]),
                            default: withCtx(() => [
                              createVNode(VList, { density: "compact" }, {
                                default: withCtx(() => [
                                  item.status === "pending" || item.status === "confirmed" ? (openBlock(), createBlock(VListItem, {
                                    key: 0,
                                    onClick: ($event) => cancelOrder(item),
                                    disabled: cancellingOrderId.value === item.id
                                  }, {
                                    prepend: withCtx(() => [
                                      createVNode(VIcon, { color: "error" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-cancel")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    default: withCtx(() => [
                                      createVNode(VListItemTitle, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Cancel Order")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 2
                                  }, 1032, ["onClick", "disabled"])) : createCommentVNode("", true),
                                  item.status === "cancelled" ? (openBlock(), createBlock(VListItem, {
                                    key: 1,
                                    onClick: ($event) => deleteOrder(item),
                                    disabled: deletingOrderId.value === item.id
                                  }, {
                                    prepend: withCtx(() => [
                                      createVNode(VIcon, { color: "error" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-delete")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    default: withCtx(() => [
                                      createVNode(VListItemTitle, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Delete Order")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 2
                                  }, 1032, ["onClick", "disabled"])) : createCommentVNode("", true)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024)
                        ])
                      ]),
                      loading: withCtx(() => [
                        createVNode(VSkeletonLoader, { type: "table-tbody" })
                      ]),
                      "no-data": withCtx(() => [
                        createVNode("div", { class: "text-center pa-8" }, [
                          createVNode(VIcon, {
                            size: "64",
                            color: "grey-lighten-1"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-package-variant")
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "text-h6 mt-4 mb-2" }, "No orders found"),
                          createVNode("div", { class: "text-body-2 text-grey" }, toDisplayString(unref(ordersStore).loading ? "Loading orders..." : "There are no orders matching your current filters."), 1)
                        ])
                      ]),
                      _: 1
                    }, 8, ["headers", "items", "loading", "server-items-length", "page", "items-per-page"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(DriverAssignDialog, {
              modelValue: showDriverAssignDialog.value,
              "onUpdate:modelValue": ($event) => showDriverAssignDialog.value = $event,
              order: selectedOrder.value,
              onDriverAssigned
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(OrderStatusDialog, {
              modelValue: showStatusDialog.value,
              "onUpdate:modelValue": ($event) => showStatusDialog.value = $event,
              order: selectedOrder.value,
              onStatusUpdated
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(VDialog, {
              modelValue: showOrderDetailsDialog.value,
              "onUpdate:modelValue": ($event) => showOrderDetailsDialog.value = $event,
              "max-width": "800px"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (selectedOrder.value) {
                    _push3(ssrRenderComponent(VCard, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VCardTitle, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` Order #${ssrInterpolate(selectedOrder.value.orderNumber)}`);
                              } else {
                                return [
                                  createTextVNode(" Order #" + toDisplayString(selectedOrder.value.orderNumber), 1)
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
                                      _push6(ssrRenderComponent(VCol, {
                                        cols: "12",
                                        md: "6"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<p data-v-4c7e7d37${_scopeId6}><strong data-v-4c7e7d37${_scopeId6}>Status:</strong> ${ssrInterpolate(selectedOrder.value.status)}</p><p data-v-4c7e7d37${_scopeId6}><strong data-v-4c7e7d37${_scopeId6}>Customer:</strong> ${ssrInterpolate(selectedOrder.value.customer.firstName)} ${ssrInterpolate(selectedOrder.value.customer.lastName)}</p><p data-v-4c7e7d37${_scopeId6}><strong data-v-4c7e7d37${_scopeId6}>Delivery Address:</strong> ${ssrInterpolate(selectedOrder.value.deliveryAddress)}</p>`);
                                          } else {
                                            return [
                                              createVNode("p", null, [
                                                createVNode("strong", null, "Status:"),
                                                createTextVNode(" " + toDisplayString(selectedOrder.value.status), 1)
                                              ]),
                                              createVNode("p", null, [
                                                createVNode("strong", null, "Customer:"),
                                                createTextVNode(" " + toDisplayString(selectedOrder.value.customer.firstName) + " " + toDisplayString(selectedOrder.value.customer.lastName), 1)
                                              ]),
                                              createVNode("p", null, [
                                                createVNode("strong", null, "Delivery Address:"),
                                                createTextVNode(" " + toDisplayString(selectedOrder.value.deliveryAddress), 1)
                                              ])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(VCol, {
                                        cols: "12",
                                        md: "6"
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<p data-v-4c7e7d37${_scopeId6}><strong data-v-4c7e7d37${_scopeId6}>Total Amount:</strong> UGX ${ssrInterpolate(selectedOrder.value.totalAmount)}</p><p data-v-4c7e7d37${_scopeId6}><strong data-v-4c7e7d37${_scopeId6}>Driver:</strong> ${ssrInterpolate(selectedOrder.value.driver ? `${selectedOrder.value.driver.firstName} ${selectedOrder.value.driver.lastName}` : "Not Assigned")}</p><p data-v-4c7e7d37${_scopeId6}><strong data-v-4c7e7d37${_scopeId6}>Order Date:</strong> ${ssrInterpolate(new Date(selectedOrder.value.createdAt).toLocaleString())}</p>`);
                                          } else {
                                            return [
                                              createVNode("p", null, [
                                                createVNode("strong", null, "Total Amount:"),
                                                createTextVNode(" UGX " + toDisplayString(selectedOrder.value.totalAmount), 1)
                                              ]),
                                              createVNode("p", null, [
                                                createVNode("strong", null, "Driver:"),
                                                createTextVNode(" " + toDisplayString(selectedOrder.value.driver ? `${selectedOrder.value.driver.firstName} ${selectedOrder.value.driver.lastName}` : "Not Assigned"), 1)
                                              ]),
                                              createVNode("p", null, [
                                                createVNode("strong", null, "Order Date:"),
                                                createTextVNode(" " + toDisplayString(new Date(selectedOrder.value.createdAt).toLocaleString()), 1)
                                              ])
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(VCol, {
                                          cols: "12",
                                          md: "6"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("p", null, [
                                              createVNode("strong", null, "Status:"),
                                              createTextVNode(" " + toDisplayString(selectedOrder.value.status), 1)
                                            ]),
                                            createVNode("p", null, [
                                              createVNode("strong", null, "Customer:"),
                                              createTextVNode(" " + toDisplayString(selectedOrder.value.customer.firstName) + " " + toDisplayString(selectedOrder.value.customer.lastName), 1)
                                            ]),
                                            createVNode("p", null, [
                                              createVNode("strong", null, "Delivery Address:"),
                                              createTextVNode(" " + toDisplayString(selectedOrder.value.deliveryAddress), 1)
                                            ])
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(VCol, {
                                          cols: "12",
                                          md: "6"
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("p", null, [
                                              createVNode("strong", null, "Total Amount:"),
                                              createTextVNode(" UGX " + toDisplayString(selectedOrder.value.totalAmount), 1)
                                            ]),
                                            createVNode("p", null, [
                                              createVNode("strong", null, "Driver:"),
                                              createTextVNode(" " + toDisplayString(selectedOrder.value.driver ? `${selectedOrder.value.driver.firstName} ${selectedOrder.value.driver.lastName}` : "Not Assigned"), 1)
                                            ]),
                                            createVNode("p", null, [
                                              createVNode("strong", null, "Order Date:"),
                                              createTextVNode(" " + toDisplayString(new Date(selectedOrder.value.createdAt).toLocaleString()), 1)
                                            ])
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(VDivider, { class: "my-4" }, null, _parent5, _scopeId4));
                                _push5(`<h3 data-v-4c7e7d37${_scopeId4}>Order Items</h3>`);
                                _push5(ssrRenderComponent(VList, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<!--[-->`);
                                      ssrRenderList(selectedOrder.value.items, (item) => {
                                        _push6(ssrRenderComponent(VListItem, {
                                          key: item.id
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(VListItemTitle, null, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(`${ssrInterpolate(item.gasCylinder.name)}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(toDisplayString(item.gasCylinder.name), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                              _push7(ssrRenderComponent(VListItemSubtitle, null, {
                                                default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(` Quantity: ${ssrInterpolate(item.quantity)} | Unit Price: UGX ${ssrInterpolate(item.unitPrice)} | Total: UGX ${ssrInterpolate(item.totalPrice)}`);
                                                  } else {
                                                    return [
                                                      createTextVNode(" Quantity: " + toDisplayString(item.quantity) + " | Unit Price: UGX " + toDisplayString(item.unitPrice) + " | Total: UGX " + toDisplayString(item.totalPrice), 1)
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(VListItemTitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(item.gasCylinder.name), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024),
                                                createVNode(VListItemSubtitle, null, {
                                                  default: withCtx(() => [
                                                    createTextVNode(" Quantity: " + toDisplayString(item.quantity) + " | Unit Price: UGX " + toDisplayString(item.unitPrice) + " | Total: UGX " + toDisplayString(item.totalPrice), 1)
                                                  ]),
                                                  _: 2
                                                }, 1024)
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      });
                                      _push6(`<!--]-->`);
                                    } else {
                                      return [
                                        (openBlock(true), createBlock(Fragment, null, renderList(selectedOrder.value.items, (item) => {
                                          return openBlock(), createBlock(VListItem, {
                                            key: item.id
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(VListItemTitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(item.gasCylinder.name), 1)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(VListItemSubtitle, null, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Quantity: " + toDisplayString(item.quantity) + " | Unit Price: UGX " + toDisplayString(item.unitPrice) + " | Total: UGX " + toDisplayString(item.totalPrice), 1)
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ]),
                                            _: 2
                                          }, 1024);
                                        }), 128))
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(VRow, null, {
                                    default: withCtx(() => [
                                      createVNode(VCol, {
                                        cols: "12",
                                        md: "6"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("p", null, [
                                            createVNode("strong", null, "Status:"),
                                            createTextVNode(" " + toDisplayString(selectedOrder.value.status), 1)
                                          ]),
                                          createVNode("p", null, [
                                            createVNode("strong", null, "Customer:"),
                                            createTextVNode(" " + toDisplayString(selectedOrder.value.customer.firstName) + " " + toDisplayString(selectedOrder.value.customer.lastName), 1)
                                          ]),
                                          createVNode("p", null, [
                                            createVNode("strong", null, "Delivery Address:"),
                                            createTextVNode(" " + toDisplayString(selectedOrder.value.deliveryAddress), 1)
                                          ])
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(VCol, {
                                        cols: "12",
                                        md: "6"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("p", null, [
                                            createVNode("strong", null, "Total Amount:"),
                                            createTextVNode(" UGX " + toDisplayString(selectedOrder.value.totalAmount), 1)
                                          ]),
                                          createVNode("p", null, [
                                            createVNode("strong", null, "Driver:"),
                                            createTextVNode(" " + toDisplayString(selectedOrder.value.driver ? `${selectedOrder.value.driver.firstName} ${selectedOrder.value.driver.lastName}` : "Not Assigned"), 1)
                                          ]),
                                          createVNode("p", null, [
                                            createVNode("strong", null, "Order Date:"),
                                            createTextVNode(" " + toDisplayString(new Date(selectedOrder.value.createdAt).toLocaleString()), 1)
                                          ])
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(VDivider, { class: "my-4" }),
                                  createVNode("h3", null, "Order Items"),
                                  createVNode(VList, null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(selectedOrder.value.items, (item) => {
                                        return openBlock(), createBlock(VListItem, {
                                          key: item.id
                                        }, {
                                          default: withCtx(() => [
                                            createVNode(VListItemTitle, null, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(item.gasCylinder.name), 1)
                                              ]),
                                              _: 2
                                            }, 1024),
                                            createVNode(VListItemSubtitle, null, {
                                              default: withCtx(() => [
                                                createTextVNode(" Quantity: " + toDisplayString(item.quantity) + " | Unit Price: UGX " + toDisplayString(item.unitPrice) + " | Total: UGX " + toDisplayString(item.totalPrice), 1)
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 128))
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
                                  color: "primary",
                                  onClick: ($event) => showOrderDetailsDialog.value = false
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
                              } else {
                                return [
                                  createVNode(VSpacer),
                                  createVNode(VBtn, {
                                    color: "primary",
                                    onClick: ($event) => showOrderDetailsDialog.value = false
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Close")
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
                                createTextVNode(" Order #" + toDisplayString(selectedOrder.value.orderNumber), 1)
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
                                        createVNode("p", null, [
                                          createVNode("strong", null, "Status:"),
                                          createTextVNode(" " + toDisplayString(selectedOrder.value.status), 1)
                                        ]),
                                        createVNode("p", null, [
                                          createVNode("strong", null, "Customer:"),
                                          createTextVNode(" " + toDisplayString(selectedOrder.value.customer.firstName) + " " + toDisplayString(selectedOrder.value.customer.lastName), 1)
                                        ]),
                                        createVNode("p", null, [
                                          createVNode("strong", null, "Delivery Address:"),
                                          createTextVNode(" " + toDisplayString(selectedOrder.value.deliveryAddress), 1)
                                        ])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(VCol, {
                                      cols: "12",
                                      md: "6"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("p", null, [
                                          createVNode("strong", null, "Total Amount:"),
                                          createTextVNode(" UGX " + toDisplayString(selectedOrder.value.totalAmount), 1)
                                        ]),
                                        createVNode("p", null, [
                                          createVNode("strong", null, "Driver:"),
                                          createTextVNode(" " + toDisplayString(selectedOrder.value.driver ? `${selectedOrder.value.driver.firstName} ${selectedOrder.value.driver.lastName}` : "Not Assigned"), 1)
                                        ]),
                                        createVNode("p", null, [
                                          createVNode("strong", null, "Order Date:"),
                                          createTextVNode(" " + toDisplayString(new Date(selectedOrder.value.createdAt).toLocaleString()), 1)
                                        ])
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(VDivider, { class: "my-4" }),
                                createVNode("h3", null, "Order Items"),
                                createVNode(VList, null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(selectedOrder.value.items, (item) => {
                                      return openBlock(), createBlock(VListItem, {
                                        key: item.id
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(VListItemTitle, null, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(item.gasCylinder.name), 1)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(VListItemSubtitle, null, {
                                            default: withCtx(() => [
                                              createTextVNode(" Quantity: " + toDisplayString(item.quantity) + " | Unit Price: UGX " + toDisplayString(item.unitPrice) + " | Total: UGX " + toDisplayString(item.totalPrice), 1)
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024);
                                    }), 128))
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(VCardActions, null, {
                              default: withCtx(() => [
                                createVNode(VSpacer),
                                createVNode(VBtn, {
                                  color: "primary",
                                  onClick: ($event) => showOrderDetailsDialog.value = false
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Close")
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
                    selectedOrder.value ? (openBlock(), createBlock(VCard, { key: 0 }, {
                      default: withCtx(() => [
                        createVNode(VCardTitle, null, {
                          default: withCtx(() => [
                            createTextVNode(" Order #" + toDisplayString(selectedOrder.value.orderNumber), 1)
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
                                    createVNode("p", null, [
                                      createVNode("strong", null, "Status:"),
                                      createTextVNode(" " + toDisplayString(selectedOrder.value.status), 1)
                                    ]),
                                    createVNode("p", null, [
                                      createVNode("strong", null, "Customer:"),
                                      createTextVNode(" " + toDisplayString(selectedOrder.value.customer.firstName) + " " + toDisplayString(selectedOrder.value.customer.lastName), 1)
                                    ]),
                                    createVNode("p", null, [
                                      createVNode("strong", null, "Delivery Address:"),
                                      createTextVNode(" " + toDisplayString(selectedOrder.value.deliveryAddress), 1)
                                    ])
                                  ]),
                                  _: 1
                                }),
                                createVNode(VCol, {
                                  cols: "12",
                                  md: "6"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("p", null, [
                                      createVNode("strong", null, "Total Amount:"),
                                      createTextVNode(" UGX " + toDisplayString(selectedOrder.value.totalAmount), 1)
                                    ]),
                                    createVNode("p", null, [
                                      createVNode("strong", null, "Driver:"),
                                      createTextVNode(" " + toDisplayString(selectedOrder.value.driver ? `${selectedOrder.value.driver.firstName} ${selectedOrder.value.driver.lastName}` : "Not Assigned"), 1)
                                    ]),
                                    createVNode("p", null, [
                                      createVNode("strong", null, "Order Date:"),
                                      createTextVNode(" " + toDisplayString(new Date(selectedOrder.value.createdAt).toLocaleString()), 1)
                                    ])
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(VDivider, { class: "my-4" }),
                            createVNode("h3", null, "Order Items"),
                            createVNode(VList, null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(selectedOrder.value.items, (item) => {
                                  return openBlock(), createBlock(VListItem, {
                                    key: item.id
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(VListItemTitle, null, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(item.gasCylinder.name), 1)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(VListItemSubtitle, null, {
                                        default: withCtx(() => [
                                          createTextVNode(" Quantity: " + toDisplayString(item.quantity) + " | Unit Price: UGX " + toDisplayString(item.unitPrice) + " | Total: UGX " + toDisplayString(item.totalPrice), 1)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024);
                                }), 128))
                              ]),
                              _: 1
                            })
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(VCardActions, null, {
                          default: withCtx(() => [
                            createVNode(VSpacer),
                            createVNode(VBtn, {
                              color: "primary",
                              onClick: ($event) => showOrderDetailsDialog.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Close")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 2
                    }, 1024)) : createCommentVNode("", true)
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
                      createVNode("h1", null, "Orders Management")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              unref(ordersStore).error ? (openBlock(), createBlock(VAlert, {
                key: 0,
                type: "error",
                dense: "",
                class: "mb-4"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(unref(ordersStore).error), 1)
                ]),
                _: 1
              })) : createCommentVNode("", true),
              successMessage.value ? (openBlock(), createBlock(VAlert, {
                key: 1,
                type: "success",
                dense: "",
                class: "mb-4",
                dismissible: "",
                "onClick:close": ($event) => successMessage.value = ""
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(successMessage.value), 1)
                ]),
                _: 1
              }, 8, ["onClick:close"])) : createCommentVNode("", true),
              createVNode(VCard, null, {
                default: withCtx(() => {
                  var _a;
                  return [
                    createVNode(VCardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode(" All Orders "),
                        createVNode(VSpacer),
                        createVNode(VSelect, {
                          modelValue: statusFilter.value,
                          "onUpdate:modelValue": [($event) => statusFilter.value = $event, applyFilters],
                          items: statusOptions,
                          label: "Filter by Status",
                          clearable: "",
                          variant: "outlined",
                          density: "compact",
                          style: { "max-width": "200px" },
                          class: "mr-4"
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(VBtn, {
                          color: "primary",
                          onClick: loadOrders,
                          loading: unref(ordersStore).loading
                        }, {
                          default: withCtx(() => [
                            createVNode(VIcon, { left: "" }, {
                              default: withCtx(() => [
                                createTextVNode("mdi-refresh")
                              ]),
                              _: 1
                            }),
                            createTextVNode(" Refresh ")
                          ]),
                          _: 1
                        }, 8, ["loading"])
                      ]),
                      _: 1
                    }),
                    createVNode(VDataTable, {
                      headers: headers.value,
                      items: unref(ordersStore).orders || [],
                      loading: unref(ordersStore).loading,
                      "item-value": "id",
                      class: "elevation-1",
                      "server-items-length": ((_a = unref(ordersStore).pagination) == null ? void 0 : _a.total) || 0,
                      page: currentPage.value,
                      "items-per-page": itemsPerPage.value,
                      "onUpdate:page": updatePage,
                      "onUpdate:itemsPerPage": updateItemsPerPage
                    }, {
                      "item.customer": withCtx(({ item }) => {
                        var _a2, _b, _c;
                        return [
                          createVNode("div", { class: "d-flex align-center" }, [
                            createVNode(VAvatar, {
                              size: "32",
                              class: "mr-3"
                            }, {
                              default: withCtx(() => [
                                createVNode(VIcon, null, {
                                  default: withCtx(() => [
                                    createTextVNode("mdi-account-circle")
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }),
                            createVNode("div", null, [
                              createVNode("div", { class: "font-weight-medium" }, toDisplayString(((_a2 = item.customer) == null ? void 0 : _a2.firstName) || "N/A") + " " + toDisplayString(((_b = item.customer) == null ? void 0 : _b.lastName) || ""), 1),
                              createVNode("div", { class: "text-caption text-grey" }, toDisplayString(((_c = item.customer) == null ? void 0 : _c.phone) || "No phone"), 1)
                            ])
                          ])
                        ];
                      }),
                      "item.totalAmount": withCtx(({ item }) => [
                        createVNode("div", { class: "font-weight-medium" }, " UGX " + toDisplayString(formatAmount(item.totalAmount)), 1)
                      ]),
                      "item.status": withCtx(({ item }) => [
                        createVNode(VChip, {
                          color: getStatusColor(item.status),
                          size: "small",
                          class: "font-weight-medium"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(formatStatus(item.status)), 1)
                          ]),
                          _: 2
                        }, 1032, ["color"])
                      ]),
                      "item.driver": withCtx(({ item }) => [
                        item.driver ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "d-flex align-center"
                        }, [
                          createVNode(VAvatar, {
                            size: "24",
                            color: "primary",
                            class: "mr-2"
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, {
                                size: "16",
                                color: "white"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-account")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode("div", null, [
                            createVNode("div", { class: "text-body-2 font-weight-medium" }, toDisplayString(item.driver.firstName) + " " + toDisplayString(item.driver.lastName), 1),
                            createVNode("div", { class: "text-caption text-grey" }, toDisplayString(item.driver.phone), 1)
                          ])
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "text-caption text-grey"
                        }, " No driver assigned "))
                      ]),
                      "item.createdAt": withCtx(({ item }) => [
                        createVNode("div", null, [
                          createVNode("div", { class: "text-body-2" }, toDisplayString(formatDate(item.createdAt)), 1),
                          createVNode("div", { class: "text-caption text-grey" }, toDisplayString(formatTime(item.createdAt)), 1)
                        ])
                      ]),
                      "item.actions": withCtx(({ item }) => [
                        createVNode("div", { class: "d-flex gap-1" }, [
                          canAssignDriver(item) ? (openBlock(), createBlock(VBtn, {
                            key: 0,
                            onClick: ($event) => openDriverAssignDialog(item),
                            size: "small",
                            color: "primary",
                            variant: "outlined",
                            loading: unref(ordersStore).assigningDriver
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, {
                                size: "16",
                                class: "mr-1"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-account-plus")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" Assign Driver ")
                            ]),
                            _: 2
                          }, 1032, ["onClick", "loading"])) : createCommentVNode("", true),
                          canUpdateStatus(item) ? (openBlock(), createBlock(VBtn, {
                            key: 1,
                            onClick: ($event) => openStatusUpdateDialog(item),
                            size: "small",
                            color: "secondary",
                            variant: "outlined"
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, {
                                size: "16",
                                class: "mr-1"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-update")
                                ]),
                                _: 1
                              }),
                              createTextVNode(" Update Status ")
                            ]),
                            _: 2
                          }, 1032, ["onClick"])) : createCommentVNode("", true),
                          createVNode(VBtn, {
                            onClick: ($event) => viewOrderDetails(item),
                            size: "small",
                            color: "info",
                            variant: "text"
                          }, {
                            default: withCtx(() => [
                              createVNode(VIcon, { size: "16" }, {
                                default: withCtx(() => [
                                  createTextVNode("mdi-eye")
                                ]),
                                _: 1
                              })
                            ]),
                            _: 2
                          }, 1032, ["onClick"]),
                          createVNode(VMenu, null, {
                            activator: withCtx(({ props }) => [
                              createVNode(VBtn, mergeProps(props, {
                                size: "small",
                                variant: "text",
                                icon: ""
                              }), {
                                default: withCtx(() => [
                                  createVNode(VIcon, null, {
                                    default: withCtx(() => [
                                      createTextVNode("mdi-dots-vertical")
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 2
                              }, 1040)
                            ]),
                            default: withCtx(() => [
                              createVNode(VList, { density: "compact" }, {
                                default: withCtx(() => [
                                  item.status === "pending" || item.status === "confirmed" ? (openBlock(), createBlock(VListItem, {
                                    key: 0,
                                    onClick: ($event) => cancelOrder(item),
                                    disabled: cancellingOrderId.value === item.id
                                  }, {
                                    prepend: withCtx(() => [
                                      createVNode(VIcon, { color: "error" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-cancel")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    default: withCtx(() => [
                                      createVNode(VListItemTitle, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Cancel Order")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 2
                                  }, 1032, ["onClick", "disabled"])) : createCommentVNode("", true),
                                  item.status === "cancelled" ? (openBlock(), createBlock(VListItem, {
                                    key: 1,
                                    onClick: ($event) => deleteOrder(item),
                                    disabled: deletingOrderId.value === item.id
                                  }, {
                                    prepend: withCtx(() => [
                                      createVNode(VIcon, { color: "error" }, {
                                        default: withCtx(() => [
                                          createTextVNode("mdi-delete")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    default: withCtx(() => [
                                      createVNode(VListItemTitle, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Delete Order")
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 2
                                  }, 1032, ["onClick", "disabled"])) : createCommentVNode("", true)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024)
                        ])
                      ]),
                      loading: withCtx(() => [
                        createVNode(VSkeletonLoader, { type: "table-tbody" })
                      ]),
                      "no-data": withCtx(() => [
                        createVNode("div", { class: "text-center pa-8" }, [
                          createVNode(VIcon, {
                            size: "64",
                            color: "grey-lighten-1"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("mdi-package-variant")
                            ]),
                            _: 1
                          }),
                          createVNode("div", { class: "text-h6 mt-4 mb-2" }, "No orders found"),
                          createVNode("div", { class: "text-body-2 text-grey" }, toDisplayString(unref(ordersStore).loading ? "Loading orders..." : "There are no orders matching your current filters."), 1)
                        ])
                      ]),
                      _: 1
                    }, 8, ["headers", "items", "loading", "server-items-length", "page", "items-per-page"])
                  ];
                }),
                _: 1
              }),
              createVNode(DriverAssignDialog, {
                modelValue: showDriverAssignDialog.value,
                "onUpdate:modelValue": ($event) => showDriverAssignDialog.value = $event,
                order: selectedOrder.value,
                onDriverAssigned
              }, null, 8, ["modelValue", "onUpdate:modelValue", "order"]),
              createVNode(OrderStatusDialog, {
                modelValue: showStatusDialog.value,
                "onUpdate:modelValue": ($event) => showStatusDialog.value = $event,
                order: selectedOrder.value,
                onStatusUpdated
              }, null, 8, ["modelValue", "onUpdate:modelValue", "order"]),
              createVNode(VDialog, {
                modelValue: showOrderDetailsDialog.value,
                "onUpdate:modelValue": ($event) => showOrderDetailsDialog.value = $event,
                "max-width": "800px"
              }, {
                default: withCtx(() => [
                  selectedOrder.value ? (openBlock(), createBlock(VCard, { key: 0 }, {
                    default: withCtx(() => [
                      createVNode(VCardTitle, null, {
                        default: withCtx(() => [
                          createTextVNode(" Order #" + toDisplayString(selectedOrder.value.orderNumber), 1)
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
                                  createVNode("p", null, [
                                    createVNode("strong", null, "Status:"),
                                    createTextVNode(" " + toDisplayString(selectedOrder.value.status), 1)
                                  ]),
                                  createVNode("p", null, [
                                    createVNode("strong", null, "Customer:"),
                                    createTextVNode(" " + toDisplayString(selectedOrder.value.customer.firstName) + " " + toDisplayString(selectedOrder.value.customer.lastName), 1)
                                  ]),
                                  createVNode("p", null, [
                                    createVNode("strong", null, "Delivery Address:"),
                                    createTextVNode(" " + toDisplayString(selectedOrder.value.deliveryAddress), 1)
                                  ])
                                ]),
                                _: 1
                              }),
                              createVNode(VCol, {
                                cols: "12",
                                md: "6"
                              }, {
                                default: withCtx(() => [
                                  createVNode("p", null, [
                                    createVNode("strong", null, "Total Amount:"),
                                    createTextVNode(" UGX " + toDisplayString(selectedOrder.value.totalAmount), 1)
                                  ]),
                                  createVNode("p", null, [
                                    createVNode("strong", null, "Driver:"),
                                    createTextVNode(" " + toDisplayString(selectedOrder.value.driver ? `${selectedOrder.value.driver.firstName} ${selectedOrder.value.driver.lastName}` : "Not Assigned"), 1)
                                  ]),
                                  createVNode("p", null, [
                                    createVNode("strong", null, "Order Date:"),
                                    createTextVNode(" " + toDisplayString(new Date(selectedOrder.value.createdAt).toLocaleString()), 1)
                                  ])
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(VDivider, { class: "my-4" }),
                          createVNode("h3", null, "Order Items"),
                          createVNode(VList, null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(selectedOrder.value.items, (item) => {
                                return openBlock(), createBlock(VListItem, {
                                  key: item.id
                                }, {
                                  default: withCtx(() => [
                                    createVNode(VListItemTitle, null, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(item.gasCylinder.name), 1)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(VListItemSubtitle, null, {
                                      default: withCtx(() => [
                                        createTextVNode(" Quantity: " + toDisplayString(item.quantity) + " | Unit Price: UGX " + toDisplayString(item.unitPrice) + " | Total: UGX " + toDisplayString(item.totalPrice), 1)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 128))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(VCardActions, null, {
                        default: withCtx(() => [
                          createVNode(VSpacer),
                          createVNode(VBtn, {
                            color: "primary",
                            onClick: ($event) => showOrderDetailsDialog.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Close")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 2
                  }, 1024)) : createCommentVNode("", true)
                ]),
                _: 2
              }, 1032, ["modelValue", "onUpdate:modelValue"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/orders.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const orders = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4c7e7d37"]]);
export {
  orders as default
};
//# sourceMappingURL=orders-fcazaaP3.js.map
