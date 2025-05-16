import type {
  MainThreadStartConfigs,
  RpcCallType,
  updateDataEndpoint,
} from '@lynx-js/web-constants';
import type { MainThreadRuntime } from '@lynx-js/web-mainthread-apis';
import { Rpc } from '@lynx-js/web-worker-rpc';

const {
  loadMainThread,
} = await import('@lynx-js/web-mainthread-apis');

export function createRenderAllOnUI(
  mainToBackgroundRpc: Rpc,
  shadowRoot: ShadowRoot,
  markTimingInternal: (
    timingKey: string,
    pipelineId?: string,
    timeStamp?: number,
  ) => void,
  callbacks: {
    onError?: () => void;
  },
) {
  if (!globalThis.module) {
    Object.assign(globalThis, { module: {} });
  }
  const docu = Object.assign(shadowRoot, {
    createElement: document.createElement.bind(document),
  });
  const { startMainThread } = loadMainThread(
    mainToBackgroundRpc,
    docu,
    () => {},
    markTimingInternal,
    () => {
      callbacks.onError?.();
    },
  );
  let runtime!: MainThreadRuntime;
  const start = async (configs: MainThreadStartConfigs) => {
    const mainThreadRuntime = startMainThread(configs);
    runtime = await mainThreadRuntime;
  };
  const updateDataMainThread: RpcCallType<typeof updateDataEndpoint> = async (
    ...args
  ) => {
    runtime.updatePage?.(...args);
  };
  return {
    start,
    updateDataMainThread,
  };
}
