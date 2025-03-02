use std::env;

extern crate napi_build;

fn main() {
  napi_build::setup();

  if env::var("CARGO_CFG_TARGET_OS").unwrap() == "linux" {
    println!("cargo:rustc-link-arg=-Wl,--unresolved-symbols=ignore-all");
  }
}
