// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
export default async function showQRCode(
  url: string,
): Promise<void> {
  const [
    { log },
    { default: color },
    { default: QRCode },
  ] = await Promise.all([
    import('@clack/prompts'),
    import('picocolors'),
    import('qrcode-terminal'),
  ])

  const qrcode = await new Promise<string>((resolve) => {
    QRCode.generate(url, { small: true }, resolve)
  })

  log.info(color.green('Scan with Lynx'))
  log.success(qrcode)
  log.success(url)
}
