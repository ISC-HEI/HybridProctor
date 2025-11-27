# 2025-11-27 09:34:28 by RouterOS 7.19.6
# software id = XI8L-JHJW
#
# model = L009UiGS-2HaxD
# serial number = HG509KFNBYH
/container mounts
add dst=/mount_point name=mount src=/usb1/mount
add dst=/home/admin/upload name=uploads src=/usb1/uploads
/disk
set usb1 compress=no disabled=no media-interface=none media-sharing=no \
    mount-filesystem=yes !mount-point-template mount-read-only=no parent="" \
    slot=usb1 smb-sharing=no swap=no type=hardware
/interface bridge
add admin-mac=D4:01:C3:30:B1:44 ageing-time=5m arp=enabled arp-timeout=auto \
    auto-mac=no comment=defconf dhcp-snooping=no disabled=no fast-forward=yes \
    forward-delay=15s igmp-snooping=no max-learned-entries=auto \
    max-message-age=20s mtu=auto mvrp=no name=bridge port-cost-mode=long \
    priority=0x8000 protocol-mode=rstp transmit-hold-count=6 vlan-filtering=\
    no
add ageing-time=5m arp=enabled arp-timeout=auto auto-mac=yes dhcp-snooping=no \
    disabled=no fast-forward=yes forward-delay=15s igmp-snooping=no \
    max-learned-entries=auto max-message-age=20s mtu=auto mvrp=no name=\
    bridge-wifi port-cost-mode=long priority=0x8000 protocol-mode=rstp \
    transmit-hold-count=6 vlan-filtering=no
add ageing-time=5m arp=enabled arp-timeout=auto auto-mac=yes dhcp-snooping=no \
    disabled=no fast-forward=yes forward-delay=15s igmp-snooping=no \
    max-learned-entries=auto max-message-age=20s mtu=auto mvrp=no name=\
    dockers port-cost-mode=long priority=0x8000 protocol-mode=rstp \
    transmit-hold-count=6 vlan-filtering=no
/interface ethernet
set [ find default-name=ether1 ] advertise="10M-baseT-half,10M-baseT-full,100M\
    -baseT-half,100M-baseT-full,1G-baseT-half,1G-baseT-full" arp=enabled \
    arp-timeout=auto auto-negotiation=yes bandwidth=unlimited/unlimited \
    disabled=no l2mtu=1600 loop-protect=default loop-protect-disable-time=5m \
    loop-protect-send-interval=5s mac-address=D4:01:C3:30:B1:43 mtu=1500 \
    name=ether1 orig-mac-address=D4:01:C3:30:B1:43 rx-flow-control=off \
    tx-flow-control=off
set [ find default-name=ether2 ] advertise="10M-baseT-half,10M-baseT-full,100M\
    -baseT-half,100M-baseT-full,1G-baseT-half,1G-baseT-full" arp=enabled \
    arp-timeout=auto auto-negotiation=yes bandwidth=unlimited/unlimited \
    disabled=no l2mtu=1596 loop-protect=default loop-protect-disable-time=5m \
    loop-protect-send-interval=5s mac-address=D4:01:C3:30:B1:44 mtu=1500 \
    name=ether2 orig-mac-address=D4:01:C3:30:B1:44 rx-flow-control=off \
    tx-flow-control=off
set [ find default-name=ether3 ] advertise="10M-baseT-half,10M-baseT-full,100M\
    -baseT-half,100M-baseT-full,1G-baseT-half,1G-baseT-full" arp=enabled \
    arp-timeout=auto auto-negotiation=yes bandwidth=unlimited/unlimited \
    disabled=no l2mtu=1596 loop-protect=default loop-protect-disable-time=5m \
    loop-protect-send-interval=5s mac-address=D4:01:C3:30:B1:45 mtu=1500 \
    name=ether3 orig-mac-address=D4:01:C3:30:B1:45 rx-flow-control=off \
    tx-flow-control=off
set [ find default-name=ether4 ] advertise="10M-baseT-half,10M-baseT-full,100M\
    -baseT-half,100M-baseT-full,1G-baseT-half,1G-baseT-full" arp=enabled \
    arp-timeout=auto auto-negotiation=yes bandwidth=unlimited/unlimited \
    disabled=no l2mtu=1596 loop-protect=default loop-protect-disable-time=5m \
    loop-protect-send-interval=5s mac-address=D4:01:C3:30:B1:46 mtu=1500 \
    name=ether4 orig-mac-address=D4:01:C3:30:B1:46 rx-flow-control=off \
    tx-flow-control=off
set [ find default-name=ether5 ] advertise="10M-baseT-half,10M-baseT-full,100M\
    -baseT-half,100M-baseT-full,1G-baseT-half,1G-baseT-full" arp=enabled \
    arp-timeout=auto auto-negotiation=yes bandwidth=unlimited/unlimited \
    disabled=no l2mtu=1596 loop-protect=default loop-protect-disable-time=5m \
    loop-protect-send-interval=5s mac-address=D4:01:C3:30:B1:47 mtu=1500 \
    name=ether5 orig-mac-address=D4:01:C3:30:B1:47 rx-flow-control=off \
    tx-flow-control=off
set [ find default-name=ether6 ] advertise="10M-baseT-half,10M-baseT-full,100M\
    -baseT-half,100M-baseT-full,1G-baseT-half,1G-baseT-full" arp=enabled \
    arp-timeout=auto auto-negotiation=yes bandwidth=unlimited/unlimited \
    disabled=no l2mtu=1596 loop-protect=default loop-protect-disable-time=5m \
    loop-protect-send-interval=5s mac-address=D4:01:C3:30:B1:48 mtu=1500 \
    name=ether6 orig-mac-address=D4:01:C3:30:B1:48 rx-flow-control=off \
    tx-flow-control=off
set [ find default-name=ether7 ] advertise="10M-baseT-half,10M-baseT-full,100M\
    -baseT-half,100M-baseT-full,1G-baseT-half,1G-baseT-full" arp=enabled \
    arp-timeout=auto auto-negotiation=yes bandwidth=unlimited/unlimited \
    disabled=no l2mtu=1596 loop-protect=default loop-protect-disable-time=5m \
    loop-protect-send-interval=5s mac-address=D4:01:C3:30:B1:49 mtu=1500 \
    name=ether7 orig-mac-address=D4:01:C3:30:B1:49 rx-flow-control=off \
    tx-flow-control=off
set [ find default-name=ether8 ] advertise="10M-baseT-half,10M-baseT-full,100M\
    -baseT-half,100M-baseT-full,1G-baseT-half,1G-baseT-full" arp=enabled \
    arp-timeout=auto auto-negotiation=yes bandwidth=unlimited/unlimited \
    disabled=no l2mtu=1596 loop-protect=default loop-protect-disable-time=5m \
    loop-protect-send-interval=5s mac-address=D4:01:C3:30:B1:4A mtu=1500 \
    name=ether8 orig-mac-address=D4:01:C3:30:B1:4A poe-out=off poe-priority=\
    10 power-cycle-interval=none !power-cycle-ping-address \
    power-cycle-ping-enabled=no !power-cycle-ping-timeout rx-flow-control=off \
    tx-flow-control=off
set [ find default-name=sfp1 ] advertise="10M-baseT-half,10M-baseT-full,100M-b\
    aseT-half,100M-baseT-full,1G-baseT-half,1G-baseT-full,1G-baseX,2.5G-baseT,\
    2.5G-baseX" arp=enabled arp-timeout=auto auto-negotiation=yes bandwidth=\
    unlimited/unlimited disabled=no l2mtu=1596 loop-protect=default \
    loop-protect-disable-time=5m loop-protect-send-interval=5s mac-address=\
    D4:01:C3:30:B1:4B mtu=1500 name=sfp1 orig-mac-address=D4:01:C3:30:B1:4B \
    rx-flow-control=off sfp-ignore-rx-los=no sfp-rate-select=high \
    sfp-shutdown-temperature=95C tx-flow-control=off
/interface wifi
set [ find default-name=wifi1 ] arp-timeout=auto channel.band=2ghz-ax \
    .skip-dfs-channels=10min-cac .width=20/40mhz configuration.country=\
    Switzerland .mode=ap .ssid=ISC_Exam datapath.client-isolation=yes \
    disabled=no l2mtu=1560 mac-address=D4:01:C3:30:B1:4C name=wifi1 \
    radio-mac=D4:01:C3:30:B1:4C security.authentication-types=\
    wpa2-psk,wpa3-psk .ft=yes .ft-over-ds=yes
/queue interface
set bridge queue=no-queue
set bridge-wifi queue=no-queue
set dockers queue=no-queue
/interface veth
add address=172.17.0.2/24 disabled=no gateway=172.17.0.1 gateway6="" name=\
    veth1
/queue interface
set veth1 queue=no-queue
/interface ethernet switch
set 0 cpu-flow-control=yes mirror-egress-target=none name=switch1
/interface ethernet switch port
set 0 !egress-rate !ingress-rate mirror-egress=no mirror-ingress=no \
    mirror-ingress-target=none
set 1 !egress-rate !ingress-rate mirror-egress=no mirror-ingress=no \
    mirror-ingress-target=none
set 2 !egress-rate !ingress-rate mirror-egress=no mirror-ingress=no \
    mirror-ingress-target=none
set 3 !egress-rate !ingress-rate mirror-egress=no mirror-ingress=no \
    mirror-ingress-target=none
set 4 !egress-rate !ingress-rate mirror-egress=no mirror-ingress=no \
    mirror-ingress-target=none
set 5 !egress-rate !ingress-rate mirror-egress=no mirror-ingress=no \
    mirror-ingress-target=none
set 6 !egress-rate !ingress-rate mirror-egress=no mirror-ingress=no \
    mirror-ingress-target=none
set 7 !egress-rate !ingress-rate mirror-egress=no mirror-ingress=no \
    mirror-ingress-target=none
set 8 !egress-rate !ingress-rate mirror-egress=no mirror-ingress=no \
    mirror-ingress-target=none
/interface ethernet switch port-isolation
set 0 !forwarding-override
set 1 !forwarding-override
set 2 !forwarding-override
set 3 !forwarding-override
set 4 !forwarding-override
set 5 !forwarding-override
set 6 !forwarding-override
set 7 !forwarding-override
set 8 !forwarding-override
/interface list
set [ find name=all ] comment="contains all interfaces" exclude="" include="" \
    name=all
set [ find name=none ] comment="contains no interfaces" exclude="" include="" \
    name=none
set [ find name=dynamic ] comment="contains dynamic interfaces" exclude="" \
    include="" name=dynamic
set [ find name=static ] comment="contains static interfaces" exclude="" \
    include="" name=static
add comment=defconf exclude="" include="" name=WAN
add comment=defconf exclude="" include="" name=LAN
/interface lte apn
set [ find default=yes ] add-default-route=yes apn=internet authentication=\
    none default-route-distance=2 ip-type=auto name=default use-network-apn=\
    yes use-peer-dns=yes
/interface macsec profile
set [ find default-name=default ] name=default server-priority=10
/ip dhcp-client option
set clientid_duid code=61 name=clientid_duid value="0xff\$(CLIENT_DUID)"
set clientid code=61 name=clientid value="0x01\$(CLIENT_MAC)"
set hostname code=12 name=hostname value="\$(HOSTNAME)"
/ip hotspot profile
set [ find default=yes ] dns-name="" hotspot-address=0.0.0.0 html-directory=\
    hotspot html-directory-override="" http-cookie-lifetime=3d http-proxy=\
    0.0.0.0:0 install-hotspot-queue=no login-by=cookie,http-chap name=default \
    smtp-server=0.0.0.0 split-user-domain=no use-radius=no
/ip hotspot user profile
set [ find default=yes ] add-mac-cookie=yes address-list="" idle-timeout=none \
    !insert-queue-before keepalive-timeout=2m mac-cookie-timeout=3d name=\
    default !parent-queue !queue-type shared-users=1 status-autorefresh=1m \
    transparent-proxy=no
/ip ipsec mode-config
set [ find default=yes ] name=request-only responder=no use-responder-dns=\
    exclusively
/ip ipsec policy group
set [ find default=yes ] name=default
/ip ipsec profile
set [ find default=yes ] dh-group=modp2048,modp1024 dpd-interval=8s \
    dpd-maximum-failures=4 enc-algorithm=aes-128,3des hash-algorithm=sha1 \
    lifetime=1d name=default nat-traversal=yes proposal-check=obey
/ip ipsec proposal
set [ find default=yes ] auth-algorithms=sha1 disabled=no enc-algorithms=\
    aes-256-cbc,aes-192-cbc,aes-128-cbc lifetime=30m name=default pfs-group=\
    modp1024
/ip pool
add name=default-dhcp ranges=192.168.88.10-192.168.88.254
add name=dhcp ranges=10.0.0.10-10.0.0.254
add name=pool0 ranges=10.0.0.10-10.0.0.100
add name=wifi-pool ranges=192.168.89.10-192.168.89.254
/ip dhcp-server
add address-lists="" address-pool=default-dhcp disabled=no interface=bridge \
    lease-script="" lease-time=30m name=defconf use-radius=no \
    use-reconfigure=no
add address-lists="" address-pool=pool0 disabled=yes interface=ether1 \
    lease-script="" lease-time=30m name=dhcp1 server-address=10.0.0.1 \
    use-radius=no use-reconfigure=no
add address-lists="" address-pool=wifi-pool disabled=no interface=bridge-wifi \
    lease-script="" lease-time=6h name=wifi-dhcp use-radius=no \
    use-reconfigure=no
/ip smb users
set [ find default=yes ] disabled=no name=guest read-only=yes
/port
set 0 baud-rate=115200 data-bits=8 flow-control=none name=serial0 parity=none \
    stop-bits=1
/ppp profile
set *0 address-list="" !bridge !bridge-horizon bridge-learning=default \
    !bridge-path-cost !bridge-port-priority !bridge-port-trusted \
    !bridge-port-vid change-tcp-mss=yes !dns-server !idle-timeout \
    !incoming-filter !insert-queue-before !interface-list !local-address \
    name=default on-down="" on-up="" only-one=default !outgoing-filter \
    !parent-queue !queue-type !rate-limit !remote-address !session-timeout \
    use-compression=default use-encryption=default use-ipv6=yes use-mpls=\
    default use-upnp=default !wins-server
set *FFFFFFFE address-list="" !bridge !bridge-horizon bridge-learning=default \
    !bridge-path-cost !bridge-port-priority !bridge-port-trusted \
    !bridge-port-vid change-tcp-mss=yes !dns-server !idle-timeout \
    !incoming-filter !insert-queue-before !interface-list !local-address \
    name=default-encryption on-down="" on-up="" only-one=default \
    !outgoing-filter !parent-queue !queue-type !rate-limit !remote-address \
    !session-timeout use-compression=default use-encryption=yes use-ipv6=yes \
    use-mpls=default use-upnp=default !wins-server
/queue type
set 0 kind=pfifo name=default pfifo-limit=50
set 1 kind=pfifo name=ethernet-default pfifo-limit=50
set 2 kind=sfq name=wireless-default sfq-allot=1514 sfq-perturb=5
set 3 kind=red name=synchronous-default red-avg-packet=1000 red-burst=20 \
    red-limit=60 red-max-threshold=50 red-min-threshold=10
set 4 kind=sfq name=hotspot-default sfq-allot=1514 sfq-perturb=5
set 5 kind=pcq name=pcq-upload-default pcq-burst-rate=0 pcq-burst-threshold=0 \
    pcq-burst-time=10s pcq-classifier=src-address pcq-dst-address-mask=32 \
    pcq-dst-address6-mask=128 pcq-limit=50KiB pcq-rate=0 \
    pcq-src-address-mask=32 pcq-src-address6-mask=128 pcq-total-limit=2000KiB
set 6 kind=pcq name=pcq-download-default pcq-burst-rate=0 \
    pcq-burst-threshold=0 pcq-burst-time=10s pcq-classifier=dst-address \
    pcq-dst-address-mask=32 pcq-dst-address6-mask=128 pcq-limit=50KiB \
    pcq-rate=0 pcq-src-address-mask=32 pcq-src-address6-mask=128 \
    pcq-total-limit=2000KiB
set 7 kind=none name=only-hardware-queue
set 8 kind=mq-pfifo mq-pfifo-limit=50 name=multi-queue-ethernet-default
set 9 kind=pfifo name=default-small pfifo-limit=10
/queue interface
set ether1 queue=only-hardware-queue
set ether2 queue=only-hardware-queue
set ether3 queue=only-hardware-queue
set ether4 queue=only-hardware-queue
set ether5 queue=only-hardware-queue
set ether6 queue=only-hardware-queue
set ether7 queue=only-hardware-queue
set ether8 queue=only-hardware-queue
set sfp1 queue=only-hardware-queue
set wifi1 queue=wireless-default
/routing bgp template
set default as=65530 name=default
/snmp community
set [ find default=yes ] addresses=::/0 authentication-protocol=MD5 disabled=\
    no encryption-protocol=DES name=public read-access=yes security=none \
    write-access=no
/system logging action
set 0 memory-lines=1000 memory-stop-on-full=no name=memory target=memory
set 1 disk-file-count=2 disk-file-name=log disk-lines-per-file=1000 \
    disk-stop-on-full=no name=disk target=disk
set 2 name=echo remember=yes target=echo
set 3 name=remote remote=0.0.0.0 remote-log-format=default remote-port=514 \
    remote-protocol=udp src-address=0.0.0.0 syslog-facility=daemon \
    syslog-severity=auto syslog-time-format=bsd-syslog target=remote vrf=main
/user group
set read name=read policy="local,telnet,ssh,reboot,read,test,winbox,password,w\
    eb,sniff,sensitive,api,romon,rest-api,!ftp,!write,!policy" skin=default
set write name=write policy="local,telnet,ssh,reboot,read,write,test,winbox,pa\
    ssword,web,sniff,sensitive,api,romon,rest-api,!ftp,!policy" skin=default
set full name=full policy="local,telnet,ssh,ftp,reboot,read,write,policy,test,\
    winbox,password,web,sniff,sensitive,api,romon,rest-api" skin=default
/certificate settings
set builtin-trust-anchors=not-trusted crl-download=no crl-store=ram crl-use=\
    no
/console settings
set log-script-errors=yes sanitize-names=no
/container config
set layer-dir="" ram-high=0 registry-url=https://registry-1.docker.io tmpdir=\
    usb1/pull username=""
/disk settings
set auto-media-interface=bridge auto-media-sharing=yes auto-smb-sharing=yes \
    auto-smb-user=guest default-mount-point-template="[slot]"
/ip smb
set comment=MikrotikSMB domain=MSHOME enabled=auto interfaces=all
/interface bridge port
add auto-isolate=no bpdu-guard=no bridge=bridge broadcast-flood=yes comment=\
    defconf disabled=no edge=auto fast-leave=no frame-types=admit-all \
    horizon=none hw=yes ingress-filtering=yes interface=ether2 \
    !internal-path-cost learn=auto multicast-router=temporary-query \
    mvrp-applicant-state=normal-participant mvrp-registrar-state=normal \
    !path-cost point-to-point=auto priority=0x80 pvid=1 restricted-role=no \
    restricted-tcn=no tag-stacking=no trusted=no unknown-multicast-flood=yes \
    unknown-unicast-flood=yes
add auto-isolate=no bpdu-guard=no bridge=bridge broadcast-flood=yes comment=\
    defconf disabled=no edge=auto fast-leave=no frame-types=admit-all \
    horizon=none hw=yes ingress-filtering=yes interface=ether3 \
    !internal-path-cost learn=auto multicast-router=temporary-query \
    mvrp-applicant-state=normal-participant mvrp-registrar-state=normal \
    !path-cost point-to-point=auto priority=0x80 pvid=1 restricted-role=no \
    restricted-tcn=no tag-stacking=no trusted=no unknown-multicast-flood=yes \
    unknown-unicast-flood=yes
add auto-isolate=no bpdu-guard=no bridge=bridge broadcast-flood=yes comment=\
    defconf disabled=no edge=auto fast-leave=no frame-types=admit-all \
    horizon=none hw=yes ingress-filtering=yes interface=ether4 \
    !internal-path-cost learn=auto multicast-router=temporary-query \
    mvrp-applicant-state=normal-participant mvrp-registrar-state=normal \
    !path-cost point-to-point=auto priority=0x80 pvid=1 restricted-role=no \
    restricted-tcn=no tag-stacking=no trusted=no unknown-multicast-flood=yes \
    unknown-unicast-flood=yes
add auto-isolate=no bpdu-guard=no bridge=bridge broadcast-flood=yes comment=\
    defconf disabled=no edge=auto fast-leave=no frame-types=admit-all \
    horizon=none hw=yes ingress-filtering=yes interface=ether5 \
    !internal-path-cost learn=auto multicast-router=temporary-query \
    mvrp-applicant-state=normal-participant mvrp-registrar-state=normal \
    !path-cost point-to-point=auto priority=0x80 pvid=1 restricted-role=no \
    restricted-tcn=no tag-stacking=no trusted=no unknown-multicast-flood=yes \
    unknown-unicast-flood=yes
add auto-isolate=no bpdu-guard=no bridge=bridge broadcast-flood=yes comment=\
    defconf disabled=no edge=auto fast-leave=no frame-types=admit-all \
    horizon=none hw=yes ingress-filtering=yes interface=ether6 \
    !internal-path-cost learn=auto multicast-router=temporary-query \
    mvrp-applicant-state=normal-participant mvrp-registrar-state=normal \
    !path-cost point-to-point=auto priority=0x80 pvid=1 restricted-role=no \
    restricted-tcn=no tag-stacking=no trusted=no unknown-multicast-flood=yes \
    unknown-unicast-flood=yes
add auto-isolate=no bpdu-guard=no bridge=bridge broadcast-flood=yes comment=\
    defconf disabled=no edge=auto fast-leave=no frame-types=admit-all \
    horizon=none hw=yes ingress-filtering=yes interface=ether7 \
    !internal-path-cost learn=auto multicast-router=temporary-query \
    mvrp-applicant-state=normal-participant mvrp-registrar-state=normal \
    !path-cost point-to-point=auto priority=0x80 pvid=1 restricted-role=no \
    restricted-tcn=no tag-stacking=no trusted=no unknown-multicast-flood=yes \
    unknown-unicast-flood=yes
add auto-isolate=no bpdu-guard=no bridge=bridge broadcast-flood=yes comment=\
    defconf disabled=no edge=auto fast-leave=no frame-types=admit-all \
    horizon=none hw=yes ingress-filtering=yes interface=ether8 \
    !internal-path-cost learn=auto multicast-router=temporary-query \
    mvrp-applicant-state=normal-participant mvrp-registrar-state=normal \
    !path-cost point-to-point=auto priority=0x80 pvid=1 restricted-role=no \
    restricted-tcn=no tag-stacking=no trusted=no unknown-multicast-flood=yes \
    unknown-unicast-flood=yes
add auto-isolate=no bpdu-guard=no bridge=bridge broadcast-flood=yes comment=\
    defconf disabled=no edge=auto fast-leave=no frame-types=admit-all \
    horizon=none hw=yes ingress-filtering=yes interface=sfp1 \
    !internal-path-cost learn=auto multicast-router=temporary-query \
    mvrp-applicant-state=normal-participant mvrp-registrar-state=normal \
    !path-cost point-to-point=auto priority=0x80 pvid=1 restricted-role=no \
    restricted-tcn=no tag-stacking=no trusted=no unknown-multicast-flood=yes \
    unknown-unicast-flood=yes
add auto-isolate=no bpdu-guard=no bridge=dockers broadcast-flood=yes \
    disabled=no edge=auto fast-leave=no frame-types=admit-all horizon=none \
    ingress-filtering=yes interface=veth1 !internal-path-cost learn=auto \
    multicast-router=temporary-query mvrp-applicant-state=normal-participant \
    mvrp-registrar-state=normal !path-cost point-to-point=auto priority=0x80 \
    pvid=1 restricted-role=no restricted-tcn=no tag-stacking=no trusted=no \
    unknown-multicast-flood=yes unknown-unicast-flood=yes
add auto-isolate=no bpdu-guard=no bridge=bridge-wifi broadcast-flood=yes \
    disabled=no edge=auto fast-leave=no frame-types=admit-all horizon=none \
    ingress-filtering=yes interface=wifi1 !internal-path-cost learn=auto \
    multicast-router=temporary-query mvrp-applicant-state=normal-participant \
    mvrp-registrar-state=normal !path-cost point-to-point=auto priority=0x80 \
    pvid=1 restricted-role=no restricted-tcn=no tag-stacking=no trusted=no \
    unknown-multicast-flood=yes unknown-unicast-flood=yes
/interface bridge settings
set allow-fast-path=yes use-ip-firewall=no use-ip-firewall-for-pppoe=no \
    use-ip-firewall-for-vlan=no
/ip firewall connection tracking
set enabled=auto generic-timeout=10m icmp-timeout=10s loose-tcp-tracking=yes \
    tcp-close-timeout=10s tcp-close-wait-timeout=10s tcp-established-timeout=\
    1d tcp-fin-wait-timeout=10s tcp-last-ack-timeout=10s \
    tcp-max-retrans-timeout=5m tcp-syn-received-timeout=5s \
    tcp-syn-sent-timeout=5s tcp-time-wait-timeout=10s tcp-unacked-timeout=5m \
    udp-stream-timeout=3m udp-timeout=30s
/ip neighbor discovery-settings
set discover-interface-list=LAN discover-interval=30s lldp-mac-phy-config=no \
    lldp-max-frame-size=no lldp-med-net-policy-vlan=disabled lldp-poe-power=\
    yes lldp-vlan-info=no mode=tx-and-rx protocol=cdp,lldp,mndp
/ip settings
set accept-redirects=no accept-source-route=no allow-fast-path=yes \
    arp-timeout=30s icmp-errors-use-inbound-interface-address=no \
    icmp-rate-limit=10 icmp-rate-mask=0x1818 ip-forward=yes \
    ipv4-multipath-hash-policy=l3 max-neighbor-entries=14336 rp-filter=no \
    secure-redirects=yes send-redirects=yes tcp-syncookies=no tcp-timestamps=\
    random-offset
/ipv6 settings
set accept-redirects=yes-if-forwarding-disabled accept-router-advertisements=\
    yes-if-forwarding-disabled allow-fast-path=yes disable-ipv6=no \
    disable-link-local-address=no forward=yes max-neighbor-entries=7168 \
    min-neighbor-entries=1792 multipath-hash-policy=l3 \
    soft-max-neighbor-entries=3584 stale-neighbor-detect-interval=30 \
    stale-neighbor-timeout=60
/interface detect-internet
set detect-interface-list=none internet-interface-list=none \
    lan-interface-list=none wan-interface-list=none
/interface l2tp-server server
set accept-proto-version=all accept-pseudowire-type=all allow-fast-path=no \
    authentication=pap,chap,mschap1,mschap2 caller-id-type=ip-address \
    default-profile=default-encryption enabled=no keepalive-timeout=30 \
    l2tpv3-circuit-id="" l2tpv3-cookie-length=0 l2tpv3-digest-hash=md5 \
    !l2tpv3-ether-interface-list max-mru=1450 max-mtu=1450 max-sessions=\
    unlimited mrru=disabled one-session-per-host=no use-ipsec=no
/interface list member
add comment=defconf disabled=no interface=bridge list=LAN
add comment=defconf disabled=no interface=ether1 list=WAN
add disabled=no interface=dockers list=LAN
add disabled=no interface=bridge-wifi list=LAN
/interface lte settings
set esim-channel=auto firmware-path=firmware link-recovery-timer=120 mode=\
    auto
/interface pptp-server server
# PPTP connections are considered unsafe, it is suggested to use a more modern VPN protocol instead
set authentication=mschap1,mschap2 default-profile=default-encryption \
    enabled=no keepalive-timeout=30 max-mru=1450 max-mtu=1450 mrru=disabled
/interface sstp-server server
set authentication=pap,chap,mschap1,mschap2 certificate=none ciphers=\
    aes256-sha,aes256-gcm-sha384 default-profile=default enabled=no \
    keepalive-timeout=60 max-mru=1500 max-mtu=1500 mrru=disabled pfs=no port=\
    443 tls-version=any verify-client-certificate=no
/interface wifi cap
set enabled=no
/interface wifi capsman
set enabled=no
/ip address
add address=192.168.88.1/24 comment=defconf disabled=no interface=bridge \
    network=192.168.88.0
add address=172.17.0.1/24 disabled=no interface=dockers network=172.17.0.0
add address=10.0.0.1/24 disabled=no interface=bridge network=10.0.0.0
add address=192.168.89.1/24 disabled=no interface=bridge-wifi network=\
    192.168.89.0
/ip cloud
set back-to-home-vpn=revoked-and-disabled ddns-enabled=auto \
    ddns-update-interval=none update-time=yes
/ip cloud advanced
set use-local-address=no
/ip dhcp-client
add add-default-route=yes allow-reconfigure=no check-gateway=none comment=\
    defconf default-route-distance=1 default-route-tables=default \
    dhcp-options=hostname,clientid disabled=no interface=ether1 use-peer-dns=\
    yes use-peer-ntp=yes
/ip dhcp-server config
set accounting=yes interim-update=0s radius-password=empty store-leases-disk=\
    5m
/ip dhcp-server network
add address=10.0.0.0/24 caps-manager="" dhcp-option="" dns-none=yes domain=\
    isc gateway=10.0.0.1 !next-server ntp-server="" wins-server=""
add address=192.168.88.0/24 caps-manager="" comment=defconf dhcp-option="" \
    dns-server=192.168.88.1 gateway=192.168.88.1 !next-server ntp-server="" \
    wins-server=""
add address=192.168.89.0/24 caps-manager="" dhcp-option="" dns-server=\
    192.168.89.1 gateway=192.168.89.1 !next-server ntp-server="" wins-server=\
    ""
/ip dns
set address-list-extra-time=0s allow-remote-requests=yes cache-max-ttl=1w \
    cache-size=2048KiB doh-max-concurrent-queries=50 \
    doh-max-server-connections=5 doh-timeout=5s max-concurrent-queries=100 \
    max-concurrent-tcp-sessions=20 max-udp-packet-size=4096 \
    mdns-repeat-ifaces="" query-server-timeout=2s query-total-timeout=10s \
    servers="" use-doh-server="" verify-doh-cert=no vrf=main
/ip dns static
add address=192.168.88.1 comment=defconf disabled=no name=router.lan ttl=1d \
    type=A
add address=10.0.0.1 comment=defconf disabled=no name=router.lan ttl=1d type=\
    A
/ip firewall filter
add action=accept chain=input comment=\
    "defconf: accept established,related,untracked" !connection-bytes \
    !connection-limit !connection-mark !connection-nat-state !connection-rate \
    connection-state=established,related,untracked !connection-type !content \
    disabled=no !dscp !dst-address !dst-address-list !dst-address-type \
    !dst-limit !dst-port !fragment !hotspot !icmp-options !in-bridge-port \
    !in-bridge-port-list !in-interface !in-interface-list !ingress-priority \
    !ipsec-policy !ipv4-options !layer7-protocol !limit log=no log-prefix="" \
    !nth !out-bridge-port !out-bridge-port-list !out-interface \
    !out-interface-list !packet-mark !packet-size !per-connection-classifier \
    !port !priority !protocol !psd !random !routing-mark !src-address \
    !src-address-list !src-address-type !src-mac-address !src-port !tcp-flags \
    !tcp-mss !time !tls-host !ttl
add action=drop chain=input comment="defconf: drop invalid" !connection-bytes \
    !connection-limit !connection-mark !connection-nat-state !connection-rate \
    connection-state=invalid !connection-type !content disabled=no !dscp \
    !dst-address !dst-address-list !dst-address-type !dst-limit !dst-port \
    !fragment !hotspot !icmp-options !in-bridge-port !in-bridge-port-list \
    !in-interface !in-interface-list !ingress-priority !ipsec-policy \
    !ipv4-options !layer7-protocol !limit log=no log-prefix="" !nth \
    !out-bridge-port !out-bridge-port-list !out-interface !out-interface-list \
    !packet-mark !packet-size !per-connection-classifier !port !priority \
    !protocol !psd !random !routing-mark !src-address !src-address-list \
    !src-address-type !src-mac-address !src-port !tcp-flags !tcp-mss !time \
    !tls-host !ttl
add action=accept chain=input comment="defconf: accept ICMP" \
    !connection-bytes !connection-limit !connection-mark \
    !connection-nat-state !connection-rate !connection-state !connection-type \
    !content disabled=no !dscp !dst-address !dst-address-list \
    !dst-address-type !dst-limit !dst-port !fragment !hotspot !icmp-options \
    !in-bridge-port !in-bridge-port-list !in-interface !in-interface-list \
    !ingress-priority !ipsec-policy !ipv4-options !layer7-protocol !limit \
    log=no log-prefix="" !nth !out-bridge-port !out-bridge-port-list \
    !out-interface !out-interface-list !packet-mark !packet-size \
    !per-connection-classifier !port !priority protocol=icmp !psd !random \
    !routing-mark !src-address !src-address-list !src-address-type \
    !src-mac-address !src-port !tcp-flags !tcp-mss !time !tls-host !ttl
add action=accept chain=input comment=\
    "defconf: accept to local loopback (for CAPsMAN)" !connection-bytes \
    !connection-limit !connection-mark !connection-nat-state !connection-rate \
    !connection-state !connection-type !content disabled=no !dscp \
    dst-address=127.0.0.1 !dst-address-list !dst-address-type !dst-limit \
    !dst-port !fragment !hotspot !icmp-options !in-bridge-port \
    !in-bridge-port-list !in-interface !in-interface-list !ingress-priority \
    !ipsec-policy !ipv4-options !layer7-protocol !limit log=no log-prefix="" \
    !nth !out-bridge-port !out-bridge-port-list !out-interface \
    !out-interface-list !packet-mark !packet-size !per-connection-classifier \
    !port !priority !protocol !psd !random !routing-mark !src-address \
    !src-address-list !src-address-type !src-mac-address !src-port !tcp-flags \
    !tcp-mss !time !tls-host !ttl
add action=drop chain=input comment="defconf: drop all not coming from LAN" \
    !connection-bytes !connection-limit !connection-mark \
    !connection-nat-state !connection-rate !connection-state !connection-type \
    !content disabled=no !dscp !dst-address !dst-address-list \
    !dst-address-type !dst-limit !dst-port !fragment !hotspot !icmp-options \
    !in-bridge-port !in-bridge-port-list !in-interface in-interface-list=!LAN \
    !ingress-priority !ipsec-policy !ipv4-options !layer7-protocol !limit \
    log=no log-prefix="" !nth !out-bridge-port !out-bridge-port-list \
    !out-interface !out-interface-list !packet-mark !packet-size \
    !per-connection-classifier !port !priority !protocol !psd !random \
    !routing-mark !src-address !src-address-list !src-address-type \
    !src-mac-address !src-port !tcp-flags !tcp-mss !time !tls-host !ttl
add action=accept chain=forward comment="defconf: accept in ipsec policy" \
    !connection-bytes !connection-limit !connection-mark \
    !connection-nat-state !connection-rate !connection-state !connection-type \
    !content disabled=no !dscp !dst-address !dst-address-list \
    !dst-address-type !dst-limit !dst-port !fragment !hotspot !icmp-options \
    !in-bridge-port !in-bridge-port-list !in-interface !in-interface-list \
    !ingress-priority ipsec-policy=in,ipsec !ipv4-options !layer7-protocol \
    !limit log=no log-prefix="" !nth !out-bridge-port !out-bridge-port-list \
    !out-interface !out-interface-list !packet-mark !packet-size \
    !per-connection-classifier !port !priority !protocol !psd !random \
    !routing-mark !src-address !src-address-list !src-address-type \
    !src-mac-address !src-port !tcp-flags !tcp-mss !time !tls-host !ttl
add action=accept chain=forward comment="defconf: accept out ipsec policy" \
    ipsec-policy=out,ipsec
add action=fasttrack-connection chain=forward comment="defconf: fasttrack" \
    connection-state=established,related hw-offload=yes
add action=accept chain=forward comment=\
    "defconf: accept established,related, untracked" connection-state=\
    established,related,untracked
add action=drop chain=forward comment="defconf: drop invalid" \
    !connection-bytes !connection-limit !connection-mark \
    !connection-nat-state !connection-rate connection-state=invalid \
    !connection-type !content disabled=no !dscp !dst-address \
    !dst-address-list !dst-address-type !dst-limit !dst-port !fragment \
    !hotspot !icmp-options !in-bridge-port !in-bridge-port-list !in-interface \
    !in-interface-list !ingress-priority !ipsec-policy !ipv4-options \
    !layer7-protocol !limit log=no log-prefix="" !nth !out-bridge-port \
    !out-bridge-port-list !out-interface !out-interface-list !packet-mark \
    !packet-size !per-connection-classifier !port !priority !protocol !psd \
    !random !routing-mark !src-address !src-address-list !src-address-type \
    !src-mac-address !src-port !tcp-flags !tcp-mss !time !tls-host !ttl
add action=drop chain=forward comment=\
    "defconf: drop all from WAN not DSTNATed" !connection-bytes \
    !connection-limit !connection-mark connection-nat-state=!dstnat \
    !connection-rate connection-state=new !connection-type !content disabled=\
    no !dscp !dst-address !dst-address-list !dst-address-type !dst-limit \
    !dst-port !fragment !hotspot !icmp-options !in-bridge-port \
    !in-bridge-port-list !in-interface in-interface-list=WAN \
    !ingress-priority !ipsec-policy !ipv4-options !layer7-protocol !limit \
    log=no log-prefix="" !nth !out-bridge-port !out-bridge-port-list \
    !out-interface !out-interface-list !packet-mark !packet-size \
    !per-connection-classifier !port !priority !protocol !psd !random \
    !routing-mark !src-address !src-address-list !src-address-type \
    !src-mac-address !src-port !tcp-flags !tcp-mss !time !tls-host !ttl
add action=drop chain=forward !connection-bytes !connection-limit \
    !connection-mark !connection-nat-state !connection-rate !connection-state \
    !connection-type !content disabled=no !dscp dst-address=192.168.88.0/24 \
    !dst-address-list !dst-address-type !dst-limit !dst-port !fragment \
    !hotspot !icmp-options !in-bridge-port !in-bridge-port-list !in-interface \
    !in-interface-list !ingress-priority !ipsec-policy !ipv4-options \
    !layer7-protocol !limit log=no log-prefix="" !nth !out-bridge-port \
    !out-bridge-port-list !out-interface !out-interface-list !packet-mark \
    !packet-size !per-connection-classifier !port !priority !protocol !psd \
    !random !routing-mark src-address=192.168.89.0/24 !src-address-list \
    !src-address-type !src-mac-address !src-port !tcp-flags !tcp-mss !time \
    !tls-host !ttl
/ip firewall nat
add action=masquerade chain=srcnat comment="defconf: masquerade" \
    ipsec-policy=out,none out-interface-list=WAN !to-addresses !to-ports
add action=dst-nat chain=dstnat dst-port=8001 protocol=tcp to-addresses=\
    172.17.0.2 to-ports=8001
add action=dst-nat chain=dstnat dst-port=2222 protocol=tcp to-addresses=\
    172.17.0.2 to-ports=22
add action=dst-nat chain=dstnat dst-port=3000 protocol=tcp to-addresses=\
    172.17.0.2 to-ports=3000
add action=dst-nat chain=dstnat comment="Redirect HTTPS to proxy" \
    !connection-bytes !connection-limit !connection-mark !connection-rate \
    !connection-type !content disabled=no !dscp !dst-address \
    !dst-address-list !dst-address-type !dst-limit dst-port=443 !fragment \
    !hotspot !icmp-options !in-bridge-port !in-bridge-port-list !in-interface \
    !in-interface-list !ingress-priority !ipsec-policy !ipv4-options \
    !layer7-protocol !limit log=no log-prefix="" !nth !out-bridge-port \
    !out-bridge-port-list !out-interface !out-interface-list !packet-mark \
    !packet-size !per-connection-classifier !port !priority protocol=tcp !psd \
    !random !routing-mark src-address=192.168.89.0/24 !src-address-list \
    !src-address-type !src-mac-address !src-port !tcp-mss !time to-addresses=\
    10.0.0.1 to-ports=443 !ttl
add action=dst-nat chain=dstnat comment="Redirect HTTP to proxy" \
    !connection-bytes !connection-limit !connection-mark !connection-rate \
    !connection-type !content disabled=no !dscp !dst-address \
    !dst-address-list !dst-address-type !dst-limit dst-port=80 !fragment \
    !hotspot !icmp-options !in-bridge-port !in-bridge-port-list !in-interface \
    !in-interface-list !ingress-priority !ipsec-policy !ipv4-options \
    !layer7-protocol !limit log=no log-prefix="" !nth !out-bridge-port \
    !out-bridge-port-list !out-interface !out-interface-list !packet-mark \
    !packet-size !per-connection-classifier !port !priority protocol=tcp !psd \
    !random !routing-mark src-address=192.168.89.0/24 !src-address-list \
    !src-address-type !src-mac-address !src-port !tcp-mss !time to-addresses=\
    172.17.0.2 to-ports=80 !ttl
add action=dst-nat chain=dstnat comment="Accept 10.0.0.1" !connection-bytes \
    !connection-limit !connection-mark !connection-rate !connection-type \
    !content disabled=no !dscp dst-address=10.0.0.1 !dst-address-list \
    !dst-address-type !dst-limit !dst-port !fragment !hotspot !icmp-options \
    !in-bridge-port !in-bridge-port-list !in-interface !in-interface-list \
    !ingress-priority !ipsec-policy !ipv4-options !layer7-protocol !limit \
    log=no log-prefix="" !nth !out-bridge-port !out-bridge-port-list \
    !out-interface !out-interface-list !packet-mark !packet-size \
    !per-connection-classifier !port !priority protocol=tcp !psd !random \
    !routing-mark src-address=192.168.88.0/24 !src-address-list \
    !src-address-type !src-mac-address !src-port !tcp-mss !time to-addresses=\
    172.17.0.2 to-ports=80 !ttl
add action=dst-nat chain=dstnat comment="all here" !connection-bytes \
    !connection-limit !connection-mark !connection-rate !connection-type \
    !content disabled=no !dscp dst-address=192.168.90.1 !dst-address-list \
    !dst-address-type !dst-limit !dst-port !fragment !hotspot !icmp-options \
    !in-bridge-port !in-bridge-port-list !in-interface !in-interface-list \
    !ingress-priority !ipsec-policy !ipv4-options !layer7-protocol !limit \
    log=no log-prefix="" !nth !out-bridge-port !out-bridge-port-list \
    !out-interface !out-interface-list !packet-mark !packet-size \
    !per-connection-classifier !port !priority protocol=tcp !psd !random \
    !routing-mark !src-address !src-address-list !src-address-type \
    !src-mac-address !src-port !tcp-mss !time to-addresses=192.168.88.1 \
    !to-ports !ttl
/ip firewall service-port
set ftp disabled=no ports=21
set tftp disabled=no ports=69
set irc disabled=yes ports=6667
set h323 disabled=no
set sip disabled=no ports=5060,5061 sip-direct-media=yes sip-timeout=1h
set pptp disabled=no
set rtsp disabled=yes ports=554
set udplite disabled=no
set dccp disabled=no
set sctp disabled=no
/ip hotspot service-port
set ftp disabled=no ports=21
/ip hotspot user
set [ find default=yes ] comment="counters and limits for trial users" \
    disabled=no name=default-trial
/ip ipsec policy
set 0 disabled=no dst-address=::/0 group=default proposal=default protocol=\
    all src-address=::/0 template=yes
/ip ipsec settings
set accounting=yes interim-update=0s xauth-use-radius=no
/ip media settings
set thumbnails=""
/ip nat-pmp
set enabled=no
/ip proxy
set always-from-cache=no anonymous=no cache-administrator=webmaster \
    cache-hit-dscp=4 cache-on-disk=no cache-path=web-proxy enabled=no \
    max-cache-object-size=2048KiB max-cache-size=unlimited \
    max-client-connections=600 max-fresh-time=3d max-server-connections=600 \
    parent-proxy=:: parent-proxy-port=0 port=8080 serialize-connections=no \
    src-address=::
/ip service
set ftp address="" disabled=no max-sessions=20 port=21 vrf=main
set ssh address="" disabled=no max-sessions=20 port=22 vrf=main
set telnet address="" disabled=no max-sessions=20 port=23 vrf=main
set www-ssl address="" certificate=none disabled=yes max-sessions=20 port=443 \
    tls-version=any vrf=main
set www address="" disabled=no max-sessions=20 port=3131 vrf=main
set winbox address="" disabled=no max-sessions=20 port=8291 vrf=main
set api address="" disabled=no max-sessions=20 port=8728 vrf=main
set api-ssl address="" certificate=none disabled=no max-sessions=20 port=8729 \
    tls-version=any vrf=main
/ip smb shares
set [ find default=yes ] directory=pub disabled=yes invalid-users="" name=pub \
    read-only=no require-encryption=no valid-users=""
/ip socks
set auth-method=none connection-idle-timeout=2m enabled=no max-connections=\
    200 port=1080 version=4 vrf=main
/ip ssh
set always-allow-password-login=no ciphers=auto forwarding-enabled=no \
    host-key-size=2048 host-key-type=rsa strong-crypto=no
/ip tftp settings
set max-block-size=4096
/ip traffic-flow
set active-flow-timeout=30m cache-entries=128k enabled=no \
    inactive-flow-timeout=15s interfaces=all packet-sampling=no \
    sampling-interval=0 sampling-space=0
/ip traffic-flow ipfix
set bytes=yes dst-address=yes dst-address-mask=yes dst-mac-address=yes \
    dst-port=yes first-forwarded=yes gateway=yes icmp-code=yes icmp-type=yes \
    igmp-type=yes in-interface=yes ip-header-length=yes ip-total-length=yes \
    ipv6-flow-label=yes is-multicast=yes last-forwarded=yes nat-dst-address=\
    yes nat-dst-port=yes nat-events=no nat-src-address=yes nat-src-port=yes \
    out-interface=yes packets=yes protocol=yes src-address=yes \
    src-address-mask=yes src-mac-address=yes src-port=yes sys-init-time=yes \
    tcp-ack-num=yes tcp-flags=yes tcp-seq-num=yes tcp-window-size=yes tos=yes \
    ttl=yes udp-length=yes
/ip upnp
set allow-disable-external-interface=no enabled=no show-dummy-rule=yes
/ip upnp interfaces
add disabled=no !forced-ip interface=bridge type=internal
add disabled=no !forced-ip interface=ether1 type=external
/ipv6 firewall address-list
add address=::/128 comment="defconf: unspecified address" disabled=no \
    dynamic=no list=bad_ipv6
add address=::1/128 comment="defconf: lo" disabled=no dynamic=no list=\
    bad_ipv6
add address=fec0::/10 comment="defconf: site-local" disabled=no dynamic=no \
    list=bad_ipv6
add address=::ffff:0.0.0.0/96 comment="defconf: ipv4-mapped" disabled=no \
    dynamic=no list=bad_ipv6
add address=::/96 comment="defconf: ipv4 compat" disabled=no dynamic=no list=\
    bad_ipv6
add address=100::/64 comment="defconf: discard only " disabled=no dynamic=no \
    list=bad_ipv6
add address=2001:db8::/32 comment="defconf: documentation" disabled=no \
    dynamic=no list=bad_ipv6
add address=2001:10::/28 comment="defconf: ORCHID" disabled=no dynamic=no \
    list=bad_ipv6
add address=3ffe::/16 comment="defconf: 6bone" disabled=no dynamic=no list=\
    bad_ipv6
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
add action=fasttrack-connection chain=forward comment="defconf: fasttrack6" \
    connection-state=established,related
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
/ipv6 nd
set [ find default=yes ] advertise-dns=yes advertise-mac-address=yes \
    disabled=no hop-limit=unspecified interface=all \
    managed-address-configuration=no mtu=unspecified other-configuration=no \
    ra-delay=3s ra-interval=3m20s-10m ra-lifetime=30m ra-preference=medium \
    reachable-time=unspecified retransmit-interval=unspecified
/ipv6 nd prefix default
set autonomous=yes preferred-lifetime=1w valid-lifetime=4w2d
/mpls settings
set allow-fast-path=yes dynamic-label-range=16-1048575 propagate-ttl=yes
/ppp aaa
set accounting=yes enable-ipv6-accounting=no interim-update=0s \
    use-circuit-id-in-nas-port-id=no use-radius=no
/radius incoming
set accept=no port=3799 vrf=main
/routing igmp-proxy
set query-interval=2m5s query-response-interval=10s quick-leave=no
/routing settings
set single-process=no
/snmp
set contact="" enabled=no engine-id-suffix="" location="" src-address=:: \
    trap-community=public trap-generators=temp-exception trap-target="" \
    trap-version=1 vrf=main
/system clock
set time-zone-autodetect=yes time-zone-name=Europe/Zurich
/system clock manual
set dst-delta=+00:00 dst-end="1970-01-01 00:00:00" dst-start=\
    "1970-01-01 00:00:00" time-zone=+00:00
/system console
set [ find port=serial0 ] channel=0 disabled=no port=serial0 term=vt102
/system health settings
set cpu-overtemp-check=no cpu-overtemp-startup-delay=1m \
    cpu-overtemp-threshold=105C
/system identity
set name=MikroTik
/system leds
set 0 disabled=no interface=ether1 leds=ether1-yellow-led type=\
    interface-activity
set 1 disabled=no interface=ether1 leds=ether1-green-led type=\
    interface-speed-1G
/system leds settings
set all-leds-off=never
/system logging
set 0 action=memory disabled=no prefix="" regex="" topics=info
set 1 action=memory disabled=no prefix="" regex="" topics=error
set 2 action=memory disabled=no prefix="" regex="" topics=warning
set 3 action=echo disabled=no prefix="" regex="" topics=critical
add action=memory disabled=no prefix="" regex="" topics=wireless,debug
add action=memory disabled=no prefix="" regex="" topics=wireless,debug
/system note
set note="" show-at-cli-login=no show-at-login=yes
/system ntp client
set enabled=yes mode=unicast servers=0.ch.pool.ntp.org,1.ch.pool.ntp.org vrf=\
    main
/system ntp server
set auth-key=none broadcast=no broadcast-addresses="" enabled=no \
    local-clock-stratum=5 manycast=no multicast=no use-local-clock=no vrf=\
    main
/system ntp client servers
add address=0.ch.pool.ntp.org auth-key=none disabled=no iburst=yes max-poll=\
    10 min-poll=6
add address=1.ch.pool.ntp.org auth-key=none disabled=no iburst=yes max-poll=\
    10 min-poll=6
/system package local-update mirror
set check-interval=1d enabled=no primary-server=0.0.0.0 secondary-server=\
    0.0.0.0 user=""
/system resource irq
set 0 cpu=auto
set 1 cpu=auto
set 2 cpu=auto
set 3 cpu=auto
set 4 cpu=auto
set 5 cpu=auto
set 6 cpu=auto
set 7 cpu=auto
set 8 cpu=auto
set 9 cpu=auto
set 10 cpu=auto
set 11 cpu=auto
set 12 cpu=auto
set 13 cpu=auto
set 14 cpu=auto
set 15 cpu=auto
set 16 cpu=auto
set 17 cpu=auto
set 18 cpu=auto
set 19 cpu=auto
set 20 cpu=auto
set 21 cpu=auto
set 22 cpu=auto
set 23 cpu=auto
set 24 cpu=auto
set 25 cpu=auto
set 26 cpu=auto
set 27 cpu=auto
set 28 cpu=auto
set 29 cpu=auto
set 30 cpu=auto
set 31 cpu=auto
set 32 cpu=auto
set 33 cpu=auto
set 34 cpu=auto
set 35 cpu=auto
/system resource irq rps
set ether1 disabled=yes
set ether2 disabled=yes
set ether3 disabled=yes
set ether4 disabled=yes
set ether5 disabled=yes
set ether6 disabled=yes
set ether7 disabled=yes
set ether8 disabled=yes
set sfp1 disabled=yes
/system resource usb settings
set authorization=no
/system routerboard mode-button
set enabled=no hold-time=0s..1m on-event=""
/system routerboard reset-button
set enabled=no hold-time=0s..1m on-event=""
/system routerboard settings
set auto-upgrade=no baud-rate=115200 boot-delay=2s boot-device=\
    nand-if-fail-then-ethernet boot-protocol=bootp enable-jumper-reset=yes \
    enter-setup-on=delete-key force-backup-booter=no preboot-etherboot=\
    disabled preboot-etherboot-server=any protected-routerboot=disabled \
    reformat-hold-button=20s reformat-hold-button-max=10m silent-boot=no
/system watchdog
set auto-send-supout=no automatic-supout=yes ping-start-after-boot=5m \
    ping-timeout=1m watch-address=none watchdog-timer=yes
/tool bandwidth-server
set allocate-udp-ports-from=2000 allowed-addresses4="" allowed-addresses6="" \
    authenticate=yes enabled=yes max-sessions=100
/tool e-mail
set from=<> port=25 server=0.0.0.0 tls=no user="" vrf=main
/tool graphing
set page-refresh=300 store-every=5min
/tool mac-server
set allowed-interface-list=LAN
/tool mac-server mac-winbox
set allowed-interface-list=LAN
/tool mac-server ping
set enabled=yes
/tool romon
set enabled=no id=00:00:00:00:00:00
/tool romon port
set [ find default=yes ] cost=100 disabled=no forbid=no interface=all
/tool sms
set allowed-number="" channel=0 polling=no port=none receive-enabled=no \
    sms-storage=sim
/tool sniffer
set file-limit=1000KiB file-name="" filter-cpu="" filter-direction=any \
    filter-dst-ip-address="" filter-dst-ipv6-address="" \
    filter-dst-mac-address="" filter-dst-port="" filter-interface="" \
    filter-ip-address="" filter-ip-protocol="" filter-ipv6-address="" \
    filter-mac-address="" filter-mac-protocol="" \
    filter-operator-between-entries=or filter-port="" filter-size="" \
    filter-src-ip-address="" filter-src-ipv6-address="" \
    filter-src-mac-address="" filter-src-port="" filter-stream=no \
    filter-vlan="" max-packet-size=2048 memory-limit=100KiB memory-scroll=yes \
    only-headers=no quick-rows=20 quick-show-frame=no streaming-enabled=no \
    streaming-server=0.0.0.0:37008
/tool traffic-generator
set latency-distribution-max=100us measure-out-of-order=no \
    stats-samples-to-keep=100 test-id=0
/user aaa
set accounting=yes default-group=read exclude-groups="" interim-update=0s \
    use-radius=no
/user settings
set minimum-categories=0 minimum-password-length=0
