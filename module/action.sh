#!/bin/sh
# action.sh

# loading scren demos
# https://github.com/tiann/KernelSU/pull/2307 
# now live on ksu and ksu-next
if [ "$MMRL" = "true" ] || { [ "$KSU" = "true" ] && [ "$KSU_VER_CODE" -ge 11998 ]; } \
        || { [ "$KSU_NEXT" = "true" ] && [ "$KSU_VER_CODE" -ge 12144 ]; }; then
        loops=20
        while [ $loops -gt 1 ];  do 
		for i in '[-]' '[/]' '[|]' '[\]'; do 
		        echo "$i"
		        sleep 0.1
		        clear
		        loops=$((loops - 1)) 
		done
        done
else
	# bindhosts illusion func
	loops=20
	while [ $loops -gt 1 ] ; do
		echo '[.]'
		sleep 0.1
		loops=$((loops - 1))
	done
fi
echo "[+] loading screen demo done!" 

# account multiple root
manager_daemon_count=0
[ -f /data/adb/ap/bin/apd ] && manager_daemon_count=$((manager_daemon_count + 1))
[ -f /data/adb/ksu/bin/ksud ] && manager_daemon_count=$((manager_daemon_count + 1))
[ -f /data/adb/magisk/magisk ] && manager_daemon_count=$((manager_daemon_count + 1))

if [ $manager_daemon_count -gt 1 ]; then
        echo "[!] multiple root?"
fi

# echo mmrl 
if [ -n "$MMRL" ]; then
        echo "[+] running inside MMRL"
fi

if [ "$APATCH" = "true" ]; then
        echo "[+] root is APatch "
        echo "[+] $APATCH_VER / $APATCH_VER_CODE"
        [ "$APATCH_BIND_MOUNT" = "true" ] && echo "[+] running in bind_mount mode" 
fi

if [ "$KSU" = "true" ]; then
        echo "[+] root is KernelSU"
        echo "[+] $KSU_KERNEL_VER_CODE / $KSU_VER_CODE"
        [ "$KSU_MAGIC_MOUNT" = "true" ] && echo "[+] running in magic_mount mode" 
fi

if [ -n "$MAGISKTMP" ]; then
        echo "[+] root is Magisk"
        echo "[+] $(/data/adb/magisk/magisk -V) "
fi

echo "[%] dumping printenv"
printenv | tee /data/adb/modules/detect_environ/action.txt

# APatch and KernelSU needs this
if [ -z "$MMRL" ] && { [ "$KSU" = "true" ] || [ "$APATCH" = "true" ]; }; then
	sleep 5
fi
