COLOR='\033[0;36m'

if [ -f "$PWD/packages/toolbox/cert/private.key" ]; then
  echo "${COLOR} ---------------------------------${NC}"
  echo "${COLOR}|  skipping private key creation  |${NC}"
  echo "${COLOR} ---------------------------------${NC}"
else
  echo "${COLOR} ------------------------${NC}"
  echo "${COLOR}|  generate private key  |${NC}"
  echo "${COLOR} ------------------------${NC}"
  mkdir $PWD/packages/toolbox/cert
  openssl genpkey -algorithm RSA -aes256 -out $PWD/packages/toolbox/cert/private.key
fi

if [ -f "$PWD/packages/toolbox/cert/public.pem" ]; then
  echo "${COLOR} ---------------------------------${NC}"
  echo "${COLOR}|  skipping public key creation  |${NC}"
  echo "${COLOR} ---------------------------------${NC}"
else
  echo "${COLOR} -----------------------${NC}"
  echo "${COLOR}|  generate public key  |${NC}"
  echo "${COLOR} -----------------------${NC}"
  openssl rsa -in $PWD/packages/toolbox/cert/private.key -pubout -outform PEM -out $PWD/packages/toolbox/cert/public.pem
fi

which -s brew
if [[ $? != 0 ]] ; then
  echo "${COLOR} -----------------------${NC}"
  echo "${COLOR}|  installing homebrew  |${NC}"
  echo "${COLOR} -----------------------${NC}"
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
else
  echo "${COLOR} ---------------------${NC}"
  echo "${COLOR}|  updating homebrew  |${NC}"
  echo "${COLOR} ---------------------${NC}"
  brew update
fi

if [ -e ~/.zshrc ]; then
  echo "${COLOR} ----------------${NC}"
  echo "${COLOR}|  skipping zsh  |${NC}"
  echo "${COLOR} ----------------${NC}"
else
  echo "${COLOR} ------------------${NC}"
  echo "${COLOR}|  installing zsh  |${NC}"
  echo "${COLOR} ------------------${NC}"
  brew install zsh
  chsh -s /usr/local/bin/zsh
  echo "${COLOR} ---------------------${NC}"
  echo "${COLOR}|  install oh-my-zsh  |${NC}"
  echo "${COLOR} ---------------------${NC}"
  sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
  git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
  git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

  sed -i '' 's/plugins=(git)/plugins=(git zsh-autosuggestions docker docker-compose zsh-syntax-highlighting)\
ZSH_DISABLE_COMPFIX=true/' ~/.zshrc
  source ~/.zshrc
fi

if [ -e ~/.volta ]; then
  echo "${COLOR} ------------------${NC}"
  echo "${COLOR}|  skipping volta  |${NC}"
  echo "${COLOR} ------------------${NC}"
else
  echo "${COLOR} --------------------${NC}"
  echo "${COLOR}|  installing volta  |${NC}"
  echo "${COLOR} --------------------${NC}"
  curl https://get.volta.sh | bash
  source ~/.zshrc
  volta install node@latest
fi

if [ -e ~/.pnpm-state.json ]; then
  echo "${COLOR} -----------------${NC}"
  echo "${COLOR}|  skipping pnpm  |${NC}"
  echo "${COLOR} -----------------${NC}"
else
  echo "${COLOR} -------------------${NC}"
  echo "${COLOR}|  installing pnpm  |${NC}"
  echo "${COLOR} -------------------${NC}"
  volta install pnpm
  echo 'alias p="pnpm"' >> ~/.zshrc
  echo 'alias pr="pnpm run"' >> ~/.zshrc
  source ~/.zshrc
fi

echo "${COLOR} ---------------------------${NC}"
echo "${COLOR}|  installing dependenceis  |${NC}"
echo "${COLOR} ---------------------------${NC}"
pnpm install

echo "${COLOR} --------------------------${NC}"
echo "${COLOR}|  pulling mongo & consul  |${NC}"
echo "${COLOR} --------------------------${NC}"
docker network create mono-pnpm-temple-network
pnpm run run:all

echo "${COLOR} ----------------------${NC}"
echo "${COLOR}|  createing database  |${NC}"
echo "${COLOR} ----------------------${NC}"
sleep 5 && pnpm run create:database