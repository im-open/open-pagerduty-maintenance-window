import { getInput, setFailed, info, setOutput } from '@actions/core';
import add from 'date-fns/add';
import format from 'date-fns/format';
import axios from 'axios';

async function run() {
  const requiredArgOptions = {
    required: true
  };

  const pagerdutyApiKey = getInput('pagerduty-api-key', requiredArgOptions);
  const serviceIdInput = getInput('service-id');
  const serviceIdsInput = getInput('service-ids');
  const description = getInput('description');
  const minutes = parseInt(getInput('minutes'));

  if (!serviceIdInput && !serviceIdsInput) {
    setFailed('Missing service-id or service-ids argument.  One of the args must be provided');
    return;
  }

  info(`Opening PagerDuty window for ${description}`);

  try {
    const startDate = new Date();
    const endDate = add(startDate, {
      minutes: minutes
    });

    const start_time = `${format(startDate, 'yyyy-MM-dd')}T${format(startDate, 'HH:mm:sszzzz')}Z`;
    const end_time = `${format(endDate, 'yyyy-MM-dd')}T${format(endDate, 'HH:mm:sszzzz')}Z`;
    info(`Window will be open from ${start_time} -> ${end_time}`);

    const serviceIds = [serviceIdInput]
      .concat(serviceIdsInput ? serviceIdsInput.split(',') : [])
      .filter(serviceId => serviceId && serviceId.trim())
      .map(serviceId => ({
        id: serviceId.trim(),
        type: 'service'
      }));

    if (serviceIds.length == 0) {
      setFailed('Missing service-ids');
      return;
    }

    info(`Service IDs ${JSON.stringify(serviceIds.map(value => value.id))}`);

    const maintenanceWindow = {
      maintenance_window: {
        type: 'maintenance_window',
        start_time,
        end_time,
        description,
        services: serviceIds
      }
    };

    await axios({
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
        info('The maintenance window was successfully set:');
        info(`${JSON.stringify(response.data.maintenance_window)}`);
        setOutput('maintenance-window-id', response.data.maintenance_window.id);
      })
      .catch(function (error) {
        setFailed(
          `An error occurred making the request to open the PagerDuty maintenance window: ${error.message}`
        );
        return;
      });
  } catch (error) {
    setFailed(`An error occurred while opening PagerDuty maintenance window: ${error.message}`);
  }
}

run();
