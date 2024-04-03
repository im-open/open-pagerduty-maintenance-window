const core = require('@actions/core');
const add = require('date-fns/add');
const format = require('date-fns/format');
const axios = require('axios');

const requiredArgOptions = {
  required: true
};

const pagerdutyApiKey = core.getInput('pagerduty-api-key', requiredArgOptions);
const serviceIdInput = core.getInput('service-id');
const serviceIdsInput = core.getInput('service-ids');
const description = core.getInput('description');
const minutes = parseInt(core.getInput('minutes'));

if (!serviceIdInput && !serviceIdsInput) {
  core.setFailed('Missing service-id or service-ids argument.  One of the args must be provided');
  return;
}

console.log('hi!');
core.info(`Opening PagerDuty window for ${description}`);

try {
  const startDate = new Date();
  const endDate = add(startDate, {
    minutes: minutes
  });

  const start_time = `${format(startDate, 'yyyy-MM-dd')}T${format(startDate, 'HH:mm:sszzzz')}Z`;
  const end_time = `${format(endDate, 'yyyy-MM-dd')}T${format(endDate, 'HH:mm:sszzzz')}Z`;
  core.info(`Window will be open from ${start_time} -> ${end_time}`);

  const serviceIds = [serviceIdInput]
    .concat(serviceIdsInput ? serviceIdsInput.split(',') : [])
    .filter(serviceId => serviceId && serviceId.trim())
    .map(serviceId => ({
      id: serviceId.trim(),
      type: 'service'
    }));

  if (serviceIds.length == 0) {
    core.setFailed('Missing service-ids');
    return;
  }

  core.info(`Service IDs ${JSON.stringify(serviceIds.map(value => value.id))}`);

  const maintenanceWindow = {
    maintenance_window: {
      type: 'maintenance_window',
      start_time,
      end_time,
      description,
      services: serviceIds
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
      core.setFailed(
        `An error occurred making the request to open the PagerDuty maintenance window: ${error.message}`
      );
      return;
    });
} catch (error) {
  core.setFailed(`An error occurred while opening PagerDuty maintenance window: ${error.message}`);
}
