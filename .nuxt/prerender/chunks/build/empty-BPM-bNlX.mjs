import { M as VApp, S as VMain, _ as __nuxt_component_0 } from './server.mjs';
import { defineComponent, useSSRContext, withCtx, createVNode } from 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/vue/index.mjs';
import { ssrRenderComponent } from 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/vue/server-renderer/index.mjs';
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
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/pinia/dist/pinia.prod.cjs';
import 'file:///home/pope/zcode/hfmg/4/fullgass/dash/node_modules/vue-router/dist/vue-router.node.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "empty",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0;
      _push(ssrRenderComponent(VApp, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VMain, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_NuxtPage, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_NuxtPage)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VMain, null, {
                default: withCtx(() => [
                  createVNode(_component_NuxtPage)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/empty.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const empty = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3396eb8f"]]);

export { empty as default };
//# sourceMappingURL=empty-BPM-bNlX.mjs.map
