---
title: 'The Kenya Rule'
description: 'Why 85KB binaries and <10MB RAM are non-negotiable constraints'
pubDate: 2024-02-03
tags: ['systems', 'zig', 'performance', 'kenya']
draft: false
---

## Constraints as Philosophy

Most developers optimize for developer experience. We optimize for **user sovereignty**.

The Kenya Rule states:
- **Binary**: < 200KB for L1, < 10MB for full stack
- **Memory**: < 10MB runtime footprint
- **Storage**: Single-file embedded (libmdbx/SQLite)
- **Network**: Zero cloud dependencies

Why? Because constraints create antifragility.

---

## The 85KB Binary

A Janus L1 binary fits on a floppy disk. Literally. It can run on:

- Raspberry Pi Zero ($5)
- Old Android phones
- Microcontrollers with 512KB RAM
- Offline air-gapped systems

When your infrastructure fits everywhere, censorship becomes expensive. When it requires AWS, you're already compromised.

---

## Memory is Political

10MB RAM means:
- No garbage collection pauses
- No memory bloat from frameworks
- Predictable performance on constrained devices
- Runs on hardware that rich developers throw away

The developed world's trash is the developing world's infrastructure.

---

## Embedded Storage

No PostgreSQL. No MongoDB. No cloud databases.

Just **libmdbx** or **SQLite**: single-file, embedded, transactional.

Your data lives in files you own. Backups are `cp`. Migration is `rsync`. No ops team required.

---

## Kenya Compliance in Practice

```zig
// L0 Transport: 85KB
const l0 = @import("l0");

// L1 Identity: +120KB
const l1 = @import("l1");

// L4 Feed: +95KB  
const l4 = @import("l4");

// Total: ~300KB for full sovereign stack
```

Compare: A Node.js "hello world" with dependencies: **150MB**.

---

## Why This Matters

When systems are light, they proliferate. When they're heavy, they centralize.

Light systems can run on disposable hardware. Light systems can be mirrored thousands of times. Light systems resist capture because capture is more expensive than replacement.

**Kenya compliance isn't optimization. It's survival strategy.**

---

*The future belongs to systems that fit in the past.*

⚡️
