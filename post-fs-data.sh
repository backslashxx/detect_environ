#!/bin/sh

{
pwd
echo $PATH
printenv
echo $MODPATH
echo $MODDIR

} > /data/adb/modules/detect_environ/post-fs-data.txt

