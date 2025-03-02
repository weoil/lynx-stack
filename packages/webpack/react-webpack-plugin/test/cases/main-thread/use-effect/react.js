import React from 'react';
import { useEffect } from 'react';
import { useEffect as useMyEffect } from 'react';

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
