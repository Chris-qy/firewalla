/*    Copyright 2016 Firewalla LLC
 *
 *    This program is free software: you can redistribute it and/or  modify
 *    it under the terms of the GNU Affero General Public License, version 3,
 *    as published by the Free Software Foundation.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
'use strict';

let log = require('../net2/logger.js')(__filename);

let Sensor = require('./Sensor.js').Sensor;

let sem = require('../sensor/SensorEventManager.js').getInstance();

let redis = require('redis');
let rclient = redis.createClient();
let sclient = redis.createClient();

let async = require('asyncawait/async');
let await = require('asyncawait/await');

let NetworkTool = require('../net2/NetworkTool');
let networkTool = new NetworkTool();

let Promise = require('bluebird');
Promise.promisifyAll(redis.RedisClient.prototype);

class InterfaceDiscoverSensor extends Sensor {
  constructor() {
    super();
  }

  run() {
    return async(() => {
      let list = await (networkTool.listInterfaces());
      let redisobjs = ['sys:network:info'];
      list.forEach((intf) => {
        redisobjs.push(intf.name);
        redisobjs.push(JSON.stringify(intf));
      })
      return rclient.hmsetAsync(redisobjs);
    })();
  }

}

module.exports = InterfaceDiscoverSensor;
