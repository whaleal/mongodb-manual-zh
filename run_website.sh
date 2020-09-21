#!/bin/bash
loginfo() { echo "[INFO] $@"; }
logerror() { echo "[ERROR] $@" 1>&2; }

python3 src/init_gitbook.py versions
python3 src/script.py "home" "book"
rm -rf node_modules/gitbook-plugin-tbfed-pagefooter
gitbook install
python3 src/script.py "home" "powered"
python3 src/script.py "home" "gitalk"
gitbook build ./ _book
# python3 src/script.py "home" "index"

for version in $versions;do
    loginfo "==========================================================="
    loginfo "开始",  "版本编译"

    echo "cp book.json MongoDB-Manual-zh/${version}"
    cp book.json MongoDB-Manual-zh/${version}

    # 替换 book.json 的编辑地址
    echo "python3 src/script.py ${version} book"
    python3 src/script.py ${version} "book"

    echo "cp -r node_modules MongoDB-Manual-zh/${version}"
    rm -rf MongoDB-Manual-zh/${version}/node_modules
    cp -r node_modules MongoDB-Manual-zh/${version}

    echo "gitbook install MongoDB-Manual-zh/${version}"
    gitbook install MongoDB-Manual-zh/${version}

    echo "python3 src/script.py ${version} powered"
    python3 src/script.py ${version} "powered"

    echo "python3 src/script.py ${version} gitalk"
    python3 src/script.py ${version} "gitalk"

    echo "gitbook build MongoDB-Manual-zh/${version} _book/MongoDB-Manual-zh/${version}"
    gitbook build MongoDB-Manual-zh/${version} _book/MongoDB-Manual-zh/${version}


done

