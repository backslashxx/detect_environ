#!/bin/sh

{
pwd
echo $PATH
printenv
echo $MODPATH
echo $MODDIR

} > $MODPATH/customize.txt

