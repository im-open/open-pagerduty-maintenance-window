# Open PagerDuty Maintenance Window

This action will open a PagerDuty Maintenance Window for the specified service(s) for the specified amount of time.  It returns the window ID as an output so the window can be closed prior to the expiration if desired.

## Inputs
| Parameter           | Is Required | Description                                                    |
| ------------------- | ----------- | -------------------------------------------------------------- |
| `pagerduty-api-key` | true        | The PagerDuty api key that allows access to your services.     |
| `description`       | true        | A description of the maintenance window.                       |
| `service-ids`       | true        | The number of minutes to open the window for.  Defaults to 20. |
| `minutes`           | false       | A string array of PagerDuty Service IDs.                       |

## Outputs
| Parameter               | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `maintenance-window-id` | The ID of the maintenance window that was opened |


## Example

```yml
  jobs:
    deploy-the-code:
    runs-on: [self-hosted, ubuntu-20.04]
    steps:
      - uses: actions/checkout@v2

      - name: Open a window
        id: open-window
        uses: im-open/open-pagerduty-maintenance-window@initial-action
        with:
          pagerduty-api-key: ${{secrets.PAGERDUTY_API_KEY}}
          decription: 'Code deployment from GitHub Actions'
          minutes: 15
          service-ids: [ 'P0ABCDE' ]
      - run: deploy-the-code.sh
```

## Recompiling

If changes are made to the action's code in this repository, or its dependencies, you will need to re-compile the
action.

```sh
# Installs dependencies and bundles the code
npm run build

# Bundle the code (if dependencies are already installed)
npm run bundle
```

These commands utilize [esbuild](https://esbuild.github.io/getting-started/#bundling-for-node) to bundle the action and
its dependencies into a single file located in the `dist` folder.

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/master/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2021, Extend Health, LLC. Code released under the [MIT license](LICENSE).
