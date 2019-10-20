// Copyright 2014 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Service for HTML serialization and escaping.
 */

import { Injectable } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';
import { LoggerService } from './LoggerService';

@Injectable({
  providedIn: 'root'
})
export class HtmlEscaperService {
  constructor(private loggerService: LoggerService) {}

  objToEscapedJson(obj) {
    return this.unescapedStrToEscapedStr(JSON.stringify(obj));
  }

  escapedJsonToObj(json) {
    if (!json) {
      this.loggerService.error('Empty string was passed to JSON decoder.');
      return '';
    }
    return JSON.parse(this.escapedStrToUnescapedStr(json));
  }

  unescapedStrToEscapedStr(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  escapedStrToUnescapedStr(value) {
    return String(value)
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, '\'')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
  }
}

angular.module('oppia').factory(
  'HtmlEscaperService', downgradeInjectable(HtmlEscaperService));

