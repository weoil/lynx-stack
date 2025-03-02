import React from '@lynx-js/react';
import { useEffect } from '@lynx-js/react';
import { useEffect as useMyEffect } from '@lynx-js/react';

export default function App() {
  useEffect(() => {
    console.info('This should not exist in main-thread');
  }, []);

  useMyEffect(() => {
    // TODO: import alias is not removed
  });

  React.useEffect(() => {
    // TODO: default import is not removed
  });
}
