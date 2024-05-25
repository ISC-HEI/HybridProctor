# HybridProctor project

Plug and play solution to deploy exam and collect student's answers via a Mikrotic router.
Profs just need to plug a USB key containing the exam instructions to the router, it will serve the exams on a webpage.
Students will connect to the router via wifi to access the instructions and download the source material for the exam.

At the end, students can submit their work via the webpage, which will be stored on the USB key, ready for the prof. to download using SFTP.

## User guide

1. Plug USB key in router and power up the later (don't forget to plug in the antenna!).
1. Connect to it via wifi (**password: toto_1234**).
1. Connect to router via sftp to adapt the config for your exam. 

    ```bash
    sftp -P 2222 admin@10.0.0.1
    ```
    Here's what you can change:
    - The *statement of your exam*, replace **/mount_point/html/exam.html**.
    - The *ressources* to be downloaded by the students, put them in **/mount_point/html/resources**. Delete the content of the directory if you don't have any.
    - Optionally: The *list of files the students have to submit*. You can list these files in  **/mount_point/html/config.yml**, or disable the option.

    Please, don't delete or modify any other files in **/mount_point/html/**.

1. Go to [10.0.0.1]() and check if your exam/resources are really there and if everything is working.
1. Students can then connect to router wifi and do the exam.
1. Once finished, to access uploaded files, connect via sftp again. The files should be present in **/home/admin/uploads**. 

## Install guide (to setup another router..)

You will need a Mikrotik router and a USB key with an ext4 partition.

1. Power up router (don't forget to plug in the antenna!). Connect to your PC via ethernet cable.
2. Install and start winBox, you should see your device listed.
3. Login to it with the admin pwd written on the bottom of your device (**admin/WBJ6PZ033W**), now it should be **admin/toto1234**.
4. (Optional) Install latest version of routerOS, you will need routerOS > V7.5 to be able to run containers. This can be done from inside WinBox.
5. Install the container.npk. Download the all_package zip corresponding to your hardware architecture and software version (check with */system/resource/print*), extract and drop the container.npk into winBox and restart the router with */sys reboot*. After restarting, you should see a new tab called container in WinBox.
6. To activate the container feature, enter */system device-mode update container=yes* in the terminal. Then press the reset button of the router when asked so.

### Network setup
Open a terminal in winBox and run the following commands to setup the network stuff:
```bash
/interface bridge
add name=dockers
/ip address/
add address=172.17.0.1/24 interface=dockers network=172.17.0.0
add address=10.0.0.1/24 interface=wifi1 network=10.0.0.0
/interface veth
add name=veth1 address=172.17.0.2/24 gateway=172.17.0.1
/interface bridge port
add bridge=dockers interface=veth1
```

### Container setup
Normally, it's possible to simply build the image on a PC and then upload the .tar to the router via WinBox to create the container but it doesn't seem to work, so instead I published the image to dockerHub and then pulled the image from inside the router.
Check the makefile to create and publish the docker image, you will need an account on dockerHub.

The container has 2 volumes linked to the USB device. One to serve the html and the downloadable ressources, and the other to save uploaded files. This could be merged in the future to only have one mount point.

```bash
/container config
set registry-url=https://registry-1.docker.io
set tmpdir=usb1/pull
/container/mounts/
add dst=/mount_point src=usb1/mount name=mount
add dst=/home/admin/upload src=usb1/uploads name=uploads
/container
add remote-image=stevedevenes/hybridproctor-arm:latest interface=veth1 root-dir=usb1/hybridProctorContainer mounts=mount,uploads
/ip firewall/nat
add chain=dstnat action=dst-nat protocol=tcp dst-port=80 to-ports=80 to-addresses=172.17.0.2 # frontend
add chain=dstnat action=dst-nat protocol=tcp dst-port=2222 to-ports=22 to-addresses=172.17.0.2 # sftp to upload container
add chain=dstnat action=dst-nat protocol=tcp dst-port=3000 to-ports=3000 to-addresses=172.17.0.2 # upload route
```
Important: Don't forget to tick the "start on boot" option in container config.

Once done, you should be able to see the container with
```bash
/container/pr
```
and start it with 
```bash
/container start <container number>
```
You can also access it's shell with
```bash
/container shell <container number>
```

### Wifi config
```bash
/interface wifiwave2 security
add authentication-type=wpa3-psk name=hybridProctor disabled=no
/interface/wifiwave2/configuration/
add mode=ap name=hybridProctor security hybridProctor ssid=MThybridProctor
/interface/wifiwave2/
set [ find default-name=wifi1 ] configuration=hybridProctor disabled=no
set wifi1 datapath.client-isolation=yes
/ip pool
add name=pool0 ranges=10.0.0.10-10.0.0.100
/ip dhcp-server
add address-pool=pool0 interface=wifi1 name dhcp1 server-address=10.0.0.1
/ip/dhcp-server/network
add address=10.0.0.0/24 dns-server=10.0.0.1 gateway=10.0.0.1
```
Note: If the last command throw an error mentionning slave interface, go to Brige/Ports and disable wifi1 form the list.

### DNS config
Doesn't seems to work, at least for the wifi IP..
```bash
/ip/dns
set allow-remote-requests=yes
/ip/dns/static
add name=exam.local address=10.0.0.1
```

### Wifi password

This can be changed in **Wifi** menu, opening the wifi1 network pannel and then in Security.
For now it is set to **remote_exam**

### Useful resources
- https://help.mikrotik.com/docs/display/ROS/Container
- https://www.youtube.com/watch?v=8u1PVouAGnk
- adding sftp server: https://medium.com/@okHadi/setting-up-a-sftp-server-inside-an-existing-docker-container-method-1-3042871db69f

