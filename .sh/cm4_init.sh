apt update

apt install -y git curl openssh-server snapd

curl -s https://install.zerotier.com/ | sudo bash

zerotier-cli join b15644912e1af62e

snap install snapcraft --channel=7.x/stable --classic

wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

git clone https://github.com/lithdoo/gp-control-center

cd ./gp-control-center

bash ./install_nvm.sh

nvm use 20

npm install pnpm -g

pnpm install

sudo apt-get install -y ubuntu-dev-tools rpm libarchive-tools libffi-dev  ruby-full rpm libopenjp2-tools

gem install fpm -v 1.15.1

sudo ln -s /usr/bin/fpm/fpm.ruby2.5 /usr/bin/fpm

export USE_SYSTEM_FPM="true"
export SNAP_DESTRUCTIVE_MODE="true"
export LD_LIBRARY_PATH=/usr/local/lib

pnpm run build:linux