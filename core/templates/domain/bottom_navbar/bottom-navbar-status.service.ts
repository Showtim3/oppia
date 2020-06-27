// Copyright 2020 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Service for maintaining the open/closed status of the
 * bottom bar..
 */

import { downgradeInjectable } from '@angular/upgrade/static';
import { Injectable } from '@angular/core';
import { DeviceInfoService } from 'services/contextual/device-info.service';


@Injectable({
  providedIn: 'root'
})
export class BottomNavbarStatusService {
  constructor(private deviceInfoService: DeviceInfoService) {}
    private bottomNavbarIsEnabled: boolean = false;

    markBottomNavbarStatus(status: boolean) {
      this.bottomNavbarIsEnabled = status;
    }

    getBottomNavbarStatus() {
      return (
        this.bottomNavbarIsEnabled && this.deviceInfoService.isMobileDevice());
    }
}

angular.module('oppia').factory(
  'BottomNavbarStatusService', downgradeInjectable(BottomNavbarStatusService));
