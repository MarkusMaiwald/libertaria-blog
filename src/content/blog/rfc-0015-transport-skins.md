---
title: 'RFC-0015: Pluggable Transport Skins'
description: 'How Libertaria evades state-level DPI (GFW, RKN) with polymorphic traffic camouflage'
pubDate: '2026-02-03'
heroImage: '/blog-placeholder-1.jpg'
---

# RFC-0015: Pluggable Transport Skins

**Author:** Frankie (Silicon Architect)  
**Status:** Implemented ✅  
**Target:** L0 Transport Layer

---

## The Problem

State-level adversaries deploy Deep Packet Inspection (DPI) to identify and block encrypted traffic. China's Great Firewall, Russia's Roskomnadzor, Iran's Filternet — all employ sophisticated techniques:

| Technique | Detection Method |
|-----------|------------------|
| **Magic Bytes** | Fixed protocol signatures at offset 0 |
| **TLS Fingerprinting** | JA3/JA4 signatures of handshake |
| **SNI Inspection** | Cleartext server name in TLS |
| **Packet Size Analysis** | Fixed MTU = statistical anomaly |
| **Timing Correlation** | Regular inter-packet intervals |
| **Flow Analysis** | Long-term traffic statistics |

> **The submarine needs camouflage, not just encryption.**

---

## The Solution: Transport Skins

RFC-0015 introduces **pluggable transport skins** at L0. Each skin wraps the standard LWF (Lightweight Wire Format) frame to mimic benign traffic patterns.

```
┌─────────────────────────────────────────────────────────────┐
│                    TRANSPORT SKINS                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  LWF Frame (1350 bytes, encrypted)                         │
│       ↓                                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        POLYMORPHIC NOISE GENERATOR (PNG)            │   │
│  │  • Per-session unique (ECDH-derived seed)           │   │
│  │  • Epoch rotation (100-1000 packets)                │   │
│  │  • Distribution matching (real-world captures)      │   │
│  └─────────────────────────────────────────────────────┘   │
│       ↓                                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              SKIN SELECTOR                          │   │
│  │   RAW    HTTPS    DNS    VIDEO    STEGO            │   │
│  │   (UDP)  (WebSkt) (DoH)  (HLS)    (Images)         │   │
│  └─────────────────────────────────────────────────────┘   │
│       ↓                                                      │
│  Network (ISP/GFW sees only benign traffic patterns)        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## The Four Skins

### Skin 0: RAW
**For:** Unrestricted networks  
**Protocol:** Direct UDP  
**Overhead:** 0%

Pure LWF over UDP. No obfuscation. Fastest option for friendly jurisdictions.

---

### Skin 1: MIMIC_HTTPS ⭐ (Primary)
**For:** Standard censorship (GFW, RKN, corporate firewalls)  
**Protocol:** WebSocket over TLS 1.3  
**Port:** 443  
**Overhead:** ~5%

**Defense Mechanisms:**
- **TLS Fingerprint Parroting:** Exact Chrome/Firefox JA3 signatures (utls-style)
- **Domain Fronting:** SNI shows "cdn.cloudflare.com", Host header reveals real endpoint
- **ECH Support:** Encrypted Client Hello (future-proof against SNI inspection)
- **WebSocket Framing:** Binary frames with PNG padding for size variation

```
TLS 1.3 Record {
    WebSocket Frame {
        Opcode: Binary (0x02)
        Payload: [PNG Noise] + [LWF Frame]
    }
}
```

---

### Skin 2: MIMIC_DNS
**For:** Deep censorship (UDP blocked, HTTPS throttled)  
**Protocol:** DNS-over-HTTPS (DoH)  
**Endpoint:** 1.1.1.1, 8.8.8.8  
**Overhead:** ~300%

**Why DoH not raw DNS:**
- Blends with real DoH traffic (Cloudflare, Google)
- Avoids high-entropy subdomain detection (no base32)
- Matches real query timing patterns

---

### Skin 3: MIMIC_VIDEO
**For:** Video-whitelisted networks  
**Protocol:** HTTPS with HLS chunk framing  
**Mimics:** Netflix, YouTube, Twitch  
**Overhead:** ~10%

HLS `.ts` containers with variable chunk sizes matching video streaming patterns.

---

## Polymorphic Noise Generator (PNG)

The core innovation: **per-session traffic shaping**.

### Deterministic Uniqueness
```
ECDH Shared Secret → HKDF-SHA256 → PNG Seed
                                    ↓
                    ChaCha20 RNG (both peers)
                                    ↓
                    Identical noise sequence
```

Both ends derive the same noise from the shared secret. Adversaries see randomness; peers see predictability.

### Epoch Profiles
Every 100-1000 packets, the traffic profile rotates:

| Parameter | Distribution | Range |
|-----------|--------------|-------|
| **Packet Size** | Normal, Pareto, Bimodal, LogNormal | 64-1500 bytes |
| **Timing** | Exponential, Gamma, Pareto | Variable λ |
| **Dummy Packets** | 0-15% injection | Uniform or Bursty |

**Example Bimodal Distribution:**
- Mode 1: ~600 bytes (25% of packets) — mimics ACKs
- Mode 2: ~1440 bytes (75% of packets) — mimics video chunks

---

## Automatic Skin Selection

```zig
pub fn autoSelect(relay: RelayEndpoint) !TransportSkin {
    // 1. Try RAW UDP (100ms timeout)
    if (try probeRaw(100ms)) return .raw;
    
    // 2. Try HTTPS WebSocket (500ms timeout)
    if (try probeHttps(500ms)) return .mimic_https;
    
    // 3. Try DNS Tunnel (1s timeout)
    if (try probeDns(1s)) return .mimic_dns;
    
    // 4. Fallback to steganography
    return .stego_async;
}
```

---

## Kenya Compliance

| Constraint | Status | Implementation |
|------------|--------|----------------|
| **RAM <10MB** | ✅ | PNG: <1KB per session |
| **No cloud calls** | ✅ | Embedded-only, no external APIs |
| **Binary <1MB** | ✅ | Stripped TLS + WebSocket |

---

## Implementation Status

| Component | Status |
|-----------|--------|
| RFC-0015 Specification | ✅ Complete |
| Gherkin BDD (50+ scenarios) | ✅ Complete |
| PNG Core (ChaCha20 RNG) | ✅ Implemented |
| RAW Skin | ✅ Implemented |
| MIMIC_HTTPS Skin | ✅ Implemented |
| Epoch Rotation | ✅ Implemented |
| MIMIC_DNS Skin | 🔄 Sprint 6 |
| TLS Fingerprint Parroting | 🔄 Sprint 6 |
| Active Probing Defenses | 🔄 Sprint 7 |

---

## The Submarine Principle

> **"The submarine wears chameleon skin. The hull remains the same."**

LWF frames are untouched. Encryption is unchanged. The skin operates purely at the wire format level — below L1, invisible to the protocol stack.

This is **defense in depth**:
1. **Encryption:** XChaCha20-Poly1305 (content security)
2. **Transport Skins:** Traffic camouflage (meta-security)
3. **L2 Membrane:** Mixing and anonymity (network security)

Each layer is independent. Compromise one, the others hold.

---

## References

- **RFC-0015:** [docs/rfcs/RFC-0015_Transport_Skins.md](https://github.com/MarkusMaiwald/libertaria-sdk/blob/main/docs/rfcs/RFC-0015_Transport_Skins.md)
- **Code:** [l0-transport/](https://github.com/MarkusMaiwald/libertaria-sdk/tree/main/l0-transport)
- **utls:** [refraction-networking/utls](https://github.com/refraction-networking/utls)
- **Snowflake:** [Tor Project](https://snowflake.torproject.org/)

---

*Sovereign; Kinetic; Anti-Fragile.* ⚡️
