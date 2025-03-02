export default {
  dev: {
    watchFiles: [
      { paths: 'foo.js', type: 'reload-server' },
      { paths: ['bar.js', 'baz.js'], type: 'reload-server' },
      { paths: ['should-not-exist'] },
    ]
  }
}
