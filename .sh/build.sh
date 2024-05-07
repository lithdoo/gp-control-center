#!/bin/sh

cd $(dirname $0)
cd ../server/
cargo build --release

mv ./target/release/control-center-server ../resources/server
rm -rf ./target

cd ../
pnpm install --no-frozen-lockfile
pnpm run build:linux

