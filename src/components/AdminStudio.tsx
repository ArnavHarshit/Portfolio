"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { marked } from "marked";

type Post = { slug: string; title: string; date: string; summary: string; tags: string[]; draft: boolean; content: string };
type Mode = "github" | "local" | "none";

const today = () => new Date().toISOString().slice(0, 10);
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const blank = (): Post => ({ slug: "", title: "", date: today(), summary: "", tags: [], draft: false, content: "" });

const field =
  "w-full rounded-xl border border-line-strong bg-fg/[0.03] px-4 py-2.5 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-cyan";

export default function AdminStudio() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [mode, setMode] = useState<Mode>("none");
  const [posts, setPosts] = useState<Post[]>([]);
  const [edit, setEdit] = useState<Post | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/posts", { cache: "no-store" });
    if (r.status === 401) return setAuthed(false);
    const j = await r.json();
    setAuthed(true);
    setMode(j.mode);
    setPosts(j.posts ?? []);
    if (j.error) setMsg({ kind: "err", text: j.error });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 5000);
  };

  if (authed === null) return <Shell><p className="font-mono text-sm text-muted">checking session…</p></Shell>;
  if (!authed) return <Login onDone={load} />;

  const save = async () => {
    if (!edit) return;
    setSaving(true);
    const r = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(edit),
    });
    const j = await r.json().catch(() => ({}));
    setSaving(false);
    if (!r.ok) return flash("err", j.error ?? "Save failed.");
    flash("ok", j.mode === "github" ? "Saved to GitHub. The live site updates in about a minute." : "Saved.");
    setIsNew(false);
    load();
  };

  const remove = async () => {
    if (!edit) return;
    const r = await fetch(`/api/admin/posts?slug=${encodeURIComponent(edit.slug)}`, { method: "DELETE" });
    const j = await r.json().catch(() => ({}));
    setConfirmDel(false);
    if (!r.ok) return flash("err", j.error ?? "Delete failed.");
    flash("ok", "Post deleted.");
    setEdit(null);
    load();
  };

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
  };

  return (
    <Shell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-cyan">
            <span className="text-muted">$</span> sudo blog --edit
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Blog studio</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/blog" target="_blank" className="rounded-xl border border-line-strong px-4 py-2 text-sm hover:border-cyan hover:text-cyan">
            View blog ↗
          </Link>
          <button onClick={logout} className="rounded-xl border border-line-strong px-4 py-2 text-sm hover:border-pink hover:text-pink">
            Sign out
          </button>
        </div>
      </div>

      <ModeBanner mode={mode} />
      {msg && (
        <p role="status" className={`mb-6 rounded-xl border px-4 py-3 font-mono text-sm ${msg.kind === "ok" ? "border-lime/40 text-lime" : "border-pink/40 text-pink"}`}>
          {msg.kind === "ok" ? "✓ " : "✗ "}
          {msg.text}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-2">
          <button
            onClick={() => {
              setEdit(blank());
              setIsNew(true);
              setTab("write");
              setConfirmDel(false);
            }}
            className="w-full rounded-xl bg-cyan px-4 py-2.5 font-semibold text-bg"
          >
            + New post
          </button>
          {posts.length === 0 && <p className="px-1 pt-2 text-sm text-muted">No posts yet.</p>}
          {posts.map((p) => (
            <button
              key={p.slug}
              onClick={() => {
                setEdit({ ...p });
                setIsNew(false);
                setTab("write");
                setConfirmDel(false);
              }}
              className={`card block w-full p-3 text-left transition-colors ${edit?.slug === p.slug && !isNew ? "border-cyan" : "hover:border-line-strong"}`}
            >
              <span className="block truncate font-medium">{p.title}</span>
              <span className="font-mono text-[11px] text-muted">
                {p.date} {p.draft && <span className="text-pink">· draft</span>}
              </span>
            </button>
          ))}
        </aside>

        {edit ? (
          <Editor
            post={edit}
            isNew={isNew}
            tab={tab}
            setTab={setTab}
            onChange={setEdit}
            onSave={save}
            saving={saving}
            confirmDel={confirmDel}
            setConfirmDel={setConfirmDel}
            onDelete={remove}
          />
        ) : (
          <div className="card grid min-h-[300px] place-items-center p-10 text-center text-muted">
            Pick a post on the left, or start a new one.
          </div>
        )}
      </div>
    </Shell>
  );
}

function Editor(props: {
  post: Post;
  isNew: boolean;
  tab: "write" | "preview";
  setTab: (t: "write" | "preview") => void;
  onChange: (p: Post) => void;
  onSave: () => void;
  saving: boolean;
  confirmDel: boolean;
  setConfirmDel: (b: boolean) => void;
  onDelete: () => void;
}) {
  const { post: p, isNew, onChange } = props;
  const set = <K extends keyof Post>(k: K, v: Post[K]) => onChange({ ...p, [k]: v });
  const html = useMemo(() => (props.tab === "preview" ? (marked.parse(p.content, { async: false, gfm: true }) as string) : ""), [p.content, props.tab]);

  return (
    <div className="card space-y-4 p-5 sm:p-6">
      <label className="block">
        <span className="mb-1.5 block text-sm text-muted">Title</span>
        <input
          value={p.title}
          onChange={(e) => onChange({ ...p, title: e.target.value, slug: isNew ? slugify(e.target.value) : p.slug })}
          placeholder="How I built a Raft KV store in C++"
          className={`${field} text-lg font-semibold`}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-[1fr_170px]">
        <label className="block">
          <span className="mb-1.5 block text-sm text-muted">URL slug {!isNew && "(fixed after publishing)"}</span>
          <input value={p.slug} disabled={!isNew} onChange={(e) => set("slug", slugify(e.target.value))} className={`${field} font-mono text-sm disabled:opacity-60`} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-muted">Date</span>
          <input type="date" value={p.date} onChange={(e) => set("date", e.target.value)} className={field} />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm text-muted">Summary (shown on the blog list)</span>
        <input value={p.summary} onChange={(e) => set("summary", e.target.value)} placeholder="One or two sentences" className={field} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm text-muted">Tags (comma-separated)</span>
        <input
          value={p.tags.join(", ")}
          onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
          placeholder="systems, raft, c++"
          className={field}
        />
      </label>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex gap-1 rounded-lg border border-line p-1 text-sm">
            {(["write", "preview"] as const).map((t) => (
              <button key={t} onClick={() => props.setTab(t)} className={`rounded-md px-3 py-1 capitalize ${props.tab === t ? "bg-fg/10 text-fg" : "text-muted"}`}>
                {t}
              </button>
            ))}
          </div>
          <span className="font-mono text-[11px] text-muted">Markdown supported</span>
        </div>
        {props.tab === "write" ? (
          <textarea
            value={p.content}
            onChange={(e) => set("content", e.target.value)}
            data-lenis-prevent
            rows={20}
            placeholder={"## Intro\n\nWrite anything here. **Markdown** works: lists, links, `code`, images…"}
            className={`${field} resize-y font-mono text-sm leading-relaxed`}
          />
        ) : (
          <div data-lenis-prevent className="prose-blog min-h-[400px] max-h-[70vh] overflow-y-auto rounded-xl border border-line p-5" dangerouslySetInnerHTML={{ __html: html || "<p>Nothing to preview yet.</p>" }} />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={p.draft} onChange={(e) => set("draft", e.target.checked)} className="h-4 w-4 accent-[var(--cyan)]" />
          Draft (hidden from visitors)
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {!isNew &&
            (props.confirmDel ? (
              <>
                <span className="text-sm text-pink">Delete for good?</span>
                <button onClick={props.onDelete} className="rounded-xl bg-pink px-4 py-2 text-sm font-semibold text-bg">Yes, delete</button>
                <button onClick={() => props.setConfirmDel(false)} className="rounded-xl border border-line-strong px-4 py-2 text-sm">Cancel</button>
              </>
            ) : (
              <button onClick={() => props.setConfirmDel(true)} className="rounded-xl border border-line-strong px-4 py-2 text-sm text-muted hover:border-pink hover:text-pink">
                Delete
              </button>
            ))}
          <button
            onClick={props.onSave}
            disabled={props.saving || !p.title.trim() || !p.slug}
            className="rounded-xl bg-cyan px-5 py-2 font-semibold text-bg shadow-[0_0_30px_var(--glow)] disabled:opacity-50"
          >
            {props.saving ? "Saving…" : p.draft ? "Save draft" : isNew ? "Publish" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ModeBanner({ mode }: { mode: Mode }) {
  const info = {
    github: { c: "border-lime/40 text-lime", t: "Connected to GitHub. Publishing commits the post to your repo and the site redeploys automatically." },
    local: { c: "border-cyan/40 text-cyan", t: "Local dev mode. Posts are saved to content/blog on this computer. Push them to GitHub to publish." },
    none: { c: "border-pink/40 text-pink", t: "Saving is not configured on this server. Set GITHUB_TOKEN and GITHUB_REPO to publish from here." },
  }[mode];
  return <p className={`mb-6 rounded-xl border px-4 py-3 text-sm ${info.c}`}>{info.t}</p>;
}

function Login({ onDone }: { onDone: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <Shell>
      <form
        className="card mx-auto mt-10 max-w-sm space-y-4 p-6 sm:p-8"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setErr("");
          const r = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: pw }),
          });
          setBusy(false);
          if (r.ok) onDone();
          else setErr((await r.json().catch(() => ({}))).error ?? "Login failed.");
        }}
      >
        <p className="font-mono text-sm text-cyan">
          <span className="text-muted">$</span> login owner
        </p>
        <h1 className="text-2xl font-bold">Owner access only</h1>
        <label className="block">
          <span className="mb-1.5 block text-sm text-muted">Password</span>
          <input type="password" autoComplete="current-password" required value={pw} onChange={(e) => setPw(e.target.value)} className={field} autoFocus />
        </label>
        {err && <p role="alert" className="font-mono text-xs text-pink">✗ {err}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-cyan px-4 py-2.5 font-semibold text-bg disabled:opacity-60">
          {busy ? "Checking…" : "Sign in"}
        </button>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="px-4 pb-24 pt-28 sm:px-6">
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
