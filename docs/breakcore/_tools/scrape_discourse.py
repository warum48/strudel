#!/usr/bin/env python3
"""Fetch Discourse topics into readable Markdown for offline AI consumption.

Usage: python3 scrape_discourse.py [--max-posts N]

Outputs docs/breakcore/threads/<host>-<id>-<slug>.md
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
import time
import ssl
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "threads"

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")

def _ssl_context() -> ssl.SSLContext:
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except Exception:
        return ssl.create_default_context()

# (host, topic_id, max_pages)  max_pages=None -> all
TOPICS = [
    # Renoise — trackers, the core breakcore community
    ("forum.renoise.com", 29927, None),
    ("forum.renoise.com", 20448, None),
    ("forum.renoise.com", 68373, None),
    ("forum.renoise.com", 73201, None),
    ("forum.renoise.com", 68093, 2),
    ("forum.renoise.com", 34022, None),
    ("forum.renoise.com", 44354, 2),
    ("forum.renoise.com", 78570, 2),
    ("forum.renoise.com", 21030, 2),
    ("forum.renoise.com", 17702, None),
    ("forum.renoise.com", 26084, 2),
    ("forum.renoise.com", 18985, None),
    # Elektronauts — hardware slicing / generative breaks
    ("www.elektronauts.com", 175570, None),
    ("www.elektronauts.com", 173927, None),
    ("www.elektronauts.com", 256454, None),
    ("www.elektronauts.com", 253094, 2),
    ("www.elektronauts.com", 226901, 2),
    ("www.elektronauts.com", 173811, 2),
    ("www.elektronauts.com", 184524, 2),
    ("www.elektronauts.com", 230650, 2),
    # lines — experimental / SuperCollider / livecoding
    ("llllllll.co", 5102, None),
    ("llllllll.co", 60185, 2),
    ("llllllll.co", 53301, 2),
    # IDMForums
    ("idmforums.com", 386, None),
    ("idmforums.com", 6643, None),
    ("idmforums.com", 2328, 2),
    ("idmforums.com", 8682, None),
    ("idmforums.com", 9278, 2),
]


def fetch_json(url: str) -> dict | None:
    req = urllib.request.Request(
        url, headers={"User-Agent": UA, "Accept": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=30, context=_ssl_context()) as r:
            return json.loads(r.read().decode("utf-8", "replace"))
    except (
        urllib.error.URLError,
        urllib.error.HTTPError,
        TimeoutError,
        json.JSONDecodeError,
    ) as e:
        print(f"  ! {url}: {e}", file=sys.stderr)
        return None


TAG_RE = re.compile(r"<[^>]+>")
MULTI_NL = re.compile(r"\n{3,}")
EMOJI_IMG = re.compile(r"<img[^>]*?class=\"emoji\"[^>]*alt=\"([^\"]*)\"[^>]*>", re.I)
IMG_TAG = re.compile(r"<img[^>]*>", re.I)
ANCHOR = re.compile(r"<a[^>]*href=\"([^\"]+)\"[^>]*>(.*?)</a>", re.I | re.S)


def html_to_text(raw: str) -> str:
    if not raw:
        return ""
    s = raw
    s = EMOJI_IMG.sub(lambda m: m.group(1), s)
    s = IMG_TAG.sub("[image]", s)
    s = ANCHOR.sub(
        lambda m: (
            m.group(2)
            if m.group(2).strip() == m.group(1)
            else f"{m.group(2)} ({m.group(1)})"
        ),
        s,
    )
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.I)
    s = re.sub(r"</(p|li|div|h\d|blockquote|pre)>", "\n", s, flags=re.I)
    s = TAG_RE.sub("", s)
    s = html.unescape(s)
    s = MULTI_NL.sub("\n\n", s)
    return "\n".join(line.rstrip() for line in s.splitlines()).strip()


def slugify(title: str, fallback: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return (s[:60] or fallback).strip("-")


def scrape(host: str, topic_id: int, max_pages: int | None) -> Path | None:
    base = f"https://{host}/t/{topic_id}.json"
    first = fetch_json(base)
    if not first:
        return None

    title = first.get("title") or f"topic-{topic_id}"
    posts = list(first.get("post_stream", {}).get("posts", []))
    total = first.get("posts_count", len(posts))
    page = 2
    while True:
        if max_pages and page > max_pages:
            break
        if page * 20 - 19 > total + 5:
            break
        chunk = fetch_json(f"{base}?page={page}")
        new = (chunk or {}).get("post_stream", {}).get("posts", []) if chunk else []
        if not new:
            break
        posts.extend(new)
        page += 1
        time.sleep(0.3)

    seen = set()
    uniq = []
    for p in posts:
        pid = p.get("id")
        if pid in seen:
            continue
        seen.add(pid)
        uniq.append(p)
    uniq.sort(key=lambda p: p.get("post_number") or 0)

    lines = [
        f"# {title}",
        "",
        f"- source: https://{host}/t/{topic_id}",
        f"- host: {host}",
        f"- posts in topic: {total}",
        f"- posts captured: {len(uniq)}",
        "",
        "> Auto-extracted for offline reading. Formatting is flattened; links kept as `text (url)`.",
        "",
        "---",
        "",
    ]
    for p in uniq:
        body = html_to_text(p.get("cooked") or "")
        if not body:
            continue
        who = p.get("username") or "?"
        date = (p.get("created_at") or "")[:10]
        num = p.get("post_number")
        lines.append(f"### #{num} · {who} · {date}")
        lines.append("")
        lines.append(body)
        lines.append("")
        lines.append("---")
        lines.append("")

    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{host.split('.')[0]}-{topic_id}-{slugify(title, str(topic_id))}.md"
    path.write_text("\n".join(lines), encoding="utf-8")
    print(f"  + {path.name} ({len(uniq)}/{total} posts)")
    return path


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--max-posts",
        type=int,
        default=0,
        help="unused global cap (per-topic pages are capped)",
    )
    ap.parse_args()

    ok = 0
    for host, tid, pages in TOPICS:
        print(f"{host} #{tid} …")
        if scrape(host, tid, pages):
            ok += 1
        time.sleep(0.5)
    print(f"\nDone: {ok}/{len(TOPICS)} topics")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
