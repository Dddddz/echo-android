#!/usr/bin/env bash

now_dir=`pwd`
cd `dirname $0`
cd ..

npm run android
cd ${now_dir}
