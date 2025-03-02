// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
export interface UpdatePageOption {
  nativeUpdateDataOrder?: number;
  reloadTemplate?: boolean;
  reloadFromJS?: boolean;
  resetPageData?: boolean;
}
export type UpdatePageCallback = (data: any, options: UpdatePageOption) => any;
