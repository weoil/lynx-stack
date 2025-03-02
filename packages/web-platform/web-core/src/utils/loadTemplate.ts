import type { LynxTemplate } from '@lynx-js/web-constants';

const TemplateCache: Record<string, LynxTemplate> = {};

function createJsModuleUrl(content: string): string {
  return URL.createObjectURL(new Blob([content], { type: 'text/javascript' }));
}

function generateJavascriptUrl<T extends Record<string, string>>(
  obj: T,
  injectVars: string[],
  injectWithBind: string[],
) {
  return Object.fromEntries(
    Object.entries(obj).map(([name, content]) => {
      return [
        name,
        createJsModuleUrl(
          `globalThis.module.exports = function(lynx_runtime) {
const module= {exports:{}};let exports = module.exports;
var {${injectVars.join(',')}} = lynx_runtime; 
${
            injectWithBind.map((nm) =>
              `const ${nm} = lynx_runtime.${nm}?.bind(lynx_runtime)`
            ).join(';')
          }
var globDynamicComponentEntry = '__Card__';
var {__globalProps} = lynx;
${content}
return module.exports;}`,
        ),
      ];
    }),
  ) as T;
}

const mainThreadInjectVars = [
  'lynx',
  'globalThis',
];

const backgroundInjectVars = [
  'NativeModules',
  'globalThis',
  'lynx',
  'lynxCoreInject',
];

const backgroundInjectWithBind = [
  'Card',
  'Component',
];

export async function loadTemplate(url: string): Promise<LynxTemplate> {
  const cachedTemplate = TemplateCache[url];
  if (cachedTemplate) return cachedTemplate;
  const template = (await (await fetch(url, {
    method: 'GET',
  })).json()) as LynxTemplate;
  const decodedTemplate: LynxTemplate = {
    ...template,
    lepusCode: generateJavascriptUrl(
      template.lepusCode,
      mainThreadInjectVars,
      [],
    ),
    manifest: generateJavascriptUrl(
      template.manifest,
      backgroundInjectVars,
      backgroundInjectWithBind,
    ),
  };
  TemplateCache[url] = decodedTemplate;
  /**
   * This will cause a memory leak, which is expected.
   * We cannot ensure that the `URL.createObjectURL` created url will never be used, therefore here we keep it for the entire lifetime of this page.
   */
  return decodedTemplate;
}
