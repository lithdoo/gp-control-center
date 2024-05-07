#!/user/bin/env bash

cd $(dirname $0)
cd ../server/
cargo build --release

mv ./target/release/control-center-server ../client/resources/server
rm -rf ./target

cd ../client
pnpm install --no-frozen-lockfile
pnpm run build:linux

