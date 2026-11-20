# Vendored browser modules

`strudel.js` is a local esbuild bundle of the exact packages the panel uses
(same instances of core/mini/webaudio/draw, so patterns and the editor agree):

- @strudel/core 1.2.6, @strudel/mini 1.2.6, @strudel/tonal 1.2.6
- @strudel/webaudio 1.3.0, @strudel/transpiler 1.2.6, @strudel/draw 1.2.6
- @strudel/codemirror 1.3.0 (+ CodeMirror/Lezer deps)

Rebuild: `tools/build-vendor.sh`.

Licenses: AGPL-3.0-or-later (upstream `uzu/strudel`); CodeMirror/Lezer packages
keep their own MIT licenses. Source is the published npm packages listed above.
