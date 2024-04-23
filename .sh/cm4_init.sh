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

pnpm run build:linux