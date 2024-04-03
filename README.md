# Open PagerDuty Maintenance Window

This action will open a PagerDuty Maintenance Window for the specified service for the specified amount of time.  It returns the window ID as an output so the window can be closed prior to the expiration if desired.

## Index <!-- omit in toc -->

- [Open PagerDuty Maintenance Window](#open-pagerduty-maintenance-window)
  - [Inputs](#inputs)
  - [Outputs](#outputs)
  - [Usage Examples](#usage-examples)
  - [Contributing](#contributing)
    - [Incrementing the Version](#incrementing-the-version)
    - [Source Code Changes](#source-code-changes)
    - [Recompiling Manually](#recompiling-manually)
    - [Updating the README.md](#updating-the-readmemd)
  - [Code of Conduct](#code-of-conduct)
  - [License](#license)

## Inputs

| Parameter           | Is Required | Description                                                    |
|---------------------|-------------|----------------------------------------------------------------|
| `pagerduty-api-key` | true        | The PagerDuty API Key that allows access to your services.     |
| `service-id`        | true        | A single PagerDuty Service ID                                  |
| `service-ids`       | true        | Comma delimited list of PagerDuty Service IDs                  |
| `description`       | false       | A description of the maintenance window. Defaults to empty.    |
| `minutes`           | false       | The number of minutes to open the window for.  Defaults to 20. |

## Outputs

| Parameter               | Description                                      |
|-------------------------|--------------------------------------------------|
| `maintenance-window-id` | The ID of the maintenance window that was opened |

## Usage Examples

```yml
  jobs:
    deploy-the-code:
    runs-on: [ubuntu-latest]
    steps:
      - uses: actions/checkout@v3

      - name: Open a window
        id: open-window
        # You may also reference just the major or major.minor version
        uses: im-open/open-pagerduty-maintenance-window@v1.3.2
        with:
          pagerduty-api-key: ${{secrets.PAGERDUTY_API_KEY}}
          description: 'Code deployment from GitHub Actions'
          minutes: 15
          service-id: 'P0ABCDE' 

          # Or multiple service IDs
          # service-ids: 'P2W124M,PQQA092,P652LHP,P91AMWC'
          
      - run: |
          echo "The maintenance window ID is: ${{ steps.open-window.outputs.maintenance-window-id }}"
          deploy-the-code.sh
```

## Contributing

When creating PRs, please review the following guidelines:

- [ ] The action code does not contain sensitive information.
- [ ] At least one of the commit messages contains the appropriate `+semver:` keywords listed under [Incrementing the Version] for major and minor increments.
- [ ] The action has been recompiled.  See [Recompiling Manually] for details.
- [ ] The README.md has been updated with the latest version of the action.  See [Updating the README.md] for details.

### Incrementing the Version

This repo uses [git-version-lite] in its workflows to examine commit messages to determine whether to perform a major, minor or patch increment on merge if [source code] changes have been made.  The following table provides the fragment that should be included in a commit message to active different increment strategies.

| Increment Type | Commit Message Fragment                     |
|----------------|---------------------------------------------|
| major          | +semver:breaking                            |
| major          | +semver:major                               |
| minor          | +semver:feature                             |
| minor          | +semver:minor                               |
| patch          | *default increment type, no comment needed* |

### Source Code Changes

The files and directories that are considered source code are listed in the `files-with-code` and `dirs-with-code` arguments in both the [build-and-review-pr] and [increment-version-on-merge] workflows.  

If a PR contains source code changes, the README.md should be updated with the latest action version and the action should be recompiled.  The [build-and-review-pr] workflow will ensure these steps are performed when they are required.  The workflow will provide instructions for completing these steps if the PR Author does not initially complete them.

If a PR consists solely of non-source code changes like changes to the `README.md` or workflows under `./.github/workflows`, version updates and recompiles do not need to be performed.

### Recompiling Manually

This command utilizes [esbuild] to bundle the action and its dependencies into a single file located in the `dist` folder.  If changes are made to the action's [source code], the action must be recompiled by running the following command:

```sh
# Installs dependencies and bundles the code
npm run build
```

### Updating the README.md

If changes are made to the action's [source code], the [usage examples] section of this file should be updated with the next version of the action.  Each instance of this action should be updated.  This helps users know what the latest tag is without having to navigate to the Tags page of the repository.  See [Incrementing the Version] for details on how to determine what the next version will be or consult the first workflow run for the PR which will also calculate the next version.

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/main/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2024, Extend Health, LLC. Code released under the [MIT license](LICENSE).

<!-- Links -->
[Incrementing the Version]: #incrementing-the-version
[Recompiling Manually]: #recompiling-manually
[Updating the README.md]: #updating-the-readmemd
[source code]: #source-code-changes
[usage examples]: #usage-examples
[build-and-review-pr]: ./.github/workflows/build-and-review-pr.yml
[increment-version-on-merge]: ./.github/workflows/increment-version-on-merge.yml
[esbuild]: https://esbuild.github.io/getting-started/#bundling-for-node
[git-version-lite]: https://github.com/im-open/git-version-lite
