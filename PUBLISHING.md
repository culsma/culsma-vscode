# Publishing Culsma Language Support

## First-time Marketplace setup

1. Sign in to the [Visual Studio Marketplace publisher management
   page](https://marketplace.visualstudio.com/manage/publishers/) with the
   Microsoft account that will own the Culsma publisher.
2. Create or confirm the immutable publisher ID `culsma`.
3. If that ID is unavailable, update `publisher` in `package.json` before the
   first upload. The extension ID is `<publisher>.culsma`.
4. Accept the Marketplace publisher terms and complete any account details
   requested by Microsoft.

The GitHub organization name does not reserve a Visual Studio Marketplace
publisher ID.

## Pre-release checklist

1. Confirm that `package.json`, `CHANGELOG.md`, and the intended Git tag use the
   same `major.minor.patch` version.
2. Confirm that current Culsma keywords, units, constructors, programs, members,
   and methods are represented in the TextMate grammar and test fixture.
3. Run:

   ```sh
   npm ci
   npm test
   npm run list-package
   npm run package:pre-release
   ```

4. Install the generated VSIX in VS Code and visually inspect representative
   `.culs` files under at least one light and one dark theme.
5. Confirm that the VSIX contains `LICENSE`, `THIRD_PARTY_NOTICES.md`, the
   Orbitron OFL text, the PNG icon and wordmark, and no source-control metadata,
   tests, publishing notes, or development dependencies.
6. Push the reviewed commit and version tag to GitHub.
7. In the publisher management page, add a new extension or update the existing
   one by uploading the generated pre-release VSIX.

VS Code extension versions must remain plain `major.minor.patch`; pre-release
status is carried by the VSIX packaging/publishing flag, not a SemVer suffix.

## Post-upload checks

1. Confirm that the Marketplace page shows the Culsma icon, wordmark, repository,
   issue tracker, Apache-2.0 license, changelog, and Preview label.
2. Install the Marketplace build into a clean VS Code profile.
3. Confirm `.culs` language detection and representative highlighting for
   `plate(...)`, quantity units, comments, strings, mutation, container views,
   and `.partition(...)`.
4. Record the Marketplace URL in `README.md` after the first successful upload.

## Future automated publishing

Do not commit publisher credentials or access tokens. Prefer Microsoft Entra ID
workload identity for future automated Marketplace publishing rather than
introducing a new long-lived Azure DevOps global PAT.
