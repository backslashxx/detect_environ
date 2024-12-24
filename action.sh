#!/bin/sh
# action.sh

# functions
dump_printenv() {
	echo "[%] dumping printenv"
	printenv > /data/adb/modules/detect_environ/action.txt
}

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
	dump_printenv
	sleep 10
fi

if [ "$KSU" = "true" ]; then
	echo "[+] root is KernelSU"
	echo "[+] $KSU_KERNEL_VER_CODE / $KSU_VER_CODE"
	[ "$KSU_MAGIC_MOUNT" = "true" ] && echo "[+] running in magic_mount mode" 
	dump_printenv
	sleep 10
fi

if [ -n "$MAGISKTMP" ]; then
	echo "[+] root is Magisk"
	echo "[+] $(/data/adb/magisk/magisk -V) "
	dump_printenv
fi
