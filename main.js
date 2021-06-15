const core = require('@actions/core');
const add = require('date-fns/add');
const format = require('date-fns/format');
const axios = require('axios');

const pagerdutyApiKey = core.getInput('pagerduty-api-key');
const description = core.getInput('description');
const minutes = parseInt(core.getInput('minutes'));
const serviceIdsInput = core.getInput('service-ids');
const serviceIds = JSON.parse(serviceIdsInput);

core.info(`Opening PagerDuty window for ${description}`);

try {
  const startDate = new Date();
  const endDate = add(startDate, {
    minutes: minutes
  });

  const start_time = `${format(startDate, 'yyyy-MM-dd')}T${format(startDate, 'HH:mm:sszzzz')}Z`;
  const end_time = `${format(endDate, 'yyyy-MM-dd')}T${format(endDate, 'HH:mm:sszzzz')}Z`;
  core.info(`Window will be open from ${start_time} -> ${end_time}`);

  const maintenanceWindow = {
    maintenance_window: {
      type: 'maintenance_window',
      start_time,
      end_time,
      description,
      services: serviceIds.map(id => {
        return {
          id,
          type: 'service'
        };
      })
    }
  };

  axios({
    method: 'post',
    url: 'https://api.pagerduty.com/maintenance_windows',
    headers: {
      'content-type': 'application/json',
      authorization: `Token token=${pagerdutyApiKey}`,
      accept: 'application/vnd.pagerduty+json;version=2'
    },
    data: JSON.stringify(maintenanceWindow)
  })
    .then(function (response) {
      core.info('The maintenance window was successfully set:');
      core.info(`${JSON.stringify(response.data.maintenance_window)}`);
      core.setOutput('maintenance-window-id', response.data.maintenance_window.id);
    })
    .catch(function (error) {
      core.setFailed(`An error occurred opening the PagerDuty maintenance window: ${error}`);
      return;
    });
} catch (error) {
  core.setFailed(`An error occurred while opening PagerDuty window: ${error}`);
}
