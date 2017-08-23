echo hello

cd f:/git/ux

git log --pretty=format:"%h,%an,%ad,%s" --date=format:'%Y-%m-%d %H:%M:%S' -- "%1" > f:/gitlog/"%2"