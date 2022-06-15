---
title: More examples with terraform for and for_each loops
date: 2022-01-06T00:00:00+00:00
author: Yaroslav Yarmoshyk
attitude_sidebarlayout:
  - default
categories:
  - Terraform
tags:
  - terraform
  - for_each
---
Loops in terraform is not something new. There is a bunch of articles with examples in the internet. However I had a number of cases when I could not find the example of my particular case so "d like to add my own article with my own examples.

### Loop over list.
Let's sasy we have a list and want to build the dynamic block for some resources using the list of values. Hoever for_each is applicable to the map or set only.
If you are going to ship the list to foreach, than terraform will fail with the following error
```bash
is a tuple with X elements
```

Convert your list `tolist()` to fix it. Here is an example where I build the dynamic block of rules in gcp firewall using the list of protocols:
```terraform
locals {
    protocols = tolist(["tcp","udp"])
}

resource "google_compute_firewall" "foo" {
  name      = "example"
  network   = "default"
  dynamic "allow" {
    for_each = local.protocols
    content {
      protocol = allow.value
    }
  }
  source_ranges = "0.0.0.0/0"
}
```

Here is another example with ports
```terraform
locals {
    ports = tolist(["22","80","443"])
}

resource "google_compute_firewall" "foo" {
  name      = "example"
  network   = "default"

  allow {
    protocol = var.gcp_firewall_protocol
    ports    = [for port in local.ports : port.value]
  }

  source_ranges = "0.0.0.0/0"
}
```
<center>
  <div id="gads">
  </div>
</center>

More complicated example. Here I loop over the map of string values and build dynamic block:
```terraform
locals {
  firewall_rules = {
    ssh = {
      port = "22",
      protocol = "tcp"
    },
    http = {
      port = "80",
      protocol = "tcp"
    },
    https = {
      port = "443",
      protocol = "tcp"
    },
    dns = {
      port = "53",
      protocol = "udp"
    }
  }
}

resource "google_compute_firewall" "foo" {
  name      = "example"
  network   = "default"

  dynamic "allow" {
    for_each = local.firewall_rules
    content {
      protocol = allow.value.protocol
      ports    = [allow.value.port]
    }
  }

  source_ranges = ["0.0.0.0/0"]
}
```
<center>
  <div id="gads">
  </div>
</center>

And even more complicated example. Here I loop over the map of strings and lists and build the dinamic block:
```terraform
locals {
  firewall_rules = {
    tcp = {
      ports = ["22", "80", "443"]
      protocol = "tcp"
    },
    udp = {
      ports = ["53"],
      protocol = "udp"
    }
  }
}

resource "google_compute_firewall" "foo" {
  name      = "example"
  network   = "default"

  dynamic "allow" {
    for_each = local.firewall_rules
    content {
      protocol = allow.value.protocol
      ports    = [for port in allow.value.ports : port]
    }
  }

  source_ranges = ["0.0.0.0/0"]
}
```

External links:
* ["HashiCorp Terraform 0.12 Preview: For and For-Each"](https://www.hashicorp.com/blog/hashicorp-terraform-0-12-preview-for-and-for-each)
* ["Terraform For Each Examples – How to use for_each | Devops Junction"](https://www.middlewareinventory.com/blog/terraform-for-each-examples/)