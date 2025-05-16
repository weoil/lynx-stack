/*
// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
*/
import { Component, options, render } from 'preact';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { replaceCommitHook } from '../../src/lifecycle/patch/commit';
import { injectUpdateMainThread } from '../../src/lifecycle/patch/updateMainThread';
import '../../src/lynx/component';
import { initTimingAPI } from '../../src/lynx/performance';
import { __root } from '../../src/root';
import { setupPage } from '../../src/snapshot';
import { globalEnvManager } from '../utils/envManager';
import { elementTree, waitSchedule } from '../utils/nativeMethod';

beforeAll(() => {
  setupPage(__CreatePage('0', 0));
  injectUpdateMainThread();
  replaceCommitHook();
  initTimingAPI();
});

beforeEach(() => {
  globalEnvManager.resetEnv();
  SystemInfo.lynxSdkVersion = '3.1';
});

afterEach(() => {
  vi.restoreAllMocks();
  elementTree.clear();
  lynx.performance.__functionCallHistory = [];
});

describe('setState timing api', () => {
  it('basic', async function() {
    let mtCallbacks = [];
    lynx.getNativeApp().callLepusMethod.mockImplementation((name, data, cb) => {
      mtCallbacks.push([name, data, cb]);
    });

    let comp;
    class Comp extends Component {
      state = {
        show: false,
      };
      render() {
        comp = this;
        return (
          <view>
            {this.state.show && <text>{1}</text>}
          </view>
        );
      }
    }

    __root.__jsx = <Comp />;
    renderPage();
    expect(__root.__element_root).toMatchInlineSnapshot(`
      <page
        cssId="default-entry-from-native:0"
      >
        <view />
      </page>
    `);

    globalEnvManager.switchToBackground();
    render(<Comp />, __root);

    // LifecycleConstant.firstScreen
    lynxCoreInject.tt.OnLifecycleEvent(...globalThis.__OnLifecycleEvent.mock.calls[0]);

    mtCallbacks = [];
    comp.setState({
      show: true,
      __lynx_timing_flag: '__lynx_timing_actual_fmp',
    });

    await waitSchedule();

    expect(lynx.getNativeApp().markTiming).toHaveBeenCalledTimes(3);
    expect(lynx.getNativeApp().markTiming).toHaveBeenNthCalledWith(
      1,
      '__lynx_timing_actual_fmp',
      'updateSetStateTrigger',
    );
    expect(lynx.getNativeApp().markTiming).toHaveBeenNthCalledWith(
      2,
      '__lynx_timing_actual_fmp',
      'updateDiffVdomStart',
    );
    expect(lynx.getNativeApp().markTiming).toHaveBeenNthCalledWith(
      3,
      '__lynx_timing_actual_fmp',
      'updateDiffVdomEnd',
    );

    expect(mtCallbacks[0][1]).toMatchInlineSnapshot(`
      {
        "data": "{"patchList":[{"id":3,"snapshotPatch":[0,"__Card__:__snapshot_a94a8_test_2",3,0,null,4,3,4,0,1,1,3,4,null,1,-2,3,null]}],"flushOptions":{"__lynx_timing_flag":"__lynx_timing_actual_fmp"}}",
        "patchOptions": {
          "pipelineOptions": {
            "dsl": "reactLynx",
            "needTimestamps": false,
            "pipelineID": "pipelineID",
            "pipelineOrigin": "updateTriggeredByBts",
            "stage": "update",
          },
          "reloadVersion": 0,
        },
      }
    `);

    globalEnvManager.switchToMainThread();
    rLynxChange(mtCallbacks[0][1]);
    expect(__root.__element_root).toMatchInlineSnapshot(`
      <page
        cssId="default-entry-from-native:0"
      >
        <view>
          <text>
            <raw-text
              text={1}
            />
          </text>
        </view>
      </page>
    `);
    globalEnvManager.switchToBackground();
  });
});

describe('attribute timing api', () => {
  it('basic', async function() {
    let mtCallbacks = [];
    lynx.getNativeApp().callLepusMethod.mockImplementation((name, data, cb) => {
      mtCallbacks.push([name, data, cb]);
    });

    let comp;
    class Comp extends Component {
      state = {
        show: false,
      };
      render() {
        comp = this;
        return (
          <view>
            {this.state.show && <text __lynx_timing_flag={'__lynx_timing_actual_fmp'}>{1}</text>}
          </view>
        );
      }
    }

    globalEnvManager.switchToMainThread();
    __root.__jsx = <Comp />;
    renderPage();
    expect(__root.__element_root).toMatchInlineSnapshot(`
      <page
        cssId="default-entry-from-native:0"
      >
        <view />
      </page>
    `);

    globalEnvManager.switchToBackground();
    render(<Comp />, __root);
    // LifecycleConstant.firstScreen
    lynxCoreInject.tt.OnLifecycleEvent(...globalThis.__OnLifecycleEvent.mock.calls[0]);
    lynx.performance.__functionCallHistory = [];

    mtCallbacks = [];
    comp.setState({
      show: true,
    });
    await waitSchedule();
    expect(mtCallbacks[0][1]).toMatchInlineSnapshot(`
      {
        "data": "{"patchList":[{"id":6,"snapshotPatch":[0,"__Card__:__snapshot_a94a8_test_4",3,4,3,[{"__ltf":"__lynx_timing_actual_fmp"}],0,null,4,3,4,0,1,1,3,4,null,1,-2,3,null]}]}",
        "patchOptions": {
          "pipelineOptions": {
            "dsl": "reactLynx",
            "needTimestamps": true,
            "pipelineID": "pipelineID",
            "pipelineOrigin": "updateTriggeredByBts",
            "stage": "update",
          },
          "reloadVersion": 0,
        },
      }
    `);

    globalEnvManager.switchToMainThread();
    rLynxChange(mtCallbacks[0][1]);
    expect(__root.__element_root).toMatchInlineSnapshot(`
      <page
        cssId="default-entry-from-native:0"
      >
        <view>
          <text
            __lynx_timing_flag="__lynx_timing_actual_fmp"
          >
            <raw-text
              text={1}
            />
          </text>
        </view>
      </page>
    `);

    expect(lynx.performance.__functionCallHistory).toMatchInlineSnapshot(`
      [
        [
          "_generatePipelineOptions",
        ],
        [
          "_onPipelineStart",
          "pipelineID",
          {
            "dsl": "reactLynx",
            "needTimestamps": true,
            "pipelineID": "pipelineID",
            "pipelineOrigin": "updateTriggeredByBts",
            "stage": "update",
          },
        ],
        [
          "_markTiming",
          "pipelineID",
          "diffVdomStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "diffVdomEnd",
        ],
        [
          "_markTiming",
          "pipelineID",
          "packChangesStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "packChangesEnd",
        ],
        [
          "_markTiming",
          "pipelineID",
          "mtsRenderStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "parseChangesStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "parseChangesEnd",
        ],
        [
          "_markTiming",
          "pipelineID",
          "patchChangesStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "patchChangesEnd",
        ],
        [
          "_markTiming",
          "pipelineID",
          "mtsRenderEnd",
        ],
      ]
    `);
  });

  it('with custom debounceRendering', async function() {
    let mtCallbacks = [];
    lynx.getNativeApp().callLepusMethod.mockImplementation((name, data, cb) => {
      mtCallbacks.push([name, data, cb]);
    });
    options.debounceRendering = setTimeout;

    let comp;
    class Comp extends Component {
      state = {
        show: false,
      };
      render() {
        comp = this;
        return (
          <view>
            {this.state.show && <text __lynx_timing_flag={'__lynx_timing_actual_fmp'}>{1}</text>}
          </view>
        );
      }
    }

    globalEnvManager.switchToMainThread();
    __root.__jsx = <Comp />;
    renderPage();
    expect(__root.__element_root).toMatchInlineSnapshot(`
      <page
        cssId="default-entry-from-native:0"
      >
        <view />
      </page>
    `);

    globalEnvManager.switchToBackground();
    render(<Comp />, __root);

    // LifecycleConstant.firstScreen
    lynxCoreInject.tt.OnLifecycleEvent(...globalThis.__OnLifecycleEvent.mock.calls[0]);
    lynx.performance.__functionCallHistory = [];

    mtCallbacks = [];
    comp.setState({
      show: true,
    });

    await waitSchedule();

    expect(lynx.performance.__functionCallHistory).toMatchInlineSnapshot(`
      [
        [
          "_generatePipelineOptions",
        ],
        [
          "_onPipelineStart",
          "pipelineID",
          {
            "dsl": "reactLynx",
            "needTimestamps": true,
            "pipelineID": "pipelineID",
            "pipelineOrigin": "updateTriggeredByBts",
            "stage": "update",
          },
        ],
        [
          "_markTiming",
          "pipelineID",
          "diffVdomStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "diffVdomEnd",
        ],
        [
          "_markTiming",
          "pipelineID",
          "packChangesStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "packChangesEnd",
        ],
      ]
    `);
    expect(mtCallbacks[0][1]).toMatchInlineSnapshot(`
      {
        "data": "{"patchList":[{"id":9,"snapshotPatch":[0,"__Card__:__snapshot_a94a8_test_6",3,4,3,[{"__ltf":"__lynx_timing_actual_fmp"}],0,null,4,3,4,0,1,1,3,4,null,1,-2,3,null]}]}",
        "patchOptions": {
          "pipelineOptions": {
            "dsl": "reactLynx",
            "needTimestamps": true,
            "pipelineID": "pipelineID",
            "pipelineOrigin": "updateTriggeredByBts",
            "stage": "update",
          },
          "reloadVersion": 0,
        },
      }
    `);

    globalEnvManager.switchToBackground();
  });

  it('in hydration', async function() {
    let mtCallbacks = [];
    lynx.getNativeApp().callLepusMethod.mockImplementation((name, data, cb) => {
      mtCallbacks.push([name, data, cb]);
    });

    let comp;
    class Comp extends Component {
      state = {
        show: false,
      };
      render() {
        comp = this;
        return (
          <view>
          </view>
        );
      }
    }

    globalEnvManager.switchToMainThread();
    __root.__jsx = <Comp />;
    renderPage();
    expect(__root.__element_root).toMatchInlineSnapshot(`
      <page
        cssId="default-entry-from-native:0"
      >
        <view />
      </page>
    `);
    lynx.performance.__functionCallHistory = [];

    globalEnvManager.switchToBackground();
    render(<Comp />, __root);

    mtCallbacks = [];
    // LifecycleConstant.firstScreen
    lynxCoreInject.tt.OnLifecycleEvent(...globalThis.__OnLifecycleEvent.mock.calls[0]);
    await waitSchedule();

    expect(lynx.performance.__functionCallHistory).toMatchInlineSnapshot(`
      [
        [
          "_generatePipelineOptions",
        ],
        [
          "_onPipelineStart",
          "pipelineID",
          {
            "dsl": "reactLynx",
            "needTimestamps": true,
            "pipelineID": "pipelineID",
            "pipelineOrigin": "reactLynxHydrate",
            "stage": "hydrate",
          },
        ],
        [
          "_bindPipelineIdWithTimingFlag",
          "pipelineID",
          "react_lynx_hydrate",
        ],
        [
          "_markTiming",
          "pipelineID",
          "hydrateParseSnapshotStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "hydrateParseSnapshotEnd",
        ],
        [
          "_markTiming",
          "pipelineID",
          "diffVdomStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "diffVdomEnd",
        ],
        [
          "_markTiming",
          "pipelineID",
          "packChangesStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "packChangesEnd",
        ],
      ]
    `);
    expect(mtCallbacks[0][1]).toMatchInlineSnapshot(`
      {
        "data": "{"patchList":[{"snapshotPatch":[],"id":11}]}",
        "patchOptions": {
          "isHydration": true,
          "pipelineOptions": {
            "dsl": "reactLynx",
            "needTimestamps": true,
            "pipelineID": "pipelineID",
            "pipelineOrigin": "reactLynxHydrate",
            "stage": "hydrate",
          },
          "reloadVersion": 0,
        },
      }
    `);

    globalEnvManager.switchToBackground();
  });

  it('should not record when other attributes updated', async function() {
    let mtCallbacks = [];
    lynx.getNativeApp().callLepusMethod.mockImplementation((name, data, cb) => {
      mtCallbacks.push([name, data, cb]);
    });

    let comp;
    class Comp extends Component {
      state = {
        xxx: 3,
      };
      render() {
        comp = this;
        return (
          <view>
            <text __lynx_timing_flag={'__lynx_timing_actual_fmp'} data-xxx={this.state.xxx}>{1}</text>
          </view>
        );
      }
    }

    globalEnvManager.switchToMainThread();
    __root.__jsx = <Comp />;
    renderPage();

    globalEnvManager.switchToBackground();
    render(<Comp />, __root);
    // LifecycleConstant.firstScreen
    lynxCoreInject.tt.OnLifecycleEvent(...globalThis.__OnLifecycleEvent.mock.calls[0]);
    lynx.performance.__functionCallHistory = [];

    // update xxx
    {
      mtCallbacks.length = 0;
      globalEnvManager.switchToBackground();
      comp.setState({
        xxx: 444,
      });
      await waitSchedule();

      expect(mtCallbacks[0][1]).toMatchInlineSnapshot(`
        {
          "data": "{"patchList":[{"id":14,"snapshotPatch":[3,-2,1,444]}]}",
          "patchOptions": {
            "pipelineOptions": {
              "dsl": "reactLynx",
              "needTimestamps": false,
              "pipelineID": "pipelineID",
              "pipelineOrigin": "updateTriggeredByBts",
              "stage": "update",
            },
            "reloadVersion": 0,
          },
        }
      `);

      expect(lynx.performance.__functionCallHistory).toMatchInlineSnapshot(`
        [
          [
            "_generatePipelineOptions",
          ],
          [
            "_onPipelineStart",
            "pipelineID",
            {
              "dsl": "reactLynx",
              "needTimestamps": false,
              "pipelineID": "pipelineID",
              "pipelineOrigin": "updateTriggeredByBts",
              "stage": "update",
            },
          ],
          [
            "_markTiming",
            "pipelineID",
            "diffVdomStart",
          ],
        ]
      `);
    }
  });

  it('should work on the first screen', async function() {
    class Comp extends Component {
      render() {
        return (
          <view>
            <text __lynx_timing_flag={'__lynx_timing_actual_fmp'}>{1}</text>
          </view>
        );
      }
    }

    globalEnvManager.switchToMainThread();
    __root.__jsx = <Comp />;
    renderPage();

    expect(__root.__element_root).toMatchInlineSnapshot(`
      <page
        cssId="default-entry-from-native:0"
      >
        <view>
          <text
            __lynx_timing_flag="__lynx_timing_actual_fmp"
          >
            <raw-text
              text={1}
            />
          </text>
        </view>
      </page>
    `);
  });

  it('should work on invalid value', async function() {
    class Comp extends Component {
      render() {
        return (
          <view>
            <text __lynx_timing_flag={undefined}></text>
            <text __lynx_timing_flag={null}></text>
            <text __lynx_timing_flag={true}>{1}</text>
            <text __lynx_timing_flag={123}>{1}</text>
            <text __lynx_timing_flag={{}}>{1}</text>
          </view>
        );
      }
    }

    globalEnvManager.switchToMainThread();
    __root.__jsx = <Comp />;
    renderPage();

    expect(__root.__element_root).toMatchInlineSnapshot(`
      <page
        cssId="default-entry-from-native:0"
      >
        <view>
          <text />
          <text />
          <text
            __lynx_timing_flag={true}
          >
            <raw-text
              text={1}
            />
          </text>
          <text
            __lynx_timing_flag={123}
          >
            <raw-text
              text={1}
            />
          </text>
          <text
            __lynx_timing_flag={{}}
          >
            <raw-text
              text={1}
            />
          </text>
        </view>
      </page>
    `);
  });

  it('should work in spread', async function() {
    let mtCallbacks = [];
    lynx.getNativeApp().callLepusMethod.mockImplementation((name, data, cb) => {
      mtCallbacks.push([name, data, cb]);
    });

    let comp;
    class Comp extends Component {
      state = {
        show: false,
        xxx: 333,
      };
      render() {
        comp = this;
        return (
          <view>
            {this.state.show && (
              <text xxx={this.state.xxx} {...{ __lynx_timing_flag: '__lynx_timing_actual_fmp' }}>{1}</text>
            )}
          </view>
        );
      }
    }

    globalEnvManager.switchToMainThread();
    __root.__jsx = <Comp />;
    renderPage();

    globalEnvManager.switchToBackground();
    render(<Comp />, __root);
    // LifecycleConstant.firstScreen
    lynxCoreInject.tt.OnLifecycleEvent(...globalThis.__OnLifecycleEvent.mock.calls[0]);
    lynx.performance.__functionCallHistory = [];

    {
      mtCallbacks = [];
      comp.setState({
        show: true,
      });
      await waitSchedule();
      expect(mtCallbacks[0][1]).toMatchInlineSnapshot(`
        {
          "data": "{"patchList":[{"id":17,"snapshotPatch":[0,"__Card__:__snapshot_a94a8_test_15",3,4,3,[{"xxx":333,"__lynx_timing_flag":"__lynx_timing_actual_fmp"}],0,null,4,3,4,0,1,1,3,4,null,1,-2,3,null]}]}",
          "patchOptions": {
            "pipelineOptions": {
              "dsl": "reactLynx",
              "needTimestamps": true,
              "pipelineID": "pipelineID",
              "pipelineOrigin": "updateTriggeredByBts",
              "stage": "update",
            },
            "reloadVersion": 0,
          },
        }
      `);

      globalEnvManager.switchToMainThread();
      rLynxChange(mtCallbacks[0][1]);
      expect(__root.__element_root).toMatchInlineSnapshot(`
        <page
          cssId="default-entry-from-native:0"
        >
          <view>
            <text
              __lynx_timing_flag="__lynx_timing_actual_fmp"
              xxx={333}
            >
              <raw-text
                text={1}
              />
            </text>
          </view>
        </page>
      `);

      expect(lynx.performance.__functionCallHistory).toMatchInlineSnapshot(`
      [
        [
          "_generatePipelineOptions",
        ],
        [
          "_onPipelineStart",
          "pipelineID",
          {
            "dsl": "reactLynx",
            "needTimestamps": true,
            "pipelineID": "pipelineID",
            "pipelineOrigin": "updateTriggeredByBts",
            "stage": "update",
          },
        ],
        [
          "_markTiming",
          "pipelineID",
          "diffVdomStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "diffVdomEnd",
        ],
        [
          "_markTiming",
          "pipelineID",
          "packChangesStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "packChangesEnd",
        ],
        [
          "_markTiming",
          "pipelineID",
          "mtsRenderStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "parseChangesStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "parseChangesEnd",
        ],
        [
          "_markTiming",
          "pipelineID",
          "patchChangesStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "patchChangesEnd",
        ],
        [
          "_markTiming",
          "pipelineID",
          "mtsRenderEnd",
        ],
      ]
    `);
    }

    {
      globalEnvManager.switchToBackground();
      lynx.performance.__functionCallHistory = [];
      mtCallbacks = [];
      comp.setState({
        xxx: 666,
      });
      await waitSchedule();
      expect(mtCallbacks[0][1]).toMatchInlineSnapshot(`
        {
          "data": "{"patchList":[{"id":18,"snapshotPatch":[3,3,0,{"xxx":666,"__lynx_timing_flag":"__lynx_timing_actual_fmp"}]}]}",
          "patchOptions": {
            "pipelineOptions": {
              "dsl": "reactLynx",
              "needTimestamps": false,
              "pipelineID": "pipelineID",
              "pipelineOrigin": "updateTriggeredByBts",
              "stage": "update",
            },
            "reloadVersion": 0,
          },
        }
      `);

      globalEnvManager.switchToMainThread();
      rLynxChange(mtCallbacks[0][1]);
      expect(__root.__element_root).toMatchInlineSnapshot(`
        <page
          cssId="default-entry-from-native:0"
        >
          <view>
            <text
              __lynx_timing_flag="__lynx_timing_actual_fmp"
              xxx={666}
            >
              <raw-text
                text={1}
              />
            </text>
          </view>
        </page>
      `);

      expect(lynx.performance.__functionCallHistory).toMatchInlineSnapshot(`
        [
          [
            "_generatePipelineOptions",
          ],
          [
            "_onPipelineStart",
            "pipelineID",
            {
              "dsl": "reactLynx",
              "needTimestamps": false,
              "pipelineID": "pipelineID",
              "pipelineOrigin": "updateTriggeredByBts",
              "stage": "update",
            },
          ],
          [
            "_markTiming",
            "pipelineID",
            "diffVdomStart",
          ],
        ]
      `);
    }
  });
});

describe('timing api compatibility', () => {
  it('basic', async function() {
    SystemInfo.lynxSdkVersion = '2.18';
    let mtCallbacks = [];
    lynx.getNativeApp().callLepusMethod.mockImplementation((name, data, cb) => {
      mtCallbacks.push([name, data, cb]);
    });

    let comp;
    class Comp extends Component {
      state = {
        show: false,
      };
      render() {
        comp = this;
        return (
          <view>
            {this.state.show && <text __lynx_timing_flag={'__lynx_timing_actual_fmp'}>{1}</text>}
          </view>
        );
      }
    }

    globalEnvManager.switchToMainThread();
    __root.__jsx = <Comp />;
    renderPage();
    globalEnvManager.switchToBackground();
    render(<Comp />, __root);
    // LifecycleConstant.firstScreen
    lynxCoreInject.tt.OnLifecycleEvent(...globalThis.__OnLifecycleEvent.mock.calls[0]);
    lynx.performance.__functionCallHistory = [];

    mtCallbacks = [];
    comp.setState({
      show: true,
    });
    await waitSchedule();
    globalEnvManager.switchToMainThread();
    rLynxChange(mtCallbacks[0][1]);

    expect(lynx.performance.__functionCallHistory).toMatchInlineSnapshot(`
      [
        [
          "_generatePipelineOptions",
        ],
        [
          "_onPipelineStart",
          "pipelineID",
        ],
        [
          "_markTiming",
          "pipelineID",
          "diffVdomStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "diffVdomEnd",
        ],
        [
          "_markTiming",
          "pipelineID",
          "packChangesStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "packChangesEnd",
        ],
        [
          "_markTiming",
          "pipelineID",
          "mtsRenderStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "parseChangesStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "parseChangesEnd",
        ],
        [
          "_markTiming",
          "pipelineID",
          "patchChangesStart",
        ],
        [
          "_markTiming",
          "pipelineID",
          "patchChangesEnd",
        ],
        [
          "_markTiming",
          "pipelineID",
          "mtsRenderEnd",
        ],
      ]
    `);
  });
});
