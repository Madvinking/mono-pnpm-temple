COLOR='\033[0;36m'

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


if [ ! -e $HOME/firicico-font ]; then
  git clone https://github.com/kosimst/Firicico.git $HOME/firicico-font
  open $HOME/firicico-font/Firicico.ttf
fi


if [ ! -e ~/.zshrc ]; then
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

aws --v
if [[ $? != 0 ]] ; then
  echo "${COLOR} -----------------------${NC}"
  echo "${COLOR}|  installing aws-cli   |${NC}"
  echo "${COLOR} -----------------------${NC}"
  brew install awscli
  echo 'alias aws-ecr="aws ecr get-login-password --region us-east-1 | docker login -u AWS --password-stdin 277411487094.dkr.ecr.us-east-1.amazonaws.com"' >> ~/.zshrc
fi

kubectl version
if [[ $? != 0 ]] ; then
  echo "${COLOR} -----------------------${NC}"
  echo "${COLOR}|  installing kubectl   |${NC}"
  echo "${COLOR} -----------------------${NC}"
  brew install kubectl
  echo 'alias k="kubectl"' >> ~/.zshrc
  echo 'alias k-app="k get pods -n application"' >> ~/.zshrc
  echo 'alias k-log="k logs --follow -n application"' >> ~/.zshrc
  echo 'k-exec() { k exec --stdin --tty -n application $1 -- /bin/bash }' >> ~/.zshrc
fi

helm version
if [[ $? != 0 ]] ; then
  echo "${COLOR} --------------------${NC}"
  echo "${COLOR}|  installing helm   |${NC}"
  echo "${COLOR} --------------------${NC}"
  brew install helm
fi


if [ ! -d '/Applications/iTerm.app' -a ! -d "$HOME/Applications/iTerm.app" ]; then
  echo "${COLOR} ----------------------${NC}"
  echo "${COLOR}|  installing iterm2   |${NC}"
  echo "${COLOR} ----------------------${NC}"
  brew install --cask iterm2
fi

if [ ! -d '/Applications/iTerm.app' -a ! -d "$HOME/Applications/iTerm.app" ]; then
  echo "${COLOR} ----------------------${NC}"
  echo "${COLOR}|  installing iterm2   |${NC}"
  echo "${COLOR} ----------------------${NC}"
  brew install --cask iterm2
fi


if [ ! -d '/Applications/Alfred\ 4.app' -a ! -d "$HOME/Applications/Alfred\ 4.app" ]; then
  echo "${COLOR} -------------------------------${NC}"
  echo "${COLOR}|  installing  mongodb-compass  |${NC}"
  echo "${COLOR} -------------------------------${NC}"
  brew install --cask alfred
fi

docker -v
if [[ $? != 0 ]] ; then
  echo "${COLOR} ----------------------${NC}"
  echo "${COLOR}|  installing docker   |${NC}"
  echo "${COLOR} ----------------------${NC}"
  brew install --cask  docker
fi

ngrok -v
if [[ $? != 0 ]] ; then
  echo "${COLOR} -----------------${NC}"
  echo "${COLOR}|  install ngrok  |${NC}"
  echo "${COLOR} -----------------${NC}"
  brew install --cask ngrok
fi

if [ ! -e ~/.volta ]; then
  echo "${COLOR} --------------------${NC}"
  echo "${COLOR}|  installing volta  |${NC}"
  echo "${COLOR} --------------------${NC}"
  curl https://get.volta.sh | bash
  source ~/.zshrc
  volta install node@latest
fi


if [ ! -e ~/.pnpm-state.json ]; then
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

echo "${COLOR} ------------------${NC}"
echo "${COLOR}|  createing .env  |${NC}"
echo "${COLOR} ------------------${NC}"
touch ../.env

brew install --cask visual-studio-code
code --install-extension abusaidm.html-snippets
code --install-extension arcanis.vscode-zipfs
code --install-extension atlassian.atlascode
code --install-extension buster.ndjson-colorizer
code --install-extension ChakrounAnas.turbo-console-log
code --install-extension chris-noring.node-snippets
code --install-extension christian-kohler.path-intellisense
code --install-extension chrmarti.regex
code --install-extension CoenraadS.bracket-pair-colorizer
code --install-extension cssho.vscode-svgviewer
code --install-extension dbaeumer.vscode-eslint
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension eamodio.gitlens
code --install-extension formulahendry.auto-close-tag
code --install-extension formulahendry.auto-rename-tag
code --install-extension GitHub.vscode-pull-request-github
code --install-extension GraphQL.vscode-graphql
code --install-extension hediet.vscode-drawio
code --install-extension huangbaoshan.console-logger
code --install-extension humao.rest-client
code --install-extension johnpapa.vscode-peacock
code --install-extension mikestead.dotenv
code --install-extension mohsen1.prettify-json
code --install-extension ms-azuretools.vscode-docker
code --install-extension ms-kubernetes-tools.vscode-kubernetes-tools
code --install-extension ms-python.python
code --install-extension ms-python.vscode-pylance
code --install-extension ms-toolsai.jupyter
code --install-extension ms-vscode.vscode-js-profile-flame
code --install-extension Netzer.monday-vscode-extension
code --install-extension Orta.vscode-jest
code --install-extension PKief.material-icon-theme
code --install-extension redhat.vscode-commons
code --install-extension redhat.vscode-yaml
code --install-extension sleistner.vscode-fileutils
code --install-extension streetsidesoftware.code-spell-checker
code --install-extension svelte.svelte-vscode
code --install-extension WallabyJs.quokka-vscode
code --install-extension wix.vscode-import-cost
code --install-extension xabikos.JavaScriptSnippets
code --install-extension yzhang.markdown-all-in-one
code --install-extension zhuangtongfa.material-theme
code --install-extension zhuangtongfa.One-dark-pro
