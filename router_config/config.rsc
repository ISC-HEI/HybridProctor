# 2024-05-31 14:18:27 by RouterOS 7.14.1
# software id = JJ1A-EPSF
#
# model = L009UiGS-2HaxD
# serial number = HF3099M4VG6
/container mounts
add dst=/mount_point name=mount src=/usb1/mount
add dst=/home/admin/upload name=uploads src=/usb1/uploads
/interface bridge
add admin-mac=78:9A:18:62:EF:4C auto-mac=no comment=defconf name=bridge \
    port-cost-mode=short
add name=dockers
/interface wifi
set [ find default-name=wifi1 ] configuration.country=Switzerland .mode=ap \
    .ssid=ISC_Exam datapath.client-isolation=yes disabled=no
/interface veth
add address=172.17.0.2/24 gateway=172.17.0.1 gateway6="" name=veth1
/interface list
add comment=defconf name=WAN
add comment=defconf name=LAN
/ip pool
add name=dhcp ranges=10.0.0.10-10.0.0.254
add name=pool0 ranges=10.0.0.10-10.0.0.100
/ip dhcp-server
add add-arp=yes address-pool=dhcp always-broadcast=yes authoritative=\
    after-2sec-delay bootp-support=none conflict-detection=no interface=\
    bridge lease-time=10m name=defconf
/port
set 0 name=serial0
/container
add interface=veth1 mounts=mount,uploads root-dir=usb1/hybridProctorContainer \
    start-on-boot=yes workdir=/app
/container config
set registry-url=https://registry-1.docker.io tmpdir=usb1/pull
/interface bridge port
add bridge=bridge comment=defconf interface=ether2
add bridge=bridge comment=defconf interface=ether3
add bridge=bridge comment=defconf interface=ether4
add bridge=bridge comment=defconf interface=ether5
add bridge=bridge comment=defconf interface=ether6
add bridge=bridge comment=defconf interface=ether7
add bridge=bridge comment=defconf interface=ether8
add bridge=bridge comment=defconf interface=sfp1
add bridge=bridge comment=defconf interface=*2
add bridge=dockers interface=veth1
add bridge=bridge interface=wifi1
/ip neighbor discovery-settings
set discover-interface-list=LAN
/interface list member
add comment=defconf interface=bridge list=LAN
add comment=defconf interface=ether1 list=WAN
/ip address
add address=192.168.88.1/24 comment=defconf interface=bridge network=\
    192.168.88.0
add address=172.17.0.1/24 interface=dockers network=172.17.0.0
add address=10.0.0.1/24 interface=bridge network=10.0.0.0
/ip dhcp-client
add comment=defconf interface=ether1
/ip dhcp-server
add address-pool=pool0 disabled=yes interface=*2 name=dhcp1 server-address=\
    10.0.0.1
/ip dhcp-server network
add address=10.0.0.0/24 dns-none=yes domain=isc gateway=10.0.0.1
/ip dns
set allow-remote-requests=yes
/ip dns static
add address=10.0.0.1 comment=defconf name=router.lan
/ip firewall filter
add action=accept chain=input comment=\
    "defconf: accept established,related,untracked" connection-state=\
    established,related,untracked
add action=drop chain=input comment="defconf: drop invalid" connection-state=\
    invalid
add action=accept chain=input comment="defconf: accept ICMP" protocol=icmp
add action=accept chain=input comment=\
    "defconf: accept to local loopback (for CAPsMAN)" dst-address=127.0.0.1
add action=drop chain=input comment="defconf: drop all not coming from LAN" \
    in-interface-list=!LAN
add action=accept chain=forward comment="defconf: accept in ipsec policy" \
    ipsec-policy=in,ipsec
add action=accept chain=forward comment="defconf: accept out ipsec policy" \
    ipsec-policy=out,ipsec
add action=fasttrack-connection chain=forward comment="defconf: fasttrack" \
    connection-state=established,related hw-offload=yes
add action=accept chain=forward comment=\
    "defconf: accept established,related, untracked" connection-state=\
    established,related,untracked
add action=drop chain=forward comment="defconf: drop invalid" \
    connection-state=invalid
add action=drop chain=forward comment=\
    "defconf: drop all from WAN not DSTNATed" connection-nat-state=!dstnat \
    connection-state=new in-interface-list=WAN
/ip firewall nat
add action=masquerade chain=srcnat comment="defconf: masquerade" disabled=yes \
    ipsec-policy=out,none out-interface-list=WAN
add action=dst-nat chain=dstnat dst-port=8001 protocol=tcp to-addresses=\
    172.17.0.2 to-ports=8001
add action=dst-nat chain=dstnat dst-port=2222 protocol=tcp to-addresses=\
    172.17.0.2 to-ports=22
add action=dst-nat chain=dstnat dst-port=3000 protocol=tcp to-addresses=\
    172.17.0.2 to-ports=3000
add action=dst-nat chain=dstnat dst-port=80 protocol=tcp to-addresses=\
    172.17.0.2 to-ports=80
/ip upnp interfaces
add interface=bridge type=internal
add interface=ether1 type=external
/ipv6 firewall address-list
add address=::/128 comment="defconf: unspecified address" list=bad_ipv6
add address=::1/128 comment="defconf: lo" list=bad_ipv6
add address=fec0::/10 comment="defconf: site-local" list=bad_ipv6
add address=::ffff:0.0.0.0/96 comment="defconf: ipv4-mapped" list=bad_ipv6
add address=::/96 comment="defconf: ipv4 compat" list=bad_ipv6
add address=100::/64 comment="defconf: discard only " list=bad_ipv6
add address=2001:db8::/32 comment="defconf: documentation" list=bad_ipv6
add address=2001:10::/28 comment="defconf: ORCHID" list=bad_ipv6
add address=3ffe::/16 comment="defconf: 6bone" list=bad_ipv6
/ipv6 firewall filter
add action=accept chain=input comment=\
    "defconf: accept established,related,untracked" connection-state=\
    established,related,untracked
add action=drop chain=input comment="defconf: drop invalid" connection-state=\
    invalid
add action=accept chain=input comment="defconf: accept ICMPv6" protocol=\
    icmpv6
add action=accept chain=input comment="defconf: accept UDP traceroute" \
    dst-port=33434-33534 protocol=udp
add action=accept chain=input comment=\
    "defconf: accept DHCPv6-Client prefix delegation." dst-port=546 protocol=\
    udp src-address=fe80::/10
add action=accept chain=input comment="defconf: accept IKE" dst-port=500,4500 \
    protocol=udp
add action=accept chain=input comment="defconf: accept ipsec AH" protocol=\
    ipsec-ah
add action=accept chain=input comment="defconf: accept ipsec ESP" protocol=\
    ipsec-esp
add action=accept chain=input comment=\
    "defconf: accept all that matches ipsec policy" ipsec-policy=in,ipsec
add action=drop chain=input comment=\
    "defconf: drop everything else not coming from LAN" in-interface-list=\
    !LAN
add action=accept chain=forward comment=\
    "defconf: accept established,related,untracked" connection-state=\
    established,related,untracked
add action=drop chain=forward comment="defconf: drop invalid" \
    connection-state=invalid
add action=drop chain=forward comment=\
    "defconf: drop packets with bad src ipv6" src-address-list=bad_ipv6
add action=drop chain=forward comment=\
    "defconf: drop packets with bad dst ipv6" dst-address-list=bad_ipv6
add action=drop chain=forward comment="defconf: rfc4890 drop hop-limit=1" \
    hop-limit=equal:1 protocol=icmpv6
add action=accept chain=forward comment="defconf: accept ICMPv6" protocol=\
    icmpv6
add action=accept chain=forward comment="defconf: accept HIP" protocol=139
add action=accept chain=forward comment="defconf: accept IKE" dst-port=\
    500,4500 protocol=udp
add action=accept chain=forward comment="defconf: accept ipsec AH" protocol=\
    ipsec-ah
add action=accept chain=forward comment="defconf: accept ipsec ESP" protocol=\
    ipsec-esp
add action=accept chain=forward comment=\
    "defconf: accept all that matches ipsec policy" ipsec-policy=in,ipsec
add action=drop chain=forward comment=\
    "defconf: drop everything else not coming from LAN" in-interface-list=\
    !LAN
/system clock
set time-zone-name=Europe/Zurich
/system logging
add topics=wireless,debug
add topics=wireless,debug
/system note
set note="HybridProctor,14.5.2024\r\
    \n- WiFI can be accessed with a mac or pc, corrected\r\
    \n- Config backup" show-at-cli-login=yes
/system ntp client
set enabled=yes
/system ntp client servers
add address=0.ch.pool.ntp.org
add address=1.ch.pool.ntp.org
/system routerboard settings
set enter-setup-on=delete-key
/tool mac-server
set allowed-interface-list=LAN
/tool mac-server mac-winbox
set allowed-interface-list=LAN
