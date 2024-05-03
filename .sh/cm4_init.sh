

# wifi connect

sudo nmcli dev

sudo nmcli r wifi on

sudo nmcli dev wifi

sudo nmcli dev wifi connect "xixihaha_5G" password "tempcode"

# install zerotier


curl -s https://install.zerotier.com/ | sudo bash

zerotier-cli join b15644912e1af62e

wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# clone gp-control-center

apt update

git clone https://github.com/lithdoo/gp-control-center

cd ./gp-control-center

# install node

bash ./.sh/install_nvm.sh

nvm use 20

npm install pnpm -g


# install electron-builder libs

pnpm install

sudo apt install -y ubuntu-dev-tools snapd ruby-full

gem install fpm -v 1.15.1

sudo ln -s /usr/bin/fpm/fpm.ruby2.5 /usr/bin/fpm

export USE_SYSTEM_FPM="true"

sudo snap install snapcraft --channel=7.x/stable --classic

export SNAP_DESTRUCTIVE_MODE="true"

# build arm package

pnpm run build:linux


# apt install -y git curl openssh-server snapd

# sudo apt-get install  rpm libarchive-tools libffi-dev  ruby-full rpm libopenjp2-tools

# gem install fpm -v 1.15.1

# sudo ln -s /usr/bin/fpm/fpm.ruby2.5 /usr/bin/fpm

# export USE_SYSTEM_FPM="true"
# export LD_LIBRARY_PATH=/usr/local/lib
 
 