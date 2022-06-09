---
id: 853
title: 'Moving an ActiveDirectory Domain Controller to a New Server'
date: 2014-04-30T14:36:11+00:00
author: admin

guid: http://www.tech-notes.net/?p=853
permalink: /transfer-activedirectory-to-the-new-server/
image: /wp-content/uploads/2014/04/windows.active.directory.png
categories:
  - Active Directory
---
In this article, I want to describe the process of migrating an ActiveDirectory domain controller from Windows 2003 to Windows Server 2008.

Before you start, it is recommended that you add the new server to the domain. In general this is not essential but it will be much more convenient.

## Source server
Next, you need to make sure that the user, that we'll use for migration, is in the following groups:
  * Enterprise admins
  * Schema Admins
  * Domain Admins

Next, we take the support folder from the Windows 2008 installation disk, find the adprep folder in it and go to it on the source server. When migrating from 2003 to 2008, you need to take adprep from the 2008th Windows.

Preparing everything for migration:
```bash
adprep32.exe /forestprep
adprep32.exe /domainprep /gpprep
```

If the source server has an x64 operating system, then we use the following commands. The first one can take quite a long time:
```bash
adprep.exe /forestprep
adprep.exe /domainprep /gpprep
```

[<img class="aligncenter size-full wp-image-871" src="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104550.png" alt="Screenshot from 2014-04-24 10:45:50" width="681" height="78" srcset="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104550.png 681w, /wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104550-300x34.png 300w, /wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104550-660x75.png 660w" sizes="(max-width: 681px) 100vw, 681px" />](/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104550.png)

It is also recommended to run the following command. Even if you don't intend to use Read Only Domain Controllers (RODCs) on your network it will remove unnecessary error messages from the event log.
```bash
adprep /rodcprep
```

## Target server
Run in the console
```bash
dcpromo
```

This opens the AD installation window. Click `Next`.
[<img class="aligncenter size-full wp-image-872" src="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104755.png" alt="Screenshot from 2014-04-24 10:47:55" width="497" height="470" srcset="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104755.png 497w, /wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104755-300x283.png 300w" sizes="(max-width: 497px) 100vw, 497px" />](/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104755.png)

I was adding a controller to an already existing forest so I chose the appropriate item.
[<img class="aligncenter size-full wp-image-873" src="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104822.png" alt="Screenshot from 2014-04-24 10:48:22" width="501" height="473" srcset="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104822.png 501w, /wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104822-300x283.png 300w" sizes="(max-width: 501px) 100vw, 501px" />](/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-104822.png)

Next the installer will offer the domain name and username from which the service is installed.
[<img class="aligncenter size-full wp-image-874" src="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-105001.png" alt="Screenshot from 2014-04-24 10:50:01" width="496" height="472" srcset="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-105001.png 496w, /wp-content/uploads/2014/04/Screenshot-from-2014-04-24-105001-300x285.png 300w" sizes="(max-width: 496px) 100vw, 496px" />](/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-105001.png)

Next you will be able to select the site to which the controller should be added. The installation manager itself will suggest this based on the ip address depending on which site the subnet belongs to.
[<img class="aligncenter size-full wp-image-875" src="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-113101.png" alt="Screenshot from 2014-04-24 11:31:01" width="499" height="473" srcset="/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-113101.png 499w, /wp-content/uploads/2014/04/Screenshot-from-2014-04-24-113101-300x284.png 300w" sizes="(max-width: 499px) 100vw, 499px" />](/wp-content/uploads/2014/04/Screenshot-from-2014-04-24-113101.png)

Next-Next-Next

We wait for the wizard to finish and restart the new domain controller.

It is left to transfer the `FSMO` roles to the new server. To do this, launch a console called `Active Directory Schema`. To do this, go to the Start menu -> Run. In the window that appears, enter `mmc.exe` and click `OK`.

In the window that appears, from the File menu, select the Add/Remove Snap-In item:
[<img class="aligncenter size-full wp-image-876" src="/wp-content/uploads/2014/04/scheme3a.png" alt="scheme3a" width="640" height="489" srcset="/wp-content/uploads/2014/04/scheme3a.png 640w, /wp-content/uploads/2014/04/scheme3a-300x229.png 300w" sizes="(max-width: 640px) 100vw, 640px" />](/wp-content/uploads/2014/04/scheme3a.png)

From the list in the left column, select `Active Directory Schema`, press the `Add->` button, then `OK`.
[<img class="aligncenter size-full wp-image-877" src="/wp-content/uploads/2014/04/mmc.png" alt="mmc" width="640" height="460" srcset="/wp-content/uploads/2014/04/mmc.png 640w, /wp-content/uploads/2014/04/mmc-300x215.png 300w" sizes="(max-width: 640px) 100vw, 640px" />](/wp-content/uploads/2014/04/mmc.png)

As a result of such gestures the `Active Directory Schema` element will appear in the left column of the console. Right click and select `Change Active Directory Domain Controller`.

In the window that appears select the domain controller on which the FSMO roles are spinning:
[<img class="aligncenter size-full wp-image-878" src="/wp-content/uploads/2014/04/schema2.png" alt="schema2" width="631" height="425" srcset="/wp-content/uploads/2014/04/schema2.png 631w, /wp-content/uploads/2014/04/schema2-300x202.png 300w" sizes="(max-width: 631px) 100vw, 631px" />](/wp-content/uploads/2014/04/schema2.png)

It's hard to go wrong with the choice. If you select a Domain Controller that does not manage FSMO, you will get this error:
[<img class="aligncenter size-full wp-image-879" src="/wp-content/uploads/2014/04/schema3.png" alt="schema3" width="400" height="160" srcset="/wp-content/uploads/2014/04/schema3.png 400w, /wp-content/uploads/2014/04/schema3-300x120.png 300w" sizes="(max-width: 400px) 100vw, 400px" />](/wp-content/uploads/2014/04/schema3.png)

We are now connected to the owner of the master role. Right click on `Active Directory Schema` and select `Operations Master`:
[<img class="aligncenter size-full wp-image-880" src="/wp-content/uploads/2014/04/scheme4a.png" alt="scheme4a" width="640" height="491" srcset="/wp-content/uploads/2014/04/scheme4a.png 640w, /wp-content/uploads/2014/04/scheme4a-300x230.png 300w" sizes="(max-width: 640px) 100vw, 640px" />](/wp-content/uploads/2014/04/scheme4a.png)

In the window, select where to transfer FSMO and click OK.

To transfer the RID, PDC and Infrastructure Master roles, run `Active Directory Users and Computers` (`Start` -> `Control Panel` -> `Administrative Tools` -> `Admin tools`). Further, by analogy with the previous step, we connect to the source server. Right-click on `Active Directory Users and Computers` and select `Operations Master`. In the window that appears, go to the desired RID, PDC or Infrastructure tab and select a new server for the role.

In order to transfer the DNS role, you need to run the `Active Directory Domains and Trusts` console. Further, by analogy with the previous step, we connect to the source server. Right-click on `Active Directory Domains and Trusts` and select `Operations Master`. In the window that appears, select a new server for the role.

External links:
* [support.microsoft.com](http://support.microsoft.com/kb/255690)
* [techunboxed.com](http://www.techunboxed.com/2012/07/how-to-transfer-fsmo-roles-in-windows.html)
