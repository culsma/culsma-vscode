<p align="center">
  <img src="images/culsma-wordmark.png" alt="Culsma" width="720">
</p>

# Culsma Language Support

VS Code language support for [Culsma](https://github.com/culsma/culsma), a
domain-specific language for executable laboratory protocols.

## Features

- Syntax highlighting for canonical `.culs` source files
- Transitional file association for legacy `.lw` files
- Line and block comments, strings, booleans, quantities, and operators
- Current language keywords and reserved call forms
- Container and content constructors, including `plate(...)`
- Program constructors and core operations
- Container views and method calls such as `.contents`, `.structure.top`, and
  `.partition(...)`
- Bracket matching, automatic closing pairs, surrounding pairs, and comment
  toggling

This release provides syntax highlighting and editor language configuration.
Completion, diagnostics, formatting, and language-server features are not yet
included.

## Installation

Marketplace publication is pending. Until then, install a packaged `.vsix`
from VS Code using **Extensions: Install from VSIX...**.

## Development

```sh
npm install
npm test
npm run package
```

Press `F5` in VS Code and choose **Run Culsma Extension** to launch an Extension
Development Host with the local extension.

Maintainers should follow [PUBLISHING.md](PUBLISHING.md) for the release and
Marketplace upload checklist.

## Compatibility

The extension follows the current public Culsma source surface. `.culs` is the
canonical file extension; `.lw` remains associated during the LabWord-to-Culsma
transition.

The extension is declarative and supports virtual and untrusted workspaces. Its
official support target is VS Code; compatible editors may also install the
VSIX.

## Support

Report language-highlighting issues in the
[culsma-vscode issue tracker](https://github.com/culsma/culsma-vscode/issues).
Compiler, runtime, and language-semantics issues belong in the
[Culsma issue tracker](https://github.com/culsma/culsma/issues).

## License

The extension is licensed under the [Apache License 2.0](LICENSE).

The Culsma wordmark uses Orbitron-style brand typography. See
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and the bundled
[SIL Open Font License 1.1](third_party/licenses/Orbitron-OFL-1.1.txt).
