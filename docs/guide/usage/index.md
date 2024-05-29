---
tags:
- usage_guide
---

# Usage Guide

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