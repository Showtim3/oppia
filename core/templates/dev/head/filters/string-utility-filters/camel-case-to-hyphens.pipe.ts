// Copyright 2019 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview CamelCaseToHyphensPipe for Oppia
 */

import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from 'services/UtilsService.ts';

// Pipe that converts camelCase to hyphens
@Pipe({name: 'camelCaseToHyphens'})
export class CamelCaseToHyphensPipe implements PipeTransform {
  constructor(private utilsService: UtilsService) {}
  transform(input: any): any {
    if (this.utilsService.isString(input)) {
      let result = input.replace(/([a-z])?([A-Z])/g, '$1-$2').toLowerCase();
      if (result[0] === '-') {
        result = result.substring(1);
      }
      return result;
    } else {
      return input;
    }
  }
}
