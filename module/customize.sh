#!/bin/sh

{
pwd
echo $PATH
printenv
echo $MODPATH
echo $MODDIR

} > $MODPATH/customize.txt

# action.sh
# ap 10927 
# ksu 11981
if { [ "$KSU" = "true" ] && [ "$KSU_VER_CODE" -lt 11981 ]; } || 
	{ [ "$APATCH" = "true" ] && [ "$APATCH_VER_CODE" -lt 10927 ]; }; then
	echo "old manager - no action.sh support"
	rm $MODPATH/action.sh
fi
