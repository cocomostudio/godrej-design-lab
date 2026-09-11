---
status: archived
archived_on: 11/09/2026
reason: >
  This is not how the repository is synced to production any more. The procedure
  below — building repo.tgz and store.tgz locally, SCP'ing them, and installing
  offline from a pre-fetched pnpm store — is no longer followed, and nothing in
  this repository should be read as describing the current deployment.
read_it_as: >
  A record of how deployment used to work, kept for history. Not a source of
  truth about the hosts, the service account, the checkout layout, or the
  architecture they run on.
---

Make sure you have this in package.json under `pnpm`:


```json
		"supportedArchitectures": {
			"os":  ["linux"],
			"cpu": ["arm64"]
		},
```


# In Local

First

```
$ git clone git@github.com:cocomostudio/godrej-design-lab.git
$ git checkout deploythis
$ pnpm store prune     
$ STORE=$(pnpm store path)
$ pnpm fetch -r
```

Then

```
$ COPYFILE_DISABLE=1 tar -C "$STORE" --no-mac-metadata --no-xattrs -czf store.tgz .


$ COPYFILE_DISABLE=1 tar --exclude='.git' --exclude='node_modules' --exclude='.DS_Store' --exclude='._*' \
    --no-mac-metadata --no-xattrs \
    -czf repo.tgz .
```

SCP them.

# In EC2

```
[cocomo@ip-172-19-137-24 ~]$ tar -xzf repo.tgz
[cocomo@ip-172-19-137-24 ~]$ rm repo.tgz 
[cocomo@ip-172-19-137-24 ~]$ mv godrej-design-lab repo
[cocomo@ip-172-19-137-24 ~]$ cd repo/
[cocomo@ip-172-19-137-24 repo]$ rm -rf "$(pnpm store path)"/*
[cocomo@ip-172-19-137-24 repo]$ tar -xzf store.tgz -C "$(pnpm store path)"

```

Then

```
pnpm install -r --offline --frozen-lockfile
pnpm -F cms run build
```