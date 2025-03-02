export function a2() {
  const log = (v) => {
    return v;
  };

  const log1 = () => {
    'background only';
    log('log with background only');
  };

  log1();

  const log2 = () => {
    log('log without background only');
  };

  log2();

  const log3 = () => {
    'use lepus only';
    log('log with main-thread only');
  };

  log3();

  const log4 = () => {
    log('log without main-thread only');
  };

  log4();

  return (
    <view>
      <text>
        hello world
      </text>
    </view>
  );
}
