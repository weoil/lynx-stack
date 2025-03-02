export function a0(): React.ReactNode {
  a2('*a0*');
  return <view></view>;
}

function A1() {
  return <view>{'*a1*'}</view>;
}

export function a2(foo: string) {
  return (
    <view className={foo}>
      <A1 bar={'*a2*'} />
    </view>
  );
}
